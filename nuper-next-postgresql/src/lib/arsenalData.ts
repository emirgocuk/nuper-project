export type ToolStatus = 'OPERATIONAL' | 'ALPHA';
export type ToolTier = 'MÜHENDİSLİK LİSANSI' | 'KAPALI DEVRE (AIR-GAPPED)' | 'KURUMSAL SAVUNMA';
export type ToolCategory = 'TÜMÜ' | 'SAVUNMA' | 'İMALAT' | 'SİMÜLASYON' | 'HABERLEŞME' | 'OTONOM';

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
    id: 'nuper-prj-01',
    slug: 'nuper-os',
    toolCode: 'PROJECT-01 // SAVUNMA ÇEKİRDEĞİ',
    brandName: 'NUPER-OS',
    tagline: 'Sovereign Defense & Sensor Kernel',
    title: 'NUPER-OS: Sovereign Defense & Sensor Kernel',
    category: 'SAVUNMA',
    status: 'OPERATIONAL',
    tier: 'KAPALI DEVRE (AIR-GAPPED)',
    summary: 'Fiziksel dünya sensörleri ve otonom karar destek mekanizmaları için dış bağımlılığı sıfıra indirilmiş, yerel ve deterministik savunma işletim çekirdeği.',
    description: 'Hava savunma radarları, elektro-optik tareti ve insansız kara/hava araçları için tasarlanan mikro-çekirdek mimarisi. Sıfır dış bulut bağımlılığı ve mikro-saniye seviyesinde deterministik görev zamanlaması sunar.',
    targetAudience: 'Savunma Sanayii Yüklenicileri, Aviyonik & Gömülü Sistem Ekipleri',
    marketValue: {
      roiImpact: 'Sistem entegrasyon maliyetlerinde %60 düşüş',
      deploymentTime: '48 Saatte Donanıma Kurulum',
      compliance: 'MIL-STD-810H & DO-178C Uyumlu'
    },
    capabilities: [
      'Mikrosaniye Seviyesinde Deterministik RTOS Katmanı',
      'Air-Gapped %100 Yerel Veri İzolasyonu',
      'Sensör Füzyonu & Otonom Tehdit Sınıflandırma',
      'Asimetrik Siber Taarruzlara Karşı Kriptografik Zırh'
    ],
    demoConfig: {
      actionLabel: 'Sistem Çekirdeğini Simüle Et',
      parameters: [
        {
          name: 'mode',
          label: 'Operasyon Modu',
          type: 'select',
          options: ['Taktik Saha İzolasyonu', 'Sensör Füzyon Taraması', 'Elektronik Harp Savunması'],
          defaultValue: 'Taktik Saha İzolasyonu'
        },
        {
          name: 'latency',
          label: 'Gecikme Toleransı (Mikrosaniye)',
          type: 'number',
          defaultValue: '25'
        }
      ],
      sampleOutput: 'NUPER-OS v3.2 Çekirdeği Başlatıldı. 4 Kanal Sensör Beslemesi Senkronize Edildi. Donanım telemetri gecikmesi: 18.4µs (MIL-STD toleransı altında). Sistem stabil.'
    }
  },
  {
    id: 'nuper-prj-02',
    slug: 'ares-rag',
    toolCode: 'PROJECT-02 // DÖKÜMANTASYON & STANDART',
    brandName: 'ARES-RAG',
    tagline: 'Askeri Şartname & Standart Analiz Motoru',
    title: 'ARES-RAG: Askeri Şartname & Standart Analiz Motoru',
    category: 'SAVUNMA',
    status: 'OPERATIONAL',
    tier: 'MÜHENDİSLİK LİSANSI',
    summary: 'Binlerce sayfalık MIL-STD, NATO STANAG ve SSB şartnamelerini deterministik kurallarla tarayan, test uyumluluk matrisini saniyeler içinde çıkaran yapay zeka analiz motoru.',
    description: 'Savunma mühendislerinin haftalarca süren manuel şartname okuma ve ihale uyumluluk kontrollerini otomatikleştirir. Doğrulanmış askeri standart veri tabanı ile kurallı çıkarım yapar; genel yapay zekaların halüsinasyon riskini sıfırlar.',
    targetAudience: 'Teklif & İhale Mühendisleri, Kalite Güvence & Sistem Mühendisliği',
    marketValue: {
      roiImpact: 'Teklif hazırlama süresinde 3 haftalık kazanç',
      deploymentTime: 'Anında Web & Lokal Sunucu Entegrasyonu',
      compliance: 'NATO STANAG & Savunma Sanayii Başkanlığı Kriterleri'
    },
    capabilities: [
      'MIL-STD-810, 461 ve STANAG Otomatik Çapraz Doğrulama',
      'İhale Şartnamesi Açık / Risk Haritası Çıkarımı',
      'AS9100 Kalite Denetim Matrisi Hazırlama',
      'Air-Gapped Yerel Sunucularda Gizli Belge Analizi'
    ],
    demoConfig: {
      actionLabel: 'Şartname Uyumluluk Taraması Başlat',
      parameters: [
        {
          name: 'standard',
          label: 'Hedef Standart Kütüphanesi',
          type: 'select',
          options: ['MIL-STD-810H (Çevresel Testler)', 'MIL-STD-461G (EMC / EMI)', 'NATO STANAG 4586 (İHA Kontrol)'],
          defaultValue: 'MIL-STD-810H (Çevresel Testler)'
        },
        {
          name: 'docType',
          label: 'Belge Türü',
          type: 'select',
          options: ['Teknik Şartname Taslağı', 'Kabul Test Prosedürü', 'Tedarikçi Doğrulama Raporu'],
          defaultValue: 'Teknik Şartname Taslağı'
        }
      ],
      sampleOutput: 'Tarama Tamamlandı: 842 sayfa incelendi. 14 kritik test maddesi tespit edildi. 2 uyumsuzluk noktası (Madde 4.2.1 Sıcaklık Şoku & Madde 7.1 Titreşim) işaretlendi. Rapor PDF olarak hazır.'
    }
  },
  {
    id: 'nuper-prj-03',
    slug: 'chronos-dfm',
    toolCode: 'PROJECT-03 // HASSAS İMALAT',
    brandName: 'CHRONOS-DFM',
    tagline: 'Talaşlı İmalat & CAD Maliyet-Tolerans Optimizasyonu',
    title: 'CHRONOS-DFM: Talaşlı İmalat & CAD Maliyet-Tolerans Optimizasyonu',
    category: 'İMALAT',
    status: 'OPERATIONAL',
    tier: 'MÜHENDİSLİK LİSANSI',
    summary: 'Hassas CNC işleme, malzeme yorulması ve parça geometrisi için tezgah saati, takım aşınması ve üretilebilirlik hesaplayıcı.',
    description: 'Tasarım aşamasındaki parçaların imalat tezgahına girmeden önce tolerans ve işleme maliyetlerinin doğrulanması için geliştirilmiş akıllı üretim motoru. Üretilemeyecek kadar dar toleransların sebep olduğu fahiş hurda oranlarını sıfıra indirir.',
    targetAudience: 'Talaşlı İmalat KOBİ\'leri, Makine & Havacılık Parça İmalatçıları',
    marketValue: {
      roiImpact: 'Hurda oranında %42, tezgah duruşlarında %35 tasarruf',
      deploymentTime: '1 Günlük Entegrasyon',
      compliance: 'AS9100 Rev D & ISO 9001'
    },
    capabilities: [
      'STEP/IGES CAD Dosyalarından Anlık Geometrik DFM Analizi',
      'Tezgah Saati & Kesici Takım Maliyeti Hesaplama',
      'Hassas Titanyum & Havacılık Alüminyum İşleme Katsayıları',
      'Optimum Radyus & Açılı Yüzey Önerileri'
    ],
    demoConfig: {
      actionLabel: 'DFM İmalat Analizini Başlat',
      parameters: [
        {
          name: 'material',
          label: 'Hammadde / Alaşım',
          type: 'select',
          options: ['Titanyum Ti-6Al-4V', 'Alüminyum 7075-T6', 'Paslanmaz Çelik 17-4 PH'],
          defaultValue: 'Titanyum Ti-6Al-4V'
        },
        {
          name: 'tolerance',
          label: 'Kritik Tolerans Sınıfı',
          type: 'select',
          options: ['±0.005 mm (Ultra Hassas Havacılık)', '±0.02 mm (Standart Askeri)', '±0.1 mm (Genel Sanayi)'],
          defaultValue: '±0.005 mm (Ultra Hassas Havacılık)'
        }
      ],
      sampleOutput: 'DFM Analizi Tamamlandı: Titanyum Ti-6Al-4V parça için hesaplanan tezgah süresi 32 dakika. 2 adet keskin iç köşe tespit edildi (R=0.5mm ➔ R=1.5mm önerildi). Öneri uygulanırsa takım ömrü %38 uzar, parça başı maliyet %24 düşer.'
    }
  },
  {
    id: 'nuper-prj-04',
    slug: 'hyperion',
    toolCode: 'PROJECT-04 // GÜVENLİ HABERLEŞME',
    brandName: 'HYPERION',
    tagline: 'Kuantum Dayanıklı Eşler Arası Taktik Ağ',
    title: 'HYPERION: Kuantum Dayanıklı Eşler Arası Taktik Ağ',
    category: 'HABERLEŞME',
    status: 'OPERATIONAL',
    tier: 'KURUMSAL SAVUNMA',
    summary: 'Merkezi sunucuya ihtiyaç duymadan, GNSS karıştırma ve elektronik harp altında uçtan uca asimetrik şifreleme sunan kapalı devre taktik haberleşme protokolü.',
    description: 'İnsansız araçlar, mobil komuta merkezleri ve saha unsurları arasında internet altyapısı çöktüğünde bile kesintisiz veri aktarımı sağlayan mesh şebeke protokolü. Kuantum sonrası kriptografik algoritmalarla korunur.',
    targetAudience: 'Elektronik Harp Ekipleri, Taktik Saha Haberleşme Birlikleri',
    marketValue: {
      roiImpact: 'Sıfır uydu/sunucu bant genişliği maliyeti',
      deploymentTime: 'Taşınabilir Radyo & Yerel Donanıma Hazır',
      compliance: 'Kuantum Dayanıklı (Post-Quantum Cryptography) Standartları'
    },
    capabilities: [
      'P2P Dağıtık Mesh Ağ Kurulumu (Merkezi Sunucusuz)',
      'GNSS Jamming Altında Bağımsız Frekans Atlama',
      'Kyber-1024 Kuantum Dayanıklı Şifreleme Katmanı',
      'Sıfır Veri İzi ve Tersine Mühendislik Koruması'
    ],
    demoConfig: {
      actionLabel: 'Şifreli Taktik Kanalı Aç',
      parameters: [
        {
          name: 'nodes',
          label: 'Aktif Saha Düğümü Sayısı',
          type: 'select',
          options: ['8 Düğüm (İHA Filosu)', '32 Düğüm (Taktik Tabur)', '128 Düğüm (Bölgesel Mesh)'],
          defaultValue: '8 Düğüm (İHA Filosu)'
        },
        {
          name: 'encryption',
          label: 'Kripto Algoritması',
          type: 'select',
          options: ['Post-Quantum Kyber-1024', 'ChaCha20-Poly1305 Taktik Zırh', 'AES-256-GCM Air-Gapped'],
          defaultValue: 'Post-Quantum Kyber-1024'
        }
      ],
      sampleOutput: 'Mesh Ağı Kuruldu. 8 Düğüm el sıkıştı. Kuantum anahtar değişimi 12ms içinde tamamlandı. Elektronik harp simülasyonunda frekans atlama devrede. Veri kaybı: %0.00.'
    }
  }
];

export function getArsenalToolBySlug(slug: string): ArsenalTool | undefined {
  return INITIAL_ARSENAL_TOOLS.find((t) => t.slug === slug);
}
