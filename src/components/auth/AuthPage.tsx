import React, { useState } from 'react';
import { GlobalNavbar } from '../common/GlobalNavbar';
import {
  clientAuthService,
  CandidateRegistrationInput,
  HrAdminRegistrationInput
} from '../../services/firebaseAuth';
import { recruitmentService } from '../../services/storageService';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  Compass,
  Home,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export type AuthPageView = 'login' | 'choose_role' | 'register_candidate' | 'register_hr' | 'forgot_password';

interface AuthPageProps {
  initialView?: AuthPageView;
  onSuccess: (role: 'super_admin' | 'hr_admin' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer' | 'candidate') => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialView = 'login',
  onSuccess,
  onBackToHome
}) => {
  const [view, setView] = useState<AuthPageView>(initialView);

  // Login form state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Candidate Registration form state
  const [candForm, setCandForm] = useState<CandidateRegistrationInput>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    candidateType: 'fresher',
    currentLocation: 'Mysuru',
    preferredLocations: ['Mysuru', 'Bengaluru', 'Hyderabad'],
    degree: 'B.E. Computer Science',
    branch: 'Computer Science & Engineering',
    cgpa: 8.5,
    skills: ['Core Java', 'Data Structures', 'SQL', 'React']
  });
  const [candConfirmPassword, setCandConfirmPassword] = useState('');
  const [candSkillInput, setCandSkillInput] = useState('Core Java, Data Structures, SQL, React');

  // HR Admin Registration form state
  const [hrForm, setHrForm] = useState<HrAdminRegistrationInput>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    department: 'Talent Acquisition & Campus Recruitment',
    employeeId: '',
    companyName: 'Excelsoft Technologies'
  });
  const [hrConfirmPassword, setHrConfirmPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // ---------------------------------------------------------------------------
  // 1. Handle Login
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!userId.trim() || !password) {
      setErrorMessage('Please enter both your User ID / Email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const sessionUser = await clientAuthService.login(userId.trim(), password);
      setSuccessMessage(`Welcome back, ${sessionUser.displayName}! Authenticated as ${sessionUser.role.toUpperCase()}.`);

      // Redirection based on authenticated role
      setTimeout(() => {
        if (sessionUser.role === 'interviewer') {
          recruitmentService.switchAdminRole('interviewer');
        } else if (sessionUser.role !== 'candidate') {
          recruitmentService.switchAdminRole(sessionUser.role);
        }
        onSuccess(sessionUser.role);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Handle Candidate Registration
  // ---------------------------------------------------------------------------
  const handleCandidateRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!candForm.fullName || !candForm.email || !candForm.password) {
      setErrorMessage('Full name, email address, and password are required.');
      return;
    }

    if (candForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (candForm.password !== candConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const skillsArray = candSkillInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: CandidateRegistrationInput = {
        ...candForm,
        skills: skillsArray.length > 0 ? skillsArray : ['Core Java', 'SQL']
      };

      const user = await clientAuthService.register(payload);
      setSuccessMessage(`Registration successful! Welcome to NIYOJAN, ${user.displayName}.`);

      // Sync candidate profile with local recruitment service
      recruitmentService.registerNewCandidate(payload);

      setTimeout(() => {
        onSuccess('candidate');
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Candidate registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. Handle HR Admin Registration
  // ---------------------------------------------------------------------------
  const handleHrRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hrForm.fullName || !hrForm.email || !hrForm.password) {
      setErrorMessage('Full name, official email, and password are required.');
      return;
    }

    if (hrForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (hrForm.password !== hrConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await clientAuthService.registerHrAdmin(hrForm);
      setSuccessMessage(`HR Admin account created! Redirecting to command center...`);
      recruitmentService.switchAdminRole('hr_admin');

      setTimeout(() => {
        onSuccess('hr_admin');
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'HR Administrator registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. Handle Forgot Password
  // ---------------------------------------------------------------------------
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!forgotEmail) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      await clientAuthService.resetPassword(forgotEmail);
      setSuccessMessage('Password recovery instructions dispatched. You may now sign in.');
      setTimeout(() => {
        setView('login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Quick One-Click Demo Persona Login Helper
  // ---------------------------------------------------------------------------
  const handleQuickPersona = async (role: 'super_admin' | 'hr_admin' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer' | 'candidate') => {
    setIsLoading(true);
    setErrorMessage(null);

    const emailMap: Record<string, string> = {
      super_admin: 'sushmita.jena@excelsoftcorp.com',
      hr_admin: 'praveen.k@excelsoftcorp.com',
      recruitment_manager: 'ananya.d@excelsoftcorp.com',
      interview_coordinator: 'rakesh.r@excelsoftcorp.com',
      interviewer: 'murali.k@excelsoftcorp.com',
      candidate: 'rohan.sharma@example.com'
    };

    const targetEmail = emailMap[role];
    try {
      if (role === 'candidate') {
        await clientAuthService.syncSession({ personaKey: 'confirmed' });
      } else {
        await clientAuthService.syncSession({ adminRole: role });
        recruitmentService.switchAdminRole(role);
      }
      setSuccessMessage(`Quick Session Authenticated as ${role.toUpperCase()}`);
      setTimeout(() => {
        onSuccess(role);
      }, 400);
    } catch {
      // Fallback direct login
      try {
        const u = await clientAuthService.login(targetEmail, 'StaffSecretPassword123!');
        onSuccess(u.role);
      } catch {
        onSuccess(role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Universal Global Navigation Bar */}
      <GlobalNavbar
        currentPlatform="login"
        onNavigateHome={onBackToHome}
        onNavigateAbout={() => {
          onBackToHome();
          setTimeout(() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigateDocs={() => {
          onBackToHome();
        }}
        onOpenAuth={() => setView('login')}
      />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          
          {/* Status Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 1: AUTHENTICATION LANDING PAGE - LOGIN PAGE                  */}
          {/* ================================================================= */}
          {view === 'login' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
              <div className="text-center mb-6 space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Sign in to NIYOJAN
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Enter your User ID or registered email address to access your role workspace
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* User ID Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    User ID / Email Address
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="e.g. rohan.sharma@example.com or adm_praveen"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView('forgot_password')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-[11px] text-slate-500">HS256 JWT Signed</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Requirement 3: Option to create an account */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      setView('choose_role');
                    }}
                    className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/50 hover:decoration-indigo-400 transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>

              {/* Quick One-Click Demo Role Login Panel */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Quick Demo Personas (1-Click Login):</span>
                  <span className="text-[10px] text-indigo-400 font-mono">No Password Needed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('hr_admin')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">HR Admin</div>
                    <div className="text-[9px] text-indigo-400">Praveen K.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('interviewer')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">Interviewer</div>
                    <div className="text-[9px] text-amber-400">Dr. Murali</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('candidate')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">Candidate</div>
                    <div className="text-[9px] text-emerald-400">Rohan S.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('recruitment_manager')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-violet-950/60 border border-slate-800 hover:border-violet-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">Recruitment Mgr</div>
                    <div className="text-[9px] text-violet-400">Ananya D.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('interview_coordinator')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">Coordinator</div>
                    <div className="text-[9px] text-blue-400">Rakesh Rao</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('super_admin')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-left transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">Super Admin</div>
                    <div className="text-[9px] text-rose-400">Sushmita Jena</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 2: CHOOSE ACCOUNT TYPE (CANDIDATE OR HR ADMIN)               */}
          {/* Requirement 3: "show 2 cards candidate and Hr admin"              */}
          {/* ================================================================= */}
          {view === 'choose_role' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="text-center space-y-1.5">
                <button
                  onClick={() => setView('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </button>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Choose Account Type
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select your role to access the tailored registration portal
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* CARD A: CANDIDATE */}
                <div
                  onClick={() => {
                    setErrorMessage(null);
                    setView('register_candidate');
                  }}
                  className="group p-6 rounded-2xl bg-slate-950 hover:bg-gradient-to-b hover:from-slate-900 hover:to-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-indigo-950/50 hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Candidate Account
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        For job seekers, students, and engineers looking to apply for campus drives, track application status, and take technical interviews.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>Register as Candidate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* CARD B: HR ADMIN */}
                <div
                  onClick={() => {
                    setErrorMessage(null);
                    setView('register_hr');
                  }}
                  className="group p-6 rounded-2xl bg-slate-950 hover:bg-gradient-to-b hover:from-slate-900 hover:to-violet-950/40 border border-slate-800 hover:border-violet-500/60 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-violet-950/50 hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-violet-950 text-violet-400 border border-violet-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                        HR Administrator
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        For institutional HR coordinators, recruiters, and placement directors managing campus hiring drives, interview slots, and panel allocation.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                    <span>Register as HR Admin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setView('login')}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Already have an account? <span className="text-indigo-400 font-bold">Sign in here</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 3A: CANDIDATE REGISTRATION FORM                              */}
          {/* Requirement 4: "ask the required details and record information"  */}
          {/* ================================================================= */}
          {view === 'register_candidate' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button
                    onClick={() => setView('choose_role')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change role</span>
                  </button>
                  <h2 className="text-2xl font-black text-white">Candidate Registration</h2>
                  <p className="text-xs text-slate-400">Complete your profile to qualify for Excelsoft hiring drives</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/40 flex items-center justify-center font-bold text-xs">
                  CAND
                </div>
              </div>

              <form onSubmit={handleCandidateRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={candForm.fullName}
                      onChange={(e) => setCandForm({ ...candForm, fullName: e.target.value })}
                      placeholder="Aarav Deshmukh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={candForm.email}
                      onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
                      placeholder="aarav.d@student.vtu.ac.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={candForm.phone}
                      onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Candidate Type
                    </label>
                    <select
                      value={candForm.candidateType}
                      onChange={(e) => setCandForm({ ...candForm, candidateType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="fresher">Fresher (2026 Batch Graduate)</option>
                      <option value="experienced">Experienced (Lateral Hire)</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      value={candForm.password}
                      onChange={(e) => setCandForm({ ...candForm, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={candConfirmPassword}
                      onChange={(e) => setCandConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Academic Details */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Academic & Vetting Qualifications</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree & Major</label>
                      <input
                        type="text"
                        value={candForm.degree}
                        onChange={(e) => setCandForm({ ...candForm, degree: e.target.value })}
                        placeholder="B.E. Computer Science"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">CGPA / Percentage</label>
                      <input
                        type="number"
                        step="0.01"
                        value={candForm.cgpa}
                        onChange={(e) => setCandForm({ ...candForm, cgpa: parseFloat(e.target.value) || 0 })}
                        placeholder="8.5"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Technical Skills (comma-separated for 4-tier verification)
                    </label>
                    <input
                      type="text"
                      value={candSkillInput}
                      onChange={(e) => setCandSkillInput(e.target.value)}
                      placeholder="Java, Spring Boot, SQL, Docker, React"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Candidate Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 3B: HR ADMIN REGISTRATION FORM                               */}
          {/* Requirement 4: "ask required details and record information"      */}
          {/* ================================================================= */}
          {view === 'register_hr' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button
                    onClick={() => setView('choose_role')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change role</span>
                  </button>
                  <h2 className="text-2xl font-black text-white">HR Administrator Registration</h2>
                  <p className="text-xs text-slate-400">Setup your institutional recruiter profile</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-950 text-violet-400 border border-violet-700/40 flex items-center justify-center font-bold text-xs">
                  HR
                </div>
              </div>

              <form onSubmit={handleHrRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hrForm.fullName}
                      onChange={(e) => setHrForm({ ...hrForm, fullName: e.target.value })}
                      placeholder="Dr. Praveen Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={hrForm.email}
                      onChange={(e) => setHrForm({ ...hrForm, email: e.target.value })}
                      placeholder="praveen.k@excelsoftcorp.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={hrForm.phone}
                      onChange={(e) => setHrForm({ ...hrForm, phone: e.target.value })}
                      placeholder="+91 (821) 428-2000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={hrForm.department}
                      onChange={(e) => setHrForm({ ...hrForm, department: e.target.value })}
                      placeholder="Talent Acquisition & Campus Relations"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Corporate / Staff Employee ID
                    </label>
                    <input
                      type="text"
                      value={hrForm.employeeId}
                      onChange={(e) => setHrForm({ ...hrForm, employeeId: e.target.value })}
                      placeholder="HR-7402"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Partner Organization
                    </label>
                    <input
                      type="text"
                      value={hrForm.companyName}
                      onChange={(e) => setHrForm({ ...hrForm, companyName: e.target.value })}
                      placeholder="Excelsoft Technologies"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      value={hrForm.password}
                      onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={hrConfirmPassword}
                      onChange={(e) => setHrConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-violet-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete HR Admin Provisioning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 4: FORGOT PASSWORD                                           */}
          {/* ================================================================= */}
          {view === 'forgot_password' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="text-center space-y-1.5">
                <button
                  onClick={() => setView('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </button>
                <h2 className="text-2xl font-black text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-400">
                  Enter your registered email address to receive password recovery instructions
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@excelsoftcorp.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Dispatch Recovery Instructions</span>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 NIYOJAN Recruitment Engine &bull; Enterprise Campus Hiring &bull; Pure Scrypt Cryptographic Security
      </footer>
    </div>
  );
};

