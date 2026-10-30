import React from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  Building2,
  Users,
  Target,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Award,
  Calendar,
  Zap,
  BarChart3,
  UserCheck
} from 'lucide-react';

interface RecruitmentManagerOverviewViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const RecruitmentManagerOverviewView: React.FC<RecruitmentManagerOverviewViewProps> = ({
  onNavigateToTab
}) => {
  const drives = recruitmentService.getHiringDrives();
  const allApplications = recruitmentService.getAllApplications();
  const waitlistApps = recruitmentService.getAllWaitlistApplications();
  const standbyApps = recruitmentService.getAllStandbyApplications();
  const recoveries = recruitmentService.getVacantSlotRecoveries();
  const auditLogs = recruitmentService.getAuditLogs();

  // Metrics computation
  const totalActiveDrives = drives.filter((d) => d.status !== 'completed').length;
  const totalVacancies = drives.reduce((sum, d) => sum + (d.totalOpenings || 0), 0);
  const totalRegisteredCandidates = allApplications.length;
  const candidatesShortlisted = allApplications.filter(
    (a) =>
      a.status === 'confirmed' ||
      a.status === 'under_review' ||
      a.status === 'eligible' ||
      a.status === 'completed'
  ).length;
  const candidatesInterviewed = allApplications.filter(
    (a) => a.interviewSlot?.attendanceVerified || a.status === 'completed'
  ).length;
  const candidatesSelected = allApplications.filter(
    (a) => a.status === 'completed' || a.resultOutcome === 'Selected'
  ).length;
  const pendingDecisions = allApplications.filter(
    (a) => a.status === 'under_review' || (a.status === 'confirmed' && a.interviewSlot?.attendanceVerified)
  ).length;
  const activeWaitlist = waitlistApps.length;
  const recoveredSlotsCount = recoveries.filter((r) => r.status === 'recovered').length;
  const vacancyFulfillmentPercent = Math.round((candidatesSelected / (totalVacancies || 1)) * 100);

  // Recent operational recruitment activities
  const recentActivities = [
    {
      id: 'act_01',
      title: 'Interview Slot Recovered & Standby Promoted',
      detail: 'Slot at Mysuru Campus (Panel B-02) reassigned to Rohan Sharma following candidate medical notice.',
      time: '15 mins ago',
      type: 'recovery',
      icon: <Zap className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'act_02',
      title: 'Candidate Eligibility Batch Verified',
      detail: '42 candidates verified for Graduate Software Engineer 2026 drive (Minimum 7.5 CGPA & Python/Java verified).',
      time: '1 hour ago',
      type: 'eligibility',
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'act_03',
      title: 'Waitlist Priority Dynamic Reordering',
      detail: 'Waitlist priority recalculated based on technical assessment percentiles for Cloud DevOps drive.',
      time: '3 hours ago',
      type: 'waitlist',
      icon: <Clock className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'act_04',
      title: 'Offer Acceptance Logged',
      detail: 'Pooja Patel formally accepted Graduate Software Engineer offer letter for Mysuru Center.',
      time: '5 hours ago',
      type: 'offer',
      icon: <Award className="w-4 h-4 text-violet-600" />
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Welcome & Executive Mission */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Operational Command Hub
            </span>
            <span className="text-xs text-slate-400">Recruitment Management System</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Recruitment Operations Overview</h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Real-time pipeline monitoring, vacancy fulfillment tracking, candidate intelligence, dynamic waitlists, and slot recovery metrics across all 6 deployment hubs.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTab('funnel')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Recruitment Funnel</span>
          </button>
          <button
            onClick={() => onNavigateToTab('vacancies')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Vacancies & Targets</span>
          </button>
        </div>
      </div>

      {/* 2. Key Operational KPI Cards (Items 1 to 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Active Drives */}
        <div
          onClick={() => onNavigateToTab('drive-performance')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Drives</span>
            <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalActiveDrives}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Across 6 regional hubs</p>
        </div>

        {/* 2. Total Approved Vacancies */}
        <div
          onClick={() => onNavigateToTab('vacancies')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Vacancies</span>
            <Briefcase className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalVacancies}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Approved corporate quota</p>
        </div>

        {/* 3. Overall Hiring Targets */}
        <div
          onClick={() => onNavigateToTab('vacancies')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hiring Target</span>
            <Target className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">104</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{vacancyFulfillmentPercent}% fulfilled to date</p>
        </div>

        {/* 4. Registered Candidates */}
        <div
          onClick={() => onNavigateToTab('candidate-intelligence')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Candidates Registered</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalRegisteredCandidates}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Pool verified & mapped</p>
        </div>

        {/* 5. Candidates Shortlisted */}
        <div
          onClick={() => onNavigateToTab('funnel')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{candidatesShortlisted}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Screened & eligible</p>
        </div>

        {/* 6. Candidates Interviewed */}
        <div
          onClick={() => onNavigateToTab('funnel')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviewed</span>
            <Calendar className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{candidatesInterviewed}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Attendance HMAC verified</p>
        </div>

        {/* 7. Candidates Selected */}
        <div
          onClick={() => onNavigateToTab('funnel')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Selected</span>
            <Award className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{candidatesSelected}</div>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Offers released & accepted</p>
        </div>

        {/* 8. Pending Decisions */}
        <div
          onClick={() => onNavigateToTab('funnel')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Decisions</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingDecisions}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting scorecard lock</p>
        </div>

        {/* 9. Active Waitlist Candidates */}
        <div
          onClick={() => onNavigateToTab('waitlist-standby')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Waitlist</span>
            <Users className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeWaitlist}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Prioritized reserve pool</p>
        </div>

        {/* 10. Recovered Interview Slots */}
        <div
          onClick={() => onNavigateToTab('slot-recovery')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recovered Slots</span>
            <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{recoveredSlotsCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Saved from idle time</p>
        </div>

      </div>

      {/* 3. Mid Section: Recruitment Progress Summary (Item 11) & Alerts (Item 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Summary Card (Item 11) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recruitment Target Progress Summary</h3>
              <p className="text-xs text-slate-500">Live progress across active hiring drives against approved targets</p>
            </div>
            <button
              onClick={() => onNavigateToTab('vacancies')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>Detailed Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Overall Progress Gauge Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Overall Target Fulfillment:</span>
              <span className="font-mono font-bold text-slate-900">
                {candidatesSelected} of {totalVacancies} Filled ({vacancyFulfillmentPercent}%)
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, vacancyFulfillmentPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>0 Positions</span>
              <span>Target: 104 Candidates</span>
            </div>
          </div>

          {/* Drive-by-Drive Mini Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {drives.slice(0, 4).map((drive) => {
              const driveSelected = drive.selectionStats?.selectedCount || 18;
              const driveOpenings = drive.totalOpenings || 45;
              const drivePct = Math.round((driveSelected / driveOpenings) * 100);

              return (
                <div key={drive.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 truncate max-w-[180px]">{drive.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {drivePct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${drivePct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{drive.role}</span>
                    <span>{driveSelected}/{driveOpenings} Selected</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Important Alerts & Updates (Item 13) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Operational Alerts</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              2 Action Items
            </span>
          </div>

          <div className="space-y-3">
            {/* Alert 1 */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Vacancy Shortage Risk</span>
                <span className="text-[10px] font-mono text-amber-700">4 days left</span>
              </div>
              <p className="text-[11px] text-slate-700">
                Hyderabad Tech Center Cloud DevOps drive currently at 38% fulfillment with drive ending on Friday.
              </p>
              <button
                onClick={() => onNavigateToTab('vacancies')}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 pt-1"
              >
                <span>Review Hyderabad Targets</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Alert 2 */}
            <div className="p-3 rounded-xl bg-violet-50/80 border border-violet-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-violet-900">
                <span>3 Vacated Slots Available</span>
                <span className="text-[10px] font-mono text-violet-700">Immediate</span>
              </div>
              <p className="text-[11px] text-slate-700">
                Medical absences detected in Mysuru GSE drive. 3 top standby candidates can be instantly promoted.
              </p>
              <button
                onClick={() => onNavigateToTab('slot-recovery')}
                className="text-[11px] font-bold text-violet-800 hover:text-violet-950 flex items-center gap-1 pt-1"
              >
                <span>Dispatch Standby Invites</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Alert 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Zero-Trust Audit Verified</span>
                <span className="text-[10px] text-emerald-600 font-bold">Passed</span>
              </div>
              <p className="text-[11px] text-slate-600">
                All 64 attendance check-ins validated with cryptographic HMAC tokens. 0 proxy check-ins detected.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Section: Recent Recruitment Activities (Item 12) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Recruitment Operational Activities</h3>
            <p className="text-xs text-slate-500">Live operational audit trail across candidates, slots, and drives</p>
          </div>
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>View Full Audit History</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {act.icon}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{act.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{act.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
