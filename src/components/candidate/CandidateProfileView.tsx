import React, { useState } from 'react';
import { CandidateProfile, HiringDrive } from '../../types/recruitment';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FileText,
  MapPin,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Download,
  BookOpen,
  ArrowRight,
  Upload,
  ExternalLink,
  ShieldCheck,
  Edit3,
  Target,
  ChevronRight
} from 'lucide-react';

interface CandidateProfileViewProps {
  profile: CandidateProfile;
  hiringDrives: HiringDrive[];
  onNavigateToArena?: () => void;
  onLogout?: () => void;
  onOpenScenarioSwitcher?: () => void;
}

interface EligibilityAssessmentResult {
  overallScore: number;
  driveTitle: string;
  isEligible: boolean;
  strengths: string[];
  gaps: string[];
  recommendedSkills: string[];
  recommendedArenaProblems: string[];
  generatedAt: string;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  profile,
  hiringDrives,
  onNavigateToArena,
  onLogout,
  onOpenScenarioSwitcher
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'ai_eligibility'>('profile');
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<EligibilityAssessmentResult | null>(null);

  // Run AI-Based Eligibility Assessment against flagship Graduate Software Engineer drive
  const handleRunAiEligibilityCheck = () => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      const targetDrive = hiringDrives[0] || {
        title: 'Graduate Software Engineer 2026',
        minimumCgpa: 7.0
      };

      const candidateCgpa = profile.education?.cgpa || 8.4;
      const isCgpaEligible = candidateCgpa >= targetDrive.minimumCgpa;

