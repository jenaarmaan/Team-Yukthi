import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Minus,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  Shield,
  Bot
} from 'lucide-react';
import { AssistantMessage, AssistantRole } from './types.ts';
import { AssistantMessageItem } from './AssistantMessageItem.tsx';
import { AssistantClientService } from './assistantClientService.ts';

interface AssistantWindowProps {
  currentRole: AssistantRole;
  onClose: () => void;
  onMinimize: () => void;
  onNavigateAction?: (action: string, targetId?: string) => void;
}

export const AssistantWindow: React.FC<AssistantWindowProps> = ({
  currentRole,
  onClose,
  onMinimize,
  onNavigateAction
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize status and welcome message
  useEffect(() => {
    let isMounted = true;

    const initAssistant = async () => {
      const statusRes = await AssistantClientService.getStatus(currentRole);
      if (!isMounted) return;

      setStatus(statusRes.status);
      setSuggestions(statusRes.suggestions || []);

      // Load existing history if available
      const history = await AssistantClientService.getHistory(currentRole);
      if (!isMounted) return;

      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Provide friendly initial greeting
        const welcomeText = getWelcomeText(currentRole);
        setMessages([
          {
            id: `msg_welcome_${Date.now()}`,
            sender: 'assistant',
            text: welcomeText,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    };

    initAssistant();

    return () => {
      isMounted = false;
    };
  }, [currentRole]);

  // Auto-scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getWelcomeText = (role: AssistantRole): string => {
    switch (role) {
      case 'candidate':
        return `Hello! I am your **NIYOJAN Candidate AI Assistant**.\n\nI can help you check your interview slot schedule, guide you through dynamic HMAC QR check-in at the venue, track your waitlist standing, or explain how 4-hour standby slot offers work.`;
      case 'interviewer':
        return `Welcome Dr. / Panelist! I am your **NIYOJAN Interviewer AI Assistant**.\n\nI can assist you with upcoming slot schedules, candidate 4-tier skill verification snapshots, suggested difficulty questions (Core Java, DSA, System Design), and rubric evaluation guidelines.`;
      case 'interview_coordinator':
        return `Hello Coordinator! I am your **NIYOJAN Venue Coordination Assistant**.\n\nI can help you monitor live candidate QR check-ins, room allocations, standby recovery triage, and panel capacity balancing.`;
      case 'recruitment_manager':
        return `Hello Manager! I am your **NIYOJAN Pipeline Intelligence Assistant**.\n\nI can summarize candidate conversion funnels, talent vetting distributions, panel workloads, and recruitment bottlenecks.`;
      case 'hr_admin':
        return `Welcome HR Administrator! I am your **NIYOJAN HR Operations Assistant**.\n\nI can assist with hiring drive management, capacity thresholds, absence ratification, waitlist policies, and recruitment analytics.`;
      case 'super_admin':
        return `Greetings Super Administrator! I am your **NIYOJAN Enterprise Governance Assistant**.\n\nI provide system-wide telemetry, user role audits, immutable logging verification, and automated test execution.`;
      default:
        return `Welcome to **NIYOJAN**! I am your AI platform assistant. Ask me anything about our autonomous self-healing engine, 4-tier skill verification, or time-bound QR passes.`;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsgId = `msg_u_${Date.now()}`;
    const newMsg: AssistantMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await AssistantClientService.sendMessage(text, currentRole);
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMsgId ? { ...m, status: 'delivered' as const } : m)),
        {
          id: `msg_a_${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          timestamp: new Date().toISOString(),
          actionLinks: res.actionLinks,
          intent: res.intent,
          groundedFacts: res.groundedFacts
        }
      ]);

      if (res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: `I encountered an issue answering your request. Please try again. (${err.message})`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    await AssistantClientService.clearHistory(currentRole);
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. ${getWelcomeText(currentRole)}`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmAction = async (action: string, targetId?: string) => {
    const res = await AssistantClientService.executeAction(action, targetId, true, currentRole);
    if (!res.success) {
      throw new Error(res.message);
    }
  };

  // Role Pill Color Mapping
  const getRoleBadgeStyle = (role: AssistantRole) => {
    switch (role) {
      case 'candidate':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'interviewer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'interview_coordinator':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'recruitment_manager':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'hr_admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'super_admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col w-[360px] sm:w-[420px] h-[540px] sm:h-[600px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden font-sans animate-scale-up">
      {/* ========================================================================= */}
      {/* HEADER                                                                    */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white">NIYOJAN AI</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                v2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online • Gemini 2.5 Flash + SQLite Grounded</span>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Context Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium">Active Assistant Scope:</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getRoleBadgeStyle(currentRole)}`}>
          {currentRole.replace('_', ' ')}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* MESSAGE STREAM AREA                                                       */}
      {/* ========================================================================= */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-1">
        {messages.map((msg) => (
          <AssistantMessageItem
            key={msg.id}
            message={msg}
            onNavigateAction={onNavigateAction}
            onConfirmAction={handleConfirmAction}
          />
        ))}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-2 animate-pulse">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>NIYOJAN AI is retrieving authorized context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ========================================================================= */}
      {/* SUGGESTED PROMPTS BAR                                                     */}
      {/* ========================================================================= */}
      {suggestions.length > 0 && !isLoading && (
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto shrink-0 flex items-center gap-1.5 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Suggested:
          </span>
          {suggestions.slice(0, 3).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] font-medium text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* INPUT AREA                                                                */}
      {/* ========================================================================= */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white rounded-2xl p-1.5 transition-all shadow-inner">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about drives, slots, candidates, or workflows..."
            rows={1}
            maxLength={1000}
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-hidden py-1 px-2 leading-relaxed max-h-24"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
            title="Send Message (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-1.5 mt-1 text-[10px] text-slate-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputValue.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

