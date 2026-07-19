"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Lock, Unlock, Eye, HelpCircle, User } from "lucide-react";

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
      toastError();
    }
  };

  const toastError = () => {
    // Basic browser alert or styling handles the error feedback
    setTimeout(() => setError(false), 2000);
  };

  const isRestricted = project.visibility === "SEMI_PUBLIC" && !isUnlocked;

  return (
    <Card className="h-full bg-glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-blue-500/10 border border-blue-400/20 rounded-xl text-blue-300">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5">
            {project.visibility === "SEMI_PUBLIC" && (
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-1" variant="outline">
                {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {isUnlocked ? "Erişim Açık" : "Şifreli"}
              </Badge>
            )}
            <Badge 
              className={
                isIdea 
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" 
                  : project.status === 'COMPLETED'
                  ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              } 
              variant="outline"
            >
              {isIdea ? "Fikir/Konsept" : project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl mt-5 text-white font-heading font-bold">
          {project.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between space-y-4">
        {isRestricted ? (
          <div className="flex-grow flex flex-col justify-between space-y-4">
            <div className="p-4 bg-red-950/20 border border-red-500/10 rounded-xl text-center text-gray-400 text-xs">
              <Lock className="w-8 h-8 mx-auto mb-2 text-red-400/80" />
              Bu projenin teknik özetleri ve gereksinim analizleri şifrelenmiştir.
            </div>
            
            <form onSubmit={handleUnlock} className="flex gap-2">
              <input
                type="password"
                placeholder="Erişim Şifresi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`flex-grow bg-slate-900/60 border ${error ? 'border-red-500 animate-pulse' : 'border-white/10'} focus:border-blue-500 text-white rounded-lg px-3 py-1.5 text-xs outline-none transition-colors`}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
              >
                Aç
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-grow space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.description}</p>
            
            {/* AI Estimation Summary if available and unlocked */}
            {(project.aiBudgetEstimate || project.aiTimeEstimate || project.aiDifficultyScore) && (
              <div className="p-3.5 bg-blue-950/20 border border-blue-500/10 rounded-xl space-y-2 text-xs">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  Yapay Zeka Kaynak Analizi
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                  {project.aiBudgetEstimate && (
                    <div>
                      <span className="text-gray-500 block">Tahmini Bütçe:</span>
                      <span className="font-semibold text-white">{project.aiBudgetEstimate}</span>
                    </div>
                  )}
                  {project.aiTimeEstimate && (
                    <div>
                      <span className="text-gray-500 block">Tahmini Süre:</span>
                      <span className="font-semibold text-white">{project.aiTimeEstimate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex justify-between items-center">
          <span>{isIdea ? 'Müellif' : 'Geliştirici'}</span>
          <span className="font-semibold text-gray-300">
            {project.user?.name || 'Nuper Industries'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Small inline Lucide fallback component if BrainCircuit doesn't import
function BrainCircuit(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v8" />
      <path d="m16 6-4 4-4-4" />
      <circle cx="12" cy="18" r="4" />
      <path d="M12 14v4" />
    </svg>
  );
}
