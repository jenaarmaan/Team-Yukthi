import React, { useState } from 'react';
import { Application, CandidateProfile } from '../../types/recruitment';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Sparkles,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ApplicationsTrackerProps {
  applications: Application[];
  candidateProfile: CandidateProfile;
  onOpenApplicationDetail: (application: Application) => void;
  onOpenQrCheckIn: (application: Application) => void;
  onOpenStandbyModal: (application: Application) => void;
  onOpenAbsenceModal: (application: Application) => void;
  onNavigateToOpportunities: () => void;
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  candidateProfile,
  onOpenApplicationDetail,
  onOpenQrCheckIn,
  onOpenStandbyModal,
  onOpenAbsenceModal,
  onNavigateToOpportunities
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'standby' | 'archived'>('all');

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === 'active') {
      return ['confirmed', 'waitlisted', 'under_review', 'eligible', 'submitted'].includes(app.status);
    }
    if (activeFilter === 'standby') {
      return app.status === 'standby';
    }
    if (activeFilter === 'archived') {
      return ['completed', 'rejected', 'blocked'].includes(app.status);
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeFilter === 'active' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('standby')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeFilter === 'standby' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          Standby
        </button>
        <button
          onClick={() => setActiveFilter('archived')}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeFilter === 'archived' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          History
        </button>
      </div>

      {/* Applications list */}
      {filteredApplications.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-xs font-bold text-slate-700">No applications in this category</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Explore open hiring drives and submit your candidacy.
            </p>
          </div>
          <button
            onClick={onNavigateToOpportunities}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <span>Browse Hiring Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => {
            const currentStage = app.stages.find((s) => s.status === 'current') || app.stages[app.stages.length - 1];
            const completedStagesCount = app.stages.filter((s) => s.status === 'completed').length;
            const progressPercent = Math.round((completedStagesCount / app.stages.length) * 100);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      {app.company}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {app.role}
                    </h3>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                {/* Location & Applied Date */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.appliedLocation}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied: {new Date(app.appliedDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Stepper Progress Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Current Stage: <span className="text-indigo-700">{currentStage?.title}</span>
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-500">
                      Stage {currentStage?.step} of {app.stages.length}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(15, progressPercent)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    {currentStage?.description}
                  </p>
                </div>

                {/* CONTEXTUAL ACTION BUTTONS BASED ON STATE */}

                {/* If Confirmed Interview */}
                {app.status === 'confirmed' && app.interviewSlot && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onOpenQrCheckIn(app)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{app.interviewSlot.attendanceVerified ? 'View Pass' : 'In-App QR Pass'}</span>
                    </button>
                    <button
                      onClick={() => onOpenApplicationDetail(app)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs active:scale-[0.98] transition-colors"
                    >
                      Details
                    </button>
                  </div>
                )}

                {/* If Standby with Urgent Replacement Offer */}
                {app.status === 'standby' && app.standbyInfo?.invitationStatus === 'replacement_offered' && (
                  <div className="pt-1">
                    <button
                      onClick={() => onOpenStandbyModal(app)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Claim Vacant Slot (Urgent)</span>
                    </button>
                  </div>
                )}

                {/* If Standby Pending Response */}
                {app.status === 'standby' && app.standbyInfo?.invitationStatus === 'pending_response' && (
                  <div className="pt-1">
                    <button
                      onClick={() => onOpenStandbyModal(app)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
                    >
                      <span>Respond to Standby Invitation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* If Waitlisted */}
                {app.status === 'waitlisted' && app.waitlistInfo && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      Waitlist Position #{app.waitlistInfo.position}
                    </span>
                    <button
                      onClick={() => onOpenApplicationDetail(app)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      <span>Queue Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* If Under Review (Absence) */}
                {app.status === 'under_review' && app.absenceRecord && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700">
                      Absence justification submitted
                    </span>
                    <button
                      onClick={() => onOpenAbsenceModal(app)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <span>Review Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* If Blocked */}
                {app.status === 'blocked' && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      Blocked under policy
                    </span>
                    <button
                      onClick={() => onOpenApplicationDetail(app)}
                      className="text-xs font-bold text-red-700 underline"
                    >
                      Policy Breakdown
                    </button>
                  </div>
                )}

                {/* Default Details button for other statuses */}
                {!['confirmed', 'standby', 'waitlisted', 'under_review', 'blocked'].includes(app.status) && (
                  <div className="pt-1 text-right">
                    <button
                      onClick={() => onOpenApplicationDetail(app)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 ml-auto"
                    >
                      <span>View Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
