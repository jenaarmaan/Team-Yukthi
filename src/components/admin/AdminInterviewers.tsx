import React, { useState } from 'react';
import { recruitmentService } from '../../services/storageService';
import { InterviewerProfile } from '../../types/recruitment';
import {
  Users,
  Award,
  MapPin,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Briefcase,
  X
} from 'lucide-react';

export const AdminInterviewers: React.FC = () => {
  const interviewers = recruitmentService.getInterviewers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff Engineer');
  const [department, setDepartment] = useState('Architecture & Platforms');
  const [location, setLocation] = useState('Mysuru');
  const [panel, setPanel] = useState('Panel 1 (Technical System Architecture)');
  const [skills, setSkills] = useState('Java, Distributed Systems, Cloud Architecture');

  const filtered = interviewers.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddInterviewer = (e: React.FormEvent) => {
    e.preventDefault();
    recruitmentService.addInterviewer({
      name,
      email,
      role,
      department,
      location,
      assignedPanel: panel,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      availableDays: ['Nov 18, 2026', 'Nov 20, 2026', 'Nov 24, 2026']
    });
    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Interviewer Directory & Panel Governance</h2>
          <p className="text-xs text-slate-500">Technical panel leads, subject-matter experts, and daily evaluation quotas</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interviewers, panels..."
              className="pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Panelist</span>
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {inv.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{inv.name}</h3>
                    <p className="text-[11px] text-slate-500">{inv.role}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {inv.location}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                <div className="font-semibold text-slate-800">{inv.assignedPanel}</div>
                <div className="text-[11px] text-slate-500">{inv.department}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                  Evaluation Expertise
                </span>
                <div className="flex flex-wrap gap-1">
                  {inv.skills.map((sk) => (
                    <span
                      key={sk}
                      className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Assigned Slots: <strong className="text-slate-900 font-mono">{inv.activeInterviewsCount}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Available
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Interviewer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Interview Panelist</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddInterviewer} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@excelsoftcorp.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Venue Base</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Mysuru">Mysuru</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Panel</label>
                <input
                  type="text"
                  value={panel}
                  onChange={(e) => setPanel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Key Technical Competencies</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, Cloud, System Design"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                Register Panelist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
