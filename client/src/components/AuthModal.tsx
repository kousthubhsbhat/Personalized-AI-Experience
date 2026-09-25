import React, { useState } from 'react';
import {
  X,
  User,
  Key,
  Mail,
  Target,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Bot
} from 'lucide-react';
import { api, RegisterUserPayload } from '../services/api';
import { useApp } from '../context/AppContext';
import { Profile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const PRESET_ROLES = [
  'Senior Full-Stack AI Engineer',
  'Autonomous AI Agent Developer',
  'LLM Systems Architect',
  'Cloud Native Platform Engineer',
  'AI Solutions & MLOps Specialist',
  'Full-Stack TypeScript Specialist'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { addToast, refreshPathway, profile: activeProfile } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>(initialMode);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState<string>('');
  const [signInPin, setSignInPin] = useState<string>('');
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

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setSignInError('Please enter a username or email.');
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
          description: `Loaded personalized curriculum for ${res.profile.target_role}.`
        });
        onClose();
      } else {
        setSignInError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setSignInError(err.message || 'Could not complete sign in.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setSignUpError('Please fill in all required fields.');
      return;
    }

    const finalRole = customRole.trim() || targetRole;
    setIsRegistering(true);
    setSignUpError(null);

    try {
      const payload: RegisterUserPayload = {
        full_name: fullName.trim(),
        username: username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''),
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
        title: `Profile Created for ${result.profile.full_name}!`,
        description: `Engineered an individualized adaptive pathway for ${finalRole}.`
      });

      onClose();
    } catch (err: any) {
      setSignUpError(err.message || 'Failed to create new user profile.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0E1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Learner Authentication & Profiles</h3>
              <p className="text-xs text-slate-400">Isolated pathways & personalized telemetry per user</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              tab === 'signin'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Switch Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              tab === 'signup'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Profile</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enter your username and password/PIN to sign in to your dashboard.</span>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Username or Email:</span>
                  </label>
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. kousthubh or alex.chen"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Security PIN (Optional):</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={signInPin}
                    onChange={(e) => setSignInPin(e.target.value)}
                    placeholder="Enter PIN if set"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
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
                  <span>{isSigningIn ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: SIGN UP / CREATE NEW PROFILE */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
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
                    placeholder="e.g. Kousthubh S Bhat"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Username / Handle (user.name): <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    placeholder="e.g. kousthubh"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Email Address: <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kousthubh@example.com"
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Target Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Career Goal (Drives Custom AI Pathway):</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    setCustomRole('');
                  }}
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                >
                  {PRESET_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="custom">Other / Custom Title</option>
                </select>

                {targetRole === 'custom' && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Type custom niche or title..."
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none mt-1.5"
                  />
                )}
              </div>

              {/* Cognitive Style & Commitment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Learning Style:</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="hands-on">Hands-On Labs</option>
                    <option value="visual">Visual Architecture</option>
                    <option value="theoretical">Theoretical Deep Dive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Daily Pace:</label>
                  <select
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(Number(e.target.value))}
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value={15}>15 Mins / Day (Micro)</option>
                    <option value={30}>30 Mins / Day (Steady)</option>
                    <option value={45}>45 Mins / Day (Optimal)</option>
                    <option value={60}>60 Mins / Day (Intensive)</option>
                  </select>
                </div>
              </div>

              {/* Optional Security PIN */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Security PIN (Optional device lock):</span>
                  <span className="text-slate-500 text-[10px]">4-6 digits</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
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
                <span>{isRegistering ? 'Synthesizing Individual Pathway...' : 'Create Account & Generate Pathway'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Tenant Engine Active</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
