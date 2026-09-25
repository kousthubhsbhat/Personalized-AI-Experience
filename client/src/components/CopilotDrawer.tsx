import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  Code2,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  { 
    icon: Lightbulb, 
    label: "Mental Model", 
    prompt: "Can you explain this module's core concept simply with a relatable, high-precision mental model?" 
  },
  { 
    icon: Code2, 
    label: "Multi-Language Challenge", 
    prompt: "Give me a practical hands-on coding challenge with solutions in Python, C++, and TypeScript for this topic." 
  },
  { 
    icon: ShieldCheck, 
    label: "Security & Big-O Audit", 
    prompt: "Perform a Big-O algorithmic complexity analysis and outline top 3 security/production gotchas for this architecture." 
  },
  { 
    icon: Sparkles, 
    label: "Staff Interview Question", 
    prompt: "Ask me a rigorous Staff/Principal Engineer level systems design interview question related to this module." 
  }
];

export const CopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, copilotModuleContext, profile } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 Hello! I am your **SkillPulse AI Tech Mentor** powered by Google Gemini with **High-Precision Grounding**.\n\nI am connected directly to your active learning pathway for **${profile?.target_role || 'Senior AI Engineer'}**.\n\nAsk me anything about system architecture, Big-O complexity, security policies (Postgres RLS), or multi-language code implementations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [messages, isCopilotOpen]);

  useEffect(() => {
    if (profile) {
      setMessages([
        {
          id: `welcome-${profile.username}`,
          role: 'assistant',
          content: `👋 Hello **${profile.full_name}** (@${profile.username})!\n\nI am your personalized **SkillPulse AI Tech Mentor** powered by Google Gemini with **High-Precision Guardrails**.\n\nI am calibrated directly for **${profile.target_role}**.\n\nAsk me anything about system architecture, code reviews, algorithmic complexity, or production engineering!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [profile?.username]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await api.askCopilot(
        messageText,
        copilotModuleContext?.id,
        copilotModuleContext ? `Current Module: ${copilotModuleContext.title} (${copilotModuleContext.difficulty})` : undefined
      );

      const aiMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: `⚠️ *Error generating response:* ${err.response?.data?.error || err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'cleared-1',
        role: 'assistant',
        content: `Conversation reset. How can I assist with your study track for **${profile?.target_role || 'Tech Leadership'}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0E1322] border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">SkillPulse AI Copilot</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>High Precision (Temp: 0.2)</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Deterministic Reasoning & Zero-Hallucination Guardrail</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              title="Clear Chat"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Context Banner */}
        {copilotModuleContext && (
          <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400">Attached Module:</span>
              <span className="text-indigo-200 font-medium truncate">{copilotModuleContext.title}</span>
            </div>
            <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-mono">
              {copilotModuleContext.difficulty}
            </span>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-xs'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#070b14] prose-pre:border prose-pre:border-slate-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-700/30 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-800/60 p-3.5 rounded-xl border border-indigo-500/30 animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>High-Precision Engine synthesizing verified technical response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-medium text-slate-400">Precision Prompts</span>
            <span className="text-[10px] text-indigo-400 font-mono">Calibrated for {profile?.target_role || 'Staff Eng'}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 hover:border-indigo-500/40 border border-slate-700/50 text-left text-xs text-slate-300 hover:text-white transition-all duration-150 disabled:opacity-50"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copilotModuleContext ? `Ask high-precision question on "${copilotModuleContext.title}"...` : "Ask a technical or architectural question..."}
            className="flex-1 bg-[#070b14] border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center shadow-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
