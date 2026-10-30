import React, { useState } from 'react';
import {
  EvaluationCriteriaScore,
  InterviewRecommendation,
  InterviewEvaluation
} from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Save,
  Send,
  HelpCircle,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

interface InterviewScorecardModalProps {
  slotId: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  hiringDriveId: string;
  role: string;
  roundName?: string;
  onClose: () => void;
  onEvaluationSubmitted?: () => void;
}

export const InterviewScorecardModal: React.FC<InterviewScorecardModalProps> = ({
  slotId,
  applicationId,
  candidateId,
  candidateName,
  hiringDriveId,
  role,
  roundName = 'Technical Interview Round 1 (DSA & System Basics)',
  onClose,
  onEvaluationSubmitted
}) => {
  const [criteria, setCriteria] = useState<EvaluationCriteriaScore[]>([
    {
      criterionId: 'crit_1',
      name: 'Technical Core & Domain Depth',
      category: 'technical',
      rating: 4,
      observation: '',
      evidenceNotes: ''
    },
    {
      criterionId: 'crit_2',
      name: 'Problem Solving & Algorithmic Rigor',
      category: 'problem_solving',
      rating: 4,
      observation: '',
      evidenceNotes: ''
    },
    {
      criterionId: 'crit_3',
      name: 'Practical Coding & Architecture',
      category: 'coding',
      rating: 4,
      observation: '',
      evidenceNotes: ''
    },
    {
      criterionId: 'crit_4',
      name: 'Communication & Problem Articulation',
      category: 'communication',
      rating: 4,
      observation: '',
      evidenceNotes: ''
    },
    {
      criterionId: 'crit_5',
      name: 'Role-Specific Alignment & Adaptability',
      category: 'role_specific',
      rating: 4,
      observation: '',
      evidenceNotes: ''
    }
  ]);

  const [strengths, setStrengths] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [overallSummary, setOverallSummary] = useState<string>('');
  const [recommendation, setRecommendation] = useState<InterviewRecommendation>('recommend_next_round');
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRatingChange = (id: string, newRating: number) => {
    setCriteria(
      criteria.map((c) => (c.criterionId === id ? { ...c, rating: newRating } : c))
    );
  };

  const handleObservationChange = (id: string, text: string) => {
    setCriteria(
      criteria.map((c) => (c.criterionId === id ? { ...c, observation: text } : c))
    );
  };

  const calculateAverageRating = () => {
    const total = criteria.reduce((sum, c) => sum + c.rating, 0);
    return (total / criteria.length).toFixed(1);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setValidationError(null);
    try {
      const draftPayload = {
        slotId,
        applicationId,
        candidateId,
        candidateName,
        hiringDriveId,
        roundName,
        criteriaScores: criteria,
        strengths: strengths.split('\n').filter(Boolean),
        areasOfImprovement: improvements.split('\n').filter(Boolean),
        overallSummary,
        recommendation,
        recommendationReason
      };
      const res = await recruitmentService.saveScorecardDraft(draftPayload);
      if (res.success) {
        alert('Draft evaluation saved successfully.');
      } else {
        alert(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!recommendationReason.trim()) {
      setValidationError('A mandatory recommendation reason must be provided before final submission.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      const finalPayload = {
        slotId,
        applicationId,
        candidateId,
        candidateName,
        hiringDriveId,
        roundName,
        criteriaScores: criteria,
        strengths: strengths.split('\n').filter(Boolean),
        areasOfImprovement: improvements.split('\n').filter(Boolean),
        overallSummary,
        recommendation,
        recommendationReason
      };

      const res = await recruitmentService.submitScorecard(finalPayload);
      if (res.success) {
        setIsSubmitted(true);
        if (onEvaluationSubmitted) onEvaluationSubmitted();
      } else {
        setValidationError(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Structured Interview Scorecard
            </span>
            <span className="text-xs text-indigo-200">&bull; {roundName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{candidateName}</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Evaluating for {role}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Average Score</span>
              <span className="text-2xl font-black text-white font-mono">{calculateAverageRating()} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Scorecard Submitted Successfully</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Evaluation has been synchronized with the HR Command Center. Recommendation has been registered as <strong>{recommendation.toUpperCase()}</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Close Scorecard
              </button>
            </div>
          ) : (
            <>
              {/* 5 Core Competencies Evaluation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Competency Criteria Ratings (1 to 5)
                  </h3>
                  <span className="text-[11px] text-slate-400">Scale: 1 = Unsatisfactory &bull; 5 = Exceptional</span>
                </div>

                <div className="space-y-3">
                  {criteria.map((c) => (
                    <div key={c.criterionId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{c.name}</span>

                        {/* Star Rating Selector */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(c.criterionId, star)}
                              className={`p-1 rounded-md transition-colors ${
                                star <= c.rating ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                          <span className="ml-2 font-mono font-bold text-xs text-slate-700">{c.rating}.0</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={c.observation}
                        onChange={(e) => handleObservationChange(c.criterionId, e.target.value)}
                        placeholder="Key observation, evidence or coding solution notes..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Key Strengths Demonstrated
                  </label>
                  <textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="Enter key strengths (one per line)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Areas of Growth / Improvement
                  </label>
                  <textarea
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Enter growth areas (one per line)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-20"
                  />
                </div>
              </div>

              {/* Overall Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Overall Interview Synthesis
                </label>
                <textarea
                  value={overallSummary}
                  onChange={(e) => setOverallSummary(e.target.value)}
                  placeholder="Provide a concise technical evaluation summary for the hiring committee..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-20"
                />
              </div>

              {/* Interviewer Recommendation */}
              <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Interviewer Recommendation (Advisory)</span>
                  </label>
                  <span className="text-[11px] text-indigo-700/80 font-medium">Final hiring offer decided by HR</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'select', label: 'Select' },
                    { id: 'recommend_next_round', label: 'Next Round' },
                    { id: 'hold', label: 'Hold' },
                    { id: 'recommend_other_role', label: 'Other Role' },
                    { id: 'reject', label: 'Reject' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRecommendation(opt.id as InterviewRecommendation)}
                      className={`p-2 rounded-lg text-xs font-bold text-center border transition-all ${
                        recommendation === opt.id
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Mandatory Recommendation Rationale <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={recommendationReason}
                    onChange={(e) => setRecommendationReason(e.target.value)}
                    placeholder="Provide specific technical justification for your recommendation..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-600 resize-none h-18"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSubmitted && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Final Evaluation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

