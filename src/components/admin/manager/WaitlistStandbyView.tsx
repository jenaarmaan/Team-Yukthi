import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { Application, CandidateProfile } from '../../../types/recruitment';
import {
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Zap,
  Building2,
  Calendar,
  History,
  ShieldAlert,
  Search,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';

export const WaitlistStandbyView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const rawWaitlist = recruitmentService.getAllWaitlistApplications();
  const rawStandby = recruitmentService.getAllStandbyApplications();

  const [activeSubTab, setActiveSubTab] = useState<'waitlist' | 'standby' | 'replacements' | 'history'>('waitlist');
  const [selectedDriveId, setSelectedDriveId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dynamic ranking state for waitlist
  const [waitlistOrder, setWaitlistOrder] = useState(
    rawWaitlist.map((item, idx) => ({
      ...item,
      ranking: item.waitlist.position || idx + 1,
      priorityScore: 92 - idx * 4,
      tier: idx < 2 ? 'Tier 1 (High Priority)' : 'Tier 2 (General Reserve)',
      availability: idx % 3 === 0 ? 'Confirmed Available' : idx % 3 === 1 ? 'Standby Ready' : 'On Call'
    }))
  );

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Dynamic Priority Reordering
  const handleMovePriority = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === waitlistOrder.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...waitlistOrder];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Recalculate rankings
    const reRanked = updated.map((item, idx) => ({
      ...item,
      ranking: idx + 1
    }));

    setWaitlistOrder(reRanked);
    showToast(`Priority updated: ${temp.candidate.fullName} moved ${direction}.`);
  };

  // Standby candidate activation
  const handleActivateStandby = (candidateName: string, role: string) => {
    showToast(`Activated standby candidate: ${candidateName} for ${role}. Slot allocation initiated.`);
  };

  // Vacant positions and replacement candidates
  const vacantPositions = [
    {
      id: 'vac_01',
      driveTitle: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      venue: 'Mysuru Campus Center (Panel B-02)',
      time: 'Today, 11:30 AM',
      vacatedReason: 'Candidate medical absence notice',
      suggestedReplacement: 'Rohan Sharma (Priority #1, 94% match)',
      status: 'Open for Allocation'
    },
    {
      id: 'vac_02',
      driveTitle: 'Cloud DevOps & SRE Engineer',
      role: 'DevOps Specialist',
      venue: 'Bengaluru Tech Hub (Panel C-01)',
      time: 'Tomorrow, 02:00 PM',
      vacatedReason: 'Candidate offer declined (higher counter-offer)',
      suggestedReplacement: 'Pooja Patel (Priority #2, 88% match)',
      status: 'Open for Allocation'
    }
  ];

  // Waitlist Movement History Logs
  const movementLogs = [
    {
      id: 'log_01',
      candidate: 'Rohan Sharma',
      action: 'Promoted to Active Standby',
      drive: 'Graduate Software Engineer 2026',
      timestamp: 'Today, 09:15 AM',
      note: 'Promoted to standby position 1 upon candidate cancellation.'
    },
    {
      id: 'log_02',
      candidate: 'Vikram Aditya',
      action: 'Priority Score Recalibrated',
      drive: 'Cloud DevOps 2026',
      timestamp: 'Today, 08:30 AM',
      note: 'Priority adjusted to #2 based on automated assessment score (92%).'
    },
    {
      id: 'log_03',
      candidate: 'Sneha Kulkarni',
      action: 'Allocated to Vacant Slot',
      drive: 'Graduate Software Engineer 2026',
      timestamp: 'Yesterday, 04:45 PM',
      note: 'Assigned to vacated 10:00 AM slot. Candidate confirmed attendance.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Sub-Tabs */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                TALENT PIPELINE RESERVE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Dynamic Waitlist & Standby Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Drive-wise waiting lists, dynamic reordering, standby triage, and vacant position replacements
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('waitlist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'waitlist'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waitlist Pool ({waitlistOrder.length})
            </button>
            <button
              onClick={() => setActiveSubTab('standby')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'standby'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Proactive Standby ({rawStandby.length})
            </button>
            <button
              onClick={() => setActiveSubTab('replacements')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'replacements'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vacant Replacements ({vacantPositions.length})
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'history'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Movement History
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* 2. SUB-TAB 1: DYNAMIC WAITLIST POOL */}
      {activeSubTab === 'waitlist' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Ranked Waitlist Candidates</h3>
              <p className="text-xs text-slate-500">
                Dynamic priority scores based on technical scores, CGPA, and interview feedback
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Drive:</span>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Drives</option>
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                  <th className="py-2.5 px-3 text-center">Rank</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Hiring Drive</th>
                  <th className="py-2.5 px-3 text-center">Priority Score</th>
                  <th className="py-2.5 px-3">Classification Tier</th>
                  <th className="py-2.5 px-3">Availability Status</th>
                  <th className="py-2.5 px-3 text-center">Reorder Priority</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {waitlistOrder.map((item, idx) => (
                  <tr key={item.app.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-xs">
                        #{item.ranking}
                      </span>
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.candidate.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.candidate.email}</div>
                    </td>

                    {/* Drive */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-700">{item.app.hiringDriveTitle}</div>
                      <div className="text-[10px] text-slate-500">{item.app.role}</div>
                    </td>

                    {/* Priority Score */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {item.priorityScore} pts
                      </span>
                    </td>

                    {/* Classification */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {item.tier}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.availability}</span>
                      </span>
                    </td>

                    {/* Reorder Buttons */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMovePriority(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Increase Priority"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleMovePriority(idx, 'down')}
                          disabled={idx === waitlistOrder.length - 1}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Decrease Priority"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleActivateStandby(item.candidate.fullName, item.app.role)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Promote to Standby
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: PROACTIVE STANDBY POOL */}
      {activeSubTab === 'standby' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Proactive Standby Candidates</h3>
              <p className="text-xs text-slate-500">Pre-screened standby candidates on venue standby for immediate slot allocation</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {rawStandby.length} Standby Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rawStandby.map((item) => (
              <div key={item.app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.candidate.fullName}</h4>
                    <span className="text-xs text-slate-500">{item.app.hiringDriveTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.standby.invitationStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Invited At</span>
                    <strong className="text-slate-700 font-mono">{item.standby.invitedAt || 'Today, 08:30 AM'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Response Deadline</span>
                    <strong className="text-rose-600 font-mono font-bold">{item.standby.responseDeadline || '12:00 PM'}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Location: {item.standby.location || 'Mysuru Campus'}</span>
                  <button
                    onClick={() => handleActivateStandby(item.candidate.fullName, item.standby.jobRole)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Activate to Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: VACANT POSITIONS & REPLACEMENTS */}
      {activeSubTab === 'replacements' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Vacant Positions & Replacement Matching</h3>
              <p className="text-xs text-slate-500">Slots and openings vacated due to absences, cancellations, or declined offers</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {vacantPositions.length} Positions Available
            </span>
          </div>

          <div className="space-y-3">
            {vacantPositions.map((pos) => (
              <div key={pos.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{pos.driveTitle} ({pos.role})</h4>
                    <p className="text-xs text-slate-500">{pos.venue} • {pos.time}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    {pos.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="text-slate-400">Vacated Reason: </span>
                  <strong className="text-slate-800">{pos.vacatedReason}</strong>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-900 uppercase block">Top Matched Standby:</span>
                    <strong className="text-indigo-950 font-bold">{pos.suggestedReplacement}</strong>
                  </div>
                  <button
                    onClick={() => showToast(`Dispatched replacement invitation to top standby candidate for ${pos.role}.`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Dispatch Replacement Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 4: WAITLIST MOVEMENT HISTORY */}
      {activeSubTab === 'history' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Waitlist Movement & Allocation Audit History</h3>
              <p className="text-xs text-slate-500">Immutable chronological record of promotions, re-rankings, and slot allocations</p>
            </div>
            <History className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {movementLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-slate-900">{log.candidate} — {log.action}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{log.note}</p>
                  <span className="text-[10px] text-indigo-700 font-semibold">{log.drive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

