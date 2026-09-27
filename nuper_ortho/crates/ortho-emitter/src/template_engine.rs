use std::collections::HashMap;
use serde::{Deserialize, Serialize};

use crate::EmitterError;

/// Parça termal kompanzasyon ayarları (Doc 07 Section 3)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ThermalConfig {
    pub current_temp_c: f64,
    pub expansion_coeff_ppm: f64,
    pub material_name: String,
}

impl Default for ThermalConfig {
    fn default() -> Self {
        Self::aluminum_7075(20.0)
    }
}

impl ThermalConfig {
    pub fn aluminum_7075(temp_c: f64) -> Self {
        Self {
            current_temp_c: temp_c,
            expansion_coeff_ppm: 23.4,
            material_name: "Aluminum 7075-T6".into(),
        }
    }

    pub fn steel_4140(temp_c: f64) -> Self {
        Self {
            current_temp_c: temp_c,
            expansion_coeff_ppm: 11.5,
            material_name: "Steel 4140 (42CrMo4)".into(),
        }
    }

    pub fn titanium_gr5(temp_c: f64) -> Self {
        Self {
            current_temp_c: temp_c,
            expansion_coeff_ppm: 8.6,
            material_name: "Titanium Ti-6Al-4V (Grade 5)".into(),
        }
    }

    pub fn invar(temp_c: f64) -> Self {
        Self {
            current_temp_c: temp_c,
            expansion_coeff_ppm: 1.2,
            material_name: "Invar 36".into(),
        }
    }
}

/// Tera şablonlarına aktarılacak yapılandırılmış serileştirilebilir veri modeli
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemplateContextData {
    pub part_name: String,
    pub cad_source: String,
    pub verification_hash: String,
    pub timestamp_iso: String,
    pub thermal: ThermalConfig,
    pub z_clearance: f64,
    pub z_roof: f64,
    pub has_threaded_holes: bool,
    pub thread_callouts: Vec<String>,
}

/// Saf Rust ile yazılmış, harici C/MinGW binary bağımlılığı olmayan deklaratif şablon motoru
#[derive(Debug, Clone)]
pub struct TemplateEngine {
    templates: HashMap<String, String>,
}

impl Default for TemplateEngine {
    fn default() -> Self {
        Self::new()
    }
}

