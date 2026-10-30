import React, { useState, useEffect } from 'react';
import { recruitmentService } from './services/storageService';
import {
  CandidateProfile,
  Application,
  HiringDrive,
  AppNotification
} from './types/recruitment';
import { MobileContainer } from './components/mobile/MobileContainer';
import { TopHeader } from './components/navigation/TopHeader';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { OpportunityList } from './components/opportunities/OpportunityList';
import { OpportunityDetailModal } from './components/opportunities/OpportunityDetailModal';
import { ApplicationsTracker } from './components/applications/ApplicationsTracker';
import { ApplicationDetailModal } from './components/applications/ApplicationDetailModal';
import { QrCheckInModal } from './components/interview/QrCheckInModal';
import { StandbyInvitationModal } from './components/standby/StandbyInvitationModal';
import { AbsenceManagementModal } from './components/absence/AbsenceManagementModal';
import { NotificationsCenter } from './components/notifications/NotificationsCenter';
import { ProfileView } from './components/profile/ProfileView';
import { DemoScenarioSelector } from './components/common/DemoScenarioSelector';
import { AuthFlow } from './components/auth/AuthFlow';
import { AdminLayout } from './components/admin/AdminLayout';
import { InterviewerLayout } from './components/interviewer/InterviewerLayout';

