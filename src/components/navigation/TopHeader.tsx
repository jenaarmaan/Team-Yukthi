import React from 'react';
import { ArrowLeft, Bell, Users } from 'lucide-react';
import { recruitmentService } from '../../services/storageService';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications: () => void;
  onOpenScenarioSwitcher: () => void;
  onSwitchToAdmin?: () => void;
  unreadNotificationsCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  onOpenNotifications,
  onOpenScenarioSwitcher,
  onSwitchToAdmin,
  unreadNotificationsCount
}) => {
  const currentPersona = recruitmentService.getCurrentProfile();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left Slot: Back button OR NIYOJAN Brand Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xs">
                <span className="font-extrabold text-sm tracking-wider">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">
                  NIYOJAN
                </span>
                <span className="text-[9px] font-semibold text-indigo-700 uppercase tracking-widest mt-0.5">
                  Excelsoft Tech
                </span>
              </div>
            </div>
          )}

          {title && (
            <div className="truncate pl-1">
              <h1 className="text-sm font-bold text-slate-900 truncate leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right Slot: Admin Switcher + Persona Scenario Switcher + Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="hidden xs:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
              title="Open Company HR Admin Dashboard"
            >
              <span>🏢 Admin</span>
            </button>
          )}

          <button
            onClick={onOpenScenarioSwitcher}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/60 active:scale-95 transition-all"
            title="Switch Candidate Journey / QA Persona"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[70px] sm:max-w-[120px] truncate text-[11px]">
              {currentPersona.fullName.split(' ')[0]}
            </span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 relative transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
