import React from 'react';
import {
  CandidateProfile,
  HiringDrive,
  Application,
  AppNotification
} from '../../types/recruitment';
import {
  Sparkles,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Award,
  Bell,
  Compass,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface CandidateOverviewViewProps {
  candidateProfile: CandidateProfile;
  hiringDrives: HiringDrive[];
  applications: Application[];
  notifications: AppNotification[];
  onNavigateToTab: (tab: 'applications' | 'arena' | 'profile' | 'notifications' | 'dashboard') => void;
  onOpenDriveDetail: (drive: HiringDrive) => void;
  onOpenQrCheckIn: (app: Application) => void;
  onOpenStandbyModal: (app: Application) => void;
  onOpenAbsenceModal: (app: Application) => void;
}

export const CandidateOverviewView: React.FC<CandidateOverviewViewProps> = ({
  candidateProfile,
  hiringDrives,
  applications,
  notifications,
  onNavigateToTab,
  onOpenDriveDetail,
  onOpenQrCheckIn,
  onOpenStandbyModal,
  onOpenAbsenceModal
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Active confirmed interview slot
  const confirmedInterviewApp = applications.find(
    (a) => a.status === 'confirmed' && a.interviewSlot
  );

  // Standby offer waiting for response
  const standbyApp = applications.find(
    (a) => a.status === 'standby' && a.standbyInfo?.invitationStatus === 'replacement_offered'
  );

  // Absence requiring justification
  const absenceApp = applications.find(
    (a) => a.absenceRecord && (a.status === 'under_review' || a.status === 'blocked')
  );

  // Profile completion calculation
  const profileCompletion = candidateProfile.profileCompletionPercentage || 85;

  // Filter recently listed and upcoming drives
  const openDrives = hiringDrives.filter((d) => d.isRegistrationOpen);
  const recommendedDrives = openDrives.filter((d) => {
    // Recommend if CGPA meets requirement or skills overlap
    return (
      (candidateProfile.education?.cgpa || 0) >= d.minimumCgpa ||
      d.mandatorySkills.some((s) =>
        candidateProfile.skills?.some((cs) => cs.name.toLowerCase().includes(s.toLowerCase()))
      )
    );
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER & DATE                                                  */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-indigo-950/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{currentDateFormatted}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300">Active Campus Drive Cycle</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {candidateProfile.fullName || 'Candidate'}!
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Explore newly opened campus opportunities from Excelsoft Technologies, monitor your scheduled interview passes, and sharpen your skills in the Coding Arena.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('arena')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Practice in Arena</span>
              <ArrowRight className="w-4 h-4 text-indigo-700" />
            </button>
            <button
              onClick={() => onNavigateToTab('profile')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROFILE COMPLETION & URGENT RECRUITMENT STATUS WIDGETS                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Completion Bar */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm">Profile Completion Status</span>
              </div>
              <span className="text-xs font-black text-indigo-600 font-mono">{profileCompletion}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-700"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              {profileCompletion >= 90
                ? 'Your profile is fully verified for priority campus screening and automated shortlisting.'
                : 'Upload your verified transcript and add GitHub project links to reach 100% eligibility score.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Last verified: Today, 08:30 AM</span>
            <button
              onClick={() => onNavigateToTab('profile')}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Update Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Urgent Alerts / Confirmed Slot / Standby Notification Banner */}
        <div className="lg:col-span-7 space-y-4">
          {/* Confirmed Slot Card */}
          {confirmedInterviewApp?.interviewSlot && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Upcoming Confirmed Interview</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {confirmedInterviewApp.role} — {confirmedInterviewApp.company}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{confirmedInterviewApp.interviewSlot.date} at {confirmedInterviewApp.interviewSlot.time}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{confirmedInterviewApp.interviewSlot.location} (Room {confirmedInterviewApp.interviewSlot.roomOrPanel || '101'})</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenQrCheckIn(confirmedInterviewApp)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 cursor-pointer transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Open HMAC QR Pass</span>
              </button>
            </div>
          )}

          {/* Standby Offer Alert */}
          {standbyApp && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Urgent Replacement Standby Offer</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  A vacated interview slot has opened for {standbyApp.role}!
                </h4>
                <p className="text-xs text-amber-900">
                  You have a 4-hour window to accept this replacement slot before it passes to the next candidate.
                </p>
              </div>

              <button
                onClick={() => onOpenStandbyModal(standbyApp)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Review & Accept
              </button>
            </div>
          )}

          {/* Absence Action Alert */}
          {absenceApp && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Absence Justification Required</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Missed Interview Slot for {absenceApp.role}
                </h4>
                <p className="text-xs text-rose-900">
                  Submit medical or exam documentation within 24 hours to avoid progression holds.
                </p>
              </div>

              <button
                onClick={() => onOpenAbsenceModal(absenceApp)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Submit Reason
              </button>
            </div>
          )}

          {/* Default Summary Card if no urgent alerts */}
          {!confirmedInterviewApp && !standbyApp && !absenceApp && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">All Scheduled Activities Up to Date</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You have {applications.length} submitted application(s). Your verified credentials are active in the candidate talent pool.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('applications')}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
              >
                View Applications
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. RECOMMENDED & RECENT HIRING OPPORTUNITIES                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900">Recommended Hiring Opportunities</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Matched to your degree ({candidateProfile.education?.degree || 'B.E./B.Tech'}) and skills
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedDrives.slice(0, 3).map((drive) => {
            const hasApplied = applications.some((a) => a.hiringDriveId === drive.id);

            return (
              <div
                key={drive.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => onOpenDriveDetail(drive)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {drive.company}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {drive.locations.join(', ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {drive.title || drive.role}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {drive.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {drive.mandatorySkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {drive.mandatorySkills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-400">
                        +{drive.mandatorySkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Min CGPA: <strong className="text-slate-800">{drive.minimumCgpa}</strong> • Openings: <strong className="text-slate-800">{drive.totalOpenings}</strong>
                  </div>
                  <span className={`font-bold ${hasApplied ? 'text-emerald-600' : 'text-indigo-600 group-hover:translate-x-0.5 transition-transform'}`}>
                    {hasApplied ? 'Applied ✓' : 'View Details →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT ANNOUNCEMENTS & RECRUITMENT UPDATES                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Important Updates Column */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Important Recruitment Updates</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Live Campus Feed</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Excelsoft GSE 2026 Drive Dates Finalized</span>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Technical interview schedules for VTU Mysuru and Bengaluru clusters are locked. Candidates with confirmed slots can access dynamic HMAC QR passes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Arena Weekly Algorithmic Competition Live</span>
                <span className="text-[10px] text-slate-400">2 days ago</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Compete in dynamic programming and tree algorithms in the Arena to climb the campus leaderboard and earn priority screening endorsements.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Arena Gamification Teaser */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Coding Arena</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">
                Rank #3 in VTU
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900">
              Sharpen Your Technical Skills for Interviews
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              Solve curated problems across DSA, DBMS, and System Design with automated test case evaluation. Earn XP, maintain your daily streak, and unlock verified skill credentials.
            </p>
          </div>

          <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
            <div className="text-xs text-slate-600 font-medium">
              🔥 <strong>5-Day Streak</strong> • <strong>3,850 XP</strong>
            </div>
            <button
              onClick={() => onNavigateToTab('arena')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Enter Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

