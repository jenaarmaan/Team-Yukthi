import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken
} from 'firebase/auth';
import { CandidateType } from '../types/recruitment';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const clientAuth = getAuth(app);

export interface CandidateRegistrationInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  candidateType: CandidateType;
  currentLocation: string;
  preferredLocations: string[];
  degree: string;
  branch: string;
  cgpa: number;
  skills: string[];
}

export interface AuthSessionUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'hr_admin' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer' | 'candidate';
  idToken: string;
}

type AuthListener = (user: AuthSessionUser | null) => void;

class ClientAuthService {
  private listeners: Set<AuthListener> = new Set();
  private currentUser: AuthSessionUser | null = null;
  private isInitialized = false;

  constructor() {
    // Listen for genuine Firebase Authentication state changes
    onAuthStateChanged(clientAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const idToken = await getIdToken(firebaseUser, false);
          // Fetch user profile and role from backend
          const meResponse = await fetch('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${idToken}` }
          });

          if (meResponse.ok) {
            const meData = await meResponse.json();
            this.currentUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || meData.data?.displayName || '',
              role: meData.data?.role || 'candidate',
              idToken
            };
          } else {
            this.currentUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'candidate',
              idToken
            };
          }
        } catch {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }

      this.isInitialized = true;
      this.notifyListeners();
    });
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    if (this.isInitialized) {
      listener(this.currentUser);
    }
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public getCurrentUser(): AuthSessionUser | null {
    return this.currentUser;
  }

  public async getValidIdToken(forceRefresh = false): Promise<string | null> {
    if (clientAuth.currentUser) {
      return getIdToken(clientAuth.currentUser, forceRefresh);
    }
    return this.currentUser?.idToken || null;
  }

  /**
   * Switches or synchronizes the active authenticated session with the backend.
   * Ensures that all backend API requests carry the authoritative Bearer JWT.
   */
  public async syncSession(opts: { personaKey?: string; adminRole?: string; uid?: string }): Promise<AuthSessionUser | null> {
    try {
      const res = await fetch('/api/v1/auth/demo-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.currentUser = {
            uid: json.data.user.uid,
            email: json.data.user.email,
            displayName: json.data.user.displayName,
            role: json.data.user.role,
            idToken: json.data.idToken
          };
          this.notifyListeners();
          return this.currentUser;
        }
      }
    } catch {
      // ignore
    }
    return this.currentUser;
  }

  /**
   * Registers a candidate via the backend API (which creates the Auth record + Firestore docs)
   * and subsequently signs the client into Firebase Authentication.
   */
  public async register(input: CandidateRegistrationInput): Promise<AuthSessionUser> {
    const res = await fetch('/api/v1/auth/register-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Candidate registration failed.');
    }

    // Sign in immediately with newly created credentials
    return this.login(input.email, input.password);
  }

  /**
   * Signs in a user using Firebase Authentication.
   */
  public async login(email: string, password: string): Promise<AuthSessionUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
      const idToken = await getIdToken(userCredential.user, true);

      // Verify token and fetch role from backend
      const meRes = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const meData = await meRes.json();
      const role = meData.data?.role || 'candidate';

      this.currentUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName: userCredential.user.displayName || meData.data?.displayName || '',
        role,
        idToken
      };

      this.notifyListeners();
      return this.currentUser;
    } catch (firebaseErr: any) {
      // If client SDK authentication encounters an issue, fall back to backend login endpoint
      const backendRes = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const backendData = await backendRes.json();
      if (!backendRes.ok) {
        throw new Error(backendData.error?.message || firebaseErr.message || 'Invalid email or password.');
      }

      this.currentUser = {
        uid: backendData.data.user.uid,
        email: backendData.data.user.email,
        displayName: backendData.data.user.displayName,
        role: backendData.data.user.role,
        idToken: backendData.data.idToken
      };

      this.notifyListeners();
      return this.currentUser;
    }
  }

  /**
   * Signs out the user and revokes local session credentials.
   */
  public async logout(): Promise<void> {
    try {
      await signOut(clientAuth);
    } catch {
      // Fallback
    }
    this.currentUser = null;
    this.notifyListeners();
  }

  /**
   * Dispatches genuine Firebase password reset instructions.
   */
  public async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(clientAuth, email);
    } catch {
      // Fallback to backend reset endpoint
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Password reset failed.');
      }
    }
  }
}

export const clientAuthService = new ClientAuthService();
