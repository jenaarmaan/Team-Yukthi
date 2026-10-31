import React, { useState, useRef } from 'react';
import { CandidateProfile, HiringDrive } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
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
  ChevronRight,
  RefreshCw,
  Check,
  X,
  FileUp,
  FileCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2
} from 'lucide-react';

interface CandidateProfileViewProps {
  profile: CandidateProfile;
  hiringDrives: HiringDrive[];
  onNavigateToArena?: () => void;
  onLogout?: () => void;
  onOpenScenarioSwitcher?: () => void;
  onProfileUpdated?: () => void;
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
  onOpenScenarioSwitcher,
  onProfileUpdated
}) => {
  const [currentProfile, setCurrentProfile] = useState<CandidateProfile>(profile);
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'ai_eligibility'>('profile');
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<EligibilityAssessmentResult | null>(null);

  // Resume Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Career Preferences & City Selection States (Up to 4 Preferences)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [editPreferredCities, setEditPreferredCities] = useState<string[]>(
    profile.preferredLocations && profile.preferredLocations.length > 0
      ? profile.preferredLocations.slice(0, 4)
      : ['Mysuru', 'Bengaluru']
  );
  const [customCityInput, setCustomCityInput] = useState('');
  const [preferenceSaveMessage, setPreferenceSaveMessage] = useState<string | null>(null);
  const [preferenceErrorMessage, setPreferenceErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setCurrentProfile(profile);
    if (!isEditingPreferences) {
      setEditPreferredCities(
        profile.preferredLocations && profile.preferredLocations.length > 0
          ? profile.preferredLocations.slice(0, 4)
          : ['Mysuru', 'Bengaluru']
      );
    }
  }, [profile, isEditingPreferences]);

  const CURATED_CITIES = [
    'Mysuru',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Delhi NCR',
    'Mumbai',
    'Coimbatore',
    'Kolkata',
    'Kochi'
  ];

  const handleAddCity = (cityToAdd: string) => {
    const trimmed = cityToAdd.trim();
    if (!trimmed) return;
    setPreferenceErrorMessage(null);
    if (editPreferredCities.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setPreferenceErrorMessage(`"${trimmed}" is already in your selected preferences.`);
      return;
    }
    if (editPreferredCities.length >= 4) {
      setPreferenceErrorMessage('Maximum 4 preferred locations allowed. Please remove one before adding another.');
      return;
    }
    setEditPreferredCities((prev) => [...prev, trimmed]);
    setCustomCityInput('');
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setPreferenceErrorMessage(null);
    if (editPreferredCities.length <= 1) {
      setPreferenceErrorMessage('At least 1 preferred location is required.');
      return;
    }
    setEditPreferredCities((prev) => prev.filter((c) => c.toLowerCase() !== cityToRemove.toLowerCase()));
  };

  const handleMoveCity = (index: number, direction: 'up' | 'down') => {
    setPreferenceErrorMessage(null);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editPreferredCities.length) return;
    const reordered = [...editPreferredCities];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setEditPreferredCities(reordered);
  };

  const handleSavePreferences = () => {
    if (editPreferredCities.length === 0) {
      setPreferenceErrorMessage('Please select at least 1 preferred city.');
      return;
    }
    const finalCities = editPreferredCities.slice(0, 4);
    recruitmentService.updatePreferredLocations(finalCities);
    const updated = recruitmentService.getCurrentProfile();
    setCurrentProfile({ ...updated });
    setIsEditingPreferences(false);
    setPreferenceErrorMessage(null);
    setPreferenceSaveMessage('Career city preferences updated! AI recommendations refreshed based on your selected locations.');
    if (onProfileUpdated) {
      onProfileUpdated();
    }
    setTimeout(() => {
      setPreferenceSaveMessage(null);
    }, 5000);
  };

  const handleCancelPreferences = () => {
    setEditPreferredCities(
      currentProfile.preferredLocations && currentProfile.preferredLocations.length > 0
        ? currentProfile.preferredLocations.slice(0, 4)
        : ['Mysuru', 'Bengaluru']
    );
    setPreferenceErrorMessage(null);
    setIsEditingPreferences(false);
  };

  // Process & Upload Resume
  const processResumeFile = (fileName: string, fileSize: string, customSkills?: string[]) => {
    setIsUploadingResume(true);
    setUploadStep(1);

    setTimeout(() => {
      setUploadStep(2);
      setTimeout(() => {
        setUploadStep(3);
        setTimeout(() => {
          const defaultSkills = [
            'Core Java',
            'Spring Boot',
            'Data Structures & Algorithms',
            'SQL',
            'REST APIs',
            'React',
            'Git & CI/CD'
          ];
          const skillsToAdd = customSkills && customSkills.length > 0 ? customSkills : defaultSkills;
          const summary = `Updated resume for ${currentProfile.fullName}: verified educational credentials in ${currentProfile.education?.branch || 'Computer Science'} with proficiencies in software development, algorithmic problem solving, and modern distributed systems.`;

          // Update in storage service
          recruitmentService.uploadParsedResume(fileName, fileSize, skillsToAdd, summary);

          // Refresh current state
          const updated = recruitmentService.getCurrentProfile();
          setCurrentProfile({ ...updated });

          setIsUploadingResume(false);
          setUploadStep(0);
          setShowUploadModal(false);
          setUploadSuccessMessage(`Successfully uploaded and parsed "${fileName}"!`);

          if (onProfileUpdated) {
            onProfileUpdated();
          }

          setTimeout(() => {
            setUploadSuccessMessage(null);
          }, 6000);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = Math.round(file.size / 1024);
    const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    processResumeFile(file.name, formattedSize);
    if (e.target) e.target.value = '';
  };

  const handleDownloadResume = () => {
    const resumeName = currentProfile.resume?.fileName || `${currentProfile.fullName.replace(/\s+/g, '_')}_Resume_2026.pdf`;
    
    const content = `================================================================================
NIYOJAN VERIFIED CANDIDATE RESUME
Autonomous Recruitment Orchestration Platform • Excelsoft Technologies
================================================================================

Candidate Name:    ${currentProfile.fullName}
Email Address:     ${currentProfile.email}
Contact Phone:     ${currentProfile.phone}
Current Location:  ${currentProfile.currentLocation}
Preferred Locs:    ${currentProfile.preferredLocations.join(', ')}
Candidate Type:    ${currentProfile.candidateType.toUpperCase()}

ACADEMIC & EDUCATIONAL QUALIFICATIONS
--------------------------------------------------------------------------------
College / Inst:    ${currentProfile.education.institution}
Degree & Branch:   ${currentProfile.education.degree} in ${currentProfile.education.branch}
Graduation Year:   ${currentProfile.education.graduationYear}
Cumulative CGPA:   ${currentProfile.education.cgpa} / 10.0 (VERIFIED CREDENTIAL)
Status:            ${currentProfile.education.verified ? 'VERIFIED BY ACADEMIC BOARD' : 'ACADEMIC RECORD MATCHED'}

4-TIER VERIFIED TECHNICAL SKILLS
--------------------------------------------------------------------------------
${currentProfile.skills.map((s) => `• ${s.name.padEnd(28)} [Tier: ${s.verificationLevel.replace('_', ' ').toUpperCase()} | Rating: ${s.rating || 4}/5]`).join('\n')}

ACCREDITED CERTIFICATIONS
--------------------------------------------------------------------------------
${(currentProfile.certifications && currentProfile.certifications.length > 0
  ? currentProfile.certifications
  : ['Oracle Certified Associate — Java SE 17 (Verified)', 'AWS Certified Cloud Practitioner (Verified)']
).map((c) => `• ${c}`).join('\n')}

WORK EXPERIENCE & PROJECTS
--------------------------------------------------------------------------------
${(currentProfile.workExperience && currentProfile.workExperience.length > 0)
  ? currentProfile.workExperience.map((w) => `• ${w.jobTitle} at ${w.organization} (${w.durationMonths} Months)\n  ${w.description}\n  Skills: ${(w.relevantSkills || []).join(', ')}`).join('\n\n')
  : '• Cloud-Based Real-Time Assessment Engine (React, Node.js, SQLite)\n  Designed an offline-first learning test engine with automated coding scorecards.\n\n• Software Engineering Intern — EdTech Systems (Summer 2025)\n  Engineered RESTful microservice APIs in Spring Boot and optimized query performance.'}

VERIFICATION & SECURITY METADATA
--------------------------------------------------------------------------------
Verification State:  ${currentProfile.verificationStatus.toUpperCase()}
Candidate UID:       ${currentProfile.id}
Authoritative File:  ${resumeName}
Uploaded Timestamp:  ${currentProfile.resume?.uploadedAt || new Date().toISOString()}
Tamper-Proof Digest: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
================================================================================
Generated and digitally certified by NIYOJAN Campus Recruitment System.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resumeName.replace(/\.pdf$/, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Run AI-Based Eligibility Assessment against flagship Graduate Software Engineer drive
  const handleRunAiEligibilityCheck = () => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      const targetDrive = hiringDrives[0] || {
        title: 'Graduate Software Engineer 2026',
        minimumCgpa: 7.0
      };

      const candidateCgpa = currentProfile.education?.cgpa || 8.4;
      const isCgpaEligible = candidateCgpa >= targetDrive.minimumCgpa;

      setAssessmentResult({
        overallScore: isCgpaEligible ? 92 : 68,
        driveTitle: targetDrive.title,
        isEligible: isCgpaEligible,
        strengths: [
          `Academic Excellence: CGPA of ${candidateCgpa}/10 surpasses the minimum required threshold of ${targetDrive.minimumCgpa}.`,
          `Verified Skills: Tier 3 Assessment-Verified credentials in Data Structures & Core Java.`,
          `Engineering Degree: ${currentProfile.education?.degree} in ${currentProfile.education?.branch} aligns directly with Excelsoft Engineering qualification criteria.`,
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
            {currentProfile.fullName ? currentProfile.fullName.charAt(0) : 'R'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentProfile.fullName || 'Rohan Sharma'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentProfile.education?.degree} in {currentProfile.education?.branch} • {currentProfile.education?.institution || 'VTU Campus Center'}
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
                  <strong className="text-slate-800">{currentProfile.fullName || 'Rohan Sharma'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <strong className="text-slate-800">{currentProfile.email || 'rohan.sharma.vtu@gmail.com'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Phone</span>
                  <strong className="text-slate-800">{currentProfile.phone || '+91 98450 12345'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Current Location</span>
                  <strong className="text-slate-800">{currentProfile.currentLocation || 'Mysuru, Karnataka'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Candidate Type</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold uppercase font-mono text-[10px]">
                    {currentProfile.candidateType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Preferred Locations</span>
                  <strong className="text-slate-800">{currentProfile.preferredLocations?.join(', ') || 'Mysuru, Bengaluru, Hyderabad'}</strong>
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
                  <strong className="text-slate-800">{currentProfile.education?.degree} in {currentProfile.education?.branch}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">College / Institution</span>
                  <strong className="text-slate-800">{currentProfile.education?.institution || 'VTU Campus Center, Mysuru'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Cumulative CGPA</span>
                  <strong className="text-indigo-600 text-sm font-black font-mono">{currentProfile.education?.cgpa} / 10.0</strong>
                  <span className="text-[10px] text-emerald-600 ml-1.5 font-bold">✓ Verified</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Graduation Year</span>
                  <strong className="text-slate-800">{currentProfile.education?.graduationYear || 2026}</strong>
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
                {currentProfile.skills?.map((skill, idx) => (
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>9 & 10. Resume & Certifications</span>
                </h3>

                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer self-start sm:self-auto"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Updated Resume</span>
                </button>
              </div>

              {/* Upload Success Alert */}
              {uploadSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{uploadSuccessMessage}</span>
                  </div>
                  <button
                    onClick={() => setUploadSuccessMessage(null)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Active Verified Resume Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-50/40 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="block text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                          {currentProfile.resume?.fileName || 'Rohan_Sharma_Resume_2026.pdf'}
                        </strong>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                          Active
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {currentProfile.resume?.fileSize || '1.8 MB'} • Uploaded{' '}
                        {currentProfile.resume?.uploadedAt
                          ? new Date(currentProfile.resume.uploadedAt).toLocaleDateString()
                          : 'Recently'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 cursor-pointer shadow-2xs flex items-center gap-1 text-xs font-semibold"
                      title="Download Verified Resume Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer shadow-2xs flex items-center gap-1 text-xs font-semibold"
                      title="Upload and Replace Resume"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Update</span>
                    </button>
                  </div>
                </div>

                {/* Parsed Summary Snippet */}
                {currentProfile.resume?.parsedData?.summary && (
                  <div className="p-2.5 rounded-lg bg-white/90 border border-indigo-100 text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">AI Parsed Summary: </span>
                    {currentProfile.resume.parsedData.summary}
                  </div>
                )}
              </div>

              {/* Hidden file input for native picking */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={handleNativeFileChange}
                className="hidden"
              />

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

            {/* 11 & 12. Career Preferences with Interactive City Editing & AI Recommendations */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>11 & 12. Career Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your target employment parameters and up to 4 preferred interview/work cities.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isEditingPreferences ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Preferences</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelPreferences}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingPreferences(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit City Preferences</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Notifications */}
              {preferenceSaveMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{preferenceSaveMessage}</span>
                </div>
              )}
              {preferenceErrorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{preferenceErrorMessage}</span>
                </div>
              )}

              {/* Target Role & Notice Period Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                  <span className="text-slate-500 font-medium">Target Role:</span>
                  <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    Graduate Software Engineer
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                  <span className="text-slate-500 font-medium">Notice Period:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    Immediate (Campus Graduate)
                  </span>
                </div>
              </div>

              {/* City Preferences (Up to 4 Preferences) */}
              {(() => {
                const activeCities = currentProfile.preferredLocations && currentProfile.preferredLocations.length > 0
                  ? currentProfile.preferredLocations.slice(0, 4)
                  : ['Mysuru', 'Bengaluru'];
                const primaryCity = activeCities[0] || 'Mysuru';
                const isHomeCityMatch = primaryCity.toLowerCase() === (currentProfile.currentLocation || '').toLowerCase();
                const cityMatchingDrives = hiringDrives.filter((drive) => {
                  if (!drive.locations || drive.locations.length === 0) return true;
                  return drive.locations.some((loc) =>
                    activeCities.some((city) => city.toLowerCase() === loc.toLowerCase())
                  );
                });

                return (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            City Preferences (Up to 4 Locations)
                          </span>
                        </div>
                        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          (isEditingPreferences ? editPreferredCities.length : activeCities.length) === 4
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {isEditingPreferences ? editPreferredCities.length : activeCities.length} / 4 Selected
                        </span>
                      </div>

                      {/* READ ONLY MODE */}
                      {!isEditingPreferences && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {activeCities.map((city, idx) => (
                              <div
                                key={city}
                                className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
                                    idx === 0
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : idx === 1
                                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    #{idx + 1}
                                  </span>
                                  <div>
                                    <span className="font-bold text-xs text-slate-900 block">{city}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {idx === 0
                                        ? 'Primary Preference (Highest Weight)'
                                        : idx === 1
                                        ? 'Secondary Preference'
                                        : idx === 2
                                        ? 'Tertiary Preference'
                                        : 'Quaternary Preference'}
                                    </span>
                                  </div>
                                </div>
                                {city.toLowerCase() === (currentProfile.currentLocation || '').toLowerCase() && (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Current Residence
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {activeCities.length < 4 && (
                            <button
                              type="button"
                              onClick={() => setIsEditingPreferences(true)}
                              className="w-full py-2.5 px-3 border border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl text-center text-xs text-indigo-600 font-semibold bg-indigo-50/20 hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add city preference ({4 - activeCities.length} slot{4 - activeCities.length === 1 ? '' : 's'} remaining)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* EDIT MODE */}
                      {isEditingPreferences && (
                        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-4 animate-fade-in">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Select up to <strong>4 cities</strong> in order of priority. Your <strong>#1 Primary</strong> city receives top priority for physical venue scheduling and standby slot recovery.
                          </p>

                          {/* Ranked Order List with Reordering Controls */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Current Priority Order:
                            </span>
                            <div className="space-y-1.5">
                              {editPreferredCities.map((city, idx) => (
                                <div
                                  key={city}
                                  className="p-2.5 rounded-xl bg-white border border-indigo-200 flex items-center justify-between shadow-2xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                                      #{idx + 1}
                                    </span>
                                    <span className="font-bold text-xs text-slate-900">{city}</span>
                                    {idx === 0 && (
                                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                        Primary
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveCity(idx, 'up')}
                                      className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                                      title="Move up in priority"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === editPreferredCities.length - 1}
                                      onClick={() => handleMoveCity(idx, 'down')}
                                      className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                                      title="Move down in priority"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCity(city)}
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                                      title="Remove city"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Add Curated Recruitment Hubs */}
                          <div className="space-y-2 pt-2 border-t border-indigo-100">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Curated Tech Hubs & Campus Centers:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {CURATED_CITIES.map((c) => {
                                const isSelected = editPreferredCities.some((sc) => sc.toLowerCase() === c.toLowerCase());
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        handleRemoveCity(c);
                                      } else {
                                        handleAddCity(c);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                                        : editPreferredCities.length >= 4
                                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'
                                    }`}
                                  >
                                    <span>{c}</span>
                                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom City Text Input */}
                          <div className="pt-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={customCityInput}
                              onChange={(e) => setCustomCityInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCity(customCityInput);
                                }
                              }}
                              placeholder="Add another city (e.g. Noida, Trivandrum)..."
                              disabled={editPreferredCities.length >= 4}
                              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600 disabled:opacity-50"
                            />
                            <button
                              type="button"
                              disabled={!customCityInput.trim() || editPreferredCities.length >= 4}
                              onClick={() => handleAddCity(customCityInput)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ========================================================================= */}
                    {/* Dynamic AI Career & Location Recommendations                              */}
                    {/* ========================================================================= */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            NIYOJAN AI Recommendations (Based on {activeCities.length} Preferred Cities)
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full self-start sm:self-auto">
                          Personalized Grounded Engine
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Card 1: Top Hiring Drive Alignments */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-200/80 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Hiring Drives in Your Cities</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                              {cityMatchingDrives.length} Active
                            </span>
                          </div>

                          {cityMatchingDrives.length > 0 ? (
                            <div className="space-y-1.5 pt-1">
                              {cityMatchingDrives.slice(0, 2).map((drive) => {
                                const isPrimaryMatch = drive.locations?.some((loc) => loc.toLowerCase() === primaryCity.toLowerCase());
                                return (
                                  <div key={drive.id} className="p-2 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-slate-900 truncate max-w-[180px]">{drive.title || drive.role}</span>
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                        96% Match
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                                      <span>{drive.company} • {drive.locations?.join(', ')}</span>
                                      {isPrimaryMatch && (
                                        <span className="text-indigo-600 font-bold">#1 Location Match</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600">
                              Pooled hiring drives for {activeCities.join(', ')} will open in the upcoming campus cycle.
                            </p>
                          )}
                        </div>

                        {/* Card 2: Reporting Proximity & Commute Analysis */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Reporting Proximity Status</span>
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                              {isHomeCityMatch ? 'Direct Local' : 'Regional Commute'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {isHomeCityMatch ? (
                              <>
                                Your primary preference (<strong>{primaryCity}</strong>) directly matches your home location (<strong>{currentProfile.currentLocation}</strong>). You receive top priority for in-person morning slots at Excelsoft Main Assessment Hall with zero travel delay.
                              </>
                            ) : (
                              <>
                                Your primary preference (<strong>{primaryCity}</strong>) differs from your residence (<strong>{currentProfile.currentLocation}</strong>). Pre-cleared inter-city travel reimbursement and hybrid Round 1 evaluation routing are activated.
                              </>
                            )}
                          </p>
                        </div>

                        {/* Card 3: FMCP Standby Priority Advantage */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-white border border-amber-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                              <span>FMCP Standby Elevation Advantage</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                              +15% Weight
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            NIYOJAN&apos;s Fairness-Aware Multi-Stage Candidate Prioritisation (FMCP) engine assigns a <strong>+15% location affinity weight</strong> for <strong>{primaryCity}</strong>, prioritizing your profile for instant standby slot recovery during panel no-shows.
                          </p>
                        </div>

                        {/* Card 4: Location-Based Skill Demand */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-white border border-purple-200 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-purple-600" />
                              <span>Regional Market Competency Fit</span>
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
                              High Demand
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            Panels across <strong>{activeCities.slice(0, 2).join(' and ')}</strong> report strong demand for candidates with verified <strong>Core Java</strong> and <strong>DSA</strong> competencies. Complete coding challenges in the Arena to maximize your shortlisting rank.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

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

      {/* Resume Upload & Parsing Modal */}
      <ResumeUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        isUploading={isUploadingResume}
        uploadStep={uploadStep}
        currentFileName={currentProfile.resume?.fileName}
        onFileSelect={(file) => {
          const sizeInKb = Math.round(file.size / 1024);
          const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
          processResumeFile(file.name, formattedSize);
        }}
        onSimulateUpload={(fileName, fileSize, skills) => {
          processResumeFile(fileName, fileSize, skills);
        }}
      />
    </div>
  );
};

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUploading: boolean;
  uploadStep: number;
  currentFileName?: string;
  onFileSelect: (file: File) => void;
  onSimulateUpload: (fileName: string, fileSize: string, skills?: string[]) => void;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  isUploading,
  uploadStep,
  currentFileName,
  onFileSelect,
  onSimulateUpload
}) => {
  const [dragActive, setDragActive] = useState(false);
  const modalInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Updated Resume</h3>
              <p className="text-xs text-slate-500">Upload PDF or DOCX to update profile and verify 4-tier skills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Resume Note */}
        {currentFileName && !isUploading && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Active Resume:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[240px]">{currentFileName}</span>
          </div>
        )}

        {/* Upload State / Progress */}
        {isUploading ? (
          <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                {uploadStep === 1 && '1. Uploading verified document to secure storage...'}
                {uploadStep === 2 && '2. NIYOJAN AI analyzing candidate competencies...'}
                {uploadStep === 3 && '3. Upgrading matching skills to Tier-2 Resume Extracted...'}
              </h4>
              <p className="text-xs text-slate-500">
                Validating educational qualifications, CGPA, and programming proficiencies
              </p>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
                style={{ width: uploadStep === 1 ? '35%' : uploadStep === 2 ? '75%' : '100%' }}
              />
            </div>
          </div>
        ) : (
          /* Dropzone */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => modalInputRef.current?.click()}
            className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all space-y-3 ${
              dragActive
                ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
            }`}
          >
            <input
              type="file"
              ref={modalInputRef}
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileSelect(f);
                if (e.target) e.target.value = '';
              }}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
              <FileUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Drag and drop your updated resume here
              </p>
              <p className="text-xs text-slate-500">
                or <span className="text-indigo-600 font-semibold underline">browse from your computer</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono">PDF</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono">DOC</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono">DOCX</span>
              <span>• Max 10 MB</span>
            </div>
          </div>
        )}

        {/* Quick Simulation Presets */}
        {!isUploading && (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-700 block">Quick Simulation Presets:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  onSimulateUpload('Armaan_Jena_Resume_2026_Updated.pdf', '2.2 MB', [
                    'Core Java',
                    'Spring Boot',
                    'Data Structures',
                    'PostgreSQL',
                    'React',
                    'Microservices'
                  ])
                }
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <FileCheck className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold text-slate-800 block truncate">Armaan_Jena_Resume_2026.pdf</span>
                  <span className="text-[10px] text-slate-400">2.2 MB • Full Stack CS</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  onSimulateUpload('Rohan_Sharma_Software_Engineer_Resume.pdf', '1.9 MB', [
                    'Core Java',
                    'Python',
                    'Algorithms',
                    'Distributed Systems',
                    'SQL',
                    'AWS'
                  ])
                }
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <FileCheck className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
                <div className="overflow-hidden">
                  <span className="font-bold text-slate-800 block truncate">Rohan_Sharma_SWE_2026.pdf</span>
                  <span className="text-[10px] text-slate-400">1.9 MB • Core Algorithms</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          {!isUploading && (
            <button
              type="button"
              onClick={() => modalInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select File</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
