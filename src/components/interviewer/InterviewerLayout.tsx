import React, { useState, useEffect } from 'react';
import { GlobalNavbar } from '../common/GlobalNavbar';
import { recruitmentService } from '../../services/storageService';
import { clientAuthService } from '../../services/firebaseAuth';
import {
  InterviewerProfile,
  InterviewerCandidateSnapshot,
  InterviewEvaluation,
  InterviewerIncident,
  InterviewerConflict
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
import { InterviewerQrScannerModal } from './InterviewerQrScannerModal';
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
  ChevronUp,
  Menu,
  X,
  Smartphone,
  ShieldCheck,
  Building2,
  RefreshCw,
  Home,
  CheckCircle2,
  Search,
  Filter,
  Star,
  Lock,
  Activity,
  FileText
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
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Real-time Evaluations state
  const [evaluations, setEvaluations] = useState<InterviewEvaluation[]>(recruitmentService.getEvaluations());
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);
  const [scorecardSearch, setScorecardSearch] = useState<string>('');
  const [scorecardFilter, setScorecardFilter] = useState<string>('all');
  const [scorecardSuccessNotice, setScorecardSuccessNotice] = useState<string | null>(null);

  // Real-time Incidents & Conflicts state
  const [incidents, setIncidents] = useState<InterviewerIncident[]>(recruitmentService.getIncidents());
  const [conflicts, setConflicts] = useState<InterviewerConflict[]>(recruitmentService.getConflicts());
  const [incidentFilter, setIncidentFilter] = useState<string>('all');
  const [incidentSearch, setIncidentSearch] = useState<string>('');
  const [incidentSuccessNotice, setIncidentSuccessNotice] = useState<string | null>(null);
  const [conflictSuccessNotice, setConflictSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setInterviewer(recruitmentService.getActiveInterviewer());
      setEvaluations(recruitmentService.getEvaluations());
      setIncidents(recruitmentService.getIncidents());
      setConflicts(recruitmentService.getConflicts());
    };
    recruitmentService.fetchEvaluations().then((res) => {
      if (res && res.length > 0) setEvaluations(res);
    });
    recruitmentService.fetchIncidents().then((res) => {
      if (res && res.length > 0) setIncidents(res);
    });
    recruitmentService.fetchConflicts().then((res) => {
      if (res && res.length > 0) setConflicts(res);
    });
    const unsubscribe = recruitmentService.subscribe(update);
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
        {
          id: 'scorecards' as InterviewerNavTab,
          label: 'Feedback & Scorecards',
          icon: FileCheck2,
          badge: evaluations.length > 0 ? evaluations.length : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-800'
        }
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
        {
          id: 'conflicts' as InterviewerNavTab,
          label: 'Conflict of Interest',
          icon: ShieldAlert,
          badge: conflicts.length > 0 ? conflicts.length : undefined,
          badgeColor: 'bg-rose-100 text-rose-800'
        },
        {
          id: 'incidents' as InterviewerNavTab,
          label: 'Incident Reporting',
          icon: AlertTriangle,
          badge: incidents.length > 0 ? incidents.length : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {(item as any).badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : (item as any).badgeColor || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {(item as any).badge}
                        </span>
                      )}
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
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Scan Candidate Pass</span>
            </button>

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
              onOpenQrScanner={() => setIsScannerOpen(true)}
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
                  onOpenQrScanner={() => setIsScannerOpen(true)}
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
                  onOpenQrScanner={() => setIsScannerOpen(true)}
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Submitted Scorecards & Recommendations</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {evaluations.length} Synced
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live technical assessments submitted to the Central HR Hiring Committee with real-time audit sync
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-semibold text-emerald-700">Real-Time Sync Active</span>
                    </div>
                  </div>

                  {scorecardSuccessNotice && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{scorecardSuccessNotice}</span>
                      </div>
                      <button
                        onClick={() => setScorecardSuccessNotice(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Search & Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={scorecardSearch}
                        onChange={(e) => setScorecardSearch(e.target.value)}
                        placeholder="Search candidate, strengths, recommendation reason..."
                        className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <select
                        value={scorecardFilter}
                        onChange={(e) => setScorecardFilter(e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option value="all">All Recommendations</option>
                        <option value="recommend_next_round">Recommend Next Round</option>
                        <option value="select">Select / Strong Hire</option>
                        <option value="hold">Hold</option>
                        <option value="other_role">Fit for Other Role</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Evaluations List */}
                  {evaluations
                    .filter((ev) => {
                      const q = scorecardSearch.toLowerCase();
                      const matchQuery =
                        ev.candidateName.toLowerCase().includes(q) ||
                        ev.roundName.toLowerCase().includes(q) ||
                        (ev.overallSummary || '').toLowerCase().includes(q) ||
                        (ev.recommendationReason || '').toLowerCase().includes(q) ||
                        (ev.strengths || []).some((s: string) => s.toLowerCase().includes(q));
                      const matchFilter = scorecardFilter === 'all' || ev.recommendation === scorecardFilter;
                      return matchQuery && matchFilter;
                    })
                    .map((ev) => {
                      const avgCriteria =
                        ev.criteriaScores && ev.criteriaScores.length > 0
                          ? (
                              ev.criteriaScores.reduce((sum: number, c: any) => sum + Number(c.rating ?? c.score ?? 0), 0) /
                              ev.criteriaScores.length
                            ).toFixed(1)
                          : '4.2';

                      const isExpanded = expandedEvalId === ev.id;

                      const getRecPill = (rec: string) => {
                        switch (rec) {
                          case 'recommend_next_round':
                            return { label: 'Recommend Next Round', bg: 'bg-emerald-600 text-white' };
                          case 'select':
                            return { label: 'Select / Strong Hire', bg: 'bg-indigo-600 text-white' };
                          case 'hold':
                            return { label: 'Hold / Re-evaluate', bg: 'bg-amber-600 text-white' };
                          case 'other_role':
                            return { label: 'Alternative Role', bg: 'bg-blue-600 text-white' };
                          case 'reject':
                            return { label: 'Do Not Proceed', bg: 'bg-rose-600 text-white' };
                          default:
                            return { label: (rec || 'Completed').replace(/_/g, ' '), bg: 'bg-slate-700 text-white' };
                        }
                      };

                      const recBadge = getRecPill(ev.recommendation);

                      return (
                        <div
                          key={ev.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900">{ev.candidateName}</h3>
                                <span className="text-xs text-slate-400">&bull;</span>
                                <span className="text-xs font-medium text-slate-600">{ev.roundName}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Evaluated by {ev.interviewerName} ({ev.interviewerRole || 'Technical Panel Lead'}) &bull;{' '}
                                {new Date(ev.submittedAt || ev.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} IST
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                                <span>{avgCriteria} / 5.0</span>
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${recBadge.bg}`}>
                                {recBadge.label}
                              </span>
                            </div>
                          </div>

                          {/* Overall Synthesis */}
                          {ev.overallSummary && (
                            <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                              "{ev.overallSummary}"
                            </p>
                          )}

                          {/* Recommendation Rationale */}
                          {ev.recommendationReason && (
                            <div className="text-xs text-slate-800 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                Interviewer Recommendation Rationale:
                              </div>
                              <div className="font-medium text-slate-800">{ev.recommendationReason}</div>
                            </div>
                          )}

                          {/* Strengths & Growth Areas */}
                          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                            {ev.strengths && ev.strengths.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-500">Strengths:</span>
                                {ev.strengths.map((str: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  >
                                    {str}
                                  </span>
                                ))}
                              </div>
                            )}

                            {ev.areasOfImprovement && ev.areasOfImprovement.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-500">Areas of Growth:</span>
                                {ev.areasOfImprovement.map((imp: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                                  >
                                    {imp}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Expandable Criteria Scores Breakdown */}
                          {ev.criteriaScores && ev.criteriaScores.length > 0 && (
                            <div className="pt-2 border-t border-slate-100">
                              <button
                                onClick={() => setExpandedEvalId(isExpanded ? null : ev.id)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                              >
                                <span>{isExpanded ? 'Hide Detailed Scoring' : 'View Criteria Breakdown (5 Rubrics)'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              {isExpanded && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                  {ev.criteriaScores.map((crit: any, ci: number) => (
                                    <div
                                      key={ci}
                                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800">{crit.name}</span>
                                        <span className="font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                          {crit.rating ?? crit.score} / 5
                                        </span>
                                      </div>
                                      {(crit.observation || crit.comments) && (
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                          {crit.observation || crit.comments}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {evaluations.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                      No candidate scorecards submitted yet. Evaluate scheduled candidates from Today's Schedule or Live Console.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'availability' && (
                <InterviewerAvailabilityView interviewer={interviewer} />
              )}

              {activeTab === 'conflicts' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Declared Conflicts of Interest</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {conflicts.length} Declared
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Confidential declarations recorded for unbiased candidate evaluation and automated panel reassignment
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-emerald-700">Real-Time Sync Active</span>
                      </div>
                      <button
                        onClick={() =>
                          setConflictModalSlot({
                            candidateId: 'cand_advisory',
                            candidateName: 'Candidate Under Review'
                          })
                        }
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Declare Conflict</span>
                      </button>
                    </div>
                  </div>

                  {conflictSuccessNotice && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{conflictSuccessNotice}</span>
                      </div>
                      <button
                        onClick={() => setConflictSuccessNotice(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Confidential Protocol Guarantee Notice */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2.5 text-xs leading-relaxed">
                    <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Protected Privacy & Governance Guarantee:</strong> Declarations are strictly accessible to Central HR Coordinators. Candidates and fellow panelists never receive conflict details; candidate interview slots are seamlessly rerouted to peer panels with matching competency benchmarks.
                    </div>
                  </div>

                  {/* Dynamic Conflicts List */}
                  {conflicts.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                      <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-600">Zero Active Conflicts Declared</div>
                      <p className="max-w-md mx-auto text-slate-400">
                        No active conflicts of interest registered for your panel. If you recognize a scheduled candidate as a former colleague, relative, or student, click "Declare Conflict" to ensure objective assessment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conflicts.map((cnf) => {
                        const getCategoryLabel = (cat: string) => {
                          switch (cat) {
                            case 'personal_relationship':
                              return 'Personal / Family Relationship';
                            case 'previous_professional':
                              return 'Previous Professional Relationship';
                            case 'reporting_hierarchy':
                              return 'Former Manager / Report';
                            case 'financial_interest':
                              return 'Financial / Business Interest';
                            case 'academic_affiliation':
                              return 'Academic / University Affiliation';
                            default:
                              return cat.replace(/_/g, ' ');
                          }
                        };

                        return (
                          <div
                            key={cnf.id}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-rose-300 transition-all shadow-2xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-slate-900">{cnf.candidateName}</h3>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                    {getCategoryLabel(cnf.category)}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  Ref #{cnf.id} &bull; Panel {interviewer.assignedPanel} &bull; Declared{' '}
                                  {new Date(cnf.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} IST
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
                                  <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                  <span>{cnf.status === 'reassigned' ? 'Reassigned to Alternative Panel' : 'Pending Panel Reassignment'}</span>
                                </span>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-xs text-rose-950 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                                Confidential Declaration Statement:
                              </span>
                              <p className="italic leading-relaxed">{cnf.confidentialReason}</p>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span className="flex items-center gap-1 text-slate-600">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>HR Command Desk Alerted &bull; Candidate slot protected from adverse flags</span>
                              </span>
                              <span className="font-mono text-slate-400">Drive: {cnf.hiringDriveId}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'incidents' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Operational & Technical Incident Reports</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {incidents.length} Dispatched
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live dispatched tickets for venue hardware, network drops, candidate delays, and compiler outages
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-emerald-700">Real-Time Sync Active</span>
                      </div>
                      <button
                        onClick={() => setIncidentModalSlot({})}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Report New Issue</span>
                      </button>
                    </div>
                  </div>

                  {incidentSuccessNotice && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{incidentSuccessNotice}</span>
                      </div>
                      <button
                        onClick={() => setIncidentSuccessNotice(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Search & Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={incidentSearch}
                        onChange={(e) => setIncidentSearch(e.target.value)}
                        placeholder="Search incident classification, description, candidate name, ticket ID..."
                        className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <select
                        value={incidentFilter}
                        onChange={(e) => setIncidentFilter(e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical Severity</option>
                        <option value="high">High Severity</option>
                        <option value="medium">Medium Severity</option>
                        <option value="low">Low Severity</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Incident Tickets List */}
                  {incidents.filter((inc) => {
                    const q = incidentSearch.toLowerCase();
                    const matchQuery =
                      inc.category.toLowerCase().includes(q) ||
                      inc.description.toLowerCase().includes(q) ||
                      (inc.candidateName || '').toLowerCase().includes(q) ||
                      inc.id.toLowerCase().includes(q);
                    const matchFilter = incidentFilter === 'all' || inc.severity === incidentFilter;
                    return matchQuery && matchFilter;
                  }).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="font-semibold text-slate-700">Zero Active Open Incident Tickets</div>
                      <p className="max-w-md mx-auto text-slate-400">
                        Everything is operational for Panel 1. If you encounter network latency spikes, compiler errors, or candidate hardware issues, click "Report New Issue".
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {incidents
                        .filter((inc) => {
                          const q = incidentSearch.toLowerCase();
                          const matchQuery =
                            inc.category.toLowerCase().includes(q) ||
                            inc.description.toLowerCase().includes(q) ||
                            (inc.candidateName || '').toLowerCase().includes(q) ||
                            inc.id.toLowerCase().includes(q);
                          const matchFilter = incidentFilter === 'all' || inc.severity === incidentFilter;
                          return matchQuery && matchFilter;
                        })
                        .map((inc) => {
                          const getCategoryTitle = (cat: string) => {
                            switch (cat) {
                              case 'network_connectivity':
                                return 'Network / Bandwidth Connectivity Drop';
                              case 'audio_video_failure':
                                return 'Audio / Video Hardware Streaming Failure';
                              case 'candidate_unresponsive':
                                return 'Candidate Dropped / Session Unresponsive';
                              case 'venue_overlap':
                                return 'Venue Room Overlap / Physical Double-Booking';
                              case 'assessment_platform_error':
                                return 'Assessment Engine / Compiler Service Error';
                              case 'identity_discrepancy':
                                return 'Suspected Candidate Identity Discrepancy';
                              default:
                                return cat.replace(/_/g, ' ');
                            }
                          };

                          const getSeverityBadge = (sev: string) => {
                            switch (sev) {
                              case 'critical':
                                return 'bg-rose-600 text-white border-rose-700';
                              case 'high':
                                return 'bg-amber-600 text-white border-amber-700';
                              case 'medium':
                                return 'bg-blue-600 text-white border-blue-700';
                              case 'low':
                              default:
                                return 'bg-slate-600 text-white border-slate-700';
                            }
                          };

                          return (
                            <div
                              key={inc.id}
                              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-all shadow-2xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">{getCategoryTitle(inc.category)}</h3>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(
                                        inc.severity
                                      )}`}
                                    >
                                      {inc.severity} Severity
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                    Ticket #{inc.id} &bull; Panel {interviewer.assignedPanel} &bull; Dispatched{' '}
                                    {new Date(inc.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })} IST
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>{inc.status === 'resolved' ? 'Ticket Resolved' : 'Dispatched to Venue IT Desk'}</span>
                                  </span>
                                </div>
                              </div>

                              {inc.candidateName && (
                                <div className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Attached:</span>
                                  <span className="text-slate-800 font-bold">{inc.candidateName}</span>
                                  {inc.slotId && <span className="font-mono text-slate-400">({inc.slotId})</span>}
                                </div>
                              )}

                              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-sans">
                                "{inc.description}"
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Reported by {inc.interviewerName} &bull; Logged in Venue Audit Ledger</span>
                                </span>
                                <span className="font-mono text-slate-400">Drive: {inc.hiringDriveId}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
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
            const candName = activeScorecardSlot?.candidateName || 'Candidate';
            setActiveScorecardSlot(null);
            setActiveExecutionSlot(null);
            const freshEvals = recruitmentService.getEvaluations();
            setEvaluations(freshEvals);
            setActiveTab('scorecards');
            setScorecardSuccessNotice(
              `Evaluation for ${candName} synchronized in real time! Added to Feedback & Scorecards and transmitted to HR Command Center.`
            );
            setTimeout(() => setScorecardSuccessNotice(null), 5000);
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
          onDeclared={() => {
            const fresh = recruitmentService.getConflicts();
            setConflicts(fresh);
            setActiveTab('conflicts');
            setConflictSuccessNotice(
              'Conflict declaration recorded confidentially! Candidate queued for panel reassignment by HR Coordinators.'
            );
            setTimeout(() => setConflictSuccessNotice(null), 6000);
          }}
        />
      )}

      {incidentModalSlot && (
        <IncidentReportModal
          slotId={incidentModalSlot.slotId}
          candidateName={incidentModalSlot.candidateName}
          candidateId={incidentModalSlot.candidateId}
          applicationId={incidentModalSlot.applicationId}
          onClose={() => setIncidentModalSlot(null)}
          onReported={() => {
            const fresh = recruitmentService.getIncidents();
            setIncidents(fresh);
            setActiveTab('incidents');
            setIncidentSuccessNotice(
              'Incident ticket dispatched in real time to Venue IT Desk & Operations! Added to active incidents ledger.'
            );
            setTimeout(() => setIncidentSuccessNotice(null), 6000);
          }}
        />
      )}

      {/* Venue QR Scanner Modal */}
      <InterviewerQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCandidateAdmitted={(candidateId, slotId) => {
          setInterviewer(recruitmentService.getActiveInterviewer());
          if (activeExecutionSlot && (activeExecutionSlot.candidateId === candidateId || activeExecutionSlot.slotId === slotId)) {
            setActiveExecutionSlot((prev: any) =>
              prev ? { ...prev, executionStatus: 'candidate_present' } : null
            );
          }
        }}
      />
    </div>
  );
};
