import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { HiringDrive } from '../../../types/recruitment';
import {
  Filter,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  AlertTriangle,
  ArrowRight,
  Building2,
  MapPin,
  ChevronRight,
  Info
} from 'lucide-react';

export const RecruitmentFunnelView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();

  // Filters state
  const [selectedDriveId, setSelectedDriveId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  const locations = [
    'All Locations',
    'Mysuru Campus Center',
    'Bengaluru Tech Hub',
    'Hyderabad Technology Center',
    'Pune Development Center',
    'Chennai Innovation Lab',
    'Delhi-NCR Regional Office'
  ];

  // Stage Data definition for the complete recruitment pipeline
  const funnelStages = [
    {
      id: 'registered',
      step: 1,
      title: 'Registered Candidates',
      count: selectedDriveId === 'all' ? 142 : 56,
      pctOfTotal: 100,
      dropCount: 0,
      dropRatePct: 0,
      dropReason: 'Initial registration pool via campus portals and referral applications.'
    },
    {
      id: 'eligible',
      step: 2,
      title: 'Eligible Candidates',
      count: selectedDriveId === 'all' ? 128 : 50,
      pctOfTotal: 90.1,
      dropCount: selectedDriveId === 'all' ? 14 : 6,
      dropRatePct: 9.9,
      dropReason: 'Disqualified on minimum CGPA (<7.5) or branch mismatch (non-CS/IS/ECE).'
    },
    {
      id: 'shortlisted',
      step: 3,
      title: 'Shortlisted for Assessment',
      count: selectedDriveId === 'all' ? 104 : 41,
      pctOfTotal: 73.2,
      dropCount: selectedDriveId === 'all' ? 24 : 9,
      dropRatePct: 18.8,
      dropReason: 'Failed technical skill threshold in automated coding screening.'
    },
    {
      id: 'scheduled',
      step: 4,
      title: 'Interview Scheduled',
      count: selectedDriveId === 'all' ? 88 : 35,
      pctOfTotal: 62.0,
      dropCount: selectedDriveId === 'all' ? 16 : 6,
      dropRatePct: 15.4,
      dropReason: 'Panel slot constraints, schedule conflicts, or candidate withdrawal.'
    },
    {
      id: 'attended',
      step: 5,
      title: 'Interview Attended',
      count: selectedDriveId === 'all' ? 82 : 33,
      pctOfTotal: 57.7,
      dropCount: selectedDriveId === 'all' ? 6 : 2,
      dropRatePct: 6.8,
      dropReason: 'No-shows and medical absence justifications submitted.'
    },
    {
      id: 'selected',
      step: 6,
      title: 'Selected Candidates',
      count: selectedDriveId === 'all' ? 48 : 20,
      pctOfTotal: 33.8,
      dropCount: selectedDriveId === 'all' ? 34 : 13,
      dropRatePct: 41.5,
      dropReason: 'Did not meet technical bar in Round 1/2 or cultural rubric scores.'
    },
    {
      id: 'offers_accepted',
      step: 7,
      title: 'Offer Accepted & Onboarded',
      count: selectedDriveId === 'all' ? 42 : 18,
      pctOfTotal: 29.6,
      dropCount: selectedDriveId === 'all' ? 6 : 2,
      dropRatePct: 12.5,
      dropReason: 'Offer declined due to higher counter-offer or graduate school enrollment.'
    }
  ];

  // Drive-by-Drive Funnel Comparison Matrix
  const driveComparisons = [
    {
      id: 'gse_2026',
      name: 'Graduate Software Engineer 2026',
      location: 'Mysuru Campus Center',
      registered: 64,
      shortlisted: 48,
      interviewed: 38,
      selected: 24,
      accepted: 22,
      conversionRate: '34.4%',
      bottleneck: 'Tech Round 1 (38% drop)'
    },
    {
      id: 'cloud_devops',
      name: 'Cloud DevOps & SRE Engineer',
      location: 'Bengaluru Tech Hub',
      registered: 38,
      shortlisted: 28,
      interviewed: 22,
      selected: 12,
      accepted: 10,
      conversionRate: '26.3%',
      bottleneck: 'Kubernetes Coding Round (46% drop)'
    },
    {
      id: 'fullstack_web',
      name: 'Full Stack Web Platform Lead',
      location: 'Hyderabad Tech Center',
      registered: 26,
      shortlisted: 18,
      interviewed: 14,
      selected: 8,
      accepted: 7,
      conversionRate: '26.9%',
      bottleneck: 'System Architecture Round (42% drop)'
    },
    {
      id: 'qa_automation',
      name: 'QA Automation Engineer',
      location: 'Pune Development Center',
      registered: 14,
      shortlisted: 10,
      interviewed: 8,
      selected: 4,
      accepted: 3,
      conversionRate: '21.4%',
      bottleneck: 'Test Harness Coding (50% drop)'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header & Filters Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Pipeline Telemetry
              </span>
              <h2 className="text-xl font-bold text-slate-900">Recruitment Funnel & Drop-Off Analytics</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end stage-wise conversion rates, candidate attrition metrics, and drive comparative funnels
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Conversion</span>
              <div className="text-base font-black text-indigo-600">29.6%</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Offer Acceptance</span>
              <div className="text-base font-black text-emerald-600">87.5%</div>
            </div>
          </div>
        </div>

        {/* Interactive Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* Drive Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Hiring Drive</label>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Active Hiring Drives ({drives.length})</option>
              {drives.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.role})
                </option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Location Hub</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {locations.map((loc, idx) => (
                <option key={idx} value={loc === 'All Locations' ? 'all' : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Recruitment Cycle Window</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Full Recruitment Season (2026 Batch)</option>
              <option value="7d">Last 7 Days (Active Interview Phase)</option>
              <option value="30d">Last 30 Days (Screening & Assessment)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 2. Visual Stage-by-Stage Funnel Flow */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Stage-Wise Candidate Conversion Pipeline</h3>
          </div>
          <span className="text-xs text-slate-500">
            {funnelStages[0].count} Total Registered → {funnelStages[funnelStages.length - 1].count} Offers Accepted
          </span>
        </div>

        {/* Funnel Visual Stack */}
        <div className="space-y-3 pt-2">
          {funnelStages.map((stage, idx) => {
            const nextStage = funnelStages[idx + 1];
            const stageConversion = nextStage
              ? Math.round((nextStage.count / stage.count) * 100)
              : 100;

            return (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {stage.step}
                    </span>
                    <span className="font-bold text-slate-900">{stage.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="font-mono font-bold text-slate-900">{stage.count} Candidates</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {stage.pctOfTotal}% of pool
                    </span>
                    {idx < funnelStages.length - 1 && (
                      <span className="text-[10px] text-slate-400 hidden md:inline">
                        → {stageConversion}% to next stage
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar with Conversion Width */}
                <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden p-0.5 flex relative shadow-inner">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 flex items-center px-3 ${
                      idx === 0
                        ? 'bg-indigo-600 text-white'
                        : idx === funnelStages.length - 1
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-indigo-500 text-white'
                    }`}
                    style={{ width: `${Math.max(14, stage.pctOfTotal)}%` }}
                  >
                    <span className="text-[10px] font-bold font-mono truncate">{stage.count}</span>
                  </div>

                  {stage.dropCount > 0 && (
                    <div className="absolute right-3 top-1 text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>Dropped: -{stage.dropCount} ({stage.dropRatePct}%)</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Drop-Off Analysis Cards (Item 11) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-900">Candidate Drop-Off & Attrition Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {funnelStages.filter((s) => s.dropCount > 0).slice(0, 3).map((stg) => (
            <div key={stg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{stg.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  -{stg.dropCount} Drop ({stg.dropRatePct}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{stg.dropReason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Funnel Comparison Across Drives (Item 12) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Funnel Comparison Across Active Hiring Drives</h3>
            <p className="text-xs text-slate-500">Comparative conversion efficiency, interview completion, and bottleneck identification</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Hiring Drive</th>
                <th className="py-2.5 px-3">Hub Location</th>
                <th className="py-2.5 px-3 text-center">Registered</th>
                <th className="py-2.5 px-3 text-center">Shortlisted</th>
                <th className="py-2.5 px-3 text-center">Interviewed</th>
                <th className="py-2.5 px-3 text-center">Selected</th>
                <th className="py-2.5 px-3 text-center">Accepted</th>
                <th className="py-2.5 px-3 text-center">Conversion</th>
                <th className="py-2.5 px-3">Primary Bottleneck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {driveComparisons.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3 text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{item.registered}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.shortlisted}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.interviewed}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{item.selected}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">{item.accepted}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.conversionRate}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-medium text-amber-800">
                    {item.bottleneck}
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
