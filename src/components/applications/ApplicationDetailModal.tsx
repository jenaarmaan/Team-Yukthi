import React from 'react';
import { Application, CandidateProfile } from '../../types/recruitment';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  History,
  FileText
} from 'lucide-react';

interface ApplicationDetailModalProps {
  application: Application | null;
  candidateProfile: CandidateProfile;
  onClose: () => void;
  onOpenQrCheckIn: (application: Application) => void;
  onOpenStandbyModal: (application: Application) => void;
  onOpenAbsenceModal: (application: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  candidateProfile,
  onClose,
  onOpenQrCheckIn,
  onOpenStandbyModal,
  onOpenAbsenceModal
}) => {
  if (!application) return null;

  const slot = application.interviewSlot;
  const wl = application.waitlistInfo;
  const sb = application.standbyInfo;
  const abs = application.absenceRecord;

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
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                {application.company}
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

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Status & Applied Location */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Current Status
              </span>
              <div className="mt-1">
                <StatusBadge status={application.status} size="md" />
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Venue Location
              </span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {application.appliedLocation}
              </span>
            </div>
          </div>

          {/* 1. CONFIRMED SLOT DETAILS IF CONFIRMED */}
          {slot && (
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Assigned Interview Allocation
                </span>
                <span className="text-[10px] font-bold font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {slot.attendanceVerified ? 'Attended' : 'Scheduled'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Date</span>
                  <span className="font-bold text-slate-900">{slot.date}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Time</span>
                  <span className="font-bold text-slate-900">{slot.time}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-100 space-y-1">
                <div>
                  <span className="font-semibold text-slate-900">Panel/Room: </span>
                  {slot.roomOrPanel}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Venue Address: </span>
                  {slot.venueAddress}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Reporting Time: </span>
                  {slot.reportingTime}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenQrCheckIn(application);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{slot.attendanceVerified ? 'View Checked-In Pass' : 'Open QR Attendance Pass'}</span>
              </button>
            </div>
          )}

          {/* 2. WAITLIST DETAILS IF WAITLISTED */}
          {wl && (
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Dynamic Waitlist Status
                </span>
                <span className="text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Position #{wl.position}
                </span>
              </div>
              <p className="text-amber-800 leading-relaxed">{wl.expectedNextSteps}</p>
              {wl.tentativeFutureDate && (
                <div className="bg-white p-2.5 rounded-xl border border-amber-100 text-amber-950 font-medium">
                  Next Scheduled Batch: <strong>{wl.tentativeFutureDate}</strong>
                </div>
              )}
              <div className="text-[11px] text-amber-700 pt-1">
                * Note: Waitlist does not guarantee a slot. Promotions occur automatically when confirmed candidates cancel or drop out.
              </div>
            </div>
          )}

          {/* 3. STANDBY DETAILS IF STANDBY */}
          {sb && (
            <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Standby Pool Status
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 uppercase">
                  {sb.invitationStatus.replace('_', ' ')}
                </span>
              </div>

              {sb.invitationStatus === 'replacement_offered' && sb.replacementSlot && (
                <div className="bg-white p-3 rounded-xl border border-amber-300 space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Urgent Replacement Slot Available!
                  </div>
                  <p className="text-[11px] text-slate-600">
                    A confirmed candidate dropped out. You have been selected to claim this vacancy for {sb.replacementSlot.date} at {sb.replacementSlot.time}.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStandbyModal(application);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                  >
                    Review & Claim Slot Now
                  </button>
                </div>
              )}

              {sb.invitationStatus === 'pending_response' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenStandbyModal(application);
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Respond to Standby Invitation
                </button>
              )}
            </div>
          )}

          {/* 4. ABSENCE MANAGEMENT DETAILS */}
          {abs && (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  Absence Review Record
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 uppercase">
                  {abs.status.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100 space-y-1">
                <div>
                  <span className="font-semibold text-slate-800">Reason: </span>
                  <span className="text-slate-600">{abs.explanationReason || 'N/A'}</span>
                </div>
                {abs.supportingDocName && (
                  <div>
                    <span className="font-semibold text-slate-800">Document: </span>
                    <span className="text-indigo-600 font-mono text-[11px]">{abs.supportingDocName}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-slate-800">HR Notes: </span>
                  <span className="text-slate-600">{abs.hrReviewNotes || 'Pending committee meeting.'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAbsenceModal(application);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Open Absence Review & HR Simulator
              </button>
            </div>
          )}

          {/* 5. BLOCKED POLICY DETAILS */}
          {application.status === 'blocked' && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 space-y-2 text-xs text-red-900">
              <div className="flex items-center gap-1.5 font-bold text-red-900 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Absence Policy Enforcement
              </div>
              <p className="text-red-800 leading-relaxed">
                {application.rejectionReason}
              </p>
              <div className="bg-white/80 p-2.5 rounded-xl border border-red-200 text-[11px] text-red-800">
                <strong>Stated Policy Terms:</strong> Experienced candidates who fail to attend a confirmed interview slot must submit a documented justification within 48 hours. If unsubmitted or rejected by HR, the candidate is blocked by default across ongoing drives.
              </div>
            </div>
          )}

          {/* 6. RECRUITMENT PIPELINE STAGES (STEPPER) */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Recruitment Pipeline Progress
            </h4>
            <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
              {application.stages.map((stage) => {
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'current';

                return (
                  <div key={stage.step} className="relative">
                    <span
                      className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 ring-indigo-200'
                          : 'bg-slate-300'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </span>

                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-indigo-700'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          Stage {stage.step}: {stage.title}
                        </span>
                        {stage.date && (
                          <span className="text-[10px] text-slate-400">{stage.date}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. AUDIT STATUS HISTORY */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Application Audit Log
            </h4>
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              {application.statusHistory.map((item, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-slate-700">
                      {item.status}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
