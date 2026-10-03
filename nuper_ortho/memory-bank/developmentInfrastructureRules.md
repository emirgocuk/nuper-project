# Nuper Ortho — Geliştirme Altyapısı ve Darboğaz Önleme Kuralları (Development Infrastructure & Bottleneck Prevention Rules)

> **Mühendislik İlkesi:** *Hızlı, güvenli ve sürdürülebilir geliştirme; monolitik kodlardan arınmış, modüler, tip-güvenli, tek tuşla test edilebilir, bellek sızıntısız ve izole edilmiş geliştirme altyapısıyla mümkündür.*

---

## 1. Amaç ve Kapsam

Bu kural dokümanı, Nuper Ortho sisteminin **(Rust Çekirdeği + Python C-bindings/OpenCV/PyMuPDF + Electron/Three.js + Ağır CAD/PDF Veri Akışı)** hibrit doğasını kurumsal seviyede sarsılmaz kılmak, geliştirme süreçlerinde yaşanan **üretkenlik ve bakım darboğazlarını kalıcı olarak ortadan kaldırmak**, hata payını sıfırlamak ve geliştirme hızını en az 5–10 kat artıracak **modern geliştirme altyapısının kurulumunu, mimarisini, somut kod kalıplarını ve uyulması zorunlu kurallarını** tanımlar.

Tüm insan geliştiriciler ve AI ajanları (Cursor, Claude, Copilot, Antigravity vb.) bu kurallara istisnasız uymakla yükümlüdür.

---

## 2. Mevcut Geliştirme Süreci Darboğazları ve Kök Neden Analizi

| No | Darboğaz | Kök Neden | Yarattığı Risk & Zaman Kaybı |
|---|---|---|---|
| **D-1** | **Monolitik `ui/index.html` (>420 KB)** | Tüm HTML, CSS, Three.js sahneleri, Earclip üçgenleme, Jacobi PCA, SVG balonlama ve modal mantıklarının tek dosyada olması. | Kod bulma/düzenleme zorluğu, değişken çakışmaları, sözdizimi hataları (unclosed tag vb.), yüksek LLM token maliyeti, sürümleme çatışmaları. |
| **D-2** | **Ad-hoc `scratch/` Kirliliği (100+ Dosya)** | Hata ayıklama veya özellik denemeleri için geçici `scratch/test_*.js` ve `scratch/apply_*.py` yazılması ve bunların kalıcı testlere dönüşmemesi. | Yapılan düzeltmelerin regresyon testine bağlanamaması, kod tabanında dağınıklık, "kod çalışıyor mu" kontrolünün manuel kalması. |
| **D-3** | **Çoklu Çalışma Zamanı Uyumsuzluğu & Şema Sapması (Schema Drift)** | Rust, Electron/Node.js ve Python arasında ortak tip/şema olmadan ham JSON ile haberleşilmesi; elle tip yazılması. | Python çıktısı veya Rust CLI çıktısı değiştiğinde UI'ın sessizce bozulması, hatanın ancak canlı kullanımda fark edilmesi. |
| **D-4** | **Tek Tuşla Doğrulama (Task Runner) & Hook Eksikliği** | Rust (`cargo test`), Python (`pytest`) ve Arayüzün tek bir komutla test ve kontrol edilememesi; Git commit aşamasında kural denetlenmemesi. | Geliştiricinin/Ajanın testleri atlaması, entegrasyon hatalarının geç fark edilmesi, hatalı veya monolite kod ekleyen commit'lerin git geçmişine girmesi. |
| **D-5** | **Ağır Dosya Bağımlılığı ve İzole Ortam Eksikliği** | UI üzerinde küçük bir görsel değişiklik için bile ağır STEP veya PDF dosyalarının Electron içinde yüklenmesinin gerekmesi. | Hızlı görsel iterasyon (HMR) yapılamaması, geliştirme döngüsünün dakikalar sürmesi. |
| **D-6** | **WebGL Bellek Sızıntıları (VRAM Leak) ve UI Donmaları** | Three.js nesnelerinin düzensiz dispose edilmesi; Earclip/PCA gibi ağır algoritmaların UI ana iş parçacığını kilitlemesi. | Çoklu model açma/kapamada tarayıcı/Electron sekmesinin çökmesi, 60 FPS kaybı ve arayüz takılmaları. |
| **D-7** | **Görsel Regresyon ve Sayısal Yuvarlama Sapmaları** | 2D balonların veya 3D projeksiyonun CSS/matris değişiminde kayması; float doğrudan eşitlikleri (`==`) ve koordinat ekseni karmaşası. | Tolerans ve balon eşleştirmelerinin sessizce hatalı sonuç vermesi; milimetrik görsel kaymaların gözden kaçması. |

