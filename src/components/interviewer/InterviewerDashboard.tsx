import React, { useState, useEffect } from 'react';
import { InterviewerProfile, InterviewerCandidateSnapshot } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Play,
  FileEdit,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

interface InterviewerDashboardProps {
  interviewer: InterviewerProfile;
  onOpenCandidateSnapshot: (candidateId: string) => void;
  onOpenExecutionRoom: (slot: any) => void;
  onOpenScorecard: (slot: any) => void;
  onOpenQuestions: (candidateSkills: string[], role: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const InterviewerDashboard: React.FC<InterviewerDashboardProps> = ({
  interviewer,
  onOpenCandidateSnapshot,
  onOpenExecutionRoom,
  onOpenScorecard,
  onOpenQuestions,
  onNavigateTab
}) => {
  const [summary, setSummary] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'all'>('today');
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      recruitmentService.fetchInterviewerSummary(),
      recruitmentService.fetchInterviewerTodaySchedule(dateFilter, searchQuery)
    ])
      .then(([summaryRes, scheduleRes]) => {
        setSummary(summaryRes);
        setSchedule(scheduleRes);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, [interviewer.id, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Dedicated Interviewer Workspace</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Welcome, {interviewer.name}
          </h1>
          <p className="text-xs text-indigo-200 leading-relaxed">
            {interviewer.role} &bull; <strong className="text-white">{interviewer.assignedPanel}</strong> &bull; {interviewer.location} Evaluation Center
          </p>
        </div>

        {/* Panel Quota Pill */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/40 flex items-center justify-center text-white">
            <Clock className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-300">Daily Capacity Quota</div>
            <div className="text-base font-extrabold text-white font-mono">
              {summary?.remainingDailyCapacity ?? 4} Slots Remaining
            </div>
          </div>
        </div>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Assigned</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            {summary?.todayAssignedCount ?? schedule.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Assigned candidate interviews</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Completed Today</div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 tabular-nums">
            {summary?.completedTodayCount ?? 1}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5">Evaluations submitted</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Evaluations</div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono mt-1 tabular-nums">
            {summary?.pendingEvaluationsCount ?? 2}
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">Action required post-interview</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Evaluation Hours</div>
          <div className="text-2xl font-extrabold text-indigo-700 font-mono mt-1 tabular-nums">
            {summary?.totalInterviewHours ?? 1.0} hrs
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across completed panels</div>
        </div>
      </div>

      {/* Main Schedule Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>Assigned Interview Schedule</span>
            </h2>
            <p className="text-xs text-slate-500">Live candidate slot queue and execution actions</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1 rounded-md transition-all ${
                  dateFilter === 'today' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-3 py-1 rounded-md transition-all ${
                  dateFilter === 'week' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  dateFilter === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, role..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </form>
          </div>
        </div>

        {/* Schedule List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading interview schedule...</div>
        ) : schedule.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No interview assignments found matching current filter.
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((slot) => (
              <div
                key={slot.slotId}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Candidate & Drive Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{slot.candidateName}</span>
                    <span className="px-2 py-0.2 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {slot.candidateType}
                    </span>
                    {slot.attendanceVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Desk Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Check-in</span>
                      </span>
                    )}
                    {slot.evaluationStatus === 'submitted' && (
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Evaluated
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{slot.role}</span> &bull; {slot.hiringDriveTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-mono text-slate-700 font-semibold">{slot.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.roomOrPanel} &bull; {slot.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => onOpenCandidateSnapshot(slot.candidateId)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs"
                  >
                    Snapshot
                  </button>

                  <button
                    onClick={() =>
                      onOpenQuestions(
                        ['Java', 'Python', 'Data Structures & Algorithms', 'System Design'],
                        slot.role
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                  >
                    Questions
                  </button>

                  <button
                    onClick={() => onOpenScorecard(slot)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs"
                  >
                    Scorecard
                  </button>

                  <button
                    onClick={() => onOpenExecutionRoom(slot)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Live Console</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

