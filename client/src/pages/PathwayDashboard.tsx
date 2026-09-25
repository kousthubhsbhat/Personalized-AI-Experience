import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Zap,
  TrendingUp,
  BrainCircuit,
  Bot,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Target,
  ArrowRight,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PathwayNode } from '../components/PathwayNode';
import { MicroLessonModal } from '../components/MicroLessonModal';
import { AdaptiveQuizModal } from '../components/AdaptiveQuizModal';
import { CodeSandboxModal } from '../components/CodeSandboxModal';
import { PathwayModule } from '../types';

export const PathwayDashboard: React.FC = () => {
  const {
    pathway,
    modules,
    skills,
    profile,
    isLoadingPathway,
    refreshPathway,
    openCopilotForModule
  } = useApp();

  const [activeLessonModule, setActiveLessonModule] = useState<PathwayModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<PathwayModule | null>(null);
  const [sandboxState, setSandboxState] = useState<{ isOpen: boolean; code?: string; title?: string }>({
    isOpen: false,
  });

  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const totalCount = modules.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const remediationCount = modules.filter(
    (m) => m.status === 'remediation' || m.title.includes('Remediation')
  ).length;

  const avgMastery = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.mastery_score, 0) / skills.length)
    : 70;

  const handleOpenLesson = (mod: PathwayModule) => {
    setActiveLessonModule(mod);
  };

  const handleOpenQuiz = (mod: PathwayModule) => {
    setActiveLessonModule(null);
    setActiveQuizModule(mod);
  };

  const handleOpenSandboxFromLesson = (code: string, title?: string) => {
    setSandboxState({ isOpen: true, code, title });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Hero Banner with Adaptive Intelligence */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0E1424] border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive Learning Engine Active
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
                Model: Gemini 2.5 Flash
              </span>

              {remediationCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  {remediationCount} Active AI Remediation
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pathway?.title || 'Senior Full-Stack AI Engineer Adaptive Track'}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time pathway calibrated for <strong className="text-white">{profile?.full_name || 'Alex Chen'}</strong> targeting <strong className="text-cyan-400">{profile?.target_role || 'Senior AI Engineer'}</strong>. Modules dynamically evolve based on diagnostic feedback.
            </p>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-medium">Progress</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">{progressPercent}%</div>
              <div className="text-[10px] text-indigo-400 font-medium mt-0.5">{completedCount} of {totalCount} Modules</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-medium">Avg Mastery</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5">{avgMastery}%</div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">+12% Velocity</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400 font-medium">Style</div>
              <div className="text-sm font-bold capitalize text-amber-400 mt-1.5">{profile?.learning_style || 'hands-on'}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{profile?.time_commitment_mins || 30}m/day</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={refreshPathway}
            title="Refresh Roadmap"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Roadmap (Left 8 cols) & Skill Snapshot (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Pathway Nodes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Adaptive Learning Sequence</h2>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {modules.length} Modules in Active Track
            </span>
          </div>

          {isLoadingPathway ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-sm">Loading dynamic learning nodes...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
              <Target className="w-12 h-12 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-semibold text-white">No active learning pathway found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Calibrate your skills and generate a personalized curriculum tailored to your exact career objective.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-glow"
              >
                Launch Skill Profiler
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((mod, idx) => (
                <PathwayNode
                  key={mod.id}
                  module={mod}
                  index={idx}
                  total={modules.length}
                  onOpenLesson={handleOpenLesson}
                  onOpenQuiz={handleOpenQuiz}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Skills Matrix & Quick Copilot Launcher */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Skill Mastery Matrix Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Skill Matrix</h3>
              </div>
              <Link
                to="/analytics"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                Radar View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {skills.map((s) => (
                <div key={s.id || s.skill_name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">{s.skill_name}</span>
                    <span className="font-mono font-bold text-slate-200">{s.mastery_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        s.mastery_score >= 80
                          ? 'bg-emerald-400'
                          : s.mastery_score >= 60
                          ? 'bg-cyan-400'
                          : 'bg-indigo-400'
                      }`}
                      style={{ width: `${s.mastery_score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tech Mentor Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3 shadow-glow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Need Live Guidance?</h4>
                <p className="text-xs text-slate-400">Contextual AI Coach available 24/7</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ask about system design, code edge cases, or request custom interactive interview questions.
            </p>

            <button
              onClick={() => openCopilotForModule(modules.find(m => m.status === 'in_progress') || modules[0])}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-opacity"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Tech Mentor</span>
            </button>
          </div>

          {/* Quick Career Profiler CTA */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-center">
            <Target className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Switch Career Target?</h4>
            <p className="text-xs text-slate-400">
              Update your target role or learning style to have Gemini re-architect your roadmap.
            </p>
            <Link
              to="/onboarding"
              className="inline-block w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              Recalibrate Profile
            </Link>
          </div>

        </div>
      </div>

      {/* Micro-Lesson Viewer Modal */}
      {activeLessonModule && (
        <MicroLessonModal
          module={activeLessonModule}
          onClose={() => setActiveLessonModule(null)}
          onStartQuiz={handleOpenQuiz}
          onOpenSandbox={handleOpenSandboxFromLesson}
        />
      )}

      {/* Adaptive Quiz Modal */}
      {activeQuizModule && (
        <AdaptiveQuizModal
          module={activeQuizModule}
          onClose={() => setActiveQuizModule(null)}
          onQuizCompleted={refreshPathway}
        />
      )}

      {/* Interactive Code Sandbox Modal */}
      {sandboxState.isOpen && (
        <CodeSandboxModal
          initialCode={sandboxState.code}
          initialTitle={sandboxState.title}
          onClose={() => setSandboxState({ isOpen: false })}
        />
      )}

    </div>
  );
};
