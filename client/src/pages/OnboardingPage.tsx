import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  BrainCircuit,
  Compass,
  Clock,
  BookOpen,
  Code2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const PRESET_ROLES = [
  'Senior Full-Stack AI Engineer',
  'LLM Systems Architect',
  'Autonomous AI Agent Developer',
  'Cloud Native Platform Engineer',
  'AI Solutions & ML Ops Engineer',
  'Full-Stack TypeScript Specialist'
];

const DEFAULT_SKILLS = [
  { name: 'TypeScript & Modern React', key: 'react_ts', defaultLevel: 4 },
  { name: 'Node.js & Express Architecture', key: 'node_express', defaultLevel: 3 },
  { name: 'Google Gemini & GenAI SDKs', key: 'gemini_ai', defaultLevel: 3 },
  { name: 'PostgreSQL & Database RLS', key: 'postgres_rls', defaultLevel: 3 },
  { name: 'Cloud Infrastructure & Microservices', key: 'cloud_infra', defaultLevel: 2 },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, refreshPathway } = useApp();

  const [step, setStep] = useState<number>(1);
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack AI Engineer');
  const [customRole, setCustomRole] = useState<string>('');
  const [learningStyle, setLearningStyle] = useState<'hands-on' | 'visual' | 'theoretical'>('hands-on');
  const [timeCommitment, setTimeCommitment] = useState<number>(45);
  const [skills, setSkills] = useState<Record<string, number>>({
    'TypeScript & Modern React': 4,
    'Node.js & Express Architecture': 3,
    'Google Gemini & GenAI SDKs': 3,
    'PostgreSQL & Database RLS': 3,
    'Cloud Infrastructure & Microservices': 2,
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSkillChange = (skillName: string, value: number) => {
    setSkills((prev) => ({
      ...prev,
      [skillName]: value,
    }));
  };

  const handleFinish = async () => {
    const finalRole = customRole.trim() || targetRole;
    setIsGenerating(true);

    try {
      await api.submitOnboarding({
        target_role: finalRole,
        learning_style: learningStyle,
        time_commitment_mins: timeCommitment,
        initial_skills: skills,
      });

      await refreshPathway();

      addToast({
        type: 'success',
        title: 'Curriculum Engineered with Gemini 2.5 Flash!',
        description: `Generated an adaptive roadmap tailored for ${finalRole}.`
      });

      navigate('/pathway');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Pathway Generation Failed',
        description: err.response?.data?.error || 'Could not generate learning pathway.'
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Header Stepper */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Adaptive Skill Profiler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Design Your High-Impact Career Roadmap
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Gemini 2.5 Flash analyzes your baseline strengths, pace, and goals to build a dynamic curriculum.
        </p>

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 rounded-full transition-all ${
                    step > s ? 'bg-emerald-500/60' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#0E1322] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {isGenerating ? (
          <div className="py-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto shadow-glow animate-pulse">
              <BrainCircuit className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Synthesizing Adaptive Pathway</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                Gemini 2.5 Flash is mapping your skill profiler matrix to targeted micro-modules, code labs, and real-world architectures...
              </p>
            </div>
            <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-pulse w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Target Role */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Select Your Target Career Objective
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose an industry archetype or write in your bespoke title.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_ROLES.map((role) => {
                    const isSelected = targetRole === role && !customRole;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setTargetRole(role);
                          setCustomRole('');
                        }}
                        className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span className="text-sm font-semibold">{role}</span>
                        {isSelected && <Sparkles className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Role Input */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-400">
                    Or specify a custom niche / role:
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g., Staff AI Platform Security Engineer"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Learning Style & Time */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    Cognitive Style & Time Commitment
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    How do you absorb complex technical architectures most effectively?
                  </p>
                </div>

                {/* Learning Style Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'hands-on',
                      title: 'Hands-On Labs',
                      desc: 'Code-first implementation snippets and live sandbox debugging.',
                      icon: Code2
                    },
                    {
                      id: 'visual',
                      title: 'Visual Architecture',
                      desc: 'System flow diagrams, mental models, and component hierarchies.',
                      icon: Compass
                    },
                    {
                      id: 'theoretical',
                      title: 'Theoretical Deep Dive',
                      desc: 'Under-the-hood protocol deep dives, algorithms, and design docs.',
                      icon: BookOpen
                    }
                  ].map((style) => {
                    const Icon = style.icon;
                    const isSelected = learningStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setLearningStyle(style.id as any)}
                        className={`p-4 rounded-2xl text-left border transition-all space-y-2 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl w-fit ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-white">{style.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Daily Time Slider */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold text-white">Daily Target Commitment</span>
                    </div>
                    <span className="text-base font-bold font-mono text-cyan-400">
                      {timeCommitment} Minutes / Day
                    </span>
                  </div>

                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>15m (Micro-burst)</span>
                    <span>45m (Optimal)</span>
                    <span>120m (Intensive)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skill Self-Assessment Matrix */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-emerald-400" />
                    Baseline Competency Calibration
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Rate your self-reported proficiency from 1 (Novice) to 5 (Expert / Lead).
                  </p>
                </div>

                <div className="space-y-4">
                  {DEFAULT_SKILLS.map((s) => {
                    const currentVal = skills[s.name] || s.defaultLevel;
                    return (
                      <div
                        key={s.key}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Level {currentVal} / 5
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSkillChange(s.name, lvl)}
                              className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                                currentVal === lvl
                                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                                  : currentVal > lvl
                                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-900/40'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm shadow-glow-cyan transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate Adaptive AI Roadmap</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};
