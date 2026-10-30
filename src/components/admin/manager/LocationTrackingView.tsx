import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Compass,
  Briefcase
} from 'lucide-react';

interface HubLocationData {
  id: string;
  name: string;
  hubType: string;
  state: string;
  activeDrives: number;
  approvedVacancies: number;
  registeredCandidates: number;
  interviewsConducted: number;
  selectedCandidates: number;
  fulfillmentPct: number;
  turnaroundDays: number;
  status: 'on_track' | 'attention_needed' | 'behind_target';
  actionNote: string;
  // SVG relative map coordinates (percentage based within visual container)
  mapCoords: { x: number; y: number };
}

export const LocationTrackingView: React.FC = () => {
  const [selectedHubId, setSelectedHubId] = useState<string>('mysuru');

  const hubs: HubLocationData[] = [
    {
      id: 'mysuru',
      name: 'Mysuru Campus Center',
      hubType: 'Global Headquarters & Learning Center',
      state: 'Karnataka',
      activeDrives: 2,
      approvedVacancies: 45,
      registeredCandidates: 64,
      interviewsConducted: 38,
      selectedCandidates: 34,
      fulfillmentPct: 76,
      turnaroundDays: 3.4,
      status: 'on_track',
      actionNote: 'Pacing on track with 76% target fulfillment. Panel capacity is balanced.',
      mapCoords: { x: 39, y: 79 }
    },
    {
      id: 'bengaluru',
      name: 'Bengaluru Tech Hub',
      hubType: 'Core Engineering & Cloud Development',
      state: 'Karnataka',
      activeDrives: 2,
      approvedVacancies: 25,
      registeredCandidates: 38,
      interviewsConducted: 22,
      selectedCandidates: 15,
      fulfillmentPct: 60,
      turnaroundDays: 4.2,
      status: 'on_track',
      actionNote: 'Cloud DevOps evaluations active. 10 remaining vacancies with good candidate pipeline.',
      mapCoords: { x: 44, y: 76 }
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad Technology Center',
      hubType: 'Enterprise Solutions & AI Lab',
      state: 'Telangana',
      activeDrives: 1,
      approvedVacancies: 16,
      registeredCandidates: 26,
      interviewsConducted: 14,
      selectedCandidates: 9,
      fulfillmentPct: 56,
      turnaroundDays: 4.8,
      status: 'attention_needed',
      actionNote: 'Requires additional recruitment efforts: 7 vacancies remain with 8 days left.',
      mapCoords: { x: 48, y: 62 }
    },
    {
      id: 'pune',
      name: 'Pune Development Center',
      hubType: 'QA & Platforms Center',
      state: 'Maharashtra',
      activeDrives: 1,
      approvedVacancies: 10,
      registeredCandidates: 14,
      interviewsConducted: 8,
      selectedCandidates: 6,
      fulfillmentPct: 60,
      turnaroundDays: 4.5,
      status: 'on_track',
      actionNote: 'QA Automation interviews moving steadily. 4 vacancies remaining.',
      mapCoords: { x: 34, y: 58 }
    },
    {
      id: 'chennai',
      name: 'Chennai Innovation Lab',
      hubType: 'Specialized Hardware & Mobile Lab',
      state: 'Tamil Nadu',
      activeDrives: 1,
      approvedVacancies: 5,
      registeredCandidates: 8,
      interviewsConducted: 5,
      selectedCandidates: 3,
      fulfillmentPct: 60,
      turnaroundDays: 3.9,
      status: 'on_track',
      actionNote: 'Specialized domain round underway. 2 vacancies remaining.',
      mapCoords: { x: 52, y: 80 }
    },
    {
      id: 'delhi',
      name: 'Delhi-NCR Regional Office',
      hubType: 'Regional Client Liaison & Delivery',
      state: 'Delhi-NCR',
      activeDrives: 1,
      approvedVacancies: 3,
      registeredCandidates: 4,
      interviewsConducted: 2,
      selectedCandidates: 1,
      fulfillmentPct: 33,
      turnaroundDays: 5.2,
      status: 'behind_target',
      actionNote: 'Candidate registration volume below threshold. Additional university outreach needed.',
      mapCoords: { x: 41, y: 28 }
    }
  ];

  const selectedHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                GEOGRAPHIC DEPLOYMENT
              </span>
              <h2 className="text-xl font-bold text-slate-900">Location-Wise Recruitment Tracking</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live tracking across 6 strategic recruitment hubs in India with regional targets, vacancies, and interactive map
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>6 Regional Hubs Active</span>
            </span>
          </div>
        </div>

        {/* Priority Intervention Alert (Item 10) */}
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-0.5">
            <strong className="text-amber-950 font-bold">Regional Intervention Notice:</strong>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Hyderabad Technology Center (56% met)</strong> and <strong className="text-slate-900">Delhi-NCR (33% met)</strong> have been identified as requiring immediate recruitment support. Recommended action: Route virtual panel slots to conduct remote assessments for Hyderabad candidates.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map & Hub Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive India Map Visualizer (Item 10) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Interactive Regional Hub Visualizer</span>
              </h3>
              <p className="text-xs text-slate-400">Click a city pin to inspect facility operations</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
              INDIA NETWORK
            </span>
          </div>

          {/* Interactive Geographic Map Canvas */}
          <div className="relative w-full aspect-square max-h-[440px] my-auto bg-slate-950/70 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center">
            
            {/* SVG India Map Graphic Outline */}
            <svg viewBox="0 0 400 450" className="w-full h-full opacity-30 pointer-events-none">
              <path
                d="M 175 40 Q 200 60 215 90 T 235 140 T 280 180 T 310 220 T 270 250 T 240 280 T 210 320 T 190 380 T 170 420 T 150 380 T 140 320 T 110 260 T 90 220 T 110 180 T 140 140 T 160 80 Z"
                fill="#312e81"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Interactive City Nodes */}
            {hubs.map((hub) => {
              const isSelected = hub.id === selectedHubId;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHubId(hub.id)}
                  style={{
                    left: `${hub.mapCoords.x}%`,
                    top: `${hub.mapCoords.y}%`
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  title={`${hub.name} (${hub.fulfillmentPct}% filled)`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for active selection */}
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-indigo-500/40 animate-ping" />
                    )}

                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-lg transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-white ring-2 ring-indigo-400'
                          : hub.status === 'on_track'
                          ? 'bg-emerald-500/90 text-white border-emerald-300'
                          : 'bg-amber-500/90 text-white border-amber-300'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* City Label Badge */}
                    <div
                      className={`absolute top-8 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-white text-slate-900 border border-indigo-200'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {hub.name.split(' ')[0]} ({hub.fulfillmentPct}%)
                    </div>
                  </div>
                </button>
              );
            })}

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>● Green: On Track (&gt;60%)</span>
            <span>● Amber: Action Needed (&lt;60%)</span>
            <span>Selected: <strong className="text-white">{selectedHub.name}</strong></span>
          </div>

        </div>

        {/* Right Column: Selected Location Detail Card & Comparative Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Selected Location Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    {selectedHub.state}
                  </span>
                  <span className="text-xs text-slate-500">{selectedHub.hubType}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedHub.name}</h3>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                  selectedHub.status === 'on_track'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {selectedHub.status.replace('_', ' ')}
              </span>
            </div>

            {/* 6 Key Location Metrics (Items 2 to 8) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Vacancies</span>
                <div className="text-xl font-black text-slate-900">{selectedHub.approvedVacancies}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Pool</span>
                <div className="text-xl font-black text-indigo-600">{selectedHub.registeredCandidates}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Interviews Done</span>
                <div className="text-xl font-black text-slate-900">{selectedHub.interviewsConducted}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Candidates</span>
                <div className="text-xl font-black text-emerald-600">{selectedHub.selectedCandidates}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fulfillment Rate</span>
                <div className="text-xl font-black text-indigo-700">{selectedHub.fulfillmentPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Turnaround Time</span>
                <div className="text-xl font-black text-slate-900">{selectedHub.turnaroundDays} Days</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Location Target Completion:</span>
                <span className="font-mono text-slate-900 font-bold">{selectedHub.selectedCandidates} / {selectedHub.approvedVacancies} Filled ({selectedHub.fulfillmentPct}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedHub.fulfillmentPct >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${selectedHub.fulfillmentPct}%` }}
                />
              </div>
            </div>

            {/* Action Note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Hub Operational Status: </strong>
              {selectedHub.actionNote}
            </div>

          </div>

          {/* Quick Hub Switcher List */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">All Deployment Hubs</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hubs.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHubId(h.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedHubId === h.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate">{h.name.split(' ')[0]} Hub</div>
                  <span className="text-[10px] text-slate-500 font-mono">{h.fulfillmentPct}% fulfilled</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
