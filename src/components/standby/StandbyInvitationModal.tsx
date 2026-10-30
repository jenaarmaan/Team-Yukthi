import React, { useState } from 'react';
import { Application, StandbyInvitation } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  Sparkles,
  Building2,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface StandbyInvitationModalProps {
  application: Application | null;
  onClose: () => void;
  onActionComplete: () => void;
}

export const StandbyInvitationModal: React.FC<StandbyInvitationModalProps> = ({
  application,
  onClose,
  onActionComplete
}) => {
  if (!application || !application.standbyInfo) return null;

  const standby = application.standbyInfo;
  const isReplacementOffered = standby.invitationStatus === 'replacement_offered';
  const isPendingResponse = standby.invitationStatus === 'pending_response';
  const isAcceptedStandby = standby.invitationStatus === 'accepted';
  const isConfirmed = standby.invitationStatus === 'confirmed_slot' || application.status === 'confirmed';
  const isDeclined = standby.invitationStatus === 'declined';

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const handleRespond = (accept: boolean) => {
    const ok = recruitmentService.respondToStandbyInvitation(application.id, accept);
    if (ok) {
      setFeedbackMsg({
        type: accept ? 'success' : 'info',
        text: accept
          ? 'You have joined the Priority Standby pool. We will alert you immediately if a replacement slot opens up.'
          : 'You have declined standby priority for this hiring drive.'
      });
      setTimeout(() => {
        onActionComplete();
      }, 1200);
    }
  };

  const handleClaimReplacementSlot = () => {
    const res = recruitmentService.acceptReplacementInterviewSlot(application.id);
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: res.message || 'Replacement interview slot confirmed! Your application status has updated to CONFIRMED. Your QR Pass is ready.'
      });
      setTimeout(() => {
        onActionComplete();
      }, 1200);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.message || 'Failed to confirm replacement slot. Please try again.'
      });
    }
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                {isReplacementOffered ? 'Vacant Slot Replacement Offer' : 'Proactive Standby Management'}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {standby.jobRole}
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
          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* CRITICAL ENTERPRISE POLICY NOTE */}
          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-950">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              NIYOJAN Proactive Standby Principle
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Standby status is distinct from Waitlist. Standby candidates are pre-qualified talent willing to take an interview slot if another candidate cancels, reschedules, or is absent.
            </p>
          </div>

          {/* SCENARIO A: URGENT REPLACEMENT SLOT OFFERED */}
          {isReplacementOffered && standby.replacementSlot && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  Vacant Slot Opportunity
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                  Limited Time Offer
                </span>
              </div>

              <p className="text-xs text-amber-950 leading-relaxed">
                A confirmed candidate dropped out for the upcoming drive. You have been prioritized to lock in this interview slot!
              </p>

              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{standby.replacementSlot.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Time Window:</span>
                  <span className="font-bold text-slate-900">{standby.replacementSlot.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-bold text-slate-900">{standby.replacementSlot.venue}</span>
                </div>
              </div>

              <button
                onClick={handleClaimReplacementSlot}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Lock In This Interview Slot</span>
              </button>
            </div>
          )}

          {/* SCENARIO B: PENDING STANDBY INVITATION RESPONSE */}
          {isPendingResponse && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hiring Organization:</span>
                  <span className="font-bold text-slate-900">{standby.company}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-bold text-slate-900">{standby.jobRole}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Interview Venue:</span>
                  <span className="font-bold text-slate-900">{standby.location}</span>
                </div>
                {standby.potentialSlotDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Potential Window:</span>
                    <span className="font-bold text-indigo-700">{standby.potentialSlotDate}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 italic">
                * Note: Accepting this invitation does NOT mean you have a confirmed slot yet. You will be prioritized when vacancies open.
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleRespond(true)}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Standby</span>
                </button>
                <button
                  onClick={() => handleRespond(false)}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          )}

          {/* SCENARIO C: ALREADY ACCEPTED STANDBY */}
          {isAcceptedStandby && !isReplacementOffered && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active on Priority Standby Pool
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                You are registered as available for {standby.location}. When an interview slot becomes vacant, the automated dispatcher will ping your NIYOJAN app immediately.
              </p>
            </div>
          )}

          {/* SCENARIO D: ALREADY CONFIRMED FROM STANDBY */}
          {isConfirmed && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Interview Confirmed!
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                You have successfully transitioned from standby to a Confirmed Interview slot. Your QR check-in pass is active in Applications.
              </p>
            </div>
          )}

          {/* SCENARIO E: DECLINED */}
          {isDeclined && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">Standby Invitation Declined</div>
              <p className="text-[11px] text-slate-500">
                You opted out of standby notifications for this hiring drive.
              </p>
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
