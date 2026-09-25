import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  BarChart3,
  Bot,
  User,
  Zap,
  Target,
  Code2,
  Award,
  Settings,
  Layers,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from './CertificateModal';
import { SettingsModal } from './SettingsModal';
import { CodeSandboxModal } from './CodeSandboxModal';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const {
    profile,
    skills,
    isCopilotOpen,
    openCopilotForModule,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    openAuthModal
  } = useApp();

  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avgMastery = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.mastery_score, 0) / skills.length)
    : 78;

  const avatarInitials = profile?.avatar_seed || profile?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'KB';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/pathway" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-cyan">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">SkillPulse</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono leading-none">Adaptive Learning v2.5</p>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-800">
              <Link
                to="/pathway"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  location.pathname === '/pathway' || location.pathname === '/'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                Roadmap
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  location.pathname === '/analytics'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Skill Radar
              </Link>

              <Link
                to="/skill-gap"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  location.pathname === '/skill-gap'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                Gap Analyzer
              </Link>

              <Link
                to="/onboarding"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  location.pathname === '/onboarding'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-400" />
                Profiler
              </Link>
            </nav>
          </div>

          {/* Right Action Tools & Interactive Features */}
          <div className="flex items-center gap-2.5">
            {/* Live Sandbox Quick Launcher */}
            <button
              onClick={() => setIsSandboxOpen(true)}
              title="Launch Interactive Code Sandbox"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sandbox</span>
            </button>

            {/* Verified Certificate Modal */}
            <button
              onClick={() => setIsCertOpen(true)}
              title="View Verified Credential"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 text-xs font-medium transition-all"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificate</span>
            </button>

            {/* Mastery Gauge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mastery: <strong className="text-white">{avgMastery}%</strong></span>
            </div>

            {/* AI Copilot Drawer Toggle */}
            <button
              onClick={() => openCopilotForModule()}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isCopilotOpen
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-indigo-500/50'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Copilot</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-mono">
                AI
              </span>
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-white leading-none text-xs truncate max-w-[110px]">
                    {profile?.full_name || 'Alex Chen'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 leading-tight">
                    @{profile?.username || 'user'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0E1322] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  {/* User details header */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{profile?.full_name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        @{profile?.username}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-medium truncate">{profile?.target_role}</p>
                    <p className="text-[10px] text-slate-400 truncate">{profile?.email}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuthModal('signin');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <LogIn className="w-4 h-4 text-cyan-400" />
                      <span>Switch Account / Sign In</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuthModal('signup');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                      <span>Create New Learner Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsCertOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>View My Certificate</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <Settings className="w-4 h-4 text-indigo-400" />
                      <span>Platform & API Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Engine Settings & API Keys"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all ml-1"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-slate-900/95 border-b border-slate-800 space-y-2 animate-in slide-in-from-top duration-200">
            {/* Mobile user badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {avatarInitials}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{profile?.full_name}</p>
                  <p className="text-[10px] text-cyan-400">@{profile?.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-[10px] font-semibold text-white"
              >
                Switch
              </button>
            </div>

            <Link
              to="/pathway"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              Adaptive Pathway
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Skill Radar & Analytics
            </Link>
            <Link
              to="/skill-gap"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              Skill Gap Analyzer
            </Link>
            <Link
              to="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              Career Goal Profiler
            </Link>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSandboxOpen(true);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Sandbox
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCertOpen(true);
                }}
                className="flex-1 py-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Certificate
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      {isCertOpen && <CertificateModal onClose={() => setIsCertOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isSandboxOpen && <CodeSandboxModal onClose={() => setIsSandboxOpen(false)} />}
    </>
  );
};
