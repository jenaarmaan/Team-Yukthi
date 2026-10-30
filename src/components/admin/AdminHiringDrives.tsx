import React, { useState } from 'react';
import { HiringDrive, CandidateType } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  Building2,
  Plus,
  Edit2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Users,
  Search,
  X,
  GraduationCap
} from 'lucide-react';

export const AdminHiringDrives: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState<HiringDrive | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Enterprise Learning Solutions');
  const [description, setDescription] = useState('');
  const [locations, setLocations] = useState<string[]>(['Mysuru', 'Bengaluru']);
  const [eligibleType, setEligibleType] = useState<CandidateType>('fresher');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [degrees, setDegrees] = useState('B.E., B.Tech, MCA');
  const [mandatorySkills, setMandatorySkills] = useState('Java, Python, SQL, DSA');
  const [vacancies, setVacancies] = useState('30');
  const [capacity, setCapacity] = useState('100');
  const [driveDate, setDriveDate] = useState('2026-11-24T09:30:00');

  const filteredDrives = drives.filter(
    (d) =>
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.locations.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleRegistration = (drive: HiringDrive) => {
    recruitmentService.updateHiringDrive(drive.id, {
      isRegistrationOpen: !drive.isRegistrationOpen
    });
  };

  const handleCreateOrUpdateDrive = (e: React.FormEvent) => {
    e.preventDefault();

    const mandatorySkillsArr = mandatorySkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const degreeArr = degrees
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingDrive) {
      recruitmentService.updateHiringDrive(editingDrive.id, {
        role,
        department,
        description,
        locations,
        eligibleCandidateTypes: [eligibleType],
        minimumCgpa: parseFloat(minCgpa) || 6.5,
        requiredDegree: degreeArr,
        mandatorySkills: mandatorySkillsArr,
        totalOpenings: parseInt(vacancies) || 20,
        interviewCapacity: parseInt(capacity) || 80,
        hiringDriveDate: driveDate
      });
      setEditingDrive(null);
    } else {
      recruitmentService.createHiringDrive({
        company: 'Excelsoft Technologies',
        title: `${role} Hiring Drive 2026`,
        role,
        department,
        description:
          description ||
          `Enterprise hiring drive for ${role} joining Excelsoft Technologies core EdTech engineering teams.`,
        locations,
        requiredDegree: degreeArr,
        minimumCgpa: parseFloat(minCgpa) || 7.0,
        eligibleCandidateTypes: [eligibleType],
        mandatorySkills: mandatorySkillsArr,
        preferredSkills: ['Cloud Basics', 'Git', 'Clean Architecture'],
        minExperienceMonths: eligibleType === 'fresher' ? 0 : 24,
        registrationDeadline: '2026-11-20T23:59:59',
        hiringDriveDate: driveDate,
        stages: [
          'Registration & Profile Verification',
          'Online Technical & Algorithmic Assessment',
          'Technical Interview Round 1',
          'Technical Interview Round 2',
          'HR & Compensation Rollout'
        ],
        isRegistrationOpen: true,
        totalOpenings: parseInt(vacancies) || 25,
        interviewCapacity: parseInt(capacity) || 90
      });
      setShowCreateModal(false);
    }
  };

  const openEditModal = (drive: HiringDrive) => {
    setEditingDrive(drive);
    setRole(drive.role);
    setDepartment(drive.department);
    setDescription(drive.description);
    setLocations(drive.locations);
    setEligibleType(drive.eligibleCandidateTypes[0] || 'fresher');
    setMinCgpa(drive.minimumCgpa.toString());
    setDegrees(drive.requiredDegree.join(', '));
    setMandatorySkills(drive.mandatorySkills.join(', '));
    setVacancies(drive.totalOpenings.toString());
    setCapacity(drive.interviewCapacity.toString());
    setDriveDate(drive.hiringDriveDate);
  };

  return (
    <div className="space-y-5">
      {/* Header with Search and Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Hiring Drive Management</h2>
          <p className="text-xs text-slate-500">Configure eligibility criteria, venue capacities, and registration windows</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives, skills, locations..."
              className="pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>

          <button
            onClick={() => {
              setEditingDrive(null);
              setRole('');
              setDescription('');
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Drive</span>
          </button>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrives.map((drive) => {
          const utilPct = Math.round((drive.currentRegistrations / drive.interviewCapacity) * 100);

          return (
            <div
              key={drive.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      {drive.department}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{drive.role}</h3>
                  </div>

                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      drive.isRegistrationOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {drive.isRegistrationOpen ? 'Accepting Registrations' : 'Registration Paused'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {drive.description}
                </p>

                {/* Key metadata */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Hiring Venues</span>
                    <span className="font-semibold text-slate-800">{drive.locations.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Eligible Type</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {drive.eligibleCandidateTypes.join('/')} (Min CGPA: {drive.minimumCgpa})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Open Vacancies</span>
                    <span className="font-mono font-bold text-indigo-700">{drive.totalOpenings} Roles</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Capacity</span>
                    <span className="font-mono font-bold text-slate-800">
                      {drive.currentRegistrations} / {drive.interviewCapacity} Slots ({utilPct}%)
                    </span>
                  </div>
                </div>

                {/* Mandatory Skills */}
                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                    Mandatory Technical Prerequisite Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {drive.mandatorySkills.map((sk) => (
                      <span
                        key={sk}
                        className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleRegistration(drive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    drive.isRegistrationOpen
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {drive.isRegistrationOpen ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pause Registration</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reopen Registration</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => openEditModal(drive)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit Configuration</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT HIRING DRIVE MODAL */}
      {(showCreateModal || editingDrive) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingDrive ? 'Edit Hiring Drive Configuration' : 'Create New Excelsoft Hiring Drive'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingDrive(null);
                }}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateDrive} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Job Role Title *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Graduate Software Engineer, Cloud Trainee"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Candidate Type</label>
                  <select
                    value={eligibleType}
                    onChange={(e) => setEligibleType(e.target.value as CandidateType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="fresher">Fresher (2026 Batch)</option>
                    <option value="experienced">Experienced Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Drive context, business unit, and objectives..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Required Degrees</label>
                  <input
                    type="text"
                    value={degrees}
                    onChange={(e) => setDegrees(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Minimum CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mandatory Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={mandatorySkills}
                  onChange={(e) => setMandatorySkills(e.target.value)}
                  placeholder="Java, Python, SQL, DSA"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Open Vacancies</label>
                  <input
                    type="number"
                    value={vacancies}
                    onChange={(e) => setVacancies(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Interview Slot Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                >
                  {editingDrive ? 'Save Drive Updates' : 'Publish Hiring Drive to Candidate App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
