import React, { useState } from 'react';
import { ConflictCategory } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertCircle,
  Send,
  Info
} from 'lucide-react';

interface ConflictDeclarationModalProps {
  candidateId: string;
  candidateName: string;
  slotId?: string;
  applicationId?: string;
  onClose: () => void;
  onDeclared?: () => void;
}

export const ConflictDeclarationModal: React.FC<ConflictDeclarationModalProps> = ({
  candidateId,
  candidateName,
  slotId,
  applicationId,
  onClose,
  onDeclared
}) => {
  const [category, setCategory] = useState<ConflictCategory>('personal_relationship');
  const [confidentialReason, setConfidentialReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleClose = () => {
    if (successNotice && onDeclared) {
      onDeclared();
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confidentialReason.trim()) {
      setErrorNotice('A confidential explanation is required so HR can process reassignment.');
      return;
    }

    setIsSubmitting(true);
    setErrorNotice(null);

    try {
      const res = await recruitmentService.declareConflict({
        candidateId,
        candidateName,
        slotId: slotId || 'slot_default',
        applicationId: applicationId || 'app_default',
        category,
        confidentialReason
      });

      if (res.success) {
        setSuccessNotice(true);
        if (onDeclared) onDeclared();
      } else {
        setErrorNotice(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 mb-1.5 text-rose-300">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Confidential Workflow</span>
          </div>

          <h2 className="text-xl font-bold">Declare Conflict of Interest</h2>
          <p className="text-xs text-slate-300 mt-1">
            Request independent panel reassignment for <strong className="text-white">{candidateName}</strong>
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {successNotice ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Declaration Recorded Confidentially</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                HR Coordinators have been alerted to safely reassign this candidate to another evaluation panel.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Conflict Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="personal_relationship">Personal Relationship (Family / Close Friend)</option>
                  <option value="previous_professional">Previous Professional / Colleague Relationship</option>
                  <option value="reporting_hierarchy">Former Direct Supervisor or Direct Report</option>
                  <option value="financial_interest">Financial or External Business Interest</option>
                  <option value="academic_affiliation">Academic Advisor / Classmate Affiliation</option>
                  <option value="other">Other Conflict of Interest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Confidential Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={confidentialReason}
                  onChange={(e) => setConfidentialReason(e.target.value)}
                  placeholder="Detail the nature of the conflict for HR review..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-rose-600 resize-none h-24 text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-start gap-2 text-[11px] leading-relaxed">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy Guarantee:</strong> The details entered here are visible strictly to authorized HR Administrators. Peer interviewers and candidates will only see a generic "Reassigned by Scheduling Desk" notice.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Confidential Declaration</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

