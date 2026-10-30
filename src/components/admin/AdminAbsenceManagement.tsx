import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  UserCheck,
  Building2,
  Info
} from 'lucide-react';

export const AdminAbsenceManagement: React.FC = () => {
  const absences = recruitmentService.getAllAbsenceRecords();
  const currentAdmin = recruitmentService.getCurrentAdmin();

  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const handleDecision = (applicationId: string, decision: 'ratify' | 'reject') => {
    const res = recruitmentService.simulateHrAbsenceDecision(applicationId, decision);
    if (res.success) {
      setReviewSuccess(
        `${decision === 'ratify' ? 'Ratified absence' : 'Rejected absence & applied policy block'}. Recorded by ${currentAdmin.name} (${currentAdmin.department}).`
      );
      setTimeout(() => {
        setReviewSuccess(null);
      }, 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Enterprise Absence Governance & Policy Center</h2>
          <p className="text-xs text-slate-500">Enforce Excelsoft recruitment attendance policies across Fresher and Experienced pipelines</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            Total Absence Records: {absences.length}
          </span>
        </div>
      </div>

      {reviewSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reviewSuccess}</span>
        </div>
      )}

      {/* Policy Clarification Banner */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Statutory Talent Acquisition Absence Guidelines:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">Fresher Policy:</strong>
            Any missed interview slot immediately forfeits the hiring drive opportunity. No justification or automatic rescheduling is permitted.
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">Experienced Policy:</strong>
            Experienced candidates who miss an interview have 48 hours to submit formal justification and supporting medical/emergency documents. The HR committee may ratify (restoring eligibility) or reject (resulting in candidate blocked).
          </div>
        </div>
      </div>

      {/* Absences Review Grid */}
      <div className="space-y-3">
        {absences.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No absence records logged in current hiring drives.
          </div>
        ) : (
          absences.map(({ absence, candidate, application }) => {
            const isPendingReview = absence.status === 'explanation_submitted';
            const isRatified = absence.status === 'ratified';
            const isBlocked = absence.status === 'blocked';

            return (
              <div
                key={absence.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center">
                      {candidate.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{candidate.fullName}</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {candidate.candidateType}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{application.role} ({application.appliedLocation})</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      isRatified
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isBlocked
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    Status: {absence.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Candidate Absence Justification
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {absence.explanationReason || 'No explanation provided.'}
                    </p>
                    {absence.supportingDocName && (
                      <div className="flex items-center gap-1.5 pt-2 text-indigo-700 font-mono text-[11px]">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="underline cursor-pointer">{absence.supportingDocName}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      HR Talent Acquisition Assessment
                    </span>
                    <p className="text-slate-800 leading-relaxed">
                      {absence.hrReviewNotes || 'Under active committee review.'}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-2 font-mono">
                      Missed Slot Date: {absence.missedDate.substring(0, 10)} · Deadline: 48h
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Administrator action authenticated as: <strong className="text-slate-700">{currentAdmin.name}</strong> ({currentAdmin.role})
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(application.id, 'ratify')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Ratify Absence (Restore Eligibility)</span>
                    </button>

                    <button
                      onClick={() => handleDecision(application.id, 'reject')}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Reject & Block Candidate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
