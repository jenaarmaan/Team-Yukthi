import React, { useState } from 'react';
import { GlobalNavbar } from '../../common/GlobalNavbar';
import { HrOverviewView } from './HrOverviewView';
import { HrAnalyticsView } from './HrAnalyticsView';
import { HrDrivesView } from './HrDrivesView';
import { HrAiAnalysisPanel } from './HrAiAnalysisPanel';
import { HrFmcpRecommendationsView } from './HrFmcpRecommendationsView';
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
  ChevronDown,
  Award
} from 'lucide-react';

interface HrDashboardLayoutProps {
  onSwitchToCandidateApp?: () => void;
  onSwitchToInterviewer?: () => void;
  onSwitchToHome?: () => void;
  onLogout?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export type HrSidebarTab = 'overview' | 'fmcp' | 'analytics' | 'drives' | 'dashboard';

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
      
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR */}
      <GlobalNavbar
        currentPlatform="hr_admin"
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onNavigateHome={onSwitchToHome || (() => {})}
        onNavigateAbout={() => {
          if (onSwitchToHome) onSwitchToHome();
        }}
        onNavigateDocs={() => {
          if (onSwitchToHome) onSwitchToHome();
        }}
        onOpenAuth={() => {}}
        onLogout={onLogout || handleLogout}
        onSelectWorkspace={(ws) => {
          if (ws === 'candidate' && onSwitchToCandidateApp) onSwitchToCandidateApp();
          else if (ws === 'interviewer' && onSwitchToInterviewer) onSwitchToInterviewer();
          else if (onOpenRoleSwitcher) onOpenRoleSwitcher();
        }}
      />

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
          className={`fixed lg:sticky top-20 z-30 w-60 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform shrink-0 ${
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

            {/* 2. FMCP Candidate Recommendations */}
            <button
              onClick={() => {
                setActiveTab('fmcp');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fmcp'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className={`w-4 h-4 ${activeTab === 'fmcp' ? 'text-white' : 'text-slate-500'}`} />
                <span>Candidate Prioritisation</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase font-mono ${
                  activeTab === 'fmcp'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                FMCP
              </span>
            </button>

            {/* 3. Analytics */}
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

            {/* 4. Drives */}
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
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              onOpenUpcomingDrive={() => setActiveTab('drives')}
            />
          )}

          {activeTab === 'fmcp' && (
            <HrFmcpRecommendationsView
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
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

