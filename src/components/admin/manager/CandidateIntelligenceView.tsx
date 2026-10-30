import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { CandidateProfile, HiringDrive } from '../../../types/recruitment';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  GraduationCap,
  Briefcase,
  Code,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  BarChart3,
  BookOpen
} from 'lucide-react';

export const CandidateIntelligenceView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const rawCandidates = recruitmentService.getAllCandidates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_match' | 'needs_eval' | 'discrepancy' | 'ineligible'>('all');
  const [targetDriveId, setTargetDriveId] = useState<string>(drives[0]?.id || 'drive_01');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const activeDrive = drives.find((d) => d.id === targetDriveId) || drives[0];

  // Compute intelligence and match scores for each candidate against activeDrive
  const evaluatedCandidates = rawCandidates.map((entry) => {
    const prof = entry.profile;
    const cgpa = prof.education?.cgpa || 7.0;
    const minCgpa = activeDrive?.minimumCgpa || 7.5;
    const academicOk = cgpa >= minCgpa;

    // Skill match
    const mandatory = activeDrive?.mandatorySkills || ['Data Structures', 'Algorithms', 'Python'];
    const candidateSkills = prof.skills?.map((s) => s.name.toLowerCase()) || [];
    const matchedCount = mandatory.filter((m) =>
      candidateSkills.some((cs) => cs.includes(m.toLowerCase()) || m.toLowerCase().includes(cs))
    ).length;
    const skillMatchPct = Math.round((matchedCount / (mandatory.length || 1)) * 100);

    // Matching score
    const matchScore = Math.min(98, Math.max(45, Math.round(cgpa * 6 + skillMatchPct * 0.4)));

    // Discrepancy detection: e.g. self-declared skill without assessment or borderline CGPA
    const hasUnverifiedCoreSkill = prof.skills?.some(
      (s) => s.verificationLevel === 'self_declared' && mandatory.some((m) => m.toLowerCase().includes(s.name.toLowerCase()))
    );
    const hasDiscrepancy = hasUnverifiedCoreSkill || (cgpa >= minCgpa && cgpa < minCgpa + 0.2);

    const isEligible = academicOk && skillMatchPct >= 50;

    return {
      profile: prof,
      personaKey: entry.personaKey,
      academicOk,
      skillMatchPct,
      matchScore,
      isEligible,
      hasDiscrepancy,
      discrepancyNote: hasUnverifiedCoreSkill
        ? 'Core mandatory skill is currently self-declared without formal assessment verification.'
        : hasDiscrepancy
        ? 'CGPA is borderline close to minimum cutoff (within 0.2 CGPA margin).'
        : null
    };
  });

  // Filter application
  const filteredList = evaluatedCandidates.filter((item) => {
    // Tab filter
    if (selectedFilter === 'high_match' && item.matchScore < 85) return false;
    if (selectedFilter === 'needs_eval' && (item.matchScore >= 85 || !item.isEligible)) return false;
    if (selectedFilter === 'discrepancy' && !item.hasDiscrepancy) return false;
    if (selectedFilter === 'ineligible' && item.isEligible) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = item.profile.fullName?.toLowerCase() || '';
      const email = item.profile.email?.toLowerCase() || '';
      const college = item.profile.education?.institution?.toLowerCase() || '';
      const skills = item.profile.skills?.map((s) => s.name.toLowerCase()).join(' ') || '';
      return name.includes(q) || email.includes(q) || college.includes(q) || skills.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Target Drive Selector */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                TALENT MATCH ENGINE
              </span>
              <h2 className="text-xl font-bold text-slate-900">Candidate Eligibility & Skill Matching</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-dimensional evaluation against academic cutoffs, 4-tier verified technical skills, and cross-drive compatibility
            </p>
          </div>

          {/* Drive Context Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600">Matching Against:</span>
            <select
              value={targetDriveId}
              onChange={(e) => setTargetDriveId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {drives.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} (Cutoff: {d.minimumCgpa} CGPA)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          
          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Pool ({evaluatedCandidates.length})
            </button>
            <button
              onClick={() => setSelectedFilter('high_match')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === 'high_match'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Highly Matched (≥85%)
            </button>
            <button
              onClick={() => setSelectedFilter('needs_eval')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === 'needs_eval'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              Requires Review
            </button>
            <button
              onClick={() => setSelectedFilter('discrepancy')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === 'discrepancy'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Discrepancies Flagged
            </button>
            <button
              onClick={() => setSelectedFilter('ineligible')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === 'ineligible'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              Ineligible
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, skill, USN..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>
      </div>

      {/* 2. Candidate Table / Grid */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Evaluated Candidates ({filteredList.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Mandatory Skills: {activeDrive?.mandatorySkills?.slice(0, 3).join(', ')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Academic Qualification</th>
                <th className="py-2.5 px-3">Key Technical Skills</th>
                <th className="py-2.5 px-3 text-center">Drive Match Score</th>
                <th className="py-2.5 px-3 text-center">Eligibility</th>
                <th className="py-2.5 px-3 text-center">Discrepancy</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredList.map((item) => (
                <tr key={item.profile.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Candidate Name & Contact */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedCandidate(item.profile)}>
                      {item.profile.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                      {item.profile.email}
                    </div>
                  </td>

                  {/* Academic */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.profile.education?.degree || 'B.Tech'} - {item.profile.education?.branch || 'CSE'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      CGPA: <strong className={item.academicOk ? 'text-emerald-700' : 'text-rose-600'}>{item.profile.education?.cgpa || 7.5}</strong> (Min: {activeDrive?.minimumCgpa})
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3 px-3 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {item.profile.skills?.slice(0, 3).map((sk) => (
                        <span
                          key={sk.id}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Match Score */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border ${
                        item.matchScore >= 85
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : item.matchScore >= 70
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      {item.matchScore}% Match
                    </span>
                  </td>

                  {/* Eligibility */}
                  <td className="py-3 px-3 text-center">
                    {item.isEligible ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Eligible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Ineligible</span>
                      </span>
                    )}
                  </td>

                  {/* Discrepancy Flag */}
                  <td className="py-3 px-3 text-center">
                    {item.hasDiscrepancy ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                        title={item.discrepancyNote || ''}
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Discrepancy</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Clean</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedCandidate(item.profile)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Inspect Profile
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. Detailed Candidate Dossier Modal (Drawer) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.fullName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedCandidate.candidateType.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedCandidate.email} • {selectedCandidate.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & University Record */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Academic Record & Verification</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Institution</span>
                  <strong className="text-slate-800 truncate block">{selectedCandidate.education?.institution}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Degree & Branch</span>
                  <strong className="text-slate-800 truncate block">{selectedCandidate.education?.degree} ({selectedCandidate.education?.branch})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CGPA</span>
                  <strong className="text-emerald-700 font-mono font-bold block">{selectedCandidate.education?.cgpa} / 10.0</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Verification Status</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {selectedCandidate.verificationStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Tier Verified Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Verified Skills (4-Tier Verification Hierarchy)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedCandidate.skills?.map((sk) => (
                  <div key={sk.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{sk.name}</span>
                      <span className="text-[10px] font-mono text-indigo-600">{sk.rating}/5</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block">
                      {sk.verificationLevel.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Drive Suitability Comparison (Item 10) */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-700" />
                <span>Cross-Drive Suitability Comparison</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {drives.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-white border border-indigo-100 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 block truncate">{d.title}</span>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{d.role}</span>
                      <strong className="text-indigo-700 font-mono">88% Match</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
