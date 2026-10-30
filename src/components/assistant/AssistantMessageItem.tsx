import React, { useState } from 'react';
import {
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AssistantMessage, AssistantActionLink } from './types.ts';

interface AssistantMessageItemProps {
  message: AssistantMessage;
  onNavigateAction?: (action: string, targetId?: string) => void;
  onConfirmAction?: (action: string, targetId?: string) => Promise<void>;
}

export const AssistantMessageItem: React.FC<AssistantMessageItemProps> = ({
  message,
  onNavigateAction,
  onConfirmAction
}) => {
  const isUser = message.sender === 'user';
  const [pendingConfirmAction, setPendingConfirmAction] = useState<AssistantActionLink | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedMessage, setExecutedMessage] = useState<string | null>(null);

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleActionClick = async (link: AssistantActionLink) => {
    if (link.requiresConfirmation) {
      setPendingConfirmAction(link);
      return;
    }

    if (onNavigateAction) {
      onNavigateAction(link.action, link.targetId);
    }
  };

  const handleConfirmExecution = async () => {
    if (!pendingConfirmAction || !onConfirmAction) return;
    setIsExecuting(true);
    try {
      await onConfirmAction(pendingConfirmAction.action, pendingConfirmAction.targetId);
      setExecutedMessage(`Action "${pendingConfirmAction.label}" confirmed and processed.`);
      setPendingConfirmAction(null);
    } catch (err: any) {
      setExecutedMessage(`Execution failed: ${err.message || 'Error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Helper to render text with bold and list styling
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check if bullet point
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      // Check if bold title line
      const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return (
        <p
          key={idx}
          className={`leading-relaxed ${isBullet ? 'pl-2 text-slate-700 font-normal' : ''}`}
          dangerouslySetInnerHTML={{ __html: cleanLine }}
        />
      );
    });
  };

  return (
    <div className={`flex gap-2.5 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-2xs ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs'
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
          }`}
        >
          {renderFormattedText(message.text)}

          {/* Action Links Buttons */}
          {!isUser && message.actionLinks && message.actionLinks.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
              {message.actionLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleActionClick(link)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3 h-3 text-indigo-500" />
                </button>
              ))}
            </div>
          )}

          {/* Inline Confirmation Prompt if required */}
          {pendingConfirmAction && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Confirm Required Action</span>
              </div>
              <p>
                {pendingConfirmAction.confirmationMessage ||
                  `Are you sure you want to execute "${pendingConfirmAction.label}"? This will modify authoritative recruitment data.`}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleConfirmExecution}
                  disabled={isExecuting}
                  className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer disabled:opacity-50"
                >
                  {isExecuting ? 'Processing...' : 'Confirm Execution'}
                </button>
                <button
                  onClick={() => setPendingConfirmAction(null)}
                  disabled={isExecuting}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-semibold text-[11px] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Executed Status Notice */}
          {executedMessage && (
            <div className="mt-2 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{executedMessage}</span>
            </div>
          )}
        </div>

        {/* Timestamp & Status */}
        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
          <span>{formatTimestamp(message.timestamp)}</span>
          {isUser && message.status && (
            <span>• {message.status === 'delivered' ? '✓✓' : message.status}</span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

