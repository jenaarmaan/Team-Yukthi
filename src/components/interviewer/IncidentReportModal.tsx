import React, { useState } from 'react';
import { IncidentCategory } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';

interface IncidentReportModalProps {
  slotId?: string;
  candidateName?: string;
  candidateId?: string;
  applicationId?: string;
  onClose: () => void;
  onReported?: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  slotId,
  candidateName,
  candidateId,
  applicationId,
  onClose,
  onReported
}) => {
  const [category, setCategory] = useState<IncidentCategory>('network_connectivity');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorNotice('Please provide a description of the operational or technical disruption.');
      return;
    }

    setIsSubmitting(true);
    setErrorNotice(null);

    try {
      const res = await recruitmentService.reportIncident({
        slotId,
        candidateName,
        candidateId,
        applicationId,
        category,
        severity,
        description
      });

      if (res.success) {
        setSuccessNotice(true);
        if (onReported) onReported();
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
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 mb-1.5 text-amber-300">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Operational Issue Ticket</span>
          </div>

          <h2 className="text-xl font-bold">Report Interview Incident</h2>
          <p className="text-xs text-slate-300 mt-1">
            Log operational disruptions or venue technical failures in real time
          </p>
        </div>

        {/* Content Body */}
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
              <h3 className="text-base font-bold text-slate-900">Incident Ticket Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Incident logged in audit ledger. The venue desk coordinator and recruitment IT operations team have been alerted.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                Close Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Incident Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="network_connectivity">Network / Bandwidth Connectivity Drop</option>
                  <option value="audio_video_failure">Audio / Video Hardware Streaming Failure</option>
                  <option value="candidate_unresponsive">Candidate Dropped / Session Unresponsive</option>
                  <option value="venue_overlap">Venue Room Overlap / Physical Double-Booking</option>
                  <option value="assessment_platform_error">Assessment Engine / Compiler Service Error</option>
                  <option value="identity_discrepancy">Suspected Candidate Identity Discrepancy</option>
                  <option value="other">Other Operational Disruption</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-xl text-center font-bold uppercase text-[10px] border transition-all ${
                        severity === sev
                          ? sev === 'critical'
                            ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                            : sev === 'high'
                            ? 'bg-amber-600 border-amber-600 text-white shadow-2xs'
                            : 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Detailed Operational Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, timestamps, impact on interview, and any recovery actions taken..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-600 resize-none h-24 text-xs"
                />
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Incident Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

