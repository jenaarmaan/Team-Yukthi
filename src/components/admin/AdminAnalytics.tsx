import React from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  Download,
  FileSpreadsheet,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const candidates = recruitmentService.getAllCandidates();
  const applications = recruitmentService.getAllApplications();
  const drives = recruitmentService.getHiringDrives();
  const waitlists = recruitmentService.getAllWaitlistApplications();
  const standbys = recruitmentService.getAllStandbyApplications();
  const recoveries = recruitmentService.getVacantSlotRecoveries();

  // Export CSV generator
  const exportCandidatesCsv = () => {
    const headers = ['Candidate ID', 'Full Name', 'Email', 'Phone', 'Type', 'Degree', 'CGPA', 'Location', 'Status'];
    const rows = applications.map((app) => [
      `"${app.candidateProfile.id}"`,
      `"${app.candidateProfile.fullName}"`,
      `"${app.candidateProfile.email}"`,
      `"${app.candidateProfile.phone}"`,
      `"${app.candidateProfile.candidateType}"`,
      `"${app.candidateProfile.education.degree}"`,
      `"${app.candidateProfile.education.cgpa}"`,
      `"${app.appliedLocation}"`,
      `"${app.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIYOJAN_Excelsoft_Candidates_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDriveTelemetryCsv = () => {
    const headers = ['Drive ID', 'Role', 'Department', 'Vacancies', 'Capacity', 'Registrations', 'Utilization'];
    const rows = drives.map((d) => [
      `"${d.id}"`,
      `"${d.role}"`,
      `"${d.department}"`,
      `"${d.totalOpenings}"`,
      `"${d.interviewCapacity}"`,
      `"${d.currentRegistrations}"`,
      `"${Math.round((d.currentRegistrations / d.interviewCapacity) * 100)}%"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIYOJAN_Drive_Capacity_Utilization_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with Export CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Recruitment Analytics & Telemetry Reports</h2>
          <p className="text-xs text-slate-500">Pipeline conversion metrics, venue capacity yields, and audit datasets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCandidatesCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Candidate Roster (CSV)</span>
          </button>

          <button
            onClick={exportDriveTelemetryCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Drive Yields (CSV)</span>
          </button>
        </div>
      </div>

      {/* Quantitative Performance Grids */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Verification Rate</div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight tabular-nums">88.4%</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Authenticity verified</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Venue Check-In Compliance</div>
          <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight tabular-nums">94.2%</div>
          <p className="text-xs text-slate-500 mt-1">Biometric & QR pass scans</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waitlist Promotion Yield</div>
          <div className="text-3xl font-black text-amber-700 font-mono tracking-tight tabular-nums">37.5%</div>
          <p className="text-xs text-slate-500 mt-1">Promoted into primary slots</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Self-Healing Slot Recovery</div>
          <div className="text-3xl font-black text-indigo-700 font-mono tracking-tight tabular-nums">100%</div>
          <p className="text-xs text-indigo-700 font-semibold mt-1">Zero panel interview downtime</p>
        </div>
      </div>

      {/* Conversion Breakdown Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Capacity & Slot Recovery Diagnostics</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Total Available Panel Capacity:</span>
              <strong className="font-mono text-slate-900">320 slots across drives</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Slots Allocated & Confirmed:</span>
              <strong className="font-mono text-slate-900">{applications.filter((a) => a.status === 'confirmed').length} slots</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Standby Replacements Dispatched:</span>
              <strong className="font-mono text-indigo-700">{recoveries.length} replacements</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Vacancies Awaiting Standby Accept:</span>
              <strong className="font-mono text-amber-700">{recoveries.filter((r) => r.status === 'invitations_dispatched').length} in flight</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Candidate Pipeline Quality Indicators</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Average Candidate CGPA:</span>
              <strong className="font-mono text-slate-900">8.12 / 10.0</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Fresher to Experienced Ratio:</span>
              <strong className="font-mono text-slate-900">60% Fresher · 40% Experienced</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>Multi-Location Preference Rate:</span>
              <strong className="font-mono text-slate-900">85% selected 2+ hiring locations</strong>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <span>HR Verified Skill Accuracy:</span>
              <strong className="font-mono text-emerald-700">96.8% parity</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
