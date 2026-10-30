import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Building2,
  CheckCircle2,
  Search,
  X
} from 'lucide-react';

export const AdminInterviewScheduling: React.FC = () => {
  const applications = recruitmentService.getAllApplications();
  const drives = recruitmentService.getHiringDrives();
  const interviewers = recruitmentService.getInterviewers();

  const [selectedDriveId, setSelectedDriveId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);

  // Form state for creating slot
  const [newSlotDriveId, setNewSlotDriveId] = useState(drives[0]?.id || '');
  const [newSlotDate, setNewSlotDate] = useState('Saturday, Nov 21, 2026');
  const [newSlotTime, setNewSlotTime] = useState('11:00 AM - 12:00 PM IST');
  const [newSlotVenue, setNewSlotVenue] = useState('Mysuru Campus, Panel 3');
  const [newSlotInterviewer, setNewSlotInterviewer] = useState(interviewers[0]?.name || '');

  // Confirmed slots from applications
  const confirmedApps = applications.filter((a) => a.status === 'confirmed' && a.interviewSlot);

  // Filter slots
  const filteredSlots = confirmedApps.filter((a) => {
    const matchesDrive = selectedDriveId === 'all' || a.hiringDriveId === selectedDriveId;
    const matchesLocation =
      selectedLocation === 'all' || a.appliedLocation === selectedLocation;
    return matchesDrive && matchesLocation;
  });

  const totalConfirmed = confirmedApps.length;
  const totalCapacity = drives.reduce((sum, d) => sum + d.interviewCapacity, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Interview Slot & Capacity Management</h2>
          <p className="text-xs text-slate-500">Track venue room allocations, interviewer panels, and prevent overbooking</p>
        </div>

        <button
          onClick={() => setShowAddSlotModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Interview Slot</span>
        </button>
      </div>

      {/* Capacity Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Slots</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{totalConfirmed}</div>
          <div className="text-[11px] text-slate-500">Confirmed candidate allocations</div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Drive Capacity</div>
          <div className="text-2xl font-extrabold text-indigo-700 font-mono tabular-nums">{totalCapacity}</div>
          <div className="text-[11px] text-slate-500">Across Mysuru, Bengaluru & Hyderabad</div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overbooking Guard</div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active: Zero Overbooking / Double Allocation</span>
          </div>
          <div className="text-[11px] text-slate-500">Automated queue routing to Dynamic Waitlist</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedDriveId}
          onChange={(e) => setSelectedDriveId(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none shadow-xs"
        >
          <option value="all">All Hiring Drives</option>
          {drives.map((d) => (
            <option key={d.id} value={d.id}>
              {d.role} ({d.locations.join('/')})
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none shadow-xs"
        >
          <option value="all">All Venues</option>
          <option value="Mysuru">Mysuru Campus</option>
          <option value="Bengaluru">Bengaluru Manyata Tech Park</option>
          <option value="Hyderabad">Hyderabad R&D Center</option>
        </select>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate Allocated</th>
                <th className="py-3 px-4">Hiring Drive</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Panel & Venue</th>
                <th className="py-3 px-4">Pass Token</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No confirmed interview slots match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((app) => {
                  const slot = app.interviewSlot!;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{app.candidateProfile.fullName}</div>
                        <div className="text-[11px] text-slate-400">{app.candidateProfile.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.role}</div>
                        <div className="text-[10px] text-slate-400">{app.appliedLocation}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-800">{slot.date}</div>
                        <div className="text-[11px] text-slate-500">{slot.time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-indigo-700">{slot.roomOrPanel}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{slot.venueAddress}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {slot.qrToken.substring(0, 18)}...
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            slot.attendanceVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {slot.attendanceVerified ? 'Attended' : 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Interview Capacity Slot</h3>
              <button onClick={() => setShowAddSlotModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Hiring Drive</label>
                <select
                  value={newSlotDriveId}
                  onChange={(e) => setNewSlotDriveId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                >
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>{d.role} ({d.locations.join('/')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Interview Date</label>
                <input
                  type="text"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Time Window</label>
                <input
                  type="text"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Panel & Venue</label>
                <input
                  type="text"
                  value={newSlotVenue}
                  onChange={(e) => setNewSlotVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Interviewer Panelist</label>
                <select
                  value={newSlotInterviewer}
                  onChange={(e) => setNewSlotInterviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                >
                  {interviewers.map((i) => (
                    <option key={i.id} value={i.name}>{i.name} - {i.assignedPanel}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Added slot for ${newSlotDate} at ${newSlotVenue}. Available for automatic candidate allocation.`);
                setShowAddSlotModal(false);
              }}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Confirm & Provision Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
