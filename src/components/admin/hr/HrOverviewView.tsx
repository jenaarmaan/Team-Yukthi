import React from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  Building2,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Bell,
  Award,
  Sparkles,
  ChevronRight,
  FileCheck2
} from 'lucide-react';

interface HrOverviewViewProps {
  onNavigateToTab: (tab: 'overview' | 'analytics' | 'drives') => void;
  onOpenUpcomingDrive?: (driveId: string) => void;
}

export const HrOverviewView: React.FC<HrOverviewViewProps> = ({
  onNavigateToTab,
  onOpenUpcomingDrive
}) => {
  const drives = recruitmentService.getHiringDrives();
  const candidates = recruitmentService.getAllCandidates();
  const applications = recruitmentService.getAllApplications();
  const recoveries = recruitmentService.getVacantSlotRecoveries();
  const absences = recruitmentService.getAllAbsenceRecords();
  const notifications = recruitmentService.getNotifications();

  // General Recruitment Statistics
  const totalDrives = drives.length;
  const activeDrives = drives.filter((d) => d.isRegistrationOpen || d.status === 'upcoming').length;
  const totalRegisteredCandidates = candidates.length;
  const confirmedInterviews = applications.filter((a) => a.status === 'confirmed').length;
  const totalEvaluated = applications.filter((a) => a.interviewSlot?.attendanceVerified || a.status === 'completed').length;
  const standbysQueued = recruitmentService.getAllStandbyApplications().length;
  const waitlistsQueued = recruitmentService.getAllWaitlistApplications().length;

  // Upcoming Interviews Roster (Next scheduled interviews across panels)
  const upcomingInterviews = applications
    .filter((a) => a.status === 'confirmed' && a.interviewSlot)
    .slice(0, 6)
    .map((app) => ({
      appId: app.id,
      candidateName: app.candidateProfile?.fullName || 'Candidate',
      candidateType: app.candidateProfile?.candidateType || 'fresher',
      role: app.role,
      driveTitle: app.hiringDriveTitle,
      time: app.interviewSlot?.time || '10:00 AM - 11:00 AM',
      date: app.interviewSlot?.date || 'Today',
      room: app.interviewSlot?.roomOrPanel || 'Panel 1 (Technical)',
      venue: app.interviewSlot?.location || 'Mysuru Campus'
    }));

  // Recent Recruitment Updates (Activity feed)
  const recentUpdates = [
    {
      id: 'upd_1',
      title: 'Slot Recovery Dispatched',
      desc: 'Standby candidate promoted automatically for GSE Drive after 10-minute check-in grace period expired.',
      time: '12 minutes ago',
      type: 'recovery',
      icon: RefreshCw,
      badge: 'Self-Healing'
    },
    {
      id: 'upd_2',
      title: 'Candidate Checked In via QR Pass',
      desc: 'Rohan Sharma authenticated at Venue Desk (Mysuru Brahmaputra Block) via HMAC-SHA256 scan.',
      time: '28 minutes ago',
      type: 'attendance',
      icon: CheckCircle2,
      badge: 'Verified'
    },
    {
      id: 'upd_3',
      title: 'Absence Explanation Submitted',
      desc: 'Medical explanation certificate uploaded for afternoon slot review. Requires HR ratification.',
      time: '45 minutes ago',
      type: 'absence',
      icon: AlertTriangle,
      badge: 'Review Pending'
    },
    {
      id: 'upd_4',
      title: 'Capacity Threshold Alert',
      desc: 'Graduate Software Engineer 2026 drive reached 95% interview capacity across Mysuru and Bengaluru.',
      time: '1 hour ago',
      type: 'capacity',
      icon: TrendingUp,
      badge: 'Capacity Alert'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Wordmark & Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">HR Command Overview</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Operational Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hiring drives, registered talent volume, attendance metrics, and pending actions across campus centers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('drives')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Manage Drives</span>
          </button>
          <button
            onClick={() => onNavigateToTab('analytics')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Four General Recruitment Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Hiring Drives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Hiring Drives</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalDrives}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {drives.filter(d => d.status === 'completed').length} Completed
              </span>
              <span>across Karnataka & Telangana</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Registered Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered Candidates</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalRegisteredCandidates}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                100% Verified
              </span>
              <span>via 4-tier skill validation</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Recruitment Drives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Recruitment Drives</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{activeDrives}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">Live registration & slot booking</span>
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming Interviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{confirmedInterviews}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded border border-violet-200">
                {standbysQueued} Standby Buffers
              </span>
              <span>ready for triage</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Mid Section: Upcoming Interviews Roster & Operational Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Upcoming Scheduled Interviews Roster */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Upcoming Scheduled Interview Slots
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Showing active confirmed schedule
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((slot) => (
                <div key={slot.appId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {slot.candidateName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{slot.candidateName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {slot.candidateType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{slot.role}</span>
                        <span>&bull;</span>
                        <span className="truncate max-w-[200px]">{slot.driveTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right text-xs">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center sm:justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{slot.room} ({slot.venue})</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No confirmed interviews scheduled today. Check active drive slots in the Drives tab.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Capacity & Queue Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Queue & Standby Triage
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Proactive Standby Candidates</div>
                  <div className="text-base font-bold text-indigo-700 font-mono mt-0.5">{standbysQueued} queued</div>
                </div>
                <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
                  Sub-10m dispatch
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Dynamic Waitlist Candidates</div>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{waitlistsQueued} queued</div>
                </div>
                <div className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded-lg">
                  Ranked by score
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Absence Governance Reviews</div>
                  <div className="text-base font-bold text-amber-700 font-mono mt-0.5">{absences.length} pending</div>
                </div>
                <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                  Action required
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span>Recruitment Telemetry</span>
              <span className="font-mono text-[10px]">WAL ACID</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All interview slots, evaluations, and candidate check-ins are synchronously committed to SQLite with strict RBAC boundary checks.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Bottom Split: Recent Recruitment Updates & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Updates (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recent Recruitment Updates
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Live event stream</span>
          </div>

          <div className="space-y-3">
            {recentUpdates.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications and Important Activities (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Notifications & Important Activities
              </h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {notifications.length} active
            </span>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 4).map((notif) => (
              <div key={notif.id} className="p-3 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(notif.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
