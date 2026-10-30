import React, { useState } from 'react';
import { Application, CandidateProfile } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  HelpCircle
} from 'lucide-react';

interface AbsenceManagementModalProps {
  application: Application | null;
  candidateProfile: CandidateProfile;
  onClose: () => void;
  onActionComplete: () => void;
}

export const AbsenceManagementModal: React.FC<AbsenceManagementModalProps> = ({
  application,
  candidateProfile,
  onClose,
  onActionComplete
}) => {
  if (!application) return null;

  const isFresher = candidateProfile.candidateType === 'fresher';
  const absenceRecord = application.absenceRecord;

  // Form states for submitting explanation
  const [reason, setReason] = useState(
    absenceRecord?.explanationReason ||
      'Severe acute illness with high fever on interview morning, requiring outpatient clinical care.'
  );
  const [docName, setDocName] = useState(
    absenceRecord?.supportingDocName || 'Medical_Certificate_Apollo_Hospital.pdf'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmitExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = recruitmentService.submitAbsenceExplanation(application.id, reason, docName);
      setIsSubmitting(false);
      setStatusMessage(res.message);
      setTimeout(() => {
        onActionComplete();
      }, 1000);
    }, 400);
  };

  const handleSimulateHrDecision = (decision: 'ratify' | 'reject') => {
    const res = recruitmentService.simulateHrAbsenceDecision(application.id, decision);
    setStatusMessage(res.message);
    setTimeout(() => {
      onActionComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Absence & Attendance Policy
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {application.role}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {statusMessage && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* POLICY EXPLANATION BANNER */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Excelsoft Technologies Absence Governance Rule</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <strong className="text-slate-900">Fresher Rule:</strong> If a fresher does not attend their scheduled interview slot, the candidate permanently forfeits this hiring drive opportunity.
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <strong className="text-slate-900">Experienced Rule:</strong> If an experienced candidate misses an interview, they must submit formal explanation with documentation within 48 hours. HR reviews and ratifies (restoring eligibility) or rejects (resulting in candidate being blocked).
              </div>
            </div>
          </div>

          {/* FRESHER CANDIDATE PATH */}
          {isFresher ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2.5">
              <div className="font-bold flex items-center gap-1.5 text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Fresher Opportunity Loss Policy
              </div>
              <p className="text-[11px] leading-relaxed text-rose-800">
                As a Fresher (2026 Batch), unexcused or missed interview attendance leads to immediate forfeiture of this drive. The HR scheduling portal does not permit self-justification or rescheduling for fresher drives.
              </p>
              <div className="pt-2 text-[10px] text-rose-700 italic">
                You may apply to future open batches when new registration cycles are scheduled.
              </div>
            </div>
          ) : (
            /* EXPERIENCED CANDIDATE PATH */
            <div className="space-y-4">
              {/* CURRENT ABSENCE RECORD STATUS */}
              {absenceRecord ? (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase tracking-wider">
                      Absence Review Status
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        absenceRecord.status === 'ratified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : absenceRecord.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {absenceRecord.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-700">Submitted Reason: </span>
                      <span className="text-slate-900">{absenceRecord.explanationReason}</span>
                    </div>
                    {absenceRecord.supportingDocName && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-indigo-700 font-semibold">{absenceRecord.supportingDocName}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-700">HR Committee Assessment: </span>
                      <span className="text-slate-900">{absenceRecord.hrReviewNotes || 'Pending'}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* EXPLANATION FORM (IF NOT YET SUBMITTED OR EDITING) */}
              {(!absenceRecord || absenceRecord.status === 'missed_unexplained') && (
                <form onSubmit={handleSubmitExplanation} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Submit Absence Justification
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Reason for Missing Interview Slot *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Detail the unavoidable emergency or medical reason..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Supporting Document (Medical certificate / Travel delay proof)
                    </label>
                    <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-slate-800 truncate text-[11px] font-mono">{docName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDocName('Medical_Prescription_Hospital_Receipt.pdf')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting to HR...' : 'Submit to HR Panel'}</span>
                  </button>
                </form>
              )}

              {/* HR SIMULATOR CONTROLS (SO TESTERS CAN VERIFY BOTH RATIFY AND REJECT WORKFLOWS!) */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                    Talent Acquisition Panel Simulator
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                    QA Testing
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-tight">
                  Simulate the HR review outcome to verify candidate status transitions in accordance with enterprise policies:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSimulateHrDecision('ratify')}
                    className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-[0.98] transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Ratify (Restore)</span>
                  </button>

                  <button
                    onClick={() => handleSimulateHrDecision('reject')}
                    className="py-2 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-[0.98] transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Reject (Block)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
