import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Compass,
  RefreshCw,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const TARGET_ROLES = [
  'Senior Full-Stack AI Engineer',
  'Autonomous AI Agent Developer',
  'Cloud Native Platform Engineer',
];

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, addToast, refreshPathway } = useApp();
  const [selectedRole, setSelectedRole] = useState<string>(
    profile?.target_role || 'Senior Full-Stack AI Engineer'
  );
  const [gapData, setGapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRemediating, setIsRemediating] = useState<boolean>(false);

  const fetchGapAnalysis = async (role: string) => {
    setIsLoading(true);
    try {
      const data = await api.analyzeSkillGap(role);
      setGapData(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Gap Analysis Failed',
        description: err.response?.data?.error || 'Could not calculate skill gap telemetry.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGapAnalysis(selectedRole);
  }, [selectedRole]);

  const handleAutoRemediate = async () => {
    setIsRemediating(true);
    try {
      // Re-trigger onboarding pathway for the target role with current baseline
      await api.submitOnboarding({
        target_role: selectedRole,
        learning_style: profile?.learning_style || 'hands-on',
        time_commitment_mins: profile?.time_commitment_mins || 45,
        initial_skills: {
          'React & TypeScript': 3,
          'Node.js APIs': 3,
          'Gemini AI': 4,
          'PostgreSQL RLS': 2,
        }
      });
      await refreshPathway();
      addToast({
        type: 'success',
        title: 'AI Pathway Re-Calibrated',
        description: `Generated targeted modules to close critical gaps for ${selectedRole}.`
      });
      navigate('/pathway');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Auto-Remediation Error',
        description: err.message || 'Failed to re-calibrate pathway.'
      });
    } finally {
      setIsRemediating(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            Strategic Workforce & Career Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Skill Gap & Competency Delta Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Identify exact deficiencies against hiring bar benchmarks for high-leverage roles.
          </p>
        </div>

        {/* Target Role Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {TARGET_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Readiness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Target Role Readiness</span>
            <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-1">
              {gapData?.readinessScore || 75}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {gapData?.readinessScore >= 80 ? 'Near Interview Ready' : 'Acceleration Needed'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <BrainCircuit className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Critical Skill Gaps</span>
            <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1">
              {gapData?.criticalGapsCount || 2}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Delta &gt; 15% from hiring benchmark</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Estimated Remediation Time</span>
            <div className="text-4xl font-extrabold font-mono text-indigo-300 mt-1">
              ~{gapData?.estimatedWeeksToReadiness || 3} Weeks
            </div>
            <p className="text-[11px] text-slate-400 mt-1">At 45 mins/day focused learning pace</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* AI Narrative Summary & 1-Click Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Gemini Diagnostic Strategy</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {gapData?.aiSummary || 'Analyzing benchmark delta against live industry requirements...'}
          </p>
        </div>

        <button
          onClick={handleAutoRemediate}
          disabled={isRemediating}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-40 shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>{isRemediating ? 'Re-Architecting...' : '1-Click Auto-Remediate Gaps'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detailed Skill Breakdown Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Detailed Competency Matrix Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-mono">Role: {selectedRole}</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-2 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-sm">Calculating competency delta...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Domain Skill</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Mastery</th>
                  <th className="py-3 px-4">Required Benchmark</th>
                  <th className="py-3 px-4">Delta Gap</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">AI Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(gapData?.skillsBreakdown || []).map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.skill}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {item.currentMastery}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {item.requiredMastery}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={item.gap === 0 ? 'text-emerald-400' : item.gap <= 15 ? 'text-amber-400' : 'text-rose-400'}>
                        {item.gap === 0 ? 'None' : `-${item.gap}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'mastered' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      ) : item.status === 'moderate_gap' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Moderate
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <ShieldAlert className="w-3 h-3" /> Critical Gap
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">{item.recommendedRemediation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
