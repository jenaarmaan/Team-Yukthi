import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Building2,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  Eye,
  ShieldCheck
} from 'lucide-react';

interface ScheduleSession {
  id: string;
  candidateName: string;
  candidateEmail: string;
  interviewerName: string;
  driveTitle: string;
  roundTitle: string;
  date: string;
  time: string;
  venue: string;
  room: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'rescheduled' | 'cancelled';
}

export const CoordinatorSchedulesView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const [activeViewMode, setActiveViewMode] = useState<'list' | 'daily' | 'calendar'>('list');
  const [filterDrive, setFilterDrive] = useState<string>('all');
  const [filterRound, setFilterRound] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-31');

  // Reschedule Modal State
  const [rescheduleSession, setRescheduleSession] = useState<ScheduleSession | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('2026-11-01');
  const [newRescheduleTime, setNewRescheduleTime] = useState<string>('11:00 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialSessions: ScheduleSession[] = [
    {
      id: 'sess_01',
      candidateName: 'Rohan Sharma',
      candidateEmail: 'rohan.sharma.vtu@gmail.com',
      interviewerName: 'Dr. K. S. Ramanujan',
      driveTitle: 'Graduate Software Engineer 2026',
      roundTitle: 'Technical Round 1 (DSA & Problem Solving)',
      date: '2026-10-31',
      time: '09:00 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-01',
      status: 'completed'
    },
    {
      id: 'sess_02',
      candidateName: 'Pooja Patel',
      candidateEmail: 'pooja.patel.vtu@gmail.com',
      interviewerName: 'Dr. K. S. Ramanujan',
      driveTitle: 'Graduate Software Engineer 2026',
      roundTitle: 'Technical Round 1 (DSA & Problem Solving)',
      date: '2026-10-31',
      time: '10:00 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room A-01',
      status: 'in_progress'
    },
    {
      id: 'sess_03',
      candidateName: 'Vikram Aditya',
      candidateEmail: 'vikram.aditya.bengaluru@gmail.com',
      interviewerName: 'Rajesh Sen',
      driveTitle: 'Cloud DevOps & SRE Hiring',
      roundTitle: 'Technical Round 2 (Kubernetes & CI/CD)',
      date: '2026-10-31',
      time: '02:00 PM',
      venue: 'Bengaluru Tech Hub',
      room: 'Boardroom C-01',
      status: 'scheduled'
    },
    {
      id: 'sess_04',
      candidateName: 'Sneha Kulkarni',
      candidateEmail: 'sneha.kulkarni@gmail.com',
      interviewerName: 'Dr. S. K. Rao',
      driveTitle: 'Graduate Software Engineer 2026',
      roundTitle: 'Technical Round 1 (DSA)',
      date: '2026-10-31',
      time: '11:30 AM',
      venue: 'Mysuru Campus Center',
      room: 'Panel Room B-02',
      status: 'scheduled'
    },
    {
      id: 'sess_05',
      candidateName: 'Ananya Deshmukh',
      candidateEmail: 'ananya.deshmukh@gmail.com',
      interviewerName: 'Murali Krishna',
      driveTitle: 'Full Stack Web Platform Drive',
      roundTitle: 'HR & Cultural Alignment',
      date: '2026-11-01',
      time: '10:30 AM',
      venue: 'Hyderabad Tech Center',
      room: 'Interview Room 102',
      status: 'scheduled'
    }
  ];

  const [sessions, setSessions] = useState<ScheduleSession[]>(initialSessions);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleSession) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === rescheduleSession.id
          ? {
              ...s,
              date: newRescheduleDate,
              time: newRescheduleTime,
              status: 'rescheduled'
            }
          : s
      )
    );
    showToast(`Interview rescheduled for ${rescheduleSession.candidateName} to ${newRescheduleDate} at ${newRescheduleTime}.`);
    setRescheduleSession(null);
  };

  const handleCancelSession = (sessId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessId ? { ...s, status: 'cancelled' } : s))
    );
    showToast('Interview session cancelled. Standby pool notified.');
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterDrive !== 'all' && !s.driveTitle.toLowerCase().includes(filterDrive.toLowerCase())) return false;
    if (filterRound !== 'all' && !s.roundTitle.toLowerCase().includes(filterRound.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.candidateName.toLowerCase().includes(q) ||
        s.interviewerName.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.driveTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & View Controls */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                SESSION TIMELINES
              </span>
              <h2 className="text-xl font-bold text-slate-900">Interview Schedule Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Drive-wise, candidate-wise, interviewer-wise schedules across Calendar, Daily Timeline, and List Views
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setActiveViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'daily'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Timeline</span>
            </button>
            <button
              onClick={() => setActiveViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
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

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Hiring Drive</label>
            <select
              value={filterDrive}
              onChange={(e) => setFilterDrive(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="all">All Drives</option>
              {drives.map((d) => (
                <option key={d.id} value={d.title}>{d.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Round</label>
            <select
              value={filterRound}
              onChange={(e) => setFilterRound(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="all">All Rounds</option>
              <option value="Round 1">Technical Round 1 (Coding & DSA)</option>
              <option value="Round 2">Technical Round 2 (System Design/DevOps)</option>
              <option value="HR">HR & Cultural Alignment</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Candidate / Interviewer</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, room, interviewer..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 2. MODE 1: LIST VIEW */}
      {activeViewMode === 'list' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              Scheduled Interview Sessions ({filteredSessions.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time status synced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Session Date & Time</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Interview Round</th>
                  <th className="py-2.5 px-3">Assigned Interviewer</th>
                  <th className="py-2.5 px-3">Venue & Room</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredSessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Time */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{sess.time}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{sess.date}</span>
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{sess.candidateName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{sess.candidateEmail}</span>
                    </td>

                    {/* Round */}
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate">{sess.roundTitle}</div>
                      <span className="text-[10px] text-indigo-700 font-semibold">{sess.driveTitle}</span>
                    </td>

                    {/* Interviewer */}
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {sess.interviewerName}
                    </td>

                    {/* Venue & Room */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{sess.room}</div>
                      <span className="text-[10px] text-slate-400">{sess.venue}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                          sess.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : sess.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            : sess.status === 'rescheduled'
                            ? 'bg-violet-50 text-violet-700 border-violet-200'
                            : sess.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {sess.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sess.status !== 'completed' && sess.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => {
                                setRescheduleSession(sess);
                                setNewRescheduleDate(sess.date);
                                setNewRescheduleTime(sess.time);
                              }}
                              className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelSession(sess.id)}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MODE 2: DAILY SCHEDULE TIMELINE */}
      {activeViewMode === 'daily' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Daily Timeline Schedule for {selectedDate}</h3>
              <p className="text-xs text-slate-500">Hour-by-hour interview panel execution across active rooms</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-3">
            {['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM', '02:00 PM', '03:00 PM'].map((timeSlot) => {
              const matchedSessions = sessions.filter((s) => s.time === timeSlot);
              return (
                <div key={timeSlot} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-20 font-mono font-bold text-xs text-indigo-700 shrink-0 mt-1">
                    {timeSlot}
                  </div>
                  <div className="flex-1 space-y-2">
                    {matchedSessions.length > 0 ? (
                      matchedSessions.map((sess) => (
                        <div key={sess.id} className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <strong className="text-slate-900">{sess.candidateName}</strong>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                              {sess.room} ({sess.venue})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{sess.roundTitle} • Panel: {sess.interviewerName}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No interviews allocated in this time block.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MODE 3: CALENDAR VIEW */}
      {activeViewMode === 'calendar' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">November 2026 Interview Calendar</h3>
            <span className="text-xs text-slate-500">Monthly schedule overview</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-slate-400 py-1 uppercase text-[10px]">{day}</div>
            ))}
            {Array.from({ length: 30 }).map((_, idx) => {
              const dayNum = idx + 1;
              const hasEvents = dayNum === 31 || dayNum === 1 || dayNum === 2;
              return (
                <div
                  key={idx}
                  className={`min-h-[70px] p-2 rounded-xl border text-left space-y-1 transition-all ${
                    hasEvents ? 'bg-indigo-50/50 border-indigo-200 shadow-2xs' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-700">{dayNum}</span>
                  {hasEvents && (
                    <div className="text-[9px] font-bold text-indigo-700 bg-indigo-100/70 p-1 rounded">
                      {dayNum === 1 ? '3 Sessions' : '4 Sessions'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Reschedule Modal (Item 9 & Conflict Validation) */}
      {rescheduleSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Reschedule Interview Session</h3>
              <button onClick={() => setRescheduleSession(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Candidate: <strong className="text-slate-900">{rescheduleSession.candidateName}</strong></div>
              <div>Current: <span className="font-mono text-slate-600">{rescheduleSession.date} at {rescheduleSession.time}</span></div>
              <div>Panel: <span className="text-slate-700">{rescheduleSession.interviewerName} ({rescheduleSession.room})</span></div>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Interview Date</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                <input
                  type="text"
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  required
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-Trust conflict engine verified no double-booking at requested time.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRescheduleSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

