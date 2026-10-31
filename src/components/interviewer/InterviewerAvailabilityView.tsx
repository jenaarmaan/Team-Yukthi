import React, { useState, useEffect } from 'react';
import { InterviewerAvailability, InterviewerProfile } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  Calendar as CalendarIcon,
  Clock,
  Coffee,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

interface InterviewerAvailabilityViewProps {
  interviewer: InterviewerProfile;
}

export const InterviewerAvailabilityView: React.FC<InterviewerAvailabilityViewProps> = ({ interviewer }) => {
  const [availabilityList, setAvailabilityList] = useState<InterviewerAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [status, setStatus] = useState<InterviewerAvailability['status']>('available');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('05:00 PM');
  const [note, setNote] = useState<string>('');
  const [leaveType, setLeaveType] = useState<any>('sick');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = () => {
    recruitmentService.fetchInterviewerAvailability().then((list) => {
      setAvailabilityList(list);
    });
  };

  useEffect(() => {
    loadData();
    const unsubscribe = recruitmentService.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setConflictWarning(null);
    setActionSuccess(null);

    try {
      const res = await recruitmentService.saveInterviewerAvailability({
        date: selectedDate,
        status,
        startTime,
        endTime,
        note,
        leaveType: status === 'leave' || status === 'emergency_unavailable' ? leaveType : undefined
      });

      if (res.success) {
        setActionSuccess('Availability record saved successfully.');
        if (res.data?.recoveryWarning) {
          setConflictWarning(res.data.recoveryWarning);
        }
        loadData();
      } else {
        alert(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-2xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-indigo-300" />
            <span>Interviewer Availability & Leave Governance</span>
          </div>
          <h2 className="text-xl font-black text-white">Availability Calendar & Panel Scheduling</h2>
          <p className="text-xs text-indigo-200">
            Configure your active evaluation slots, break times, and leave requests. Any change impacting confirmed interview slots is automatically coordinated with the NIYOJAN Self-Healing Engine.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {conflictWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Interview Schedule Conflict Detected:</span>
            <span className="text-[11px] text-amber-900/90">{conflictWarning}</span>
          </div>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Update Availability Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Manage Availability Block</span>
          </h3>

          <form onSubmit={handleSaveAvailability} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 text-slate-900"
              >
                <option value="available">Available for Interviews</option>
                <option value="break">Break / Lunch Interval</option>
                <option value="busy">Busy / Internal Meeting</option>
                <option value="leave">Planned Leave Request</option>
                <option value="emergency_unavailable">Emergency Unavailability</option>
              </select>
            </div>

            {(status === 'break' || status === 'available' || status === 'busy') && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            )}

            {(status === 'leave' || status === 'emergency_unavailable') && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="sick">Medical / Health Sickness</option>
                  <option value="personal">Personal Urgent Leave</option>
                  <option value="emergency">Family Emergency</option>
                  <option value="work_conflict">Architecture Milestone Priority</option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Operational Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason or special requirements for recruitment coordinators..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-18 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Availability Record</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Schedule Records */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-slate-600" />
                <span>Configured Schedule Blocks & Leave Requests</span>
              </h3>
              <span className="text-[11px] text-slate-400">Total: {availabilityList.length} records</span>
            </div>

            {availabilityList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No availability records registered yet.</div>
            ) : (
              <div className="space-y-3">
                {availabilityList.map((av) => (
                  <div
                    key={av.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">{av.date}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            av.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : av.status === 'break'
                              ? 'bg-sky-100 text-sky-800'
                              : av.status === 'leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {av.status.replace(/_/g, ' ')}
                        </span>
                        {av.approvalStatus && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            ({av.approvalStatus})
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600">
                        {av.startTime && av.endTime ? (
                          <span>
                            Time Window: {av.startTime} &bull; {av.endTime}
                          </span>
                        ) : (
                          <span>Full Day Block</span>
                        )}
                        {av.note && <span className="block text-slate-500 italic mt-0.5">"{av.note}"</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Self-Healing Integration Policy:</strong> When leave is requested on a date with confirmed candidate interviews, NIYOJAN automatically flags the interview coordinator and identifies peer panelists with matching technical competencies (e.g. Java, Cloud Architecture) to guarantee zero cancelled candidate slots.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

