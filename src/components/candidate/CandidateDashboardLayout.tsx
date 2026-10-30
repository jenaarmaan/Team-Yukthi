import React, { useState } from 'react';
import {
  CandidateProfile,
  HiringDrive,
  Application,
  AppNotification
} from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import { clientAuthService } from '../../services/firebaseAuth';
import { GlobalNavbar } from '../common/GlobalNavbar';

// Step Views
import { CandidateOverviewView } from './CandidateOverviewView';
import { CandidateApplicationsView } from './CandidateApplicationsView';
import { CandidateArenaView } from './CandidateArenaView';
import { CandidateProfileView } from './CandidateProfileView';
import { CandidateNotificationsView } from './CandidateNotificationsView';
import { CandidateActivityDashboardView } from './CandidateActivityDashboardView';

// Modals
import { OpportunityDetailModal } from '../opportunities/OpportunityDetailModal';
import { ApplicationDetailModal } from '../applications/ApplicationDetailModal';
import { QrCheckInModal } from '../interview/QrCheckInModal';
import { StandbyInvitationModal } from '../standby/StandbyInvitationModal';
import { AbsenceManagementModal } from '../absence/AbsenceManagementModal';
import { DemoScenarioSelector } from '../common/DemoScenarioSelector';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';

// Icons
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  User,
  Bell,
  Activity,
  Menu,
  X,
  Shield,
  LogOut,
  KeyRound,
  Home,
  Users,
  Compass,
  Sparkles
} from 'lucide-react';

export type CandidateSidebarTab =
  | 'overview'
  | 'applications'
  | 'arena'
  | 'profile'
  | 'notifications'
  | 'dashboard';

interface CandidateDashboardLayoutProps {
  initialTab?: CandidateSidebarTab;
  onSwitchToAdmin?: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
}

