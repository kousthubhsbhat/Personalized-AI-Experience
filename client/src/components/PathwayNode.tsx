import React from 'react';
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  AlertTriangle,
  BookOpen,
  Award,
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  Flame
} from 'lucide-react';
import { PathwayModule } from '../types';
import { useApp } from '../context/AppContext';

interface PathwayNodeProps {
  module: PathwayModule;
  index: number;
  total: number;
  onOpenLesson: (module: PathwayModule) => void;
  onOpenQuiz: (module: PathwayModule) => void;
}

export const PathwayNode: React.FC<PathwayNodeProps> = ({
  module,
  index,
  total,
  onOpenLesson,
  onOpenQuiz,
}) => {
  const { openCopilotForModule } = useApp();
  const isRemediation = module.status === 'remediation' || module.title.includes('Remediation');
  const isCompleted = module.status === 'completed';
  const isInProgress = module.status === 'in_progress';
  const isPending = module.status === 'pending';

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
      
      {/* Node Order Circle & Connector */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 shadow-md ${
          isRemediation
            ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white ring-4 ring-amber-500/20 shadow-lg animate-pulse'
            : isCompleted
            ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white ring-4 ring-emerald-500/20 shadow-glow-emerald'
            : isInProgress
            ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white ring-4 ring-indigo-500/30 shadow-glow'
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : isRemediation ? (
            <AlertTriangle className="w-6 h-6" />
          ) : isInProgress ? (
            <PlayCircle className="w-6 h-6" />
          ) : (
            <span className="font-mono text-base">{index + 1}</span>
          )}
        </div>

        {/* Vertical connector line for mobile / timeline */}
        {index < total - 1 && (
          <div className="w-0.5 h-16 md:h-12 bg-slate-800 group-hover:bg-indigo-500/40 transition-colors" />
        )}
      </div>

      {/* Main Module Card */}
      <div className={`flex-1 w-full rounded-2xl p-5 border transition-all duration-300 ${
        isRemediation
          ? 'bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-900/80 border-amber-500/40 shadow-lg hover:border-amber-400'
          : isInProgress
          ? 'bg-slate-900/90 border-indigo-500/50 shadow-glow hover:border-indigo-400'
          : isCompleted
          ? 'bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/50'
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {isRemediation ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI Injected Remediation
                </span>
              ) : (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider font-mono ${
                  module.difficulty === 'beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : module.difficulty === 'intermediate'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {module.difficulty}
                </span>
              )}

              {/* Status Pill */}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                isCompleted
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                  : isInProgress
                  ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 animate-pulse'
                  : isRemediation
                  ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {module.status.replace('_', ' ')}
              </span>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono ml-auto sm:ml-0">
                <Clock className="w-3 h-3" />
                <span>{module.ai_generated_content?.estimated_mins || 15} mins</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              {module.title}
              {isInProgress && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              {module.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 sm:pt-0 shrink-0">
            {/* Copilot shortcut */}
            <button
              onClick={() => openCopilotForModule(module)}
              title="Discuss with AI Copilot"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Read Micro-Lesson */}
            <button
              onClick={() => onOpenLesson(module)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>{module.ai_generated_content ? 'Review Lesson' : 'Start Lesson'}</span>
            </button>

            {/* Take Diagnostic Quiz */}
            <button
              onClick={() => onOpenQuiz(module)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                  : isRemediation
                  ? 'bg-gradient-to-r from-amber-600 to-orange-500 hover:opacity-90 text-white shadow-lg'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white shadow-glow'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isCompleted ? 'Retake Quiz' : 'Take Quiz'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
