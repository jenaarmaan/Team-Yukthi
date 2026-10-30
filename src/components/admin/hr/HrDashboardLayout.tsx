import React, { useState } from 'react';
import { HrOverviewView } from './HrOverviewView';
import { HrAnalyticsView } from './HrAnalyticsView';
import { HrDrivesView } from './HrDrivesView';
import { HrAiAnalysisPanel } from './HrAiAnalysisPanel';
import { ChangePasswordModal } from '../../auth/ChangePasswordModal';
import { clientAuthService } from '../../../services/firebaseAuth';
import { recruitmentService } from '../../../services/storageService';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Home,
  LogOut,
  KeyRound,
  Menu,
  X,
  Sparkles,
  Smartphone,
  ChevronDown
} from 'lucide-react';

interface HrDashboardLayoutProps {
  onSwitchToCandidateApp?: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export type HrSidebarTab = 'overview' | 'analytics' | 'drives' | 'dashboard';

export const HrDashboardLayout: React.FC<HrDashboardLayoutProps> = ({
  onSwitchToCandidateApp,
  onSwitchToInterviewer,
  onSwitchToHome,
  onLogout,
  onOpenRoleSwitcher
}) => {
  // Sidebar tab state: Overview is default
  const [activeTab, setActiveTab] = useState<HrSidebarTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Right-side AI Analysis Panel state
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [activeContextQuery, setActiveContextQuery] = useState<string>('');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const currentAdmin = recruitmentService.getCurrentAdmin();

  const handleLogout = async () => {
    await clientAuthService.logout();
    if (onLogout) {
      onLogout();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  const handleDashboardClick = () => {
    if (onOpenRoleSwitcher) {
      onOpenRoleSwitcher();
    } else if (onSwitchToHome) {
      onSwitchToHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-base shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900">NIYOJAN</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  HR Admin Dashboard
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Excelsoft Technologies Recruitment Management</p>
            </div>
          </div>
        </div>

        {/* Right: View Switchers, AI Panel Toggle & Profile */}
        <div className="flex items-center gap-2.5">
          {/* AI Analysis Panel Toggle */}
          <button
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
              aiPanelOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Right-Side AI Recruitment Analysis Panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Analysis</span>
          </button>

          {/* Switch to Candidate App */}
          {onSwitchToCandidateApp && (
            <button
              onClick={onSwitchToCandidateApp}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Candidate App</span>
            </button>
          )}

          {/* Return to Public Home */}
          {onSwitchToHome && (
            <button
              onClick={onSwitchToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
              title="Return to Public Homepage"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Public Home</span>
            </button>
          )}

          {/* Profile & Security */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
              title="Reset / Change Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {currentAdmin.avatarInitials}
            </div>
          </div>
        </div>

      </header>

      {/* 2. MAIN BODY: FIXED LEFT SIDEBAR + CONTENT AREA + RIGHT-SIDE AI PANEL */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* ========================================================================= */}
        {/* STEP 2: FIXED LEFT SIDEBAR NAVIGATION                                     */}
        {/* Exact Order:                                                              */}
        {/* 1. Overview                                                               */}
        {/* 2. Analytics                                                              */}
        {/* 3. Drives                                                                 */}
        {/* 4. Dashboard (at the bottom of the sidebar)                               */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:sticky top-16 z-30 w-60 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section of Sidebar (Items 1, 2, 3) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              HR Administration
            </div>

            {/* 1. Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500'}`} />
              <span>Overview</span>
            </button>

            {/* 2. Analytics */}
            <button
              onClick={() => {
                setActiveTab('analytics');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-500'}`} />
              <span>Analytics</span>
            </button>

            {/* 3. Drives */}
            <button
              onClick={() => {
                setActiveTab('drives');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'drives'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'drives' ? 'text-white' : 'text-slate-500'}`} />
              <span>Drives</span>
            </button>
          </div>

          {/* Bottom Section of Sidebar (Item 4: Dashboard) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
              Platform Switcher
            </div>

            {/* 4. Dashboard (At the bottom of the sidebar) */}
            <button
              onClick={handleDashboardClick}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group"
              title="Return to Main Dashboard / Platform Switcher"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
                <span>Dashboard</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto min-w-0">
          {activeTab === 'overview' && (
            <HrOverviewView
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenUpcomingDrive={() => setActiveTab('drives')}
            />
          )}

          {activeTab === 'analytics' && (
            <HrAnalyticsView
              onUpdateAiInsights={(insights, recs) => {
                setAiInsights(insights);
                setAiRecommendations(recs);
              }}
              onSelectContextQuery={(q) => setActiveContextQuery(q)}
            />
          )}

          {activeTab === 'drives' && <HrDrivesView />}
        </main>

        {/* Right-Side AI Analysis Panel */}
        {aiPanelOpen && (
          <HrAiAnalysisPanel
            isOpen={aiPanelOpen}
            onClose={() => setAiPanelOpen(false)}
            activeContextQuery={activeContextQuery}
            externalInsights={aiInsights}
            externalRecommendations={aiRecommendations}
          />
        )}

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
};

