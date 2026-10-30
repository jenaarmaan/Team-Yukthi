import React, { useState } from 'react';
import { GlobalNavbar } from '../common/GlobalNavbar';
import {
  ShieldCheck,
  Zap,
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Database,
  Building2,
  Smartphone,
  ChevronRight,
  Clock,
  ExternalLink,
  Cpu,
  BarChart3,
  Layers,
  FileCheck,
  QrCode,
  UserCheck,
  AlertCircle,
  HelpCircle,
  LogIn,
  UserPlus,
  Compass,
  ArrowUpRight,
  MessageSquare,
  BookOpen,
  Code,
  FileCode,
  Terminal,
  Server,
  Key,
  Check,
  Copy,
  ChevronDown
} from 'lucide-react';

export type PublicWorkspaceTarget =
  | 'hr_admin'
  | 'recruitment_manager'
  | 'interview_coordinator'
  | 'interviewer'
  | 'candidate'
  | 'super_admin';

interface PublicHomePageProps {
  onSelectWorkspace: (workspace: PublicWorkspaceTarget) => void;
  onOpenAuth: () => void;
  onOpenDocs: () => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onSelectWorkspace,
  onOpenAuth,
  onOpenDocs
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'candidate' | 'staff' | 'persona'>('persona');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR                                        */}
      {/* ========================================================================= */}
      <GlobalNavbar
        currentPlatform="home"
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => scrollToSection('about')}
        onNavigateDocs={onOpenDocs}
        onOpenAuth={onOpenAuth}
        onSelectWorkspace={onSelectWorkspace}
      />

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        {/* Soft Ambient Pastel Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/50 via-violet-100/40 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-blue-100/40 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-violet-100/40 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-800 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Next-Gen Autonomous Campus Recruitment Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
                Intelligent Hiring.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                  Self-Healing Slots.
                </span>{' '}
                Zero Vacancy Waste.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Eliminate 25% no-show interview dropouts with real-time dynamic replacement dispatch, 4-tier skill verification, time-bound HMAC QR attendance passes, and dedicated role-based workspaces for every recruitment stakeholder.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onOpenDocs}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all duration-200 border border-indigo-500/20 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Full Documentation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectWorkspace('candidate')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs hover:border-indigo-400 active:scale-95 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Candidate Portal</span>
                </button>

                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Staff Sign-In</span>
                </button>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="text-xl font-black text-indigo-600 font-mono">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Slot Utilization</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="text-xl font-black text-violet-600 font-mono">&lt; 60s</div>
                  <div className="text-[11px] text-slate-500 font-medium">Standby Recovery</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="text-xl font-black text-emerald-600 font-mono">0ms</div>
                  <div className="text-[11px] text-slate-500 font-medium">ACID Read Latency</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="text-xl font-black text-amber-600 font-mono">4-Tier</div>
                  <div className="text-[11px] text-slate-500 font-medium">Skill Verification</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic / Dashboard Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative border frame in light theme */}
                <div className="relative rounded-2xl bg-white p-2.5 sm:p-3 border border-slate-200 shadow-xl shadow-slate-200/60">
                  
                  {/* High Quality Technology / Interviewer Workspace Visual */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 group">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                      alt="Modern Technical Recruitment Assessment"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                    {/* Floating Telemetry Card 1 */}
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-lg max-w-[210px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Self-Healing Live</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">Replacement Claimed</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">Candidate #402 accepted in 42s</p>
                    </div>

                    {/* Floating Telemetry Card 2 */}
                    <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-indigo-200 shadow-lg max-w-[210px]">
                      <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold mb-1">
                        <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Dynamic HMAC Pass</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        TTL: 4m 58s • Single-Use Nonce
                      </div>
                      <div className="mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold inline-block">
                        VERIFIED BY DESK
                      </div>
                    </div>
                  </div>

                  {/* Quick System Status Bar */}
                  <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Database className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[11px] font-medium">SQLite WAL Engine:</span>
                      <span className="text-[11px] font-bold text-emerald-600">0ms Latency</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      19 Collections Active
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT NIYOJAN                                                          */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 lg:py-28 relative border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
              About The Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Pioneering Autonomous Campus Recruitment
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              NIYOJAN was architected in collaboration with Excelsoft Technologies to resolve the chronic friction, manual rescheduling, and proxy attendance risks that plague high-volume institutional hiring drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-indigo-100 transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                The Self-Healing Engine
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                When scheduled candidates encounter travel delays, unexcused absences, or no-shows, NIYOJAN automatically reclaims the vacancy in real time. Standby candidates receive instant notifications with a 4-hour confirmation window, preserving 100% of panel capacity.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-violet-400 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 border border-violet-200/80 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                Cryptographic Fraud Defense
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Venue check-in utilizes dynamic HMAC-SHA256 QR passes with 5-minute rolling expiration, single-use cryptographic nonces, and candidate identity binding. Proxy attendance and duplicate claims are mathematically impossible.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                4-Tier Skill Verification
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Replaces unverified resume exaggeration with a transparent progression: Self-Declared, Resume-Extracted, Assessment-Verified, and HR-Verified. Technical interviewers see objective candidate competency snapshots with verified credentials.
              </p>
            </div>

          </div>

          {/* Enterprise Collaboration Banner */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="p-8 lg:p-10 lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  <Building2 className="w-4 h-4" />
                  <span>Enterprise Partnership</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Engineered for Excelsoft Technologies Campus Hiring
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Built to service thousands of engineering candidates across VTU-affiliated campuses in Mysuru, Hyderabad, and Bengaluru. Operates with sub-millisecond local SQLite transaction isolation, preventing any remote database bottlenecks during peak check-in rushes.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero Remote Cloud Latency</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Strict Role-Based Access Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Immutable Enterprise Audit Logs</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden min-h-[240px]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Engineering recruitment collaboration"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-900/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="py-12 lg:py-16 bg-white border-t border-slate-200 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                  NY
                </div>
                <span className="font-black text-lg text-slate-950 tracking-tight">NIYOJAN</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
                Next-generation autonomous, fair, and self-healing campus recruitment platform. Eliminates vacancy dropouts with 4-tier skill verification, time-bound HMAC QR check-ins, and dedicated role-based workspaces.
              </p>
              <div className="text-[11px] text-slate-500 font-medium">
                Enterprise & Campus Recruitment Infrastructure
              </div>
            </div>

            {/* Col 2: The 6 Workspaces */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">6 Workspaces</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onSelectWorkspace('hr_admin')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    HR Admin Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('recruitment_manager')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Recruitment Manager
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('interview_coordinator')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Interview Coordinator
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('interviewer')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Dedicated Interviewer
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('candidate')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Candidate Mobile Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('super_admin')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Super Administrator
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    About NIYOJAN
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDocs} className="hover:text-indigo-600 transition-colors cursor-pointer font-bold text-indigo-600">
                    Documentation
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAuth} className="hover:text-indigo-600 transition-colors cursor-pointer">
                    Login / Register
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Architecture & Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Architecture</h4>
              <div className="space-y-2 text-[11px] text-slate-600">
                <div>• Embedded ACID SQLite WAL</div>
                <div>• Zero Remote Cloud Latency</div>
                <div>• HMAC-SHA256 Signed QR Pass</div>
                <div>• Pure Scrypt + HS256 JWT</div>
                <div>• Immutable Audit Logging</div>
                <div>• 19 Typed Repositories</div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 NIYOJAN Recruitment Engine • Team Yukthi. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span>Zero-Trust RBAC</span>
              <span>•</span>
              <span>ISO 27001 Aligned</span>
              <span>•</span>
              <span>Anti-Proxy Security</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* AUTHENTICATION & QUICK ROLE SELECTION MODAL                                */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  NY
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">NIYOJAN Access Gateway</h3>
                  <p className="text-xs text-slate-500">Select your role or sign in to continue</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setAuthModalTab('persona')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  authModalTab === 'persona'
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Quick Demo Personas
              </button>
              <button
                onClick={() => setAuthModalTab('staff')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  authModalTab === 'staff'
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Staff Portal
              </button>
              <button
                onClick={() => setAuthModalTab('candidate')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  authModalTab === 'candidate'
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Candidate Sign-In
              </button>
            </div>

            {/* Tab: Quick Demo Personas */}
            {authModalTab === 'persona' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select any pre-configured persona to immediately test real recruitment workflows with authoritative JWT tokens:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('hr_admin');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Praveen Kumar</div>
                    <div className="text-[10px] text-indigo-600 font-mono">HR Administrator</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('recruitment_manager');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-violet-50/70 border border-slate-200 hover:border-violet-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-violet-600">Ananya Deshmukh</div>
                    <div className="text-[10px] text-violet-600 font-mono">Recruitment Manager</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interview_coordinator');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Rakesh Rao</div>
                    <div className="text-[10px] text-blue-600 font-mono">Venue Coordinator</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interviewer');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Dr. Murali Krishna</div>
                    <div className="text-[10px] text-amber-600 font-mono">Technical Panelist</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('candidate');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Rohan Sharma</div>
                    <div className="text-[10px] text-emerald-600 font-mono">Confirmed Candidate</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('super_admin');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600">Sushmita Jena</div>
                    <div className="text-[10px] text-rose-600 font-mono">Super Administrator</div>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Staff Portal */}
            {authModalTab === 'staff' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Staff members access the central dashboard authenticated via cryptographic JWT credentials.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('hr_admin');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open HR Admin Command Center</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interviewer');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Open Dedicated Interviewer Workspace</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Candidate Sign-In */}
            {authModalTab === 'candidate' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Candidates can register or sign in using their registered email and password to track applications and access the dynamic HMAC attendance pass.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Candidate Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('candidate');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Launch Candidate Portal</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
