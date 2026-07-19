"use client";

import { useState, useTransition } from "react";
import { triggerFetchTrends, importTrendToProject } from "./actions";
import { toast } from "sonner";
import { RefreshCw, ExternalLink, Import, CheckCircle, BrainCircuit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface TrendItem {
  id: string;
  title: string;
  link: string;
  publishedAt: Date | null;
  aiScore: number;
  aiSummary: string | null;
  aiFeasibility: string | null;
  isImported: boolean;
  source: {
    name: string;
  };
}

export default function TrendsClient({ initialTrends }: { initialTrends: TrendItem[] }) {
  const [trends, setTrends] = useState<TrendItem[]>(initialTrends);
  const [isFetching, startFetching] = useTransition();
  const [isImporting, startImporting] = useTransition();

  const handleFetchTrends = () => {
    const toastId = toast.loading("RSS haber akışları taranıyor ve AI analizleri yapılıyor...");
    startFetching(async () => {
      const result = await triggerFetchTrends();
      if (result.success) {
        toast.success(`Tarama tamamlandı! ${result.count} yeni teknoloji trendi eklendi.`, { id: toastId });
        // Refresh page/state would happen automatically, but we can instruct the user
        window.location.reload();
      } else {
        toast.error(`Tarama başarısız: ${result.error}`, { id: toastId });
      }
    });
  };

  const handleImport = (trendId: string) => {
    const toastId = toast.loading("Gelişme özel projelere ithal ediliyor...");
    startImporting(async () => {
      const result = await importTrendToProject(trendId);
      if (result.success) {
        toast.success("Fikir başarıyla özel projenize (Private Idea) aktarıldı!", { id: toastId });
        setTrends(prev => 
          prev.map(t => t.id === trendId ? { ...t, isImported: true } : t)
        );
      } else {
        toast.error(`İthalat başarısız: ${result.error}`, { id: toastId });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-blue-600" />
            Teknoloji İstihbaratı & Haber Havuzu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Küresel teknoloji gelişmelerini takip edip, AI fizibilite raporları yardımıyla kendi projelerinize dönüştürün.
          </p>
        </div>
        <button
          onClick={handleFetchTrends}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Haberler Çekiliyor..." : "Haberleri Şimdi Çek"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {trends.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white">
            <p className="text-slate-500">Henüz taranmış haber bulunmuyor. Başlamak için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          trends.map((trend) => {
            // Determine color based on AI Score
            let scoreBg = "bg-gray-100 text-gray-700";
            let scoreText = "Düşük";
            if (trend.aiScore >= 80) {
              scoreBg = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
              scoreText = "Yüksek Fizibilite";
            } else if (trend.aiScore >= 50) {
              scoreBg = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
              scoreText = "Orta Fizibilite";
            }

            return (
              <div 
                key={trend.id} 
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-blue-600 uppercase tracking-wide">
                      {trend.source.name}
                    </span>
                    {trend.publishedAt && (
                      <span>
                        {formatDistanceToNow(new Date(trend.publishedAt), { addSuffix: true, locale: tr })}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    <a 
                      href={trend.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-blue-600 flex items-center gap-1.5 group"
                    >
                      {trend.title}
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                    </a>
                  </h3>

                  {/* AI Evaluation */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${scoreBg}`}>
                        {trend.aiScore} pts - {scoreText}
                      </span>
                    </div>

                    {trend.aiSummary && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Özeti</h4>
                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{trend.aiSummary}</p>
                      </div>
                    )}

                    {trend.aiFeasibility && (
                      <div className="border-t border-slate-200/50 pt-2.5 mt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uygulanabilirlik Yorumu</h4>
                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed italic">{trend.aiFeasibility}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {trend.isImported ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      İthal Edildi
                    </button>
                  ) : (
                    <button
                      onClick={() => handleImport(trend.id)}
                      disabled={isImporting}
                      className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow"
                    >
                      <Import className="w-4 h-4" />
                      Fikir Havuzuna İthal Et
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