---

## 3. Yeni Geliştirme Altyapısı Mimarisi (Target Directory Tree)

```
nuper_ortho/
├── .husky/                       # Git Hook Kalkanı (Pre-commit & Pre-push)
│   ├── pre-commit                # ui/index.html & scratch/ engelleme, typecheck
│   └── pre-push                  # npm run test:all (Bütünsel regresyon testi)
├── schemas/                      # TEK GERÇEK KAYNAK (Single Source of Truth - SSOT)
│   ├── drawing_data.schema.json  # Python -> Electron veri sözleşmesi
│   ├── cad_metadata.schema.json  # Rust -> Electron veri sözleşmesi
│   └── inspection_plan.schema.json
├── scripts/                      # Altyapı ve Otomasyon Betikleri
│   ├── codegen.mjs               # JSON Schema -> TypeScript & Pydantic üreticisi
│   └── verify_environment.py     # Rust, Python, Node bağımlılık denetleyicisi
├── ui/src/                       # Modüler UI Mimarisi (Monolitik index.html sonu)
│   ├── components/               # Bağımsız UI bileşenleri (Ribbon, Titlebar, Modals, Tree)
│   ├── modules/
│   │   ├── cad/                  # 3D Three.js Sahnesi, Tessellation, Shaders
│   │   │   └── utils/
│   │   │       └── SceneCleaner.ts # VRAM ve GPU Buffer temizleme motoru
│   │   ├── drawing/              # 2D Canvas, PDF Render, Balonlama, Cross-Highlight
│   │   │   └── adapters/
│   │   │       └── CoordinateAdapter.ts # PDF <-> Canvas sınır dönüştürücüsü
│   │   ├── inspection/           # Ölçü tablosu, Tolerans eşleme, Onay motoru
│   │   ├── core/
│   │   │   └── math/
│   │   │       └── precision.ts  # EPSILON sabitleri ve sayısal hassasiyet fonksiyonları
│   │   └── ipc/                  # Tip-güvenli Electron/Tauri IPC istemcisi
│   │       └── MockIpcProvider.ts# Hızlı tarayıcı testi için sahte IPC sağlayıcısı
│   ├── workers/                  # 16 ms Kuralı için Web Worker'lar
│   │   └── geometry.worker.ts    # Earclip üçgenleme ve Jacobi PCA worker'ı
│   ├── types/
│   │   └── generated/            # 'npm run codegen' ile ÜRETİLEN otomatik tipler
│   │       └── drawing_data.d.ts
│   ├── styles/                   # Modüler CSS ve tema token'ları
│   └── main.ts                   # Uygulama giriş noktası
├── tools/                        # Python araçları (Geliştirme & Test modunda)
│   ├── models/                   # Codegen ile şemadan üretilen Pydantic modelleri
│   │   └── generated_drawing_data.py
│   └── tests/                    # Pytest tabanlı kalıcı Python testleri
├── tests/
│   ├── visual/                   # Playwright Headless Canvas Görsel Snapshot testleri
│   │   ├── ballooning.spec.ts
│   │   └── snapshots/            # Altın referans görseller (*_golden.png)
│   └── e2e/                      # Uçtan uca entegrasyon testleri
├── AGENTS.md                     # AI Ajanı Çalışma ve Değişiklik Protokolü
└── package.json                  # Unified Task Runner & Dependencies
```

---

## 4. Detaylı Mimari Gereksinimler, Kurallar ve Somut Kod Kalıpları

### 1. Diller Arası Tip Senkronizasyonunun Otomasyonu (Single Source of Truth)

#### Problem
Python (`drawing_extractor.py`), Rust çekirdeği ve TypeScript arayüzü aynı veri üzerinde çalışır. Örneğin bir balonun koordinatı Python'da `[x, y]`, Rust'ta `(f64, f64)`, TypeScript'te `{ x: number, y: number }` veya bbox alanı `[x1, y1, x2, y2]` yerine `[x, y, w, h]` olarak ele alınırsa derleme anında hiçbir hata çıkmaz; hata sadece kullanıcı arayüzde balonu yanlış yerde gördüğünde anlaşılır.

#### Uygulama Mimarisi (JSON-Schema-First Yaklaşımı)
Tek kaynak olarak `schemas/` klasöründeki standart JSON Schema dosyaları kullanılır. Tek bir komutla (`npm run codegen`) hem TypeScript tipleri hem de Python Pydantic sınıfları üretilir.

