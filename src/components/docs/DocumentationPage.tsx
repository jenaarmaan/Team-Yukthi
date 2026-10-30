import React, { useState, useEffect } from 'react';
import { GlobalNavbar } from '../common/GlobalNavbar';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Cpu,
  Key,
  QrCode,
  Users,
  Zap,
  Building2,
  Check,
  Copy,
  ShieldCheck,
  Lock,
  Database,
  Server,
  Code,
  UserCheck,
  LogIn,
  FileCheck,
  ExternalLink,
  ChevronUp,
  LayoutDashboard,
  Award,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PublicWorkspaceTarget } from '../public/PublicHomePage';

interface DocumentationPageProps {
  onBackToHome: () => void;
  onOpenAuth: () => void;
  onSelectWorkspace: (workspace: PublicWorkspaceTarget) => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({
  onBackToHome,
  onOpenAuth,
  onSelectWorkspace
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeNavSection, setActiveNavSection] = useState<string>('overview');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveNavSection(id);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = [
        'overview',
        'tech_stack',
        'auth_gateway',
        'qr_attendance',
        'workspaces',
        'self_healing',
        'team_credits'
      ];
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveNavSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. UNIVERSAL GLOBAL NAVIGATION BAR                                        */}
      {/* ========================================================================= */}
      <GlobalNavbar
        currentPlatform="docs"
        onNavigateHome={onBackToHome}
        onNavigateAbout={() => {
          onBackToHome();
          setTimeout(() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigateDocs={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={onOpenAuth}
        onSelectWorkspace={onSelectWorkspace}
      />

      {/* Section Jump Bar (Button-Based Redirecting in Sequence) */}
      <div className="sticky top-20 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur-md overflow-x-auto scrollbar-none py-2.5 px-4 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-2 pr-1">
              Jump to Section:
            </span>

            <button
              onClick={() => scrollToSection('overview')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'overview'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Overview & Problem</span>
            </button>

            <button
              onClick={() => scrollToSection('tech_stack')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'tech_stack'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>2. Core Technologies</span>
            </button>

            <button
              onClick={() => scrollToSection('auth_gateway')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'auth_gateway'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>3. Login & Gateways</span>
            </button>

            <button
              onClick={() => scrollToSection('qr_attendance')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'qr_attendance'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>4. Dynamic HMAC QR Flow</span>
            </button>

            <button
              onClick={() => scrollToSection('workspaces')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'workspaces'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>5. 6 Dedicated Workspaces</span>
            </button>

            <button
              onClick={() => scrollToSection('self_healing')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'self_healing'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>6. Self-Healing & 4-Tier Skills</span>
            </button>

            <button
              onClick={() => scrollToSection('team_credits')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavSection === 'team_credits'
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>7. Team & Credits</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner of Documentation Webpage */}
      <div className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Platform Documentation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              NIYOJAN Technical & Architecture Guide
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Complete sequential documentation of the NIYOJAN Autonomous Campus Recruitment Platform. Explore the problems addressed, full-stack technologies, dynamic cryptographic verification, dedicated role workspaces, self-healing algorithms, and operational specifications.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection('overview')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Start Reading in Sequence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectWorkspace('hr_admin')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Down to Down Sequential Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ========================================================================= */}
        {/* SECTION 1: OVERVIEW & PROBLEM                                             */}
        {/* ========================================================================= */}
        <section id="overview" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Module 01 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  1. Overview & Problem Formulation
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Autonomous recruitment orchestration engineered for high-volume university campus drives.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('tech_stack')}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Jump to Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>NIYOJAN</strong> is an autonomous campus recruitment engine engineered to eliminate the systemic inefficiencies inherent to high-volume university hiring drives. Developed in direct collaboration with <strong>Excelsoft Technologies</strong> for engineering campuses across Mysuru, Hyderabad, and Bengaluru, it addresses the three most severe structural failure points in conventional recruitment operations:
              </p>

              {/* 3 Problems Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
                  <div className="w-2 h-full bg-rose-500 absolute left-0 top-0" />
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Structural Inefficiency 01</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">15–25% Slot No-Shows</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Candidates miss allocated interview slots due to transit delays, conflicting schedules, or duplicate campus offers. In conventional drives, panels sit idle for 30–45 minutes, squandering senior engineering hours.
                  </p>
                  <div className="text-[11px] font-mono text-rose-700 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100">
                    Impact: Up to 120+ lost interview hours per institutional drive.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
                  <div className="w-2 h-full bg-amber-500 absolute left-0 top-0" />
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Structural Inefficiency 02</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">Proxy Attendance & Fraud</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Static QR codes or paper check-in sheets allow candidates to share screenshots or send proxies to sign in on their behalf at congested venue entrances, distorting drive attendance numbers.
                  </p>
                  <div className="text-[11px] font-mono text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                    Impact: Zero biometric verification & compromised drive integrity.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
                  <div className="w-2 h-full bg-indigo-500 absolute left-0 top-0" />
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    <span>Structural Inefficiency 03</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">Unverified Resume Inflation</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Technical interviewers waste 10–15 initial screening minutes determining whether self-reported competencies represent genuine skills or unverified resume keywords.
                  </p>
                  <div className="text-[11px] font-mono text-indigo-700 font-bold bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                    Impact: High false-positive shortlisting & interviewer fatigue.
                  </div>
                </div>
              </div>

              {/* Solution Summary */}
              <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>The NIYOJAN Autonomous Solution</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  NIYOJAN solves this systemic breakdown through a multi-tier autonomous engine: an algorithmic <strong>Self-Healing Engine</strong> that automatically reclaims missed interview slots within 60 seconds, <strong>time-bound cryptographic HMAC-SHA256 QR passes</strong> with single-use rolling nonces, a rigorous <strong>4-tier progressive skill verification pipeline</strong>, and <strong>embedded ACID SQLite persistence</strong> delivering sub-millisecond local reads/writes with zero cloud latency.
                </p>
              </div>

            </div>

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Module 1 of 7</span>
              <button
                onClick={() => scrollToSection('tech_stack')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: Core Technologies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 2: CORE TECHNOLOGIES                                              */}
        {/* ========================================================================= */}
        <section id="tech_stack" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Module 02 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  2. Core Technologies & Architecture
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Full-stack architectural specifications, embedded persistence, and cryptography.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('overview')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => scrollToSection('auth_gateway')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Tech Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                  <Code className="w-5 h-5 text-indigo-600" />
                  <span>Frontend Client Stack</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li>• <strong>React 19 & TypeScript:</strong> Strict typing with comprehensive component modularity and zero runtime exceptions.</li>
                  <li>• <strong>Tailwind CSS:</strong> High-contrast, clean enterprise design system with responsive desktop and mobile viewports.</li>
                  <li>• <strong>Vite 8:</strong> High-performance ES module bundler producing sub-second builds and instantaneous hot reloads.</li>
                  <li>• <strong>Lucide React Icons:</strong> Cohesive semantic iconography across all 6 dashboards.</li>
                  <li>• <strong>Vitest Test Harness:</strong> 54 comprehensive unit and integration tests executing in 1.1s.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
                  <Server className="w-5 h-5 text-violet-600" />
                  <span>Backend Server Stack</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li>• <strong>Node.js 22 LTS:</strong> Modern asynchronous event-driven JavaScript runtime with native SQLite support.</li>
                  <li>• <strong>Express 4 (TypeScript):</strong> Clean layered MVC architecture with strict routing, middleware, and request validation.</li>
                  <li>• <strong>RESTful JSON APIs:</strong> Standardized error and response contracts across all drives, applications, and slots.</li>
                  <li>• <strong>Zero External Cloud Latency:</strong> All endpoints run locally with 0ms network transit timeouts.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Database & ACID Storage</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li>• <strong>Embedded SQLite (WAL Mode):</strong> High-throughput Write-Ahead Logging; eliminates cloud database connectivity issues.</li>
                  <li>• <strong>19 Typed Repositories:</strong> Strongly typed schema contracts for users, drives, slots, scores, and attendances.</li>
                  <li>• <strong>Local File Storage:</strong> Tamper-resistant local document and candidate resume storage.</li>
                  <li>• <strong>Immutable Audit Trails:</strong> Every status transition, check-in, and score is permanently logged in the audit table.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>Security & Cryptography</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li>• <strong>Pure Scrypt Password Hashing:</strong> Secure memory-hard key derivation (`crypto.scryptSync`) with per-user salt.</li>
                  <li>• <strong>HS256 Stateless JWT Tokens:</strong> Cryptographically signed session tokens containing RBAC privilege claims.</li>
                  <li>• <strong>HMAC-SHA256 Dynamic QR Codes:</strong> Time-bound 5-minute single-use attendance nonces.</li>
                  <li>• <strong>Zero-Trust Note Isolation:</strong> Technical interviewers cannot access confidential HR administrative notes.</li>
                </ul>
              </div>

            </div>

            {/* Code Snippet Example */}
            <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">server/repositories/sqliteDb.ts — SQLite WAL Mode Initialization</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `const db = new DatabaseSync('data/niyojan.db');\ndb.exec('PRAGMA journal_mode = WAL;');\ndb.exec('PRAGMA synchronous = NORMAL;');\ndb.exec('PRAGMA foreign_keys = ON;');`,
                      'sqlite_code'
                    )
                  }
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCodeId === 'sqlite_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeId === 'sqlite_code' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`// Embedded ACID SQLite with WAL Mode: 0ms Network Latency
const db = new DatabaseSync('data/niyojan.db');
db.exec('PRAGMA journal_mode = WAL;');       // High concurrency concurrent reads & writes
db.exec('PRAGMA synchronous = NORMAL;');      // Optimal disk IO balance
db.exec('PRAGMA foreign_keys = ON;');        // Enforce referential integrity`}
              </pre>
            </div>

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('overview')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: Overview & Problem</span>
              </button>

              <button
                onClick={() => scrollToSection('auth_gateway')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: Login & Gateways</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 3: LOGIN & GATEWAYS                                               */}
        {/* ========================================================================= */}
        <section id="auth_gateway" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4" />
                  <span>Module 03 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  3. Authentication & Access Gateway
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Unified authentication landing page, role-based redirection, and pre-configured demo personas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('tech_stack')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => scrollToSection('qr_attendance')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                The NIYOJAN Authentication Gateway (<code className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs">AuthPage.tsx</code>) provides a unified portal for user sign-in, self-registration, password recovery, and staff invitation onboarding.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-indigo-600" />
                    <span>Key Gateways Functionalities</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <li>• <strong>Email & Password Login:</strong> Scrypt password verification with unique per-user salt and rate limiting.</li>
                    <li>• <strong>Role-Based Redirection:</strong> Automatically routes users to their specific workspace dashboard upon sign-in.</li>
                    <li>• <strong>Two-Role Registration:</strong> Allows open registration for <em>Candidates</em> and <em>HR Administrators</em>.</li>
                    <li>• <strong>Staff Invitation Workflow:</strong> Recruitment Managers, Coordinators, and Interviewers are invited by HR Admins with secure onboarding tokens.</li>
                    <li>• <strong>Password Reset:</strong> In-session reset with credential verification and audit logging.</li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onOpenAuth}
                      className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Launch Authentication Gateway</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Role-Based Redirection Mapping</span>
                  </h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-indigo-700 font-bold">candidate</span>
                      <span className="text-slate-500 text-[11px]">→ /candidate (Candidate Portal)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-amber-700 font-bold">interviewer</span>
                      <span className="text-slate-500 text-[11px]">→ /interviewer (Dedicated Workspace)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-indigo-700 font-bold">hr_admin</span>
                      <span className="text-slate-500 text-[11px]">→ /admin (HR Admin Dashboard)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-violet-700 font-bold">recruitment_manager</span>
                      <span className="text-slate-500 text-[11px]">→ /admin (Manager Funnel Desk)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-blue-700 font-bold">interview_coordinator</span>
                      <span className="text-slate-500 text-[11px]">→ /admin (Venue Coordination Desk)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-rose-700 font-bold">super_admin</span>
                      <span className="text-slate-500 text-[11px]">→ /admin (Super Admin Console)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-configured Demo Personas Table */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Pre-Configured Demo Personas for Instant Testing</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Click any persona to launch</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div
                    onClick={() => onSelectWorkspace('hr_admin')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">Praveen Kumar</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">hr_admin</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">praveen.kumar@excelsoftcorp.com</div>
                    <p className="text-[11px] text-slate-600">Drive creation, panel capacity limits, RAG analytics with voice search, policy thresholds.</p>
                    <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch HR Admin</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div
                    onClick={() => onSelectWorkspace('recruitment_manager')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/70 border border-slate-200 hover:border-violet-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-violet-600">Ananya Deshmukh</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold">recruitment_manager</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">ananya.deshmukh@excelsoftcorp.com</div>
                    <p className="text-[11px] text-slate-600">Recruitment funnel, candidate intelligence, waitlist & standby pool oversight, slot recovery.</p>
                    <div className="text-[11px] text-violet-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch Manager Desk</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div
                    onClick={() => onSelectWorkspace('interview_coordinator')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600">Rakesh Rao</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">interview_coordinator</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">rakesh.rao@excelsoftcorp.com</div>
                    <p className="text-[11px] text-slate-600">Venue check-in scanner desk, room allocation, QR/OTP verification, live attendance triage.</p>
                    <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch Coordinator Desk</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div
                    onClick={() => onSelectWorkspace('interviewer')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600">Dr. Murali Krishna</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">interviewer</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">murali.krishna@excelsoftcorp.com</div>
                    <p className="text-[11px] text-slate-600">Assigned interviews, 4-tier candidate snapshot, evaluation notes with draft saving, scorecards.</p>
                    <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch Interviewer Desk</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div
                    onClick={() => onSelectWorkspace('candidate')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-600">Rohan Sharma</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">candidate</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">rohan.sharma.vtu@gmail.com</div>
                    <p className="text-[11px] text-slate-600">Application tracking, dynamic HMAC QR check-in pass, Arena skill assessments, standby claims.</p>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch Candidate Portal</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div
                    onClick={() => onSelectWorkspace('super_admin')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 transition-all group cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-rose-600">Sushmita Jena</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">super_admin</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">sushmita.jena@excelsoftcorp.com</div>
                    <p className="text-[11px] text-slate-600">Global role management, immutable audit logs, system telemetry, automated 9-suite QA console.</p>
                    <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 pt-1">
                      <span>Launch Super Admin</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('tech_stack')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: Core Technologies</span>
              </button>

              <button
                onClick={() => scrollToSection('qr_attendance')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: Dynamic HMAC QR Flow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 4: DYNAMIC HMAC QR FLOW                                           */}
        {/* ========================================================================= */}
        <section id="qr_attendance" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <QrCode className="w-4 h-4" />
                  <span>Module 04 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  4. Dynamic HMAC-SHA256 Attendance Flow
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Cryptographic venue check-in preventing screenshot sharing, proxy attendance, and replay attacks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('auth_gateway')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => scrollToSection('workspaces')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                To eliminate proxy attendance at crowded campus venues, NIYOJAN discards static barcodes in favor of dynamic <strong>HMAC-SHA256 signed QR passes</strong> with a 5-minute rolling time-to-live (TTL) and single-use cryptographic nonces.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span>Dynamic QR Payload Structure</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The candidate mobile client compiles candidate identification, slot ID, and timestamp, producing a cryptographically verified payload:
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
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Coordinator Desk Verification Pipeline</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When the coordinator scans the QR pass at the entrance desk:
                  </p>
                  <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
                    <li><strong>Cryptographic Verification:</strong> Backend recalculates HMAC hash using the institutional key.</li>
                    <li><strong>Freshness Check:</strong> Confirms current server time is within 5 minutes of generation.</li>
                    <li><strong>Nonce Invalidation:</strong> Checks the nonce against consumed nonces in SQLite; rejects if already used.</li>
                    <li><strong>Status Mutation:</strong> Atomically updates slot status to <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold">in_venue</code> and marks attendance verified.</li>
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
                        `const expectedSig = crypto.createHmac('sha256', HMAC_SECRET)\n  .update(\`\${uid}:\${slotId}:\${nonce}:\${timestamp}\`)\n  .digest('hex');\nif (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {\n  if (Math.abs(Date.now() / 1000 - timestamp) < 300) {\n    await markNonceConsumed(nonce);\n    await updateAttendanceRecord(slotId, 'in_venue');\n  }\n}`,
                        'hmac_code'
                      )
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCodeId === 'hmac_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === 'hmac_code' ? 'Copied' : 'Copy Snippet'}</span>
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

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('auth_gateway')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: Login & Gateways</span>
              </button>

              <button
                onClick={() => scrollToSection('workspaces')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: 6 Dedicated Workspaces</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 5: 6 DEDICATED WORKSPACES                                         */}
        {/* ========================================================================= */}
        <section id="workspaces" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Module 05 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  5. Six Dedicated Role-Based Workspaces
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Purpose-built user interfaces tailored for each stakeholder's responsibilities and Zero-Trust scopes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('qr_attendance')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => scrollToSection('self_healing')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. HR Admin */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      01
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      hr_admin
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">HR Administrator Workspace</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full organizational control: schedule campus hiring drives, configure panel capacity, monitor live drives, inspect past drive completion records, manage waitlist policies, and perform AI-powered RAG analytics queries with speech-to-text input.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('hr_admin')}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch HR Admin</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Recruitment Manager */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                      recruitment_manager
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">Recruitment Manager Workspace</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Talent pipeline command center: verify candidate academic profiles, review 4-tier skill verification credentials, forecast capacity-to-demand, and assign technical interviewers to panels based on domain skill matching.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('recruitment_manager')}
                  className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Manager Desk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Interview Coordinator */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      03
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      interview_coordinator
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">Interview Coordinator Workspace</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Physical venue coordination desk: allocate interview rooms, operate the live dynamic QR attendance scanner desk, manage candidate queuing, and triage self-healing replacement allocations.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('interview_coordinator')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Coordinator Desk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Dedicated Interviewer */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      04
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      interviewer
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">Dedicated Interviewer Workspace</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Technical panelist command center: access authorized candidate 4-tier competency snapshots, browse curated difficulty question banks, submit structured rubric ratings with mandatory evidence notes, and declare conflict-of-interest.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('interviewer')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Interviewer Desk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5. Candidate Mobile App */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      05
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      candidate
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">Candidate Portal</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personal applicant command center: track recruitment applications in real time, generate 5-minute dynamic HMAC QR check-in passes, claim urgent 4-hour standby slot offers, and practice inside the Arena assessment simulator.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('candidate')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Candidate Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6. Super Administrator */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      06
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      super_admin
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">Super Administrator Console</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enterprise governance center: grant or revoke privileged permissions, inspect immutable audit logs for compliance, review system performance telemetry, and run automated QA test suites across the entire engine.
                  </p>
                </div>
                <button
                  onClick={() => onSelectWorkspace('super_admin')}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Launch Super Admin</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('qr_attendance')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: Dynamic HMAC QR Flow</span>
              </button>

              <button
                onClick={() => scrollToSection('self_healing')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: Self-Healing & 4-Tier Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 6: SELF-HEALING & 4-TIER SKILLS                                    */}
        {/* ========================================================================= */}
        <section id="self_healing" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Module 06 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  6. Self-Healing Engine & 4-Tier Skill Model
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Autonomous slot reclamation and progressive credential verification protocols.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('workspaces')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => scrollToSection('team_credits')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
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
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-amber-600" />
                      <span>1. Gap Detection (&lt; 60 Seconds)</span>
                    </div>
                    <p className="text-slate-600">
                      If a candidate fails to check in 15 minutes prior to their slot, or unexcused absence is flagged, the slot is automatically transitioned to <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-bold">reclaimed</code>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-violet-600" />
                      <span>2. Standby Queue Evaluation & Atomic Lock</span>
                    </div>
                    <p className="text-slate-600">
                      The engine queries pre-screened standby candidates ordered by assessment score and arrival timestamp, placing a mutual-exclusion lock on the slot.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>3. 4-Hour Confirmation Window</span>
                    </div>
                    <p className="text-slate-600">
                      The candidate receives an urgent push notification with a 4-hour countdown. Upon acceptance, the slot transitions to <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold">confirmed</code> and panel capacity is fully preserved.
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
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">Tier 1: Self-Declared</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">Unverified</span>
                    </div>
                    <p className="text-slate-600">
                      Skills declared by the candidate during initial profile creation without corroborating evidence.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">Tier 2: Resume-Extracted</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">Parsed Evidence</span>
                    </div>
                    <p className="text-slate-600">
                      Competencies matched against uploaded resume documents, academic transcripts, or project repositories.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">Tier 3: Assessment-Verified</span>
                      <span className="px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold">Proctored Arena</span>
                    </div>
                    <p className="text-slate-600">
                      Validated through proctored online coding tests, multiple-choice screening assessments, or algorithmic challenges.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
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

            {/* Down-to-Down Sequential Button Redirect */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('workspaces')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: 6 Dedicated Workspaces</span>
              </button>

              <button
                onClick={() => scrollToSection('team_credits')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Next Section: Team & Credits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 7: TEAM & CREDITS                                                 */}
        {/* ========================================================================= */}
        <section id="team_credits" className="scroll-mt-32">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Module 07 / 07</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  7. Team & Open-Source Acknowledgements
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Engineered by Team Yukthi in institutional collaboration with Excelsoft Technologies.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('overview')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>

            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              
              <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Institutional Collaboration: Excelsoft Technologies</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  NIYOJAN is designed and deployed in partnership with Excelsoft Technologies to modernize engineering campus recruitment across VTU-affiliated institutions in Mysuru, Hyderabad, and Bengaluru.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Open-Source Technologies & Acknowledgements</h3>
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

              {/* End of Document Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span>© 2026 NIYOJAN Recruitment Engine • Team Yukthi. All rights reserved.</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onBackToHome}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Access Gateway</span>
                  </button>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Scroll to Top"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

    </div>
  );
};

