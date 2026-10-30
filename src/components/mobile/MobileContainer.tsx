import React, { useState } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2 } from 'lucide-react';

interface MobileContainerProps {
  children: React.ReactNode;
  activeScenarioName: string;
  onOpenScenarioSwitcher: () => void;
  onSwitchToAdmin?: () => void;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  activeScenarioName,
  onOpenScenarioSwitcher,
  onSwitchToAdmin
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 md:p-6 select-none font-sans">
      {/* Top Bar for Desktop Preview: Mode Switcher, Admin Switcher & Active Persona Indicator */}
      <div className="flex items-center justify-between w-full max-w-md mb-2.5 px-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-[11px] border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>🏢 HR Admin Portal</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScenarioSwitcher}
            className="px-2.5 py-1 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-all"
            title="Switch QA Persona"
          >
            <span>Persona: {activeScenarioName.split(':')[0]}</span>
          </button>

          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={deviceFrameMode ? 'Expand frame' : '390x844 Mobile Frame'}
          >
            {deviceFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Mobile Device Enclosure */}
      <div
        className={`w-full bg-slate-50 transition-all duration-300 relative overflow-hidden flex flex-col ${
          deviceFrameMode
            ? 'sm:w-[390px] sm:h-[844px] sm:rounded-[48px] sm:shadow-2xl sm:ring-12 sm:ring-slate-800 sm:border-4 sm:border-slate-700'
            : 'max-w-md min-h-screen sm:rounded-2xl shadow-xl'
        }`}
      >
        {/* Device Status Bar */}
        <div className="h-11 bg-white text-slate-900 px-6 flex items-center justify-between text-xs font-semibold z-40 select-none shrink-0 border-b border-slate-100">
          <span className="font-bold text-xs tracking-tight">{currentTimeStr}</span>

          {/* Dynamic Island / Speaker Pill */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />

          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner App Canvas */}
        <div className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50">
          {children}
        </div>

        {/* Home Indicator Bar for Mobile */}
        <div className="h-4 bg-white flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
