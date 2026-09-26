# 🎛️ 18. CMM Tezgah Profili, Prob ID Eşleme ve Donanım Lehçeleri

> **"CMM makine sınırlarını (strok limitleri), PC-DMIS .prb prob konfigürasyon ID'lerini, native magazin değişim makrolarını ve Zeiss Calypso 'Özellik Tabanlı' (Feature-Oriented) mimarisini yöneten Donanım Soyutlama Katmanı (HAL)."**

---

## 📌 1. Saha Gerçeği: "DMIS Evrenseldir" Efsanesi

Yazılım geliştiriciler DMIS 5.3'ü evrensel bir makine kodu zanneder. Oysa sahada her üretici (Hexagon, Zeiss, Mitutoyo, LK Metrology, Wenzel) DMIS standartlarını kendi ticari çıkarlarına göre eğip bükmüştür:
1. **PC-DMIS:** DMIS komutlarını içe aktarabilir; ancak prob dosyasının adı (`LOADPROBE/TIP_NAME`) ve kafa montaj ID'si tezgahtaki veritabanıyla uyuşmazsa program doğrudan durur.
2. **Zeiss Calypso:** Satır satır intikal (`GOTO X, Y, Z`) mantığıyla çalışmaz. Calypso bir **Özellik ve Tolerans Motorudur**; unsurları CAD'den alır, prob yolunu Calypso kendi kapalı algoritmasıyla örer.
3. **Makine Strok Limitleri:** CMM köprüsünün ve dikey milin (quill) fiziksel sınırları vardır. Parça köşede dururken probun açılı uzaması tezgahın mekanik limit switch'ine vurabilir.

---

## 🏗️ 2. Donanım Soyutlama Katmanı (HAL - Hardware Abstraction Layer)

Nuper Ortho, hedef tezgaha doğrudan rastgele kod basmaz. Arada tip-güvenli bir donanım profili çalıştırır:

```
┌─────────────────────────────────────────────────────────────┐
│                 Nuper Ortho Neutral AST                     │
│    (Saf Geometrik Rota, Temas Vektörleri, Emniyet Kutusu)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Donanım Soyutlama Katmanı (Hardware HAL)           │
│ ├── Tezgah Strok Denetleyicisi (Machine Envelope Checker)   │
│ ├── Prob ID Sözlüğü (.prb / tip_map.json)                   │
│ └── Makro Yönlendirici (Native Tool Change Dispatcher)      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
    [ PC-DMIS Post-Driver ]        [ Zeiss Calypso Post-Driver ]
    • .dmi / .bas formatı          • ASCII Feature Def (.txt/.xml)
    • Doğrudan GOTO + MEAS         • Prüfmerkmale / Özellik Listesi
```

---

## 📐 3. Tezgah Profili ve Çalışma Hacmi (Machine Profile Schema)

Her CMM tezgahı sisteme tek seferlik bir JSON yapılandırma dosyası ile tanımlanır:

```json
{
  "machine_id": "HEXAGON_GLOBAL_S_091208",
  "vendor": "Hexagon",
  "software": "PCDMIS_2023",
  "travel_limits": {
    "x_min": 0.0, "x_max": 900.0,
    "y_min": 0.0, "y_max": 1200.0,
    "z_min": -800.0, "z_max": 0.0
  },
  "max_rapid_speed": 300.0,
  "default_probe_file": "PH10M_TP20_M2_20MM.prb",
  "available_tips": [
    { "tip_id": "T1A0B0", "a_deg": 0.0, "b_deg": 0.0, "calibrated": true },
    { "tip_id": "T1A90B0", "a_deg": 90.0, "b_deg": 0.0, "calibrated": true },
    { "tip_id": "T1A90B90", "a_deg": 90.0, "b_deg": 90.0, "calibrated": true }
  ],
  "rack": {
    "has_rack": true,
    "type": "MCR20",
    "ports": 6,
    "use_native_macro": true
  }
}
```

### Strok İhlal Denetimi (Envelope Guard):
Rota üretilirken tüm koordinatlar tezgahın sınır kutusuyla kesiştirilir:
$$\vec{P}_{\text{quill}} = \vec{P}_{\text{tip}} + \vec{L}_{\text{probe\_offset}}(A, B)$$
Eğer $\vec{P}_{\text{quill}} \notin [\text{Limits}]$, derleyici hemen ikaz verir:
> ⚠️ *"Strok Limiti Aşımı: Parça granit tablanın $+Y$ kenarına çok yakın. Parçayı tablada $150\text{ mm}$ geriye kaydırınız."*

