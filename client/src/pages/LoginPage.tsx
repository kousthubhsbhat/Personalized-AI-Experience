import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  UserPlus,
  LogIn,
  Zap,
  Target,
  User,
  Lock,
  Mail,
  Sliders,
  ArrowRight,
  BrainCircuit,
  Compass,
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { api, RegisterUserPayload } from '../services/api';
import { useApp } from '../context/AppContext';
import { Profile } from '../types';

const PRESET_ROLES = [
  'Senior Full-Stack AI Engineer',
  'Autonomous AI Agent Developer',
  'LLM Systems Architect',
  'Cloud Native Platform Engineer',
  'AI Solutions & MLOps Specialist',
  'Full-Stack TypeScript Specialist'
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, refreshPathway, profile: currentProfile } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState<string>('');
  const [signInPin, setSignInPin] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up Form State
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack AI Engineer');
  const [customRole, setCustomRole] = useState<string>('');
  const [learningStyle, setLearningStyle] = useState<'hands-on' | 'visual' | 'theoretical'>('hands-on');
  const [timeCommitment, setTimeCommitment] = useState<number>(45);
  const [securityPin, setSecurityPin] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setSignInError('Please provide your username or email address.');
      return;
    }

    setIsSigningIn(true);
    setSignInError(null);

    try {
      const res = await api.signInUser(signInIdentifier.trim(), signInPin.trim() || undefined);
      if (res.success && res.profile) {
        await refreshPathway();
        addToast({
          type: 'success',
          title: `Welcome back, ${res.profile.full_name}!`,
          description: `Loaded personalized roadmap for ${res.profile.target_role}.`
        });
        navigate('/pathway');
      } else {
        setSignInError(res.error || 'Authentication credentials not recognized.');
      }
    } catch (err: any) {
      setSignInError(err.message || 'Unable to complete login.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setSignUpError('Please complete all required fields.');
      return;
    }

    const finalRole = customRole.trim() || targetRole;
    setIsRegistering(true);
    setSignUpError(null);

    try {
      const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
      const payload: RegisterUserPayload = {
        full_name: fullName.trim(),
        username: clean,
        email: email.trim(),
        target_role: finalRole,
        learning_style: learningStyle,
        time_commitment_mins: timeCommitment,
        security_pin: securityPin.trim() || undefined
      };

      const result = await api.registerUser(payload);
      await refreshPathway();

      addToast({
        type: 'success',
        title: `Welcome to SkillPulse, ${result.profile.full_name}!`,
        description: `Your custom adaptive track for ${finalRole} has been generated.`
      });

      navigate('/pathway');
    } catch (err: any) {
      setSignUpError(err.message || 'Could not create new user profile.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Platform Branding & Value Showcase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-glow">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SkillPulse AI Intelligence Engine v2.5</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Adaptive Learning & Career Acceleration
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Autonomous AI curriculum calibrated per learner. Every user receives a unique pathway, real-time diagnostic checks, and verified credentials.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Role-Specific Roadmaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic modules tailored specifically to your target career title.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Skill Radar & Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-dimensional competency matrix benchmarked against hiring bars.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Gemini AI Copilot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time technical mentor contextually grounded in your active lessons.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Accredited Credentials</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically verifiable certificates issued in your name.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-around text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Multi-Tenant Storage
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL RLS
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Gemini 2.5
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Login & Register Card */}
        <div className="lg:col-span-6 bg-[#0E1322] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Form Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">Learner Access Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to your personalized roadmap or register</p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  tab === 'signin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('signup')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enter your credentials to access your individualized AI pathway.</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Username or Email:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. your_username or you@example.com"
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Security PIN (Optional):</span>
                    </span>
                    <span className="text-slate-500 text-[10px]">Leave blank if not set</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={signInPin}
                    onChange={(e) => setSignInPin(e.target.value)}
                    placeholder="Enter PIN if configured"
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Remember my profile on this device</span>
                  </label>
                </div>

                {signInError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSigningIn || !signInIdentifier.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSigningIn ? 'Authenticating...' : 'Sign In & Launch Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: SIGN UP / CREATE PROFILE */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name: <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, ''));
                      }
                    }}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Username handle (user.name): <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    placeholder="e.g. johndoe"
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Email Address: <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. johndoe@example.com"
                  className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Target Role Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Role (Generates Tailored AI Modules):</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    setCustomRole('');
                  }}
                  className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                >
                  {PRESET_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="custom">Other / Custom Niche Title</option>
                </select>

                {targetRole === 'custom' && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Type custom role title..."
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none mt-1"
                  />
                )}
              </div>

              {/* Learning Style & Pace */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Learning Style:</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="hands-on">Hands-On Labs</option>
                    <option value="visual">Visual Architecture</option>
                    <option value="theoretical">Theoretical Deep Dive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Daily Pace:</label>
                  <select
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(Number(e.target.value))}
                    className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value={15}>15 Mins / Day</option>
                    <option value={30}>30 Mins / Day</option>
                    <option value={45}>45 Mins / Day (Recommended)</option>
                    <option value={60}>60 Mins / Day</option>
                  </select>
                </div>
              </div>

              {/* Optional Security PIN */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Security PIN (Optional):</span>
                  <span className="text-slate-500 text-[10px]">4-6 digit passcode</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full bg-[#070B14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              {signUpError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isRegistering || !fullName.trim() || !username.trim() || !email.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-glow-cyan transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isRegistering ? 'Generating Customized Pathway...' : 'Create Profile & Launch Roadmap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
