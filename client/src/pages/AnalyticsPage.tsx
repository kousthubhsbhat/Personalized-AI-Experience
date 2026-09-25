import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsOverview } from '../types';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { profile } = useApp();
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.warn('Could not fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const scoreTrendData = [
    { module: 'Mod 1', score: 92, target: 80 },
    { module: 'Mod 2', score: 85, target: 80 },
    { module: 'Mod 3', score: 55, target: 80 },
    { module: 'Remediation', score: 96, target: 80 },
    { module: 'Mod 4', score: 90, target: 80 },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Adaptive Intelligence & Skill Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Skill Radar & Calibration Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time evaluation metrics for <strong className="text-slate-200">{profile?.full_name || 'Learner'}</strong> ({profile?.target_role || 'Senior AI Engineer'})
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Mastery</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {data?.stats?.avgMastery || 74}%
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">+8% from baseline</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Adaptive Velocity</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-300">
            {data?.stats?.velocityMultiplier || '1.25x'}
          </div>
          <p className="text-[11px] text-indigo-400 font-medium">Accelerated Track</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Modules Completed</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {data?.stats?.completedModules || 2} / {data?.stats?.totalModules || 4}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">50% of Core Pathway</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Streak & Time</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            {data?.stats?.learningStreakDays || 5} Days
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{data?.stats?.hoursInvested || 12.5} hrs invested</p>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart & Progression Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Radar Chart (Left 6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Multi-Dimensional Competency Radar</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Target: 95% Mastery</span>
          </div>

          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Compares your verified knowledge against high-tier benchmark requirements for <strong className="text-slate-200">{profile?.target_role || 'Senior AI Engineer'}</strong>.
          </p>

          <div className="flex-1 min-h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={data?.skills || [
                { skill: 'React & TS', current: 78, target: 95, fullMark: 100 },
                { skill: 'Node & APIs', current: 65, target: 95, fullMark: 100 },
                { skill: 'Postgres RLS', current: 60, target: 95, fullMark: 100 },
                { skill: 'Gemini AI', current: 72, target: 95, fullMark: 100 },
                { skill: 'Cloud Infra', current: 52, target: 95, fullMark: 100 },
              ]}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis stroke="#334155" angle={30} domain={[0, 100]} />
                <Radar
                  name="Current Score"
                  dataKey="current"
                  stroke="#22d3ee"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Role Benchmark"
                  dataKey="target"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Your Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500/40 border border-indigo-500" />
              <span className="text-slate-400">Target Role Goal (95%)</span>
            </div>
          </div>
        </div>

        {/* Assessment Score Trend Area Chart (Right 6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Diagnostic Score Progression</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Passing: 60%+</span>
          </div>

          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Historical diagnostic test accuracy over time. Notice remediation recovery spikes.
          </p>

          <div className="flex-1 min-h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={scoreTrendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="module" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Average Diagnostic Accuracy:</span>
            <strong className="text-emerald-400 font-mono text-sm">84.2%</strong>
          </div>
        </div>

      </div>

      {/* AI Recommendations & Growth Plan */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Gemini 2.5 Flash Autonomous Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.aiRecommendations || [
            'Prioritize Distributed Cloud Architecture: Complete the Microservices lab to unblock advanced containerized deployment patterns.',
            'Maintain Quiz Velocity: Your high score in AI Integration (+92%) suggests readiness for autonomous multi-agent systems.',
            'Strengthen PostgreSQL RLS: Review database isolation policies before tackling multitenant SaaS enterprise modules.'
          ]).map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Diagnostic Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Recent Diagnostic Assessment Logs
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Auditing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Module Reference</th>
                <th className="py-3 px-4">Diagnostic Score</th>
                <th className="py-3 px-4">Adaptation Status</th>
                <th className="py-3 px-4">AI Feedback Notes</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data?.recentLogs && data.recentLogs.length > 0 ? data.recentLogs : [
                {
                  id: 'log-1',
                  module_id: 'mod-1',
                  score: 95,
                  feedback_notes: 'Demonstrated deep conceptual grasp of prompt schemas and GenAI SDK integration.',
                  adaptation_triggered: false,
                  created_at: new Date(Date.now() - 3600000).toISOString()
                },
                {
                  id: 'log-2',
                  module_id: 'mod-2',
                  score: 55,
                  feedback_notes: 'Struggled with Postgres RLS JWT claim parsing. Remediation module injected.',
                  adaptation_triggered: true,
                  created_at: new Date(Date.now() - 7200000).toISOString()
                },
                {
                  id: 'log-3',
                  module_id: 'mod-remed-1',
                  score: 96,
                  feedback_notes: 'Remediation completed with stellar accuracy. Skill baseline updated.',
                  adaptation_triggered: false,
                  created_at: new Date(Date.now() - 1800000).toISOString()
                }
              ]).map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">{log.module_id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={log.score >= 60 ? 'text-emerald-400' : 'text-rose-400'}>
                      {log.score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {log.adaptation_triggered ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Remediation Injected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Standard Progression
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{log.feedback_notes}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
