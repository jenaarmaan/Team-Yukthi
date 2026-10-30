import { CandidateType } from '../types/recruitment';

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

const SESSION_STORAGE_KEY = 'niyojan_jwt_session';

class ClientAuthService {
  private listeners: Set<AuthListener> = new Set();
  private currentUser: AuthSessionUser | null = null;
  private isInitialized = false;

  constructor() {
    this.restoreSession();
  }

  private async restoreSession(): Promise<void> {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSessionUser;
        if (parsed && parsed.idToken) {
          // Verify with backend
          try {
            const meRes = await fetch('/api/v1/auth/me', {
              headers: { Authorization: `Bearer ${parsed.idToken}` }
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              this.currentUser = {
                ...parsed,
                role: meData.data?.role || parsed.role,
                displayName: meData.data?.displayName || parsed.displayName
              };
            } else {
              this.currentUser = null;
              localStorage.removeItem(SESSION_STORAGE_KEY);
            }
          } catch {
            this.currentUser = parsed;
          }
        }
      }
    } catch {
      this.currentUser = null;
    } finally {
      this.isInitialized = true;
      this.notifyListeners();
    }
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
      try {
        listener(this.currentUser);
      } catch {
        // Safe dispatch
      }
    }
  }

  private saveSession(user: AuthSessionUser | null): void {
    this.currentUser = user;
    if (user) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Storage quota
      }
    } else {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Storage error
      }
    }
    this.notifyListeners();
  }

  public getCurrentUser(): AuthSessionUser | null {
    return this.currentUser;
  }

  public async getValidIdToken(_forceRefresh = false): Promise<string | null> {
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
          const sessionUser: AuthSessionUser = {
            uid: json.data.user.uid,
            email: json.data.user.email,
            displayName: json.data.user.displayName,
            role: json.data.user.role,
            idToken: json.data.idToken
          };
          this.saveSession(sessionUser);
          return sessionUser;
        }
      }
    } catch {
      // Fallback
    }
    return this.currentUser;
  }

  /**
   * Registers a candidate via the backend API.
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

    const sessionUser: AuthSessionUser = {
      uid: data.data.uid,
      email: data.data.email,
      displayName: data.data.displayName,
      role: data.data.role,
      idToken: data.data.idToken
    };
    this.saveSession(sessionUser);
    return sessionUser;
  }

  /**
   * Signs in a user via the backend API.
   */
  public async login(email: string, password: string): Promise<AuthSessionUser> {
    const backendRes = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const backendData = await backendRes.json();
    if (!backendRes.ok) {
      throw new Error(backendData.error?.message || 'Invalid email address or password.');
    }

    const sessionUser: AuthSessionUser = {
      uid: backendData.data.user.uid,
      email: backendData.data.user.email,
      displayName: backendData.data.user.displayName,
      role: backendData.data.user.role,
      idToken: backendData.data.idToken
    };

    this.saveSession(sessionUser);
    return sessionUser;
  }

  /**
   * Signs out the user and revokes session credentials.
   */
  public async logout(): Promise<void> {
    if (this.currentUser?.idToken) {
      try {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.currentUser.idToken}` }
        });
      } catch {
        // Ignore network failure on logout
      }
    }
    this.saveSession(null);
  }

  /**
   * Dispatches password reset instructions.
   */
  public async resetPassword(email: string): Promise<void> {
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

export const clientAuthService = new ClientAuthService();