**Örnek Şema Tanımı (`schemas/drawing_data.schema.json`):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DrawingData",
  "type": "object",
  "required": ["drawing_id", "dimensions", "scale"],
  "properties": {
    "drawing_id": { "type": "string" },
    "scale": { "type": "number", "minimum": 0 },
    "dimensions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "nominal", "tolerance", "bbox"],
        "properties": {
          "id": { "type": "string" },
          "nominal": { "type": "number" },
          "tolerance": {
            "type": "object",
            "required": ["upper", "lower"],
            "properties": {
              "upper": { "type": "number" },
              "lower": { "type": "number" }
            }
          },
          "bbox": {
            "type": "array",
            "items": { "type": "number" },
            "minItems": 4,
            "maxItems": 4
          }
        }
      }
    }
  }
}
```

**Otomasyon Script'i (`scripts/codegen.mjs`):**
```javascript
import { compileFromFile } from 'json-schema-to-typescript';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

async function generate() {
  // 1. TypeScript tiplerini üret
  const ts = await compileFromFile('schemas/drawing_data.schema.json');
  fs.writeFileSync('ui/src/types/generated/drawing_data.d.ts', ts);

  // 2. Python Pydantic modellerini üret (datamodel-code-generator ile)
  execSync('datamodel-codegen --input schemas/drawing_data.schema.json --output tools/models/generated_drawing_data.py --output-model-type pydantic_v2.BaseModel');

  console.log('✓ Tüm tip sözleşmeleri (TS & Python) başarıyla senkronize edildi.');
}
generate();
```

* **Kural Maddesi:** *“IPC veri modellerinde el ile TypeScript/Python tipi tanımlanamaz. Tipler derleme adımında `npm run codegen` ile merkezi şemadan otomatik üretilmek zorundadır.”*

---

### 2. WebGL / Three.js Bellek Sızıntısı ve Kaynak Temizleme Protokolü

#### Problem
JavaScript Garbage Collector (GC), WebGL bağlamındaki GPU tamponlarını (Vertex Buffer, Index Buffer, Texture belleği) otomatik olarak temizleyemez. Kullanıcı 10 farklı STEP modeli veya yoğun mesh yükleyip kapattığında bellek tüketimi 500 MB'tan 4 GB'a çıkar ve Electron donup çöker.

#### Uygulama Mimarisi (SceneCleaner Deseni)
Her 3D görüntüleyici bileşeni bir yaşam döngüsüne (mount / unmount) bağlanır ve yok edilme anında sahnedeki tüm alt dalları özyinelemeli (recursive) temizler.

**Temizleme Motoru (`ui/src/modules/cad/utils/SceneCleaner.ts`):**
```typescript
import * as THREE from 'three';

export class SceneCleaner {
  public static disposeNode(node: THREE.Object3D): void {
    if (!node) return;

    // Özyinelemeli olarak çocukları temizle
    while (node.children.length > 0) {
      this.disposeNode(node.children[0]);
      node.remove(node.children[0]);
    }

    if (node instanceof THREE.Mesh) {
      // 1. Geometriyi serbest bırak
      if (node.geometry) {
        node.geometry.dispose();
      }

      // 2. Materyalleri ve dokuları serbest bırak
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((mat) => this.disposeMaterial(mat));
        } else {
          this.disposeMaterial(node.material);
        }
      }
    }
  }

  private static disposeMaterial(material: THREE.Material): void {
    material.dispose();
    for (const key of Object.keys(material)) {
      const value = (material as any)[key];
      if (value && typeof value === 'object' && 'minFilter' in value) {
        // Texture tespit edildi
        (value as THREE.Texture).dispose();
      }
    }
  }
}
```

**Bileşen Seviyesinde Kullanımı (Lifecycle Hook):**
```typescript
// CADViewer3D unmount anında:
useEffect(() => {
  return () => {
    SceneCleaner.disposeNode(modelGroupRef.current);
    renderer.dispose();
    renderer.forceContextLoss();
  };
}, []);
```

* **Kural Maddesi:** *“Tüm Three.js nesneleri yaşam döngüsü (lifecycle) kuralına tabidir. Bir geometri, materyal veya doku sahneden kaldırıldığında `.dispose()` zorunludur. `SceneCleaner` kullanılmadan hiçbir 3D nesne sahneden çıkarılamaz.”*

---

### 3. İş Parçacığı İzolasyonu ve Arayüz Donma Yasağı (Thread Non-Blocking)

#### Problem
Teknik resimdeki yüzlerce çizgiyi gruplayan Jacobi PCA, Earclip çokgen üçgenlemesi veya 100.000 noktalı STL mesh işleme ana JavaScript iş parçacığında çalışırsa tarayıcı kare hızı 0'a düşer, imleç takılır ve kullanıcı pencereyi hareket ettiremez.

#### Uygulama Mimarisi (Web Worker Katmanı)
Matematiksel ve geometrik algoritmalar UI mantığından tamamen koparılır, Web Worker API ile arka plana alınır.

**Worker Tanımı (`ui/src/workers/geometry.worker.ts`):**
```typescript
// UI iş parçacığından bağımsız CPU çekirdeğinde çalışır
self.onmessage = (event: MessageEvent<{ points: Float64Array }>) => {
  const { points } = event.data;
  
  // Yoğun Jacobi PCA veya Earclip hesaplaması
  const result = computeJacobiPCA(points);

  // Sonucu aktar (Zero-copy Transferable Array kullanarak)
  self.postMessage({ result }, [result.buffer]);
};