      setAssessmentResult({
        overallScore: isCgpaEligible ? 92 : 68,
        driveTitle: targetDrive.title,
        isEligible: isCgpaEligible,
        strengths: [
          `Academic Excellence: CGPA of ${candidateCgpa}/10 surpasses the minimum required threshold of ${targetDrive.minimumCgpa}.`,
          `Verified Skills: Tier 3 Assessment-Verified credentials in Data Structures & Core Java.`,
          `Engineering Degree: ${profile.education?.degree} in ${profile.education?.branch} aligns directly with Excelsoft Engineering qualification criteria.`,
          `Project Portfolio: Strong repository projects demonstrating scalable Full-Stack architecture.`
        ],
        gaps: [
          `Cloud Infrastructure: Basic AWS / Docker experience recommended for Cloud EdTech product lines.`,
          `Dynamic Programming: 2 edge cases failed in recent assessments; practice sliding window and memoization in Arena.`
        ],
        recommendedSkills: ['Docker Containerization', 'AWS Cloud Basics', 'Dynamic Programming', 'Redis Caching'],
        recommendedArenaProblems: [
          'Longest Substring Without Repeating Characters',
          'Trapping Rain Water',
          'Round Robin Process Scheduler Simulation'
        ],
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setActiveProfileTab('ai_eligibility');
    }, 1200);
  };

  const getTierBadge = (level: string) => {
    switch (level) {
      case 'hr_verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'assessment_verified':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'resume_extracted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. PROFILE HEADER BANNER & TABS                                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-500/20">
            {profile.fullName ? profile.fullName.charAt(0) : 'R'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile.fullName || 'Rohan Sharma'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {profile.education?.degree} in {profile.education?.branch} • {profile.education?.institution || 'VTU Campus Center'}
            </p>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveProfileTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeProfileTab === 'profile'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              13-Point Profile
            </button>
            <button
              onClick={() => {
                if (!assessmentResult) {
                  handleRunAiEligibilityCheck();
                } else {
                  setActiveProfileTab('ai_eligibility');
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProfileTab === 'ai_eligibility'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Eligibility Check</span>
            </button>
          </div>

          <button
            onClick={handleRunAiEligibilityCheck}
            disabled={isAssessing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAssessing ? 'Analyzing Profile...' : 'Run Eligibility Check'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB A: COMPREHENSIVE 13-POINT PROFILE VIEW                             */}
      {/* ========================================================================= */}
      {activeProfileTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Personal, Contact, Academic, Qualifications (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Personal & Contact Information */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-indigo-600" />
                <span>1 & 2. Personal & Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <strong className="text-slate-800">{profile.fullName || 'Rohan Sharma'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <strong className="text-slate-800">{profile.email || 'rohan.sharma.vtu@gmail.com'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Phone</span>
                  <strong className="text-slate-800">{profile.phone || '+91 98450 12345'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Current Location</span>
                  <strong className="text-slate-800">{profile.currentLocation || 'Mysuru, Karnataka'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Candidate Type</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold uppercase font-mono text-[10px]">
                    {profile.candidateType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Preferred Locations</span>
                  <strong className="text-slate-800">{profile.preferredLocations?.join(', ') || 'Mysuru, Bengaluru, Hyderabad'}</strong>
                </div>
              </div>
            </div>

            {/* 3 & 4. Academic Details & Educational Qualifications */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>3 & 4. Academic & Educational Qualifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Degree & Branch</span>
                  <strong className="text-slate-800">{profile.education?.degree} in {profile.education?.branch}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">College / Institution</span>
                  <strong className="text-slate-800">{profile.education?.institution || 'VTU Campus Center, Mysuru'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Cumulative CGPA</span>
                  <strong className="text-indigo-600 text-sm font-black font-mono">{profile.education?.cgpa} / 10.0</strong>
                  <span className="text-[10px] text-emerald-600 ml-1.5 font-bold">✓ Verified</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Graduation Year</span>
                  <strong className="text-slate-800">{profile.education?.graduationYear || 2026}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">10th Grade Percentage</span>
                  <strong className="text-slate-800">92.4% (ICSE)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">12th / Pre-University</span>
                  <strong className="text-slate-800">89.6% (Karnataka State Board)</strong>
                </div>
              </div>
            </div>

            {/* 7 & 8. Projects & Internships */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>7 & 8. Projects & Internship Experience</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Cloud-Based Real-Time Assessment Engine</span>
                    <span className="text-[10px] font-mono text-indigo-600">React • Node.js • SQLite</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Designed an offline-first learning test engine capable of running automated coding test cases with instant scorecards and Zero-Trust credential evaluation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Software Engineering Intern — EdTech Systems</span>
                    <span className="text-[10px] text-slate-400">Summer 2025 (3 Months)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Engineered RESTful microservice APIs in Spring Boot and optimized SQL query execution times by 32% via composite B-Tree indexing.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Skills (4-Tier), Resume, Preferences (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 5 & 6. Technical Skills with 4-Tier Verification */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>5 & 6. 4-Tier Verified Skills</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Tamper-Proof</span>
              </div>

              <div className="space-y-2">
                {profile.skills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800">{skill.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getTierBadge(
                        skill.verificationLevel
                      )}`}
                    >
                      {skill.verificationLevel.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
                Skills are evaluated progressively from <em>Self-Declared</em> to <em>Assessment-Verified</em> via the Coding Arena and proctored technical evaluations.
              </div>
            </div>

            {/* 9 & 10. Certifications & Resume */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>9 & 10. Resume & Certifications</span>
              </h3>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">{profile.resume?.fileName || 'Rohan_Sharma_Resume_2026.pdf'}</strong>
                    <span className="text-[11px] text-slate-500">{profile.resume?.fileSize || '1.8 MB'} • Uploaded</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Downloading official verified candidate resume...')}
                  className="p-2 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 cursor-pointer shadow-2xs"
                  title="Download Resume"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="font-bold block text-slate-800">Accredited Certifications:</span>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Oracle Certified Associate — Java SE 17</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>AWS Certified Cloud Practitioner</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* 11 & 12. Career Preferences */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                11 & 12. Career Preferences
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Role:</span>
                  <strong className="text-slate-800">Graduate Software Engineer</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Locations:</span>
                  <strong className="text-slate-800">Mysuru, Bengaluru</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Notice Period:</span>
                  <strong className="text-slate-800">Immediate (Campus Graduate)</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB B: AI-POWERED ELIGIBILITY ASSESSMENT REPORT                        */}
      {/* ========================================================================= */}
      {activeProfileTab === 'ai_eligibility' && assessmentResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 animate-fade-in">
          {/* Diagnostic Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Eligibility Diagnostic Report</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950">
                Evaluation for: {assessmentResult.driveTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Generated at {assessmentResult.generatedAt} using multi-factor profile & academic cross-verification.
              </p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-black text-indigo-600 font-mono">
                {assessmentResult.overallScore}%
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Eligible for Shortlisting</span>
              </span>
            </div>
          </div>

          {/* Strengths vs Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Candidate Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {assessmentResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps & Weaknesses */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Identified Eligibility Gaps & Focus Areas</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {assessmentResult.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Recommended Arena Practice Problems */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Recommended Arena Coding Challenges to Bridge Gaps</h4>
              </div>
              <button
                onClick={onNavigateToArena}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Go to Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {assessmentResult.recommendedArenaProblems.map((probName, idx) => (
                <div
                  key={idx}
                  onClick={onNavigateToArena}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer shadow-2xs group"
                >
                  <span className="group-hover:text-indigo-600 transition-colors">{probName}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
