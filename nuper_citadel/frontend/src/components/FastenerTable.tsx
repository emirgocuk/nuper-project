import React from 'react';
import { Wrench, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface FastenerRecommendation {
  hole_index: number;
  hole_id: string;
  hole_diameter_mm: number;
  center_pos_mm: { x: number; y: number; z: number };
  thread_size: string;
  standard_spec: string;
  recommended_grade: string;
  pitch_mm: number;
  stress_area_mm2: number;
  proof_strength_mpa: number;
  recommended_torque_nm: number;
  preload_force_kn: number;
  washer_recommendation: string;
  vibration_risk_assessment: string;
}

interface FastenerAnalysisData {
  total_holes_count: number;
  pattern_summary: Record<string, number>;
  chassis_mass_kg: number;
  overturning_moment_arm_mm: number;
  total_clamping_force_kn: number;
  selected_grade: string;
  fasteners: FastenerRecommendation[];
  directives: string[];
}

interface FastenerTableProps {
  data?: FastenerAnalysisData | null;
  onGradeChange?: (grade: string) => void;
}

export const FastenerTable: React.FC<FastenerTableProps> = ({ data }) => {
  if (!data || !data.fasteners || data.fasteners.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Henüz montaj deliği veya cıvata verisi bulunmuyor.</p>
        <p className="text-xs text-slate-400 mt-1">Geometri yüklendiğinde OpenCASCADE delik çaplarını ve önerilen ISO/DIN cıvatalarını buraya çıkaracaktır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Montaj Delik Sayısı</div>
          <div className="text-2xl font-black text-slate-900">{data.total_holes_count} Nokta</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Object.entries(data.pattern_summary).map(([k, v]) => `${v}x ${k}`).join(', ')}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Toplam Baskı Ön Yükü</div>
          <div className="text-2xl font-black text-blue-600">{data.total_clamping_force_kn} kN</div>
          <div className="text-[11px] text-slate-500 mt-1">Elastik sınırın %75'i</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Önerilen Cıvata Sınıfı</div>
          <div className="text-2xl font-black text-emerald-600">Sınıf {data.selected_grade}</div>
          <div className="text-[11px] text-slate-500 mt-1">DIN 912 / ISO 4762</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kilitleme Yöntemi</div>
          <div className="text-lg font-bold text-amber-600 mt-1">Nord-Lock Kamalı</div>
          <div className="text-[11px] text-slate-500 mt-1">MIL-STD-810H dinamik emniyet</div>
        </div>
      </div>

      {/* Detailed Fastener Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Otomatik Bağlayıcı & Tork Tanımlama Tablosu</h3>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full border border-blue-200">
            DIN 912 / ISO 273 Uyumlu
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Delik ID</th>
                <th className="px-4 py-3">Delik Çapı</th>
                <th className="px-4 py-3">Koordinat (X, Y, Z mm)</th>
                <th className="px-4 py-3">Önerilen Cıvata</th>
                <th className="px-4 py-3 text-right">Ön Yük (Fi)</th>
                <th className="px-4 py-3 text-right">Sıkma Torku</th>
                <th className="px-4 py-3">Emniyet Rondelası</th>
                <th className="px-4 py-3">Titreşim Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.fasteners.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{f.hole_id}</td>
                  <td className="px-4 py-3.5 font-mono">Ø{f.hole_diameter_mm} mm</td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">
                    [{f.center_pos_mm.x}, {f.center_pos_mm.y}, {f.center_pos_mm.z}]
                  </td>
                  <td className="px-4 py-3.5 font-medium text-blue-700">
                    {f.standard_spec}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-right font-semibold text-slate-900">
                    {f.preload_force_kn} kN
                  </td>
                  <td className="px-4 py-3.5 font-mono text-right font-black text-emerald-700">
                    {f.recommended_torque_nm} N·m
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                    {f.washer_recommendation}
                  </td>
                  <td className="px-4 py-3.5">
                    {f.vibration_risk_assessment.includes('YÜKSEK') ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5" /> Kilitli Rondela Şart
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Emniyetli
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Directives Banner */}
        <div className="bg-slate-50 p-4 border-t border-slate-200">
          <div className="flex items-start gap-2 text-xs text-slate-700">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900">Askeri Montaj Direktifleri:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                {data.directives.map((dir, i) => (
                  <li key={i}>{dir}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