function computeJacobiPCA(pts: Float64Array) {
  // Kovaryans matrisi ve özvektör hesabı...
  return new Float64Array([/* hesaplanan eksenler */]);
}
```

**UI Katmanında Çağrılması (`CADViewer3D.tsx`):**
```typescript
const worker = new Worker(new URL('../../workers/geometry.worker.ts', import.meta.url), { type: 'module' });

export function runBackgroundPCA(points: Float64Array): Promise<Float64Array> {
  return new Promise((resolve) => {
    worker.onmessage = (e) => resolve(e.data.result);
    // UI asla kilitlenmez, arka planda hesaplanır
    worker.postMessage({ points }, [points.buffer]);
  });
}
```

* **Kural Maddesi:** *“16 ms'den uzun süren hiçbir hesaplama UI ana iş parçacığında yürütülemez. Ağır algoritmalar `ui/src/workers/` Web Worker katmanında koşturulmalı ve UI'a aktarılırken Transferable Object kullanılmalıdır.”*

---

### 4. Headless Görsel Regresyon Testleri (Visual Regression Testing)

#### Problem
PDF balonlama algoritmasında küçük bir CSS transform, font boyutu değişikliği veya ölçekleme faktörü oynandığında, balon teknik resimdeki ölçü çizgisinin tam üstüne binip yazıyı kapatabilir. Birim testler koordinat çıktısını doğru sansa bile görsel çıktı bozuktur.

#### Uygulama Mimarisi (Playwright Headless Visual Diff)
Mock verisiyle açılan tarayıcıda Canvas'ın anlık ekran görüntüsü alınır ve depodaki referans görüntüyle piksel piksel karşılaştırılır.

**Görsel Regresyon Testi (`tests/visual/ballooning.spec.ts`):**
```typescript
import { test, expect } from '@playwright/test';

test('Askı Kancası PDF Balonlama Görsel Regresyon Testi', async ({ page }) => {
  // Mock IPC modunda uygulamayı aç
  await page.goto('http://localhost:5173/?mock=hook_sample');

  // Çizimin ve balonların tam çizilmesini bekle
  await page.waitForSelector('[data-testid="drawing-canvas-ready"]');

  // 2D Canvas elemanını yakala
  const canvas = page.locator('#drawing-viewport-canvas');

  // Referans görselle karşılaştır (Fark eşiği: en fazla %0.1)
  await expect(canvas).toHaveScreenshot('hook_sample_ballooned_golden.png', {
    maxDiffPixelRatio: 0.001,
  });
});
```

* **Kural Maddesi:** *“Balonlama motorunda veya 3D sahne projeksiyonunda yapılan değişiklikler, görsel regresyon testlerinden (Playwright Canvas Snapshot) onay almadan ana dala birleştirilemez.”*

---

### 5. Deterministik Sayısal Hassasiyet ve Koordinat Sistemi Kuralı (Precision & EPSILON)

#### Problem
Python OpenCV piksel tabanlı sol-üst orijinli $(X_{\text{sağ}}, Y_{\text{aşağı}})$ koordinat kullanırken; PDF sol-alt orijinli point ($1/72\text{ inç}$) cinsinden çalışır, Three.js ise merkez orijinli metre/milimetre ve sağ el kuralı $(X_{\text{sağ}}, Y_{\text{yukarı}}, Z_{\text{bize}})$ kullanır. Dönüşümlerde `0.1 + 0.2 = 0.30000000000000004` gibi kayan nokta hataları tolerans eşleştirmelerini bozar.

#### Uygulama Mimarisi (Boundary Adapter & Global Math Constants)

**Küresel Tolerans Modülü (`ui/src/modules/core/math/precision.ts`):**
```typescript
export const PRECISION = {
  EPSILON_LINEAR: 1e-4,   // 0.1 mikron
  EPSILON_ANGULAR: 1e-3,  // ~0.05 derece (radyan)
} as const;

