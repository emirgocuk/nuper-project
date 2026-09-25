export type ToolStatus = 'OPERATIONAL' | 'ALPHA';
export type ToolTier = 'MÜHENDİSLİK LİSANSI' | 'KAPALI DEVRE (AIR-GAPPED)' | 'KURUMSAL SAVUNMA';
export type ToolCategory = 'TÜMÜ' | 'SAVUNMA' | 'İMALAT' | 'SİMÜLASYON' | 'HABERLEŞME' | 'OTONOM';

export interface ProgramTheme {
  primaryColor: 'amber' | 'sky' | 'emerald' | 'crimson';
  accentHex: string;
  accentGlow: string;
  borderHex: string;
  patternType: 'cad-blueprint' | 'mesh-grid' | 'circuit' | 'radar';
  badgeLabel: string;
}

export interface ArsenalTool {
  id: string;
  slug: string;
  toolCode: string;
  brandName: string;
  tagline: string;
  title: string;
  category: 'SAVUNMA' | 'İMALAT' | 'SİMÜLASYON' | 'HABERLEŞME' | 'OTONOM';
  status: ToolStatus;
  tier: ToolTier;
  summary: string;
  description: string;
  capabilities: string[];
  targetAudience: string;
  theme: ProgramTheme;
  marketValue: {
    roiImpact: string;
    deploymentTime: string;
    compliance: string;
  };
  demoConfig?: {
    actionLabel: string;
    parameters: Array<{
      name: string;
      label: string;
      type: 'select' | 'text' | 'number';
      options?: string[];
      defaultValue: string;
    }>;
    sampleOutput: string;
  };
}

export const INITIAL_ARSENAL_TOOLS: ArsenalTool[] = [
  {
    id: 'nuper-citadel',
    slug: 'nuper-citadel',
    toolCode: 'CITADEL-01 // KALİFİKASYON VE PRE-FEA MOTORU',
    brandName: 'NUPER CITADEL',
    tagline: 'Sovereign Defense Qualification & Pre-FEA Simulation Engine',
    title: 'NUPER CITADEL: Sovereign Defense Qualification & Pre-FEA Simulation Engine',
    category: 'SAVUNMA',
    status: 'OPERATIONAL',
    tier: 'KAPALI DEVRE (AIR-GAPPED)',
    summary: 'Savunma ve aviyonik alt sistemlerin 3D STEP katı modellerini MIL-STD-810H çevre koşulları normlarına göre saniyeler içinde doğrulayan, ANSYS/NX için 120 noktalı PSD spektrumu ve APDL sınır koşullarını türeten, FEA sonrası rezonans çentikleme hesaplarını tamamlayıp resmi A4 PDF ETP test planını üreten %100 yerel mühendislik motoru.',
    description: 'Mekanik ve aviyonik savunma bileşenlerinin CAD masasından akredite test merkezine (TÜBİTAK SAGE, TRTEST) uzanan haftalarca süren standart tarama, FEA yük matrisi hazırlama ve test kabul dokümantasyon sürecini otomatikleştirir. OpenCASCADE B-Rep çekirdeği ile geometriyi ve DIN 912 bağlantı elemanlarını yerel iş istasyonunda ayrıştırır; hiçbir CAD verisini veya telemetriyi dış ağa aktarmaz.',
    targetAudience: 'Savunma Sanayii Ana Yüklenicileri, Aviyonik & Yapısal Tasarım Ekipleri, Test Mühendisleri',
    theme: {
      primaryColor: 'amber',
      accentHex: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.16)',
      borderHex: 'rgba(245, 158, 11, 0.45)',
      patternType: 'cad-blueprint',
      badgeLabel: 'MIL-STD-810H // AS9100 SAVUNMA STANDARDI'
    },
    marketValue: {
      roiImpact: 'Test hazırlık süresini 3 haftadan 12 saniyeye indirir',
      deploymentTime: 'Yerel İş İstasyonuna Anında Kurulum (Tauri / Taşınabilir)',
      compliance: 'MIL-STD-810H (Metot 514, 516, 501/502) & DIN 912 / ISO 273'
    },
    capabilities: [
      'OpenCASCADE B-Rep Geometri ve DIN 912 Cıvata Ön Yük Çözücüsü',
      '120 Noktalı Titreşim PSD Spektrum Tablosu ve ANSYS APDL Dışa Aktarımı',
      'Post-FEA Kapalı Döngü Rezonans Kaçınma ve Çentikleme (Notching) Hesabı',
      'ReportLab Vektörel Motoruyla Resmi Antetli Askeri A4 PDF ETP Raporu',
      'Tamamen Yerel / Air-Gapped Güvenlik (127.0.0.1, Sıfır Dış Ağ Bağımlılığı)',
      'Çok Gövdeli STEP Montaj, Kompozit Katman (CLT) ve Termal/Şok Analizi'
    ],
    demoConfig: {
      actionLabel: 'MIL-STD-810H Kalifikasyon Simülasyonu Başlat',
      parameters: [
        {
          name: 'platform',
          label: 'Askeri Görev Profili',
          type: 'select',
          options: [
            'F-16 Kanat Altı Pod Titreşimi (Metot 514.8 Kategori 14)',
            'Paletli Zırhlı Kara Aracı (Metot 514.8 Kategori 20)',
            'Fonksiyonel Şok 40g 11ms (Metot 516.8 Prosedür I)'
          ],
          defaultValue: 'F-16 Kanat Altı Pod Titreşimi (Metot 514.8 Kategori 14)'
        },
        {
          name: 'material',
          label: 'Alaşım / Malzeme',
          type: 'select',
          options: ['Alüminyum 6061-T6', 'Titanyum Ti-6Al-4V', 'Paslanmaz Çelik 17-4 PH'],
          defaultValue: 'Alüminyum 6061-T6'
        }
      ],
      sampleOutput: 'Geometri Analizi Tamamlandı: Kütle: 0.385 kg, CoG: (5.2, 0.0, 22.5) mm. 4x M4 cıvata tespit edildi. MIL-STD-810H Kategori 14 spektrumu türetildi: f1 > 2400 Hz rezonans kaçınma eşiği sağlandı. 120 noktalı PSD tablosu ve ANSYS APDL sınır koşulları hazırlandı.'
    }
  }
];

export function getArsenalToolBySlug(slug: string): ArsenalTool | undefined {
  return INITIAL_ARSENAL_TOOLS.find((t) => t.slug === slug);
}
