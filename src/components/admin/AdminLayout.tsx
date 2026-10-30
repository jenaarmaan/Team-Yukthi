import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import { clientAuthService } from '../../services/firebaseAuth';
import { AdminRole, AdminUser } from '../../types/recruitment';
import { AdminOverview } from './AdminOverview';
import { AdminHiringDrives } from './AdminHiringDrives';
import { AdminCandidates } from './AdminCandidates';
import { AdminInterviewScheduling } from './AdminInterviewScheduling';
import { AdminWaitlist } from './AdminWaitlist';
import { AdminStandby } from './AdminStandby';
import { AdminAttendance } from './AdminAttendance';
import { AdminAbsenceManagement } from './AdminAbsenceManagement';
import { AdminSelfHealingCenter } from './AdminSelfHealingCenter';
import { AdminInterviewers } from './AdminInterviewers';
import { AdminStaffManagement } from './AdminStaffManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminQATestRunner } from './AdminQATestRunner';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import { HrDashboardLayout } from './hr/HrDashboardLayout';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Award,
  BarChart3,
  Smartphone,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  FlaskConical,
  Home,
  UserPlus,
  KeyRound,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  onSwitchToCandidateApp: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
}

export type AdminTab =
  | 'overview'
  | 'drives'
  | 'candidates'
  | 'scheduling'
  | 'waitlist'
  | 'standby'
  | 'attendance'
  | 'absence'
  | 'self-healing'
  | 'interviewers'
  | 'staff'
  | 'analytics'
  | 'qa-tests';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onSwitchToCandidateApp,
  onSwitchToInterviewer,
  onSwitchToHome,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return recruitmentService.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  const currentAdmin = recruitmentService.getCurrentAdmin();
  const currentRole = recruitmentService.getCurrentAdminRole();

  // Role-tailored navigation items
  const allNavItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; roles: AdminRole[] }[] = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard, roles: ['super_admin', 'hr_admin', 'recruitment_manager', 'interview_coordinator'] },
    { id: 'drives', label: 'Hiring Drives', icon: Building2, roles: ['super_admin', 'hr_admin'] },
    { id: 'candidates', label: 'Candidate Database', icon: Users, roles: ['super_admin', 'recruitment_manager'] },
    { id: 'scheduling', label: 'Interview Slots', icon: Calendar, roles: ['super_admin', 'recruitment_manager', 'interview_coordinator'] },
    { id: 'waitlist', label: 'Dynamic Waitlist', icon: Clock, roles: ['super_admin', 'hr_admin', 'recruitment_manager'] },
    { id: 'standby', label: 'Proactive Standby', icon: Sparkles, roles: ['super_admin', 'interview_coordinator'] },
    { id: 'attendance', label: 'Live Attendance Desk', icon: CheckCircle2, roles: ['super_admin', 'interview_coordinator'] },
    { id: 'absence', label: 'Absence Governance', icon: ShieldAlert, roles: ['super_admin', 'hr_admin'] },
    { id: 'self-healing', label: 'Self-Healing Center', icon: RefreshCw, roles: ['super_admin', 'hr_admin'] },
    { id: 'interviewers', label: 'Interviewer Panels', icon: Award, roles: ['super_admin', 'hr_admin', 'recruitment_manager', 'interview_coordinator'] },
    { id: 'staff', label: 'Staff Management & Invites', icon: UserPlus, roles: ['super_admin', 'hr_admin'] },
    { id: 'analytics', label: 'Reports & Telemetry', icon: BarChart3, roles: ['super_admin', 'hr_admin', 'recruitment_manager'] },
    { id: 'qa-tests', label: 'QA Test Console', icon: FlaskConical, badge: 9, roles: ['super_admin'] }
  ];

  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  const handleRoleChange = (role: AdminRole) => {
    recruitmentService.switchAdminRole(role);
    if (role === 'interviewer' && onSwitchToInterviewer) {
      onSwitchToInterviewer();
    } else {
      // If switching to a role that does not have the current activeTab, reset to overview
      const allowedTabs = allNavItems.filter((i) => i.roles.includes(role)).map((i) => i.id);
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab('overview');
      }
    }
  };

  const handleLogout = async () => {
    await clientAuthService.logout();
    if (onLogout) {
      onLogout();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  const getRoleHeaderInfo = () => {
    switch (currentRole) {
      case 'super_admin':
        return { title: 'NIYOJAN Super Admin', badge: 'SUPER ADMIN', sub: 'Enterprise Security, Audit & Platform Governance' };
      case 'hr_admin':
        return { title: 'NIYOJAN HR Admin', badge: 'HR ADMIN', sub: 'Campus Hiring Drives, Staffing & Workforce Planning' };
      case 'recruitment_manager':
        return { title: 'NIYOJAN Recruitment Manager', badge: 'RECRUITMENT MGR', sub: 'Candidate Pipeline, Skills & Slot Allocation' };
      case 'interview_coordinator':
        return { title: 'NIYOJAN Interview Coordinator', badge: 'COORDINATOR', sub: 'Venue Operations, Live Attendance & Standby Triage' };
      default:
        return { title: 'NIYOJAN Workspace', badge: currentRole.toUpperCase(), sub: 'Excelsoft Technologies Recruitment Management' };
    }
  };

  const roleMeta = getRoleHeaderInfo();

  // Dedicated HR Admin Dashboard (Steps 1 to 8: Fixed Left Sidebar with Overview, Analytics, Drives, Dashboard; Right AI Panel)
  if (currentRole === 'hr_admin') {
    return (
      <HrDashboardLayout
        onSwitchToCandidateApp={onSwitchToCandidateApp}
        onSwitchToInterviewer={onSwitchToInterviewer}
        onSwitchToHome={onSwitchToHome}
        onLogout={onLogout}
        onOpenRoleSwitcher={() => handleRoleChange('super_admin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP HEADER (ENTERPRISE CONTRACT: BRANDING - GLOBAL SWITCHER - ROLE - PROFILE) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu button + Brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-base shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900">{roleMeta.title}</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {roleMeta.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">{roleMeta.sub}</p>
            </div>
          </div>
        </div>

        {/* Center/Right: App Switcher & Role Selector */}
        <div className="flex items-center gap-2.5">
          {/* Public Home Portal Switcher */}
          {onSwitchToHome && (
            <button
              onClick={onSwitchToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
              title="Return to Public Homepage"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Public Home</span>
            </button>
          )}

          {/* Dedicated Interviewer Workspace Switcher */}
          {onSwitchToInterviewer && (
            <button
              onClick={onSwitchToInterviewer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs shadow-2xs transition-colors"
              title="Open Dedicated Interviewer Workspace"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Interviewer Workspace</span>
            </button>
          )}

          {/* Global View Switcher: Back to Candidate Mobile App */}
          <button
            onClick={onSwitchToCandidateApp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            title="Open Candidate-Facing Mobile Experience"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden md:inline">Candidate Mobile View</span>
            <span className="md:hidden">Candidate App</span>
          </button>

          {/* Role-Based Access Dropdown */}
          <div className="relative hidden md:block">
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
              className="pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="super_admin">Role: Super Admin</option>
              <option value="hr_admin">Role: HR Admin</option>
              <option value="recruitment_manager">Role: Recruitment Manager</option>
              <option value="interview_coordinator">Role: Interview Coordinator</option>
              <option value="interviewer">Role: Interviewer</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Profile Pill & Security Actions */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
              title="Reset / Change Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
              title="Sign Out of Dashboard"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {currentAdmin.avatarInitials}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">{currentAdmin.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{currentAdmin.department}</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY SPLIT: SIDEBAR NAVIGATION + MAIN CONTENT */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop 260px) */}
        <aside
          className={`fixed lg:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 flex items-center justify-between">
              <span>Recruitment Lifecycle</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded font-mono">
                {currentRole}
              </span>
            </div>

            {visibleNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: System Status & Account */}
          <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Reset Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-lg border border-rose-200 bg-rose-50/40 text-rose-600 hover:bg-rose-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
              <div className="font-bold text-slate-800">Unified SQLite DB</div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Connected & Bull-Resilient</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <AdminOverview
              onNavigateToTab={(tab) => setActiveTab(tab as AdminTab)}
              onOpenCandidateDetail={() => setActiveTab('candidates')}
            />
          )}

          {activeTab === 'drives' && <AdminHiringDrives />}

          {activeTab === 'candidates' && <AdminCandidates />}

          {activeTab === 'scheduling' && <AdminInterviewScheduling />}

          {activeTab === 'waitlist' && <AdminWaitlist />}

          {activeTab === 'standby' && <AdminStandby />}

          {activeTab === 'attendance' && <AdminAttendance />}

          {activeTab === 'absence' && <AdminAbsenceManagement />}

          {activeTab === 'self-healing' && <AdminSelfHealingCenter />}

          {activeTab === 'interviewers' && <AdminInterviewers />}

          {activeTab === 'staff' && <AdminStaffManagement />}

          {activeTab === 'analytics' && <AdminAnalytics />}

          {activeTab === 'qa-tests' && <AdminQATestRunner />}
        </main>
      </div>

      {/* Password Reset Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};
