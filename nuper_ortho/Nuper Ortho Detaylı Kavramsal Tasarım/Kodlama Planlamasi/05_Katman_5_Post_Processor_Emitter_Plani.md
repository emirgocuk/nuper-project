# 💻 Katman 5 Planı: Post-Processor Derleyici (`ortho-emitter`)

> **"Soyut hareket ve teftiş grafını (AST + Trajectory) PC-DMIS, ANSI DMIS 5.3 ve Calypso ASCII makine dillerine derleyen Rust şablon motoru planı."**

---

## 📌 1. Modülün Amacı ve Sorumluluğu

`ortho-emitter` kütüphanesi, sistemin **Backend / Code Generator** katmanıdır. Görevi:
1. Katman 4'ten gelen `MotionTrajectory` ve Katman 2'deki `InspectionPlan` verilerini birleştirmek.
2. Hedef CMM tezgahının beklediği sentaks kurallarına göre ASCII metin çıktısı üretmek.
3. Koda operatör için manuel kaba ön-hizalama rehberliğini (`MODE/MAN`) ve DCC mod geçişini (`MODE/PROG, MAN`) eklemek.
4. Malzeme sıcaklık genleşme katsayısını (`TEMPR/PART`) ve tolerans değerlendirme komutlarını (`OUTPUT`) oluşturmak.

---

## 🏗️ 2. Şablon Motoru Mimarisi (`tera`)

Kod üretimi, Rust'ın güçlü ve hızlı şablon derleyicisi **`tera` (Jinja2 benzeri)** ile gerçekleştirilir:

```
[ MotionTrajectory + AST ] ──► [ Emitter Context (JSON) ] 
                                          │
                                          ▼
                             [ Tera Şablon Motoru ]
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
    [ pcdmis.dmi.tera ]           [ dmis_53.dmi.tera ]         [ calypso.txt.tera ]
            │                             │                             │
            ▼                             ▼                             ▼
   Hexagon PC-DMIS Kodu          ANSI DMIS 5.3 Kodu             Zeiss Calypso Kodu
```

---

## 📜 3. DMIS 5.3 Şablonu Örneği (`dmis_53.dmi.tera`)

```jinja2
FILNAM/'{{ plan.part_name }}', 5.3
DVPOFT/0
UNITS/MM, ANGDEC
DECPL/ALL, 4

$$ --- TERMAL KOMPANZASYON ---
TEMPR/PART, {{ thermal.current_temp_c }}, MATL, {{ thermal.expansion_coeff_ppm }}
SNSET/APPRCH, {{ probe.approach_dist }}
SNSET/RETRCT, {{ probe.retract_dist }}

$$ --- MANUEL ON-HIZALAMA ---
MODE/MAN
TEXT/OPER, 'JOYSTICK ILE PRIMER DATUM A YUZEYINE DOKUNUN'
F(ROUGH_A) = FEAT/PLANE,CART, {{ datum_a.centroid.x }}, {{ datum_a.centroid.y }}, {{ datum_a.centroid.z }}, {{ datum_a.normal.x }}, {{ datum_a.normal.y }}, {{ datum_a.normal.z }}
MEAS/PLANE, F(ROUGH_A), 1
  PTMEAS/CART, {{ datum_a.centroid.x }}, {{ datum_a.centroid.y }}, {{ datum_a.centroid.z }}, {{ datum_a.normal.x }}, {{ datum_a.normal.y }}, {{ datum_a.normal.z }}
ENDMES

$$ --- OTONOM DCC GECISI ---
MODE/PROG, MAN

{% for block in motion_blocks %}
$$ --- UNSUR: {{ block.feature_name }} ---
{% for cmd in block.commands %}
{% if cmd.type == "ChangeHeadOrientation" %}
GOTO/CART, 0.0, 0.0, {{ clearance.safe_z_plane }}
SNSLCT/SA(A{{ cmd.a_deg }}B{{ cmd.b_deg }})
{% elif cmd.type == "RapidMove" %}
GOTO/CART, {{ cmd.target.x }}, {{ cmd.target.y }}, {{ cmd.target.z }}
{% elif cmd.type == "TouchMeasure" %}
PTMEAS/CART, {{ cmd.target.x }}, {{ cmd.target.y }}, {{ cmd.target.z }}, {{ cmd.normal.x }}, {{ cmd.normal.y }}, {{ cmd.normal.z }}
{% endif %}
{% endfor %}

{% if block.fit_strategy == "ChebyshevMaximumInscribed" %}
EVAL/FA({{ block.feature_name }}), TA(TOL_{{ block.feature_name }}), ALGOR/MINSC
{% else %}
EVAL/FA({{ block.feature_name }}), TA(TOL_{{ block.feature_name }})
{% endif %}
OUTPUT/FA({{ block.feature_name }}), TA(TOL_{{ block.feature_name }})
{% endfor %}

GOTO/CART, 0.0, 0.0, {{ clearance.safe_z_plane }}
ENDFIL
```

---

## 🔌 4. Yeni CMM Markası Ekleme Protokolü

Yeni bir CMM üreticisi (ör. Wenzel veya Mitutoyo MCOSMOS) sisteme entegre edileceği zaman:
- Katman 1, 2, 3 ve 4 kodlarına **asla dokunulmaz.**
- `ortho-emitter/templates/` altına sadece yeni bir şablon dosyası (`wenzel_wm.tera`) eklenir.
- Kullanıcı arayüzünde "Wenzel CMM" seçeneği aktifleşir. Bu yapı yazılımın bakım maliyetini ve kırılganlığını sıfıra indirir.
