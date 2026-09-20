import React from 'react';
import { FileText, CheckCircle, Sparkles, Layers } from 'lucide-react';

interface DrawingData {
  file_name: string;
  file_type: string;
  page_count: number;
  detected_drawing_no: string;
  part_name?: string;
  detected_material: string;
  standard_material_match?: string;
  detected_standard: string;
  detected_finish: string;
  heat_treatment?: string;
  extracted_notes: string[];
  full_text_sample: string;
  ai_extracted?: boolean;
}

interface DrawingViewerProps {
  drawing: DrawingData | null;
  fileUrl?: string | null;
}

export const DrawingViewer: React.FC<DrawingViewerProps> = ({ drawing, fileUrl }) => {
  if (!drawing) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Henüz teknik resim yüklenmedi.</p>
        <p className="text-xs text-slate-400 mt-1">
          Adım 1'de parçaya ait 2D Teknik Resmi (.PDF / .PNG / .JPG) yükleyerek tolerans ve başlık bloğu verilerini buraya aktarabilirsiniz.
        </p>
      </div>
    );
  }

  const isImage = drawing.file_type === 'IMAGE_DRAWING' || drawing.file_name.match(/\.(png|jpg|jpeg)$/i);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">Teknik Resim & Başlık Bloğu (Title Block)</h3>
        </div>
        <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
          {drawing.file_name} ({drawing.page_count} Sayfa)
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Preview or Document Info */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[280px]">
            {isImage && fileUrl ? (
              <img
                src={fileUrl}
                alt="Teknik Resim Önizleme"
                className="max-h-[300px] w-auto object-contain rounded border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{drawing.file_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{drawing.file_type} Dokümanı</div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Metin & Başlık Katmanı Ayrıştırıldı
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Resim / Parça No:</span>
              <span className="font-mono font-bold text-slate-900">{drawing.detected_drawing_no}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Genel Tolerans Standardı:</span>
              <span className="font-mono font-bold text-slate-900">{drawing.detected_standard}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Engineering Notes & Metadata */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-slate-600">
              <Layers className="w-4 h-4 text-blue-600" />
              Çıkarılan Malzeme & Yüzey Spesifikasyonu
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Belirtilen Malzeme:</span>
                <span className="font-bold text-slate-900">{drawing.detected_material}</span>
              </div>
              {drawing.standard_material_match && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Sistem Malzeme Eşleşmesi:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{drawing.standard_material_match}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Yüzey İşlemi / Kaplama:</span>
                <span className="font-semibold text-slate-800">{drawing.detected_finish}</span>
              </div>
              {drawing.heat_treatment && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Isıl İşlem Durumu:</span>
                  <span className="font-semibold text-slate-800">{drawing.heat_treatment}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">GD&T Kural Çerçevesi:</span>
                <span className="font-mono font-semibold text-blue-700">{drawing.detected_standard || 'ASME Y14.5-2018'}</span>
              </div>
            </div>
          </div>

          {/* Engineering Notes list */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Teknik Resimden Çıkarılan Kritik Mühendislik Notları
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {drawing.extracted_notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
