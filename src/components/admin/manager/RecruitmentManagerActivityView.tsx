import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Filter,
  Search,
  Calendar,
  Zap,
  Target,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';

export const RecruitmentManagerActivityView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activityAuditLogs = [
    {
      id: 'act_01',
      title: 'Slot Recovery Allocated to Standby Candidate',
      category: 'Slot Recovery',
      timestamp: 'Today, 10:15 AM',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Graduate Software Engineer 2026',
      location: 'Mysuru Campus Center',
      description: 'Allocated vacated 11:30 AM interview slot to top-ranked standby candidate Rohan Sharma following medical excuse notice.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'act_02',
      title: 'Dynamic Waitlist Priority Re-Ranked',
      category: 'Waitlist & Standby',
      timestamp: 'Today, 09:30 AM',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Cloud DevOps & SRE Hiring',
      location: 'Bengaluru Tech Hub',
      description: 'Re-ordered top 4 waitlist candidates according to automated technical assessment scores and Docker/Kubernetes skill ratings.',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'act_03',
      title: 'Candidate Eligibility Batch Verification Completed',
      category: 'Eligibility & Matching',
      timestamp: 'Today, 08:45 AM',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Graduate Software Engineer 2026',
      location: 'Mysuru Campus Center',
      description: 'Reviewed and verified eligibility for 42 candidates. Flagged 3 discrepancy records for borderline CGPA review.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'act_04',
      title: 'Hiring Target Shortage Alert Reviewed',
      category: 'Vacancies & Targets',
      timestamp: 'Yesterday, 05:20 PM',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Cloud DevOps & SRE Hiring',
      location: 'Hyderabad Technology Center',
      description: 'Acknowledged vacancy shortage threshold warning for Hyderabad hub. Dispatched recommendation to route remote panel interviews.',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'act_05',
      title: 'Offer Acceptance Formally Recorded',
      category: 'Recruitment Progress',
      timestamp: 'Yesterday, 03:10 PM',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Graduate Software Engineer 2026',
      location: 'Mysuru Campus Center',
      description: 'Candidate Pooja Patel confirmed acceptance of Graduate Software Engineer offer. Onboarding pipeline initiated.',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    {
      id: 'act_06',
      title: 'Location Quota Allocation Calibrated',
      category: 'Location Tracking',
      timestamp: '2 days ago',
      actor: 'Recruitment Manager (murali.krishna@excelsoftcorp.com)',
      drive: 'Full Stack Web Platform Drive',
      location: 'Pune Development Center',
      description: 'Adjusted location target allocation for Pune QA track to 10 openings to support Q1 platform releases.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Operational Records' },
    { id: 'Slot Recovery', label: 'Slot Recovery' },
    { id: 'Waitlist & Standby', label: 'Waitlist & Standby' },
    { id: 'Eligibility & Matching', label: 'Eligibility' },
    { id: 'Vacancies & Targets', label: 'Vacancies & Targets' },
    { id: 'Location Tracking', label: 'Location Tracking' }
  ];

  const filteredLogs = activityAuditLogs.filter((log) => {
    if (activeCategory !== 'all' && log.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.title.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.drive.toLowerCase().includes(q) ||
        log.location.toLowerCase().includes(q)
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
                IMMUTABLE AUDIT TRAIL
              </span>
              <h2 className="text-xl font-bold text-slate-900">Recruitment Manager Operational Activity History</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete operational log of hiring target modifications, eligibility evaluations, waitlist movements, and slot recoveries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Session Verified</span>
            </span>
          </div>
        </div>

        {/* Filters and Search */}
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
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Chronological Audit Log Cards (Items 1 to 9) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            Operational Audit Log Entries ({filteredLogs.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">SQLite Session Verified</span>
        </div>

        <div className="space-y-3.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{log.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${log.badgeColor}`}>
                    {log.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{log.description}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span>Drive: <strong className="text-slate-800 font-semibold">{log.drive}</strong></span>
                <span>•</span>
                <span>Location: <strong className="text-slate-800 font-semibold">{log.location}</strong></span>
                <span>•</span>
                <span className="text-slate-400 font-mono text-[10px]">Actor: {log.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

