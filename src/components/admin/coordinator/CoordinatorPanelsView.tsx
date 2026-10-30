import React, { useState } from 'react';
import { recruitmentService } from '../../../services/storageService';
import { InterviewerProfile } from '../../../types/recruitment';
import {
  Users,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  X,
  RotateCcw,
  UserPlus,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ManagedPanel {
  id: string;
  code: string;
  name: string;
  driveTitle: string;
  roundType: string;
  leadInterviewer: string;
  leadEmail: string;
  coInterviewer?: string;
  roomAssigned: string;
  venue: string;
  activeSlotsCount: number;
  maxSlotsPerDay: number;
  status: 'active' | 'in_interview' | 'standby' | 'unavailable';
}

export const CoordinatorPanelsView: React.FC = () => {
  const drives = recruitmentService.getHiringDrives();
  const rawInterviewers = recruitmentService.getInterviewers();

  const initialPanels: ManagedPanel[] = [
    {
      id: 'pan_01',
      code: 'Panel A-01',
      name: 'Core Algorithms & Data Structures Panel',
      driveTitle: 'Graduate Software Engineer 2026',
      roundType: 'Technical Round 1',
      leadInterviewer: 'Dr. K. S. Ramanujan',
      leadEmail: 'k.s.ramanujan@excelsoftcorp.com',
      coInterviewer: 'Rakesh Rao',
      roomAssigned: 'Panel Room A-01',
      venue: 'Mysuru Campus Center',
      activeSlotsCount: 4,
      maxSlotsPerDay: 6,
      status: 'in_interview'
    },
    {
      id: 'pan_02',
      code: 'Panel A-02',
      name: 'System Architecture & Web Platform Panel',
      driveTitle: 'Graduate Software Engineer 2026',
      roundType: 'Technical Round 1',
      leadInterviewer: 'Ananya Deshmukh',
      leadEmail: 'ananya.deshmukh@excelsoftcorp.com',
      roomAssigned: 'Panel Room A-02',
      venue: 'Mysuru Campus Center',
      activeSlotsCount: 3,
      maxSlotsPerDay: 6,
      status: 'active'
    },
    {
      id: 'pan_03',
      code: 'Panel B-01',
      name: 'Cloud Infrastructure & SRE Panel',
      driveTitle: 'Cloud DevOps & SRE Hiring',
      roundType: 'Technical Round 2',
      leadInterviewer: 'Rajesh Sen',
      leadEmail: 'rajesh.sen@excelsoftcorp.com',
      roomAssigned: 'Boardroom C-01',
      venue: 'Bengaluru Tech Hub',
      activeSlotsCount: 5,
      maxSlotsPerDay: 6,
      status: 'active'
    },
    {
      id: 'pan_04',
      code: 'Panel B-02',
      name: 'Problem Solving & DSA Standby Panel',
      driveTitle: 'Graduate Software Engineer 2026',
      roundType: 'Technical Round 1',
      leadInterviewer: 'Dr. S. K. Rao',
      leadEmail: 's.k.rao@excelsoftcorp.com',
      roomAssigned: 'Panel Room B-02',
      venue: 'Mysuru Campus Center',
      activeSlotsCount: 2,
      maxSlotsPerDay: 6,
      status: 'standby'
    },
    {
      id: 'pan_05',
      code: 'Panel C-01',
      name: 'Cultural Alignment & Leadership Panel',
      driveTitle: 'Full Stack Web Platform Drive',
      roundType: 'HR & Cultural Round',
      leadInterviewer: 'Murali Krishna',
      leadEmail: 'murali.krishna@excelsoftcorp.com',
      roomAssigned: 'Interview Room 102',
      venue: 'Hyderabad Tech Center',
      activeSlotsCount: 4,
      maxSlotsPerDay: 6,
      status: 'active'
    }
  ];

  const [panels, setPanels] = useState<ManagedPanel[]>(initialPanels);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [reassignPanel, setReassignPanel] = useState<ManagedPanel | null>(null);
  const [substituteInterviewer, setSubstituteInterviewer] = useState<string>('Praveen Kumar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for New Panel
  const [newPanelCode, setNewPanelCode] = useState<string>('Panel B-03');
  const [newPanelName, setNewPanelName] = useState<string>('Backend Engineering Panel');
  const [newPanelDrive, setNewPanelDrive] = useState<string>(drives[0]?.title || 'GSE 2026');
  const [newPanelRound, setNewPanelRound] = useState<string>('Technical Round 1');
  const [newPanelLead, setNewPanelLead] = useState<string>('Praveen Kumar');
  const [newPanelRoom, setNewPanelRoom] = useState<string>('Panel Room A-03');
  const [newPanelVenue, setNewPanelVenue] = useState<string>('Mysuru Campus Center');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreatePanel = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ManagedPanel = {
      id: `pan_${Date.now()}`,
      code: newPanelCode,
      name: newPanelName,
      driveTitle: newPanelDrive,
      roundType: newPanelRound,
      leadInterviewer: newPanelLead,
      leadEmail: `${newPanelLead.toLowerCase().replace(' ', '.')}@excelsoftcorp.com`,
      roomAssigned: newPanelRoom,
      venue: newPanelVenue,
      activeSlotsCount: 0,
      maxSlotsPerDay: 6,
      status: 'active'
    };

    setPanels((prev) => [created, ...prev]);
    setShowCreateModal(false);
    showToast(`Interview Panel ${created.code} successfully created and assigned to ${created.roomAssigned}.`);
  };

  const handleSubstituteInterviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignPanel) return;

    setPanels((prev) =>
      prev.map((p) =>
        p.id === reassignPanel.id
          ? {
              ...p,
              leadInterviewer: substituteInterviewer,
              leadEmail: `${substituteInterviewer.toLowerCase().replace(' ', '.')}@excelsoftcorp.com`
            }
          : p
      )
    );
    showToast(`Substitute interviewer ${substituteInterviewer} reassigned to ${reassignPanel.code}.`);
    setReassignPanel(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-mono">
                EVALUATION PANELS
              </span>
              <h2 className="text-xl font-bold text-slate-900">Interview Panel Management</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure panel members, monitor interviewer daily workloads, allocate rounds, and handle replacements
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Panel</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Panels List / Cards (Items 1 to 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {panels.map((panel) => {
          const workloadPct = Math.round((panel.activeSlotsCount / panel.maxSlotsPerDay) * 100);
          const isHighWorkload = workloadPct >= 80;

          return (
            <div
              key={panel.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 hover:border-indigo-300 transition-all"
            >
              {/* Top Row: Panel Code, Status, Drive */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {panel.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{panel.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{panel.driveTitle} • {panel.roundType}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                    panel.status === 'in_interview'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      : panel.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {panel.status.replace('_', ' ')}
                </span>
              </div>

              {/* Interviewer Details & Room */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lead Interviewer</span>
                  <strong className="text-slate-800">{panel.leadInterviewer}</strong>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">{panel.leadEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Venue & Room</span>
                  <strong className="text-slate-800">{panel.roomAssigned}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{panel.venue}</span>
                </div>
              </div>

              {/* Workload Progress Bar (Item 6) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Daily Slot Load:</span>
                  <span className={`font-mono font-bold ${isHighWorkload ? 'text-rose-600' : 'text-slate-800'}`}>
                    {panel.activeSlotsCount} / {panel.maxSlotsPerDay} Slots ({workloadPct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHighWorkload ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${workloadPct}%` }}
                  />
                </div>
                {isHighWorkload && (
                  <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>High Workload Threshold: Nearing daily interview limit</span>
                  </span>
                )}
              </div>

              {/* Bottom Actions (Item 9 & 10) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setReassignPanel(panel)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Substitute Interviewer</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Create Panel Modal (Item 1) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Configure New Interview Panel</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePanel} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Panel Code</label>
                  <input
                    type="text"
                    value={newPanelCode}
                    onChange={(e) => setNewPanelCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Panel Name</label>
                  <input
                    type="text"
                    value={newPanelName}
                    onChange={(e) => setNewPanelName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hiring Drive</label>
                  <select
                    value={newPanelDrive}
                    onChange={(e) => setNewPanelDrive(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                  >
                    {drives.map((d) => (
                      <option key={d.id} value={d.title}>{d.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Round Type</label>
                  <select
                    value={newPanelRound}
                    onChange={(e) => setNewPanelRound(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                  >
                    <option value="Technical Round 1">Technical Round 1 (Coding/DSA)</option>
                    <option value="Technical Round 2">Technical Round 2 (Design/Cloud)</option>
                    <option value="HR & Cultural Round">HR & Cultural Round</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Interviewer</label>
                  <input
                    type="text"
                    value={newPanelLead}
                    onChange={(e) => setNewPanelLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Room</label>
                  <input
                    type="text"
                    value={newPanelRoom}
                    onChange={(e) => setNewPanelRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue Hub</label>
                <select
                  value={newPanelVenue}
                  onChange={(e) => setNewPanelVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                >
                  <option value="Mysuru Campus Center">Mysuru Campus Center</option>
                  <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
                  <option value="Hyderabad Tech Center">Hyderabad Tech Center</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Confirm Panel Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Substitute Interviewer Modal (Item 9) */}
      {reassignPanel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Reassign Panel Interviewer</h3>
              <button onClick={() => setReassignPanel(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Target Panel: <strong className="text-slate-900">{reassignPanel.code} ({reassignPanel.name})</strong></div>
              <div>Current Lead: <span className="text-slate-700">{reassignPanel.leadInterviewer}</span></div>
              <div>Room: <span className="text-slate-600 font-mono">{reassignPanel.roomAssigned}</span></div>
            </div>

            <form onSubmit={handleSubstituteInterviewer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Substitute Interviewer</label>
                <select
                  value={substituteInterviewer}
                  onChange={(e) => setSubstituteInterviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                >
                  <option value="Praveen Kumar">Praveen Kumar (Principal Architect)</option>
                  <option value="Dr. S. K. Rao">Dr. S. K. Rao (Senior Technical Lead)</option>
                  <option value="Ananya Deshmukh">Ananya Deshmukh (Platform Specialist)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReassignPanel(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Assign Substitute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

