import React, { useState } from 'react';
import { GlobalNavbar } from '../../common/GlobalNavbar';
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
      
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR */}
      <GlobalNavbar
        currentPlatform="hr_admin"
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onNavigateHome={onSwitchToHome || (() => {})}
        onNavigateAbout={() => {
          if (onSwitchToHome) onSwitchToHome();
        }}
        onNavigateDocs={() => {
          if (onSwitchToHome) onSwitchToHome();
        }}
        onOpenAuth={() => {}}
        onLogout={onLogout || handleLogout}
        onSelectWorkspace={(ws) => {
          if (ws === 'candidate' && onSwitchToCandidateApp) onSwitchToCandidateApp();
          else if (ws === 'interviewer' && onSwitchToInterviewer) onSwitchToInterviewer();
          else if (ws === 'hr_admin' && onSwitchToHrAdmin) onSwitchToHrAdmin();
          else if (onOpenRoleSwitcher) onOpenRoleSwitcher();
        }}
      />

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
          className={`fixed lg:sticky top-20 z-30 w-64 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
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

