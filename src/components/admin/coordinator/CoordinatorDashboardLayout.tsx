import React, { useState } from 'react';
import { clientAuthService } from '../../../services/firebaseAuth';
import { recruitmentService } from '../../../services/storageService';

// Child Views
import { CoordinatorOverviewView } from './CoordinatorOverviewView';
import { CoordinatorSlotsView } from './CoordinatorSlotsView';
import { CoordinatorSchedulesView } from './CoordinatorSchedulesView';
import { CoordinatorPanelsView } from './CoordinatorPanelsView';
import { CoordinatorVenuesView } from './CoordinatorVenuesView';
import { CoordinatorAttendanceView } from './CoordinatorAttendanceView';
import { CoordinatorVerificationView } from './CoordinatorVerificationView';
import { CoordinatorActivityView } from './CoordinatorActivityView';

// Modals
import { ChangePasswordModal } from '../../auth/ChangePasswordModal';

// Icons
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  Building2,
  CheckCircle2,
  QrCode,
  Activity,
  Compass,
  Home,
  Smartphone,
  Shield,
  LogOut,
  KeyRound,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export type CoordinatorSidebarTab =
  | 'overview'
  | 'slots'
  | 'schedules'
  | 'panels'
  | 'venues'
  | 'attendance'
  | 'verification'
  | 'dashboard';

