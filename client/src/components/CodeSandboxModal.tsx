import React, { useState, useEffect } from 'react';
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
  Trash2,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface CodeSandboxModalProps {
  initialCode?: string;
  initialTitle?: string;
  initialLanguage?: string;
  onClose: () => void;
}

export type SupportedLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'go' | 'rust' | 'sql';

interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  badge: string;
  extension: string;
  color: string;
  accentBg: string;
  description: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    id: 'javascript',
    name: 'JavaScript / TS',
    badge: 'Node.js v20',
    extension: 'playground.ts',
    color: 'text-amber-400',
    accentBg: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    description: 'V8 Execution Engine with Real-Time Interceptor'
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'Python 3.12',
    extension: 'main.py',
    color: 'text-emerald-400',
    accentBg: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    description: 'CPython 3.12 Interactive Standard Runtime'
  },
  {
    id: 'cpp',
    name: 'C++',
    badge: 'GCC 14 C++20',
    extension: 'solution.cpp',
    color: 'text-cyan-400',
    accentBg: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    description: 'ISO C++20 Standard High-Performance Compiler'
  },
  {
    id: 'java',
    name: 'Java',
    badge: 'OpenJDK 21',
    extension: 'Main.java',
    color: 'text-rose-400',
    accentBg: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    description: 'JVM HotSpot 64-Bit Bytecode Execution'
  },
  {
    id: 'go',
    name: 'Go',
    badge: 'Go 1.22',
    extension: 'main.go',
    color: 'text-sky-400',
    accentBg: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    description: 'Go Garbage Collected Goroutine Runtime'
  },
  {
    id: 'rust',
    name: 'Rust',
    badge: 'rustc 1.79',
    extension: 'main.rs',
    color: 'text-orange-400',
    accentBg: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    description: 'Zero-Cost Memory Safe Cargo Environment'
  },
  {
    id: 'sql',
    name: 'PostgreSQL SQL',
    badge: 'Postgres 16',
    extension: 'queries.sql',
    color: 'text-indigo-400',
    accentBg: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    description: 'Relational Schema & Row-Level Security Engine'
  }
];

