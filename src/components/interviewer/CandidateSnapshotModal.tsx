import React from 'react';
import { InterviewerCandidateSnapshot, SkillVerificationLevel } from '../../types/recruitment';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Play,
  CheckCircle2
} from 'lucide-react';

interface CandidateSnapshotModalProps {
  snapshot: InterviewerCandidateSnapshot;
  onClose: () => void;
  onStartInterview?: () => void;
  onOpenScorecard?: () => void;
  onDeclareConflict?: () => void;
}

export const CandidateSnapshotModal: React.FC<CandidateSnapshotModalProps> = ({
  snapshot,
  onClose,
  onStartInterview,
  onOpenScorecard,
  onDeclareConflict
}) => {
  const renderSkillBadge = (skill: { name: string; verificationLevel: SkillVerificationLevel; rating?: number }) => {
    switch (skill.verificationLevel) {
      case 'hr_verified':
        return (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{skill.name}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.2 rounded">
              HR Verified
            </span>
          </span>
        );
      case 'assessment_verified':
        return (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{skill.name}</span>
            <span className="text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100/60 px-1.5 py-0.2 rounded">
              Assessed
            </span>
          </span>
        );
      case 'resume_extracted':
        return (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>{skill.name}</span>
            <span className="text-[10px] uppercase font-bold text-sky-800 bg-sky-100/60 px-1.5 py-0.2 rounded">
              Resume Extracted
            </span>
          </span>
        );
      case 'self_declared':
      default:
        return (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
          >
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{skill.name}</span>
            <span className="text-[10px] uppercase font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded">
              Self Declared
            </span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Interviewer Candidate Snapshot
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 uppercase">
              {snapshot.candidateType}
            </span>
          </div>

          <h2 className="text-xl font-bold">{snapshot.fullName}</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Applying for <span className="font-semibold text-white">{snapshot.role}</span> &bull; {snapshot.hiringDriveTitle}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-300" />
              <span>{snapshot.currentLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              <span>{snapshot.slotInfo.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>{snapshot.slotInfo.time}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {snapshot.slotInfo.attendanceVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Desk Checked-In</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px]">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Awaiting Desk Check-in</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Interviewer Privacy Guard Active:</strong> Information presented here is authorized strictly for technical evaluation. Confidential recruiter comments and internal HR notes are sequestered under corporate data protection policy.
            </span>
          </div>

          {/* Academic Background */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span>Academic Credentials & Eligibility</span>
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Degree & Branch</span>
                <span className="font-bold text-slate-800">
                  {snapshot.education.degree} in {snapshot.education.branch}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Institution</span>
                <span className="font-semibold text-slate-800">{snapshot.education.institution}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CGPA / Year</span>
                <span className="font-bold text-indigo-600">
                  {snapshot.education.cgpa.toFixed(2)} CGPA &bull; {snapshot.education.graduationYear}
                </span>
              </div>
            </div>
          </div>

          {/* Assessment Benchmarks */}
          {snapshot.assessmentScores && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Authorized Online Assessment Results</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[11px] font-semibold text-indigo-600 block">DSA & Problem Solving</span>
                  <span className="text-xl font-extrabold text-indigo-950 font-mono">
                    {snapshot.assessmentScores.codingPercentile}th %ile
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[11px] font-semibold text-emerald-600 block">Technical Score</span>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">
                    {snapshot.assessmentScores.technicalScore}/100
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Benchmarking Rating</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">
                    {snapshot.assessmentScores.problemSolvingRating}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4-Tier Skill Verification Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Skills & 4-Tier Verification Matrix</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Notice badge color for proof source
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {snapshot.skills.map((s) => renderSkillBadge(s))}
            </div>
          </div>

          {/* Work Experience if applicable */}
          {snapshot.workExperience && snapshot.workExperience.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span>Professional Experience</span>
              </h3>
              <div className="space-y-3">
                {snapshot.workExperience.map((exp, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h4>
                      <span className="text-[11px] font-medium text-slate-500">{exp.durationMonths} months</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{exp.organization}</p>
                    <p className="text-xs text-slate-700 mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Snapshot */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Resume File & Summary</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">{snapshot.resumeFileName}</span>
                  <span className="text-[11px] text-slate-500 block">Verified cloud storage object</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Opening ${snapshot.resumeFileName} from secured Cloud Storage.`)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDeclareConflict}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors shadow-2xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Declare Conflict of Interest</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {onOpenScorecard && (
              <button
                type="button"
                onClick={onOpenScorecard}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs shadow-2xs"
              >
                Open Scorecard
              </button>
            )}
            {onStartInterview && (
              <button
                type="button"
                onClick={onStartInterview}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter Execution Room</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

