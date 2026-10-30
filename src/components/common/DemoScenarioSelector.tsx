import React from 'react';
import { recruitmentService } from '../../services/storageService';
import { Users, RotateCcw, X, Check, ArrowRight, UserPlus, Info } from 'lucide-react';

interface DemoScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterNew: () => void;
}

export const DemoScenarioSelector: React.FC<DemoScenarioSelectorProps> = ({
  isOpen,
  onClose,
  onOpenRegisterNew
}) => {
  if (!isOpen) return null;

  const currentKey = recruitmentService.getCurrentPersonaKey();
  const personas = recruitmentService.getAvailablePersonas();

  const handleSelect = (key: string) => {
    recruitmentService.switchPersona(key);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset all demo data back to default initial state?')) {
      recruitmentService.resetDemoData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">QA Scenario Test Switcher</h3>
              <p className="text-[11px] text-slate-500">Test all 6 end-to-end recruitment candidate journeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="px-5 py-2.5 bg-indigo-50/60 border-b border-indigo-100/50 text-[11px] text-indigo-900 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            Select a candidate persona below to instantly inspect their specific recruitment workflow, interview status, QR check-in pass, or absence policy.
          </span>
        </div>

        {/* List of personas */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {personas.map((p) => {
            const isSelected = p.key === currentKey;
            return (
              <button
                key={p.key}
                onClick={() => handleSelect(p.key)}
                className={`w-full text-left p-3 pt-3.5 rounded-xl transition-all border flex items-start gap-3 ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : p.label.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{p.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-indigo-800 mt-0.5">{p.scenarioName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenRegisterNew();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/80"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Custom Registration</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Reset to factory demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
