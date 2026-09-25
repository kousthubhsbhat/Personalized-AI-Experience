import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Award,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Zap,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { PathwayModule, QuizQuestion, QuizSubmissionResponse } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface AdaptiveQuizModalProps {
  module: PathwayModule | null;
  onClose: () => void;
  onQuizCompleted: () => void;
}

export const AdaptiveQuizModal: React.FC<AdaptiveQuizModalProps> = ({
  module,
  onClose,
  onQuizCompleted,
}) => {
  const { addToast, updatePathwayState } = useApp();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    if (!module) return;

    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const data = await api.getQuiz(module.id);
        setQuestions(data.questions || []);
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Quiz Generation Failed',
          description: err.response?.data?.error || 'Could not fetch quiz questions from Gemini AI.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [module]);

  if (!module) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submissionResult) return; // Prevent change after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[q.id],
      }));

      const result = await api.submitQuiz(module.id, answersPayload);
      setSubmissionResult(result);

      if (result.passed && result.score >= 90) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        });
        addToast({
          type: 'success',
          title: `Mastery Calibrated: Score ${result.score}%!`,
          description: 'High mastery demonstrated. Skill levels boosted and prerequisites completed.'
        });
      } else if (!result.passed) {
        addToast({
          type: 'warning',
          title: `Adaptive Feedback: Score ${result.score}%`,
          description: result.adaptationTriggered
            ? 'Score < 60% — AI automatically calibrated and inserted a targeted remediation module.'
            : 'Review the technical breakdown below before retrying.'
        });
      } else {
        addToast({
          type: 'success',
          title: `Module Passed: ${result.score}%`,
          description: 'Great job! Concept verified and marked complete in your roadmap.'
        });
      }

      if (result.pathway) {
        updatePathwayState(result.pathway, result.skills);
      }
      onQuizCompleted();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Quiz Submission Error',
        description: err.response?.data?.error || 'Failed to submit quiz answers.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0E1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Adaptive Diagnostic Assessment</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                  {module.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{module.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <BrainCircuit className="w-12 h-12 text-cyan-400 animate-spin" />
              <div>
                <h4 className="text-base font-semibold text-white">Generating Dynamic Adaptive Quiz</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Gemini 2.5 Flash is generating scenario-based questions tailored to test your mastery...
                </p>
              </div>
            </div>
          ) : submissionResult ? (
            /* Results & Adaptive Feedback View */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score Card */}
              <div className={`p-6 rounded-2xl border text-center relative overflow-hidden ${
                submissionResult.passed
                  ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/30'
                  : 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/30'
              }`}>
                <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-3 shadow-glow">
                  {submissionResult.score >= 90 ? (
                    <Sparkles className="w-10 h-10 text-cyan-400" />
                  ) : submissionResult.passed ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight">
                  {submissionResult.score >= 90
                    ? 'Mastery Level Achieved! 🚀'
                    : submissionResult.passed
                    ? 'Diagnostic Passed! 👏'
                    : 'Adaptive Remediation Triggered 💡'}
                </h3>

                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-4xl font-extrabold font-mono text-white">
                    {submissionResult.score}%
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    ({submissionResult.correctCount} / {submissionResult.totalQuestions} Correct)
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-lg mx-auto mt-3 leading-relaxed">
                  {submissionResult.feedbackNotes}
                </p>

                {/* Remediation Callout Banner */}
                {submissionResult.adaptationTriggered && submissionResult.remediationModule && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        AI Roadmap Adaptation Activated
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        We inserted a foundational remediation module: <strong className="text-white">"{submissionResult.remediationModule.title}"</strong> into your pathway to reinforce prerequisite mechanics before advancing.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Breakdown List */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  Technical Answers Breakdown
                </h4>

                {submissionResult.results.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-4 rounded-xl border transition-all ${
                      item.isCorrect
                        ? 'bg-slate-900/60 border-emerald-500/30'
                        : 'bg-slate-900/60 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Q{idx + 1}: {item.question}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.isCorrect ? 'Correct' : 'Needs Review'}
                      </span>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 text-xs bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-slate-300">
                      <strong className="text-indigo-300">Technical Rationale:</strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : questions.length > 0 && currentQuestion ? (
            /* Active Question View */
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text & Type Badge */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Knowledge Check</span>
                  </div>
                  {currentQuestion.questionType && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono font-medium">
                      {currentQuestion.questionType}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all ${
                      idx === currentQuestionIndex
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-700/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2">
          {submissionResult ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs sm:text-sm transition-opacity shadow-glow"
            >
              Continue on Learning Roadmap
            </button>
          ) : (
            <>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || isLoading}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-glow disabled:opacity-40 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <BrainCircuit className="w-4 h-4 animate-spin shrink-0" />
                      <span>Calibrating...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>Submit & Calibrate</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion?.id] === undefined}
                  className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-40"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
