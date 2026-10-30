import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  Briefcase,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

export const VacanciesTargetsView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // Aggregated Vacancies & Targets Metrics
  const totalApprovedVacancies = 104;
  const totalFilledVacancies = 68;
  const totalRemainingVacancies = totalApprovedVacancies - totalFilledVacancies; // 36
  const overallTargetCompletionPct = Math.round((totalFilledVacancies / totalApprovedVacancies) * 100); // 65%

  // Role-wise vacancy mapping
  const roleVacancies = [
    {
      role: 'Graduate Software Engineer',
      department: 'Product Engineering',
      approved: 45,
      filled: 34,
      remaining: 11,
      completionPct: 76,
      deadline: '2026-11-15',
      daysLeft: 15,
      riskLevel: 'on_track'
    },
    {
      role: 'Cloud DevOps & SRE Engineer',
      department: 'Cloud Infrastructure',
      approved: 25,
      filled: 14,
      remaining: 11,
      completionPct: 56,
      deadline: '2026-11-08',
      daysLeft: 8,
      riskLevel: 'at_risk'
    },
    {
      role: 'Full Stack Web Platform Lead',
      department: 'Platform Architecture',
      approved: 20,
      filled: 13,
      remaining: 7,
      completionPct: 65,
      deadline: '2026-11-20',
      daysLeft: 20,
      riskLevel: 'on_track'
    },
    {
      role: 'QA Automation Specialist',
      department: 'Quality Engineering',
      approved: 14,
      filled: 7,
      remaining: 7,
      completionPct: 50,
      deadline: '2026-11-10',
      daysLeft: 10,
      riskLevel: 'at_risk'
    }
  ];

  // Location-wise vacancy mapping
  const locationVacancies = [
    {
      location: 'Mysuru Campus Center',
      hubType: 'Headquarters',
      approved: 45,
      filled: 34,
      remaining: 11,
      completionPct: 76,
      status: 'On Schedule'
    },
    {
      location: 'Bengaluru Tech Hub',
      hubType: 'Development Center',
      approved: 25,
      filled: 15,
      remaining: 10,
      completionPct: 60,
      status: 'On Schedule'
    },
    {
      location: 'Hyderabad Technology Center',
      hubType: 'Innovation Center',
      approved: 16,
      filled: 9,
      remaining: 7,
      completionPct: 56,
      status: 'Action Required'
    },
    {
      location: 'Pune Development Center',
      hubType: 'Regional Hub',
      approved: 10,
      filled: 6,
      remaining: 4,
      completionPct: 60,
      status: 'On Schedule'
    },
    {
      location: 'Chennai Innovation Lab',
      hubType: 'Specialized Lab',
      approved: 5,
      filled: 3,
      remaining: 2,
      completionPct: 60,
      status: 'On Schedule'
    },
    {
      location: 'Delhi-NCR Regional Office',
      hubType: 'Liaison Office',
      approved: 3,
      filled: 1,
      remaining: 2,
      completionPct: 33,
      status: 'Behind Target'
    }
  ];

  const filteredLocations =
    filterLocation === 'all'
      ? locationVacancies
      : locationVacancies.filter((loc) => loc.location.toLowerCase().includes(filterLocation.toLowerCase()));

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Executive Overview */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-mono">
                HEADCOUNT GOVERNANCE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Vacancies & Hiring Targets Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Approved corporate positions, role-wise quota fulfillment, location tracking, and deadline countdowns
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{overallTargetCompletionPct}% Target Met</span>
            </span>
          </div>
        </div>

        {/* Shortage Alert Banner (Item 12) */}
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-0.5">
            <strong className="text-amber-950 font-bold">Vacancy Shortage Threshold Alert:</strong>
            <p className="text-slate-700 leading-relaxed">
              Cloud DevOps & SRE (Bengaluru & Hyderabad) currently has <strong className="text-amber-900">11 unfilled vacancies</strong> with only 8 business days remaining before drive closure. Recommend activating standby pool and scheduling accelerated second-round evaluations.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Items 1, 6, 7, 8, 9, 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Approved Vacancies */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Approved
          </span>
          <div className="text-2xl font-black text-slate-900">{totalApprovedVacancies}</div>
          <span className="text-[10px] text-slate-500">Authorized for 2026 batch</span>
        </div>

        {/* 2. Filled Vacancies */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Filled Vacancies
          </span>
          <div className="text-2xl font-black text-emerald-600">{totalFilledVacancies}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Offers formally accepted</span>
        </div>

        {/* 3. Remaining Vacancies */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Remaining Vacancies
          </span>
          <div className="text-2xl font-black text-amber-600">{totalRemainingVacancies}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Active in interview stage</span>
        </div>

        {/* 4. Completion Rate */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Target Completion
          </span>
          <div className="text-2xl font-black text-indigo-600">{overallTargetCompletionPct}%</div>
          <span className="text-[10px] text-slate-500">Across all job families</span>
        </div>

        {/* 5. Deadline Countdown */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Season Deadline
          </span>
          <div className="text-2xl font-black text-slate-900">14 Days</div>
          <span className="text-[10px] text-rose-600 font-semibold">Closing Nov 15, 2026</span>
        </div>

      </div>

      {/* 3. Vacancies by Hiring Drive & Job Role (Items 2, 3, 5, 10) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Vacancies by Job Role & Department</h3>
            <p className="text-xs text-slate-500">Approved headcount, fulfilled numbers, and deadline status</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">4 Core Job Roles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleVacancies.map((roleItem, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{roleItem.role}</h4>
                  <span className="text-xs text-slate-500">{roleItem.department}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    roleItem.riskLevel === 'on_track'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {roleItem.riskLevel === 'on_track' ? 'On Track' : 'At Risk'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Hiring Progress:</span>
                  <span className="font-mono text-slate-900">
                    {roleItem.filled} / {roleItem.approved} ({roleItem.completionPct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      roleItem.completionPct >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${roleItem.completionPct}%` }}
                  />
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Remaining</span>
                  <strong className="text-slate-900 font-mono">{roleItem.remaining}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Deadline</span>
                  <strong className="text-slate-700 font-mono text-[11px]">{roleItem.deadline}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Time Left</span>
                  <strong
                    className={`font-mono ${
                      roleItem.daysLeft <= 10 ? 'text-rose-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {roleItem.daysLeft} days
                  </strong>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 4. Vacancies by Location (Items 4, 11) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Vacancies by Geographic Location Hub</h3>
            <p className="text-xs text-slate-500">Corporate allocation across 6 regional development centers</p>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Locations (6)</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Delhi">Delhi-NCR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Location Hub</th>
                <th className="py-2.5 px-3">Facility Type</th>
                <th className="py-2.5 px-3 text-center">Approved Vacancies</th>
                <th className="py-2.5 px-3 text-center">Filled</th>
                <th className="py-2.5 px-3 text-center">Remaining</th>
                <th className="py-2.5 px-3">Fulfillment Progress</th>
                <th className="py-2.5 px-3 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLocations.map((loc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{loc.location}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{loc.hubType}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{loc.approved}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{loc.filled}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-amber-600">{loc.remaining}</td>
                  <td className="py-3 px-3 min-w-[160px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-600">
                        <span>{loc.completionPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            loc.completionPct >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${loc.completionPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        loc.status === 'On Schedule'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : loc.status === 'Action Required'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {loc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

