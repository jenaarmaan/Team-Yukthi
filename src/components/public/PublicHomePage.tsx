import React, { useState } from 'react';
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
}

type DocTabId =
  | 'overview'
  | 'tech_stack'
  | 'auth_gateway'
  | 'qr_attendance'
  | 'workspaces'
  | 'self_healing'
  | 'team_credits';

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onSelectWorkspace,
  onOpenAuth
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'candidate' | 'staff' | 'persona'>('persona');
  const [activeDocTab, setActiveDocTab] = useState<DocTabId>('overview');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HEADER AND NAVIGATION                                                  */}
      {/* Requirements:                                                             */}
      {/* - Login/Register option moved to the RIGHT side                           */}
      {/* - Removed from nav: Workspaces, Why NIYOJAN, How It Works, Contact,       */}
      {/*   Candidate Portal                                                        */}
      {/* - Added: Documentation section nav link                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LEFT: NIYOJAN Logo & Brand Wordmark */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              NY
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 bg-clip-text text-transparent">
                  NIYOJAN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 tracking-wider">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Intelligent Hiring. Seamless Opportunities.
              </span>
            </div>
          </div>

          {/* MIDDLE: Simplified Navigation Links (About & Documentation only) */}
          <nav className="flex items-center gap-8 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-indigo-600 transition-colors py-1 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('docs')}
              className="hover:text-indigo-600 transition-colors py-1 cursor-pointer flex items-center gap-1.5 text-indigo-600 font-bold"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Documentation</span>
            </button>
          </nav>

          {/* RIGHT: Login / Register Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all duration-200 border border-indigo-500/20 cursor-pointer"
              title="Open Authentication & Quick Sign-In"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-100 group-hover:translate-x-0.5 transition-transform" />
              <span>Login / Register</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>
          </div>

        </div>
      </header>

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
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="text-slate-500 text-[11px]">In Partnership with Excelsoft</span>
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
                  onClick={() => scrollToSection('docs')}
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
      {/* 4. COMPREHENSIVE DOCUMENTATION SECTION                                    */}
      {/* Reference Model: UEMP Platform Documentation Style                        */}
      {/* ========================================================================= */}
      <section id="docs" className="py-20 lg:py-28 relative border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Technical & Operational Documentation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              NIYOJAN Platform Documentation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Welcome to the NIYOJAN Recruitment Engine documentation. This guide provides an in-depth architectural and operational overview of the platform's features and the specialized roles of HR Administrators, Recruitment Managers, Interview Coordinators, Dedicated Interviewers, Candidates, and Super Administrators.
            </p>
          </div>

          {/* Interactive Documentation Navigator Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs max-w-5xl mx-auto">
            <button
              onClick={() => setActiveDocTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview & Problem</span>
            </button>

            <button
              onClick={() => setActiveDocTab('tech_stack')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'tech_stack'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Technologies</span>
            </button>

            <button
              onClick={() => setActiveDocTab('auth_gateway')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'auth_gateway'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Login & Gateways</span>
            </button>

            <button
              onClick={() => setActiveDocTab('qr_attendance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'qr_attendance'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Dynamic HMAC QR Flow</span>
            </button>

            <button
              onClick={() => setActiveDocTab('workspaces')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'workspaces'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>6 Dedicated Workspaces</span>
            </button>

            <button
              onClick={() => setActiveDocTab('self_healing')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'self_healing'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Self-Healing & 4-Tier Skills</span>
            </button>

            <button
              onClick={() => setActiveDocTab('team_credits')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDocTab === 'team_credits'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Team & Credits</span>
            </button>
          </div>

          {/* Tab Content 1: Overview */}
          {activeDocTab === 'overview' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">1. Executive Overview</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Autonomous recruitment orchestration engineered for high-volume campus hiring environments.
                </p>
              </div>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>NIYOJAN</strong> is a dedicated campus recruitment platform designed to eliminate the systemic inefficiencies of university hiring drives. Developed in direct collaboration with <strong>Excelsoft Technologies</strong> for engineering campuses across Mysuru, Hyderabad, and Bengaluru, it addresses the three most prevalent failure points in modern recruitment drives:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</div>
                    <div className="text-base font-bold text-slate-900">15–25% Slot No-Shows</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Candidates miss allocated interview slots due to transit delays or duplicate offers, leaving interview panels idle and wasting valuable technical engineering hours.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</div>
                    <div className="text-base font-bold text-slate-900">Proxy Attendance & Fraud</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Static QR codes or paper check-in sheets allow candidates to share screenshots or send proxies to sign in on their behalf at congested venue entrances.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</div>
                    <div className="text-base font-bold text-slate-900">Unverified Resume Inflation</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Technical interviewers waste initial screening minutes validating whether claimed competencies match genuine candidate capabilities without standardized verification.
                    </p>
                  </div>
                </div>

                <p className="pt-2">
                  NIYOJAN solves this through an autonomous architecture comprising a <strong>Self-Healing Engine</strong> that automatically reclaims missed slots within 60 seconds, <strong>time-bound cryptographic HMAC-SHA256 QR passes</strong> with single-use nonces, a <strong>4-tier progressive skill verification model</strong>, and <strong>embedded ACID SQLite persistence</strong> delivering sub-millisecond local reads/writes without remote cloud dependencies.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Core Technologies */}
          {activeDocTab === 'tech_stack' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">2. Core Technologies & Architecture</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Full-stack architectural specifications and offline-first infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                    <Code className="w-5 h-5 text-indigo-600" />
                    <span>Frontend Client Stack</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li>• <strong>React 19 & TypeScript:</strong> Strict typing with comprehensive component modularity.</li>
                    <li>• <strong>Tailwind CSS:</strong> High-contrast, clean enterprise design system with responsive layouts.</li>
                    <li>• <strong>Vite 8:</strong> High-performance ES module bundler producing sub-second builds.</li>
                    <li>• <strong>Lucide React Icons:</strong> Cohesive semantic iconography across all 6 dashboards.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
                    <Server className="w-5 h-5 text-violet-600" />
                    <span>Backend Server Stack</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li>• <strong>Node.js 22 LTS:</strong> Modern asynchronous event-driven JavaScript runtime.</li>
                    <li>• <strong>Express 4 (TypeScript):</strong> Clean layered MVC architecture with strict routing and validation.</li>
                    <li>• <strong>RESTful JSON APIs:</strong> Standardized error and response contracts across all resources.</li>
                    <li>• <strong>In-Memory + Disk Sync:</strong> Atomic sync with instant reactivity.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>Database & ACID Storage</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li>• <strong>Embedded SQLite (WAL Mode):</strong> Zero remote network latency; eliminates cloud connection timeouts.</li>
                    <li>• <strong>19 Typed Repositories:</strong> Strongly typed schema contracts for drives, slots, scores, and users.</li>
                    <li>• <strong>Local File Storage:</strong> Tamper-resistant local document and resume storage.</li>
                    <li>• <strong>Immutable Audit Trails:</strong> Every status transition and score is permanently logged.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <span>Security & Cryptography</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li>• <strong>Pure Scrypt Password Hashing:</strong> Secure memory-hard key derivation (`crypto.scryptSync`).</li>
                    <li>• <strong>HS256 Stateless JWT Tokens:</strong> Cryptographically signed session tokens with RBAC claims.</li>
                    <li>• <strong>HMAC-SHA256 Dynamic QR Codes:</strong> Time-bound 5-minute single-use attendance nonces.</li>
                    <li>• <strong>Zero-Trust Note Isolation:</strong> Technical panelists cannot view confidential HR recruiter notes.</li>
                  </ul>
                </div>
              </div>

              {/* Code Snippet Example */}
              <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">server/repositories/sqliteDb.ts — Database Initialization</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `const db = new DatabaseSync('data/niyojan.db');\ndb.exec('PRAGMA journal_mode = WAL;');\ndb.exec('PRAGMA synchronous = NORMAL;');`,
                        'sqlite_code'
                      )
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCodeId === 'sqlite_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === 'sqlite_code' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`// Embedded ACID SQLite with WAL Mode: 0ms Network Latency
const db = new DatabaseSync('data/niyojan.db');
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');
db.exec('PRAGMA foreign_keys = ON;');`}
                </pre>
              </div>
            </div>
          )}

          {/* Tab Content 3: Authentication & Gateway */}
          {activeDocTab === 'auth_gateway' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">3. Authentication & Access Gateway</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Unified authentication landing page, role-based redirection, and pre-configured demo personas.
                </p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  The NIYOJAN Authentication Gateway (<code className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs">AuthPage.tsx</code>) provides a unified portal for user sign-in, self-registration, password recovery, and staff invitation onboarding.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-indigo-600" />
                      <span>Key Functionalities</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      <li>• <strong>Email & Password Login:</strong> Scrypt password verification with unique per-user salt.</li>
                      <li>• <strong>Role-Based Redirection:</strong> Automatically routes users to their specific workspace dashboard upon sign-in.</li>
                      <li>• <strong>Two-Role Registration:</strong> Allows open registration for <em>Candidates</em> and <em>HR Administrators</em>.</li>
                      <li>• <strong>Staff Invitation Workflow:</strong> Recruitment Managers, Coordinators, and Interviewers are invited by HR Admins with secure onboarding tokens.</li>
                      <li>• <strong>Password Reset:</strong> In-session reset with credential verification and audit logging.</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Role-Based Redirection Mapping</span>
                    </h4>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-indigo-700">candidate</span>
                        <span className="text-slate-500">→ /candidate (Mobile App View)</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-amber-700">interviewer</span>
                        <span className="text-slate-500">→ /interviewer (Dedicated Workspace)</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-indigo-700">hr_admin</span>
                        <span className="text-slate-500">→ /admin (HR Admin Dashboard)</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-violet-700">recruitment_manager</span>
                        <span className="text-slate-500">→ /admin (Manager Pipeline Desk)</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-blue-700">interview_coordinator</span>
                        <span className="text-slate-500">→ /admin (Venue Coordination Desk)</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200 flex justify-between">
                        <span className="text-rose-700">super_admin</span>
                        <span className="text-slate-500">→ /admin (Super Admin Console)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-configured Demo Personas Table */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-base font-bold text-slate-900">Pre-Configured Demo Personas for Quick Evaluation</h4>
                  <p className="text-xs text-slate-500">
                    To immediately test live recruitment workflows without manual registration, use any of the pre-configured system personas:
                  </p>
                  
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Persona Name</th>
                          <th className="py-3 px-4">System Role</th>
                          <th className="py-3 px-4">Mock Email</th>
                          <th className="py-3 px-4">Specialized Access Scope</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Praveen Kumar</td>
                          <td className="py-2.5 px-4 font-mono text-indigo-700">hr_admin</td>
                          <td className="py-2.5 px-4 font-mono">praveen.kumar@excelsoftcorp.com</td>
                          <td className="py-2.5 px-4">Drive creation, capacity limits, RAG analytics with voice search, policy thresholds.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Ananya Deshmukh</td>
                          <td className="py-2.5 px-4 font-mono text-violet-700">recruitment_manager</td>
                          <td className="py-2.5 px-4 font-mono">ananya.deshmukh@excelsoftcorp.com</td>
                          <td className="py-2.5 px-4">Candidate vetting, skill snapshots, demand forecasting, panel matching.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Rakesh Rao</td>
                          <td className="py-2.5 px-4 font-mono text-blue-700">interview_coordinator</td>
                          <td className="py-2.5 px-4 font-mono">rakesh.rao@excelsoftcorp.com</td>
                          <td className="py-2.5 px-4">Venue check-in scanner desk, room assignment, live standby recovery triage.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Dr. Murali Krishna</td>
                          <td className="py-2.5 px-4 font-mono text-amber-700">interviewer</td>
                          <td className="py-2.5 px-4 font-mono">murali.krishna@excelsoftcorp.com</td>
                          <td className="py-2.5 px-4">Candidate technical profile, question bank, rubric scorecards, decisions.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Rohan Sharma</td>
                          <td className="py-2.5 px-4 font-mono text-emerald-700">candidate</td>
                          <td className="py-2.5 px-4 font-mono">rohan.sharma.vtu@gmail.com</td>
                          <td className="py-2.5 px-4">Mobile check-in pass, time-bound HMAC QR, 4-hour standby slot claim.</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Sushmita Jena</td>
                          <td className="py-2.5 px-4 font-mono text-rose-700">super_admin</td>
                          <td className="py-2.5 px-4 font-mono">sushmita.jena@excelsoftcorp.com</td>
                          <td className="py-2.5 px-4">Role revocation, immutable audit logs, telemetry, 9-suite QA console.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Dynamic QR Attendance */}
          {activeDocTab === 'qr_attendance' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">4. Dynamic HMAC-SHA256 Attendance Flow</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Cryptographic venue check-in preventing screenshot sharing, proxy attendance, and replay attacks.
                </p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  To eliminate proxy attendance at crowded campus venues, NIYOJAN discards static barcodes in favor of dynamic <strong>HMAC-SHA256 signed QR passes</strong> with a 5-minute rolling time-to-live (TTL) and single-use cryptographic nonces.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      <span>QR Code Generation Structure</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The candidate mobile application compiles candidate identification, slot ID, and timestamp, producing a cryptographically verified payload:
                    </p>
                    <div className="p-3 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto">
                      niyojan://checkin?uid=cand_402&slot=slot_10&t=1761858000&nonce=c8b12f&sig=a9f3...
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                      <li>• <strong>Candidate UID:</strong> Unique candidate account identifier.</li>
                      <li>• <strong>Slot ID:</strong> Scheduled interview session in the drive.</li>
                      <li>• <strong>Nonce:</strong> 12-byte random cryptographic value.</li>
                      <li>• <strong>Timestamp:</strong> Epoch seconds of generation (TTL: 300s).</li>
                      <li>• <strong>HMAC Signature:</strong> Signed using HMAC-SHA256 with institutional secret.</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Coordinator Desk Verification</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      When the coordinator scans the QR pass at the entrance desk:
                    </p>
                    <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
                      <li><strong>Cryptographic Verification:</strong> Backend recalculates HMAC hash using the institutional key.</li>
                      <li><strong>Freshness Check:</strong> Confirms current server time is within 5 minutes of generation.</li>
                      <li><strong>Nonce Invalidation:</strong> Checks the nonce against consumed nonces in SQLite; rejects if already used.</li>
                      <li><strong>Status Mutation:</strong> Atomically updates slot status to <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">in_venue</code> and marks attendance verified.</li>
                    </ol>
                  </div>
                </div>

                {/* Cryptographic Code Snippet */}
                <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">server/services/qrPassService.ts — HMAC Verification Protocol</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `const expectedSig = crypto.createHmac('sha256', HMAC_SECRET)\n  .update(\`\${uid}:\${slotId}:\${nonce}:\${timestamp}\`)\n  .digest('hex');\nif (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {\n  // Mark nonce consumed in SQLite\n}`,
                          'hmac_code'
                        )
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCodeId === 'hmac_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodeId === 'hmac_code' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`// Dynamic HMAC-SHA256 Attendance Validation
const expectedSig = crypto.createHmac('sha256', HMAC_SECRET)
  .update(\`\${uid}:\${slotId}:\${nonce}:\${timestamp}\`)
  .digest('hex');

if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
  // Validate 5-minute TTL and single-use nonce
  if (Math.abs(Date.now() / 1000 - timestamp) < 300) {
    await markNonceConsumed(nonce);
    await updateAttendanceRecord(slotId, 'in_venue');
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 5: Six Workspaces */}
          {activeDocTab === 'workspaces' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">5. Six Dedicated Role-Based Workspaces</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Purpose-built user interfaces customized for each stakeholder's responsibilities and permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. HR Admin */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      01
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      hr_admin
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">HR Administrator Workspace</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full organizational control: schedule campus hiring drives, configure panel capacity, monitor live drives, inspect past drive completion records, manage waitlist policies, and perform AI-powered RAG analytics queries with speech-to-text input.
                  </p>
                </div>

                {/* 2. Recruitment Manager */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                      recruitment_manager
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Recruitment Manager Workspace</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Talent pipeline command center: verify candidate academic profiles, review 4-tier skill verification credentials, forecast capacity-to-demand, and assign technical interviewers to panels based on domain skill matching.
                  </p>
                </div>

                {/* 3. Interview Coordinator */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      03
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      interview_coordinator
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Interview Coordinator Workspace</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Physical venue coordination desk: allocate interview rooms, operate the live dynamic QR attendance scanner desk, manage candidate queuing, and triage self-healing replacement allocations.
                  </p>
                </div>

                {/* 4. Dedicated Interviewer */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      04
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      interviewer
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Dedicated Interviewer Workspace</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Technical panelist command center: access authorized candidate 4-tier competency snapshots, browse curated difficulty question banks, submit structured rubric ratings with mandatory evidence notes, and declare conflict-of-interest.
                  </p>
                </div>

                {/* 5. Candidate Mobile App */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      05
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      candidate
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Candidate Mobile Portal</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mobile-first viewport: track recruitment applications in real time, generate 5-minute dynamic HMAC QR check-in passes, claim urgent 4-hour standby slot offers, and upload verified credentials into secure storage.
                  </p>
                </div>

                {/* 6. Super Administrator */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      06
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      super_admin
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Super Administrator Console</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enterprise governance center: grant or revoke privileged permissions, inspect immutable audit logs for compliance, review system performance telemetry, and run automated QA test suites across the entire engine.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Tab Content 6: Self Healing Engine & Skills */}
          {activeDocTab === 'self_healing' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">6. Self-Healing Engine & 4-Tier Skill Model</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Autonomous slot reclamation and progressive credential verification protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Self Healing Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <span>The Self-Healing Recruitment Engine</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    During high-volume campus hiring drives, candidate no-shows result in irreversible loss of interview capacity. NIYOJAN’s autonomous engine continuously monitors slot attendance and initiates automated recovery:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 mb-1">1. Gap Detection (&lt; 60 Seconds)</div>
                      <p className="text-slate-600">
                        If a candidate fails to check in 15 minutes prior to their slot, or unexcused absence is flagged, the slot is automatically transitioned to <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">reclaimed</code>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 mb-1">2. Standby Queue Evaluation & Atomic Lock</div>
                      <p className="text-slate-600">
                        The engine queries pre-screened standby candidates ordered by assessment score and arrival timestamp, placing a mutual-exclusion lock on the slot.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 mb-1">3. 4-Hour Confirmation Window</div>
                      <p className="text-slate-600">
                        The candidate receives an urgent push notification with a 4-hour countdown. Upon acceptance, the slot transitions to <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">confirmed</code> and panel capacity is fully preserved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4-Tier Skill Progression */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span>4-Tier Skill Verification Progression</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    NIYOJAN replaces unverified resume claims with an objective 4-stage verification hierarchy:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">Tier 1: Self-Declared</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">Unverified</span>
                      </div>
                      <p className="text-slate-600">
                        Skills declared by the candidate during initial profile creation without corroborating evidence.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">Tier 2: Resume-Extracted</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">Parsed</span>
                      </div>
                      <p className="text-slate-600">
                        Competencies matched against uploaded resume documents, academic transcripts, or project repositories.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">Tier 3: Assessment-Verified</span>
                        <span className="px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold">Proctored Test</span>
                      </div>
                      <p className="text-slate-600">
                        Validated through proctored online coding tests, multiple-choice screening assessments, or algorithmic challenges.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">Tier 4: HR-Verified</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Panel Authenticated</span>
                      </div>
                      <p className="text-slate-600">
                        Authenticated live by technical interview panel members during structured interview rounds with rubric scorecards.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab Content 7: Team & Credits */}
          {activeDocTab === 'team_credits' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-950">7. Team & Open-Source Acknowledgements</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Engineered by Team Yukthi in collaboration with Excelsoft Technologies.
                </p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
                <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Institutional Collaboration: Excelsoft Technologies</span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    NIYOJAN is designed and deployed in partnership with Excelsoft Technologies to modernize engineering campus recruitment across VTU-affiliated institutions in Mysuru, Hyderabad, and Bengaluru.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-slate-900">Open-Source Technologies & Acknowledgements</h4>
                  <p className="text-xs text-slate-600">
                    We gratefully acknowledge the following open-source frameworks and libraries that power NIYOJAN:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <div className="font-bold text-slate-900 text-sm">React 19</div>
                      <div className="text-[11px] text-slate-500">Component UI Engine</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <div className="font-bold text-slate-900 text-sm">Node.js 22 & Express</div>
                      <div className="text-[11px] text-slate-500">Layered REST Backend</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <div className="font-bold text-slate-900 text-sm">Embedded SQLite</div>
                      <div className="text-[11px] text-slate-500">WAL Mode ACID Persistence</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                      <div className="font-bold text-slate-900 text-sm">Lucide React</div>
                      <div className="text-[11px] text-slate-500">Semantic UI Iconography</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>© 2026 NIYOJAN Recruitment Engine • Team Yukthi</span>
                  <span>Built for Enterprise & Campus Scale</span>
                </div>
              </div>
            </div>
          )}

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
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span>In Partnership with</span>
                <span className="text-indigo-600 font-bold">Excelsoft Technologies</span>
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
                  <button onClick={() => scrollToSection('docs')} className="hover:text-indigo-600 transition-colors cursor-pointer font-bold text-indigo-600">
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
