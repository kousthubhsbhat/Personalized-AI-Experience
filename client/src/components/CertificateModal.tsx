import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Sparkles,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Zap,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const { addToast } = useApp();
  const [cert, setCert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCert = async () => {
      setIsLoading(true);
      try {
        const data = await api.generateCertificate();
        setCert(data);
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Certificate Generation Failed',
          description: err.response?.data?.error || 'Could not generate certificate.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCert();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/certificate');
    addToast({
      type: 'success',
      title: 'Credential Link Copied',
      description: 'Shareable certificate verification link copied to clipboard.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B0F19] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-amber-400 truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Official Accredited Credential</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-glow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex items-center justify-center bg-[#070b14]">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Award className="w-12 h-12 text-amber-400 animate-bounce mx-auto" />
              <p className="text-sm text-slate-300">Generating cryptographic certificate of mastery...</p>
            </div>
          ) : cert ? (
            <div className="w-full max-w-3xl relative bg-gradient-to-b from-[#111827] via-[#0E1322] to-[#0B0F19] border-2 border-amber-500/40 rounded-2xl p-8 sm:p-12 shadow-2xl overflow-hidden text-center space-y-6">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/60" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/60" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60" />

              {/* Badge Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-glow mb-2">
                <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-amber-400">
                  SkillPulse AI Intelligence Institute
                </p>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                  Certificate of Technical Mastery
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous Adaptive Curriculum & Diagnostic Assessment
                </p>
              </div>

              {/* Recipient */}
              <div className="py-2 border-y border-slate-800/80 max-w-xl mx-auto space-y-1">
                <p className="text-xs text-slate-400 italic">This is proudly presented to</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
                  {cert.recipientName}
                </h3>
                <p className="text-xs text-slate-300">
                  for demonstrating advanced proficiency and verified cognitive execution in
                </p>
                <p className="text-base font-bold text-cyan-400 font-mono pt-1">
                  {cert.roleTitle}
                </p>
              </div>

              {/* Verified Competencies Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
                {(cert.badgeSkills || []).map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 text-[10px] font-mono"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>

              {/* Telemetry & Signatures */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                <div className="text-left">
                  <span className="text-slate-500 font-mono text-[10px] block">ISSUE DATE</span>
                  <strong className="text-slate-300">{cert.issueDate}</strong>
                </div>

                <div className="text-center">
                  <span className="text-slate-500 font-mono text-[10px] block">MASTERY SCORE</span>
                  <strong className="text-emerald-400 font-mono text-sm">{cert.masteryScore}% Verified</strong>
                </div>

                <div className="text-right col-span-2 sm:col-span-1">
                  <span className="text-slate-500 font-mono text-[10px] block">CREDENTIAL ID</span>
                  <strong className="text-slate-300 font-mono text-[10px] truncate block">{cert.certificateId}</strong>
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="pt-2 text-[10px] font-mono text-slate-600 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cryptographic Proof: {cert.verificationHash}</span>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
