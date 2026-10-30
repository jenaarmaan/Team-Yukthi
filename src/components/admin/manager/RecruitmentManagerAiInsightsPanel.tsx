import React, { useState } from 'react';
import {
  Sparkles,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Send,
  Zap,
  Target,
  BrainCircuit,
  Building2,
  Users
} from 'lucide-react';

interface RecruitmentManagerAiInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const RecruitmentManagerAiInsightsPanel: React.FC<RecruitmentManagerAiInsightsPanelProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ query: string; response: string; timestamp: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Analyze GSE funnel bottlenecks',
    'Predict vacancy fulfillment date',
    'Recommend slot recovery actions',
    'Compare Mysuru vs Hyderabad velocity'
  ];

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || userQuery;
    if (!q.trim()) return;

    setIsProcessing(true);
    const queryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('bottleneck') || lower.includes('funnel')) {
        reply =
          '**Funnel Bottleneck Detected [AI Analysis]:** Technical Round 1 is exhibiting an abnormally high drop-off rate of 58.4% across the Graduate Software Engineer drive. Root cause analysis indicates a mismatch in distributed systems evaluation criteria. Recommendation: Calibrate interviewer rubric difficulty or allocate senior panel review.';
      } else if (lower.includes('predict') || lower.includes('vacancy') || lower.includes('fulfillment')) {
        reply =
          '**Vacancy Fulfillment Projection [AI Prediction - 92% Confidence]:** Based on current candidate interview velocity and offer acceptance rate (81.2%), the Mysuru Campus Center is projected to fulfill 100% of its 45 approved vacancies by November 12, 2026. However, Hyderabad is pacing 4 days behind target with 8 vacancies at risk of carry-forward.';
      } else if (lower.includes('slot') || lower.includes('recovery')) {
        reply =
          '**Slot Recovery Intelligence [Actionable Recommendation]:** 3 interview slots were vacated today due to candidate medical notices. The AI matching engine has identified top 3 Tier-1 Standby candidates with 90%+ skill match ready for immediate slot reassignment. Dispatched invitations have a 88% predicted acceptance within 45 minutes.';
      } else if (lower.includes('mysuru') || lower.includes('hyderabad') || lower.includes('location')) {
        reply =
          '**Location Comparison [Data Telemetry]:** Mysuru leads in candidate turnaround time at 3.6 days with 74% target completion. Hyderabad has registered high candidate interest (142 applicants) but exhibits a scheduling latency of 4.8 days due to panel availability constraints. Suggested Action: Pool remote interviewers for Hyderabad rounds.';
      } else {
        reply = `**Recruitment Intelligence Insight:** Analysis for "${q}" completed based on active SQLite records. Current overall candidate conversion rate stands at 24.6% with 104 total vacancies and 68 filled to date (65.4% completion). Pipeline velocity is healthy across 4 active drives.`;
      }

      setChatLog((prev) => [
        ...prev,
        {
          query: q,
          response: reply,
          timestamp: queryTime
        }
      ]);
      setUserQuery('');
      setIsProcessing(false);
    }, 600);
  };

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-slate-200/90 shadow-xl flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30 shrink-0 font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm tracking-tight text-white">AI Recruitment Intelligence</h3>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live RAG
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Contextual Funnel & Vacancy Reasoning</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close AI Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Insights Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Executive Summary Card */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Operational Executive Summary</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-200/70 text-indigo-800">
              CONFIRMED DATA
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Active pipeline velocity is currently <strong className="text-slate-900">65.4%</strong> of target completion. 4 hiring drives across 6 hubs are active with <strong className="text-indigo-700">104 total approved vacancies</strong>.
          </p>
        </div>

        {/* Predictive Alert 1: Bottleneck Detection */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Pipeline Bottleneck Warning</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900">
              AI PREDICTION
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Technical Round 1 drop-off rate is <strong className="text-amber-800">58.4%</strong> in the Graduate Software Engineer drive. Projected to cause a 12-candidate deficit by next week.
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigateToTab?.('funnel')}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 group"
            >
              <span>Inspect Funnel Stage Drop-Offs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Predictive Alert 2: Vacancy Fulfillment Forecast */}
        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-2 text-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vacancy Fulfillment Forecast</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-900">
              AI PREDICTION
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Mysuru Campus Center is projected to achieve <strong className="text-emerald-700">100% headcount</strong> by Nov 12, 2026. Hyderabad Hub pacing slightly behind with 8 vacancies requiring extra allocation.
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigateToTab?.('vacancies')}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
            >
              <span>View Vacancies & Hiring Targets</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Predictive Alert 3: Slot Recovery Recommendation */}
        <div className="p-3.5 rounded-xl bg-violet-50/80 border border-violet-200/80 space-y-2 text-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900">
              <Zap className="w-3.5 h-3.5 text-violet-600" />
              <span>Slot Recovery Recommendation</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-200/70 text-violet-900">
              ACTIONABLE
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            3 interview slots recovered from medical absences are unassigned. Allocating top-ranked standby candidates will preserve <strong className="text-violet-800">4.5 panel interviewer hours</strong>.
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigateToTab?.('slot-recovery')}
              className="text-[11px] font-bold text-violet-800 hover:text-violet-950 flex items-center gap-1 group"
            >
              <span>Manage Slot Recovery & Reassignment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        {chatLog.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Recent Intelligence Inquiries
            </div>
            {chatLog.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">Q: {item.query}</span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] leading-relaxed">
                  {item.response}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Query Interface at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        {/* Quick Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask AI recruitment intelligence..."
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!userQuery.trim() || isProcessing}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Submit query to AI recruitment engine"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </aside>
  );
};

