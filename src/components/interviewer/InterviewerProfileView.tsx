import React from 'react';
import { InterviewerProfile } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface InterviewerProfileViewProps {
  interviewer: InterviewerProfile;
  onInterviewerSwitched?: () => void;
}

export const InterviewerProfileView: React.FC<InterviewerProfileViewProps> = ({
  interviewer,
  onInterviewerSwitched
}) => {
  const allInterviewers = recruitmentService.getInterviewers();

  const handleSwitchPanelist = (id: string) => {
    recruitmentService.setActiveInterviewer(id);
    if (onInterviewerSwitched) onInterviewerSwitched();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-black text-2xl flex items-center justify-center shadow-inner">
            {interviewer.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Authorized Panel Evaluator
              </span>
              <span className="text-xs text-indigo-200 font-mono">ID: {interviewer.id}</span>
            </div>
            <h2 className="text-xl font-bold">{interviewer.name}</h2>
            <p className="text-xs text-indigo-200">
              {interviewer.role} &bull; {interviewer.department}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs space-y-1">
          <div className="text-[11px] text-slate-300 font-semibold">Assigned Interview Panel:</div>
          <div className="font-bold text-white text-sm">{interviewer.assignedPanel}</div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical Profile Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Panelist Metadata */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-600" />
              <span>Interviewer Credentials & Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Corporate Email</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{interviewer.email}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Evaluation Center Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{interviewer.location} Campus</span>
                </span>
              </div>
            </div>
          </div>

          {/* Technical Evaluation Competencies */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Panelist Technical Expertise & Domain Accreditation</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {interviewer.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Scheduled Available Days */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Drive Evaluation Dates Committed</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {interviewer.availableDays.map((day) => (
                <div
                  key={day}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-2 text-xs font-bold text-emerald-900"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Switch Panelist (Demo Persona Selector) */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              <span>Switch Interviewer Persona</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Select another accredited engineering panelist to test specialized technical domains, different schedules, and capacity limits.
            </p>

            <div className="space-y-2 pt-2">
              {allInterviewers.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => handleSwitchPanelist(inv.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all ${
                    inv.id === interviewer.id
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{inv.name}</span>
                    {inv.id === interviewer.id && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{inv.role}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{inv.assignedPanel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