export function isEqual(a: number, b: number, eps = PRECISION.EPSILON_LINEAR): boolean {
  return Math.abs(a - b) <= eps;
}

export function isZero(a: number, eps = PRECISION.EPSILON_LINEAR): boolean {
  return Math.abs(a) <= eps;
}
```

**Sınır Katmanı Koordinat Dönüştürücüsü (`ui/src/modules/drawing/adapters/CoordinateAdapter.ts`):**
```typescript
export interface PDFPoint { x: number; y: number; pageHeight: number; }
export interface CanvasPoint { x: number; y: number; }

export class CoordinateAdapter {
  // Ham koordinatlar asla doğrudan iş mantığına sızmaz; giriş anında dönüştürülür
  public static pdfToCanvas(point: PDFPoint, zoom: number): CanvasPoint {
    return {
      x: point.x * zoom,
      y: (point.pageHeight - point.y) * zoom // Sol-alt orijinden sol-üst ekrana ters çevirme
    };
  }
}
```

* **Kural Maddesi:** *“Float eşitliklerinde asla doğrudan `a == b` kullanılamaz; daima `isEqual(a, b, PRECISION.EPSILON_LINEAR)` kullanılmalıdır. Koordinat sistemleri çekirdek modüllere ham sızdırılamaz; daima `CoordinateAdapter` sınırında dönüştürülmelidir.”*

---

### 6. Git Hook & CI/CD Koruması (Pre-Commit & Pre-Push Gates)

#### Problem
Dokümantasyonda yazılan kurallar geliştiricinin veya hızlı çalışan bir AI ajanının anlık dikkatsizliğiyle çiğnenebilir (`scratch/test.js` dosyasının commit'e dahil edilmesi veya `ui/index.html` içine tekrar 300 satır script gömülmesi gibi).

#### Uygulama Mimarisi (Husky Kancaları)

**`.husky/pre-commit` Dosyası:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Pre-commit kontrolleri devrede..."

# 1. Monolitik index.html dosyasına satır eklenmesini engelle
if git diff --cached --name-only | grep -E '^ui/index.html$'; then
  ADDED_LINES=$(git diff --cached ui/index.html | grep -c '^+' || true)
  if [ "$ADDED_LINES" -gt 10 ]; then
    echo "❌ HATA: ui/index.html dosyasına doğrudan kod eklemek yasaktır! Lütfen modüler bileşenleri (ui/src/...) kullanın."
    exit 1
  fi
fi

# 2. scratch/ klasöründeki geçici dosyaların commitlenmesini engelle
if git diff --cached --name-only | grep -E '^scratch/'; then
  echo "❌ HATA: scratch/ klasöründeki dosyalar commitlenemez! Kalıcı testlere dönüştürün veya silin."
  exit 1
fi

# 3. TypeScript ve Python tip doğrulaması
npm run typecheck
```

**`.husky/pre-push` Dosyası:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Pre-push entegrasyon testleri koşuluyor..."
npm run test:all
```

* **Kural Maddesi:** *“Pre-commit veya pre-push kancalarını baypas etmek (`--no-verify`) kesinlikle yasaktır.”*

---

### 7. AI Ajanı Çalışma ve Değişiklik Protokolü (AI Agent Guardrails)

#### Problem
AI ajanları (Cursor / Claude / Copilot / Antigravity) büyük bağlamlarda mimariyi korumak yerine kestirme yola sapabilir: Var olan 500 satırlık fonksiyonun içine iç içe `if-else` ekler, kullanılmayan eski kodları `// TODO: kaldırılacak` yorum satırında bırakır veya dosya sonuna global değişkenler yığar.

#### Uygulama Mimarisi (`AGENTS.md` ve `.cursorrules`)
Proje kökünde `AGENTS.md` dosyası ile ajanların çalışma alanı sınırlandırılır:

```markdown
# NUPER ORTHO — AI AGENT PROTOKOLÜ

1. ATOMİK MODÜL KURALI:
   - Tek bir görevde en fazla 3 dosya değiştirebilirsin.
   - Yeni bir algoritma eklerken mevcut dosyayı şişirme; `ui/src/modules/<alan>/utils/` altında bağımsız (pure) bir fonksiyon olarak yaz ve birim testini ekle.

2. SIFIR YORUM SATIRI BIRAKMA KURALI:
   - Değiştirilen veya geçersiz kalan eski kod blokları ASLA yorum satırı (`//`, `#`) olarak bırakılamaz. Doğrudan silinecektir; Git geçmişi mevcuttur.

3. SÖZLEŞME VE IPC KURALI:
   - Python veya Rust ile haberleşen yeni bir parametre gerektiğinde, KOD YAZMADAN ÖNCE `schemas/*.schema.json` dosyasını güncelle ve `npm run codegen` çalıştır.
   - Şemada tanımlı olmayan hiçbir key-value alanını rastgele JSON payload içine ekleme.

