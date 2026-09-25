import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Clock,
  Sparkles,
  Bot,
  Code2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface CodeSandboxModalProps {
  initialCode?: string;
  initialTitle?: string;
  onClose: () => void;
}

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({
  initialCode,
  initialTitle,
  onClose,
}) => {
  const { openCopilotForModule, addToast, profile } = useApp();
  const defaultSnippet = `// SkillPulse AI Interactive Sandbox
// Test state machines, async APIs, and Gemini data transforms

const learnerMatrix = {
  name: "${profile?.full_name || 'Learner'}",
  targetRole: "${profile?.target_role || 'Senior AI Engineer'}",
  skills: [
    { name: "TypeScript", score: 88 },
    { name: "Gemini AI", score: 92 },
    { name: "PostgreSQL RLS", score: 75 }
  ]
};

console.log("⚡ Executing SkillPulse State Engine for " + learnerMatrix.name + "...");
const avgScore = learnerMatrix.skills.reduce((acc, s) => acc + s.score, 0) / learnerMatrix.skills.length;
console.log(\`🎯 Verified Readiness: \${Math.round(avgScore)}%\`);

if (avgScore >= 85) {
  console.log("🚀 Status: Advanced Track Acceleration Unlocked!");
} else {
  console.log("💡 Status: Recommended targeted practice.");
}
`;
  const [code, setCode] = useState<string>(initialCode || defaultSnippet);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
    setHasError(false);
    try {
      const res = await api.runCodeSandbox(code, 'javascript');
      setOutput(res.output);
      setDurationMs(res.durationMs);
      if (res.error) {
        setHasError(true);
      }
    } catch (err: any) {
      setOutput(`[Execution Error]: ${err.response?.data?.error || err.message}`);
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(initialCode || defaultSnippet);
    setOutput('');
    setDurationMs(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#0B0F19] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Live Interactive Code Sandbox</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  JS / TS Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">{initialTitle || 'Test logic, simulate edge cases, and inspect telemetry'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCopilotForModule()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
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

        {/* Sandbox Body: Split Pane */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden min-h-[400px]">
          
          {/* Left: Code Editor Buffer */}
          <div className="flex flex-col bg-[#070b14]">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-medium">playground.ts</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  title="Reset Code"
                  className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-[#070b14] text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600 selection:text-white min-h-[280px]"
            />
          </div>

          {/* Right: Console Output Pane */}
          <div className="flex flex-col bg-[#0B0F19]">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">Terminal Output</span>
              </div>

              {durationMs !== null && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>{durationMs}ms</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 min-h-[280px]">
              {isRunning ? (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse py-8 justify-center">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Executing in sandbox runtime...</span>
                </div>
              ) : output ? (
                <pre className={`whitespace-pre-wrap ${hasError ? 'text-rose-400' : 'text-slate-200'}`}>
                  {output}
                </pre>
              ) : (
                <div className="text-slate-600 py-12 text-center">
                  Click "Run Code" to execute script and inspect output in real time.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Powered by isolated runtime execution with safe error boundary.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-40"
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