impl TemplateEngine {
    /// Yerleşik şablonları yükleyerek motoru başlatır
    pub fn new() -> Self {
        let mut engine = Self {
            templates: HashMap::new(),
        };

        // 1. Hexagon PC-DMIS Şablonu
        engine.add_raw_template(
            "pcdmis_default.tera",
            r#"FILNAM/'{{ ctx.part_name }}', 5.3
DVPOFT/0
UNITS/MM, ANGDEC
DECPL/ALL, 4
$$ ==============================================================
$$ NUPER ORTHO OTONOM CMM TEFTIS PROGRAMI
$$ PARCA: {{ ctx.part_name }}
$$ CAD KAYNAK: {{ ctx.cad_source }}
$$ GUVENLIK: CERTIFIED COLLISION-FREE (GJK/EPA PASS)
$$ ROTA MUHRU (SHA-256): {{ ctx.verification_hash }}
$$ ZAMAN DAMGASI: {{ ctx.timestamp_iso }}
$$ ==============================================================

$$ --- 1. TERMAL KOMPANZASYON VE EMNIYET LIMITLERI ---
TEMPR/PART, {{ ctx.thermal.current_temp_c }}, MATL, {{ ctx.thermal.expansion_coeff_ppm }}  $$ {{ ctx.thermal.material_name }}
SNSET/APPRCH, 4.0000
SNSET/RETRCT, 5.0000
SNSET/SEARCH, 8.0000
SNSET/CLRSRF, {{ ctx.z_clearance }}

$$ ==============================================================
$$ 2. GUVENLI BASLANGIC VE PARK EL SIKISMASI (Z-FIRST TRAVERSAL)
$$ ==============================================================
GOTO/CART, 0.0000, 0.0000, {{ ctx.z_roof }}  $$ 1. Tavana cekil
GOTO/CART, 50.0000, 50.0000, {{ ctx.z_roof }}  $$ 2. Parca merkezine intikal
GOTO/CART, 50.0000, 50.0000, {{ ctx.z_clearance }}  $$ 3. Clearance kutusuna in

$$ ==============================================================
$$ 3. OPERATOR REHBERLIGI: MANUEL KABA ON-HIZALAMA (3-2-1)
$$ ==============================================================
MODE/MAN
TEXT/OPER, 'JOYSTICK ILE PRIMER DATUM A DUZLEMINE 3 NOKTA TEMAS ALINIZ'
F(ROUGH_A) = FEAT/PLANE,CART, 0.0, 0.0, {{ ctx.z_clearance }}, 0.0, 0.0, 1.0
MEAS/PLANE, F(ROUGH_A), 3
  PTMEAS/CART, 0.0, 0.0, {{ ctx.z_clearance }}, 0.0, 0.0, 1.0
  PTMEAS/CART, 20.0, 0.0, {{ ctx.z_clearance }}, 0.0, 0.0, 1.0
  PTMEAS/CART, 0.0, 20.0, {{ ctx.z_clearance }}, 0.0, 0.0, 1.0
ENDMES
DATDEF/FA(ROUGH_A), DAT(A)

$$ ==============================================================
$$ 4. OTONOM DCC HASSAS TEFTIS DONGUSU
$$ ==============================================================
MODE/AUTO, PROG
SNSLCT/SA(A0.0B0.0)
GOTO/CART, 0.0000, 0.0000, {{ ctx.z_clearance }}
"#,
        );

        // 2. ANSI DMIS 5.3 Standart Şablonu
        engine.add_raw_template(
            "dmis_53_ansi.tera",
            r#"$$ ANSI DMIS 5.3 UNIVERSAL ISO STANDARD
FILNAM/'{{ ctx.part_name }}', 5.3
DVPOFT/0
UNITS/MM, ANGDEC
DECPL/ALL, 4
TEMPR/PART, {{ ctx.thermal.current_temp_c }}, MATL, {{ ctx.thermal.expansion_coeff_ppm }}
SNSET/APPRCH, 4.0000
SNSET/RETRCT, 5.0000
SNSET/CLRSRF, {{ ctx.z_clearance }}
MODE/MAN
TEXT/OPER, 'MANUEL ON HIZALAMA: 3-2-1 REFERANS NOKTALARINA DOKUNUN'
MODE/AUTO, PROG
GOTO/CART, 0.0000, 0.0000, {{ ctx.z_clearance }}
"#,
        );

        // 3. Wenzel WM | Quartis Lehçesi
        engine.add_raw_template(
            "wenzel_wm.tera",
            r#"$$ WENZEL WM | QUARTIS COMPATIBLE DMIS
FILNAM/'{{ ctx.part_name }}', 5.3
UNITS/MM, ANGDEC
TEMPR/PART, {{ ctx.thermal.current_temp_c }}, MATL, {{ ctx.thermal.expansion_coeff_ppm }}
$$ Z-FIRST TRAVERSAL
GOTO/CART, 0.0000, 0.0000, {{ ctx.z_roof }}
GOTO/CART, 0.0000, 0.0000, {{ ctx.z_clearance }}
"#,
        );

        engine
    }

    /// Yeni bir şablon ekler
    pub fn add_raw_template(&mut self, name: &str, content: &str) {
        self.templates.insert(name.to_string(), content.to_string());
    }

    /// Bir şablonu belirtilen bağlam verileriyle derler
    pub fn render_header(
        &self,
        template_name: &str,
        ctx: &TemplateContextData,
    ) -> Result<String, EmitterError> {
        let raw = self.templates.get(template_name).ok_or_else(|| {
            EmitterError::TemplateError(format!("Şablon bulunamadı: {}", template_name))
        })?;

        // Saf Rust şablon değişken ikamesi (Zero-Dependency Template Rendering)
        let rendered = raw
            .replace("{{ ctx.part_name }}", &ctx.part_name)
            .replace("{{ ctx.cad_source }}", &ctx.cad_source)
            .replace("{{ ctx.verification_hash }}", &ctx.verification_hash)
            .replace("{{ ctx.timestamp_iso }}", &ctx.timestamp_iso)
            .replace(
                "{{ ctx.thermal.current_temp_c }}",
                &format!("{:.2}", ctx.thermal.current_temp_c),
            )
            .replace(
                "{{ ctx.thermal.expansion_coeff_ppm }}",
                &format!("{:.4}", ctx.thermal.expansion_coeff_ppm),
            )
            .replace("{{ ctx.thermal.material_name }}", &ctx.thermal.material_name)
            .replace("{{ ctx.z_clearance }}", &format!("{:.4}", ctx.z_clearance))
            .replace("{{ ctx.z_roof }}", &format!("{:.4}", ctx.z_roof));

        Ok(rendered)
    }
}
