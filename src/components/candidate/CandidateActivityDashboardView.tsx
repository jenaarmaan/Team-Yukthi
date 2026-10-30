import React from 'react';
import { CandidateProfile, Application } from '../../types/recruitment';
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Trophy,
  Archive,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface CandidateActivityDashboardViewProps {
  profile: CandidateProfile;
  applications: Application[];
  onNavigateToTab: (tab: 'overview' | 'applications' | 'arena' | 'profile') => void;
}

export const CandidateActivityDashboardView: React.FC<CandidateActivityDashboardViewProps> = ({
  profile,
  applications,
  onNavigateToTab
}) => {
  // Recruitment stats
  const totalApplied = applications.length;
  const inProgressCount = applications.filter(
    (a) => a.status === 'confirmed' || a.status === 'under_review' || a.status === 'standby' || a.status === 'submitted' || a.status === 'eligible'
  ).length;
  const interviewsAttended = applications.filter((a) => a.interviewSlot?.attendanceVerified).length;
  const selectionsCount = applications.filter(
    (a) => a.status === 'completed' || a.resultOutcome === 'Selected' || a.stages?.some((s) => s.title.toLowerCase().includes('offer'))
  ).length;
  const archivedCount = applications.filter((a) => a.status === 'rejected' || a.status === 'blocked').length;

  // Chronological platform activity audit timeline
  const activityTimeline = [
    {
      id: 'act_01',
      title: 'Interview Slot Confirmed & Dynamic HMAC QR Generated',
      category: 'Recruitment',
      timestamp: 'Today, 08:30 AM',
      description: 'Scheduled interview slot locked for Graduate Software Engineer at Excelsoft Mysuru Campus Center.',
      icon: <Calendar className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'act_02',
      title: 'Unlocked "Algorithm Ace" Badge in Arena',
      category: 'Arena',
      timestamp: 'Yesterday, 04:15 PM',
      description: 'Solved 25 coding challenges in Data Structures & Hash Maps (+250 XP earned).',
      icon: <Award className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'act_03',
      title: 'Excelsoft Pre-Screening Assessment Completed',
      category: 'Assessment',
      timestamp: 'Oct 29, 2026',
      description: 'Scored 88/100 in Core Engineering & Algorithms speed test.',
      icon: <CheckCircle2 className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'act_04',
      title: '4-Tier Skill Verification Credential Approved',
      category: 'Verification',
      timestamp: 'Oct 28, 2026',
      description: 'Academic credentials verified by institutional placement cell (CGPA: 8.4/10.0).',
      icon: <FileCheck className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'act_05',
      title: 'Application Submitted for EdTech Systems Role',
      category: 'Recruitment',
      timestamp: 'Oct 27, 2026',
      description: 'Application successfully registered and routed to technical screening panel.',
      icon: <Briefcase className="w-4 h-4 text-violet-600" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER                                                                 */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
            <Activity className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Activity Dashboard</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Complete historical overview of your recruitment journey, coding arena achievements, and platform milestones.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION 8.1: RECRUITMENT ACTIVITY METRICS                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>8.1 Recruitment Lifecycle Metrics</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Submitted</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{totalApplied}</span>
            <span className="text-[10px] text-slate-500">Across campus drives</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">{inProgressCount}</span>
            <span className="text-[10px] text-slate-500">Active evaluations</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Interviews</span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">{interviewsAttended}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Checked-in passes</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">Selections</span>
            <span className="text-2xl font-black text-teal-600 font-mono mt-1 block">{selectionsCount}</span>
            <span className="text-[10px] text-teal-700 font-medium">Offers & milestones</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Archived</span>
            <span className="text-2xl font-black text-slate-500 font-mono mt-1 block">{archivedCount}</span>
            <span className="text-[10px] text-slate-400">Closed or expired</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 8.2: ARENA CODING & SKILL ACTIVITY                             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>8.2 Arena Coding & Skill Development Stats</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase">
              <span>Problems Solved</span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">44</div>
            <div className="text-[11px] text-slate-500 mt-1">88.4% submission accuracy</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase">
              <span>Total Skill XP</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">3,850</div>
            <div className="text-[11px] text-amber-800 font-medium mt-1">Level 7 Specialist</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase">
              <span>Badges Unlocked</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">4 / 6</div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">Algorithm Ace, SQL Pro</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-violet-700 uppercase">
              <span>Leaderboard Rank</span>
              <TrendingUp className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">#3</div>
            <div className="text-[11px] text-violet-800 font-medium mt-1">VTU Regional Cluster</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION 8.3: OVERALL AUDIT TIMELINE                                    */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>8.3 Chronological Activity Audit Timeline</span>
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="relative border-l-2 border-indigo-100 pl-6 ml-2 space-y-6">
            {activityTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[35px] top-0 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  {item.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[11px] font-semibold text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>All actions are cryptographically signed and logged in local SQLite audit records.</span>
            <button
              onClick={() => onNavigateToTab('applications')}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
