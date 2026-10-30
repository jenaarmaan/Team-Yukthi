import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { InterviewSlot, HiringDrive } from '../../../types/recruitment';
import {
  Clock,
  Plus,
  Layers,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Building2,
  Users,
  Search,
  X,
  ShieldCheck,
  Zap,
  Edit2,
  Trash2,
  ArrowRight
} from 'lucide-react';

interface ManagedSlot {
  id: string;
  driveId: string;
  driveTitle: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  venue: string;
  roomOrPanel: string;
  interviewerName: string;
  candidateName?: string;
  status: 'available' | 'occupied' | 'cancelled' | 'reallocated';
}

export const CoordinatorSlotsView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const allApps = recruitmentService.getAllApplications();

  // Initial state derived from applications with interviewSlot
  const initialSlots: ManagedSlot[] = [
    {
      id: 'slot_01',
      driveId: 'drive_01',
      driveTitle: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      date: '2026-10-31',
      startTime: '09:00 AM',
      endTime: '09:45 AM',
      durationMinutes: 45,
      venue: 'Mysuru Campus Center',
      roomOrPanel: 'Panel Room A-01',
      interviewerName: 'Dr. K. S. Ramanujan',
      candidateName: 'Rohan Sharma',
      status: 'occupied'
    },
    {
      id: 'slot_02',
      driveId: 'drive_01',
      driveTitle: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      date: '2026-10-31',
      startTime: '10:00 AM',
      endTime: '10:45 AM',
      durationMinutes: 45,
      venue: 'Mysuru Campus Center',
      roomOrPanel: 'Panel Room A-01',
      interviewerName: 'Dr. K. S. Ramanujan',
      candidateName: 'Pooja Patel',
      status: 'occupied'
    },
    {
      id: 'slot_03',
      driveId: 'drive_01',
      driveTitle: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      date: '2026-10-31',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      durationMinutes: 45,
      venue: 'Mysuru Campus Center',
      roomOrPanel: 'Panel Room A-02',
      interviewerName: 'Ananya Deshmukh',
      candidateName: undefined,
      status: 'available'
    },
    {
      id: 'slot_04',
      driveId: 'drive_02',
      driveTitle: 'Cloud DevOps & SRE Hiring',
      role: 'DevOps Specialist',
      date: '2026-10-31',
      startTime: '02:00 PM',
      endTime: '02:50 PM',
      durationMinutes: 50,
      venue: 'Bengaluru Tech Hub',
      roomOrPanel: 'Boardroom C-01',
      interviewerName: 'Rajesh Sen',
      candidateName: 'Vikram Aditya',
      status: 'occupied'
    },
    {
      id: 'slot_05',
      driveId: 'drive_02',
      driveTitle: 'Cloud DevOps & SRE Hiring',
      role: 'DevOps Specialist',
      date: '2026-10-31',
      startTime: '03:00 PM',
      endTime: '03:50 PM',
      durationMinutes: 50,
      venue: 'Bengaluru Tech Hub',
      roomOrPanel: 'Boardroom C-01',
      interviewerName: 'Rajesh Sen',
      candidateName: undefined,
      status: 'available'
    },
    {
      id: 'slot_06',
      driveId: 'drive_01',
      driveTitle: 'Graduate Software Engineer 2026',
      role: 'Software Engineer',
      date: '2026-10-31',
      startTime: '11:30 AM',
      endTime: '12:15 PM',
      durationMinutes: 45,
      venue: 'Mysuru Campus Center',
      roomOrPanel: 'Panel Room B-02',
      interviewerName: 'Dr. S. K. Rao',
      candidateName: 'Sneha Kulkarni',
      status: 'reallocated'
    }
  ];

  const [slots, setSlots] = useState<ManagedSlot[]>(initialSlots);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDrive, setFilterDrive] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Single Slot Creation Form State
  const [newSlotDrive, setNewSlotDrive] = useState<string>(drives[0]?.id || 'drive_01');
  const [newSlotDate, setNewSlotDate] = useState<string>('2026-10-31');
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('04:00 PM');
  const [newSlotDuration, setNewSlotDuration] = useState<number>(45);
  const [newSlotVenue, setNewSlotVenue] = useState<string>('Mysuru Campus Center');
  const [newSlotRoom, setNewSlotRoom] = useState<string>('Panel Room A-03');
  const [newSlotInterviewer, setNewSlotInterviewer] = useState<string>('Murali Krishna');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Bulk Generator State
  const [bulkDrive, setBulkDrive] = useState<string>(drives[0]?.id || 'drive_01');
  const [bulkDate, setBulkDate] = useState<string>('2026-11-02');
  const [bulkStart, setBulkStart] = useState<string>('09:00 AM');
  const [bulkEnd, setBulkEnd] = useState<string>('01:00 PM');
  const [bulkDuration, setBulkDuration] = useState<number>(45);
  const [bulkVenue, setBulkVenue] = useState<string>('Mysuru Campus Center');
  const [bulkCount, setBulkCount] = useState<number>(4);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Conflict detection for single slot creation
  const handleCheckConflictAndCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // Conflict Rule 1: Room double-booking on same date/time
    const hasRoomConflict = slots.some(
      (s) =>
        s.date === newSlotDate &&
        s.venue === newSlotVenue &&
        s.roomOrPanel === newSlotRoom &&
        s.startTime === newSlotStartTime &&
        s.status !== 'cancelled'
    );

    // Conflict Rule 2: Interviewer double-booking on same date/time
    const hasInterviewerConflict = slots.some(
      (s) =>
        s.date === newSlotDate &&
        s.interviewerName === newSlotInterviewer &&
        s.startTime === newSlotStartTime &&
        s.status !== 'cancelled'
    );

    if (hasRoomConflict) {
      setConflictWarning(
        `CONFLICT DETECTED: ${newSlotRoom} at ${newSlotVenue} is already booked at ${newSlotStartTime}. Please choose an alternative room or adjust slot time.`
      );
      return;
    }

    if (hasInterviewerConflict) {
      setConflictWarning(
        `CONFLICT DETECTED: Interviewer ${newSlotInterviewer} is already allocated to another interview panel at ${newSlotStartTime}.`
      );
      return;
    }

    const driveObj = drives.find((d) => d.id === newSlotDrive) || drives[0];

    const createdSlot: ManagedSlot = {
      id: `slot_${Date.now()}`,
      driveId: newSlotDrive,
      driveTitle: driveObj.title,
      role: driveObj.role,
      date: newSlotDate,
      startTime: newSlotStartTime,
      endTime: '04:45 PM',
      durationMinutes: newSlotDuration,
      venue: newSlotVenue,
      roomOrPanel: newSlotRoom,
      interviewerName: newSlotInterviewer,
      status: 'available'
    };

    setSlots((prev) => [createdSlot, ...prev]);
    setShowCreateModal(false);
    setConflictWarning(null);
    showToast(`Slot created successfully: ${createdSlot.startTime} in ${createdSlot.roomOrPanel}`);
  };

  // Bulk Slot Generation
  const handleGenerateBulkSlots = (e: React.FormEvent) => {
    e.preventDefault();
    const driveObj = drives.find((d) => d.id === bulkDrive) || drives[0];

    const generated: ManagedSlot[] = Array.from({ length: bulkCount }).map((_, idx) => ({
      id: `slot_bulk_${Date.now()}_${idx}`,
      driveId: bulkDrive,
      driveTitle: driveObj.title,
      role: driveObj.role,
      date: bulkDate,
      startTime: `${9 + idx}:00 AM`,
      endTime: `${9 + idx}:45 AM`,
      durationMinutes: bulkDuration,
      venue: bulkVenue,
      roomOrPanel: `Panel Room B-0${(idx % 3) + 1}`,
      interviewerName: 'Assigned Panel',
      status: 'available'
    }));

    setSlots((prev) => [...generated, ...prev]);
    setShowBulkModal(false);
    showToast(`Bulk generation successful: ${bulkCount} interview slots configured for ${bulkDate}.`);
  };

  // Cancel slot
  const handleCancelSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: 'cancelled', candidateName: undefined } : s))
    );
    showToast('Interview slot marked as cancelled.');
  };

  // Filtered slots
  const filteredSlots = slots.filter((slot) => {
    if (filterStatus !== 'all' && slot.status !== filterStatus) return false;
    if (filterDrive !== 'all' && slot.driveId !== filterDrive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        slot.driveTitle.toLowerCase().includes(q) ||
        slot.roomOrPanel.toLowerCase().includes(q) ||
        slot.interviewerName.toLowerCase().includes(q) ||
        (slot.candidateName && slot.candidateName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Actions */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                SLOT ARCHITECTURE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Interview Slot Creation & Allocation</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure individual slots, generate bulk interview schedules, and monitor slot capacity without conflict
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Bulk Generator</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Slot</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="all">All Slot Statuses ({slots.length})</option>
              <option value="available">Available Slots</option>
              <option value="occupied">Occupied Slots</option>
              <option value="cancelled">Cancelled Slots</option>
              <option value="reallocated">Reallocated Slots</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Hiring Drive</label>
            <select
              value={filterDrive}
              onChange={(e) => setFilterDrive(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="all">All Hiring Drives</option>
              {drives.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Slots</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search panel, room, candidate..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Slot Cards Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Configured Interview Slots ({filteredSlots.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Zero-Conflict Guard Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Drive & Role</th>
                <th className="py-2.5 px-3">Venue & Room</th>
                <th className="py-2.5 px-3">Assigned Interviewer</th>
                <th className="py-2.5 px-3">Allocated Candidate</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredSlots.map((slot) => {
                const isOccupied = slot.status === 'occupied';
                const isAvailable = slot.status === 'available';
                const isCancelled = slot.status === 'cancelled';
                const isReallocated = slot.status === 'reallocated';

                return (
                  <tr key={slot.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Date & Time */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 font-mono">{slot.startTime} - {slot.endTime}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{slot.date} ({slot.durationMinutes}m)</span>
                    </td>

                    {/* Drive & Role */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 truncate max-w-[160px]">{slot.driveTitle}</div>
                      <span className="text-[10px] text-slate-500">{slot.role}</span>
                    </td>

                    {/* Venue & Room */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{slot.roomOrPanel}</div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{slot.venue}</span>
                      </span>
                    </td>

                    {/* Interviewer */}
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {slot.interviewerName}
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-3">
                      {slot.candidateName ? (
                        <div className="font-bold text-indigo-700">{slot.candidateName}</div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                          isOccupied
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isReallocated
                            ? 'bg-violet-50 text-violet-700 border-violet-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isAvailable && (
                          <button
                            onClick={() => {
                              setSlots((prev) =>
                                prev.map((s) => (s.id === slot.id ? { ...s, candidateName: 'Assigned Candidate', status: 'occupied' } : s))
                              );
                              showToast('Candidate assigned to slot.');
                            }}
                            className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px]"
                          >
                            Assign
                          </button>
                        )}
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelSlot(slot.id)}
                            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Cancel Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Single Slot Creation Modal (Item 1 & Step 8 Conflict Detection) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Interview Slot</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Warning Box (Step 8) */}
            {conflictWarning && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Scheduling Conflict Blocked</span>
                </div>
                <p>{conflictWarning}</p>
              </div>
            )}

            <form onSubmit={handleCheckConflictAndCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hiring Drive</label>
                <select
                  value={newSlotDrive}
                  onChange={(e) => setNewSlotDrive(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                >
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue Hub</label>
                  <select
                    value={newSlotVenue}
                    onChange={(e) => setNewSlotVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  >
                    <option value="Mysuru Campus Center">Mysuru Campus Center</option>
                    <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
                    <option value="Hyderabad Tech Center">Hyderabad Tech Center</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room or Panel</label>
                  <input
                    type="text"
                    value={newSlotRoom}
                    onChange={(e) => setNewSlotRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Interviewer</label>
                <input
                  type="text"
                  value={newSlotInterviewer}
                  onChange={(e) => setNewSlotInterviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Validate & Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Bulk Slot Generator Modal (Item 2) */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Bulk Interview Slot Generator</h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBulkSlots} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hiring Drive</label>
                <select
                  value={bulkDrive}
                  onChange={(e) => setBulkDrive(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                >
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Slots</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slot Duration</label>
                  <select
                    value={bulkDuration}
                    onChange={(e) => setBulkDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes (Standard)</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue Location</label>
                  <select
                    value={bulkVenue}
                    onChange={(e) => setBulkVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  >
                    <option value="Mysuru Campus Center">Mysuru Campus Center</option>
                    <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
                    <option value="Hyderabad Tech Center">Hyderabad Tech Center</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] leading-relaxed">
                <strong>Generator Preview: </strong>
                Configures {bulkCount} sequential slots on {bulkDate} with 15-minute inter-slot buffer and automatic conflict validation.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Generate {bulkCount} Slots
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

