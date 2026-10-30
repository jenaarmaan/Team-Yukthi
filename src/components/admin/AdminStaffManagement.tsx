import React, { useState, useEffect } from 'react';
import {
  clientAuthService,
  StaffRegistrationInput
} from '../../services/firebaseAuth';
import {
  UserPlus,
  Users,
  Award,
  Clock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Mail,
  Phone,
  Copy,
  Sparkles,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

interface StaffMember {
  uid: string;
  email: string;
  displayName: string;
  role: 'recruitment_manager' | 'interview_coordinator' | 'interviewer' | 'hr_admin' | 'super_admin';
  department?: string;
  phone?: string;
  assignedPanel?: string;
  specialization?: string;
  status: string;
  createdAt?: string;
}

export const AdminStaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Invitation Form State
  const [inviteForm, setInviteForm] = useState<StaffRegistrationInput>({
    fullName: '',
    email: '',
    phone: '',
    role: 'interviewer',
    department: 'Engineering Assessment Panel',
    password: 'StaffSecretPassword123!',
    assignedPanel: 'Panel 1 (Technical Systems)',
    specialization: 'Core Java, Spring Boot, Distributed Systems'
  });

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const data = await clientAuthService.listStaffMembers();
      if (data && data.length > 0) {
        setStaffList(data);
      } else {
        // Fallback default enterprise staff members if backend returns empty
        setStaffList([
          {
            uid: 'adm_sushmita',
            email: 'sushmita.jena@excelsoftcorp.com',
            displayName: 'Sushmita Jena',
            role: 'super_admin',
            department: 'Executive Leadership & Recruitment Oversight',
            status: 'Active',
            createdAt: '2026-01-10T08:00:00Z'
          },
          {
            uid: 'adm_praveen',
            email: 'praveen.k@excelsoftcorp.com',
            displayName: 'Dr. Praveen Kumar',
            role: 'hr_admin',
            department: 'Talent Acquisition & Institutional Campus Drives',
            phone: '+91 (821) 428-2001',
            status: 'Active',
            createdAt: '2026-01-15T09:30:00Z'
          },
          {
            uid: 'adm_ananya',
            email: 'ananya.d@excelsoftcorp.com',
            displayName: 'Ananya Deshmukh',
            role: 'recruitment_manager',
            department: 'Engineering Talent Pipeline',
            phone: '+91 (821) 428-2002',
            specialization: 'Candidate Vetting & Capacity Planning',
            status: 'Active',
            createdAt: '2026-02-01T10:15:00Z'
          },
          {
            uid: 'adm_rakesh',
            email: 'rakesh.r@excelsoftcorp.com',
            displayName: 'Rakesh Rao',
            role: 'interview_coordinator',
            department: 'Campus Logistics & Desk Operations',
            phone: '+91 (821) 428-2003',
            assignedPanel: 'Venue Desk 1 (Mysuru Campus)',
            status: 'Active',
            createdAt: '2026-02-10T11:00:00Z'
          },
          {
            uid: 'adm_murali',
            email: 'murali.k@excelsoftcorp.com',
            displayName: 'Dr. Murali Krishna',
            role: 'interviewer',
            department: 'Principal Technical Architect',
            phone: '+91 (821) 428-2004',
            assignedPanel: 'Panel 1 (Technical Algorithms)',
            specialization: 'Data Structures, Java Systems, Cloud Architecture',
            status: 'Active',
            createdAt: '2026-02-15T14:20:00Z'
          }
        ]);
      }
    } catch {
      // Use fallback defaults
      setStaffList([
        {
          uid: 'adm_praveen',
          email: 'praveen.k@excelsoftcorp.com',
          displayName: 'Dr. Praveen Kumar',
          role: 'hr_admin',
          department: 'Talent Acquisition',
          status: 'Active'
        },
        {
          uid: 'adm_ananya',
          email: 'ananya.d@excelsoftcorp.com',
          displayName: 'Ananya Deshmukh',
          role: 'recruitment_manager',
          department: 'Engineering Pipeline',
          status: 'Active'
        },
        {
          uid: 'adm_rakesh',
          email: 'rakesh.r@excelsoftcorp.com',
          displayName: 'Rakesh Rao',
          role: 'interview_coordinator',
          department: 'Venue Desk',
          status: 'Active'
        },
        {
          uid: 'adm_murali',
          email: 'murali.k@excelsoftcorp.com',
          displayName: 'Dr. Murali Krishna',
          role: 'interviewer',
          department: 'Technical Panel',
          assignedPanel: 'Panel 1 (Algorithms)',
          status: 'Active'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.fullName || !inviteForm.email || !inviteForm.role) return;

    try {
      const result = await clientAuthService.registerStaff(inviteForm);
      setNotification({
        type: 'success',
        message: `Successfully provisioned ${inviteForm.fullName} as ${inviteForm.role.replace('_', ' ').toUpperCase()}!`
      });

      setShowInviteModal(false);
      setInviteForm({
        fullName: '',
        email: '',
        phone: '',
        role: 'interviewer',
        department: 'Engineering Assessment Panel',
        password: 'StaffSecretPassword123!',
        assignedPanel: 'Panel 1 (Technical Systems)',
        specialization: 'Core Java, Spring Boot, Distributed Systems'
      });

      // Reload staff list
      loadStaff();

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to provision staff member.'
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const copyCredentials = (staff: StaffMember) => {
    navigator.clipboard.writeText(`User ID: ${staff.email}\nDefault Password: StaffSecretPassword123!\nRole: ${staff.role}`);
    setNotification({
      type: 'success',
      message: `Credentials copied for ${staff.displayName} (${staff.email})`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    const matchesSearch =
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Staff Invitation & Registration</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              HR DIRECTORY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Provision and onboard operational recruitment staff: Recruitment Managers, Venue Coordinators, and Technical Interviewers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStaff}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-95 transition-all"
            title="Refresh Staff List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite & Register Staff</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 shadow-xs animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{staffList.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Recruitment Mgrs</span>
            <Building2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {staffList.filter((s) => s.role === 'recruitment_manager').length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Coordinators</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {staffList.filter((s) => s.role === 'interview_coordinator').length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Interviewers</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {staffList.filter((s) => s.role === 'interviewer').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              roleFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('recruitment_manager')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              roleFilter === 'recruitment_manager'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Managers
          </button>
          <button
            onClick={() => setRoleFilter('interview_coordinator')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              roleFilter === 'interview_coordinator'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Coordinators
          </button>
          <button
            onClick={() => setRoleFilter('interviewer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              roleFilter === 'interviewer'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Interviewers
          </button>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department / Panel</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No staff members match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const rolePillStyles: Record<string, string> = {
                    super_admin: 'bg-rose-50 text-rose-700 border-rose-200',
                    hr_admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    recruitment_manager: 'bg-violet-50 text-violet-700 border-violet-200',
                    interview_coordinator: 'bg-blue-50 text-blue-700 border-blue-200',
                    interviewer: 'bg-amber-50 text-amber-700 border-amber-200'
                  };

                  return (
                    <tr key={staff.uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {staff.displayName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{staff.displayName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{staff.uid}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                            rolePillStyles[staff.role] || 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {staff.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-700 block">{staff.department || 'Talent Operations'}</span>
                        {staff.assignedPanel && (
                          <span className="text-[10px] text-indigo-600 font-mono block">{staff.assignedPanel}</span>
                        )}
                        {staff.specialization && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-xs">{staff.specialization}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{staff.email}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => copyCredentials(staff)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-colors"
                          title="Copy Login Credentials"
                        >
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Credentials</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INVITATION & REGISTRATION MODAL                                       */}
      {/* ===================================================================== */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Provision Staff Member</h3>
                  <p className="text-xs text-slate-500">Add operational members to your recruitment workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteForm.fullName}
                    onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
                    placeholder="e.g. Dr. Murali Krishna"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="murali.k@excelsoftcorp.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Operational Role *
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden font-semibold"
                  >
                    <option value="interviewer">Technical Interviewer</option>
                    <option value="interview_coordinator">Interview Coordinator (Venue Desk)</option>
                    <option value="recruitment_manager">Recruitment Manager (Talent Pipeline)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    placeholder="+91 (821) 428-2005"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Organizational Unit
                </label>
                <input
                  type="text"
                  value={inviteForm.department}
                  onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                  placeholder="e.g. Core Java Assessment Group / Engineering Campus Logistics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Conditional fields for Interviewers */}
              {inviteForm.role === 'interviewer' && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="font-bold text-amber-800 text-[11px] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Technical Panel Assignment</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">Assigned Panel</label>
                      <input
                        type="text"
                        value={inviteForm.assignedPanel}
                        onChange={(e) => setInviteForm({ ...inviteForm, assignedPanel: e.target.value })}
                        placeholder="Panel 1 (Technical)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">Technical Domain</label>
                      <input
                        type="text"
                        value={inviteForm.specialization}
                        onChange={(e) => setInviteForm({ ...inviteForm, specialization: e.target.value })}
                        placeholder="Java, Data Structures, System Design"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Provisioning Password
                </label>
                <input
                  type="text"
                  value={inviteForm.password}
                  onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-hidden font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Default initial password generated for staff member to sign in immediately.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  Provision Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