---

## 🧲 4. Prob Magazini Değişiminde "Yerel Makro" Kuralı

### 🔴 Asla Yapılmayacak Hata:
Dışarıdan bir yazılımın magazin yuvasına ham koordinatla girmeye çalışması (`GOTO / X150.2, Y800.1, Z120.0`) **kesinlikle yasaktır**. Magazin yuvasının zıvanası mikron seviyesindedir; en ufak sapma probu ezer.

### 🟢 Nuper Ortho Güvenli Makro İlkesi:
Magazin değişimi gereken durumlarda yazılım sadece makinenin kendi kalibre edilmiş alt programını çağırır:

#### PC-DMIS Çıktısı:
```plaintext
$$ GUVENLI PROB DEGISTIRME CAGRISI
LOADPROBE/PH10M_TP20_EXT50
TIP/T1A0B0
```
#### ANSI DMIS 5.3 Çıktısı:
```plaintext
CALL/EXTERN, 'TOOL_CHANGE', 'PORT_2'
SNSLCT/SA(A0.0B0.0)
```
Tezgahın kendi kontrolörü (controller firmware) magazinin yerine kendi mastarlanmış koordinatlarıyla otonom gider ve döner.

---

## 🏛️ 5. Zeiss Calypso vs. PC-DMIS Çıktı Mimarisi

Zeiss Calypso kullanıcılarına hizmet verirken derleme stratejisi farklılaşır:

| Kriter | PC-DMIS / Evrensel DMIS | Zeiss Calypso Motoru |
|---|---|---|
| **Programlama Felsefesi** | Yordamsal (Procedural: Git $\to$ Dokun $\to$ Geri Çekil) | Bildirimsel (Declarative: Unsur $\to$ Tolerans $\to$ Rota) |
| **Nuper Ortho Rolü** | Doğrudan çalışan tam hareket kodu basar. | Geometri, Datum ve Tolerans Hiyerarşisini aktarır. |
| **Çıktı Formatı** | `.dmi` / `.bas` / `.prg` | Calypso ASCII Plan / XML Import File |
| **Rota Hesaplaması** | Nuper Ortho'nun 5-DoF RRT* motoru üretir. | Calypso'nun dahili yol planlayıcısına delege edilir. |

### Calypso İçin ASCII / XML Stratejisi:
Calypso kullanıcıları için Nuper Ortho, operatörün saatlerce Calypso arayüzünde tek tek delik ve tolerans tanımlama zahmetini ortadan kaldırır. 
* STEP dosyasındaki tüm silindirler, düzlemler ve 2D PDF'ten okunan ASME/ISO toleransları **Calypso ASCII Feature Definition** formatına dönüştürülür.
* Operatör Calypso'da `File -> Import -> Inspection Plan` dediğinde tüm özellikler ve tolerans limitleri ekranda hazır açılır.

---

## 📊 6. Donanım Uyum Matrisi

```
┌─────────────────────────────────────────────────────────────┐
│                 Nuper Ortho HAL Motoru                      │
├─────────────────────┬───────────────────┬───────────────────┤
│ Kontrol Ünitesi     │ Sürüm Desteği     │ Entegrasyon Türü  │
├─────────────────────┼───────────────────┼───────────────────┤
│ Hexagon PC-DMIS     │ v2018 - v2024     │ Doğrudan DMIS/.bas│
│ Zeiss Calypso       │ v6.0 - v7.4       │ XML / ASCII Plan  │
│ Mitutoyo MCOSMOS    │ Geopak v4+        │ DMIS 5.3 Köprüsü  │
│ LK Metrology CAMIO  │ v8 - v2021        │ Standart DMIS 5.3 │
│ Wenzel WM | Quartis │ v2020+            │ DMIS 5.3 / Native │
└─────────────────────┴───────────────────┴───────────────────┘
```

Bu soyutlama katmanı sayesinde Nuper Ortho, tek bir makine markasına bağımlı kalmaz; atölyedeki farklı marka CMM parkını tek bir modern arayüz altından yönetebilir.
