import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  Sparkles,
  Search,
  Check,
  Plus,
  Copy,
  BookOpen,
  Code,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Filter
} from 'lucide-react';

interface QuestionSuggestionPanelProps {
  candidateSkills: string[];
  role: string;
  interviewRound?: string;
  onSelectQuestion?: (q: QuestionItem) => void;
}

export const QuestionSuggestionPanel: React.FC<QuestionSuggestionPanelProps> = ({
  candidateSkills,
  role,
  interviewRound = 'Technical Round 1',
  onSelectQuestion
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    recruitmentService
      .fetchSuggestedQuestions(candidateSkills, role)
      .then((res) => {
        if (res && res.questions) {
          setQuestions(res.questions);
        }
      })
      .finally(() => setLoading(false));
  }, [candidateSkills, role]);

  const toggleSelect = (id: string, q: QuestionItem) => {
    const next = new Set(selectedQuestions);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      if (onSelectQuestion) onSelectQuestion(q);
    }
    setSelectedQuestions(next);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionText.trim()) return;

    const newQ: QuestionItem = {
      id: 'q_custom_' + Date.now(),
      topic: 'Custom Interviewer Question',
      category: 'technical',
      difficulty: 'intermediate',
      question: customQuestionText,
      expectedKeyPoints: ['Interviewer custom evaluation benchmark'],
      relevantSkills: candidateSkills.slice(0, 2)
    };

    setQuestions([newQ, ...questions]);
    setSelectedQuestions(new Set([...selectedQuestions, newQ.id]));
    setCustomQuestionText('');
    setShowAddCustom(false);
  };

  const filtered = questions.filter((q) => {
    const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesCat && matchesDiff;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Suggested Interview Questions</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              Advisory Assistant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailored to candidate's verified skills &bull; {role}
          </p>
        </div>

        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom</span>
        </button>
      </div>

      {/* Add Custom Question Form */}
      {showAddCustom && (
        <form onSubmit={handleAddCustom} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <label className="block text-[11px] font-bold text-slate-700">Write Custom Question</label>
          <textarea
            value={customQuestionText}
            onChange={(e) => setCustomQuestionText(e.target.value)}
            placeholder="Type your question prompt or coding challenge here..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-18"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
            >
              Add to Session
            </button>
          </div>
        </form>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Filter:</span>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 text-xs bg-slate-50 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="coding">Coding & Algorithms</option>
          <option value="technical">Technical Core</option>
          <option value="problem_solving">Problem Solving</option>
          <option value="role_specific">Role Specific</option>
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 text-xs bg-slate-50 focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="entry">Entry Level</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <span className="ml-auto text-[11px] text-slate-400">
          {selectedQuestions.size} selected for scorecard
        </span>
      </div>

      {/* Question List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading suggested questions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No questions match the current filters.</div>
        ) : (
          filtered.map((q) => {
            const isSelected = selectedQuestions.has(q.id);
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.2 rounded-md font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {q.topic}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded-md font-semibold capitalize ${
                          q.difficulty === 'advanced'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : q.difficulty === 'intermediate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 leading-snug">{q.question}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(q.id, q.question)}
                      title="Copy question text"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                    >
                      {copiedId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleSelect(q.id, q)}
                      title={isSelected ? 'Remove from session' : 'Select for interview'}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>

                {/* Collapsible Key Points Section */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <span>Expected Key Evaluation Points</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <div className="flex gap-1 text-[10px] text-slate-400">
                    {q.relevantSkills.slice(0, 3).map((s) => (
                      <span key={s} className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                    <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      Target Solution Criteria:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {q.expectedKeyPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                    {q.codeSnippet && (
                      <div className="mt-2 p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                        {q.codeSnippet}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

