---
title: Nuper Anti-Slop Marka ve Tasarım Sistemi
subtitle: "Savunma ve Yüksek Mühendislik İçin AI-Slop Olmayan Görsel Kimlik ve Logo Mimarisi"
author: Nuper Brand & Design Engineering
date: 2026-09-21
version: 1.0.0
tags:
  - anti-slop
  - logo-tasarımı
  - marka-kimliği
  - savunma-sanayii
  - tasarım-sistemi
  - obsidian-vault
type: design-system
---

# 🛡️ Nuper Anti-Slop Marka ve Tasarım Sistemi

Bu doküman, [anti-slop](https://github.com/miqdadbadjuber/anti-slop) filtreleme kuralları ve Onur Yanık'ın *Yaratıcılık* kitabındaki "Düş Mühendisliği" prensipleri doğrultusunda inşa edilen **resmi görsel kimlik, logo mimarisi ve arayüz anayasasıdır.**

---

## 1. Savunma Sanayii Amblem Mimarisi: "Harfsiz, Nesnesiz, Saf ve Baki Geometri"

'N' harfi dahil olmak üzere hiçbir harf formu logolaştırma için **KULLANILMAMIŞTIR**. Uçak, kalkan, kuş veya mermi gibi doğrudan somut bir nesneyi temsil eden figüratif yaklaşımlar tamamen dışarıda bırakılmıştır. Tıpkı **Anduril Industries**, **Roketsan** veya **Palantir**'in harf kullanmayan soyut mühürleri gibi, NUPER için 3 saf matematiksel ve mimari rota geliştirilmiştir:

### Rota 1: "Sovereign Monoline Arch" (Anduril Çizgisi — Mimari Kemer & Anıt)
![NUPER Symmetrical Monoline Arch](C:/Users/Emir/.gemini/antigravity-ide/brain/895d8695-a691-42b7-8159-40b2c997fb02/nuper_simple_monoline_1790022043284.jpg)
*Görsel: Rota 1 — Sadece 5 temiz çizgiden oluşan, harfsiz, anıtsal ve simetrik soyut kemer amblemi.*
- **Geometri:** Üstte monolitik bir kiriş, aşağıya doğru genişleyen iki taşıyıcı ayak ve merkezde birbirini dengeleyen iki kesişen rezonans yayı.
- **Anlam:** Güvenlik, sarsılmaz mimari güç, egemen kale kapısı.

### 🏆 Resmi Seçim ve Nihai Mühür: "Sovereign Pylon Triad" (Eşkenar Yamuk & İkiz Üçgen Mührü)
Nuper markasının resmi, kalıcı ve baki amblemi olarak **Anduril disiplininde kurgulanan Eşkenar Yamuk & İkiz Üçgen mimarisi** onaylanmıştır:

- **Üst Kanat Mimarisi (İki Parçalı Eşkenar Yamuk):** Üstte 6px dikey hassas yarıkla ikiye ayrılmış, düz tavanlı ve simetrik eğimli bir **eşkenar yamuk**.
- **Alt Kanat Mimarisi (İki Dışa Bakan Üçgen):** Taban köşelerinde yer alan, sivri uçları dışa (sağ-alt ve sol-alt) bakan iki keskin üçgen.
- **Kusursuz Koliner Dış Hatlar (Sıfır Kırılma / Kesintisiz Eğim):**
  - Üst yamuğun dış eğik kenarı (`39,7 -> 26,44`) ile alt üçgenin dış eğik kenarı (`24,50 -> 9,93`), **$dX/dY = \pm 0.35$** sabit matematiksel eğimle tek bir düz doğru üzerindedir.
  - İki parça arasındaki yatay boşlukta hiçbir dikey basamak, kırılma veya çıkıntı yoktur; dış silüet baştan aşağı tek bir lazer kesim gibi iner.
- **Merkez Çekirdek (Yere Kilitlenen Keskin Üçgen Göz):** Üst yamuk ile alt üçgenlerin merkezindeki negatif boşlukta, sivri ucu doğrudan yere bakan, gözetleme/sensör odağını temsil eden keskin 3 köşeli bir göz (`centerCore="eye"`). Gerektiğinde dairesel çekirdeğe (`centerCore="circle"`) anında geçilebilir.

### 1.1. Tipografi Anayasası: Anduril Altın Oranı
- **Yazı / İkon Oranı:** Metin cap-height yüksekliği amblem yüksekliğinin tam **%82-85'ine** eşitlenmiştir. İkon ve yazı tek bir monolitik blok oluşturur.
- **Harf Aralığı (Tracking):** Geniş ve kopuk harfler yerine Anduril gibi **kompakt (`0.03em`)** ve tok harf dizilimi uygulanmıştır (`NUPER`).
- **Boşluk (Gap):** 10px (`gap-2.5`) ile sıkı ve askeri-endüstriyel kilitlenme sağlanmıştır.
- **Font:** Space Grotesk (`font-heading`) Black (900 weight) / Inter Black.

### 1.3. Dayanıklılık ve Ölçeklenebilirlik Testleri
- ✅ **Saf Silüet Testi (Silhouette Bar):** Logo arkasındaki tüm ışıkları, dokuları ve renkleri kapattığınızda; %100 saf siyah-beyaz monokrom basıldığında dahi kimliğinden ve okunurluğundan zerre kadar kaybetmez.
- ✅ **Mekanik İmalat Testi:** Bu logo bir CNC frezede titanyum bloğa işlenebilir, bir İHA kanadına lazerle kazınabilir veya bir devre kartına (PCB) basılabilir.
- ✅ **16px Favicon Testi:** En küçük piksel boyutlarında bile "N" karakteri ve kinetik kesiği net bir şekilde ayrışır.

---

## 2. Renk Doktrini: "Anti-Slop Color Palette"

Anti-slop kuralı **R-29** uyarınca renk paleti en fazla 2-3 çekirdek renk + 1 kontrollü vurgu rengi ile sınırlandırılmıştır:

| Renk Rolü | Token İsmi | HEX Kodu | Anlam ve Gerekçe (Purpose Test) |
| :--- | :--- | :--- | :--- |
| **Zemin (Base 1)** | `obsidian-void` | `#080B11` | Sonsuz uzay derinliği, askeri gizlilik dereceli kabin zeminleri. |
| **Zemin (Base 2)** | `titanium-slate` | `#161F30` | Donanım panelleri, kart gövdeleri. Gözü yormayan soğuk titanyum. |
| **Metalik Gövde** | `machined-steel` | `#64748B` - `#94A3B8` | Logo sütunları ve yapısal çizgiler; endüstriyel malzeme ciddiyeti. |
| **Birincil Kontrast** | `pure-signal` | `#F8FAFC` | Başlıklar ve keskin telemetri verileri; tavizsiz okunabilirlik. |
| **Taktik Vurgu (1x)** | `aero-blue` | `#38BDF8` | **Sadece ve sadece** aktif durumda olan butonlar veya kilit radar noktaları için (R-13). Asla tüm sayfaya yayılmaz! |

> [!important] Renk Disiplini Kuralı (R-01 & R-13)
> Sayfada asla kontrolsüz "blur orbları" veya mor-mavi gradyanlı arka planlar bulunamaz. Glow (ışıldama) yalnızca tek bir aktif sistem uyarısı veya odak noktası için dozunda kullanılır.

---

## 3. Tipografi Hiyerarşisi (R-06)

Yapay zeka şablonlarının "modern" görünmek için her yere gelişigüzel `Inter` veya sahte `JetBrains Mono` basma tembelliği engellenmiştir:

1. **Marka Başlıkları (Wordmark & H1):**
   - **Font:** `Orbitron` / Geometrik Keskin Sans.
   - **Karakter:** Ağırbaşlı, monolitik, havacılık gövde numaraları gibi net harf aralıkları (`letter-spacing: 0.25em`).
2. **Gövde Metinleri & Dokümantasyon:**
   - **Font:** `Inter` / Clean System Sans.
   - **Karakter:** 1.6 satır yüksekliği (leading), gözü yormayan yüksek kontrast oranları (WCAG AAA uyumlu).
3. **Telemetri, Koordinat ve Teknik Veriler:**
   - **Font:** `JetBrains Mono`.
   - **Kullanım Yeri:** Sadece gerçek sayısal veriler, şartname kodları ve durum raporları için. (Sahte terminal süsü olarak kullanılmaz! R-06).

---

## 4. Web Arayüz Bileşenleri ve Anti-Slop Standartları

1. **Cam Efekti Sınırı (R-10):** Sitede aynı anda her yer cam (backdrop-blur) olamaz. Sadece üst gezinme çubuğu (Navbar) hafif buzlu camdır; kartlar ve içerik panelleri sağlam, mat ve zeminli yüzeylerdir.
2. **Köşe Radyusu Dengesi (R-11):** Her butonu veya kartı hap (pill) şeklinde yuvarlamak yasaktır. Nuper'in endüstriyel ruhuna uygun olarak keskin ve kararlı pahlar kullanılır (`rounded-md` / `rounded-lg`).
3. **Dürüst İçerik Kuralı (R-38 & C-5):** Sitede sahte "Trusted by 500 companies" logoları, uydurma müşteri yorumları veya çalışmayan sahte kontrol butonları bulunamaz. Yapılan iş neyse o dürüstlükle gösterilir.

---

## 5. Uygulama ve Kod Entegrasyonu

Logo vektör bileşeni kodlanarak projeye dahil edilmiştir:
- **Kaynak Kod:** [src/components/brand/NuperLogo.tsx](file:///d:/Projects/nuper-project/nuper-next-postgresql/src/components/brand/NuperLogo.tsx)
- **Web Navbar Entegrasyonu:** [src/components/Navbar.tsx](file:///d:/Projects/nuper-project/nuper-next-postgresql/src/components/Navbar.tsx) içerisindeki jenerik yazı kaldırılmış, yerine anti-slop `NuperLogo` bileşeni yerleştirilmiştir.
- **Fiziksel İmaj Varlığı:** `public/brand/nuper-logo.jpg` (yüksek çözünürlüklü metalik referans).
