import React, { useState } from 'react';
import { CandidateProfile, SkillVerificationLevel } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import { CandidateTypeBadge } from '../common/StatusBadge';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Building2,
  ChevronRight,
  LogOut,
  RefreshCw,
  X
} from 'lucide-react';

interface ProfileViewProps {
  profile: CandidateProfile;
  onLogout: () => void;
  onOpenScenarioSwitcher: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onLogout,
  onOpenScenarioSwitcher
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // Verification badge helper
  const renderVerificationBadge = (level: SkillVerificationLevel) => {
    switch (level) {
      case 'hr_verified':
        return (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> HR Verified
          </span>
        );
      case 'assessment_verified':
        return (
          <span className="text-[10px] font-bold text-teal-800 bg-teal-100/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" /> Assessment Verified
          </span>
        );
      case 'resume_extracted':
        return (
          <span className="text-[10px] font-medium text-indigo-800 bg-indigo-100/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <FileText className="w-2.5 h-2.5" /> Resume Extracted
          </span>
        );
      case 'self_declared':
      default:
        return (
          <span className="text-[10px] font-medium text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
            Self Declared
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  {profile.fullName}
                </h2>
                <CandidateTypeBadge type={profile.candidateType} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
              <p className="text-xs text-slate-500">{profile.phone}</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            title="Edit Profile"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Completion & Verification Status Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Status:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Profile
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-slate-700 font-bold">
            <span>Score: {profile.profileCompletionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* 2. MULTI-LOCATION PREFERENCES (Crucial requirement!) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hiring Location Preferences
            </h3>
          </div>
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Current Base City:</span>
            <span className="font-bold text-slate-900">{profile.currentLocation}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Preferred Hiring Locations:</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. RESUME UPLOAD & PARSED DETAILS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resume Document
            </h3>
          </div>
          <button
            onClick={() => setShowResumeModal(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>{profile.resume ? 'Update' : 'Upload'}</span>
          </button>
        </div>

        {profile.resume ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{profile.resume.fileName}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{profile.resume.fileSize}</span>
            </div>

            {profile.resume.parsedData && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Parsed Career Summary:</span>
                <p className="leading-relaxed">{profile.resume.parsedData.summary}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {profile.resume.parsedData.detectedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => setShowResumeModal(true)}
            className="p-4 border-2 border-dashed border-indigo-200 rounded-xl text-center text-xs text-indigo-700 bg-indigo-50/40 cursor-pointer hover:bg-indigo-50 transition-colors"
          >
            <Upload className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
            <span className="font-bold">Upload Resume (PDF / DOCX)</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Automated skill & education extraction</p>
          </div>
        )}
      </div>

      {/* 4. MULTI-TIER SKILLS MANAGEMENT */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Technical Skills & Badges ({profile.skills.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Legend */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-600 flex flex-wrap gap-2">
          <span className="font-bold text-slate-800">Verification Tiers:</span>
          <span>HR Verified</span>
          <span>·</span>
          <span>Assessment Verified</span>
          <span>·</span>
          <span>Resume Extracted</span>
          <span>·</span>
          <span>Self Declared</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profile.skills.map((skill) => (
            <div
              key={skill.id}
              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-slate-900 block truncate">{skill.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{skill.category}</span>
              </div>
              <div className="shrink-0">{renderVerificationBadge(skill.verificationLevel)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. EDUCATIONAL DETAILS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Education
            </h3>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 text-xs">
          <div className="font-bold text-slate-900 text-sm">{profile.education.institution}</div>
          <p className="text-indigo-700 font-semibold">
            {profile.education.degree} in {profile.education.branch}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-600">
            <span>Graduation Year: <strong>{profile.education.graduationYear}</strong></span>
            <span>CGPA: <strong className="font-mono text-slate-900">{profile.education.cgpa} / 10</strong></span>
          </div>
        </div>
      </div>

      {/* 6. WORK EXPERIENCE (IF EXPERIENCED) */}
      {profile.workExperience && profile.workExperience.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Work Experience
            </h3>
          </div>

          <div className="space-y-2">
            {profile.workExperience.map((exp, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="font-bold text-slate-900">{exp.jobTitle}</div>
                <div className="text-slate-600 font-medium">{exp.organization}</div>
                <div className="text-[11px] text-slate-400">Duration: {exp.durationMonths} months</div>
                <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CERTIFICATIONS */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Certifications
            </h3>
          </div>
          <div className="space-y-1.5">
            {profile.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 flex items-center gap-2"
              >
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. SYSTEM & ACCOUNT SETTINGS */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onOpenScenarioSwitcher}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-between border border-indigo-200/80 transition-colors"
        >
          <span>Switch QA Candidate Persona</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of NIYOJAN</span>
        </button>
      </div>

      {/* MODAL: EDIT LOCATION PREFERENCES */}
      {showLocationModal && (
        <LocationPreferenceModal
          currentLocations={profile.preferredLocations}
          onClose={() => setShowLocationModal(false)}
          onSave={(locs) => {
            recruitmentService.updatePreferredLocations(locs);
            setShowLocationModal(false);
          }}
        />
      )}

      {/* MODAL: RESUME UPLOAD SIMULATOR */}
      {showResumeModal && (
        <ResumeUploadModal
          onClose={() => setShowResumeModal(false)}
          onUploadSuccess={(fileName, size, skills, summary) => {
            recruitmentService.uploadParsedResume(fileName, size, skills, summary);
            setShowResumeModal(false);
          }}
        />
      )}

      {/* MODAL: ADD SKILL */}
      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => setShowAddSkillModal(false)}
          onAdd={(name, cat, level) => {
            const current = recruitmentService.getCurrentProfile();
            const newSkills = [
              ...current.skills,
              {
                id: 'sk_' + Date.now(),
                name,
                category: cat as any,
                verificationLevel: level as any,
                rating: 4
              }
            ];
            recruitmentService.updateProfile({ skills: newSkills });
            setShowAddSkillModal(false);
          }}
        />
      )}

      {/* MODAL: EDIT PROFILE INFO */}
      {showEditProfileModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfileModal(false)}
          onSave={(data) => {
            recruitmentService.updateProfile(data);
            setShowEditProfileModal(false);
          }}
        />
      )}
    </div>
  );
};

// Sub-modal: Edit Location Preferences
const LocationPreferenceModal: React.FC<{
  currentLocations: string[];
  onClose: () => void;
  onSave: (locations: string[]) => void;
}> = ({ currentLocations, onClose, onSave }) => {
  const [selected, setSelected] = useState<string[]>([...currentLocations]);
  const available = ['Hyderabad', 'Mysuru', 'Bengaluru', 'Pune', 'Chennai', 'Noida'];

  const toggle = (loc: string) => {
    if (selected.includes(loc)) {
      if (selected.length > 1) {
        setSelected(selected.filter((l) => l !== loc));
      }
    } else {
      setSelected([...selected, loc]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Preferred Hiring Locations</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Select all cities where you are willing to attend in-person interviews and join Excelsoft.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {available.map((city) => {
            const isSel = selected.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggle(city)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isSel
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{city}</span>
                {isSel && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSave(selected)}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider"
        >
          Save Preferences ({selected.length} Selected)
        </button>
      </div>
    </div>
  );
};

// Sub-modal: Resume Upload & Parsing Simulator
const ResumeUploadModal: React.FC<{
  onClose: () => void;
  onUploadSuccess: (name: string, size: string, skills: string[], summary: string) => void;
}> = ({ onClose, onUploadSuccess }) => {
  const [parsing, setParsing] = useState(false);

  const handleSimulateUpload = () => {
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      onUploadSuccess(
        'Updated_Resume_2026_Tech.pdf',
        '480 KB',
        ['Java', 'Python', 'React', 'SQL', 'Docker', 'FastAPI'],
        'Computer Science candidate with background in software architecture and modern web tech.'
      );
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Upload & Parse Resume</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="p-6 border-2 border-dashed border-indigo-200 rounded-2xl text-center bg-indigo-50/40">
          {parsing ? (
            <div className="space-y-2">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div className="text-xs font-bold text-slate-800">Parsing Resume via NIYOJAN AI...</div>
              <p className="text-[10px] text-slate-500">Extracting education, CGPA, and technical skills</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Select PDF or DOCX File</div>
              <p className="text-[10px] text-slate-400">Max file size 5MB</p>
            </div>
          )}
        </div>

        <button
          disabled={parsing}
          onClick={handleSimulateUpload}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider"
        >
          {parsing ? 'Parsing...' : 'Simulate Resume Upload & Parse'}
        </button>
      </div>
    </div>
  );
};

// Sub-modal: Add Skill
const AddSkillModal: React.FC<{
  onClose: () => void;
  onAdd: (name: string, category: string, level: string) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('programming');
  const [level, setLevel] = useState('self_declared');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Add Technical Skill</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Skill Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Docker, TypeScript, PyTorch"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
          >
            <option value="programming">Programming Language</option>
            <option value="framework">Framework / Library</option>
            <option value="database">Database</option>
            <option value="tools">DevOps / Tools</option>
            <option value="domain">Domain Knowledge</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Verification Source</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
          >
            <option value="self_declared">Self Declared</option>
            <option value="resume_extracted">Resume Extracted</option>
            <option value="assessment_verified">Assessment Verified</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (name) onAdd(name, category, level);
          }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider mt-2"
        >
          Add Skill to Profile
        </button>
      </div>
    </div>
  );
};

// Sub-modal: Edit Profile Details
const EditProfileModal: React.FC<{
  profile: CandidateProfile;
  onClose: () => void;
  onSave: (data: Partial<CandidateProfile>) => void;
}> = ({ profile, onClose, onSave }) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [currentLocation, setCurrentLocation] = useState(profile.currentLocation);
  const [cgpa, setCgpa] = useState(profile.education.cgpa.toString());

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Edit Profile</h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Current Location</label>
          <input
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CGPA (Out of 10)</label>
          <input
            type="number"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
          />
        </div>

        <button
          onClick={() => {
            onSave({
              fullName,
              currentLocation,
              education: {
                ...profile.education,
                cgpa: parseFloat(cgpa) || profile.education.cgpa
              }
            });
          }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider mt-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
