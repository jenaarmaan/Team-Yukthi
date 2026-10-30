import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Search,
  X
} from 'lucide-react';

export const AdminStandby: React.FC = () => {
  const standbys = recruitmentService.getAllStandbyApplications();
  const allCandidates = recruitmentService.getAllCandidates();
  const drives = recruitmentService.getHiringDrives();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(allCandidates[0]?.profile.id || '');
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || '');
  const [selectedLocation, setSelectedLocation] = useState('Mysuru Campus');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const handleSendStandbyInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = recruitmentService.sendStandbyInvitationToCandidate(
      selectedCandidateId,
      selectedDriveId,
      selectedLocation
    );

    if (ok) {
      setInviteSuccess('Standby availability invitation successfully dispatched! Candidate received in-app notification.');
      setTimeout(() => {
        setInviteSuccess(null);
        setShowInviteModal(false);
      }, 1400);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Proactive Standby Pool Management</h2>
          <p className="text-xs text-slate-500">Dedicated reserve pool of pre-qualified talent ready for dynamic slot replacement</p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all self-start"
        >
          <Sparkles className="w-4 h-4" />
          <span>Invite Candidate to Standby</span>
        </button>
      </div>

      {inviteSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{inviteSuccess}</span>
        </div>
      )}

      {/* Standby Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate & Background</th>
                <th className="py-3 px-4">Role & Drive</th>
                <th className="py-3 px-4">Standby Location</th>
                <th className="py-3 px-4">Key Verified Skills</th>
                <th className="py-3 px-4 text-center">Invitation State</th>
                <th className="py-3 px-4">Response Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {standbys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No candidates currently in the proactive standby pool.
                  </td>
                </tr>
              ) : (
                standbys.map(({ app, candidate, standby }) => {
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{candidate.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {candidate.education.degree} ({candidate.education.branch})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.role}</div>
                        <div className="text-[10px] text-slate-400">{standby.company}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{standby.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {candidate.skills.slice(0, 3).map((sk) => (
                            <span
                              key={sk.id}
                              className="bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] text-indigo-700 font-medium"
                            >
                              {sk.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            standby.invitationStatus === 'replacement_offered'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : standby.invitationStatus === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : standby.invitationStatus === 'confirmed_slot'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : standby.invitationStatus === 'declined'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {standby.invitationStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {standby.potentialSlotDate || 'Within 48h Window'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE CANDIDATE TO STANDBY MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Invite Candidate to Standby Pool</h3>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSendStandbyInvitation} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Candidate</label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                >
                  {allCandidates.map((c) => (
                    <option key={c.profile.id} value={c.profile.id}>
                      {c.profile.fullName} ({c.profile.candidateType} - {c.profile.currentLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Hiring Drive</label>
                <select
                  value={selectedDriveId}
                  onChange={(e) => setSelectedDriveId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                >
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>{d.role} ({d.locations.join('/')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Standby Venue / Facility</label>
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-[11px] text-indigo-900 leading-relaxed">
                Candidate will receive an in-app <strong>Standby Pool Invitation</strong> prompting them to accept or decline availability for replacement openings.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
              >
                Send Standby Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