4. HATA RAPORLAMA STANDARDI:
   - `console.log` veya Python `print` ile hata ayıklama teslim edilemez. Merkezi `logger` modülü kullanılmalıdır.
```

---

## 5. Granüler ve Adım Adım Bütünleşik Yol Haritası (Sub-Phase Breakdown)

Bağlamın kaybolmaması, kod tabanının şişmemesi ve her adımın kesin fiili kanıtla (execution proof) doğrulanması için geliştirme süreci 5 ana faz ve alt adımlarına bölünmüştür. **Bir alt fazın terminal çıktısı başarıyla onaylanmadan kesinlikle bir sonrakine geçilemez.**

---

### 🔹 FAZ 1: Sözleşmeler ve Tip Otomasyonu (Single Source of Truth)
*Amaç: Diller arası (Rust, Python, TS) ham veri iletişimini kesmek, tip uyuşmazlığı hatalarını sıfırlamak.*

- **Faz 1.1: Merkezi JSON Şemalarının Tanımlanması (Schemas Foundation)**
  - *Kapsam:* `schemas/` klasörünün oluşturulması ve katı Draft-07 tip tanımlarının yazılması.
  - *Dosyalar:* `schemas/drawing_data.schema.json`, `schemas/cad_metadata.schema.json`, `schemas/inspection_plan.schema.json` (Maks 3 dosya).
  - *Doğrulama:* JSON sözdizimi ve Draft-07 şema validasyonu.
  - *Durum:* ✅ **Tamamlandı**.
- **Faz 1.2: Kod Üreteci Motoru ve Görev Yapılandırması (Codegen Script & Task)**
  - *Kapsam:* JSON şemalarından TypeScript `.d.ts` ve Python Pydantic modellerini otomatik üreten `scripts/codegen.mjs` betiğinin yazılması ve `package.json` içine `"codegen": "node scripts/codegen.mjs"` komutunun eklenmesi.
  - *Dosyalar:* `scripts/codegen.mjs`, `package.json` (Maks 2 dosya).
  - *Doğrulama:* Script sözdizim ve çalıştırma hazırlığı.
  - *Durum:* ✅ **Tamamlandı**.
- **Faz 1.3: Fiili Terminal Kanıtı ve Model Senkronizasyonu (Execution Proof & File Check)**
  - *Kapsam:* Terminalde `npm run codegen` komutunun bizzat çalıştırılması; `ui/src/types/generated/drawing_data.d.ts`, `cad_metadata.d.ts`, `inspection_plan.d.ts` ve `tools/models/generated_drawing_data.py` dosyalarının diskteki varlığının ve terminal çıktısının kanıtlanması.
  - *Dosyalar:* `ui/src/types/generated/*`, `tools/models/*`.
  - *Zorunlu Terminal Kanıtı:* `npm run codegen` terminal logu ve diskteki üretilmiş dosya listesi.
  - *Durum:* ✅ **Tamamlandı** (Terminal çıktısı ve dosya doğrulandı).

---

### 🔹 FAZ 2: Görev Koşucusu & Geliştirme Kafesi (Guardrails & Task Runner)
*Amaç: Projenin bozulmasını engelleyen Git hook'larını ve birleşik test komutlarını kurmak.*

- **Faz 2.1: Standart Görev Koşucusu Komutları (Unified Scripts)**
  - *Kapsam:* `package.json` içinde tek tip standart geliştirici komutlarının yapılandırılması:
    - `"check:types": "tsc --noEmit"`
    - `"test:python": "python -m pytest tools/tests -q"`
    - `"test:fast": "cargo check --workspace && python -m pytest tools/tests"`
    - `"check:all": "npm run check:types && npm run test:python && npm run test:fast"`
  - *Dosyalar:* `package.json` (Maks 1 dosya).
  - *Doğrulama:* `npm run check:types` ve `npm run test:python` çalıştırma hazırlığı.
  - *Durum:* 📋 **Sıradaki (Faz 1 Onayından Sonra)**.
- **Faz 2.2: Git Pre-Commit Kalkanı (Monolit & Scratch Blokajı)**
  - *Kapsam:* `ui/index.html` içine 10 satırdan fazla ekleme yapılmasını ve `scratch/` geçici dosyalarının commit'e girmesini engelleyen `.dev/scripts/pre_commit_check.mjs` ve Git Hook / npm script entegrasyonu.
  - *Dosyalar:* `.dev/scripts/pre_commit_check.mjs`, `package.json` (`"precommit"`).
  - *Zorunlu Terminal Kanıtı:* `npm run precommit` terminal çıktısı.
  - *Durum:* 📋 **Planlandı**.
- **Faz 2.3: AI Ajan Protokolü (AGENTS.md) ve Sistem Çapında Birleşik Doğrulama (Execution Proof)**
  - *Kapsam:* Kök dizine `AGENTS.md` dosyasının konulması (3 dosya sınırı, yorum satırı yasağı, SSOT şema kuralı, loglama standardı) ve `npm run check:all` birleşik komutunun terminalde çalıştırılarak tam yeşil log kanıtının sunulması.
  - *Dosyalar:* `AGENTS.md`.
  - *Zorunlu Terminal Kanıtı:* `npm run check:all` tüm kontrollerin PASS olduğunu gösteren terminal çıktısı.
  - *Durum:* 📋 **Planlandı**.

---

### 🔹 FAZ 3: Frontend Modülerleştirme & Three.js Bellek Temizliği (Vite + ES Modules)
*Amaç: 420 KB'lık monolitik ui/index.html dosyasını parçalamak, WebGL bellek sızıntısını (SceneCleaner) engellemek, ağır hesaplamaları Web Worker'a taşımak.*

- **Faz 3.1: CAD Çekirdeği Bellek Temizliği (SceneCleaner.ts)**
  - *Kapsam:* `ui/src/modules/cad/utils/SceneCleaner.ts` yardımcı sınıfının yazılması; `geometry.dispose()`, `material.dispose()`, `texture.dispose()` özyinelemeli temizliği ve WebGL context loss koruması.
  - *Dosyalar:* `ui/src/modules/cad/utils/SceneCleaner.ts`, `ui/src/modules/cad/utils/SceneCleaner.test.ts`.
  - *Zorunlu Terminal Kanıtı:* Vitest bellek temizleme testi (0 sızıntı PASS).
  - *Durum:* 📋 **Planlandı**.
- **Faz 3.2: Arka Plan Matematik Web Worker'ı (geometry.worker.ts)**
  - *Kapsam:* Jacobi PCA eksen hizalama ve Earclip üçgenleme gibi ağır hesaplamaları UI ana iş parçacığından koparan Web Worker modülünün kurulması (Transferable ArrayBuffer ile zero-copy veri iletimi, 16 ms / 60 FPS kuralı).
  - *Dosyalar:* `ui/src/workers/geometry.worker.ts`.
  - *Zorunlu Terminal Kanıtı:* Web Worker tip kontrolü ve Transferable ArrayBuffer veri iletim testi.
  - *Durum:* 📋 **Planlandı**.
- **Faz 3.3: CAD & Sahne Mantıklarının Modüllere Taşınması (ui/src/modules/cad/)**
  - *Kapsam:* `ui/index.html` içindeki Three.js sahnesi, kamera kontrolleri, ışıklandırma ve CAD render mantıklarının `ui/src/modules/cad/` altındaki bağımsız TypeScript modüllerine aktarılması.
  - *Dosyalar:* `ui/src/modules/cad/CADViewer.ts`, `ui/src/modules/drawing/DrawingCanvas.ts`.
  - *Doğrulama:* Modüllerin bağımsız derlenebilirlik kontrolü.
  - *Durum:* 📋 **Planlandı**.
- **Faz 3.4: Vite Yapılandırması ve Production Bundle Doğrulaması (Execution Proof)**
  - *Kapsam:* `vite.config.mjs` ve `ui/src/main.ts` ile modern ES Modules derleme hattının tamamlanması ve `npm run build` ile 0 hatayla bundle üretildiğinin kanıtlanması.
  - *Dosyalar:* `vite.config.mjs`, `ui/src/main.ts`.
  - *Zorunlu Terminal Kanıtı:* `npm run build` komutunun terminalde hatasız (0 error) tamamlandığını gösteren terminal çıktısı.
  - *Durum:* 📋 **Planlandı**.

---

### 🔹 FAZ 4: Mock IPC & İzole Tarayıcı Geliştirme Modu
*Amaç: Ağır STEP/PDF yüklemeden, Electron açmadan arayüzü 1 saniyede test edebilmek.*

- **Faz 4.1: Mock IPC Sağlayıcısı (MockIpcProvider.ts)**
  - *Kapsam:* Standart web tarayıcısında çalışırken Electron `ipcRenderer` çağrılarını taklit eden `ui/src/modules/ipc/MockIpcProvider.ts` modülünün yazılması.
  - *Dosyalar:* `ui/src/modules/ipc/MockIpcProvider.ts`.
  - *Zorunlu Terminal Kanıtı:* Headless IPC simülasyon testi.
  - *Durum:* 📋 **Planlandı**.
- **Faz 4.2: Statik Test Numuneleri (.dev/mocks/)**
  - *Kapsam:* `.dev/mocks/` klasörüne 2 adet statik test numunesi (Askı Kancası ve Avionic Panel JSON/Mesh verileri) yerleştirilmesi.
  - *Dosyalar:* `.dev/mocks/aski_kancasi.json`, `.dev/mocks/avionic_panel.json`.
  - *Zorunlu Terminal Kanıtı:* JSON verilerinin JSON-Schema ile doğrulanması.
  - *Durum:* 📋 **Planlandı**.
- **Faz 4.3: Hızlı Geliştirme Modu (`dev:mock`) ve Headless Birim Testi Kanıtı (Execution Proof)**
  - *Kapsam:* `package.json` içine `"dev:mock": "vite --mode mock"` komutunun eklenmesi; URL'de `?mock=true` olduğunda sahte veriyle 1 saniyede açılış desteği ve mock verisini okuyan headless testin çalıştığının kanıtlanması.
  - *Dosyalar:* `ui/src/modules/ipc/MockIpcProvider.test.ts`, `package.json`.
  - *Zorunlu Terminal Kanıtı:* `npx vitest run src/modules/ipc/MockIpcProvider.test.ts` PASS çıktısı.
  - *Durum:* 📋 **Planlandı**.

---

### 🔹 FAZ 5: Regresyon Temizliği, Golden Benchmarks & scratch/ Tasfiyesi
*Amaç: scratch/ kirliliğini silmek, çalışan tüm kodları kalıcı test paketine dönüştürmek, SQLite benchmark'ları ile tam boru hattını mühürlemek.*

- **Faz 5.1: `scratch/` Analizi ve Kalıcı Test Taşınması**
  - *Hedef:* `scratch/` altındaki başarılı scriptlerin incelenmesi; çalışan mantıkların kalıcı `tools/tests/` veya `tests/` klasörüne unit test olarak aktarılması.
  - *Dosyalar:* `tools/tests/test_drawing_extractor.py`, `tests/benchmarks.test.ts`.
  - *Zorunlu Terminal Kanıtı:* `python -m pytest tools/tests -q` PASS çıktısı.
  - *Durum:* 📋 **Planlandı**.
- **Faz 5.2: SQLite Golden Benchmark Regresyon Testi**
  - *Hedef:* `benchmarks.db` SQLite veritabanındaki 206 test modelinden en az 10 tanesini referans alarak otomatik Golden Benchmark regresyon testinin kurulması.
  - *Dosyalar:* `scripts/init_sqlite_db.py`, `test_assets/benchmarks.db`.
  - *Zorunlu Terminal Kanıtı:* SQLite sorgu ve benchmark doğrulaması.
  - *Durum:* 📋 **Planlandı**.
- **Faz 5.3: `scratch/` Tasfiyesi ve Büyük Birleşik Doğrulama (Execution Proof: Final Golden Seal)**
  - *Hedef:* `scratch/` klasörünün arşivlenmesi veya `.gitignore`'a alınması; `npm run check:all` komutunun baştan sona çalıştırılarak Rust, Python ve Frontend testlerinin hepsinin PASS olduğunun kanıtlanması.
  - *İlgili Dosyalar:* `.gitignore`, `package.json`.
  - *Zorunlu Terminal Kanıtı:* `npm run check:all` eksiksiz terminal logu.
  - *Durum:* 📋 **Planlandı**.

---

## 6. Özet Çıktı ve Kazanım Hedefi

Bu altyapı devreye alındığında:
1. **Geliştirme Hızı:** Bir UI veya CAD algoritması değişikliğini test etme süresi **3 dakikadan 2 saniyeye** inecektir (Vite HMR + Mock IPC).
2. **Sıfır Donma (60 FPS):** Ağır hesaplamalar Web Worker'lara taşındığı için arayüz asla kilitlenmeyecektir.
3. **Sıfır Bellek Sızıntısı:** `SceneCleaner` ile onlarca model art arda açılsa dahi GPU VRAM ve RAM tüketimi stabil kalacaktır.
4. **Hata ve Sapma Oranı:** Sayısal yuvarlama, koordinat ekseni kayması ve tip uyumsuzluğu derleme aşamasında; görsel kaymalar ise Playwright snapshot testinde **otomatik olarak engellenecektir**.
5. **Kod Hijyeni & Koruma:** 420 KB'lık monolitik dosya yerine her biri 100–300 satırlık temiz modüller olacak; Git Hook'ları ve AI Ajan kuralları kod tabanının tekrar kirlenmesini imkansız kılacaktır.
