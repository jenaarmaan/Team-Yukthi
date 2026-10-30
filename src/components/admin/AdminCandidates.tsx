import React, { useState } from 'react';
import { CandidateProfile, SkillVerificationLevel, Application } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import { StatusBadge, CandidateTypeBadge } from '../common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileText,
  MapPin,
  GraduationCap,
  Sparkles,
  MessageSquare,
  Award,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';

export const AdminCandidates: React.FC = () => {
  const candidateEntries = recruitmentService.getAllCandidates();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // all, fresher, experienced
  const [filterVerification, setFilterVerification] = useState<string>('all'); // all, verified, action_required
  const [selectedCandidate, setSelectedCandidate] = useState<{
    profile: CandidateProfile;
    personaKey: string;
    applications: Application[];
  } | null>(null);

  // Internal note input
  const [newNoteText, setNewNoteText] = useState('');

  // Filter candidates
  const filteredCandidates = candidateEntries.filter((entry) => {
    const p = entry.profile;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || p.candidateType === filterType;
    const matchesVerification =
      filterVerification === 'all' || p.verificationStatus === filterVerification;

    return matchesSearch && matchesType && matchesVerification;
  });

  const handleUpgradeSkill = (candidateId: string, skillId: string, level: SkillVerificationLevel) => {
    recruitmentService.verifyCandidateSkill(candidateId, skillId, level);
    // Refresh local selectedCandidate
    if (selectedCandidate && selectedCandidate.profile.id === candidateId) {
      const refreshed = recruitmentService.getAllCandidates().find((c) => c.profile.id === candidateId);
      if (refreshed) setSelectedCandidate(refreshed);
    }
  };

  const handleSetProfileVerification = (candidateId: string, status: 'verified' | 'action_required') => {
    recruitmentService.updateCandidateProfileVerification(candidateId, status);
    if (selectedCandidate && selectedCandidate.profile.id === candidateId) {
      const refreshed = recruitmentService.getAllCandidates().find((c) => c.profile.id === candidateId);
      if (refreshed) setSelectedCandidate(refreshed);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteText.trim()) return;

    recruitmentService.addInternalCandidateNote(selectedCandidate.profile.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Candidate Database & Verification Queue</h2>
          <p className="text-xs text-slate-500">Centralized candidate repository, skill validation matrix, and internal audit notes</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, skills..."
              className="pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="all">All Types</option>
            <option value="fresher">Freshers</option>
            <option value="experienced">Experienced</option>
          </select>

          <select
            value={filterVerification}
            onChange={(e) => setFilterVerification(e.target.value)}
            className="px-2.5 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="all">All Verifications</option>
            <option value="verified">Verified Profiles</option>
            <option value="action_required">Action Required</option>
          </select>
        </div>
      </div>

      {/* Candidates Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate & Contact</th>
                <th className="py-3 px-4">Type & Education</th>
                <th className="py-3 px-4">Locations (Base / Pref)</th>
                <th className="py-3 px-4">Verified Skills</th>
                <th className="py-3 px-4 text-center">Verification</th>
                <th className="py-3 px-4 text-center">Active Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCandidates.map((entry) => {
                const p = entry.profile;
                const primaryApp = entry.applications[0];
                const hrVerifiedSkills = p.skills.filter((s) => s.verificationLevel === 'hr_verified' || s.verificationLevel === 'assessment_verified');

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.fullName}</div>
                      <div className="text-[11px] text-slate-400">{p.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.phone}</div>
                    </td>

                    {/* Type & Education */}
                    <td className="py-3 px-4">
                      <CandidateTypeBadge type={p.candidateType} />
                      <div className="text-[11px] font-medium text-slate-800 mt-1">
                        {p.education.degree} in {p.education.branch}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        CGPA: <strong className="text-slate-800">{p.education.cgpa}</strong> ({p.education.graduationYear})
                      </div>
                    </td>

                    {/* Locations */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-bold text-slate-800">{p.currentLocation}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{p.preferredLocations.join(', ')}</span>
                      </div>
                    </td>

                    {/* Skills Summary */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {p.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk.id}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              sk.verificationLevel === 'hr_verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : sk.verificationLevel === 'assessment_verified'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sk.name}
                          </span>
                        ))}
                        {p.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-mono">+{p.skills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.verificationStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.verificationStatus === 'verified' ? 'Verified' : 'Action Required'}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-4 text-center">
                      {primaryApp ? (
                        <StatusBadge status={primaryApp.status} size="sm" />
                      ) : (
                        <span className="text-[11px] text-slate-400">Registered</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCandidate(entry)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CANDIDATE DETAIL DRAWER & VERIFICATION MATRIX */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base">
                  {selectedCandidate.profile.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedCandidate.profile.fullName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{selectedCandidate.profile.email}</span>
                    <span>·</span>
                    <CandidateTypeBadge type={selectedCandidate.profile.candidateType} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* Profile Verification Decision Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Profile Verification Status</div>
                  <div className="text-[11px] text-slate-500">
                    Current: <strong className="capitalize">{selectedCandidate.profile.verificationStatus}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSetProfileVerification(selectedCandidate.profile.id, 'verified')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Verified</span>
                  </button>
                  <button
                    onClick={() => handleSetProfileVerification(selectedCandidate.profile.id, 'action_required')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                  >
                    Flag Action
                  </button>
                </div>
              </div>

              {/* Education & CGPA */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Academic Credentials
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">{selectedCandidate.profile.education.institution}</div>
                  <div className="text-indigo-700 font-semibold">
                    {selectedCandidate.profile.education.degree} in {selectedCandidate.profile.education.branch}
                  </div>
                  <div className="flex justify-between items-center text-slate-600 pt-1">
                    <span>Year: <strong>{selectedCandidate.profile.education.graduationYear}</strong></span>
                    <span>CGPA: <strong className="font-mono text-slate-900">{selectedCandidate.profile.education.cgpa} / 10</strong></span>
                  </div>
                </div>
              </div>

              {/* Multi-Location Preferences */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Candidate Venue Preferences
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div>
                    <span className="text-slate-500">Current Base City: </span>
                    <strong className="text-slate-800">{selectedCandidate.profile.currentLocation}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Approved Preferred Venues:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.profile.preferredLocations.map((loc) => (
                        <span key={loc} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-TIER SKILLS MATRIX & UPGRADE CONTROLS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Technical Skills & Verification Tiers
                  </h4>
                  <span className="text-[10px] text-slate-400">Click to ratify tier</span>
                </div>

                <div className="space-y-2">
                  {selectedCandidate.profile.skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{sk.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{sk.category}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <select
                          value={sk.verificationLevel}
                          onChange={(e) =>
                            handleUpgradeSkill(
                              selectedCandidate.profile.id,
                              sk.id,
                              e.target.value as SkillVerificationLevel
                            )
                          }
                          className="px-2 py-1 rounded border border-slate-200 text-[11px] font-semibold text-slate-700 bg-slate-50 focus:outline-none"
                        >
                          <option value="self_declared">Self Declared</option>
                          <option value="resume_extracted">Resume Extracted</option>
                          <option value="assessment_verified">Assessment Verified</option>
                          <option value="hr_verified">HR Verified ✓</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume File Details */}
              {selectedCandidate.profile.resume && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Uploaded Resume & Parsed Telemetry
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{selectedCandidate.profile.resume.fileName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{selectedCandidate.profile.resume.fileSize}</span>
                    </div>
                    {selectedCandidate.profile.resume.parsedData && (
                      <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                        {selectedCandidate.profile.resume.parsedData.summary}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* INTERNAL HR AUDIT NOTES */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Internal HR Notes & Audit Trail
                </h4>

                <div className="space-y-2 mb-3">
                  {recruitmentService
                    .getInternalCandidateNotes(selectedCandidate.profile.id)
                    .map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700">{note.authorName} ({note.authorRole})</span>
                          <span className="font-mono">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-800 text-[11px]">{note.note}</p>
                      </div>
                    ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal reviewer evaluation note..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
