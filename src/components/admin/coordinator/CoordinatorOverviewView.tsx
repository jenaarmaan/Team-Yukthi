import React from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  QrCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  XCircle,
  Sparkles
} from 'lucide-react';

interface CoordinatorOverviewViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const CoordinatorOverviewView: React.FC<CoordinatorOverviewViewProps> = ({
  onNavigateToTab
}) => {
  const allApps = recruitmentService.getAllApplications();
  const interviewers = recruitmentService.getInterviewers();
  const drives = recruitmentService.getHiringDrives();

  // Metrics (Items 1 to 10)
  const appsWithSlots = allApps.filter((a) => a.interviewSlot);
  const totalScheduledInterviews = appsWithSlots.length; // e.g. 82
  const todaysInterviews = 28;
  const upcomingInterviews = 36;
  const completedInterviews = appsWithSlots.filter((a) => a.interviewSlot?.attendanceVerified).length; // e.g. 64
  const pendingInterviews = totalScheduledInterviews - completedInterviews; // 18
  const totalSlotsCapacity = 96;
  const occupiedSlots = totalScheduledInterviews;
  const availableSlots = totalSlotsCapacity - occupiedSlots; // 14
  const totalAssignedInterviewers = interviewers.length; // 8
  const totalAssignedCandidates = totalScheduledInterviews;
  const totalAvailableRooms = 14;
  const totalVenues = 6;

  // Attendance summary (Item 11 & 12)
  const verifiedCount = completedInterviews;
  const pendingCheckIn = 14;
  const lateArrivals = 2;
  const absences = 2;

  // Important coordination alerts (Item 14)
  const coordinationAlerts = [
    {
      id: 'alt_01',
      title: 'Gate A QR Verification Desk Operational',
      detail: 'Live scanner desk connected. 64 candidates verified with zero counterfeit passes detected.',
      severity: 'success',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'alt_02',
      title: 'Panel B-02 Schedule Delay Notice',
      detail: 'Interviewer Panel B-02 (Mysuru Campus) is running 12 mins behind schedule. Next candidate notified.',
      severity: 'warning',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'alt_03',
      title: 'Room Capacity Conflict Prevented',
      detail: 'Automated conflict engine blocked overlap between Full-Stack Round 2 and Cloud Panel in Room C-03.',
      severity: 'info',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />
    }
  ];

  // Recent scheduling updates (Item 13)
  const recentUpdates = [
    {
      id: 'upd_01',
      title: 'HMAC QR Check-in Recorded',
      detail: 'Candidate Rohan Sharma checked in at Gate A for 10:00 AM GSE interview slot (Panel A-01).',
      time: '12 mins ago',
      icon: <QrCode className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'upd_02',
      title: 'Slot Reallocated to Standby',
      detail: 'Vacated 11:30 AM slot at Mysuru Panel B-02 reallocated to standby candidate. Verification pass issued.',
      time: '25 mins ago',
      icon: <Zap className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'upd_03',
      title: 'Manual Attendance Override Authorized',
      detail: 'Coordinator manual override executed for candidate with camera glare issue. Reason logged with audit trail.',
      time: '1 hour ago',
      icon: <Clock className="w-4 h-4 text-amber-600" />
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Operations & Logistics Hub
            </span>
            <span className="text-xs text-slate-400">Interview Coordination Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Interview Coordination Command</h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Live venue logistics, slot allocation, panel management, QR/OTP attendance verification, and conflict-free scheduling across 6 campus centers.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTab('verification')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Verification Desk</span>
          </button>
          <button
            onClick={() => onNavigateToTab('slots')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Manage Slots</span>
          </button>
        </div>
      </div>

      {/* 2. Key Operational Metrics Tiles (Items 1 to 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Total Scheduled */}
        <div
          onClick={() => onNavigateToTab('schedules')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Scheduled</span>
            <Calendar className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalScheduledInterviews}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Across all active drives</p>
        </div>

        {/* 2. Today's Interviews */}
        <div
          onClick={() => onNavigateToTab('schedules')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Sessions</span>
            <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-600">{todaysInterviews}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active on venue floor</p>
        </div>

        {/* 3. Completed Interviews */}
        <div
          onClick={() => onNavigateToTab('attendance')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedInterviews}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified & scorecards locked</p>
        </div>

        {/* 4. Pending Check-in */}
        <div
          onClick={() => onNavigateToTab('attendance')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Check-in</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-blue-600">{pendingCheckIn}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting QR scan at desk</p>
        </div>

        {/* 5. Available Slots */}
        <div
          onClick={() => onNavigateToTab('slots')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Slots</span>
            <Zap className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{availableSlots}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Capacity ready for allocation</p>
        </div>

        {/* 6. Occupied Slots */}
        <div
          onClick={() => onNavigateToTab('slots')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Occupied Slots</span>
            <Users className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{occupiedSlots}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Locked to candidates</p>
        </div>

        {/* 7. Assigned Interviewers */}
        <div
          onClick={() => onNavigateToTab('panels')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interview Panels</span>
            <Users className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalAssignedInterviewers} Panels</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Assigned & active</p>
        </div>

        {/* 8. Available Venues & Rooms */}
        <div
          onClick={() => onNavigateToTab('venues')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Venues & Rooms</span>
            <Building2 className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalAvailableRooms} Rooms</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Across {totalVenues} campus hubs</p>
        </div>

        {/* 9. Attendance Rate */}
        <div
          onClick={() => onNavigateToTab('attendance')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">94.1%</div>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Verified zero-trust</p>
        </div>

        {/* 10. QR Desk Status */}
        <div
          onClick={() => onNavigateToTab('verification')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">QR/OTP Desk</span>
            <QrCode className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-indigo-700">Online</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Gate A Scanner Live</p>
        </div>

      </div>

      {/* 3. Mid Section: Attendance Verification Status (Item 11 & 12) & Coordination Alerts (Item 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Summary Status (Item 11 & 12) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Live Attendance & Verification Status</h3>
              <p className="text-xs text-slate-500">Real-time candidate reporting metrics across campus interview gates</p>
            </div>
            <button
              onClick={() => onNavigateToTab('attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>Full Attendance Desk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Present (Verified)</span>
              <div className="text-2xl font-black text-emerald-700">{verifiedCount}</div>
              <span className="text-[10px] text-emerald-600">HMAC Pass Scanned</span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Pending Check-in</span>
              <div className="text-2xl font-black text-blue-700">{pendingCheckIn}</div>
              <span className="text-[10px] text-blue-600">Gate Reporting Window</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Late Arrivals</span>
              <div className="text-2xl font-black text-amber-700">{lateArrivals}</div>
              <span className="text-[10px] text-amber-600">Grace period active</span>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Excused / Absent</span>
              <div className="text-2xl font-black text-rose-700">{absences}</div>
              <span className="text-[10px] text-rose-600">Medical notice logged</span>
            </div>
          </div>

          {/* Verification Protocol Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Verification Method Distribution:</span>
              <span className="text-slate-500 font-mono">64 Total Verified Check-ins</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: '84%' }} title="QR Pass (84%)" />
              <div className="bg-indigo-600 h-full" style={{ width: '12%' }} title="OTP Verification (12%)" />
              <div className="bg-amber-500 h-full" style={{ width: '4%' }} title="Manual Override (4%)" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Dynamic HMAC QR: 84%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Secure OTP: 12%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Manual Override: 4%</span>
            </div>
          </div>

        </div>

        {/* Coordination Alerts (Item 14) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Coordination Alerts</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Gate
            </span>
          </div>

          <div className="space-y-3">
            {coordinationAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-3 rounded-xl border space-y-1 ${
                  alt.severity === 'success'
                    ? 'bg-emerald-50/80 border-emerald-200/80'
                    : alt.severity === 'warning'
                    ? 'bg-amber-50/80 border-amber-200/80'
                    : 'bg-indigo-50/80 border-indigo-200/80'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  {alt.icon}
                  <span>{alt.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{alt.detail}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 4. Bottom Section: Recent Scheduling & Check-in Updates (Item 13) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Interview Logistics Updates</h3>
            <p className="text-xs text-slate-500">Live operational events logged across interview gates, slots, and rooms</p>
          </div>
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>View Full Coordination Audit</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recentUpdates.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-900 truncate">{item.title}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

