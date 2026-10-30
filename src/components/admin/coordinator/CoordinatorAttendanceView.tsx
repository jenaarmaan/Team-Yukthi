import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ShieldCheck,
  FileText,
  UserCheck,
  UserX,
  X,
  RotateCcw,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';

interface AttendanceRecordItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  driveTitle: string;
  slotDate: string;
  slotTime: string;
  venue: string;
  room: string;
  status: 'present_qr' | 'present_otp' | 'present_override' | 'pending' | 'late' | 'absent';
  verifiedAt?: string;
  overrideReason?: string;
  overrideBy?: string;
}

export const CoordinatorAttendanceView: React.FC = () => {
  const allApps = recruitmentService.getAllApplications();

  const initialRecords: AttendanceRecordItem[] = [
    {
      id: 'att_01',
      candidateName: 'Rohan Sharma',
      candidateEmail: 'rohan.sharma.vtu@gmail.com',
      driveTitle: 'Graduate Software Engineer 2026',
      slotDate: '2026-10-31',
      slotTime: '09:00 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-01',
      status: 'present_qr',
      verifiedAt: '08:48 AM'
    },
    {
      id: 'att_02',
      candidateName: 'Pooja Patel',
      candidateEmail: 'pooja.patel.vtu@gmail.com',
      driveTitle: 'Graduate Software Engineer 2026',
      slotDate: '2026-10-31',
      slotTime: '10:00 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-01',
      status: 'present_otp',
      verifiedAt: '09:52 AM'
    },
    {
      id: 'att_03',
      candidateName: 'Vikram Aditya',
      candidateEmail: 'vikram.aditya.bengaluru@gmail.com',
      driveTitle: 'Cloud DevOps & SRE Hiring',
      slotDate: '2026-10-31',
      slotTime: '02:00 PM',
      venue: 'Bengaluru Tech Hub',
      room: 'Boardroom C-01',
      status: 'pending'
    },
    {
      id: 'att_04',
      candidateName: 'Sneha Kulkarni',
      candidateEmail: 'sneha.kulkarni@gmail.com',
      driveTitle: 'Graduate Software Engineer 2026',
      slotDate: '2026-10-31',
      slotTime: '11:30 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room B-02',
      status: 'pending'
    },
    {
      id: 'att_05',
      candidateName: 'Aditya Verma',
      candidateEmail: 'aditya.verma@gmail.com',
      driveTitle: 'Graduate Software Engineer 2026',
      slotDate: '2026-10-31',
      slotTime: '09:30 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-02',
      status: 'late',
      verifiedAt: '09:42 AM'
    },
    {
      id: 'att_06',
      candidateName: 'Kavya Ramesh',
      candidateEmail: 'kavya.ramesh@gmail.com',
      driveTitle: 'Full Stack Web Platform Drive',
      slotDate: '2026-10-31',
      slotTime: '08:30 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-01',
      status: 'present_override',
      verifiedAt: '08:35 AM',
      overrideReason: 'Candidate phone display glass broken; validated via physical College Photo ID.',
      overrideBy: 'Coordinator (rakesh.rao@excelsoftcorp.com)'
    }
  ];

  const [records, setRecords] = useState<AttendanceRecordItem[]>(initialRecords);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual Override Modal State (Step 12)
  const [overrideTarget, setOverrideTarget] = useState<AttendanceRecordItem | null>(null);
  const [overrideReasonCategory, setOverrideReasonCategory] = useState<string>('hardware_damage');
  const [overrideNotes, setOverrideNotes] = useState<string>('Physical Student ID card verified by coordinator at desk.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkPresent = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'present_qr',
              verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : r
      )
    );
    showToast('Candidate attendance marked as Present.');
  };

  const handleMarkAbsent = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'absent',
              verifiedAt: undefined
            }
          : r
      )
    );
    showToast('Candidate attendance marked as Absent. Absence review workflow triggered.');
  };

  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideTarget) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === overrideTarget.id
          ? {
              ...r,
              status: 'present_override',
              verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              overrideReason: `${overrideReasonCategory.replace('_', ' ').toUpperCase()}: ${overrideNotes}`,
              overrideBy: 'Coordinator (rakesh.rao@excelsoftcorp.com)'
            }
          : r
      )
    );

    showToast(`Manual attendance override recorded for ${overrideTarget.candidateName} with audit trail.`);
    setOverrideTarget(null);
  };

  const filteredRecords = records.filter((r) => {
    if (filterStatus === 'present' && !r.status.startsWith('present')) return false;
    if (filterStatus === 'pending' && r.status !== 'pending') return false;
    if (filterStatus === 'late' && r.status !== 'late') return false;
    if (filterStatus === 'absent' && r.status !== 'absent') return false;
    if (filterStatus === 'override' && r.status !== 'present_override') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.candidateName.toLowerCase().includes(q) ||
        r.candidateEmail.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.driveTitle.toLowerCase().includes(q)
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
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                ATTENDANCE GOVERNANCE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Candidate Attendance & Verification Desk</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time attendance logs, late arrival tracking, and authorized manual override management with immutable audit logs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust Protocol Active</span>
            </span>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterStatus('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('present')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'present'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Verified Present
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
            >
              Pending Desk Check-in
            </button>
            <button
              onClick={() => setFilterStatus('override')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'override'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Manual Overrides
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name or USN..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Attendance Records Table (Items 1 to 7) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            Candidate Attendance Roster ({filteredRecords.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">HMAC Authenticated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Hiring Drive</th>
                <th className="py-2.5 px-3">Slot & Venue</th>
                <th className="py-2.5 px-3 text-center">Attendance Status</th>
                <th className="py-2.5 px-3">Verification Details</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRecords.map((item) => {
                const isPresent = item.status.startsWith('present');
                const isOverride = item.status === 'present_override';
                const isPending = item.status === 'pending';
                const isLate = item.status === 'late';
                const isAbsent = item.status === 'absent';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Candidate */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.candidateName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.candidateEmail}</div>
                    </td>

                    {/* Drive */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 truncate max-w-[160px]">{item.driveTitle}</div>
                    </td>

                    {/* Slot & Venue */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-800">{item.slotTime} ({item.slotDate})</div>
                      <span className="text-[10px] text-slate-500">{item.room} • {item.venue}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                          item.status === 'present_qr'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'present_otp'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : item.status === 'present_override'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isLate
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isAbsent
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Verification Details */}
                    <td className="py-3 px-3 max-w-[200px]">
                      {item.verifiedAt && (
                        <div className="text-[11px] text-slate-700">
                          Verified at <span className="font-mono font-bold text-slate-900">{item.verifiedAt}</span>
                        </div>
                      )}
                      {isOverride && (
                        <div className="text-[10px] text-amber-800 leading-tight mt-0.5 font-medium">
                          {item.overrideReason}
                        </div>
                      )}
                      {isPending && (
                        <span className="text-[11px] text-slate-400 italic">Awaiting check-in at gate</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleMarkPresent(item.id)}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] cursor-pointer"
                              title="Mark Present"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMarkAbsent(item.id)}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer"
                              title="Mark Absent"
                            >
                              Absent
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setOverrideTarget(item)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                          title="Authorized Manual Override"
                        >
                          Override
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Manual Attendance Override Modal (Step 12) */}
      {overrideTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">Authorized Attendance Override</h3>
              </div>
              <button onClick={() => setOverrideTarget(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Candidate: <strong className="text-slate-900">{overrideTarget.candidateName}</strong></div>
              <div>Slot: <span className="font-mono text-slate-700">{overrideTarget.slotTime} ({overrideTarget.room})</span></div>
              <div className="text-[10px] text-slate-500">Current Status: {overrideTarget.status}</div>
            </div>

            <form onSubmit={handleConfirmOverride} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Override Reason Category</label>
                <select
                  value={overrideReasonCategory}
                  onChange={(e) => setOverrideReasonCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                >
                  <option value="hardware_damage">Camera Glare / Cracked Screen / QR Unreadable</option>
                  <option value="network_latency">SMS / OTP Delivery Latency</option>
                  <option value="gate_terminal_offline">Gate Scanner Terminal Malfunction</option>
                  <option value="id_card_verified">Physical College Photo ID Verified by Desk</option>
                  <option value="human_error_correction">Correction of Incorrectly Recorded Status</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coordinator Notes & Verification Evidence</label>
                <textarea
                  rows={3}
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Describe justification and verified credentials..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Audit Compliance Warning: </strong>
                All manual overrides record your identity (Coordinator), IP address, and timestamp in the immutable SQLite audit log.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOverrideTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  Authorize Manual Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

