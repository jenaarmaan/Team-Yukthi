import React, { useState } from 'react';
import { Application, HiringDrive } from '../../types/recruitment';
import {
  FileText,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Archive,
  Award,
  ChevronRight,
  MapPin,
  QrCode,
  Download,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface CandidateApplicationsViewProps {
  applications: Application[];
  hiringDrives: HiringDrive[];
  onOpenApplicationDetail: (app: Application) => void;
  onOpenQrCheckIn: (app: Application) => void;
  onOpenStandbyModal: (app: Application) => void;
  onOpenAbsenceModal: (app: Application) => void;
  onNavigateToOpportunities?: () => void;
}

type ApplicationSubTab = 'status' | 'archived' | 'achievements';

export const CandidateApplicationsView: React.FC<CandidateApplicationsViewProps> = ({
  applications,
  hiringDrives,
  onOpenApplicationDetail,
  onOpenQrCheckIn,
  onOpenStandbyModal,
  onOpenAbsenceModal,
  onNavigateToOpportunities
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ApplicationSubTab>('status');
  const [searchQuery, setSearchQuery] = useState('');

  const getAppCurrentStage = (app: Application) => {
    return (
      app.stages?.find((s) => s.status === 'current')?.title ||
      (app.status === 'completed' ? 'Offer & Selection' : 'Technical Evaluation')
    );
  };

  // Automatic application movement categorization:
  // 1. Achievements: selected applications (status: completed, or resultOutcome: Selected)
  const achievementApps = applications.filter(
    (a) =>
      a.status === 'completed' ||
      a.resultOutcome === 'Selected' ||
      a.stages?.some((s) => s.title.toLowerCase().includes('offer') && s.status === 'completed')
  );

  // 2. Archived: rejected, blocked, or expired applications
  const archivedApps = applications.filter(
    (a) => a.status === 'rejected' || a.status === 'blocked'
  );

  // 3. Ongoing Active Applications: all other ongoing recruitment workflows
  const activeApps = applications.filter(
    (a) =>
      a.status !== 'completed' &&
      a.resultOutcome !== 'Selected' &&
      !a.stages?.some((s) => s.title.toLowerCase().includes('offer') && s.status === 'completed') &&
      a.status !== 'rejected' &&
      a.status !== 'blocked'
  );

  const getFilteredList = (list: Application[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (a) =>
        a.role.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  };

  const currentDisplayList =
    activeSubTab === 'status'
      ? getFilteredList(activeApps)
      : activeSubTab === 'archived'
      ? getFilteredList(archivedApps)
      : getFilteredList(achievementApps);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'standby':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'waitlisted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'rejected':
      case 'blocked':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER & THREE APPLICATION TABS                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Applications Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track active interview progression, view past achievements, and inspect archived applications.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('status')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'status'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Application Status ({activeApps.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('achievements')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'achievements'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Achievements ({achievementApps.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('archived')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'archived'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-slate-500" />
            <span>Archived ({archivedApps.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & SUMMARY BAR                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, or status..."
            className="w-full text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-400 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-hidden transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
          <span>Showing <strong>{currentDisplayList.length}</strong> application(s)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. APPLICATION CARDS CONTENT                                              */}
      {/* ========================================================================= */}
      {currentDisplayList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            {activeSubTab === 'achievements' ? <Award className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {activeSubTab === 'achievements'
              ? 'No Selection Achievements Yet'
              : activeSubTab === 'archived'
              ? 'No Archived Applications'
              : 'No Active Applications Found'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeSubTab === 'achievements'
              ? 'Complete your scheduled interviews and assessments. Successfully selected roles and formal offer rollouts will appear here.'
              : activeSubTab === 'archived'
              ? 'Unsuccessful, closed, or withdrawn applications will be safely archived in this tab.'
              : 'You do not have any ongoing applications matching your search. Explore open hiring drives to submit an application.'}
          </p>
          {activeSubTab === 'status' && onNavigateToOpportunities && (
            <button
              onClick={onNavigateToOpportunities}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Explore Hiring Opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentDisplayList.map((app) => {
            const drive = hiringDrives.find((d) => d.id === app.hiringDriveId);
            const slot = app.interviewSlot;
            const isStandbyOffer = app.status === 'standby' && app.standbyInfo?.invitationStatus === 'replacement_offered';
            const isAbsenceRequired = app.absenceRecord && (app.status === 'under_review' || app.status === 'blocked');

            return (
              <div
                key={app.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Top Row: Role, Company, Applied Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                        {app.company}
                      </span>
                      <span className="text-xs text-slate-400">
                        Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Active Drive'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onOpenApplicationDetail(app)}>
                      {app.role}
                    </h3>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider font-mono ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Middle: 5-Stage Selection Progress Timeline */}
                <div className="py-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 font-medium">Recruitment Stage:</span>
                    <strong className="text-slate-800">{getAppCurrentStage(app)}</strong>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {['Screening', 'Assessment', 'Tech Round 1', 'Tech Round 2', 'HR Offer'].map((stageName, idx) => {
                      const isComplete =
                        app.status === 'completed' ||
                        (app.status === 'confirmed' && idx <= 2) ||
                        (app.status === 'standby' && idx <= 1) ||
                        ((app.status === 'submitted' || app.status === 'draft') && idx === 0);

                      const isCurrent =
                        (app.status === 'confirmed' && idx === 3) ||
                        (app.status === 'standby' && idx === 2) ||
                        ((app.status === 'submitted' || app.status === 'draft') && idx === 1);

                      return (
                        <div key={idx} className="space-y-1 text-center">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isComplete
                                ? 'bg-emerald-500'
                                : isCurrent
                                ? 'bg-indigo-600 animate-pulse'
                                : 'bg-slate-200'
                            }`}
                          />
                          <span className={`text-[10px] hidden sm:block ${isComplete ? 'text-emerald-700 font-bold' : isCurrent ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                            {stageName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduled Interview Details if present */}
                {slot && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Scheduled Interview Slot</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-slate-600">
                        <span><strong>Date:</strong> {slot.date}</span>
                        <span><strong>Time:</strong> {slot.time}</span>
                        <span><strong>Venue:</strong> {slot.location} (Room {slot.roomOrPanel || '101'})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${slot.attendanceVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {slot.attendanceVerified ? 'Checked In ✓' : 'Awaiting Check-In'}
                      </span>
                      <button
                        onClick={() => onOpenQrCheckIn(app)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Pass</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Hiring Department: <strong>{drive?.department || 'Engineering'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Standby Offer Trigger */}
                    {isStandbyOffer && (
                      <button
                        onClick={() => onOpenStandbyModal(app)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        Accept Standby Slot
                      </button>
                    )}

                    {/* Absence Justification Trigger */}
                    {isAbsenceRequired && (
                      <button
                        onClick={() => onOpenAbsenceModal(app)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        Submit Absence Reason
                      </button>
                    )}

                    {/* Achievements Offer Download Simulation */}
                    {activeSubTab === 'achievements' && (
                      <button
                        onClick={() => alert(`Downloading official Offer Letter for ${app.role} from ${app.company}...`)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Offer Letter</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenApplicationDetail(app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                    >
                      View Timeline
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
