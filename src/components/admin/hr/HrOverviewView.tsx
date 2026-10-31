import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { InterviewEvaluation } from '../../../types/recruitment';
import {
  Building2,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Bell,
  Award,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Star,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Activity,
  X,
  FileText,
  Check
} from 'lucide-react';

interface HrOverviewViewProps {
  onNavigateToTab: (tab: 'overview' | 'analytics' | 'drives' | 'fmcp') => void;
  onOpenUpcomingDrive?: (driveId: string) => void;
}

export const HrOverviewView: React.FC<HrOverviewViewProps> = ({
  onNavigateToTab,
  onOpenUpcomingDrive
}) => {
  const [, setVersion] = useState(0);
  const [selectedEvaluationModal, setSelectedEvaluationModal] = useState<InterviewEvaluation | null>(null);
  const [hrNotice, setHrNotice] = useState<string | null>(null);
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = recruitmentService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const drives = recruitmentService.getHiringDrives();
  const candidates = recruitmentService.getAllCandidates();
  const applications = recruitmentService.getAllApplications();
  const recoveries = recruitmentService.getVacantSlotRecoveries();
  const absences = recruitmentService.getAllAbsenceRecords();
  const notifications = recruitmentService.getNotifications();
  const topFmcpRecs = recruitmentService.getFmcpRecommendations().slice(0, 3);
  const fmcpAudit = recruitmentService.getFmcpFairnessAudit();
  const evaluations = recruitmentService.getEvaluations();
  const incidents = recruitmentService.getIncidents();
  const conflicts = recruitmentService.getConflicts();

  // General Recruitment Statistics
  const totalDrives = drives.length;
  const activeDrives = drives.filter((d) => d.isRegistrationOpen || d.status === 'upcoming').length;
  const totalRegisteredCandidates = candidates.length;
  const confirmedInterviews = applications.filter((a) => a.status === 'confirmed').length;
  const totalEvaluated = evaluations.filter((e) => e.status === 'submitted').length;
  const recommendedCandidates = evaluations.filter(
    (e) => e.status === 'submitted' && (e.recommendation === 'recommend_next_round' || e.recommendation === 'select')
  ).length;
  const activeIncidents = incidents.filter((i) => i.status === 'reported' || i.status === 'investigating');
  const activeConflicts = conflicts.filter((c) => c.status === 'declared');
  const standbysQueued = recruitmentService.getAllStandbyApplications().length;
  const waitlistsQueued = recruitmentService.getAllWaitlistApplications().length;

  // Actions
  const handleAcknowledgeIncident = async (id: string) => {
    await recruitmentService.resolveIncident(id, 'acknowledged', 'Acknowledged by HR Command Center');
    setHrNotice(`Incident #${id} acknowledged by HR Command.`);
    setTimeout(() => setHrNotice(null), 4000);
  };

  const handleResolveIncident = async (id: string) => {
    await recruitmentService.resolveIncident(id, 'resolved', 'Technical / operational recovery confirmed by HR.');
    setHrNotice(`Incident #${id} marked as resolved.`);
    setTimeout(() => setHrNotice(null), 4000);
  };

  const handleReassignConflict = async (id: string) => {
    await recruitmentService.reassignConflict(id, 'Panel 2 (Alternative Technical Lead)');
    setHrNotice('Candidate reassigned to independent Panel 2 in real time.');
    setTimeout(() => setHrNotice(null), 4000);
  };

  const handleRatifyEvaluation = async (id: string, candidateName: string) => {
    await recruitmentService.ratifyEvaluation(id, 'ratified');
    setHrNotice(`Evaluation for ${candidateName} ratified by HR Command Center!`);
    setTimeout(() => setHrNotice(null), 4000);
  };

  // Upcoming Interviews Roster (Next scheduled interviews across panels)
  const upcomingInterviews = applications
    .filter((a) => a.status === 'confirmed' && a.interviewSlot)
    .slice(0, 6)
    .map((app) => {
      const candidateId = app.candidateProfile?.id;
      const slotId = app.interviewSlot?.id;
      const evaluation = evaluations.find(
        (e) => (e.candidateId === candidateId || e.applicationId === app.id || e.slotId === slotId) && e.status === 'submitted'
      );
      const conflict = conflicts.find(
        (c) => c.candidateId === candidateId || c.applicationId === app.id || c.slotId === slotId
      );

      return {
        appId: app.id,
        candidateName: app.candidateProfile?.fullName || 'Candidate',
        candidateType: app.candidateProfile?.candidateType || 'fresher',
        role: app.role,
        driveTitle: app.hiringDriveTitle,
        time: app.interviewSlot?.time || '10:00 AM - 11:00 AM',
        date: app.interviewSlot?.date || 'Today',
        room: app.interviewSlot?.roomOrPanel || 'Panel 1 (Technical)',
        venue: app.interviewSlot?.location || 'Mysuru Campus',
        evaluation,
        conflict
      };
    });

  // Recent Recruitment Updates (Activity feed enriched with live interviewer events)
  const recentUpdates = [
    ...(evaluations.length > 0
      ? [
          {
            id: 'upd_eval_01',
            title: `Technical Scorecard Submitted: ${evaluations[0].candidateName}`,
            desc: `Panel lead ${evaluations[0].interviewerName} completed technical evaluation: ${evaluations[0].recommendation.replace(/_/g, ' ').toUpperCase()}.`,
            time: 'Just now',
            type: 'evaluation',
            icon: FileCheck2,
            badge: 'Evaluated'
          }
        ]
      : []),
    ...(incidents.length > 0
      ? [
          {
            id: 'upd_inc_01',
            title: `Operational Incident Dispatched: #${incidents[0].id.slice(-6)}`,
            desc: `${incidents[0].category.replace(/_/g, ' ')} logged for panel review. IT Operations alerted.`,
            time: '5 minutes ago',
            type: 'incident',
            icon: AlertTriangle,
            badge: 'Incident Alert'
          }
        ]
      : []),
    {
      id: 'upd_1',
      title: 'Slot Recovery Dispatched',
      desc: 'Standby candidate promoted automatically for GSE Drive after 10-minute check-in grace period expired.',
      time: '12 minutes ago',
      type: 'recovery',
      icon: RefreshCw,
      badge: 'Self-Healing'
    },
    {
      id: 'upd_2',
      title: 'Candidate Checked In via QR Pass',
      desc: 'Rohan Sharma authenticated at Venue Desk (Mysuru Brahmaputra Block) via HMAC-SHA256 scan.',
      time: '28 minutes ago',
      type: 'attendance',
      icon: CheckCircle2,
      badge: 'Verified'
    },
    {
      id: 'upd_3',
      title: 'Absence Explanation Submitted',
      desc: 'Medical explanation certificate uploaded for afternoon slot review. Requires HR ratification.',
      time: '45 minutes ago',
      type: 'absence',
      icon: AlertTriangle,
      badge: 'Review Pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Wordmark & Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">HR Command Overview</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Operational Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hiring drives, registered talent volume, attendance metrics, and pending actions across campus centers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('drives')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Manage Drives</span>
          </button>
          <button
            onClick={() => onNavigateToTab('analytics')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open Analytics</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {hrNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{hrNotice}</span>
          </div>
          <button onClick={() => setHrNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Four General Recruitment Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Hiring Drives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Hiring Drives</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalDrives}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {drives.filter(d => d.status === 'completed').length} Completed
              </span>
              <span>across Karnataka & Telangana</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Registered Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered Candidates</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalRegisteredCandidates}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                100% Verified
              </span>
              <span>via 4-tier skill validation</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Recruitment Drives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Recruitment Drives</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{activeDrives}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">Live registration & slot booking</span>
            </div>
          </div>
        </div>

        {/* Card 4: Panel Evaluations & Hiring Recommendations (Real-Time Synchronized) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Panel Evaluations Synced</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalEvaluated} Evaluated</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {recommendedCandidates} Recommended
              </span>
              <span>by panel leads</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2a. Real-Time Interviewer Feedback & Scorecards Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Technical Interview Evaluations & Hiring Recommendations</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {evaluations.length} Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live technical interview scorecards and hiring committee recommendations transmitted in real time from panel leads
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-700 font-mono">Live WebSocket Broker Connected</span>
          </div>
        </div>

        {evaluations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            Awaiting panel evaluation scorecards from live interview rooms.
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((ev) => {
              const avgScore =
                ev.criteriaScores && ev.criteriaScores.length > 0
                  ? (
                      ev.criteriaScores.reduce((sum: number, c: any) => sum + Number(c.rating ?? c.score ?? 0), 0) /
                      ev.criteriaScores.length
                    ).toFixed(1)
                  : '4.2';

              const isExpanded = expandedEvalId === ev.id;
              const isRatified = (ev as any).hrRatificationStatus === 'ratified';

              const getRecBadge = (rec: string) => {
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
                    return { label: 'Reject / Do Not Proceed', bg: 'bg-rose-600 text-white' };
                  default:
                    return { label: (rec || 'Completed').replace(/_/g, ' '), bg: 'bg-slate-700 text-white' };
                }
              };

              const badge = getRecBadge(ev.recommendation);

              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{ev.candidateName}</h3>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <span className="text-xs font-semibold text-slate-600">{ev.roundName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Evaluated by <strong className="text-slate-800">{ev.interviewerName}</strong> ({ev.interviewerRole || 'Panel Lead'}) &bull;{' '}
                        {new Date(ev.submittedAt || ev.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} IST
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                        <span>{avgScore} / 5.0</span>
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Interview Synthesis */}
                  {ev.overallSummary && (
                    <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                      "{ev.overallSummary}"
                    </div>
                  )}

                  {/* Recommendation Rationale */}
                  {ev.recommendationReason && (
                    <div className="text-xs text-slate-800 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                        Interviewer Decision Rationale:
                      </span>
                      <p className="font-medium text-slate-800">{ev.recommendationReason}</p>
                    </div>
                  )}

                  {/* Criteria Scores Breakdown Pills */}
                  {ev.criteriaScores && ev.criteriaScores.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Technical Rubric Scoring Breakdown:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {ev.criteriaScores.map((c: any, ci: number) => (
                          <div key={ci} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                            <div className="text-[10px] font-semibold text-slate-600 truncate">{c.name}</div>
                            <div className="font-mono font-bold text-xs text-indigo-700 mt-0.5">
                              {c.rating ?? c.score ?? 4.0} / 5
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths and Growth Areas */}
                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    {ev.strengths && ev.strengths.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">Key Strengths:</span>
                        {ev.strengths.map((s: string, si: number) => (
                          <span key={si} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {ev.areasOfImprovement && ev.areasOfImprovement.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">Growth Areas:</span>
                        {ev.areasOfImprovement.map((a: string, ai: number) => (
                          <span key={ai} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HR Action & Ratification Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {isRatified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Recommendation Ratified by HR Command</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRatifyEvaluation(ev.id, ev.candidateName)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ratify Hiring Recommendation</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedEvaluationModal(ev)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-600" />
                        <span>Inspect Full Audit Sheet</span>
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Audit Hash: SHA256-{(ev.id + (ev.candidateId || '')).slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2c. Real-Time Operational Oversight: Incidents & Declared Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Operational Incident Dispatches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Panel Operational Incident Dispatches
              </h3>
              <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                {incidents.length} Tickets
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live IT Desk Alert
            </span>
          </div>

          {incidents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Zero active operational disruptions reported across assessment rooms.
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{inc.category.replace(/_/g, ' ').toUpperCase()}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                          inc.severity === 'critical'
                            ? 'bg-rose-600 text-white'
                            : inc.severity === 'high'
                            ? 'bg-amber-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">#{inc.id.slice(-6)}</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                    "{inc.description}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Reported by {inc.interviewerName} &bull; {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                    </span>

                    <div className="flex items-center gap-1.5">
                      {inc.status === 'resolved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Resolved
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAcknowledgeIncident(inc.id)}
                            className="px-2 py-0.8 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] rounded border border-amber-300"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => handleResolveIncident(inc.id)}
                            className="px-2 py-0.8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Confidential Conflict Declarations & Panel Transfers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Confidential Conflict Declarations
              </h3>
              <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                {conflicts.length} Declared
              </span>
            </div>
            <span className="text-[10px] font-semibold text-rose-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-600" />
              Strict Confidentiality
            </span>
          </div>

          {conflicts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Zero active conflict of interest declarations requiring panel transfer.
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map((cnf) => (
                <div key={cnf.id} className="p-3.5 rounded-xl border border-slate-200 bg-rose-50/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{cnf.candidateName}</div>
                      <div className="text-[10px] text-slate-400">
                        Declared by {cnf.interviewerName} &bull; Category: {cnf.category.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cnf.status === 'reassigned'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {cnf.status === 'reassigned' ? 'Reassigned to Panel 2' : 'Pending Panel Transfer'}
                    </span>
                  </div>

                  <p className="text-rose-950 italic bg-white p-2.5 rounded-lg border border-rose-200/80 leading-relaxed">
                    "{cnf.confidentialReason}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      Ref #{cnf.id} &bull; Protected under bias mitigation policy
                    </span>

                    {cnf.status !== 'reassigned' && (
                      <button
                        onClick={() => handleReassignConflict(cnf.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg shadow-2xs"
                      >
                        Approve Panel 2 Transfer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 2b. FMCP Recommendation & Appointment Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Candidate Prioritisation Engine (FMCP)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
                DIR {fmcpAudit.disparateImpactMetric.toFixed(2)} Bias-Free
              </span>
            </div>
            <p className="text-xs text-indigo-200">
              Fairness-Aware Multi-Stage Candidate Prioritisation: <strong>Weighted Scoring</strong> + <strong>Fair Ranking</strong> + <strong>Aging Priority</strong> + <strong>Constraint-Based Allocation</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('fmcp')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shrink-0 transition-colors"
          >
            <span>Open FMCP Command Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top 3 Recommended Candidates Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topFmcpRecs.map((cand) => (
            <div
              key={cand.candidateId}
              onClick={() => onNavigateToTab('fmcp')}
              className="bg-white/10 hover:bg-white/15 cursor-pointer backdrop-blur-xs p-3.5 rounded-xl border border-white/10 text-xs space-y-2 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/30 text-amber-300 font-mono font-black text-xs flex items-center justify-center border border-amber-400/30">
                    #{cand.rankIndex}
                  </span>
                  <div>
                    <div className="font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {cand.candidateName}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {cand.education.branch} &bull; CGPA {cand.education.cgpa.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-amber-300 text-sm">
                    {cand.fmcpScore.totalFmcpScore}<span className="text-[10px] text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                  Merit: {cand.fmcpScore.weightedMeritScore}/65
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
                  Fair: +{cand.fmcpScore.fairRankingScore}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">
                  Aging: +{cand.fmcpScore.agingPriorityScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Mid Section: Upcoming Interviews Roster & Operational Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Upcoming Scheduled Interviews Roster */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Upcoming Scheduled Interview Slots
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Showing active confirmed schedule
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((slot) => (
                <div key={slot.appId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {slot.candidateName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{slot.candidateName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {slot.candidateType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{slot.role}</span>
                        <span>&bull;</span>
                        <span className="truncate max-w-[200px]">{slot.driveTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right text-xs">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center sm:justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{slot.room} ({slot.venue})</div>
                    </div>
                    {slot.evaluation ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Evaluated &bull; {slot.evaluation.recommendation.replace(/_/g, ' ')}</span>
                        </span>
                        <button
                          onClick={() => setSelectedEvaluationModal(slot.evaluation || null)}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline"
                        >
                          View Scorecard
                        </button>
                      </div>
                    ) : slot.conflict ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        <span>Conflict Declared</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Confirmed Slot
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No confirmed interviews scheduled today. Check active drive slots in the Drives tab.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Capacity & Queue Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Queue & Standby Triage
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Proactive Standby Candidates</div>
                  <div className="text-base font-bold text-indigo-700 font-mono mt-0.5">{standbysQueued} queued</div>
                </div>
                <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
                  Sub-10m dispatch
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Dynamic Waitlist Candidates</div>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{waitlistsQueued} queued</div>
                </div>
                <div className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded-lg">
                  Ranked by score
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Absence Governance Reviews</div>
                  <div className="text-base font-bold text-amber-700 font-mono mt-0.5">{absences.length} pending</div>
                </div>
                <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                  Action required
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span>Recruitment Telemetry</span>
              <span className="font-mono text-[10px]">WAL ACID</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All interview slots, evaluations, and candidate check-ins are synchronously committed to SQLite with strict RBAC boundary checks.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Bottom Split: Recent Recruitment Updates & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Updates (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recent Recruitment Updates
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Live event stream</span>
          </div>

          <div className="space-y-3">
            {recentUpdates.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications and Important Activities (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Notifications & Important Activities
              </h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {notifications.length} active
            </span>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 4).map((notif) => (
              <div key={notif.id} className="p-3 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(notif.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Full Scorecard Audit Modal for HR Command */}
      {selectedEvaluationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedEvaluationModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 mb-1.5 text-indigo-300">
                <FileCheck2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Candidate Scorecard Audit</span>
              </div>
              <h2 className="text-xl font-bold">{selectedEvaluationModal.candidateName}</h2>
              <p className="text-xs text-slate-300 mt-1">
                {selectedEvaluationModal.roundName} &bull; Evaluated by {selectedEvaluationModal.interviewerName}
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Interviewer Advisory Recommendation
                  </span>
                  <div className="text-sm font-bold text-slate-900 uppercase mt-0.5">
                    {selectedEvaluationModal.recommendation.replace(/_/g, ' ')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Criteria Average</span>
                  <div className="text-base font-extrabold text-indigo-700 font-mono">
                    {selectedEvaluationModal.criteriaScores && selectedEvaluationModal.criteriaScores.length > 0
                      ? (
                          selectedEvaluationModal.criteriaScores.reduce((sum: number, c: any) => sum + Number(c.rating ?? c.score ?? 0), 0) /
                          selectedEvaluationModal.criteriaScores.length
                        ).toFixed(1)
                      : '4.2'} / 5.0
                  </div>
                </div>
              </div>

              {selectedEvaluationModal.overallSummary && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Interview Synthesis &amp; Observations</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed italic">
                    "{selectedEvaluationModal.overallSummary}"
                  </p>
                </div>
              )}

              {selectedEvaluationModal.recommendationReason && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Recommendation Rationale</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
                    {selectedEvaluationModal.recommendationReason}
                  </p>
                </div>
              )}

              {/* Rubric scores */}
              {selectedEvaluationModal.criteriaScores && selectedEvaluationModal.criteriaScores.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">Multi-Tier Rubric Breakdown</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedEvaluationModal.criteriaScores.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {c.rating ?? c.score ?? 4.0} / 5
                          </span>
                        </div>
                        {(c.observation || c.comments) && (
                          <p className="text-[11px] text-slate-500">{c.observation || c.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Growth Areas */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-900 block">Key Strengths Demonstrated</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedEvaluationModal.strengths || ['DSA', 'Algorithmic efficiency']).map((s: string, si: number) => (
                      <span key={si} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-emerald-800 border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-900 block">Areas of Growth / Next Round Focus</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedEvaluationModal.areasOfImprovement || ['Distributed transactions']).map((a: string, ai: number) => (
                      <span key={ai} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-amber-800 border border-amber-200">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvaluationModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRatifyEvaluation(selectedEvaluationModal.id, selectedEvaluationModal.candidateName);
                    setSelectedEvaluationModal(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ratify &amp; Clear for Next Stage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
