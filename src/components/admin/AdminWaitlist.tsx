import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import { Application } from '../../types/recruitment';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  X
} from 'lucide-react';

export const AdminWaitlist: React.FC = () => {
  const waitlists = recruitmentService.getAllWaitlistApplications();
  const [selectedWaitlistApp, setSelectedWaitlistApp] = useState<Application | null>(null);

  // Promotion form state
  const [promotedDate, setPromotedDate] = useState('Saturday, Nov 28, 2026');
  const [promotedTime, setPromotedTime] = useState('11:30 AM - 12:30 PM IST');
  const [promotedVenue, setPromotedVenue] = useState('Excelsoft Technologies, Mysuru Campus Center');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handlePromoteCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWaitlistApp) return;

    const ok = recruitmentService.promoteWaitlistCandidate(
      selectedWaitlistApp.id,
      promotedDate,
      promotedTime,
      promotedVenue
    );

    if (ok) {
      setActionSuccess('Candidate successfully promoted from waitlist to Confirmed Interview Slot! In-app notification dispatched.');
      setTimeout(() => {
        setActionSuccess(null);
        setSelectedWaitlistApp(null);
      }, 1400);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Dynamic Waitlist Queue Management</h2>
          <p className="text-xs text-slate-500">Monitor candidate queue ranking, promotion triggers, and batch schedule adjustments</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            Total in Queue: {waitlists.length} Candidates
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Waitlist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Candidate & Education</th>
                <th className="py-3 px-4">Hiring Drive & Venue</th>
                <th className="py-3 px-4">Technical Skills</th>
                <th className="py-3 px-4">Waitlist Advisory / Next Step</th>
                <th className="py-3 px-4 text-right">Promotion Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {waitlists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No candidates currently in the dynamic waitlist queue.
                  </td>
                </tr>
              ) : (
                waitlists.map(({ app, candidate, waitlist }) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-xs items-center justify-center">
                        #{waitlist.position}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{candidate.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        {candidate.education.degree} in {candidate.education.branch} (CGPA: {candidate.education.cgpa})
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{app.role}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>Venue: {app.appliedLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {candidate.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk.id}
                            className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700 font-medium"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[11px] text-slate-600 line-clamp-2 max-w-xs leading-tight">
                        {waitlist.expectedNextSteps}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedWaitlistApp(app)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        Promote to Slot
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROMOTE MODAL */}
      {selectedWaitlistApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Promote Waitlisted Candidate</h3>
                <p className="text-xs text-slate-500">{selectedWaitlistApp.role}</p>
              </div>
              <button onClick={() => setSelectedWaitlistApp(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handlePromoteCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Interview Date</label>
                <input
                  type="text"
                  required
                  value={promotedDate}
                  onChange={(e) => setPromotedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Interview Time Window</label>
                <input
                  type="text"
                  required
                  value={promotedTime}
                  onChange={(e) => setPromotedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Venue & Panel</label>
                <input
                  type="text"
                  required
                  value={promotedVenue}
                  onChange={(e) => setPromotedVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Promoting this candidate will transition their status to <strong>CONFIRMED</strong>, allocate the interview slot, generate their tokenized In-App QR Pass, and dispatch a real-time notification to their mobile app.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
              >
                Confirm Promotion & Allocate Slot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
