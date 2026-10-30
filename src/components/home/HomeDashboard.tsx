import React from 'react';
import {
  CandidateProfile,
  Application,
  AppNotification,
  HiringDrive
} from '../../types/recruitment';
import { StatusBadge, CandidateTypeBadge } from '../common/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Building2,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Award
} from 'lucide-react';

interface HomeDashboardProps {
  profile: CandidateProfile;
  applications: Application[];
  notifications: AppNotification[];
  hiringDrives: HiringDrive[];
  onNavigateToTab: (tab: 'home' | 'opportunities' | 'applications' | 'notifications' | 'profile') => void;
  onOpenApplicationDetail: (application: Application) => void;
  onOpenDriveDetail: (drive: HiringDrive) => void;
  onOpenQrCheckIn: (application: Application) => void;
  onOpenStandbyModal: (application: Application) => void;
  onOpenAbsenceModal: (application: Application) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  applications,
  notifications,
  hiringDrives,
  onNavigateToTab,
  onOpenApplicationDetail,
  onOpenDriveDetail,
  onOpenQrCheckIn,
  onOpenStandbyModal,
  onOpenAbsenceModal
}) => {
  // Find key applications
  const confirmedApp = applications.find((a) => a.status === 'confirmed' && a.interviewSlot);
  const waitlistApp = applications.find((a) => a.status === 'waitlisted' && a.waitlistInfo);
  const standbyApp = applications.find((a) => a.status === 'standby' && a.standbyInfo);
  const absenceApp = applications.find((a) => a.absenceRecord && a.status === 'under_review');
  const blockedApp = applications.find((a) => a.status === 'blocked');

  // Featured drive (Graduate Software Engineer or Full Stack)
  const featuredDrive = hiringDrives[0];

  // Stats
  const totalApplied = applications.length;
  const confirmedCount = applications.filter((a) => a.status === 'confirmed').length;
  const inReviewCount = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under_review' || a.status === 'eligible'
  ).length;

  return (
    <div className="space-y-4 pb-20">
      {/* 1. GREETING & PROFILE SUMMARY CARD */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 rounded-3xl p-5 text-white shadow-lg shadow-indigo-900/15 relative overflow-hidden">
        {/* Subtle decorative background wave */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div>
              <span className="text-[11px] font-semibold text-indigo-200 tracking-wide uppercase">
                Welcome to NIYOJAN
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                Hello, {profile.fullName.split(' ')[0]} 👋
              </h2>
            </div>
            <CandidateTypeBadge type={profile.candidateType} />
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-100 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span className="truncate">
              Current: <strong className="text-white">{profile.currentLocation}</strong> · Preferred:{' '}
              <strong className="text-white">{profile.preferredLocations.join(', ')}</strong>
            </span>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-indigo-100 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-300" />
                Profile Readiness
              </span>
              <span className="font-bold text-white font-mono">
                {profile.profileCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${profile.profileCompletionPercentage}%` }}
              />
            </div>
            {profile.profileCompletionPercentage < 100 && (
              <button
                onClick={() => onNavigateToTab('profile')}
                className="text-[11px] text-indigo-200 hover:text-white mt-1.5 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Upload resume and add skills to reach 100%</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. RECRUITMENT ACTION CARDS (DYNAMIC HIGHLIGHTS) */}

      {/* A. Replacement Slot Offered (Highest Priority Alert!) */}
      {standbyApp && standbyApp.standbyInfo?.invitationStatus === 'replacement_offered' && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-md animate-pulse">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
                  Urgent Opportunity
                </span>
                <h3 className="text-sm font-extrabold text-white leading-tight">
                  Vacant Slot Offered from Standby Pool!
                </h3>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
              Action Required
            </span>
          </div>
          <p className="text-xs text-amber-50 mt-2">
            A confirmed candidate slot opened for <strong>{standbyApp.role}</strong> at{' '}
            {standbyApp.standbyInfo.replacementSlot?.venue}. Confirm before time expires.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onOpenStandbyModal(standbyApp)}
              className="flex-1 py-2 rounded-xl bg-white text-orange-700 font-bold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Review & Lock In Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* B. Confirmed Interview Slot Card */}
      {confirmedApp && confirmedApp.interviewSlot && (
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Confirmed Interview Allocation
              </span>
            </div>
            <StatusBadge status="confirmed" size="sm" />
          </div>

          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
            {confirmedApp.role}
          </h3>
          <p className="text-xs text-slate-500">{confirmedApp.company}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-start gap-1.5 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Date</span>
                <span className="font-bold text-slate-900">{confirmedApp.interviewSlot.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Time</span>
                <span className="font-bold text-slate-900">{confirmedApp.interviewSlot.time}</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{confirmedApp.interviewSlot.roomOrPanel}</span>
          </div>

          {/* Quick Check-In CTA */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => onOpenQrCheckIn(confirmedApp)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>
                {confirmedApp.interviewSlot.attendanceVerified
                  ? 'View Checked-In Pass'
                  : 'Open In-App QR Pass & Check-In'}
              </span>
            </button>

            <button
              onClick={() => onOpenApplicationDetail(confirmedApp)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs active:scale-[0.98] transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* C. Dynamic Waitlist Card */}
      {waitlistApp && waitlistApp.waitlistInfo && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Dynamic Waitlist Queue
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Position #{waitlistApp.waitlistInfo.position}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900">{waitlistApp.role}</h3>
          <p className="text-xs text-slate-500">{waitlistApp.company}</p>

          <div className="mt-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 space-y-1">
            <div className="font-semibold text-amber-950">Next Steps & Slot Allocation Policy:</div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              {waitlistApp.waitlistInfo.expectedNextSteps}
            </p>
            {waitlistApp.waitlistInfo.tentativeFutureDate && (
              <p className="text-[11px] font-bold text-amber-900 pt-1">
                Tentative Next Drive: {waitlistApp.waitlistInfo.tentativeFutureDate}
              </p>
            )}
          </div>

          <button
            onClick={() => onOpenApplicationDetail(waitlistApp)}
            className="w-full mt-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
          >
            <span>View Waitlist Progress Tracker</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* D. Standby Invitation Pending Card */}
      {standbyApp && standbyApp.standbyInfo?.invitationStatus === 'pending_response' && (
        <div className="bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Priority Standby Pool Invitation
            </span>
            <StatusBadge status="standby" size="sm" />
          </div>

          <h3 className="text-sm font-bold text-slate-900">{standbyApp.role}</h3>
          <p className="text-xs text-slate-500">{standbyApp.company} · {standbyApp.standbyInfo.location}</p>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Excelsoft Technologies has selected you for the priority standby pool. If a slot opens up due to attendance drops, you receive first priority.
          </p>

          <button
            onClick={() => onOpenStandbyModal(standbyApp)}
            className="w-full mt-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <span>Respond to Standby Invitation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* E. Experienced Candidate Absence Review Pending */}
      {absenceApp && (
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Absence Justification Under Review
            </span>
            <StatusBadge status="under_review" size="sm" />
          </div>

          <h3 className="text-sm font-bold text-slate-900">{absenceApp.role}</h3>
          <p className="text-xs text-slate-600 mt-1">
            Your medical/absence explanation and document have been logged and are under review by the Talent Acquisition Committee.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onOpenAbsenceModal(absenceApp)}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              <span>View Review Details / Simulate HR</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* F. Blocked Candidate Alert */}
      {blockedApp && (
        <div className="bg-red-50/80 rounded-2xl p-4 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Account Blocked Under Recruitment Policy
              </h4>
            </div>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            {blockedApp.rejectionReason ||
              'Interview absence without explanation within the policy deadline resulted in candidate profile restriction.'}
          </p>
          <button
            onClick={() => onOpenApplicationDetail(blockedApp)}
            className="text-xs font-bold text-red-900 underline mt-1"
          >
            Review Absence Policy Breakdown
          </button>
        </div>
      )}

      {/* 3. APPLICATION STATS */}
      <div className="grid grid-cols-3 gap-2.5">
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{totalApplied}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Drives</div>
        </div>

        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Confirmed</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{confirmedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Slots Ready</div>
        </div>

        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Queue / Review</div>
          <div className="text-xl font-extrabold text-amber-700 mt-1 font-mono">{inReviewCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Active Pipelines</div>
        </div>
      </div>

      {/* 4. FEATURED HIRING DRIVE SPOTLIGHT (Excelsoft Technologies) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Featured Excelsoft Drive
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Registration Open
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900">{featuredDrive.title}</h4>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{featuredDrive.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {featuredDrive.locations.join(', ')}
          </span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            Min CGPA: {featuredDrive.minimumCgpa}
          </span>
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
            {featuredDrive.totalOpenings} Openings
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Date: <strong>Nov 20, 2026</strong>
          </span>
          <button
            onClick={() => onOpenDriveDetail(featuredDrive)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>View & Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. RECENT ALERTS FEED */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recruitment Notifications
          </h3>
          <button
            onClick={() => onNavigateToTab('notifications')}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
          >
            View All ({notifications.length})
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNavigateToTab('notifications')}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
                notif.isRead
                  ? 'bg-slate-50/60 border-slate-100'
                  : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                  notif.isRead ? 'bg-slate-300' : 'bg-indigo-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
