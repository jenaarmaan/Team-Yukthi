import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  LogIn,
  User,
  ShieldCheck,
  Lock,
  LogOut,
  ChevronDown,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  Building2,
  Mail,
  KeyRound,
  Menu
} from 'lucide-react';
import { clientAuthService, AuthSessionUser } from '../../services/firebaseAuth';
import { recruitmentService } from '../../services/storageService';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import { PublicWorkspaceTarget } from '../public/PublicHomePage';

export interface GlobalNavbarProps {
  onNavigateHome: () => void;
  onNavigateDocs: () => void;
  onNavigateAbout: () => void;
  onOpenAuth: () => void;
  onSelectWorkspace?: (workspace: PublicWorkspaceTarget) => void;
  onOpenProfileTab?: () => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
  currentPlatform?: 'home' | 'docs' | 'login' | 'hr_admin' | 'candidate_mobile' | 'interviewer';
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  onNavigateHome,
  onNavigateDocs,
  onNavigateAbout,
  onOpenAuth,
  onSelectWorkspace,
  onOpenProfileTab,
  onLogout,
  onToggleMobileMenu,
  mobileMenuOpen = false,
  currentPlatform = 'home'
}) => {
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(clientAuthService.getCurrentUser());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [publicMobileNavOpen, setPublicMobileNavOpen] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribeAuth = clientAuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    const unsubscribeStorage = recruitmentService.subscribe(() => {
      setCurrentUser(clientAuthService.getCurrentUser());
    });
    return () => {
      unsubscribeAuth();
      unsubscribeStorage();
    };
  }, []);

  // Determine effective user info across active platforms
  const getUserInfo = () => {
    // 1. Direct auth session user
    if (currentUser) {
      const initials = (currentUser.displayName || currentUser.email)
        .split(' ')
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      return {
        isLoggedIn: true,
        name: currentUser.displayName || currentUser.email.split('@')[0],
        email: currentUser.email,
        role: currentUser.role,
        initials: initials || 'US',
        id: currentUser.uid,
        department: getRoleDepartment(currentUser.role)
      };
    }

    // 2. Candidate Platform context
    if (currentPlatform === 'candidate_mobile') {
      const cand = recruitmentService.getCurrentProfile();
      const initials = (cand.fullName || 'Candidate')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      return {
        isLoggedIn: true,
        name: cand.fullName,
        email: cand.email,
        role: 'candidate',
        initials,
        id: cand.id,
        department: `${cand.education.branch} • ${cand.education.degree}`
      };
    }

    // 3. Admin / Staff Platform context
    if (currentPlatform === 'hr_admin') {
      const admin = recruitmentService.getCurrentAdmin();
      return {
        isLoggedIn: true,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        initials: admin.avatarInitials,
        id: admin.id,
        department: admin.department
      };
    }

    // 4. Dedicated Interviewer Platform context
    if (currentPlatform === 'interviewer') {
      return {
        isLoggedIn: true,
        name: 'Dr. Murali Krishna',
        email: 'murali.krishna@excelsoftcorp.com',
        role: 'interviewer',
        initials: 'MK',
        id: 'int_murali',
        department: 'Technical Evaluation Panel'
      };
    }

    // 5. Guest / Not Logged In
    return {
      isLoggedIn: false,
      name: '',
      email: '',
      role: '',
      initials: '',
      id: '',
      department: ''
    };
  };

  const getRoleDepartment = (role: string) => {
    switch (role) {
      case 'hr_admin':
        return 'Human Resources Management';
      case 'recruitment_manager':
        return 'Talent Acquisition & Funnel';
      case 'interview_coordinator':
        return 'Venue Operations & Coordination';
      case 'interviewer':
        return 'Technical Assessment Panel';
      case 'super_admin':
        return 'Enterprise System Administration';
      case 'candidate':
        return 'Placement Candidate';
      default:
        return 'Enterprise Recruitment';
    }
  };

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'hr_admin':
        return 'HR Admin';
      case 'recruitment_manager':
        return 'Recruitment Manager';
      case 'interview_coordinator':
        return 'Coordinator';
      case 'interviewer':
        return 'Interviewer';
      case 'super_admin':
        return 'Super Admin';
      case 'candidate':
        return 'Candidate';
      default:
        return role;
    }
  };

  const userInfo = getUserInfo();

  const handleProfileClick = () => {
    setShowProfileModal(true);
    if (onOpenProfileTab) {
      onOpenProfileTab();
    }
  };

  const handleLogout = () => {
    clientAuthService.logout();
    setShowProfileModal(false);
    if (onLogout) {
      onLogout();
    } else {
      onNavigateHome();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          
          {/* ========================================================================= */}
          {/* 1. LEFT SIDE: Mobile Menu Toggle (if present)                             */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2">
            {onToggleMobileMenu ? (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            ) : (
              <button
                onClick={() => setPublicMobileNavOpen(!publicMobileNavOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                aria-label="Toggle public navigation menu"
              >
                {publicMobileNavOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. MIDDLE OF THE PAGE: Bold NIYOJAN Brand                                  */}
          {/* Requirements: Centered in the middle of the navbar / page                  */}
          {/* ========================================================================= */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-center pointer-events-auto px-1">
            <button
              onClick={onNavigateHome}
              className="flex items-center justify-center cursor-pointer group text-center focus:outline-hidden"
              title="NIYOJAN Home"
            >
              <span className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wider uppercase text-indigo-700 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-2xs group-hover:scale-105 transition-all select-none">
                NIYOJAN
              </span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. RIGHT SIDE: About & Documentation pushed right, next to Login/Profile   */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            
            {/* About Navigation Button - visible on medium screens and up */}
            <button
              onClick={onNavigateAbout}
              className="hidden md:inline-flex text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              About
            </button>

            {/* Documentation Navigation Button - visible on medium screens and up */}
            <button
              onClick={onNavigateDocs}
              className="hidden md:inline-flex text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Documentation</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden md:block" />

            {/* Dynamic Auth Slot: Profile Icon & Name (if logged in) OR Login/Register (if guest) */}
            {userInfo.isLoggedIn ? (
              /* LOGGED IN: Profile Icon and Profile Name */
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
                title="Open My Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  {userInfo.initials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors max-w-[120px] truncate leading-tight">
                    {userInfo.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    {getRoleBadgeLabel(userInfo.role)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            ) : (
              /* GUEST: Login / Register Button */
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* PUBLIC MOBILE NAVIGATION DRAWER (Active when toggled on mobile)            */}
      {/* ========================================================================= */}
      {publicMobileNavOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPublicMobileNavOpen(false);
                onNavigateAbout();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>About NIYOJAN</span>
            </button>

            <button
              onClick={() => {
                setPublicMobileNavOpen(false);
                onNavigateDocs();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-xs font-bold text-indigo-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Documentation</span>
            </button>
          </div>

          {userInfo.isLoggedIn ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  {userInfo.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{userInfo.name}</div>
                  <div className="text-[10px] text-slate-500">{getRoleBadgeLabel(userInfo.role)}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setPublicMobileNavOpen(false);
                  setShowProfileModal(true);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg bg-indigo-50"
              >
                My Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setPublicMobileNavOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* USER PROFILE MODAL / DRAWER                                               */}
      {/* Opened on clicking Profile Icon and Profile Name                          */}
      {/* ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 text-slate-800">
            
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Active User Profile</span>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Snapshot Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-violet-50/70 border border-indigo-100/80">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-500/20 ring-4 ring-white">
                {userInfo.initials}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-950 truncate">{userInfo.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{userInfo.email}</span>
                </div>
                <div className="pt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-indigo-100 text-indigo-800">
                    {getRoleBadgeLabel(userInfo.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Metadata Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Department / Affiliation:</span>
                <span className="text-slate-900 font-bold max-w-[200px] truncate text-right">
                  {userInfo.department || 'NIYOJAN Operations'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">User Identifier:</span>
                <span className="text-slate-700 font-mono text-[11px] font-bold">
                  {userInfo.id || 'usr_session_active'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Session Security:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Stateless HS256 JWT</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              
              {/* Go to dedicated workspace profile if relevant */}
              {userInfo.role === 'candidate' && onSelectWorkspace && (
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    onSelectWorkspace('candidate');
                    if (onOpenProfileTab) onOpenProfileTab();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Open Full Candidate Profile</span>
                </button>
              )}

              {currentPlatform !== 'candidate_mobile' && userInfo.role === 'interviewer' && onSelectWorkspace && (
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    onSelectWorkspace('interviewer');
                    if (onOpenProfileTab) onOpenProfileTab();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Open Panelist Workspace Profile</span>
                </button>
              )}

              {currentPlatform !== 'candidate_mobile' && ['hr_admin', 'recruitment_manager', 'interview_coordinator', 'super_admin'].includes(userInfo.role) && onSelectWorkspace && (
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    onSelectWorkspace(userInfo.role as PublicWorkspaceTarget);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Open Staff Dashboard</span>
                </button>
              )}

              {/* Quick Navigation on Mobile */}
              <div className="md:hidden grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    onNavigateAbout();
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>About NIYOJAN</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    onNavigateDocs();
                  }}
                  className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Documentation</span>
                </button>
              </div>

              {/* Reset Password Button */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowPasswordModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Reset / Change Password</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Log Out of NIYOJAN</span>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setShowPasswordModal(false);
        }}
      />
    </>
  );
};