export default function App() {
  const [platform, setPlatform] = useState<'hr_admin' | 'candidate_mobile' | 'interviewer'>('hr_admin');
  const [profile, setProfile] = useState<CandidateProfile>(recruitmentService.getCurrentProfile());
  const [applications, setApplications] = useState<Application[]>(recruitmentService.getCandidateApplications());
  const [drives, setDrives] = useState<HiringDrive[]>(recruitmentService.getHiringDrives());
  const [notifications, setNotifications] = useState<AppNotification[]>(recruitmentService.getNotifications());
  const [unreadCount, setUnreadCount] = useState<number>(recruitmentService.getUnreadNotificationCount());

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAuthActive, setIsAuthActive] = useState<boolean>(false);

  // Modals & Sub-views
  const [selectedDrive, setSelectedDrive] = useState<HiringDrive | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [qrCheckInApp, setQrCheckInApp] = useState<Application | null>(null);
  const [standbyModalApp, setStandbyModalApp] = useState<Application | null>(null);
  const [absenceModalApp, setAbsenceModalApp] = useState<Application | null>(null);
  const [showScenarioSwitcher, setShowScenarioSwitcher] = useState<boolean>(false);

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = recruitmentService.subscribe(() => {
      setProfile(recruitmentService.getCurrentProfile());
      setApplications([...recruitmentService.getCandidateApplications()]);
      setDrives([...recruitmentService.getHiringDrives()]);
      setNotifications([...recruitmentService.getNotifications()]);
      setUnreadCount(recruitmentService.getUnreadNotificationCount());
    });
    return unsubscribe;
  }, []);

  // Check if any application requires urgent attention (replacement offer, confirmed slot)
  const hasUrgentAction = applications.some(
    (a) =>
      (a.status === 'standby' && a.standbyInfo?.invitationStatus === 'replacement_offered') ||
      (a.status === 'confirmed' && a.interviewSlot && !a.interviewSlot.attendanceVerified)
  );

  // Handle deep-link routes from notifications
  const handleActionRoute = (route?: AppNotification['actionRoute']) => {
    if (!route) return;

    if (route.tab) {
      setActiveTab(route.tab);
    }

    if (route.targetId) {
      const targetApp = recruitmentService.getApplicationById(route.targetId);
      if (targetApp) {
        if (targetApp.status === 'confirmed' && targetApp.interviewSlot) {
          setQrCheckInApp(targetApp);
        } else if (targetApp.status === 'standby') {
          setStandbyModalApp(targetApp);
        } else if (targetApp.absenceRecord && targetApp.status === 'under_review') {
          setAbsenceModalApp(targetApp);
        } else {
          setSelectedApplication(targetApp);
        }
      }
    }
  };

  // HR / Company Admin Dashboard Platform
  if (platform === 'hr_admin') {
    return (
      <AdminLayout
        onSwitchToCandidateApp={() => setPlatform('candidate_mobile')}
        onSwitchToInterviewer={() => setPlatform('interviewer')}
      />
    );
  }

  // Dedicated Interviewer Workspace
  if (platform === 'interviewer') {
    return (
      <InterviewerLayout
        onSwitchToAdmin={() => setPlatform('hr_admin')}
        onSwitchToCandidateApp={() => setPlatform('candidate_mobile')}
      />
    );
  }

  // Candidate Mobile App Auth Screen Flow
  if (isAuthActive) {
    return (
      <MobileContainer
        activeScenarioName="Registration / Authentication"
        onOpenScenarioSwitcher={() => setShowScenarioSwitcher(true)}
        onSwitchToAdmin={() => setPlatform('hr_admin')}
      >
        <AuthFlow onComplete={() => setIsAuthActive(false)} />
        <DemoScenarioSelector
          isOpen={showScenarioSwitcher}
          onClose={() => setShowScenarioSwitcher(false)}
          onOpenRegisterNew={() => setIsAuthActive(true)}
        />
      </MobileContainer>
    );
  }

  // Titles for top header
  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return undefined; // Shows default NIYOJAN wordmark
      case 'opportunities':
        return { title: 'Hiring Opportunities', subtitle: 'Excelsoft Technologies Drives' };
      case 'applications':
        return { title: 'My Applications', subtitle: 'Recruitment Pipeline Tracker' };
      case 'notifications':
        return { title: 'Notification Alerts', subtitle: 'Hiring Updates & Schedules' };
      case 'profile':
        return { title: 'Candidate Profile', subtitle: 'Education, Skills & Venues' };
      default:
        return undefined;
    }
  };

  const headerMeta = getTabTitle();

  return (
    <MobileContainer
      activeScenarioName={recruitmentService.getCurrentPersonaKey()}
      onOpenScenarioSwitcher={() => setShowScenarioSwitcher(true)}
      onSwitchToAdmin={() => setPlatform('hr_admin')}
    >
      {/* 1. TOP HEADER */}
      <TopHeader
        title={headerMeta?.title}
        subtitle={headerMeta?.subtitle}
        showBack={activeTab !== 'home'}
        onBack={() => setActiveTab('home')}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenScenarioSwitcher={() => setShowScenarioSwitcher(true)}
        onSwitchToAdmin={() => setPlatform('hr_admin')}
        unreadNotificationsCount={unreadCount}
      />

      {/* 2. SCROLLABLE TAB CONTENT */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeDashboard
            profile={profile}
            applications={applications}
            notifications={notifications}
            hiringDrives={drives}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenApplicationDetail={(app) => setSelectedApplication(app)}
            onOpenDriveDetail={(drive) => setSelectedDrive(drive)}
            onOpenQrCheckIn={(app) => setQrCheckInApp(app)}
            onOpenStandbyModal={(app) => setStandbyModalApp(app)}
            onOpenAbsenceModal={(app) => setAbsenceModalApp(app)}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityList
            drives={drives}
            candidateProfile={profile}
            onSelectDrive={(drive) => setSelectedDrive(drive)}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsTracker
            applications={applications}
            candidateProfile={profile}
            onOpenApplicationDetail={(app) => setSelectedApplication(app)}
            onOpenQrCheckIn={(app) => setQrCheckInApp(app)}
            onOpenStandbyModal={(app) => setStandbyModalApp(app)}
            onOpenAbsenceModal={(app) => setAbsenceModalApp(app)}
            onNavigateToOpportunities={() => setActiveTab('opportunities')}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsCenter
            notifications={notifications}
            onActionRoute={handleActionRoute}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onLogout={() => setIsAuthActive(true)}
            onOpenScenarioSwitcher={() => setShowScenarioSwitcher(true)}
          />
        )}
      </main>

      {/* 3. PERSISTENT BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadCount={unreadCount}
        urgentApplicationAction={hasUrgentAction}
      />

      {/* 4. MODALS & WORKFLOW DRAWERS */}

      {/* Opportunity Details & Registration */}
      {selectedDrive && (
        <OpportunityDetailModal
          drive={selectedDrive}
          candidateProfile={profile}
          onClose={() => setSelectedDrive(null)}
          onRegisteredSuccess={() => {
            setSelectedDrive(null);
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

      {/* QR & OTP Attendance Check-In Pass */}
      {qrCheckInApp && (
        <QrCheckInModal
          application={qrCheckInApp}
          onClose={() => setQrCheckInApp(null)}
          onCheckInSuccess={() => {
            // refresh
            setApplications([...recruitmentService.getCandidateApplications()]);
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
            setApplications([...recruitmentService.getCandidateApplications()]);
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
            setApplications([...recruitmentService.getCandidateApplications()]);
          }}
        />
      )}

      {/* QA Scenario Test Switcher Modal */}
      <DemoScenarioSelector
        isOpen={showScenarioSwitcher}
        onClose={() => setShowScenarioSwitcher(false)}
        onOpenRegisterNew={() => {
          setShowScenarioSwitcher(false);
          setIsAuthActive(true);
        }}
      />
    </MobileContainer>
  );
}
