---
title: 02. CAD & Geometri Ayrıştırıcı Motoru
created: 2026-09-20
tags:
  - architecture
  - cad
  - pythonocc
  - opencascade
  - geometry
---

# 📐 02. CAD & Geometri Ayrıştırıcı Motoru (`cad_parser.py`)

Nuper Citadel'in en önemli mühendislik temellerinden biri, katı model geometrisini bir yapay zekâya "tahmin ettirmek" yerine, **endüstri standardı C++ OpenCASCADE çekirdeği (`pythonocc-core`)** üzerinden deterministik olarak hesaplamasıdır.

```
       ┌───────────────────────────────┐
       │   KULLANICI STEP/STP DOSYASI  │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │    STEPControl_Reader (OCC)   │
       │   Topoloji & BRep Oluşturma   │
       └───────────────┬───────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
       ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│    KÜTLE ÖZELLİKLERİ        │ │    TOPOLOJİK DELİK TARAMA   │
│  - BRepGProp (Volumic)      │ │  - TopExp_Explorer (Faces)  │
│  - Hacim: V (mm³)           │ │  - Geom_CylindricalSurface  │
│  - Kütle: m = V * ρ (kg)    │ │  - Montaj Delikleri (Adet,  │
│  - CoG: (x_cg, y_cg, z_cg)  │ │    Çap, Merkez Koordinat)   │
│  - Atalet Tensörü (I_xx..)  │ │  - Delik Yayılım Açıklığı   │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
       ┌───────────────────────────────────────────────┐
       │          GEOMETRİK VE FİZİKSEL JSON           │
       │  (Kural Motoru ve FEA Köprüsüne Context Olur) │
       └───────────────────────────────────────────────┘
```

---

## 1. Neden OpenCASCADE (`pythonocc-core`)?
- Basit STL veya üçgen mesh ayrıştırıcıları (ör. trimesh) parçanın gerçek analitik yüzeylerini kaybeder; silindirik montaj deliklerini çokgenleştirir ve delik çapı/ekseni tespitinde %5-10 hata yaratır.
- OpenCASCADE, havacılık ve savunma standardı olan **NURBS ve B-Rep (Boundary Representation)** topolojisini doğrudan okur. Parçanın tam analitik yarıçapını, merkezini ve düzlemsel yüzeylerini mikron seviyesinde doğrulukla bulur.

---

## 2. Çekirdek Analiz Adımları

### A. Kütle ve Atalet Analizi (`BRepGProp`)
OpenCASCADE kütüphanesinin hacimsel integral fonksiyonları kullanılarak parçanın net hacmi ve ağırlık merkezi hesaplanır:

$$\text{Volume} = \iiint_V dV$$

$$\mathbf{r}_{cg} = \frac{1}{V} \iiint_V \mathbf{r} \, dV$$

Malzeme kütüphanesinden seçilen yoğunluk ($\rho$, örn. Al 6061-T6 için $2.70 \times 10^{-6}\text{ kg/mm}^3$) ile kütle türetilir:
$$m = V \times \rho$$

### B. Bounding Box ve Devrilme Kolu ($h_{cg}$)
- Parçanın global koordinat sistemindeki min/max sınırları `Bnd_Box` ile çıkarılır:
  $$\Delta X = X_{max} - X_{min}, \quad \Delta Y = Y_{max} - Y_{min}, \quad \Delta Z = Z_{max} - Z_{min}$$
- Montaj taban yüzeyi ($Z_{mount}$) tespit edildikten sonra, dinamik titreşim ve şok sırasında parçaya etki edecek **devrilme momenti kolu ($h_{cg}$)** hesaplanır:
  $$h_{cg} = |Z_{cg} - Z_{mount}|$$
  Bu değer, şok testlerinde (MIL-STD-810H Metot 516.8) montaj cıvatalarında oluşacak çekme ve kesme gerilmelerinin analitik ön-doğrulamasında kullanılır.

