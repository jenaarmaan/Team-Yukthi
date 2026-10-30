import React, { useState, useEffect } from 'react';
import { GlobalNavbar } from '../common/GlobalNavbar';
import { recruitmentService } from '../../services/storageService';
import { clientAuthService } from '../../services/firebaseAuth';
import {
  InterviewerProfile,
  InterviewerCandidateSnapshot
} from '../../types/recruitment';
import { InterviewerDashboard } from './InterviewerDashboard';
import { CandidateSnapshotModal } from './CandidateSnapshotModal';
import { InterviewExecutionView } from './InterviewExecutionView';
import { InterviewScorecardModal } from './InterviewScorecardModal';
import { QuestionSuggestionPanel } from './QuestionSuggestionPanel';
import { InterviewerAvailabilityView } from './InterviewerAvailabilityView';
import { ConflictDeclarationModal } from './ConflictDeclarationModal';
import { IncidentReportModal } from './IncidentReportModal';
import { InterviewerProfileView } from './InterviewerProfileView';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Sparkles,
  Users,
  FileCheck2,
  Coffee,
  ShieldAlert,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  ShieldCheck,
  Building2,
  RefreshCw,
  Home
} from 'lucide-react';

interface InterviewerLayoutProps {
  onSwitchToAdmin: () => void;
  onSwitchToCandidateApp: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
}

export type InterviewerNavTab =
  | 'dashboard'
  | 'schedule'
  | 'candidates'
  | 'questions'
  | 'scorecards'
  | 'availability'
  | 'conflicts'
  | 'incidents'
  | 'profile';

