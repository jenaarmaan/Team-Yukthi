import React, { useState } from 'react';
import {
  ARENA_PROBLEMS,
  ARENA_ASSESSMENTS,
  ARENA_BADGES,
  ARENA_LEADERBOARD,
  ARENA_LEARNING_TOPICS,
  ArenaProblem,
  ArenaAssessment
} from './arenaData.ts';
import { compileAndRunArenaCode, CodeCompilationResult } from './arenaCodeRunner.ts';
import {
  Code,
  Award,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Flame,
  Trophy,
  BookOpen,
  BarChart3,
  Search,
  Filter,
  Check,
  RotateCcw,
  Send,
  Zap,
  Target,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';

type ArenaSubSection = 'problems' | 'assessments' | 'gamification' | 'learning' | 'performance';
type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';

export const CandidateArenaView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ArenaSubSection>('problems');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Code Editor Workspace State
  const [activeProblem, setActiveProblem] = useState<ArenaProblem | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<ProgrammingLanguage>('javascript');
  const [editorCode, setEditorCode] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [compilationOutput, setCompilationOutput] = useState<CodeCompilationResult | null>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    accepted: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Active Assessment Test Taker State
  const [activeAssessment, setActiveAssessment] = useState<ArenaAssessment | null>(null);
  const [assessmentTimeRemaining, setAssessmentTimeRemaining] = useState<number>(3600);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);

  // Gamification stats
  const [currentXp, setCurrentXp] = useState(3850);
  const [problemsSolvedCount, setProblemsSolvedCount] = useState(44);

  // Filter problems
  const filteredProblems = ARENA_PROBLEMS.filter((p) => {
    const matchesSubject = selectedSubject === 'All' || p.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesDifficulty && matchesSearch;
  });

  const handleOpenProblem = (problem: ArenaProblem) => {
    setActiveProblem(problem);
    setEditorCode(problem.starterCode[editorLanguage] || problem.starterCode.javascript);
    setCompilationOutput(null);
    setSubmissionFeedback(null);
  };

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setEditorLanguage(lang);
    if (activeProblem) {
      setEditorCode(activeProblem.starterCode[lang] || activeProblem.starterCode.javascript);
      setCompilationOutput(null);
      setSubmissionFeedback(null);
    }
  };

  const handleRunTestCases = async () => {
    if (!activeProblem) return;
    setIsRunningCode(true);
    setCompilationOutput(null);
    setSubmissionFeedback(null);

    // Evaluate against sample test cases
    const result = await compileAndRunArenaCode(
      activeProblem,
      editorCode,
      editorLanguage,
      false
    );

    setIsRunningCode(false);
    setCompilationOutput(result);
  };

  const handleSubmitSolution = async () => {
    if (!activeProblem) return;
    setIsSubmittingCode(true);
    setSubmissionFeedback(null);

    // Evaluate against ALL test cases (sample + hidden)
    const result = await compileAndRunArenaCode(
      activeProblem,
      editorCode,
      editorLanguage,
      true
    );

    setIsSubmittingCode(false);
    setCompilationOutput(result);

    if (result.success && result.status === 'ACCEPTED') {
      // ONLY award XP and mark as solved when all test cases pass!
      setSubmissionFeedback({
        accepted: true,
        title: 'Accepted! All Test Cases Passed',
        message: `Congratulations! Your solution passed all ${result.totalCases} test cases. +${activeProblem.points} XP added.`
      });
      if (!activeProblem.solved) {
        setCurrentXp((prev) => prev + activeProblem.points);
        setProblemsSolvedCount((prev) => prev + 1);
        activeProblem.solved = true;
      }
    } else {
      // Wrong answers or compilation errors REJECT submission
      const failedCase = result.results.find((r) => !r.passed);
      setSubmissionFeedback({
        accepted: false,
        title: result.status === 'COMPILATION_ERROR' ? 'Compilation Failed' : 'Submission Rejected: Wrong Answer',
        message: result.compilationError ||
          `Failed on test case ${failedCase ? failedCase.index : ''} (${result.totalPassed} of ${result.totalCases} passed). ${
            failedCase ? `Expected [${failedCase.expected}], but got [${failedCase.actual}].` : 'Please correct your logic.'
          }`
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & GAMIFICATION STATS BANNER                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
              <Code className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Arena Coding Platform</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            HackerRank-inspired gamified coding, subject tests, leaderboards, and technical interview preparation.
          </p>
        </div>

        {/* Gamification Live Bar */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-bold text-amber-900">5-Day Streak</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-indigo-900">{currentXp.toLocaleString()} XP</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-800 font-bold">Lvl 7</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-900">Rank #3 (VTU)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-SECTION NAVIGATOR TABS                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSection('problems')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'problems' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Problem Solving</span>
        </button>

        <button
          onClick={() => setActiveSection('assessments')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'assessments' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Assessments & Tests</span>
        </button>

        <button
          onClick={() => setActiveSection('gamification')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'gamification' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Leaderboard & Badges</span>
        </button>

        <button
          onClick={() => setActiveSection('learning')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'learning' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learning Roadmaps</span>
        </button>

        <button
          onClick={() => setActiveSection('performance')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'performance' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>My Performance</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 5.1: PROBLEM SOLVING WORKSPACE                                 */}
      {/* ========================================================================= */}
      {activeSection === 'problems' && (
        <div className="space-y-6">
          {/* Subject Filter Pills & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Subject:</span>
              {['All', 'DSA', 'DBMS', 'OS', 'Computer Networks', 'OOP'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Search & Difficulty Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-hidden"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter problems..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Problem Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => handleOpenProblem(problem)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase font-mono">
                      {problem.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{problem.title}</span>
                      {problem.solved && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span>Topic: <strong className="text-slate-600">{problem.topic}</strong></span>
                    <span>•</span>
                    <span>Acc: <strong className="text-slate-600">{problem.acceptanceRate}%</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-600">+{problem.points} XP</span>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Solve Challenge</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SECTION 5.2: ASSESSMENTS & TIME-BASED TESTS                            */}
      {/* ========================================================================= */}
      {activeSection === 'assessments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARENA_ASSESSMENTS.map((assess) => (
              <div
                key={assess.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {assess.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{assess.durationMinutes} Mins</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{assess.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{assess.description}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Marks:</span>
                      <strong>{assess.totalMarks}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Questions:</span>
                      <strong>{assess.questionsCount} (Coding + MCQs)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Difficulty:</span>
                      <strong>{assess.difficulty}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {assess.status === 'completed' ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Score: {assess.score}/100</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveAssessment(assess);
                        setAssessmentTimeRemaining(assess.durationMinutes * 60);
                        setAssessmentSubmitted(false);
                      }}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Assessment</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SECTION 5.3: GAMIFICATION & LEADERBOARD                                */}
      {/* ========================================================================= */}
      {activeSection === 'gamification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Badges & Achievements */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Earned Badges & Achievements</span>
              </h3>
              <span className="text-xs font-bold text-indigo-600">4 of 6 Unlocked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARENA_BADGES.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-3xl shrink-0 p-1.5 rounded-xl bg-slate-100">
                      {badge.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{badge.name}</h4>
                        {isUnlocked && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Unlocked</span>}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                      <div className="text-[11px] font-bold text-indigo-600">+{badge.xpValue} XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Campus Leaderboard</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">VTU Cluster</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              {ARENA_LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3.5 flex items-center justify-between text-xs ${
                    user.isCurrentUser ? 'bg-indigo-50/70 font-bold text-indigo-900' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black ${user.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                      #{user.rank}
                    </span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.isCurrentUser && <span className="text-[9px] px-1 rounded bg-indigo-600 text-white font-mono">You</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">{user.institution}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-indigo-600 font-mono">{user.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] text-slate-400">{user.problemsSolved} solved • {user.streakDays}d streak</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SECTION 5.4: LEARNING ROADMAPS                                         */}
      {/* ========================================================================= */}
      {activeSection === 'learning' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARENA_LEARNING_TOPICS.map((topic) => {
            const pct = Math.round((topic.completedModules / topic.modulesCount) * 100);
            return (
              <div
                key={topic.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {topic.subject}
                    </span>
                    <span className="text-xs font-black text-indigo-600 font-mono">{pct}% Complete</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{topic.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{topic.description}</p>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {topic.completedModules} of {topic.modulesCount} modules
                  </span>
                  <button
                    onClick={() => setActiveSection('problems')}
                    className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                  >
                    <span>Practice Drills</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SECTION 5.5: ARENA PERFORMANCE ANALYTICS                               */}
      {/* ========================================================================= */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problems Solved</div>
              <div className="text-3xl font-black text-indigo-600 font-mono mt-1">{problemsSolvedCount}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Top 8% in VTU</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy Rate</div>
              <div className="text-3xl font-black text-emerald-600 font-mono mt-1">88.4%</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Across 52 submissions</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Solving Time</div>
              <div className="text-3xl font-black text-violet-600 font-mono mt-1">14.2m</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Fast algorithmic velocity</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill XP Total</div>
              <div className="text-3xl font-black text-amber-500 font-mono mt-1">{currentXp}</div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1">Level 7 Specialist</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-base font-bold text-slate-900">Strongest Subject Domains</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Data Structures (Arrays, Hash Maps, Stacks)</span>
                    <strong className="text-emerald-600">94% Mastery</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Database Systems (SQL, Joins, Normalization)</span>
                    <strong className="text-emerald-600">90% Mastery</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Object-Oriented Programming (Java, SOLID)</span>
                    <strong className="text-emerald-600">86% Mastery</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-base font-bold text-slate-900">Recommended Focus Areas</h4>
              <p className="text-xs text-slate-500">
                Based on your assessment errors, practicing these areas will maximize your technical interview scores:
              </p>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-900">Dynamic Programming & Memoization</div>
                    <div className="text-[11px] text-amber-700">2 edge cases failed in recent assessments</div>
                  </div>
                  <button
                    onClick={() => setActiveSection('problems')}
                    className="px-2.5 py-1 rounded-md bg-amber-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Practice
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-indigo-900">OS Concurrency & Mutex Semaphores</div>
                    <div className="text-[11px] text-indigo-700">Recommended for Graduate Software Engineer track</div>
                  </div>
                  <button
                    onClick={() => setActiveSection('problems')}
                    className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Practice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE CODE WORKSPACE MODAL / DRAWER                               */}
      {/* ========================================================================= */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
          <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{activeProblem.title}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded font-bold ${activeProblem.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                      {activeProblem.difficulty}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">+{activeProblem.points} XP • {activeProblem.subject}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Selector */}
                <select
                  value={editorLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
                  className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
                >
                  <option value="javascript">JavaScript (Node 22)</option>
                  <option value="python">Python 3.12</option>
                  <option value="java">Java 21</option>
                  <option value="cpp">C++ 20</option>
                  <option value="typescript">TypeScript 5</option>
                </select>

                <button
                  onClick={() => setActiveProblem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Body: Description vs Code Editor */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Column: Problem Description & Test Cases */}
              <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-slate-200 space-y-4 bg-slate-50/50 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Problem Description</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{activeProblem.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Constraints</h4>
                  <ul className="space-y-1 text-xs text-slate-500 font-mono list-disc list-inside">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900">Sample Test Cases</h4>
                  {activeProblem.sampleTestCases.map((tc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs space-y-1">
                      <div className="text-slate-500">Input: <span className="text-slate-900 font-bold">{tc.input}</span></div>
                      <div className="text-slate-500">Expected: <span className="text-emerald-600 font-bold">{tc.expectedOutput}</span></div>
                      {tc.explanation && <div className="text-[11px] text-slate-400 font-sans">{tc.explanation}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code Editor & Execution Output */}
              <div className="lg:col-span-7 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
                {/* Editor Top Bar */}
                <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>solution.{editorLanguage === 'javascript' ? 'js' : editorLanguage === 'python' ? 'py' : editorLanguage === 'java' ? 'java' : editorLanguage === 'cpp' ? 'cpp' : 'ts'}</span>
                  <span>UTF-8</span>
                </div>

                {/* Simulated Interactive Code Textarea */}
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="flex-1 p-4 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-hidden"
                  spellCheck={false}
                />

                {/* Compilation & Test Results Output Tray */}
                {compilationOutput && (
                  <div className="max-h-48 overflow-y-auto p-4 bg-slate-950 border-t border-slate-800 text-xs font-mono space-y-2.5">
                    {/* Header based on Status */}
                    {compilationOutput.status === 'COMPILATION_ERROR' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-rose-400 font-bold">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Compilation Error</span>
                        </div>
                        <div className="text-[11px] text-rose-300 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800/70 whitespace-pre-wrap">
                          {compilationOutput.compilationError || compilationOutput.summary}
                        </div>
                      </div>
                    )}

                    {compilationOutput.status === 'WRONG_ANSWER' && (
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Wrong Answer ({compilationOutput.totalPassed} of {compilationOutput.totalCases} Passed)</span>
                        </div>
                        <span className="text-[10px] text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800 font-bold">
                          FAILED
                        </span>
                      </div>
                    )}

                    {compilationOutput.status === 'ACCEPTED' && (
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>All Test Cases Passed! ({compilationOutput.totalPassed} / {compilationOutput.totalCases})</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                          PASSED
                        </span>
                      </div>
                    )}

                    {/* Detailed Case Breakdown (Only for runtime test results) */}
                    {compilationOutput.status !== 'COMPILATION_ERROR' &&
                      compilationOutput.results.map((r, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg border font-mono text-[11px] space-y-1 transition-all ${
                            r.passed
                              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-300">
                              {r.isHidden ? `Hidden Case ${r.index}` : `Case ${r.index}`}: [{r.input}]
                            </span>
                            <span className={r.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {r.passed ? `PASS (${r.executionTimeMs}ms)` : 'FAIL'}
                            </span>
                          </div>
                          {!r.passed && (
                            <div className="pt-1 text-[10px] space-y-0.5 text-slate-300 pl-2 border-l-2 border-rose-500">
                              <div>Expected: <span className="text-emerald-400 font-bold">{r.expected}</span></div>
                              <div>Actual Output: <span className="text-rose-400 font-bold">{r.actual}</span></div>
                              {r.error && <div className="text-rose-400">Runtime Error: {r.error}</div>}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {/* Submission Feedback Banner */}
                {submissionFeedback && (
                  <div
                    className={`p-4 border-t text-xs flex items-center justify-between animate-fade-in ${
                      submissionFeedback.accepted
                        ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/90 border-rose-800 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {submissionFeedback.accepted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <strong className={`block font-bold ${submissionFeedback.accepted ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {submissionFeedback.title}
                        </strong>
                        <span className="text-[11px] leading-tight opacity-90">{submissionFeedback.message}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        submissionFeedback.accepted
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-rose-900 text-rose-200'
                      }`}
                    >
                      {submissionFeedback.accepted ? 'SOLVED' : 'REJECTED'}
                    </span>
                  </div>
                )}

                {/* Editor Action Buttons Footer */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setEditorCode(activeProblem.starterCode[editorLanguage])}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Code</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunTestCases}
                      disabled={isRunningCode}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isRunningCode ? 'Running...' : 'Run Code'}</span>
                    </button>

                    <button
                      onClick={handleSubmitSolution}
                      disabled={isSubmittingCode}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingCode ? 'Evaluating...' : 'Submit Solution'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

