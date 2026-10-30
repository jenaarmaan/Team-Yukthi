import React, { useState } from 'react';
import { clientAuthService } from '../../../services/firebaseAuth';
import { recruitmentService } from '../../../services/storageService';

// Child Views
import { RecruitmentManagerOverviewView } from './RecruitmentManagerOverviewView';
import { RecruitmentFunnelView } from './RecruitmentFunnelView';
import { VacanciesTargetsView } from './VacanciesTargetsView';
import { CandidateIntelligenceView } from './CandidateIntelligenceView';
import { WaitlistStandbyView } from './WaitlistStandbyView';
import { SlotRecoveryView } from './SlotRecoveryView';
import { DrivePerformanceView } from './DrivePerformanceView';
import { LocationTrackingView } from './LocationTrackingView';
import { RecruitmentManagerActivityView } from './RecruitmentManagerActivityView';

// AI Intelligence Panel
import { RecruitmentManagerAiInsightsPanel } from './RecruitmentManagerAiInsightsPanel';

// Modals
import { ChangePasswordModal } from '../../auth/ChangePasswordModal';

// Icons
import {
  LayoutDashboard,
  Filter,
  BarChart3,
  Target,
  Users,
  Clock,
  Zap,
  TrendingUp,
  MapPin,
  Activity,
  Sparkles,
  Smartphone,
  Shield,
  Home,
  LogOut,
  KeyRound,
  Menu,
  X,
  Compass,
  Bell
} from 'lucide-react';

export type RecruitmentManagerSidebarTab =
  | 'overview'
  | 'funnel'
  | 'vacancies'
  | 'candidate-intelligence'
  | 'waitlist-standby'
  | 'slot-recovery'
  | 'drive-performance'
  | 'location-tracking'
  | 'dashboard';

interface RecruitmentManagerDashboardLayoutProps {
  onSwitchToCandidateApp?: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHrAdmin?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const RecruitmentManagerDashboardLayout: React.FC<RecruitmentManagerDashboardLayoutProps> = ({
  onSwitchToCandidateApp,
  onSwitchToInterviewer,
  onSwitchToHrAdmin,
  onSwitchToHome,
  onLogout,
  onOpenRoleSwitcher
}) => {
  // Step 2: Exact Sidebar Navigation State
  const [activeTab, setActiveTab] = useState<RecruitmentManagerSidebarTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
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
                  Recruitment Manager
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Candidate Pipeline, Funnel Telemetry & Slot Recovery
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI Panel Toggle, View Switchers, Profile & Security */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* AI Intelligence Panel Toggle */}
          <button
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              aiPanelOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Right-Side AI Recruitment Intelligence Panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Intelligence</span>
          </button>

          {/* Switch to Candidate App */}
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
              title={`Logged in as ${currentAdmin.name} (Recruitment Manager)`}
            >
              {currentAdmin.avatarInitials || 'RM'}
            </div>
          </div>

        </div>

      </header>

