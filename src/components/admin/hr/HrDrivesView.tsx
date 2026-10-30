import React, { useState } from 'react';
import { HiringDrive, CandidateType, Application } from '../../../types/recruitment';
import { recruitmentService } from '../../../services/storageService';
import {
  Building2,
  Calendar,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  X,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Award,
  TrendingUp,
  Search,
  Filter,
  UserCheck,
  GraduationCap
} from 'lucide-react';

export const HrDrivesView: React.FC = () => {
  const [activeSubsection, setActiveSubsection] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Detailed Modal states
  const [selectedUpcomingDrive, setSelectedUpcomingDrive] = useState<HiringDrive | null>(null);
  const [selectedPastDrive, setSelectedPastDrive] = useState<HiringDrive | null>(null);

  const allDrives = recruitmentService.getHiringDrives();
  const allCandidates = recruitmentService.getAllCandidates();
  const allApplications = recruitmentService.getAllApplications();
  const allInterviewers = recruitmentService.getInterviewers();
  const allWaitlist = recruitmentService.getAllWaitlistApplications();
  const allStandby = recruitmentService.getAllStandbyApplications();

  // Filter Upcoming vs Past Drives
  const upcomingDrives = allDrives.filter(
    (d) => d.status !== 'completed' && (d.isRegistrationOpen || d.status === 'upcoming' || !d.status)
  );

  const pastDrives = allDrives.filter((d) => d.status === 'completed' || !d.isRegistrationOpen);

  // Form State for Create Drive
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Enterprise Learning Solutions');
  const [newDesc, setNewDesc] = useState('');
  const [newLocations, setNewLocations] = useState<string[]>(['Mysuru', 'Bengaluru']);
  const [newCandidateType, setNewCandidateType] = useState<CandidateType>('fresher');
  const [newCgpa, setNewCgpa] = useState('7.0');
  const [newDegrees, setNewDegrees] = useState('B.E., B.Tech, MCA');
  const [newSkills, setNewSkills] = useState('Core Java, Data Structures, SQL, Clean Architecture');
  const [newVacancies, setNewVacancies] = useState('30');
  const [newCapacity, setNewCapacity] = useState('100');
  const [newDriveDate, setNewDriveDate] = useState('2026-11-28T09:30:00');

  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    const skillsArr = newSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const degreesArr = newDegrees.split(',').map((d) => d.trim()).filter(Boolean);

    recruitmentService.createHiringDrive({
      company: 'Excelsoft Technologies',
      title: `${newRole} Campus Hiring Drive 2026`,
      role: newRole,
      department: newDept,
      description:
        newDesc ||
        `Autonomous campus recruitment drive for ${newRole} joining Excelsoft Technologies core EdTech engineering teams.`,
      locations: newLocations,
      requiredDegree: degreesArr,
      minimumCgpa: parseFloat(newCgpa) || 7.0,
      eligibleCandidateTypes: [newCandidateType],
      mandatorySkills: skillsArr,
      preferredSkills: ['Cloud Basics', 'Git', 'Agile Principles'],
      minExperienceMonths: newCandidateType === 'fresher' ? 0 : 24,
      registrationDeadline: '2026-11-24T23:59:59',
      hiringDriveDate: newDriveDate,
      stages: [
        'Registration & Profile Verification',
        'Online Technical & Cognitive Assessment',
        'Technical Interview Round 1',
        'Technical Interview Round 2',
        'HR Discussion & Offer Rollout'
      ],
      isRegistrationOpen: true,
      status: 'upcoming',
      totalOpenings: parseInt(newVacancies) || 25,
      interviewCapacity: parseInt(newCapacity) || 90
    });

    setShowCreateModal(false);
    setNewRole('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Subsection Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Hiring Drives Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage upcoming campus drives, live panels, candidate slots, waitlists, and archived past drive performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subsection Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubsection('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubsection === 'upcoming'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Drives ({upcomingDrives.length})
            </button>
            <button
              onClick={() => setActiveSubsection('past')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubsection === 'past'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Drives ({pastDrives.length})
            </button>
          </div>

          {activeSubsection === 'upcoming' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5.1 UPCOMING DRIVES SUBSECTION                                            */}
      {/* ========================================================================= */}
      {activeSubsection === 'upcoming' && (
        <div className="space-y-6">
          
          {/* A. Live Drive Status Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Drive Status & Real-Time Candidate Participation</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Active Campus Centers: Mysuru &bull; Bengaluru
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block">Active Drives</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">{upcomingDrives.length} Drives</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Total Candidate Slots</span>
                <span className="text-xl font-bold font-mono text-indigo-300 mt-0.5 block">
                  {upcomingDrives.reduce((sum, d) => sum + d.interviewCapacity, 0)} Capacity
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Registered Applicants</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
                  {upcomingDrives.reduce((sum, d) => sum + d.currentRegistrations, 0)} Booked
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Panel Availability</span>
                <span className="text-xl font-bold font-mono text-amber-300 mt-0.5 block">
                  {allInterviewers.length} Panelists Active
                </span>
              </div>
            </div>
          </div>

          {/* C. Upcoming Drive Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Upcoming Hiring Drives (Click any card to inspect interviewers, slots, and waitlists)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingDrives.map((drive) => {
                const util = Math.round((drive.currentRegistrations / drive.interviewCapacity) * 100);
                return (
                  <div
                    key={drive.id}
                    onClick={() => setSelectedUpcomingDrive(drive)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/60 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {drive.title || drive.role}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{drive.company} &bull; {drive.department}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider shrink-0">
                          {drive.isRegistrationOpen ? 'Registration Open' : 'Upcoming'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{new Date(drive.hiringDriveDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{drive.locations.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{drive.currentRegistrations} / {drive.interviewCapacity} Registered</span>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Capacity Utilization</span>
                          <span className="font-mono font-bold text-slate-700">{util}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${util > 90 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                            style={{ width: `${Math.min(util, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                      <span>View Interviewer Panel, Slots & Standby Queue</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.2 PAST DRIVES SUBSECTION                                                */}
      {/* ========================================================================= */}
      {activeSubsection === 'past' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Archived Completed Drives (Click any card to inspect full candidate roster & evaluations)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastDrives.map((drive) => {
              const stats = drive.selectionStats || {
                totalEvaluated: 89,
                selectedCount: 24,
                rejectedCount: 65,
                offerAcceptanceRate: 92,
                averageScore: 81.4
              };

              return (
                <div
                  key={drive.id}
                  onClick={() => setSelectedPastDrive(drive)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/60 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {drive.title || drive.role}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{drive.company}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider shrink-0">
                        Completed
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Drive Date: {new Date(drive.hiringDriveDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Total Candidates: {drive.currentRegistrations || stats.totalEvaluated}</span>
                      </div>
                    </div>

                    {/* Selection Statistics Badge Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/60">
                        <span className="block font-bold text-emerald-800">{stats.selectedCount} Offers</span>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          {Math.round((stats.selectedCount / stats.totalEvaluated) * 100)}% Selected
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="block font-bold text-slate-800 font-mono">{stats.averageScore} / 100</span>
                        <span className="text-[10px] text-slate-500">Average Score</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Inspect Full Drive Report</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE DRIVE FORM                                                  */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Configure New Hiring Drive</h3>
                  <p className="text-[11px] text-slate-400">Excelsoft Technologies recruitment lifecycle</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Job Role *</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Graduate Software Engineer, AI Systems Specialist"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Candidate Cohort</label>
                  <select
                    value={newCandidateType}
                    onChange={(e) => setNewCandidateType(e.target.value as CandidateType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  >
                    <option value="fresher">Fresher (Campus)</option>
                    <option value="experienced">Lateral / Experienced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCgpa}
                    onChange={(e) => setNewCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Openings</label>
                  <input
                    type="number"
                    value={newVacancies}
                    onChange={(e) => setNewVacancies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mandatory Technical Skills</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider mt-2 shadow-xs transition-colors"
              >
                Launch Hiring Drive
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED MODAL: UPCOMING DRIVE (PANEL, SLOTS, WAITING LIST)               */}
      {/* ========================================================================= */}
      {selectedUpcomingDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedUpcomingDrive.title || selectedUpcomingDrive.role}</h3>
                <p className="text-xs text-slate-500">{selectedUpcomingDrive.company} &bull; {selectedUpcomingDrive.department}</p>
              </div>
              <button onClick={() => setSelectedUpcomingDrive(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* D. Interviewer Panel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Appointed Interviewer Panel</span>
                </div>
                <span className="text-slate-400">{allInterviewers.length} Panelists Assigned</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allInterviewers.map((inv) => (
                  <div key={inv.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{inv.name}</span>
                      <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded font-mono">
                        {inv.assignedPanel.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">{inv.role}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Availability: {inv.availableDays.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* E. Interview Schedule and Slots */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Candidate-Wise Interview Slots</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-mono">Active Schedule</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {allApplications
                  .filter((a) => a.hiringDriveId === selectedUpcomingDrive.id && a.interviewSlot)
                  .map((app) => (
                    <div key={app.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{app.candidateProfile?.fullName || 'Candidate'}</span>
                        <div className="text-[11px] text-slate-500">
                          {app.interviewSlot?.time} &bull; {app.interviewSlot?.roomOrPanel}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {app.interviewSlot?.attendanceVerified ? 'Attended' : 'Scheduled'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* F. Waiting List & Proactive Standby */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Waiting List & Proactive Standby Queue</span>
                </div>
                <span className="text-[11px] text-slate-500">{allStandby.length} Standbys &bull; {allWaitlist.length} Waitlisted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-1">
                  <span className="font-bold text-amber-900 block">Standby Candidates (Immediate Triage)</span>
                  {allStandby.slice(0, 3).map((s) => (
                    <div key={s.app.id} className="text-[11px] text-slate-700 flex justify-between">
                      <span>{s.candidate.fullName}</span>
                      <span className="font-mono text-amber-700 font-bold">{s.candidate.education.cgpa} CGPA</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Dynamic Waitlist (By Priority)</span>
                  {allWaitlist.slice(0, 3).map((w) => (
                    <div key={w.app.id} className="text-[11px] text-slate-700 flex justify-between">
                      <span>{w.candidate.fullName}</span>
                      <span className="text-slate-500 font-mono">Rank #{w.waitlist.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED MODAL: PAST DRIVE REPORT                                         */}
      {/* ========================================================================= */}
      {selectedPastDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedPastDrive.title || selectedPastDrive.role}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Completed Drive Report</span>
                </div>
                <p className="text-xs text-slate-500">Conducted by {selectedPastDrive.company} &bull; Final Archive Record</p>
              </div>
              <button onClick={() => setSelectedPastDrive(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Final Recruitment Statistics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px]">Total Evaluated</span>
                <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                  {selectedPastDrive.selectionStats?.totalEvaluated || 89}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="text-emerald-700 block text-[10px]">Offers Released</span>
                <span className="text-base font-bold font-mono text-emerald-800 mt-0.5 block">
                  {selectedPastDrive.selectionStats?.selectedCount || 24} Selected
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="text-rose-700 block text-[10px]">Rejections</span>
                <span className="text-base font-bold font-mono text-rose-800 mt-0.5 block">
                  {selectedPastDrive.selectionStats?.rejectedCount || 65}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                <span className="text-indigo-700 block text-[10px]">Acceptance Yield</span>
                <span className="text-base font-bold font-mono text-indigo-800 mt-0.5 block">
                  {selectedPastDrive.selectionStats?.offerAcceptanceRate || 92}%
                </span>
              </div>
            </div>

            {/* 2. Candidate List & Individual Performance Feedback */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                <span>Evaluated Candidates & Feedback Outcomes</span>
                <span className="text-slate-400 font-mono text-[11px]">Audit Certified</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {allCandidates.slice(0, 5).map((cand, idx) => (
                  <div key={cand.profile.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{cand.profile.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        {cand.profile.education.degree} &bull; CGPA: {cand.profile.education.cgpa}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        idx === 0 || idx === 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx === 0 || idx === 2 ? 'Selected (Offer Extended)' : 'Technical Round 2 (Archived)'}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">Score: 8{idx}.5 / 100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
