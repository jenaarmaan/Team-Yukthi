import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../services/storageService';
import {
  Play,
  Square,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserX,
  FileEdit,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Building2,
  MapPin,
  HelpCircle,
  Activity
} from 'lucide-react';

interface InterviewExecutionViewProps {
  slotId: string;
  candidateName: string;
  candidateId: string;
  role: string;
  hiringDriveTitle: string;
  roomOrPanel: string;
  venue: string;
  initialStatus?: string;
  onOpenScorecard: () => void;
  onOpenConflictModal: () => void;
  onOpenIncidentModal: () => void;
  onBackToDashboard: () => void;
}

export const InterviewExecutionView: React.FC<InterviewExecutionViewProps> = ({
  slotId,
  candidateName,
  candidateId,
  role,
  hiringDriveTitle,
  roomOrPanel,
  venue,
  initialStatus = 'scheduled',
  onOpenScorecard,
  onOpenConflictModal,
  onOpenIncidentModal,
  onBackToDashboard
}) => {
  const [executionStatus, setExecutionStatus] = useState<string>(initialStatus);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [liveNotes, setLiveNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Interview Timer
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      const res = await recruitmentService.executeInterviewAction(slotId, action, liveNotes);
      if (res.success) {
        if (action === 'start_interview') {
          setExecutionStatus('in_progress');
          setTimerActive(true);
          setActionNotice('Interview started. Live session timer active.');
        } else if (action === 'end_interview') {
          setExecutionStatus('completed');
          setTimerActive(false);
          setActionNotice('Interview concluded. Opening evaluation scorecard...');
          setTimeout(() => onOpenScorecard(), 1500);
        } else if (action === 'mark_candidate_present') {
          setExecutionStatus('candidate_present');
          setActionNotice('Candidate marked present at venue.');
        } else if (action === 'mark_no_show') {
          setExecutionStatus('no_show');
          setTimerActive(false);
          setActionNotice('Candidate marked as no-show. Self-Healing recovery incident triggered.');
        }
      } else {
        alert(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
              Live Interview Console
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                executionStatus === 'in_progress'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 animate-pulse'
                  : executionStatus === 'completed'
                  ? 'bg-sky-500/30 text-sky-300 border border-sky-400/30'
                  : executionStatus === 'no_show'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-400/30'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              Status: {executionStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white">{candidateName}</h1>
          <p className="text-xs text-indigo-200">
            {role} &bull; {roomOrPanel} &bull; {venue}
          </p>
        </div>

        {/* Stopwatch Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4 min-w-[220px]">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Session Duration</div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums tracking-wider">
              {formatTimer(secondsElapsed)}
            </div>
            <div className="text-[10px] text-slate-400">Target: 60 mins</div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Session Workspace & Live Observations */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live Action Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Interview Execution Controls</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {executionStatus !== 'in_progress' && executionStatus !== 'completed' && (
                <>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction('mark_candidate_present')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Present</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction('start_interview')}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Interview Session</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction('mark_no_show')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs"
                  >
                    <UserX className="w-4 h-4 text-rose-600" />
                    <span>Mark No-Show</span>
                  </button>
                </>
              )}

              {executionStatus === 'in_progress' && (
                <button
                  disabled={isSubmitting}
                  onClick={() => handleAction('end_interview')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Conclude Interview & Evaluate</span>
                </button>
              )}

              {executionStatus === 'completed' && (
                <button
                  onClick={onOpenScorecard}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Open Evaluation Scorecard</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Interviewer Scratchpad */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-slate-600" />
                <span>Interviewer Session Scratchpad & Observational Notes</span>
              </h3>
              <span className="text-[11px] text-slate-400">Auto-saved to draft</span>
            </div>

            <textarea
              value={liveNotes}
              onChange={(e) => setLiveNotes(e.target.value)}
              placeholder="Take live technical notes during the interview: code complexity explanations, communication clarity, problem-solving method, architectural edge cases..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 resize-none h-44 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Right Column: Support, Escalation & Operations */}
        <div className="space-y-5">
          {/* Operational Support Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operational Actions & Governance
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenConflictModal}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Conflict of Interest</span>
                    <span className="text-[11px] text-slate-500">Confidential reassignment request</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenIncidentModal}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Report Operational Issue</span>
                    <span className="text-[11px] text-slate-500">Audio/video drops, venue overlap</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Self-Healing Context */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-950">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Self-Healing Engine Integration</span>
            </div>
            <p className="text-[11px] text-indigo-800/80 leading-relaxed">
              If candidate fails to report within 15 minutes of slot start time, marking "No-Show" will automatically free up this panel slot and dispatch an instant replacement alert to ranked standby candidates.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-xl shadow-2xs"
          >
            &larr; Back to Schedule Overview
          </button>
        </div>
      </div>
    </div>
  );
};

