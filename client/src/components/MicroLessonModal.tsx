import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  BookOpen,
  Clock,
  Code2,
  CheckCircle,
  Sparkles,
  Bot,
  BrainCircuit,
  Copy,
  Check,
  Award,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Play
} from 'lucide-react';
import { PathwayModule } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface MicroLessonModalProps {
  module: PathwayModule | null;
  onClose: () => void;
  onStartQuiz: (module: PathwayModule) => void;
  onOpenSandbox?: (code: string, title?: string) => void;
}

export const MicroLessonModal: React.FC<MicroLessonModalProps> = ({
  module,
  onClose,
  onStartQuiz,
  onOpenSandbox,
}) => {
  const { openCopilotForModule, addToast } = useApp();
  const [lessonData, setLessonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (!module) return;

    const fetchLesson = async () => {
      setIsLoading(true);
      try {
        const data = await api.getLesson(module.id);
        setLessonData(data.lesson);
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Lesson Generation Failed',
          description: err.response?.data?.error || 'Could not generate lesson via Gemini AI.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [module]);

  if (!module) return null;

  const isRemediation = module.status === 'remediation' || module.title.includes('Remediation');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0E1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              isRemediation
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
            }`}>
              {isRemediation ? <AlertTriangle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {isRemediation && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    Adaptive Remediation
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${
                  module.difficulty === 'beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : module.difficulty === 'intermediate'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {module.difficulty} Level
                </span>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lessonData?.estimated_mins || 15} Mins</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white">{module.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCopilotForModule(module)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Mentor</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-spin">
                <BrainCircuit className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Generating Tailored Micro-Lesson</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  Gemini 2.5 Flash is synthesizing high-impact reading material and architectural snippets for your skill level...
                </p>
              </div>
            </div>
          ) : lessonData ? (
            <>
              {/* Overview Box */}
              {lessonData.overview && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border border-indigo-800/40 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    Strategic Objective
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {lessonData.overview}
                  </p>
                </div>
              )}

              {/* Reading Material */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Core Architecture & Theory
                </h3>
                <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed text-sm bg-slate-900/40 p-5 rounded-xl border border-slate-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lessonData.reading_material}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Code Snippet */}
              {lessonData.code_snippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      Implementation Snippet
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {lessonData.code_snippet.language || 'typescript'}
                      </span>
                      {onOpenSandbox && (
                        <button
                          onClick={() => onOpenSandbox(lessonData.code_snippet.code, module.title)}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white transition-colors border border-indigo-500/40"
                        >
                          <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                          <span>Run in Sandbox</span>
                        </button>
                      )}
                      <button
                        onClick={() => copyCode(lessonData.code_snippet.code)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070b14]">
                    <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{lessonData.code_snippet.code}</code>
                    </pre>
                  </div>

                  {lessonData.code_snippet.explanation && (
                    <p className="text-xs text-slate-400 italic bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/60">
                      💡 <strong>Breakdown:</strong> {lessonData.code_snippet.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Case Study */}
              {lessonData.case_study && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Real-World Production Case Study
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <p className="font-semibold text-slate-200 mb-1">Scenario & Constraint</p>
                      <p className="text-slate-400">{lessonData.case_study.scenario}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <p className="font-semibold text-rose-300 mb-1">The Bottleneck / Challenge</p>
                      <p className="text-slate-400">{lessonData.case_study.challenge}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs">
                    <p className="font-semibold text-emerald-300 mb-1">Resolution Strategy</p>
                    <p className="text-slate-300">{lessonData.case_study.solution_strategy}</p>
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {lessonData.key_takeaways && lessonData.key_takeaways.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Key Mastery Takeaways
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lessonData.key_takeaways.map((point: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              No lesson content could be retrieved.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => onStartQuiz(module)}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow hover:shadow-glow-cyan transition-all disabled:opacity-50"
          >
            <Award className="w-4 h-4" />
            <span>Take Adaptive Diagnostic Quiz</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
