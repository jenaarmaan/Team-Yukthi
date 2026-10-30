import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  CheckCircle2,
  XCircle,
  QrCode,
  KeyRound,
  Clock,
  MapPin,
  Search,
  Filter,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const applications = recruitmentService.getAllApplications();
  const confirmedApps = applications.filter((a) => a.status === 'confirmed' && a.interviewSlot);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all, present, pending

  const filtered = confirmedApps.filter((app) => {
    const p = app.candidateProfile;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());

    const isPresent = app.interviewSlot?.attendanceVerified;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'present' && isPresent) ||
      (filterStatus === 'pending' && !isPresent);

    return matchesSearch && matchesStatus;
  });

  const presentCount = confirmedApps.filter((a) => a.interviewSlot?.attendanceVerified).length;
  const pendingCount = confirmedApps.length - presentCount;

  const handleManualMark = (applicationId: string, status: 'present' | 'absent') => {
    recruitmentService.markAttendanceManual(applicationId, status);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Interview Attendance & Check-In Desk</h2>
          <p className="text-xs text-slate-500">Live reception desk check-in telemetry, QR biometric tokens, and OTP verifications</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Present: {presentCount}</span>
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Awaiting Check-In: {pendingCount}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, email, role..."
            className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none shadow-xs"
        >
          <option value="all">All Check-In States</option>
          <option value="present">Present (Verified Check-In)</option>
          <option value="pending">Awaiting Arrival</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate & Photo ID</th>
                <th className="py-3 px-4">Drive & Location</th>
                <th className="py-3 px-4">Reporting Slot</th>
                <th className="py-3 px-4">Verification Method</th>
                <th className="py-3 px-4 text-center">Desk Status</th>
                <th className="py-3 px-4 text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No scheduled candidate slots found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const slot = app.interviewSlot!;
                  const isPresent = slot.attendanceVerified;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{app.candidateProfile.fullName}</div>
                        <div className="text-[11px] text-slate-500">{app.candidateProfile.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.role}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.roomOrPanel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-800">{slot.time}</div>
                        <div className="text-[10px] text-indigo-700 font-medium">Rep: {slot.reportingTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[11px] text-slate-600 truncate max-w-[120px]">
                            {slot.qrToken.substring(0, 16)}...
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          OTP: <strong className="text-indigo-700">{slot.otpCode}</strong>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPresent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Present ({slot.checkedInAt ? new Date(slot.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'})</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Awaiting Arrival</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPresent ? (
                            <>
                              <button
                                onClick={() => handleManualMark(app.id, 'present')}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                              >
                                Mark Present
                              </button>
                              <button
                                onClick={() => handleManualMark(app.id, 'absent')}
                                className="px-2.5 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition-colors"
                              >
                                Mark No-Show
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