function getStarterSnippet(lang: SupportedLanguage, name: string, role: string): string {
  switch (lang) {
    case 'python':
      return `# SkillPulse Python 3.12 Platform
# Personalized for ${name} (${role})

class SystemMatrix:
    def __init__(self, learner_name: str, target_role: str):
        self.learner = learner_name
        self.role = target_role
        self.metrics = {"Python_AI": 94, "Vector_DB": 89, "RLS_Security": 92}

    def compute_readiness(self) -> float:
        scores = list(self.metrics.values())
        return round(sum(scores) / len(scores), 1)

matrix = SystemMatrix("${name}", "${role}")
print(f"⚡ Initializing Python Execution for {matrix.learner}...")
avg_score = matrix.compute_readiness()
print(f"🎯 Evaluated Readiness Score: {avg_score}%")

if avg_score >= 85:
    print("🚀 Status: Advanced System Track Unlocked!")
else:
    print("💡 Status: Reinforcement Practice Recommended.")
`;

    case 'cpp':
      return `// SkillPulse C++20 High-Performance Platform
// Personalized for ${name} (${role})

#include <iostream>
#include <string>
#include <vector>
#include <numeric>

int main() {
    std::string learner = "${name}";
    std::string target_role = "${role}";
    std::vector<int> competencies = {92, 88, 95, 90};

    std::cout << "⚡ Compiling C++20 Memory-Optimized Pipeline for " << learner << "...\\n";

    double sum = std::accumulate(competencies.begin(), competencies.end(), 0.0);
    double avg = sum / competencies.size();

    std::cout << "🎯 Real-Time Competency Index: " << avg << "%\\n";
    std::cout << "🚀 Verified Zero Memory Safety Leaks in Translation Unit.\\n";

    return 0;
}
`;

    case 'java':
      return `// SkillPulse Java 21 LTS Platform
// Personalized for ${name} (${role})

import java.util.List;

public class Main {
    public static void main(String[] args) {
        String learnerName = "${name}";
        String targetRole = "${role}";
        List<Integer> skillScores = List.of(90, 95, 87, 93);

        System.out.println("⚡ Starting JVM Execution for " + learnerName + " (" + targetRole + ")...");

        double average = skillScores.stream()
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0);

        System.out.println("🎯 Verified Telemetry Score: " + Math.round(average) + "%");
        System.out.println("🚀 Micro-Service State Engine: Healthy (Zero Exceptions).");
    }
}
`;

    case 'go':
      return `// SkillPulse Go 1.22 Concurrency Engine
// Personalized for ${name} (${role})

package main

import (
	"fmt"
	"time"
)

func main() {
	learner := "${name}"
	role := "${role}"

	fmt.Println("⚡ Initializing Goroutine Stream for", learner, "(", role, ")...")
	time.Sleep(10 * time.Millisecond)

	readiness := 91
	fmt.Println("🎯 Concurrency Readiness Metric:", readiness, "%")
	fmt.Println("🚀 High-Throughput Worker Channels: Online & Active.")
}
`;

    case 'rust':
      return `// SkillPulse Rust 2024 Memory-Safe Platform
// Personalized for ${name} (${role})

fn main() {
    let learner = "${name}";
    let target_role = "${role}";
    let skill_scores = [92, 96, 88, 94];

    println!("⚡ Initializing Rust Engine for {} ({})", learner, target_role);

    let sum: i32 = skill_scores.iter().sum();
    let avg = sum as f32 / skill_scores.len() as f32;

    println!("🎯 Zero-Cost Telemetry Evaluation: {:.1}%", avg);
    println!("🚀 Borrow Checker Status: 100% Memory-Safe Invariants Verified.");
}
`;

    case 'sql':
      return `-- SkillPulse PostgreSQL 16 Relational Engine & RLS
-- Multitenancy & Row-Level Security Rules for ${name}

-- 1. Enable Row-Level Security
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- 2. Define Granular Access Policy
CREATE POLICY "Users can query own metrics"
ON public.user_skills
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Execute Diagnostic Index Scan
SELECT 
    id, 
    skill_name, 
    mastery_score,
    CASE 
        WHEN mastery_score >= 85 THEN 'MASTERED'
        ELSE 'IN_PROGRESS'
    END AS status
FROM public.user_skills
WHERE mastery_score >= 80
ORDER BY mastery_score DESC;
`;

    case 'javascript':
    default:
      return `// SkillPulse Interactive JavaScript / TypeScript Sandbox
// Live Reactive State Engine for ${name} (${role})

const learnerMatrix = {
  name: "${name}",
  targetRole: "${role}",
  skills: [
    { name: "TypeScript Architecture", score: 92 },
    { name: "PostgreSQL RLS Engine", score: 88 },
    { name: "Gemini 2.5 Orchestration", score: 95 }
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
  }
}

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({
  initialCode,
  initialTitle,
  initialLanguage = 'javascript',
  onClose,
}) => {
  const { openCopilotForModule, profile } = useApp();
  const learnerName = profile?.full_name || 'Learner';
  const learnerRole = profile?.target_role || 'Senior AI Engineer';

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    (initialLanguage as SupportedLanguage) || 'javascript'
  );

  const [code, setCode] = useState<string>(
    initialCode || getStarterSnippet(selectedLanguage, learnerName, learnerRole)
  );
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  // Switch language handler
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setCode(getStarterSnippet(lang, learnerName, learnerRole));
    setOutput('');
    setDurationMs(null);
    setHasError(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setHasError(false);
    try {
      const res = await api.runCodeSandbox(code, selectedLanguage);
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
    setCode(getStarterSnippet(selectedLanguage, learnerName, learnerRole));
    setOutput('');
    setDurationMs(null);
    setHasError(false);
  };

  const clearOutput = () => {
    setOutput('');
    setDurationMs(null);
  };

  const currentLangMeta = LANGUAGES.find(l => l.id === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#0B0F19] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Multi-Platform Coding Playground</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold ${currentLangMeta.accentBg}`}>
                  {currentLangMeta.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {initialTitle || `${currentLangMeta.description} • Grounded for ${learnerName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCopilotForModule()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Ask AI Mentor</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Switcher Bar */}
        <div className="px-4 py-2 bg-[#090d17] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Platform:</span>
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? `${lang.accentBg} shadow-sm font-semibold`
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sandbox Body: Split Pane */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden min-h-[380px]">
          
          {/* Left: Code Editor Buffer */}
          <div className="flex flex-col bg-[#070b14]">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-200 font-medium">{currentLangMeta.extension}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  title="Reset to Starter Code"
                  className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Reset</span>
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
              className="flex-1 p-4 bg-[#070b14] text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600 selection:text-white min-h-[280px]"
            />
          </div>

          {/* Right: Console Output Pane */}
          <div className="flex flex-col bg-[#0B0F19]">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-200">Terminal & Execution Log</span>
              </div>

              <div className="flex items-center gap-3">
                {durationMs !== null && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{durationMs}ms</span>
                  </div>
                )}
                {output && (
                  <button
                    onClick={clearOutput}
                    title="Clear Terminal"
                    className="p-1 hover:text-white text-slate-500 rounded hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 min-h-[280px]">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center gap-2 text-cyan-400 animate-pulse py-16">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Compiling & executing {currentLangMeta.name} runtime...</span>
                </div>
              ) : output ? (
                <pre className={`whitespace-pre-wrap ${hasError ? 'text-rose-400' : 'text-slate-200'}`}>
                  {output}
                </pre>
              ) : (
                <div className="text-slate-500 py-16 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>Click "Run Code" to execute {currentLangMeta.name} code and inspect standard output in real-time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>High-precision sandbox with real-time error diagnostics active.</span>
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
              <span>{isRunning ? 'Compiling & Running...' : `Run ${currentLangMeta.name}`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