export const CandidateDashboardLayout: React.FC<CandidateDashboardLayoutProps> = ({
  initialTab,
  onSwitchToAdmin,
  onSwitchToInterviewer,
  onSwitchToHome,
  onLogout
}) => {
  // Navigation State - Step 2 Left Sidebar Navigation (exact order)
  const [activeTab, setActiveTab] = useState<CandidateSidebarTab>(initialTab || 'overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals state
  const [selectedDrive, setSelectedDrive] = useState<HiringDrive | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [qrCheckInApp, setQrCheckInApp] = useState<Application | null>(null);
  const [standbyModalApp, setStandbyModalApp] = useState<Application | null>(null);
  const [absenceModalApp, setAbsenceModalApp] = useState<Application | null>(null);
  const [showScenarioSwitcher, setShowScenarioSwitcher] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Dynamic Data
  const [profile, setProfile] = useState<CandidateProfile>(recruitmentService.getCurrentProfile());
  const [applications, setApplications] = useState<Application[]>(recruitmentService.getCandidateApplications());
  const [drives, setDrives] = useState<HiringDrive[]>(recruitmentService.getHiringDrives());
  const [notifications, setNotifications] = useState<AppNotification[]>(recruitmentService.getNotifications());

  const refreshData = () => {
    setProfile(recruitmentService.getCurrentProfile());
    setApplications([...recruitmentService.getCandidateApplications()]);
    setDrives([...recruitmentService.getHiringDrives()]);
    setNotifications([...recruitmentService.getNotifications()]);
  };

  const handleLogout = async () => {
    await clientAuthService.logout();
    if (onLogout) {
      onLogout();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;
  const activeApplicationsCount = applications.filter(
    (a) => a.status === 'confirmed' || a.status === 'under_review' || a.status === 'standby' || a.status === 'submitted' || a.status === 'eligible'
  ).length;

  // Handle action routes from notifications
  const handleNotificationActionRoute = (route?: AppNotification['actionRoute']) => {
    if (!route) return;
    if (route.tab === 'applications') setActiveTab('applications');
    else if (route.tab === 'profile') setActiveTab('profile');
    else if (route.tab === 'home' || route.tab === 'opportunities') setActiveTab('overview');
    else if (route.tab === 'notifications') setActiveTab('notifications');
  };

  const candidateInitials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CA';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR */}
      <GlobalNavbar
        currentPlatform="candidate_mobile"
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
        onOpenProfileTab={() => setActiveTab('profile')}
        onLogout={onLogout || handleLogout}
        onSelectWorkspace={(ws) => {
          if (ws === 'hr_admin' && onSwitchToAdmin) onSwitchToAdmin();
          if (ws === 'interviewer' && onSwitchToInterviewer) onSwitchToInterviewer();
        }}
      />

      {/* 2. MAIN BODY: FIXED LEFT SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* ========================================================================= */}
        {/* STEP 2: FIXED LEFT SIDEBAR NAVIGATION                                     */}
        {/* Exact Order:                                                              */}
        {/* 1. Overview                                                               */}
        {/* 2. Applications                                                           */}
        {/* 3. Arena                                                                  */}
        {/* 4. Profile                                                                */}
        {/* 5. Notifications                                                          */}
        {/* 6. Dashboard (fixed at the bottom)                                        */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-20 z-30 w-64 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section of Sidebar (Items 1 to 5 in exact required sequence) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Candidate Navigation
            </div>

            {/* 1. Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

            {/* 2. Applications */}
            <button
              onClick={() => {
                setActiveTab('applications');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'applications'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 ${activeTab === 'applications' ? 'text-white' : 'text-slate-500'}`} />
                <span>Applications</span>
              </div>
              {activeApplicationsCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'applications'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {activeApplicationsCount}
                </span>
              )}
            </button>

            {/* 3. Arena */}
            <button
              onClick={() => {
                setActiveTab('arena');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'arena'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className={`w-4 h-4 ${activeTab === 'arena' ? 'text-white' : 'text-slate-500'}`} />
                <span>Arena</span>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  activeTab === 'arena'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                PRO
              </span>
            </button>

            {/* 4. Profile */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-500'}`} />
                <span>Profile</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'profile'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                92%
              </span>
            </button>

            {/* 5. Notifications */}
            <button
              onClick={() => {
                setActiveTab('notifications');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-white' : 'text-slate-500'}`} />
                <span>Notifications</span>
              </div>
              {unreadNotificationCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'notifications'
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Bottom Section of Sidebar: Item 6 (Dashboard fixed at the bottom) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
              Activity Hub
            </div>

            {/* 6. Dashboard (fixed at the bottom) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80'
              }`}
              title="Candidate Activity Dashboard & Audit Logs"
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
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-w-0">
          
          {/* STEP 3: OVERVIEW SECTION */}
          {activeTab === 'overview' && (
            <CandidateOverviewView
              candidateProfile={profile}
              hiringDrives={drives}
              applications={applications}
              notifications={notifications}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenDriveDetail={(drive) => setSelectedDrive(drive)}
              onOpenQrCheckIn={(app) => setQrCheckInApp(app)}
              onOpenStandbyModal={(app) => setStandbyModalApp(app)}
              onOpenAbsenceModal={(app) => setAbsenceModalApp(app)}
            />
          )}

          {/* STEP 4: APPLICATIONS SECTION */}
          {activeTab === 'applications' && (
            <CandidateApplicationsView
              applications={applications}
              hiringDrives={drives}
              onOpenApplicationDetail={(app) => setSelectedApplication(app)}
              onOpenQrCheckIn={(app) => setQrCheckInApp(app)}
              onOpenStandbyModal={(app) => setStandbyModalApp(app)}
              onOpenAbsenceModal={(app) => setAbsenceModalApp(app)}
              onNavigateToOpportunities={() => setActiveTab('overview')}
            />
          )}

          {/* STEP 5: ARENA SECTION */}
          {activeTab === 'arena' && (
            <CandidateArenaView />
          )}

          {/* STEP 6: CANDIDATE PROFILE SECTION */}
          {activeTab === 'profile' && (
            <CandidateProfileView
              profile={profile}
              hiringDrives={drives}
              onNavigateToArena={() => setActiveTab('arena')}
              onLogout={handleLogout}
              onOpenScenarioSwitcher={() => setShowScenarioSwitcher(true)}
            />
          )}

          {/* STEP 7: REAL-TIME NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <CandidateNotificationsView
              notifications={notifications}
              onActionRoute={handleNotificationActionRoute}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* STEP 8: CANDIDATE DASHBOARD - ACTIVITY OVERVIEW */}
          {activeTab === 'dashboard' && (
            <CandidateActivityDashboardView
              profile={profile}
              applications={applications}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* STEPS 9 & 10: PRESERVED MODALS & WORKFLOW DRAWERS                         */}
      {/* ========================================================================= */}

      {/* Opportunity Details & Registration */}
      {selectedDrive && (
        <OpportunityDetailModal
          drive={selectedDrive}
          candidateProfile={profile}
          onClose={() => setSelectedDrive(null)}
          onRegisteredSuccess={() => {
            setSelectedDrive(null);
            refreshData();
            setActiveTab('applications');
          }}
        />
      )}

      {/* Application Detail & Pipeline Timeline */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          candidateProfile={profile}
          onClose={() => setSelectedApplication(null)}
          onOpenQrCheckIn={(app) => {
            setSelectedApplication(null);
            setQrCheckInApp(app);
          }}
          onOpenStandbyModal={(app) => {
            setSelectedApplication(null);
            setStandbyModalApp(app);
          }}
          onOpenAbsenceModal={(app) => {
            setSelectedApplication(null);
            setAbsenceModalApp(app);
          }}
        />
      )}

      {/* Dynamic HMAC QR Code Attendance Check-In Pass */}
      {qrCheckInApp && (
        <QrCheckInModal
          application={qrCheckInApp}
          onClose={() => setQrCheckInApp(null)}
          onCheckInSuccess={() => {
            refreshData();
          }}
        />
      )}

      {/* Standby Invitation & Urgent Replacement Offer */}
      {standbyModalApp && (
        <StandbyInvitationModal
          application={standbyModalApp}
          onClose={() => setStandbyModalApp(null)}
          onActionComplete={() => {
            setStandbyModalApp(null);
            refreshData();
          }}
        />
      )}

      {/* Absence Management & HR Review Simulator */}
      {absenceModalApp && (
        <AbsenceManagementModal
          application={absenceModalApp}
          candidateProfile={profile}
          onClose={() => setAbsenceModalApp(null)}
          onActionComplete={() => {
            setAbsenceModalApp(null);
            refreshData();
          }}
        />
      )}

      {/* QA Scenario Test Switcher Modal */}
      <DemoScenarioSelector
        isOpen={showScenarioSwitcher}
        onClose={() => setShowScenarioSwitcher(false)}
        onOpenRegisterNew={() => {
          setShowScenarioSwitcher(false);
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
};
