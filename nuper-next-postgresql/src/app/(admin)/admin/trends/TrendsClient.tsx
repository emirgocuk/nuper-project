"use client";

import { useState, useTransition } from "react";
import { triggerFetchTrends, importTrendToProject, analyzeSingleTrend, updateTrendFeedback } from "./actions";
import { toast } from "sonner";
import { RefreshCw, ExternalLink, Import, CheckCircle, BrainCircuit, ChevronDown, ChevronUp, Star } from "lucide-react";
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
  userScore: number | null;
  userNotes: string | null;
  status: string;
  source: {
    name: string;
  };
}

export default function TrendsClient({ initialTrends }: { initialTrends: TrendItem[] }) {
  const [trends, setTrends] = useState<TrendItem[]>(initialTrends);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [isFetching, startFetching] = useTransition();
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isImporting, startImporting] = useTransition();

  const handleFetchTrends = () => {
    const toastId = toast.loading("Haber akışları taranıyor...");
    startFetching(async () => {
      const result = await triggerFetchTrends();
      if (result.success) {
        toast.success(`Haber akışları güncellendi!`, { id: toastId });
        window.location.reload();
      } else {
        toast.error(`Tarama başarısız: ${result.error}`, { id: toastId });
      }
    });
  };

  const handleAnalyzeSingle = (trendId: string) => {
    const toastId = toast.loading("Yapay zeka analiz raporu hazırlanıyor...");
    startAnalyzing(async () => {
      const result = await analyzeSingleTrend(trendId);
      if (result.success) {
        toast.success("AI Analizi başarıyla tamamlandı!", { id: toastId });
        window.location.reload();
      } else {
        toast.error(`Analiz hatası: ${result.error}`, { id: toastId });
      }
    });
  };

  const handleImport = (trendId: string) => {
    const toastId = toast.loading("Fikir portföyüne aktarılıyor...");
    startImporting(async () => {
      const result = await importTrendToProject(trendId);
      if (result.success) {
        toast.success("Girişim fikri başarıyla aktarıldı!", { id: toastId });
        setTrends(prev => 
          prev.map(t => t.id === trendId ? { ...t, isImported: true } : t)
        );
      } else {
        toast.error(`Aktarma başarısız: ${result.error}`, { id: toastId });
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs">
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              İstihbarat & Trend Havuzu
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Küresel haberleri toplayın, kaynakça araştırması yapın ve zihinsel geri besleme döngünüzü (RLHF) yönetin.
            </p>
          </div>
        </div>
        <button
          onClick={handleFetchTrends}
          disabled={isFetching}
          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Taranıyor..." : "Haberleri Güncelle"}
        </button>
      </div>

      {/* High Density Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3 w-20">Skor</th>
                <th className="py-2 px-3 w-28">Kaynak</th>
                <th className="py-2 px-3">Haber Başlığı</th>
                <th className="py-2 px-3 w-24">Tarih</th>
                <th className="py-2 px-3 w-28 text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trends.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Kayıtlı haber bulunmuyor. Lütfen güncelleyin.
                  </td>
                </tr>
              ) : (
                trends.map((trend) => {
                  const isExpanded = !!expandedIds[trend.id];
                  const hasUserOverride = trend.userScore !== null;
                  const displayScore = hasUserOverride ? trend.userScore : trend.aiScore;

                  // Score badge styling
                  let scoreBadge = "bg-gray-100 text-gray-700";
                  if (displayScore === 0) {
                    scoreBadge = "bg-blue-50 text-blue-700 border border-blue-100 font-medium";
                  } else if (displayScore && displayScore >= 80) {
                    scoreBadge = "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold";
                  } else if (displayScore && displayScore >= 50) {
                    scoreBadge = "bg-amber-50 text-amber-700 border border-amber-200";
                  } else {
                    scoreBadge = "bg-rose-50 text-rose-700 border border-rose-200";
                  }

                  // Row status styling
                  let rowClass = "hover:bg-slate-50/50 transition-colors";
                  if (trend.status === "REJECTED") {
                    rowClass = "bg-slate-50/40 opacity-50 hover:opacity-100 hover:bg-slate-50 transition-all";
                  } else if (trend.status === "APPROVED") {
                    rowClass = "bg-emerald-50/10 hover:bg-emerald-50/20 transition-all border-l-2 border-l-emerald-500";
                  }

                  return (
                    <tr key={trend.id} className={rowClass}>
                      {/* Score Column */}
                      <td className="py-2 px-3 font-mono font-bold align-middle">
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${scoreBadge}`}>
                          {displayScore === 0 ? "Sırada" : displayScore}
                          {hasUserOverride && (
                            <span title="Kurucu Puanı">
                              <Star className="w-2.5 h-2.5 fill-blue-600 text-blue-600 ml-0.5" />
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-2 px-3 text-slate-500 font-medium truncate align-middle max-w-[120px]">
                        {trend.source.name}
                      </td>

                      {/* Title & Details */}
                      <td className="py-2 px-3 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => toggleExpand(trend.id)}
                              className={`font-bold hover:text-blue-600 text-left transition-colors flex items-center gap-1 ${
                                trend.status === "REJECTED" ? "text-slate-500 line-through" : "text-slate-800"
                              }`}
                            >
                              {trend.title}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                            </button>
                            <a
                              href={trend.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-blue-600 inline-block"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {trend.status === "APPROVED" && (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 rounded-full uppercase tracking-wider scale-90">
                                Sinyal
                              </span>
                            )}
                          </div>

                          {/* Collapsible Panel */}
                          {isExpanded && (
                            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-[11px] leading-relaxed text-slate-600 shadow-inner">
                              {trend.aiScore === 0 ? (
                                <div className="space-y-2 py-1">
                                  <p className="text-slate-500 italic">
                                    Bu gelişme henüz yapay zeka tarafından analiz edilmedi. Aşağıdaki butondan kaynakça araştırmasını hemen başlatabilirsiniz.
                                  </p>
                                  <button
                                    onClick={() => handleAnalyzeSingle(trend.id)}
                                    disabled={isAnalyzing}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 rounded font-semibold text-[10px] transition-colors"
                                  >
                                    <BrainCircuit className="w-3 h-3 animate-pulse" />
                                    Şimdi AI ile Analiz Et
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {trend.aiSummary && (
                                    <div>
                                      <strong className="text-slate-700 block text-[10px] uppercase tracking-wider font-semibold">AI Teknik Özeti:</strong>
                                      <p className="mt-0.5">{trend.aiSummary}</p>
                                    </div>
                                  )}
                                  {trend.aiFeasibility && (
                                    <div className="border-t border-slate-200/60 pt-2 prose prose-slate max-w-none text-[11px]">
                                      <strong className="text-slate-700 block text-[10px] uppercase tracking-wider font-semibold">Uygulanabilirlik & Literatür Araştırması:</strong>
                                      <div className="mt-1 whitespace-pre-line text-slate-600 leading-normal">
                                        {trend.aiFeasibility}
                                      </div>
                                    </div>
                                  )}

                                  {/* Human-in-the-Loop Feedback Form */}
                                  <FeedbackForm trend={trend} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2 px-3 text-slate-400 align-middle whitespace-nowrap">
                        {trend.publishedAt && (
                          <span>
                            {formatDistanceToNow(new Date(trend.publishedAt), { locale: tr })}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2 px-3 text-right align-middle whitespace-nowrap">
                        {trend.isImported ? (
                          <span className="inline-flex items-center gap-0.5 text-slate-400 font-semibold pr-2 select-none">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            İthal Edildi
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImport(trend.id)}
                            disabled={isImporting || trend.aiScore === 0 || trend.status === "REJECTED"}
                            title={
                              trend.status === "REJECTED" ? "Reddedilen haberler ithal edilemez" :
                              trend.aiScore === 0 ? "Önce AI analizi yapmalısınız" : "Fikirlere ithal et"
                            }
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-40 disabled:hover:bg-blue-50 disabled:hover:text-blue-600 border border-blue-200 font-bold px-2 py-1 rounded transition-colors text-[10px]"
                          >
                            <Import className="w-3 h-3" />
                            İthal Et
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Subcomponent to handle the founder feedback loop fields
 */
function FeedbackForm({ trend }: { trend: TrendItem }) {
  const [score, setScore] = useState<number | "">(trend.userScore ?? trend.aiScore ?? 0);
  const [notes, setNotes] = useState<string>(trend.userNotes ?? "");
  const [status, setStatus] = useState<string>(trend.status);
  const [isPending, startTransition] = useTransition();

  const handleSave = (newStatus: string) => {
    startTransition(async () => {
      const parsedScore = score === "" ? null : Number(score);
      const res = await updateTrendFeedback(trend.id, parsedScore, notes, newStatus);
      if (res.success) {
        setStatus(newStatus);
        toast.success(`Geri bildirim başarıyla kaydedildi!`);
        // We delay reload slightly to allow the toast to show and the state to update
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(`Düzeltme kaydedilemedi: ${res.error}`);
      }
    });
  };

  return (
    <div className="mt-3 p-3 bg-slate-100/80 border border-slate-200 rounded-md space-y-2 text-[10px]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
          Kurucu Kararı & Geri Besleme (Human-in-the-Loop)
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
          status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-100" :
          "bg-slate-50 text-slate-600 border-slate-200"
        }`}>
          {status === "APPROVED" ? "SİNYAL (ONAYLANDI)" : status === "REJECTED" ? "GÜRÜLTÜ (REDDEDİLDİ)" : "KARAR BEKLİYOR"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        <div className="space-y-0.5 md:col-span-1">
          <label className="font-semibold text-slate-500 block">Kurucu Puanı (1-100)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-2 py-0.5 border border-slate-300 rounded font-mono font-bold text-xs"
            placeholder="AI skorunu ez"
          />
        </div>
        <div className="space-y-0.5 md:col-span-3">
          <label className="font-semibold text-slate-500 block">Vizyon / Ar-Ge Revizyon Notu</label>
          <textarea
            rows={1}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-2 py-0.5 border border-slate-300 rounded text-[11px] leading-tight"
            placeholder="Gelecek AI modeli eğitimi için teknik vizyon düzeltmelerinizi ekleyin..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1.5 border-t border-slate-200/60">
        <button
          onClick={() => handleSave("PENDING")}
          disabled={isPending}
          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 border border-slate-300 rounded font-semibold text-[9px] transition-colors"
        >
          Sadece Notu Kaydet
        </button>
        <button
          onClick={() => handleSave("REJECTED")}
          disabled={isPending}
          className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white rounded font-semibold text-[9px] transition-colors"
        >
          Gürültü Olarak Reddet
        </button>
        <button
          onClick={() => handleSave("APPROVED")}
          disabled={isPending}
          className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded font-semibold text-[9px] transition-colors"
        >
          Sinyal Olarak Onayla
        </button>
      </div>
    </div>
  );
}
