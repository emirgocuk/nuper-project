"use client";

import { useState, useTransition } from "react";
import { approveDiscovery, ignoreDiscovery } from "../actions";
import { toast } from "sonner";
import { Check, X, Compass, Link2, User, Globe, Building2, Landmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface DiscoveryItem {
  id: string;
  name: string;
  type: string;
  url: string | null;
  reason: string;
  createdAt: Date;
}

export default function DiscoveriesClient({ initialDiscoveries }: { initialDiscoveries: DiscoveryItem[] }) {
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>(initialDiscoveries);
  const [isProcessing, startProcessing] = useTransition();

  const handleApprove = (id: string) => {
    const toastId = toast.loading("Kaynak onaylanıyor ve kaydediliyor...");
    startProcessing(async () => {
      const result = await approveDiscovery(id);
      if (result.success) {
        toast.success("Kaynak başarıyla onaylandı ve takip listesine kaydedildi!", { id: toastId });
        setDiscoveries(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error(`Onaylama hatası: ${result.error}`, { id: toastId });
      }
    });
  };

  const handleIgnore = (id: string) => {
    const toastId = toast.loading("Keşif yoksayılıyor...");
    startProcessing(async () => {
      const result = await ignoreDiscovery(id);
      if (result.success) {
        toast.success("Keşif yoksayıldı ve kaldırıldı.", { id: toastId });
        setDiscoveries(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error(`İşlem hatası: ${result.error}`, { id: toastId });
      }
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h1 className="text-base font-bold text-slate-800">Keşif & Akış Dedektörü</h1>
            <p className="text-[10px] text-slate-500 font-medium">
              AI tarafından haberlerde saptanan ve otomatik takibe alınabilecek potansiyel kişi, kurum ve kaynak havuzu.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3 w-40">Varlık Adı</th>
                <th className="py-2 px-3 w-28">Tür</th>
                <th className="py-2 px-3">Tespit Gerekçesi & Kaynağı</th>
                <th className="py-2 px-3 w-40">Bağlantı</th>
                <th className="py-2 px-3 w-32 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discoveries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Onay bekleyen yeni keşif bulunmuyor. Haberler analiz edildikçe burası dolacaktır.
                  </td>
                </tr>
              ) : (
                discoveries.map((item) => {
                  // Determine Icon & Color per Type
                  let TypeIcon = Globe;
                  let typeBadge = "bg-blue-50 text-blue-700 border-blue-100";
                  if (item.type === "PERSON") {
                    TypeIcon = User;
                    typeBadge = "bg-purple-50 text-purple-700 border-purple-100";
                  } else if (item.type === "ORGANIZATION") {
                    TypeIcon = Building2;
                    typeBadge = "bg-indigo-50 text-indigo-700 border-indigo-100";
                  } else if (item.type === "STATE") {
                    TypeIcon = Landmark;
                    typeBadge = "bg-rose-50 text-rose-700 border-rose-100";
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="py-2.5 px-3 font-bold text-slate-800 align-middle">
                        {item.name}
                      </td>

                      {/* Type */}
                      <td className="py-2.5 px-3 align-middle">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-semibold ${typeBadge}`}>
                          <TypeIcon className="w-3 h-3" />
                          {item.type === "PERSON" ? "Kişi" : item.type === "ORGANIZATION" ? "Kurum" : item.type === "STATE" ? "Devlet" : "Site"}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-2.5 px-3 text-slate-600 align-middle leading-relaxed">
                        {item.reason}
                      </td>

                      {/* URL */}
                      <td className="py-2.5 px-3 align-middle text-slate-500 max-w-[150px] truncate">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1.5 font-medium"
                          >
                            <Link2 className="w-3.5 h-3.5 shrink-0" />
                            İncele
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Bilinmiyor</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right align-middle whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-bold px-2 py-1 rounded transition-colors"
                            title={item.url ? "Takip listesine kaydet" : "Onayla"}
                          >
                            <Check className="w-3 h-3" />
                            Onayla
                          </button>
                          <button
                            onClick={() => handleIgnore(item.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center gap-1 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 font-bold px-2 py-1 rounded transition-colors"
                            title="Yoksay ve kaldır"
                          >
                            <X className="w-3 h-3" />
                            Yoksay
                          </button>
                        </div>
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