export const InterviewerLayout: React.FC<InterviewerLayoutProps> = ({
  onSwitchToAdmin,
  onSwitchToCandidateApp,
  onSwitchToHome,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<InterviewerNavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [interviewer, setInterviewer] = useState<InterviewerProfile>(
    recruitmentService.getActiveInterviewer()
  );

  const handleLogout = async () => {
    await clientAuthService.logout();
    if (onLogout) {
      onLogout();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  // Modals & Sub-views state
  const [snapshotCandidate, setSnapshotCandidate] = useState<InterviewerCandidateSnapshot | null>(null);
  const [activeExecutionSlot, setActiveExecutionSlot] = useState<any | null>(null);
  const [activeScorecardSlot, setActiveScorecardSlot] = useState<any | null>(null);
  const [conflictModalSlot, setConflictModalSlot] = useState<any | null>(null);
  const [incidentModalSlot, setIncidentModalSlot] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = recruitmentService.subscribe(() => {
      setInterviewer(recruitmentService.getActiveInterviewer());
    });
    return unsubscribe;
  }, []);

  const handleOpenCandidateSnapshot = async (candidateId: string) => {
    const snap = await recruitmentService.fetchCandidateSnapshot(candidateId);
    if (snap) {
      setSnapshotCandidate(snap);
    }
  };

  const navGroups = [
    {
      group: 'MY WORKSPACE',
      items: [
        { id: 'dashboard' as InterviewerNavTab, label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'schedule' as InterviewerNavTab, label: 'Today’s Schedule', icon: Calendar }
      ]
    },
    {
      group: 'INTERVIEW MANAGEMENT',
      items: [
        { id: 'candidates' as InterviewerNavTab, label: 'Candidate Profiles', icon: Users },
        { id: 'questions' as InterviewerNavTab, label: 'Suggested Questions', icon: Sparkles },
        { id: 'scorecards' as InterviewerNavTab, label: 'Feedback & Scorecards', icon: FileCheck2 }
      ]
    },
    {
      group: 'AVAILABILITY & LEAVES',
      items: [
        { id: 'availability' as InterviewerNavTab, label: 'Availability Calendar', icon: Clock }
      ]
    },
    {
      group: 'GOVERNANCE & SUPPORT',
      items: [
        { id: 'conflicts' as InterviewerNavTab, label: 'Conflict of Interest', icon: ShieldAlert },
        { id: 'incidents' as InterviewerNavTab, label: 'Incident Reporting', icon: AlertTriangle },
        { id: 'profile' as InterviewerNavTab, label: 'My Panelist Profile', icon: User }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR */}
      <GlobalNavbar
        currentPlatform="interviewer"
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
          if (ws === 'candidate' && onSwitchToCandidateApp) onSwitchToCandidateApp();
          else if (ws !== 'interviewer' && onSwitchToAdmin) onSwitchToAdmin();
        }}
      />

      {/* Main App Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 lg:p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white lg:bg-transparent border-r lg:border-r-0 border-slate-200 p-4 lg:p-0 flex flex-col justify-between transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Quick Panelist Switcher footer */}
          <div className="space-y-2 mt-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Panel</span>
              <span className="font-bold text-slate-800 block text-xs">{interviewer.assignedPanel}</span>
              <span className="text-[11px] text-slate-500 block">{interviewer.location} Campus</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          {activeExecutionSlot ? (
            <InterviewExecutionView
              slotId={activeExecutionSlot.slotId}
              candidateName={activeExecutionSlot.candidateName}
              candidateId={activeExecutionSlot.candidateId}
              role={activeExecutionSlot.role}
              hiringDriveTitle={activeExecutionSlot.hiringDriveTitle}
              roomOrPanel={activeExecutionSlot.roomOrPanel}
              venue={activeExecutionSlot.location}
              initialStatus={activeExecutionSlot.executionStatus}
              onOpenScorecard={() => setActiveScorecardSlot(activeExecutionSlot)}
              onOpenConflictModal={() => setConflictModalSlot(activeExecutionSlot)}
              onOpenIncidentModal={() => setIncidentModalSlot(activeExecutionSlot)}
              onBackToDashboard={() => setActiveExecutionSlot(null)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <InterviewerDashboard
                  interviewer={interviewer}
                  onOpenCandidateSnapshot={handleOpenCandidateSnapshot}
                  onOpenExecutionRoom={(slot) => setActiveExecutionSlot(slot)}
                  onOpenScorecard={(slot) => setActiveScorecardSlot(slot)}
                  onOpenQuestions={(skills, role) => setActiveTab('questions')}
                  onNavigateTab={(tab) => setActiveTab(tab as any)}
                />
              )}

              {activeTab === 'schedule' && (
                <InterviewerDashboard
                  interviewer={interviewer}
                  onOpenCandidateSnapshot={handleOpenCandidateSnapshot}
                  onOpenExecutionRoom={(slot) => setActiveExecutionSlot(slot)}
                  onOpenScorecard={(slot) => setActiveScorecardSlot(slot)}
                  onOpenQuestions={(skills, role) => setActiveTab('questions')}
                  onNavigateTab={(tab) => setActiveTab(tab as any)}
                />
              )}

              {activeTab === 'candidates' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Assigned Candidate Snapshots</h2>
                      <p className="text-xs text-slate-500">Access authorized academic credentials and multi-tier skill verification</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recruitmentService.getAllCandidates().map(({ profile: c }) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">{c.fullName}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {c.candidateType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {c.education.degree} in {c.education.branch} &bull; CGPA: {c.education.cgpa}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {c.skills.slice(0, 3).map((s) => (
                            <span key={s.name} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                              {s.name}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleOpenCandidateSnapshot(c.id)}
                          className="w-full py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                        >
                          View Full Snapshot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <QuestionSuggestionPanel
                  candidateSkills={['Java', 'Python', 'Data Structures & Algorithms', 'System Design', 'React']}
                  role="Graduate Software Engineer"
                />
              )}

              {activeTab === 'scorecards' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Submitted Scorecards & Recommendations</h2>
                  <p className="text-xs text-slate-500">Evaluations submitted to the Central HR Hiring Committee</p>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Rohan Sharma &bull; Technical Round 1</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase">
                        Recommend Next Round
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      "Cleared DSA and System Basics with distinction (94th percentile). Ready for System Architecture Round 2."
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Evaluated by Dr. Murali Krishna &bull; Criteria Average: 4.2 / 5.0
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <InterviewerAvailabilityView interviewer={interviewer} />
              )}

              {activeTab === 'conflicts' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Declared Conflicts of Interest</h2>
                      <p className="text-xs text-slate-500">Confidential declarations submitted to HR Coordinators</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    No active conflicts declared for your assigned candidate queue. If you recognize a candidate, click "Declare Conflict" on their candidate card or during interview execution.
                  </div>
                </div>
              )}

              {activeTab === 'incidents' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Operational & Technical Incident Reports</h2>
                      <p className="text-xs text-slate-500">Dispatched tickets for venue hardware, network drops, and delays</p>
                    </div>
                    <button
                      onClick={() => setIncidentModalSlot({})}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Report New Issue
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Zero active open incident tickets for Panel 1.
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <InterviewerProfileView
                  interviewer={interviewer}
                  onInterviewerSwitched={() => setInterviewer(recruitmentService.getActiveInterviewer())}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Sub-view Modals */}
      {snapshotCandidate && (
        <CandidateSnapshotModal
          snapshot={snapshotCandidate}
          onClose={() => setSnapshotCandidate(null)}
          onStartInterview={() => {
            setActiveExecutionSlot({
              slotId: snapshotCandidate.slotInfo.slotId,
              candidateName: snapshotCandidate.fullName,
              candidateId: snapshotCandidate.candidateId,
              role: snapshotCandidate.role,
              hiringDriveTitle: snapshotCandidate.hiringDriveTitle,
              roomOrPanel: snapshotCandidate.slotInfo.roomOrPanel,
              location: snapshotCandidate.slotInfo.venue,
              executionStatus: snapshotCandidate.slotInfo.attendanceVerified ? 'candidate_present' : 'scheduled'
            });
            setSnapshotCandidate(null);
          }}
          onOpenScorecard={() => {
            setActiveScorecardSlot({
              slotId: snapshotCandidate.slotInfo.slotId,
              applicationId: snapshotCandidate.applicationId,
              candidateId: snapshotCandidate.candidateId,
              candidateName: snapshotCandidate.fullName,
              hiringDriveId: snapshotCandidate.hiringDriveId,
              role: snapshotCandidate.role
            });
            setSnapshotCandidate(null);
          }}
          onDeclareConflict={() => {
            setConflictModalSlot({
              candidateId: snapshotCandidate.candidateId,
              candidateName: snapshotCandidate.fullName,
              slotId: snapshotCandidate.slotInfo.slotId,
              applicationId: snapshotCandidate.applicationId
            });
            setSnapshotCandidate(null);
          }}
        />
      )}

      {activeScorecardSlot && (
        <InterviewScorecardModal
          slotId={activeScorecardSlot.slotId}
          applicationId={activeScorecardSlot.applicationId}
          candidateId={activeScorecardSlot.candidateId}
          candidateName={activeScorecardSlot.candidateName}
          hiringDriveId={activeScorecardSlot.hiringDriveId}
          role={activeScorecardSlot.role}
          onClose={() => setActiveScorecardSlot(null)}
          onEvaluationSubmitted={() => {
            setActiveScorecardSlot(null);
            setActiveExecutionSlot(null);
            alert('Evaluation synchronized! Recommendation sent to HR Command Center.');
          }}
        />
      )}

      {conflictModalSlot && (
        <ConflictDeclarationModal
          candidateId={conflictModalSlot.candidateId}
          candidateName={conflictModalSlot.candidateName}
          slotId={conflictModalSlot.slotId}
          applicationId={conflictModalSlot.applicationId}
          onClose={() => setConflictModalSlot(null)}
        />
      )}

      {incidentModalSlot && (
        <IncidentReportModal
          slotId={incidentModalSlot.slotId}
          candidateName={incidentModalSlot.candidateName}
          candidateId={incidentModalSlot.candidateId}
          applicationId={incidentModalSlot.applicationId}
          onClose={() => setIncidentModalSlot(null)}
        />
      )}
    </div>
  );
};
