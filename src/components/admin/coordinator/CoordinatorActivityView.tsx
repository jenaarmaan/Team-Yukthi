import React, { useState } from 'react';
import {
  Activity,
  History,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  QrCode,
  KeyRound,
  Zap,
  Lock
} from 'lucide-react';

export const CoordinatorActivityView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const coordinatorActivities = [
    {
      id: 'co_act_01',
      title: 'Dynamic HMAC QR Check-in Validated',
      category: 'Attendance & Verification',
      timestamp: 'Today, 08:48 AM',
      actor: 'Coordinator (rakesh.rao@excelsoftcorp.com)',
      target: 'Rohan Sharma (GSE 2026)',
      venue: 'Mysuru Campus Center (Gate A)',
      description: 'Zero-Trust cryptographic HMAC QR pass validated successfully. Candidate admitted to Panel Room A-01.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'co_act_02',
      title: 'Automated Conflict Prevention Blocked Double-Booking',
      category: 'Conflict Prevention',
      timestamp: 'Today, 08:15 AM',
      actor: 'Conflict Engine & Coordinator',
      target: 'Panel Room A-01 (10:00 AM)',
      venue: 'Mysuru Campus Center',
      description: 'System blocked overlapping session allocation for Panel A-02 in Room A-01. Suggested Panel Room A-02 as alternative.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'co_act_03',
      title: 'Authorized Manual Attendance Override Recorded',
      category: 'Manual Override',
      timestamp: 'Today, 08:35 AM',
      actor: 'Coordinator (rakesh.rao@excelsoftcorp.com)',
      target: 'Kavya Ramesh',
      venue: 'Mysuru Campus Center',
      description: 'Manual attendance override executed due to cracked candidate screen. Verified via physical College Photo ID card.',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'co_act_04',
      title: 'Bulk Interview Slots Configured',
      category: 'Slot Management',
      timestamp: 'Yesterday, 04:30 PM',
      actor: 'Coordinator (rakesh.rao@excelsoftcorp.com)',
      target: '4 Slots (GSE 2026 Batch)',
      venue: 'Mysuru Campus Center',
      description: 'Generated 4 sequential 45-minute interview slots for GSE drive with 15-minute buffer intervals.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'co_act_05',
      title: 'Interview Session Rescheduled Upon Candidate Notice',
      category: 'Schedule Management',
      timestamp: 'Yesterday, 02:15 PM',
      actor: 'Coordinator (rakesh.rao@excelsoftcorp.com)',
      target: 'Vikram Aditya',
      venue: 'Bengaluru Tech Hub',
      description: 'Rescheduled Cloud DevOps Round 2 from 10:00 AM to 02:00 PM in Boardroom C-01 with interviewer consent.',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    {
      id: 'co_act_06',
      title: 'Substitute Interviewer Reassigned to Panel B-02',
      category: 'Panel Management',
      timestamp: 'Yesterday, 11:00 AM',
      actor: 'Coordinator (rakesh.rao@excelsoftcorp.com)',
      target: 'Panel B-02',
      venue: 'Mysuru Campus Center',
      description: 'Reassigned Dr. S. K. Rao as substitute lead interviewer for Panel B-02 following scheduled panel leave.',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Operational Records' },
    { id: 'Attendance & Verification', label: 'Attendance & QR/OTP' },
    { id: 'Conflict Prevention', label: 'Conflict Resolutions' },
    { id: 'Manual Override', label: 'Manual Overrides' },
    { id: 'Slot Management', label: 'Slots & Bulk' },
    { id: 'Schedule Management', label: 'Schedules' }
  ];

  const filteredLogs = coordinatorActivities.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.target.toLowerCase().includes(q) ||
        item.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                IMMUTABLE COORDINATION AUDIT
              </span>
              <h2 className="text-xl font-bold text-slate-900">Interview Coordinator Operational Activity History</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete operational record of slot generation, schedule modifications, QR/OTP desk authentications, and conflict interventions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Session Validated</span>
            </span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coordination logs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Chronological Operational Feed (Items 1 to 10) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            Coordination Audit Records ({filteredLogs.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">SQLite Session Verified</span>
        </div>

        <div className="space-y-3.5">
          {filteredLogs.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{item.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span>Target: <strong className="text-slate-800 font-semibold">{item.target}</strong></span>
                <span>•</span>
                <span>Venue: <strong className="text-slate-800 font-semibold">{item.venue}</strong></span>
                <span>•</span>
                <span className="text-slate-400 font-mono text-[10px]">Actor: {item.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

