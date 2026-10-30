import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { VacantSlotRecovery } from '../../../types/recruitment';
import {
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Building2,
  TrendingUp,
  RotateCcw,
  Send,
  ShieldCheck,
  Award
} from 'lucide-react';

export const SlotRecoveryView: React.FC = () => {
  const initialRecoveries = recruitmentService.getVacantSlotRecoveries();
  const [recoveries, setRecoveries] = useState<VacantSlotRecovery[]>(initialRecoveries);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics (Items 1 to 6 & 11 to 12)
  const totalInterviewSlots = 96;
  const occupiedSlots = 82;
  const cancelledSlots = 14;
  const recoveredSlots = recoveries.filter((r) => r.status === 'recovered').length; // e.g. 11
  const unusedRecoveredSlots = cancelledSlots - recoveredSlots; // 3
  const recoverySuccessRate = Math.round((recoveredSlots / cancelledSlots) * 100); // 79%
  const panelHoursPreserved = (recoveredSlots * 1.5).toFixed(1);

  // Reassign / Allocate slot action
  const handleReassignSlot = (recoveryId: string, candidateName: string) => {
    setRecoveries((prev) =>
      prev.map((r) =>
        r.id === recoveryId
          ? {
              ...r,
              status: 'recovered',
              matchedStandbyCandidateName: candidateName,
              recoveredAt: 'Just now'
            }
          : r
      )
    );
    showToast(`Slot successfully reassigned to ${candidateName}. Interview pass generated.`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                ZERO-IDLE EFFICIENCY
              </span>
              <h2 className="text-xl font-bold text-slate-900">Interview Slot Recovery Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous slot vacancy triage, standby candidate re-allocation, and interviewer idle-time minimization
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>{recoverySuccessRate}% Recovery Rate</span>
            </span>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Top Metric Cards (Items 1 to 6, 11, 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Slots */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Slots
          </span>
          <div className="text-2xl font-black text-slate-900">{totalInterviewSlots}</div>
          <span className="text-[10px] text-slate-500">Scheduled capacity</span>
        </div>

        {/* Occupied */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Occupied Slots
          </span>
          <div className="text-2xl font-black text-slate-900">{occupiedSlots}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active & Attended</span>
        </div>

        {/* Cancelled */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cancelled / Vacated
          </span>
          <div className="text-2xl font-black text-rose-600">{cancelledSlots}</div>
          <span className="text-[10px] text-rose-700 font-semibold">No-shows & absences</span>
        </div>

        {/* Recovered */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Recovered Slots
          </span>
          <div className="text-2xl font-black text-indigo-700">{recoveredSlots}</div>
          <span className="text-[10px] text-indigo-700 font-semibold">Reassigned to standby</span>
        </div>

        {/* Unused */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Unused Vacant
          </span>
          <div className="text-2xl font-black text-amber-600">{unusedRecoveredSlots}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Ready for allocation</span>
        </div>

        {/* Hours Saved */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Panel Hours Saved
          </span>
          <div className="text-2xl font-black text-emerald-600">{panelHoursPreserved} hrs</div>
          <span className="text-[10px] text-slate-500">Interviewer efficiency</span>
        </div>

      </div>

      {/* 3. Real-Time Slot Recovery & Reassignment Feed */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Vacated Slots & Standby Reassignment</h3>
            <p className="text-xs text-slate-500">
              Slots vacated today requiring standby allocation or invitation dispatch
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {recoveries.length} Total Recovery Records
          </span>
        </div>

        <div className="space-y-3.5">
          {recoveries.map((rec) => {
            const isRecovered = rec.status === 'recovered';
            const isDispatched = rec.status === 'invitations_dispatched';
            const isVacant = rec.status === 'vacant';

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isRecovered
                    ? 'bg-slate-50/70 border-slate-200'
                    : isDispatched
                    ? 'bg-indigo-50/60 border-indigo-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                {/* Top Row: Drive, Role, Venue & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rec.hiringDriveTitle}</span>
                      <span className="text-xs font-semibold text-slate-500">({rec.role})</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {rec.venue} • Slot: <strong className="text-slate-900 font-mono">{rec.slotDate} at {rec.slotTime}</strong>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider font-mono self-start sm:self-auto ${
                      isRecovered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isDispatched
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {rec.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Details Row: Vacated By, Reason, Standby Match */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vacated By</span>
                    <strong className="text-slate-800">{rec.vacatedByCandidateName}</strong>
                    <span className="text-[10px] text-slate-500 block">({rec.vacatedReason.replace('_', ' ')})</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Matched Standby Candidate</span>
                    {rec.matchedStandbyCandidateName ? (
                      <strong className="text-emerald-700">{rec.matchedStandbyCandidateName}</strong>
                    ) : (
                      <span className="text-amber-800 font-semibold">Rohan Sharma (Priority #1)</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Recovery Status</span>
                    {isRecovered ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Recovered at {rec.recoveredAt || '09:45 AM'}</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold font-mono">
                        Deadline: {rec.candidateResponseDeadline || 'In 35 mins'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                {!isRecovered && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleReassignSlot(rec.id, 'Rohan Sharma')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Reassign Slot to Top Standby (Rohan Sharma)</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

