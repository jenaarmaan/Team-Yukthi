import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import { VacantSlotRecovery, CandidateProfile } from '../../types/recruitment';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminSelfHealingCenter: React.FC = () => {
  const recoveries = recruitmentService.getVacantSlotRecoveries();
  const standbys = recruitmentService.getAllStandbyApplications();
  const candidates = recruitmentService.getAllCandidates();

  const [activeTab, setActiveTab] = useState<'all' | 'vacant' | 'dispatched' | 'recovered'>('all');
  const [selectedRecovery, setSelectedRecovery] = useState<VacantSlotRecovery | null>(recoveries[0] || null);
  const [selectedStandbyId, setSelectedStandbyId] = useState<string>(
    standbys[0]?.candidate.id || ''
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredRecoveries = recoveries.filter((r) => {
    if (activeTab === 'vacant') return r.status === 'vacant';
    if (activeTab === 'dispatched') return r.status === 'invitations_dispatched';
    if (activeTab === 'recovered') return r.status === 'recovered';
    return true;
  });

  const handleDispatchReplacement = (recoveryId: string) => {
    if (!selectedStandbyId) {
      alert('Please select an eligible standby candidate.');
      return;
    }

    const ok = recruitmentService.triggerSlotRecovery(recoveryId, selectedStandbyId);
    if (ok) {
      setActionNotice('Urgent replacement offer successfully dispatched! Candidate mobile app alerted with limited-time countdown.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleConfirmRecovery = (recoveryId: string) => {
    recruitmentService.confirmSlotRecovery(recoveryId);
    setActionNotice('Slot successfully confirmed as RECOVERED. Interview schedule and panel allocation locked in.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Metrics
  const totalVacancies = recoveries.length;
  const recoveredCount = recoveries.filter((r) => r.status === 'recovered').length;
  const inProgressCount = recoveries.filter((r) => r.status === 'invitations_dispatched').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>NIYOJAN Flagship Differentiator</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Self-Healing Recruitment Command Center
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Automated detection and recovery of vacant interview slots caused by candidate dropouts, no-shows, or reschedules. Matches standby candidates in real time and provisions replacement confirmations without manual rescheduling friction.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 3-Column Recovery KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Vacant Slots Detected</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">{totalVacancies}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Dropouts & schedule conflicts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Offers In Flight</div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono mt-1 tabular-nums">{inProgressCount}</div>
          <div className="text-[11px] text-amber-800 mt-0.5">Awaiting candidate acceptance</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Slots Successfully Recovered</div>
          <div className="text-2xl font-extrabold text-teal-800 font-mono mt-1 tabular-nums">{recoveredCount}</div>
          <div className="text-[11px] text-teal-800 mt-0.5">Zero interviewer capacity wasted</div>
        </div>
      </div>

      {/* Main Split: Vacant Slots List (Left) vs Matching & Dispatch Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Vacant Slots Feed (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Vacant Slot Incidents</h3>
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2 py-0.5 rounded ${activeTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('vacant')}
                className={`px-2 py-0.5 rounded ${activeTab === 'vacant' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'}`}
              >
                Vacant
              </button>
              <button
                onClick={() => setActiveTab('dispatched')}
                className={`px-2 py-0.5 rounded ${activeTab === 'dispatched' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'}`}
              >
                Dispatched
              </button>
              <button
                onClick={() => setActiveTab('recovered')}
                className={`px-2 py-0.5 rounded ${activeTab === 'recovered' ? 'bg-white text-teal-700 font-bold shadow-xs' : 'text-slate-600'}`}
              >
                Recovered
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredRecoveries.map((rec) => {
              const isSelected = selectedRecovery?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecovery(rec)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        {rec.role}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{rec.venue}</h4>
                    </div>

                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'recovered'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : rec.status === 'invitations_dispatched'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rec.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>{rec.slotDate}</span>
                    <span>·</span>
                    <span>{rec.slotTime}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">Vacated by:</span> {rec.vacatedByCandidateName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Automated Candidate Match & Dispatch Engine (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          {selectedRecovery ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Self-Healing Slot Dispatch
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedRecovery.role} ({selectedRecovery.venue})
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Slot Time: <strong className="text-slate-800">{selectedRecovery.slotDate} at {selectedRecovery.slotTime}</strong>
                  </div>
                </div>

                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedRecovery.status === 'recovered'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {selectedRecovery.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Recovery Status Callout */}
              {selectedRecovery.status === 'invitations_dispatched' && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-amber-950">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    Urgent Standby Offer Dispatched to {selectedRecovery.matchedStandbyCandidateName}
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Candidate received the in-app notification with a time-limited confirmation CTA. Once the candidate accepts in their app, the slot transitions to CONFIRMED.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleConfirmRecovery(selectedRecovery.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Admin Force Confirm Recovery
                    </button>
                  </div>
                </div>
              )}

              {selectedRecovery.status === 'recovered' && (
                <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-teal-950">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Slot Successfully Recovered & Allocated
                  </div>
                  <p className="text-[11px] text-teal-800">
                    Assigned to candidate: <strong>{selectedRecovery.matchedStandbyCandidateName}</strong>. Interview pass is active and confirmed in the roster.
                  </p>
                </div>
              )}

              {/* Standby Match Engine Selector */}
              {selectedRecovery.status === 'vacant' && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Automated Standby Candidate Ranking Engine
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ranked dynamically by algorithmic compatibility with {selectedRecovery.role}: skill coverage, location preference, CGPA, and standby readiness.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {standbys
                      .map(({ candidate, standby }) => {
                        const match = recruitmentService.calculateStandbyMatch(
                          candidate.id,
                          selectedRecovery.hiringDriveId,
                          selectedRecovery.venue
                        );
                        const fmcp = recruitmentService.calculateFmcpScore(
                          candidate.id,
                          selectedRecovery.hiringDriveId,
                          { location: selectedRecovery.venue }
                        );
                        return { candidate, standby, match, fmcp };
                      })
                      .sort((a, b) => b.fmcp.totalFmcpScore - a.fmcp.totalFmcpScore)
                      .map(({ candidate, standby, match, fmcp }, rankIdx) => {
                        const isSel = selectedStandbyId === candidate.id;
                        return (
                          <div
                            key={candidate.id}
                            onClick={() => setSelectedStandbyId(candidate.id)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSel
                                ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 shadow-xs'
                                : 'border-slate-200 bg-slate-50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-slate-400 font-mono">
                                    #{rankIdx + 1}
                                  </span>
                                  <span className="font-bold text-slate-900">{candidate.fullName}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                    fmcp.totalFmcpScore >= 85
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                  }`}>
                                    FMCP Score: {fmcp.totalFmcpScore}/100
                                  </span>
                                  {fmcp.fairRankingScore >= 7 && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Parity Mitigated
                                    </span>
                                  )}
                                  {fmcp.starvationPreventionApplied && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      Anti-Starvation Lock
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                  {candidate.education.degree} · Base: {candidate.currentLocation} · Pref: {candidate.preferredLocations.join(', ')}
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                {isSel ? (
                                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                    Selected <CheckCircle2 className="w-4 h-4" />
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400">Select</span>
                                )}
                              </div>
                            </div>

                            {/* 4-Part FMCP Metric Score Breakdown */}
                            <div className="grid grid-cols-4 gap-1.5 mt-2.5 pt-2 border-t border-slate-200/80 text-[10px] font-mono">
                              <div className="bg-white/80 p-1.5 rounded border border-slate-200">
                                <div className="text-slate-400">1. Weighted</div>
                                <div className="font-bold text-slate-800">{fmcp.weightedMeritScore}/65</div>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded border border-slate-200">
                                <div className="text-slate-400">2. Fair Rank</div>
                                <div className="font-bold text-emerald-700">+{fmcp.fairRankingScore}/10</div>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded border border-slate-200">
                                <div className="text-slate-400">3. Aging Queue</div>
                                <div className="font-bold text-amber-700">+{fmcp.agingPriorityScore}/15</div>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded border border-slate-200">
                                <div className="text-slate-400">4. Constraints</div>
                                <div className="font-bold text-sky-700">{fmcp.constraintScore}/10</div>
                              </div>
                            </div>

                            {/* Explanatory Reasons */}
                            <div className="mt-2 space-y-0.5">
                              {fmcp.transparentReasons.slice(0, 2).map((r, i) => (
                                <div key={i} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => handleDispatchReplacement(selectedRecovery.id)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Urgent Replacement Invitation (Ticking Countdown)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an incident from the left to inspect self-healing workflow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
