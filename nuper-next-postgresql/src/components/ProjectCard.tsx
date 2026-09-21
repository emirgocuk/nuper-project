"use client";

import { useState } from "react";
import { Cpu, Lock, Unlock, Shield, Terminal, Clock, DollarSign, Activity } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    accessPassword?: string | null;
    aiBudgetEstimate?: string | null;
    aiTimeEstimate?: string | null;
    aiDifficultyScore?: number | null;
    aiFeasibilityReport?: string | null;
    user?: { name: string | null } | null;
  };
  isIdea?: boolean;
}

export function ProjectCard({ project, isIdea = false }: ProjectCardProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.accessPassword && password === project.accessPassword) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const isRestricted = project.visibility === "SEMI_PUBLIC" && !isUnlocked;

  return (
    <div className="h-full bg-[#0C101A] border border-white/10 hover:border-sky-500/40 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Corner Mil-Spec Accent Marks */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 group-hover:border-sky-400 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 group-hover:border-sky-400 transition-colors" />

      {/* Header Area */}
      <div>
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/[0.06]">
          {/* Security Clearance Badge */}
          {project.visibility === "SEMI_PUBLIC" ? (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              isUnlocked 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {isUnlocked ? "SEVİYE 02 // ERİŞİLDİ" : "SEVİYE 02 // ŞİFRELİ"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Shield className="w-3 h-3" />
              SEVİYE 01 // AÇIK
            </span>
          )}

          {/* Operational Status Badge */}
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
            isIdea
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : project.status === 'COMPLETED'
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
          }`}>
            {isIdea ? "KONSEPT / AR-GE" : project.status === 'COMPLETED' ? "OPERASYONEL" : "GELİŞTİRİLİYOR"}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-white font-heading tracking-tight mb-3 group-hover:text-sky-300 transition-colors">
          {project.title}
        </h3>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between mt-2">
        {isRestricted ? (
          <div className="py-4 flex flex-col justify-center space-y-4">
            <div className="p-4 bg-[#080B11] border border-red-500/20 rounded-lg text-left font-mono">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
                <Lock className="w-4 h-4" />
                GİZLİ TEKNOLOJİ KATMANI
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Bu projenin mimari şemaları ve teknik spesifikasyonları kilitlidir. İncelemek için yetki anahtarınızı girin.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs">
                    &gt;
                  </div>
                  <input
                    type="password"
                    placeholder="PROTOKOL ANAHTARI"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-[#080B11] border ${
                      error ? 'border-red-500' : 'border-white/10'
                    } focus:border-sky-400 text-white rounded pl-6 pr-3 py-2 text-xs font-mono outline-none transition-colors uppercase`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 text-xs font-mono font-bold tracking-wider rounded transition-colors uppercase"
                >
                  Doğrula
                </button>
              </div>
              {error && (
                <div className="text-[11px] font-mono text-red-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  GEÇERSİZ ERİŞİM ANAHTARI
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {project.description}
            </p>

            {/* AI Estimation & Technical Metrics */}
            {(project.aiBudgetEstimate || project.aiTimeEstimate || project.aiDifficultyScore) && (
              <div className="p-3.5 bg-[#080B11] border border-white/[0.06] rounded-lg space-y-2">
                <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  MÜHENDİSLİK & KAYNAK TELEMETRİSİ
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {project.aiBudgetEstimate && (
                    <div className="p-2 rounded bg-white/[0.02]">
                      <span className="text-gray-500 block text-[10px]">KAYNAK / BÜTÇE:</span>
                      <span className="font-semibold text-gray-200">{project.aiBudgetEstimate}</span>
                    </div>
                  )}
                  {project.aiTimeEstimate && (
                    <div className="p-2 rounded bg-white/[0.02]">
                      <span className="text-gray-500 block text-[10px]">ÇEVRİM SÜRESİ:</span>
                      <span className="font-semibold text-gray-200">{project.aiTimeEstimate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Info Row */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-500">
          <div>
            <span className="text-gray-600 block text-[10px]">KADRO //</span>
            <span className="text-gray-300 font-semibold">{project.user?.name || 'NUPER DEFENSE LABS'}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-600 block text-[10px]">SİSTEM ID //</span>
            <span className="text-sky-400/80">#{project.id.slice(0, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