### C. Montaj Deliklerinin Taranması
Parça tabanındaki delikler `TopExp_Explorer` ile silindirik yüzeyler taranarak otomatik bulunur:
1. `TopAbs_FACE` elemanları gezilir.
2. Yüzey tipi `Geom_CylindricalSurface` olanlar filtrelenir.
3. Silindir yarıçapı $R$ standart vida çaplarına ($M3, M4, M5, M6$ vb. tolerans aralığında) eşleştirilir.
4. Deliklerin merkez koordinatları arasındaki maksimum mesafe ($Span_{max}$) parçanın fikstür rijitliği için sınır şartı olarak belirlenir.

---

## 3. Üretilen JSON Veri Şeması

FastAPI motoru tarafından üretilen ve kural motoruna aktarılan deterministik çıktı:

```json
{
  "cad_metadata": {
    "filename": "payload_bracket.step",
    "material": "Aluminium 6061-T6",
    "density_kg_m3": 2700.0,
    "yield_strength_mpa": 275.0,
    "ultimate_strength_mpa": 310.0,
    "poissons_ratio": 0.33
  },
  "physical_properties": {
    "volume_mm3": 142500.0,
    "calculated_mass_kg": 0.38475,
    "cog_mm": {
      "x": 60.02,
      "y": 42.48,
      "z": 22.51
    },
    "inertia_tensor_kg_mm2": {
      "Ixx": 450.2,
      "Iyy": 890.5,
      "Izz": 1120.3
    }
  },
  "geometric_bounds": {
    "bounding_box_mm": {
      "length_x": 120.0,
      "width_y": 85.0,
      "height_z": 45.0
    },
    "mounting_plane": "XY_BOTTOM",
    "h_cg_mm": 22.51
  },
  "mounting_interface": {
    "detected_holes_count": 4,
    "hole_diameter_mm": 4.2,
    "standard_screw_fit": "M4 Clearance Normal (ISO 273)",
    "hole_centers": [
      {"x": 10.0, "y": 10.0, "z": 0.0},
      {"x": 110.0, "y": 10.0, "z": 0.0},
      {"x": 110.0, "y": 75.0, "z": 0.0},
      {"x": 10.0, "y": 75.0, "z": 0.0}
    ],
    "span_x_mm": 100.0,
    "span_y_mm": 65.0,
    "diagonal_span_mm": 119.27
  }
}
```

---

## 4. Python Uygulama Taslağı (`cad_parser.py`)

```python
from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone
from OCC.Core.BRepGProp import brepgprop
from OCC.Core.GProp import GProp_GProps
from OCC.Core.Bnd import Bnd_Box
from OCC.Core.BRepBndLib import brepbndlib

def parse_step_geometry(file_path: str, density_kg_m3: float = 2700.0) -> dict:
    reader = STEPControl_Reader()
    status = reader.ReadFile(file_path)
    if status != IFSelect_RetDone:
        raise ValueError("STEP dosyası okunamadı veya format hatalı.")
    
    reader.TransferRoots()
    shape = reader.OneShape()
    
    # Kütle ve CoG Hesabı
    props = GProp_GProps()
    brepgprop.VolumeProperties(shape, props)
    vol_mm3 = props.Mass() # mm³
    cog = props.CentreOfMass()
    mass_kg = (vol_mm3 * 1e-9) * density_kg_m3
    
    # Bounding Box Hesabı
    bbox = Bnd_Box()
    brepbndlib.Add(shape, bbox)
    xmin, ymin, zmin, xmax, ymax, zmax = bbox.Get()
    
    return {
        "volume_mm3": round(vol_mm3, 2),
        "calculated_mass_kg": round(mass_kg, 4),
        "cog_mm": {"x": round(cog.X(), 2), "y": round(cog.Y(), 2), "z": round(cog.Z(), 2)},
        "bounding_box_mm": {
            "x": round(xmax - xmin, 2),
            "y": round(ymax - ymin, 2),
            "z": round(zmax - zmin, 2)
        }
    }
```

---
Bağlantılı Notlar:
- [[01_Tauri_Desktop_Shell|01. Tauri & Next.js Masaüstü Kabuğu]]
- [[03_Deterministic_Rule_Engine|03. Deterministik Standart & Kural Motoru]]
- [[FEA_Boundary_Conditions_Guidelines|FEA Sınır Şartları Kılavuzu]]
