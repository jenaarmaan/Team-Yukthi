import React, { useState, useEffect } from 'react';
import { recruitmentService } from './services/storageService';
import {
  CandidateProfile,
  Application,
  HiringDrive,
  AppNotification
} from './types/recruitment';
import { CandidateDashboardLayout, CandidateSidebarTab } from './components/candidate/CandidateDashboardLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { InterviewerLayout } from './components/interviewer/InterviewerLayout';
import { PublicHomePage, PublicWorkspaceTarget } from './components/public/PublicHomePage';
import { AuthPage } from './components/auth/AuthPage';
import { clientAuthService } from './services/firebaseAuth';
import { AssistantWidget } from './components/assistant/AssistantWidget';
import { AssistantRole } from './components/assistant/types';

export default function App() {
  const [platform, setPlatform] = useState<'home' | 'login' | 'hr_admin' | 'candidate_mobile' | 'interviewer'>('home');
  const [profile, setProfile] = useState<CandidateProfile>(recruitmentService.getCurrentProfile());
  const [applications, setApplications] = useState<Application[]>(recruitmentService.getCandidateApplications());
  const [drives, setDrives] = useState<HiringDrive[]>(recruitmentService.getHiringDrives());
  const [notifications, setNotifications] = useState<AppNotification[]>(recruitmentService.getNotifications());
  const [unreadCount, setUnreadCount] = useState<number>(recruitmentService.getUnreadNotificationCount());

  // Navigation & View States
  const [candidateTab, setCandidateTab] = useState<CandidateSidebarTab>('overview');
  const [isAuthActive, setIsAuthActive] = useState<boolean>(false);

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

  // Determine current active role for the persistent AI Assistant
  const getAssistantRole = (): AssistantRole => {
    if (platform === 'home' || platform === 'login') {
      const user = clientAuthService.getCurrentUser();
      return (user?.role as AssistantRole) || 'guest';
    }
    if (platform === 'hr_admin') {
      return (recruitmentService.getCurrentAdminRole() as AssistantRole) || 'hr_admin';
    }
    if (platform === 'interviewer') {
      return 'interviewer';
    }
    if (platform === 'candidate_mobile') {
      return 'candidate';
    }
    return 'guest';
  };

  // Contextual Assistant Action Router
  const handleAssistantNavigate = (action: string) => {
    if (action === 'open_drives') {
      if (platform === 'candidate_mobile') {
        setCandidateTab('overview');
      } else {
        setPlatform('hr_admin');
      }
    } else if (action === 'open_qr_pass' || action === 'open_scanner_desk' || action === 'open_attendance') {
      if (platform === 'candidate_mobile') {
        setCandidateTab('overview');
      } else {
        setPlatform('hr_admin');
      }
    } else if (action === 'open_standby') {
      if (platform === 'candidate_mobile') {
        setCandidateTab('overview');
      } else {
        setPlatform('hr_admin');
      }
    } else if (action === 'open_absence' || action === 'open_absence_governance') {
      if (platform === 'candidate_mobile') {
        setCandidateTab('overview');
      } else {
        setPlatform('hr_admin');
      }
    } else if (action === 'open_applications') {
      setCandidateTab('applications');
      setPlatform('candidate_mobile');
    } else if (action === 'open_profile') {
      setCandidateTab('profile');
      setPlatform('candidate_mobile');
    } else if (action === 'open_arena') {
      setCandidateTab('arena');
      setPlatform('candidate_mobile');
    } else if (action === 'open_notifications') {
      setCandidateTab('notifications');
      setPlatform('candidate_mobile');
    } else if (action === 'open_activity' || action === 'open_dashboard') {
      setCandidateTab('dashboard');
      setPlatform('candidate_mobile');
    } else if (action === 'open_interviewer_workspace') {
      recruitmentService.switchAdminRole('interviewer');
      setPlatform('interviewer');
    } else if (action === 'open_analytics') {
      setPlatform('hr_admin');
    } else if (action === 'open_auth') {
      setPlatform('login');
    } else if (action === 'open_docs') {
      setPlatform('home');
      setTimeout(() => {
        document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Active Screen Renderer
  const renderScreen = () => {
    // 1. Public Homepage as Default Screen
    if (platform === 'home') {
      return (
        <PublicHomePage
          onSelectWorkspace={(workspace: PublicWorkspaceTarget) => {
            if (workspace === 'candidate') {
              setPlatform('candidate_mobile');
            } else if (workspace === 'interviewer') {
              recruitmentService.switchAdminRole('interviewer');
              setPlatform('interviewer');
            } else {
              // hr_admin, recruitment_manager, interview_coordinator, super_admin
              recruitmentService.switchAdminRole(workspace);
              setPlatform('hr_admin');
            }
          }}
          onOpenAuth={() => {
            setPlatform('login');
          }}
        />
      );
    }

    // 2. Dedicated Authentication Landing Page (Login / Register / Forgot Password)
    if (platform === 'login') {
      return (
        <AuthPage
          initialView="login"
          onBackToHome={() => setPlatform('home')}
          onSuccess={(role) => {
            if (role === 'candidate') {
              setPlatform('candidate_mobile');
            } else if (role === 'interviewer') {
              recruitmentService.switchAdminRole('interviewer');
              setPlatform('interviewer');
            } else {
              recruitmentService.switchAdminRole(role);
              setPlatform('hr_admin');
            }
          }}
        />
      );
    }

    // 3. HR / Company Admin Dashboard Platform (Super Admin, HR Admin, Recruitment Manager, Coordinator)
    if (platform === 'hr_admin') {
      return (
        <AdminLayout
          onSwitchToCandidateApp={() => setPlatform('candidate_mobile')}
          onSwitchToInterviewer={() => setPlatform('interviewer')}
          onSwitchToHome={() => setPlatform('home')}
          onLogout={() => setPlatform('home')}
        />
      );
    }

    // 4. Dedicated Interviewer Workspace
    if (platform === 'interviewer') {
      return (
        <InterviewerLayout
          onSwitchToAdmin={() => setPlatform('hr_admin')}
          onSwitchToCandidateApp={() => setPlatform('candidate_mobile')}
          onSwitchToHome={() => setPlatform('home')}
          onLogout={() => setPlatform('home')}
        />
      );
    }

    // 5. Candidate Register / Authentication Screen Flow
    if (isAuthActive) {
      return (
        <AuthPage
          initialView="choose_role"
          onBackToHome={() => setIsAuthActive(false)}
          onSuccess={(role) => {
            setIsAuthActive(false);
            if (role === 'candidate') {
              setPlatform('candidate_mobile');
            } else if (role === 'interviewer') {
              recruitmentService.switchAdminRole('interviewer');
              setPlatform('interviewer');
            } else {
              recruitmentService.switchAdminRole(role);
              setPlatform('hr_admin');
            }
          }}
        />
      );
    }

    // 6. Candidate Desktop Web Platform (Step 1: Desktop-first webpage layout)
    return (
      <CandidateDashboardLayout
        initialTab={candidateTab}
        onSwitchToAdmin={() => setPlatform('hr_admin')}
        onSwitchToInterviewer={() => {
          recruitmentService.switchAdminRole('interviewer');
          setPlatform('interviewer');
        }}
        onSwitchToHome={() => setPlatform('home')}
        onLogout={() => setPlatform('home')}
      />
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Active Application Screen */}
      {renderScreen()}

      {/* 2. Persistent Floating AI-Powered Role-Aware Recruitment Assistant */}
      <AssistantWidget
        currentRole={getAssistantRole()}
        onNavigateAction={handleAssistantNavigate}
      />
    </div>
  );
}