      {/* 2. MAIN BODY: FIXED LEFT SIDEBAR + CONTENT AREA + RIGHT-SIDE AI PANEL */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* ========================================================================= */}
        {/* STEP 2: FIXED LEFT SIDEBAR NAVIGATION                                     */}
        {/* Exact Order:                                                              */}
        {/* 1. Overview                                                               */}
        {/* 2. Recruitment Funnel                                                     */}
        {/* 3. Vacancies & Targets                                                    */}
        {/* 4. Candidate Intelligence                                                 */}
        {/* 5. Waitlist & Standby                                                     */}
        {/* 6. Slot Recovery                                                          */}
        {/* 7. Drive Performance                                                      */}
        {/* 8. Location Tracking                                                      */}
        {/* 9. Dashboard (fixed at the bottom)                                        */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section of Sidebar (Items 1 to 8 in exact required sequence) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Recruitment Operations
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

            {/* 2. Recruitment Funnel */}
            <button
              onClick={() => {
                setActiveTab('funnel');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'funnel'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Filter className={`w-4 h-4 ${activeTab === 'funnel' ? 'text-white' : 'text-slate-500'}`} />
                <span>Recruitment Funnel</span>
              </div>
            </button>

            {/* 3. Vacancies & Targets */}
            <button
              onClick={() => {
                setActiveTab('vacancies');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'vacancies'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Target className={`w-4 h-4 ${activeTab === 'vacancies' ? 'text-white' : 'text-slate-500'}`} />
                <span>Vacancies & Targets</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'vacancies' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                104
              </span>
            </button>

            {/* 4. Candidate Intelligence */}
            <button
              onClick={() => {
                setActiveTab('candidate-intelligence');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'candidate-intelligence'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'candidate-intelligence' ? 'text-white' : 'text-slate-500'}`} />
                <span>Candidate Intelligence</span>
              </div>
            </button>

            {/* 5. Waitlist & Standby */}
            <button
              onClick={() => {
                setActiveTab('waitlist-standby');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'waitlist-standby'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className={`w-4 h-4 ${activeTab === 'waitlist-standby' ? 'text-white' : 'text-slate-500'}`} />
                <span>Waitlist & Standby</span>
              </div>
            </button>

            {/* 6. Slot Recovery */}
            <button
              onClick={() => {
                setActiveTab('slot-recovery');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'slot-recovery'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${activeTab === 'slot-recovery' ? 'text-white' : 'text-slate-500'}`} />
                <span>Slot Recovery</span>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  activeTab === 'slot-recovery'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                79%
              </span>
            </button>

            {/* 7. Drive Performance */}
            <button
              onClick={() => {
                setActiveTab('drive-performance');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'drive-performance'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className={`w-4 h-4 ${activeTab === 'drive-performance' ? 'text-white' : 'text-slate-500'}`} />
                <span>Drive Performance</span>
              </div>
            </button>

            {/* 8. Location Tracking */}
            <button
              onClick={() => {
                setActiveTab('location-tracking');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'location-tracking'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-4 h-4 ${activeTab === 'location-tracking' ? 'text-white' : 'text-slate-500'}`} />
                <span>Location Tracking</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'location-tracking' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                6
              </span>
            </button>
          </div>

          {/* Bottom Section of Sidebar: Item 9 (Dashboard fixed at the bottom) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
              Operational Hub
            </div>

            {/* 9. Dashboard (fixed at the bottom) */}
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
              title="Recruitment Manager Activity History & Audit Logs"
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
            <RecruitmentManagerOverviewView
              onNavigateToTab={(tab) => setActiveTab(tab as RecruitmentManagerSidebarTab)}
            />
          )}

          {/* STEP 4: RECRUITMENT FUNNEL */}
          {activeTab === 'funnel' && <RecruitmentFunnelView />}

          {/* STEP 5: VACANCIES & TARGETS */}
          {activeTab === 'vacancies' && <VacanciesTargetsView />}

          {/* STEP 6: CANDIDATE INTELLIGENCE */}
          {activeTab === 'candidate-intelligence' && <CandidateIntelligenceView />}

          {/* STEP 7: WAITLIST & STANDBY */}
          {activeTab === 'waitlist-standby' && <WaitlistStandbyView />}

          {/* STEP 8: SLOT RECOVERY */}
          {activeTab === 'slot-recovery' && <SlotRecoveryView />}

          {/* STEP 9: DRIVE PERFORMANCE */}
          {activeTab === 'drive-performance' && <DrivePerformanceView />}

          {/* STEP 10: LOCATION TRACKING */}
          {activeTab === 'location-tracking' && <LocationTrackingView />}

          {/* STEP 11: ACTIVITY HISTORY (DASHBOARD) */}
          {activeTab === 'dashboard' && <RecruitmentManagerActivityView />}

        </main>

        {/* STEP 12: RIGHT-SIDE AI RECRUITMENT INTELLIGENCE PANEL */}
        {aiPanelOpen && (
          <RecruitmentManagerAiInsightsPanel
            isOpen={aiPanelOpen}
            onClose={() => setAiPanelOpen(false)}
            onNavigateToTab={(tab) => setActiveTab(tab as RecruitmentManagerSidebarTab)}
          />
        )}

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
};
