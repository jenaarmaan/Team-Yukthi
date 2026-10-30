import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { HiringDrive } from '../../../types/recruitment';
import {
  Building2,
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  Users,
  Target,
  FileText,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';

export const DrivePerformanceView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const [selectedDriveId, setSelectedDriveId] = useState<string>(drives[0]?.id || 'drive_01');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const activeDrive = drives.find((d) => d.id === selectedDriveId) || drives[0];

  // Drive performance analytics datasets
  const drivePerformanceMetrics = [
    {
      driveId: 'drive_01',
      title: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      location: 'Mysuru Campus Center',
      participation: 64,
      eligiblePct: 92,
      interviewCompletionPct: 95,
      selectionRatePct: 37.5,
      vacancyFulfillmentPct: 76,
      waitlistUtilizationPct: 85,
      slotRecoveryPct: 88,
      turnaroundDays: 3.4,
      targetAchievement: '76% (34 of 45 filled)',
      historicalTrend: '+8.4% YoY conversion improvement'
    },
    {
      driveId: 'drive_02',
      title: 'Cloud DevOps & SRE Hiring',
      role: 'DevOps Specialist',
      location: 'Bengaluru Tech Hub',
      participation: 38,
      eligiblePct: 86,
      interviewCompletionPct: 88,
      selectionRatePct: 31.5,
      vacancyFulfillmentPct: 56,
      waitlistUtilizationPct: 78,
      slotRecoveryPct: 75,
      turnaroundDays: 4.6,
      targetAchievement: '56% (14 of 25 filled)',
      historicalTrend: '+4.2% YoY conversion improvement'
    },
    {
      driveId: 'drive_03',
      title: 'Full Stack Web Platform Drive',
      role: 'Platform Engineer',
      location: 'Hyderabad Technology Center',
      participation: 26,
      eligiblePct: 88,
      interviewCompletionPct: 92,
      selectionRatePct: 30.7,
      vacancyFulfillmentPct: 65,
      waitlistUtilizationPct: 80,
      slotRecoveryPct: 82,
      turnaroundDays: 4.1,
      targetAchievement: '65% (13 of 20 filled)',
      historicalTrend: '+6.1% YoY conversion improvement'
    },
    {
      driveId: 'drive_04',
      title: 'QA Automation Specialist Drive',
      role: 'Automation Engineer',
      location: 'Pune Development Center',
      participation: 14,
      eligiblePct: 82,
      interviewCompletionPct: 90,
      selectionRatePct: 28.5,
      vacancyFulfillmentPct: 50,
      waitlistUtilizationPct: 70,
      slotRecoveryPct: 66,
      turnaroundDays: 5.0,
      targetAchievement: '50% (7 of 14 filled)',
      historicalTrend: '+2.5% YoY conversion improvement'
    }
  ];

  const currentMetric =
    drivePerformanceMetrics.find((m) => m.driveId === selectedDriveId) || drivePerformanceMetrics[0];

  // Simulated Analytics Export (CSV Download)
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Drive Title,Role,Location,Participation,Eligibility Rate,Interview Completion,Selection Rate,Fulfillment Rate,Turnaround Days\n' +
      drivePerformanceMetrics
        .map(
          (m) =>
            `"${m.title}","${m.role}","${m.location}",${m.participation},${m.eligiblePct}%,${m.interviewCompletionPct}%,${m.selectionRatePct}%,${m.vacancyFulfillmentPct}%,${m.turnaroundDays}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIYOJAN_Drive_Performance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Export Controls */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                TELEMETRY & EFFICIENCY
              </span>
              <h2 className="text-xl font-bold text-slate-900">Hiring Drive Performance & Telemetry</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Drive-wise participation, eligibility rates, selection metrics, turnaround days, and historical benchmarks
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportReport}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Analytics (CSV)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Drive Performance Analytics Report successfully downloaded!</span>
          </div>
        )}
      </div>

      {/* 2. Drive Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {drivePerformanceMetrics.map((item) => (
          <button
            key={item.driveId}
            onClick={() => setSelectedDriveId(item.driveId)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDriveId === item.driveId
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* 3. Selected Drive Performance Scorecard (Items 1 to 11) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        
        {/* Drive Info Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                {currentMetric.location}
              </span>
              <span className="text-xs font-semibold text-slate-500">{currentMetric.role}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{currentMetric.title}</h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Achievement</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{currentMetric.targetAchievement}</span>
          </div>
        </div>

        {/* 8 Detailed Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* 1. Candidate Participation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Participation</span>
            <div className="text-xl font-black text-slate-900">{currentMetric.participation} Candidates</div>
            <p className="text-[10px] text-slate-500">Registered across college portals</p>
          </div>

          {/* 2. Eligibility Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Eligibility Rate</span>
            <div className="text-xl font-black text-indigo-600">{currentMetric.eligiblePct}%</div>
            <p className="text-[10px] text-slate-500">Met degree & CGPA cutoff</p>
          </div>

          {/* 3. Interview Completion */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Interview Completion</span>
            <div className="text-xl font-black text-emerald-600">{currentMetric.interviewCompletionPct}%</div>
            <p className="text-[10px] text-slate-500">Zero-Trust attendance verified</p>
          </div>

          {/* 4. Selection Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Selection Rate</span>
            <div className="text-xl font-black text-violet-600">{currentMetric.selectionRatePct}%</div>
            <p className="text-[10px] text-slate-500">Passed technical & HR rounds</p>
          </div>

          {/* 5. Vacancy Fulfillment */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vacancy Fulfillment</span>
            <div className="text-xl font-black text-slate-900">{currentMetric.vacancyFulfillmentPct}%</div>
            <p className="text-[10px] text-slate-500">Quota filled against target</p>
          </div>

          {/* 6. Waitlist Utilization */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Waitlist Utilization</span>
            <div className="text-xl font-black text-amber-600">{currentMetric.waitlistUtilizationPct}%</div>
            <p className="text-[10px] text-slate-500">Promoted to active offers</p>
          </div>

          {/* 7. Slot Recovery Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Slot Recovery Rate</span>
            <div className="text-xl font-black text-emerald-600">{currentMetric.slotRecoveryPct}%</div>
            <p className="text-[10px] text-slate-500">Idle time salvaged by standby</p>
          </div>

          {/* 8. Turnaround Time */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Turnaround Time</span>
            <div className="text-xl font-black text-slate-900">{currentMetric.turnaroundDays} Days</div>
            <p className="text-[10px] text-slate-500">Registration to final offer</p>
          </div>

        </div>

      </div>

      {/* 4. Historical Comparison Card (Item 12) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">Historical Recruitment Benchmark & YoY Trends</h3>
            <p className="text-xs text-slate-500">Efficiency comparison against previous annual campus recruitment cycles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Turnaround Velocity</span>
            <div className="text-lg font-bold text-slate-900">3.8 Days vs 5.6 Days (2025)</div>
            <p className="text-[11px] text-emerald-600 font-semibold">32% faster cycle time due to HMAC passes</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">No-Show Slot Loss</span>
            <div className="text-lg font-bold text-slate-900">4.2% vs 14.8% (2025)</div>
            <p className="text-[11px] text-emerald-600 font-semibold">Autonomous Standby recovered 88% of vacated slots</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500">Offer Acceptance Rate</span>
            <div className="text-lg font-bold text-slate-900">87.5% vs 78.2% (2025)</div>
            <p className="text-[11px] text-emerald-600 font-semibold">+9.3% increase through transparent candidate portal</p>
          </div>
        </div>
      </div>

    </div>
  );
};
