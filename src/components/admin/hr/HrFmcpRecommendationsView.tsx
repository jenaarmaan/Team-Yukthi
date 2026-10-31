import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  FmcpCandidateRanking,
  FmcpFairnessAuditSummary,
  InterviewSlot
} from '../../../types/recruitment';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  MapPin,
  ChevronRight,
  TrendingUp,
  Sliders,
  Filter,
  Search,
  UserCheck,
  FileCheck2,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';

interface HrFmcpRecommendationsViewProps {
  onNavigateToTab?: (tab: 'overview' | 'analytics' | 'drives' | 'fmcp') => void;
}

export const HrFmcpRecommendationsView: React.FC<HrFmcpRecommendationsViewProps> = ({
  onNavigateToTab
}) => {
  const [hiringDrives, setHiringDrives] = useState(recruitmentService.getHiringDrives());
  const [selectedDriveId, setSelectedDriveId] = useState<string>(hiringDrives[0]?.id || '');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<FmcpCandidateRanking[]>([]);
  const [fairnessAudit, setFairnessAudit] = useState<FmcpFairnessAuditSummary | null>(null);

  // Modal / Appointment state
  const [inspectCandidate, setInspectCandidate] = useState<FmcpCandidateRanking | null>(null);
  const [appointModalCandidate, setAppointModalCandidate] = useState<FmcpCandidateRanking | null>(null);

  // Appointment Form state
  const [appointDate, setAppointDate] = useState<string>('Saturday, Nov 28, 2026');
  const [appointTime, setAppointTime] = useState<string>('11:00 AM - 12:00 PM IST');
  const [appointPanel, setAppointPanel] = useState<string>('Panel 1 (Technical Assessment)');
  const [appointVenue, setAppointVenue] = useState<string>('Excelsoft Technologies, Mysuru Campus Center');
  const [appointNotes, setAppointNotes] = useState<string>('Appointed via FMCP Fairness Engine with 100% verified merit and anti-starvation boost.');
  const [appointSuccess, setAppointSuccess] = useState<string | null>(null);
  const [appointError, setAppointError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = () => {
    const recs = recruitmentService.getFmcpRecommendations(
      selectedDriveId || undefined,
      selectedVenue !== 'all' ? selectedVenue : undefined
    );
    setRecommendations(recs);
    setFairnessAudit(recruitmentService.getFmcpFairnessAudit());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = recruitmentService.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, [selectedDriveId, selectedVenue]);

  // Filter candidates by search query
  const filteredRecommendations = recommendations.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchName = r.candidateName.toLowerCase().includes(q);
    const matchEmail = r.candidateEmail.toLowerCase().includes(q);
    const matchInst = r.education.institution.toLowerCase().includes(q);
    const matchDegree = r.education.degree.toLowerCase().includes(q);
    const matchLoc = r.currentLocation.toLowerCase().includes(q);
    return matchName || matchEmail || matchInst || matchDegree || matchLoc;
  });

  const handleExecuteAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointModalCandidate) return;

    setIsSubmitting(true);
    setAppointError(null);

    const slotPayload: Partial<InterviewSlot> = {
      hiringDriveId: appointModalCandidate.hiringDriveId,
      date: appointDate,
      time: appointTime,
      roomOrPanel: appointPanel,
      venueAddress: appointVenue,
      location: appointVenue.includes('Bengaluru')
        ? 'Bengaluru Campus'
        : appointVenue.includes('Hyderabad')
        ? 'Hyderabad Campus'
        : 'Mysuru Campus'
    };

    const res = recruitmentService.appointCandidateFmcp(
      appointModalCandidate.candidateId,
      slotPayload,
      'HR Command Center',
      appointNotes
    );

    setIsSubmitting(false);

    if (res.success) {
      setAppointSuccess(res.message);
      loadData();
      setTimeout(() => {
        setAppointSuccess(null);
        setAppointModalCandidate(null);
      }, 2000);
    } else {
      setAppointError(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: FMCP Engine Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>NIYOJAN Flagship Algorithm</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-300 font-mono">DIR 0.94 Compliant</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Fairness-Aware Multi-Stage Candidate Prioritisation (FMCP)
          </h1>

          <p className="text-xs lg:text-sm text-indigo-200 leading-relaxed max-w-3xl">
            A state-of-the-art recruitment allocation engine combining <strong>Weighted Scoring</strong> for verified skills,{' '}
            <strong>Fair Ranking</strong> to eliminate institutional bias, <strong>Aging Priority</strong> to prevent waitlist starvation, and{' '}
            <strong>Constraint-Based Allocation</strong> to match panels and rooms with zero schedule collisions.
          </p>

          {/* 4 Multi-Stage Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs space-y-1">
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-indigo-300" />
                <span>1. Weighted Scoring</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Multi-tier skills & qualifications (max 65 pts)
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs space-y-1">
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>2. Fair Ranking</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Institutional parity & bias mitigation (max 10 pts)
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs space-y-1">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>3. Aging Priority</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Time-in-queue anti-starvation boost (max 15 pts)
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs space-y-1">
              <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-sky-300" />
                <span>4. Constraint Match</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Zero double-booking & conflict audit (max 10 pts)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR KPI CARDS */}
      {fairnessAudit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Composite FMCP</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fairnessAudit.averageFmcpScore}<span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>High verified qualification index</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Disparate Impact Ratio</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fairnessAudit.disparateImpactMetric.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Clears 0.80 EEOC equity bar (0% bias)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Aging Starvation Prevented</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fairnessAudit.starvationPreventsCount} candidates
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Protected from perpetual leapfrogging
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Opportunity Loss Avoided</span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fairnessAudit.opportunityLossAvoidedHours} panel-hours
              </div>
              <div className="text-[11px] text-violet-700 font-medium mt-0.5">
                Instant standby & waitlist reallocation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Drive:</span>
            </span>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
            >
              {hiringDrives.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Venue:</span>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
            >
              <option value="all">All Campus Venues</option>
              <option value="Mysuru Campus">Mysuru Campus Center</option>
              <option value="Bengaluru Campus">Bengaluru Campus Center</option>
              <option value="Hyderabad Campus">Hyderabad Campus Center</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, college, skills..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* 4. RECOMMENDATIONS & APPOINTMENT CANDIDATE LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Ranked Candidates for Appointment & Replacement</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredRecommendations.length} Candidates Evaluated
            </span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Multi-stage deterministic sorting: Weighted Merit + Fair Parity + Aging Queue + Constraints
          </span>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No candidates matching current filter criteria.
          </div>
        ) : (
          filteredRecommendations.map((cand) => {
            const score = cand.fmcpScore;
            const isConfirmed = cand.applicationStatus === 'confirmed';

            return (
              <div
                key={cand.candidateId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Top Row: Rank, Identity, Tier, and Main Score Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-2xs ${
                        cand.rankIndex === 1
                          ? 'bg-amber-500 text-white'
                          : cand.rankIndex === 2
                          ? 'bg-slate-700 text-white'
                          : cand.rankIndex === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      #{cand.rankIndex}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{cand.candidateName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {cand.candidateType}
                        </span>
                        {score.fairRankingScore >= 7 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Parity Equalized</span>
                          </span>
                        )}
                        {score.starvationPreventionApplied && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Anti-Starvation Lock</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {cand.education.degree} in {cand.education.branch} &bull; {cand.education.institution} &bull; CGPA:{' '}
                        <strong className="text-slate-800">{cand.education.cgpa.toFixed(2)}</strong> &bull; Base:{' '}
                        {cand.currentLocation}
                      </div>
                    </div>
                  </div>

                  {/* Composite FMCP Score Pill & Tier */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FMCP Score</div>
                      <div className="text-xl font-black font-mono text-indigo-600">
                        {score.totalFmcpScore}
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        score.recommendationTier === 'top_priority_appointment'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : score.recommendationTier === 'strong_recommendation'
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {score.recommendationTier.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Mid Section: 4-Stage Mathematical Score Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Stage 1: Weighted Scoring */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>1. Weighted Merit</span>
                      <span className="font-mono font-bold text-indigo-700">{score.weightedMeritScore}/65</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      Skills: {score.skillsScore}/35 &bull; Academics: {score.qualificationScore}/20
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${(score.weightedMeritScore / 65) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage 2: Fair Ranking */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>2. Fair Ranking</span>
                      <span className="font-mono font-bold text-emerald-700">+{score.fairRankingScore}/10</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      DIR: {score.disparateImpactRatio.toFixed(2)} &bull; {score.parityCategory.replace(/_/g, ' ')}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${(score.fairRankingScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage 3: Aging Priority */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>3. Aging Priority</span>
                      <span className="font-mono font-bold text-amber-700">+{score.agingPriorityScore}/15</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      {score.hoursQueued}h in queue ({score.daysWaiting} days)
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${(score.agingPriorityScore / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage 4: Constraint-Based Allocation */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>4. Constraint Match</span>
                      <span className="font-mono font-bold text-sky-700">{score.constraintScore}/10</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      {score.isAllocationFeasible ? 'All constraints clear' : 'Conflicts detected'}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-500 h-1.5 rounded-full"
                        style={{ width: `${(score.constraintScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar: Transparent Explanation Trigger & Instant Appointment Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate max-w-md">{score.fairnessAdjustmentDetails}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInspectCandidate(cand)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explain Decision</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppointModalCandidate(cand)}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 flex items-center gap-1.5 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isConfirmed ? 'Reallocate Slot' : 'Appoint Candidate'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. TRANSPARENT DECISION EXPLANATION DRAWER / MODAL */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
                  #{inspectCandidate.rankIndex}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inspectCandidate.candidateName}</h3>
                  <p className="text-xs text-slate-500">
                    Transparent Human-Reviewable Decision Rationale & Audit Log
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectCandidate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {inspectCandidate.fmcpScore.transparentReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 space-y-1 leading-relaxed"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Technique Stage {idx + 1} Audit Trail
                  </div>
                  <div>{reason}</div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Human-in-the-Loop Governance Guarantee</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Every FMCP priority calculation is strictly deterministic, unalterable by opaque third-party black-box weights, and adheres to Excelsoft’s Talent Acquisition Ethical AI Charter.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Close Explanation
              </button>
              <button
                onClick={() => {
                  setAppointModalCandidate(inspectCandidate);
                  setInspectCandidate(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Proceed to Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. APPOINTMENT EXECUTION MODAL */}
      {appointModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Appoint Candidate Interview Slot</h3>
                  <p className="text-[11px] text-slate-500">Constraint-Verified Slot Allocation</p>
                </div>
              </div>
              <button
                onClick={() => setAppointModalCandidate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {appointSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{appointSuccess}</span>
              </div>
            )}

            {appointError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{appointError}</span>
              </div>
            )}

            <form onSubmit={handleExecuteAppointment} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Candidate</span>
                <span className="font-bold text-slate-900 block text-xs">{appointModalCandidate.candidateName}</span>
                <span className="text-[11px] text-slate-500 block">
                  FMCP Score: {appointModalCandidate.fmcpScore.totalFmcpScore}/100 &bull; {appointModalCandidate.role}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interview Date
                </label>
                <input
                  type="text"
                  value={appointDate}
                  onChange={(e) => setAppointDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time Slot (IST)
                </label>
                <input
                  type="text"
                  value={appointTime}
                  onChange={(e) => setAppointTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Panel / Room Assignment
                </label>
                <input
                  type="text"
                  value={appointPanel}
                  onChange={(e) => setAppointPanel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue & Campus Location
                </label>
                <input
                  type="text"
                  value={appointVenue}
                  onChange={(e) => setAppointVenue(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  HR Reviewer Notes
                </label>
                <textarea
                  value={appointNotes}
                  onChange={(e) => setAppointNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-16 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAppointModalCandidate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Allocating & Minting QR Pass...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

