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
  Send,
  MapPin,
  Mail,
  Phone,
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
  MessageSquare
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

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onSelectWorkspace,
  onOpenAuth
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'candidate' | 'staff' | 'persona'>('persona');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: 'University Placement Cell',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        organization: '',
        role: 'University Placement Cell',
        subject: '',
        message: ''
      });
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HEADER AND NAVIGATION                                                  */}
      {/* Specification: Login/Register option on Left, Niyojan option in Middle    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LEFT: Login / Register Option */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all duration-200 border border-indigo-400/30"
              title="Open Authentication & Quick Sign-In"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
              <span>Login / Register</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>

            <button
              onClick={() => onSelectWorkspace('candidate')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Candidate Portal</span>
            </button>
          </div>

          {/* MIDDLE: NIYOJAN Option & Branding Wordmark */}
          <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                NY
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                    NIYOJAN
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-950/90 text-indigo-300 border border-indigo-500/30 tracking-wider">
                    v2.0
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Intelligent Hiring. Seamless Opportunities.
            </span>
          </div>

          {/* RIGHT: Navigation Links & Quick Action */}
          <div className="flex items-center gap-1 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
              <button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('workspaces')} className="hover:text-indigo-400 transition-colors">
                Workspaces
              </button>
              <button onClick={() => scrollToSection('why-us')} className="hover:text-indigo-400 transition-colors">
                Why NIYOJAN
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-400 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-400 transition-colors">
                Contact
              </button>
            </nav>

            <button
              onClick={() => scrollToSection('workspaces')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/40 hover:border-indigo-400/50 transition-all active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Roles</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-800/60">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Next-Gen Autonomous Campus Recruitment Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-slate-400 text-[11px]">In Partnership with Excelsoft</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Intelligent Hiring.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                  Self-Healing Slots.
                </span>{' '}
                Zero Vacancy Waste.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Eliminate 25% no-show interview dropouts with real-time dynamic replacement dispatch, 4-tier skill verification, time-bound HMAC QR attendance passes, and dedicated role-based workspaces for every recruitment stakeholder.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => scrollToSection('workspaces')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-95 transition-all duration-200 border border-indigo-400/40"
                >
                  <span>Explore 6 Workspaces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectWorkspace('candidate')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 active:scale-95 transition-all"
                >
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Launch Candidate App</span>
                </button>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Staff Sign-In</span>
                </button>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                  <div className="text-xl font-black text-indigo-400 font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Slot Utilization</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                  <div className="text-xl font-black text-violet-400 font-mono">&lt; 60s</div>
                  <div className="text-[11px] text-slate-400 font-medium">Standby Recovery</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                  <div className="text-xl font-black text-emerald-400 font-mono">0ms</div>
                  <div className="text-[11px] text-slate-400 font-medium">Embedded ACID Latency</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                  <div className="text-xl font-black text-amber-400 font-mono">4-Tier</div>
                  <div className="text-[11px] text-slate-400 font-medium">Skill Verification</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic / Dashboard Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative border frame */}
                <div className="relative rounded-2xl bg-gradient-to-b from-indigo-500/20 via-slate-800/40 to-slate-900/80 p-2 sm:p-3 border border-indigo-500/30 shadow-2xl shadow-indigo-950/60 backdrop-blur-sm">
                  
                  {/* High Quality Technology / Interviewer Workspace Visual */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 group">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                      alt="Modern Technical Recruitment Assessment"
                      className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Floating Telemetry Card 1 */}
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 shadow-xl max-w-[210px] animate-bounce-slow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Self-Healing Live</span>
                      </div>
                      <p className="text-xs font-bold text-white">Replacement Slot Claimed</p>
                      <p className="text-[10px] text-slate-300 font-mono mt-0.5">Candidate #402 accepted in 42s</p>
                    </div>

                    {/* Floating Telemetry Card 2 */}
                    <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-violet-500/40 shadow-xl max-w-[210px]">
                      <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold mb-1">
                        <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dynamic HMAC Pass</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono">
                        TTL: 4m 58s • Single-Use Nonce
                      </div>
                      <div className="mt-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold inline-block">
                        VERIFIED BY DESK
                      </div>
                    </div>
                  </div>

                  {/* Quick System Status Bar */}
                  <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[11px] font-medium">SQLite WAL Engine:</span>
                      <span className="text-[11px] font-bold text-emerald-400">0ms Latency</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
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
      <section id="about" className="py-20 lg:py-28 relative border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              About The Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Pioneering Autonomous Campus Recruitment
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-normal">
              NIYOJAN was architected in collaboration with Excelsoft Technologies to resolve the chronic friction, manual rescheduling, and proxy attendance risks that plague high-volume institutional hiring drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-900/60 transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                The Self-Healing Engine
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                When scheduled candidates encounter travel delays, unexcused absences, or no-shows, NIYOJAN automatically reclaims the vacancy in real time. Standby candidates receive instant notifications with a 4-hour confirmation window, preserving 100% of panel capacity.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-950 text-violet-400 border border-violet-700/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-violet-900/60 transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                Cryptographic Fraud Defense
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Venue check-in utilizes dynamic HMAC-SHA256 QR passes with 5-minute rolling expiration, single-use cryptographic nonces, and candidate identity binding. Proxy attendance and duplicate claims are mathematically impossible.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-900/60 transition-all">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                4-Tier Skill Verification
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Replaces unverified resume exaggeration with a transparent progression: Self-Declared, Resume-Extracted, Assessment-Verified, and HR-Verified. Technical interviewers see objective candidate competency snapshots with verified credentials.
              </p>
            </div>

          </div>

          {/* Banner with image */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="p-8 lg:p-10 lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  <Building2 className="w-4 h-4" />
                  <span>Enterprise Partnership</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Engineered for Excelsoft Technologies Campus Hiring
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Built to service thousands of engineering candidates across VTU-affiliated campuses in Mysuru, Hyderabad, and Bengaluru. Operates with sub-millisecond local SQLite transaction isolation, preventing any remote database bottlenecks during peak check-in rushes.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Zero Remote Cloud Latency</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Strict Role-Based Access Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-950 via-slate-950/20 to-transparent" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SIX DEDICATED WORKSPACES                                               */}
      {/* Specification: a. HR admin, b. Recruitment manager,                       */}
      {/* c. interview coordinators, d. interviewer, e. candidate, f. Admin          */}
      {/* Requirement: "all these 6 cards on clicking should take to their           */}
      {/* respective dashboards"                                                    */}
      {/* ========================================================================= */}
      <section id="workspaces" className="py-20 lg:py-28 relative border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-violet-950 text-violet-400 border border-violet-800/60">
              Role-Based Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Six Dedicated Enterprise Workspaces
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal">
              Click any workspace card below to immediately enter its dedicated dashboard with authenticated role credentials and specialized features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD 1: HR Admin */}
            <div
              onClick={() => onSelectWorkspace('hr_admin')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/40 uppercase tracking-wider font-mono">
                    hr_admin
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>HR Administrator</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-indigo-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Full organizational control over campus hiring drives, policy thresholds, waitlist ratification, cross-panel allocation, and absence penalties.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Campus Hiring Drive Lifecycle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Dynamic Waitlist & Capacity Limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Absence Governance & Ratification</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Enter HR Admin Dashboard</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* CARD 2: Recruitment Manager */}
            <div
              onClick={() => onSelectWorkspace('recruitment_manager')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-violet-950 text-violet-400 border border-violet-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-700/40 uppercase tracking-wider font-mono">
                    recruitment_manager
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1.5">
                    <span>Recruitment Manager</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-violet-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Talent pipeline analytics, candidate academic and skill vetting, capacity-to-demand forecasting, and interview panel assignments.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Candidate Database & Skill Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Capacity vs. Demand Pipeline Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Interviewer Panel Skill Matching</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                <span>Enter Manager Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* CARD 3: Interview Coordinator */}
            <div
              onClick={() => onSelectWorkspace('interview_coordinator')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-700/40 uppercase tracking-wider font-mono">
                    interview_coordinator
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                    <span>Interview Coordinator</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Venue operational desk, physical room allocation, dynamic QR attendance scanner desk, and real-time self-healing recovery triage.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Venue Desk Check-In & Scanner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Panel Room Schedule Lock Guard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Live Standby Recovery Dispatch</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>Enter Coordinator Desk</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* CARD 4: Interviewer (Dedicated Workspace) */}
            <div
              onClick={() => onSelectWorkspace('interviewer')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 border border-amber-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/40 uppercase tracking-wider font-mono">
                    interviewer
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>Dedicated Interviewer</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Interviewer-only command center: authorized candidate snapshots, suggested questions, structured rubric scorecards, and conflict declarations.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Candidate 4-Tier Skill Snapshot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Suggested Questions & Difficulty Banks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Rubric Scorecards & Decisions (Select/Reject)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>Enter Interviewer Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* CARD 5: Candidate */}
            <div
              onClick={() => onSelectWorkspace('candidate')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/40 uppercase tracking-wider font-mono">
                    candidate
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <span>Candidate Mobile App</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Mobile-first viewport: track drive applications, dynamic 5-minute QR check-in pass, 4-hour standby slot claim, and verified skill profiles.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-Time Application Status Pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Time-Bound HMAC-SHA256 QR Pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Urgent Replacement Slot Claim Guard</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Enter Candidate Mobile Portal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* CARD 6: Admin (Super Admin) */}
            <div
              onClick={() => onSelectWorkspace('super_admin')}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/60 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/50 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-rose-950 text-rose-400 border border-rose-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/40 uppercase tracking-wider font-mono">
                    super_admin
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
                    <span>Super Administrator</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-rose-400" />
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Highest organizational authority: privileged role assignments, immutable audit trail inspection, system telemetry, and automated QA test consoles.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Role Assignment & Revocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Immutable Audit Log Inspection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>9-Suite Automated QA Test Console</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:text-rose-300">
                <span>Enter Super Admin Center</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY CHOOSE NIYOJAN?                                                    */}
      {/* ========================================================================= */}
      <section id="why-us" className="py-20 lg:py-28 relative border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Measurable Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Institutional Leaders Choose NIYOJAN
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal">
              Compare conventional manual campus hiring processes against NIYOJAN's automated, cryptographic, and self-healing recruitment architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">15–25% Interview Slots Wasted from No-Shows</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Self-Healing engine detects gaps and alerts priority standby candidates in under 60 seconds, maintaining 100% capacity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">Proxy Attendance & Impersonation at Venues</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                Dynamic 5-minute HMAC QR passes with single-use cryptographic nonces verified by coordinators at the check-in desk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">Inflated Resume Claims & Unverified Skills</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                4-tier progressive verification marks skills as Self-Declared, Resume-Extracted, Assessment-Verified, or HR-Verified.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">Remote Cloud Latency & Network Disruption</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                Embedded ACID SQLite persistence in WAL mode eliminates external cloud round-trips with genuine 0ms sub-millisecond local reads/writes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">Subjective & Inconsistent Interview Evaluations</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                Interviewer Workspace provides standardized question difficulty banks, structured criteria ratings, evidence notes, and immutable submissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>Problem</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Traditional</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">Confidential HR Notes Exposed to Interviewers</p>
              <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NIYOJAN Solution</span>
              </div>
              <p className="text-xs text-slate-400">
                Zero-Trust RBAC strictly hides internal HR notes, compensation discussions, and recruiter comments from technical panelists.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW NIYOJAN WORKS                                                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 relative border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-950 text-amber-400 border border-amber-800/60">
              The Recruitment Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How NIYOJAN Works in 6 Automated Steps
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal">
              From application registration to consolidated hiring offers, every transition is validated by the backend state machine and logged to an immutable audit trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/40 text-indigo-400 font-black text-sm flex items-center justify-center font-mono">
                  01
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Registration & Skill Vetting</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Candidates register on the mobile-first app, declare technical skills, and upload verified credentials into private, tamper-proof storage.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-700/40 text-violet-400 font-black text-sm flex items-center justify-center font-mono">
                  02
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HR Admin</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drive Scheduling & Waitlists</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Campus drives configure slots and panel capacities. Excess applications automatically transition to priority waitlists based on merit ranking.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/40 text-blue-400 font-black text-sm flex items-center justify-center font-mono">
                  03
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Coordinator</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dynamic QR Check-in</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Candidates generate a 5-minute time-bound HMAC-SHA256 QR pass upon arriving at the venue. Coordinators verify attendance at the live desk.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/40 text-amber-400 font-black text-sm flex items-center justify-center font-mono">
                  04
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interviewer</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Technical Interview & Scorecard</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Panelists inspect candidate snapshots, access curated question banks, conduct evaluation, and submit structured scores and recommendations.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-700/40 text-rose-400 font-black text-sm flex items-center justify-center font-mono">
                  05
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Autonomous</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Self-Healing Standby Recovery</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                If an interview is missed or candidate fails to report, the engine detects the gap and dispatches an urgent replacement offer with atomic locking.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/40 text-emerald-400 font-black text-sm flex items-center justify-center font-mono">
                  06
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Governance</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Offer Calibration & Audit Trail</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Results from multiple rounds are compiled into hiring decisions. Every action, transition, and score is preserved in immutable audit records.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CONTACT US                                                             */}
      {/* ========================================================================= */}
      <section id="contact" className="py-20 lg:py-28 relative border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-950 text-blue-400 border border-blue-800/60">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Connect with the NIYOJAN Deployment Team
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal">
              Whether you are an institutional placement cell planning an upcoming drive, an interviewer needing technical support, or an enterprise evaluating NIYOJAN, we are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
              
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce-slow">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Dispatched Successfully</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Thank you, <span className="text-indigo-400 font-semibold">{contactForm.name}</span>. The NIYOJAN recruitment operations desk has received your inquiry and will respond within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Dr. K. S. Ramanujan"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="placement@institute.edu.in"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Institution / Company
                      </label>
                      <input
                        type="text"
                        value={contactForm.organization}
                        onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                        placeholder="VTU Campus Center, Mysuru"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      >
                        <option value="University Placement Cell">University Placement Cell</option>
                        <option value="Enterprise Hiring Partner">Enterprise Hiring Partner</option>
                        <option value="Technical Panel Interviewer">Technical Panel Interviewer</option>
                        <option value="Candidate Support Desk">Candidate Support Desk</option>
                        <option value="System Security Audit">System Security Audit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Upcoming 2026 Batch GSE Campus Drive Scheduling"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Message / Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please specify estimated candidate headcount, venue locations, interview rounds, and preferred dates..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}

            </div>

            {/* Right Column: Campus Details */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Excelsoft Technologies Campus</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Mysuru Headquarters</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Plot 1-B, Hootagalli Industrial Area, Mysuru, Karnataka 570018, India
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <h4 className="text-base font-bold text-white">Hyderabad Technology Center</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Avance Business Hub, Hitec City, Madhapur, Hyderabad, Telangana 500081
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                  <Mail className="w-4 h-4" />
                  <span>Direct Communication</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Campus Drives Desk:</span>
                    <span className="font-mono text-indigo-300 font-semibold">campus@niyojan.excelsoftcorp.com</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Technical Support:</span>
                    <span className="font-mono text-indigo-300 font-semibold">support@niyojan.excelsoftcorp.com</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Venue Desk Hotline:</span>
                    <span className="font-mono text-indigo-300 font-semibold">+91 (821) 428-2026</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>
                  Live Venue Coordination Desk active 07:30 AM – 09:00 PM IST on scheduled campus hiring drive dates.
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="py-12 lg:py-16 bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                  NY
                </div>
                <span className="font-black text-lg text-white tracking-tight">NIYOJAN</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Next-generation autonomous, fair, and self-healing campus recruitment platform. Eliminates vacancy dropouts with 4-tier skill verification, time-bound HMAC QR check-ins, and dedicated role-based workspaces.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <span>In Partnership with</span>
                <span className="text-indigo-400 font-bold">Excelsoft Technologies</span>
              </div>
            </div>

            {/* Col 2: The 6 Workspaces */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">6 Workspaces</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onSelectWorkspace('hr_admin')} className="hover:text-indigo-400 transition-colors">
                    HR Admin Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('recruitment_manager')} className="hover:text-indigo-400 transition-colors">
                    Recruitment Manager
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('interview_coordinator')} className="hover:text-indigo-400 transition-colors">
                    Interview Coordinator
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('interviewer')} className="hover:text-indigo-400 transition-colors">
                    Dedicated Interviewer
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('candidate')} className="hover:text-indigo-400 transition-colors">
                    Candidate Mobile Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectWorkspace('super_admin')} className="hover:text-indigo-400 transition-colors">
                    Super Administrator
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition-colors">About NIYOJAN</button></li>
                <li><button onClick={() => scrollToSection('why-us')} className="hover:text-indigo-400 transition-colors">Why Choose NIYOJAN</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-400 transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-indigo-400 transition-colors">Contact Support</button></li>
                <li><button onClick={() => setShowAuthModal(true)} className="hover:text-indigo-400 transition-colors">Login / Register</button></li>
              </ul>
            </div>

            {/* Col 4: Architecture & Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Architecture</h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <div>• Embedded ACID SQLite WAL</div>
                <div>• Zero Remote Cloud Latency</div>
                <div>• HMAC-SHA256 Signed QR Pass</div>
                <div>• Pure Scrypt + HS256 JWT</div>
                <div>• Immutable Audit Logging</div>
                <div>• 19 Typed Repositories</div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 NIYOJAN Recruitment Engine • Excelsoft Technologies. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
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
      {/* Triggered from the Header Left "Login / Register" Button                   */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  NY
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">NIYOJAN Access Gateway</h3>
                  <p className="text-xs text-slate-400">Select your role or sign in to continue</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setAuthModalTab('persona')}
                className={`flex-1 py-2 rounded-lg transition-colors ${authModalTab === 'persona' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Quick Demo Personas
              </button>
              <button
                onClick={() => setAuthModalTab('staff')}
                className={`flex-1 py-2 rounded-lg transition-colors ${authModalTab === 'staff' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Staff Portal
              </button>
              <button
                onClick={() => setAuthModalTab('candidate')}
                className={`flex-1 py-2 rounded-lg transition-colors ${authModalTab === 'candidate' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Candidate Sign-In
              </button>
            </div>

            {/* Tab: Quick Demo Personas */}
            {authModalTab === 'persona' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Select any pre-configured persona to immediately test real recruitment workflows with authoritative JWT tokens:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('hr_admin');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">Praveen Kumar</div>
                    <div className="text-[10px] text-indigo-400 font-mono">HR Administrator</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('recruitment_manager');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-violet-950/40 border border-slate-800 hover:border-violet-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-violet-300">Ananya Deshmukh</div>
                    <div className="text-[10px] text-violet-400 font-mono">Recruitment Manager</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interview_coordinator');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-blue-300">Rakesh Rao</div>
                    <div className="text-[10px] text-blue-400 font-mono">Venue Coordinator</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interviewer');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">Dr. Murali Krishna</div>
                    <div className="text-[10px] text-amber-400 font-mono">Technical Panelist</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('candidate');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">Rohan Sharma</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Confirmed Candidate</div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('super_admin');
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-rose-300">Sushmita Jena</div>
                    <div className="text-[10px] text-rose-400 font-mono">Super Administrator</div>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Staff Portal */}
            {authModalTab === 'staff' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Staff members access the central dashboard authenticated via cryptographic JWT credentials.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('hr_admin');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open HR Admin Command Center</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('interviewer');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
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
                <p className="text-xs text-slate-400">
                  Candidates can register or sign in using their registered email and password to track applications and access the dynamic HMAC attendance pass.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Candidate Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      onSelectWorkspace('candidate');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
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

