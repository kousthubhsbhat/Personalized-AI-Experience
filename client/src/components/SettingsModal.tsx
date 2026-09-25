import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Server,
  User,
  Shield,
  Zap,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { profile, addToast, refreshPathway } = useApp();
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [keyStatus, setKeyStatus] = useState<{ valid?: boolean; message?: string } | null>(null);

  const handleVerifyKey = async () => {
    if (!apiKey.trim()) return;
    setIsVerifying(true);
    setKeyStatus(null);
    try {
      const res = await api.verifyGeminiKey(apiKey.trim());
      setKeyStatus({ valid: res.valid, message: res.message });
      if (res.valid) {
        localStorage.setItem('skillpulse_gemini_key', apiKey.trim());
        addToast({
          type: 'success',
          title: 'Gemini 2.5 Flash Connected',
          description: 'Your API key is active for live generative AI synthesis.'
        });
      }
    } catch (err: any) {
      setKeyStatus({
        valid: false,
        message: err.response?.data?.message || 'Verification failed. Check API key permissions.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0E1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Platform Engine Settings</h3>
              <p className="text-xs text-slate-400">Manage AI provider credentials, database sync, and dev telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300">
          
          {/* Gemini AI Key Section */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Google Gemini 2.5 Flash API Key</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Hybrid Engine Ready
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              SkillPulse AI runs with full simulated AI resilience by default. Provide your personal Gemini API key to activate live generative endpoints.
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-[#070b14] border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
              <button
                onClick={handleVerifyKey}
                disabled={isVerifying || !apiKey.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-40 transition-colors shadow-glow shrink-0"
              >
                {isVerifying ? 'Testing...' : 'Verify Key'}
              </button>
            </div>

            {keyStatus && (
              <div className={`p-3 rounded-xl border flex items-start gap-2 ${
                keyStatus.valid
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                {keyStatus.valid ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{keyStatus.message}</span>
              </div>
            )}
          </div>

          {/* Supabase Database Isolation */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Supabase Cloud & RLS Policy Layer</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PostgreSQL RLS
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Data isolation is enforced per user ID. All learning pathways, modules, and diagnostic logs are protected with strict tenant barriers.
            </p>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">AUTH METHOD</span>
                <span className="text-slate-200">Supabase JWT / Dev Bearer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">STORE MODE</span>
                <span className="text-cyan-400">Hybrid Reactive Store</span>
              </div>
            </div>
          </div>

          {/* Active Profile Info */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Current Authenticated Learner</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <p className="font-bold text-white">{profile?.full_name || 'Learner'}</p>
                <p className="text-slate-400 font-mono text-[11px]">@{profile?.username || 'user'} • <span className="text-cyan-400">Database Record Active</span></p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                ID: {profile?.id || 'user_dev_pulse_01'}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
