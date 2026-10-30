import React, { useState } from 'react';
import { Sparkles, MessageSquare, Bot, X } from 'lucide-react';
import { AssistantRole } from './types.ts';
import { AssistantWindow } from './AssistantWindow.tsx';

interface AssistantWidgetProps {
  currentRole: AssistantRole;
  onNavigateAction?: (action: string, targetId?: string) => void;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  currentRole,
  onNavigateAction
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  return (
    <aside
      aria-label="NIYOJAN AI Assistant"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="mb-3 transition-all duration-300 transform origin-bottom-right">
          <AssistantWindow
            currentRole={currentRole}
            onClose={handleClose}
            onMinimize={handleMinimize}
            onNavigateAction={(action, targetId) => {
              if (onNavigateAction) {
                onNavigateAction(action, targetId);
              }
            }}
          />
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask NIYOJAN AI</span>
            <span className="text-[10px] text-slate-400 capitalize font-mono">({currentRole.replace('_', ' ')})</span>
          </div>

          {/* Circular Floating Button */}
          <button
            onClick={handleOpen}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/80 cursor-pointer"
            aria-label="Ask NIYOJAN AI"
            title="Ask NIYOJAN AI"
          >
            {/* Ambient Pulsing Ring */}
            <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />

            <div className="flex flex-col items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-100 animate-pulse" />
              <span className="text-[9px] font-black tracking-tighter text-white leading-none mt-0.5">
                AI
              </span>
            </div>

            {/* Unread / Active Status Badge */}
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