interface CoordinatorDashboardLayoutProps {
  onSwitchToCandidateApp?: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHrAdmin?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const CoordinatorDashboardLayout: React.FC<CoordinatorDashboardLayoutProps> = ({
  onSwitchToCandidateApp,
  onSwitchToInterviewer,
  onSwitchToHrAdmin,
  onSwitchToHome,
  onLogout,
  onOpenRoleSwitcher
}) => {
  // Step 2: Exact Sidebar Navigation State
  const [activeTab, setActiveTab] = useState<CoordinatorSidebarTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const currentAdmin = recruitmentService.getCurrentAdmin();

  const handleLogout = async () => {
    await clientAuthService.logout();
    if (onLogout) {
      onLogout();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-base shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900">NIYOJAN</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Interview Coordinator
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Interview Logistics, Venues, Panels & Gate Attendance
              </p>
            </div>
          </div>
        </div>

        {/* Right: View Switchers, Profile & Security */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Switch to Candidate Portal */}
          {onSwitchToCandidateApp && (
            <button
              onClick={onSwitchToCandidateApp}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Preview Candidate Portal"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Candidate Portal</span>
            </button>
          )}

          {/* Switch to HR Admin */}
          {onSwitchToHrAdmin && (
            <button
              onClick={onSwitchToHrAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Switch to HR Admin Dashboard"
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>HR Admin</span>
            </button>
          )}

          {/* Switch to Interviewer Workspace */}
          {onSwitchToInterviewer && (
            <button
              onClick={onSwitchToInterviewer}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Switch to Interviewer Workspace"
            >
              <Shield className="w-3.5 h-3.5 text-violet-600" />
              <span>Interviewer</span>
            </button>
          )}

          {/* Return to Public Home */}
          {onSwitchToHome && (
            <button
              onClick={onSwitchToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Return to Public Homepage"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          {/* Profile & Security Section */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Reset / Change Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
              title={`Logged in as ${currentAdmin.name} (Interview Coordinator)`}
            >
              {currentAdmin.avatarInitials || 'IC'}
            </div>
          </div>

        </div>

      </header>

      {/* 2. MAIN BODY: FIXED LEFT SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* ========================================================================= */}
        {/* STEP 2: FIXED LEFT SIDEBAR NAVIGATION                                     */}
        {/* Exact Order:                                                              */}
        {/* 1. Overview                                                               */}
        {/* 2. Interview Slots                                                        */}
        {/* 3. Interview Schedules                                                    */}
        {/* 4. Interview Panels                                                       */}
        {/* 5. Venues & Rooms                                                         */}
        {/* 6. Candidate Attendance                                                   */}
        {/* 7. QR & OTP Verification                                                  */}
        {/* 8. Dashboard (fixed at the bottom)                                        */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section of Sidebar (Items 1 to 7 in exact required sequence) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Interview Logistics
            </div>

            {/* 1. Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500'}`} />
                <span>Overview</span>
              </div>
            </button>

            {/* 2. Interview Slots */}
            <button
              onClick={() => {
                setActiveTab('slots');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'slots'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className={`w-4 h-4 ${activeTab === 'slots' ? 'text-white' : 'text-slate-500'}`} />
                <span>Interview Slots</span>
              </div>
            </button>

            {/* 3. Interview Schedules */}
            <button
              onClick={() => {
                setActiveTab('schedules');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'schedules'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={`w-4 h-4 ${activeTab === 'schedules' ? 'text-white' : 'text-slate-500'}`} />
                <span>Interview Schedules</span>
              </div>
            </button>

            {/* 4. Interview Panels */}
            <button
              onClick={() => {
                setActiveTab('panels');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'panels'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'panels' ? 'text-white' : 'text-slate-500'}`} />
                <span>Interview Panels</span>
              </div>
            </button>

            {/* 5. Venues & Rooms */}
            <button
              onClick={() => {
                setActiveTab('venues');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'venues'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 ${activeTab === 'venues' ? 'text-white' : 'text-slate-500'}`} />
                <span>Venues & Rooms</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'venues' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                14
              </span>
            </button>

            {/* 6. Candidate Attendance */}
            <button
              onClick={() => {
                setActiveTab('attendance');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-4 h-4 ${activeTab === 'attendance' ? 'text-white' : 'text-slate-500'}`} />
                <span>Candidate Attendance</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'attendance' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                94%
              </span>
            </button>

            {/* 7. QR & OTP Verification */}
            <button
              onClick={() => {
                setActiveTab('verification');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'verification'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className={`w-4 h-4 ${activeTab === 'verification' ? 'text-white' : 'text-slate-500'}`} />
                <span>QR & OTP Verification</span>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  activeTab === 'verification'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                LIVE
              </span>
            </button>
          </div>

          {/* Bottom Section of Sidebar: Item 8 (Dashboard fixed at the bottom) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
              Operational Audit
            </div>

            {/* 8. Dashboard (fixed at the bottom) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80'
              }`}
              title="Interview Coordinator Operational Activity History & Logs"
            >
              <div className="flex items-center gap-2.5">
                <Activity className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-400' : 'text-indigo-600 group-hover:scale-105 transition-transform'}`} />
                <span>Dashboard</span>
              </div>
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white/60' : 'text-slate-400'}`} />
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto min-w-0">
          
          {/* STEP 3: OVERVIEW */}
          {activeTab === 'overview' && (
            <CoordinatorOverviewView
              onNavigateToTab={(tab) => setActiveTab(tab as CoordinatorSidebarTab)}
            />
          )}

          {/* STEP 4: INTERVIEW SLOTS */}
          {activeTab === 'slots' && <CoordinatorSlotsView />}

          {/* STEP 5: INTERVIEW SCHEDULES */}
          {activeTab === 'schedules' && <CoordinatorSchedulesView />}

          {/* STEP 6: INTERVIEW PANELS */}
          {activeTab === 'panels' && <CoordinatorPanelsView />}

          {/* STEP 7: VENUES & ROOMS */}
          {activeTab === 'venues' && <CoordinatorVenuesView />}

          {/* STEP 9 & 12: CANDIDATE ATTENDANCE & MANUAL OVERRIDE */}
          {activeTab === 'attendance' && <CoordinatorAttendanceView />}

          {/* STEP 10 & 11: QR & OTP VERIFICATION */}
          {activeTab === 'verification' && <CoordinatorVerificationView />}

          {/* STEP 13: ACTIVITY DASHBOARD */}
          {activeTab === 'dashboard' && <CoordinatorActivityView />}

        </main>

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
};

