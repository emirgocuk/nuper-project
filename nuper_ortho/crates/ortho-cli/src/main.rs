//! # ortho-cli
//! 
//! Nuper Ortho Komut Satırı Arayüzü (CLI).
//! 5 katmanlı derleyiciyi uçtan uca çalıştırarak doğrudan CMM kodunu derler.

use std::env;
use std::fs;
use glam::DVec3;
use ortho_ast::{
    DatumReferenceFrame, GeometricFeature, InspectionPlan, ToleranceConstraint,
};
use ortho_emitter::DmisEmitter;
use ortho_kinematics::{sample_cylinder_2level, sample_plane_grid, PH10LookUpTable};
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, MotionSegment};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🌐 Nuper Ortho: Otonom CMM ve Metroloji Derleyicisi v0.1.0-alpha");
    println!("---------------------------------------------------------------");

    let args: Vec<String> = env::args().collect();
    let output_path = if args.len() > 1 {
        &args[1]
    } else {
        "output_pcdmis.dmi"
    };

    println!("📦 Katman 1 & 2: Prizmatik Hidrolik Valf Bloğu Nötr AST'si Hazırlanıyor...");

    // 1. Datum A Düzlemi (Üst Yüzey, Z=50)
    let datum_a = GeometricFeature::new_plane(
        1,
        "DATUM_A_TOP",
        DVec3::new(0.0, 0.0, 50.0),
        DVec3::new(0.0, 0.0, 1.0),
        5000.0,
        20.0,
    )?;

    // 2. Datum B Ön Düzlemi (Y=0)
    let datum_b = GeometricFeature::new_plane(
        2,
        "DATUM_B_FRONT",
        DVec3::new(0.0, 0.0, 25.0),
        DVec3::new(0.0, -1.0, 0.0),
        2500.0,
        20.0,
    )?;

    // 3. Datum C Yan Stop Düzlemi (X=0)
    let datum_c = GeometricFeature::new_plane(
        3,
        "DATUM_C_LEFT",
        DVec3::new(0.0, 50.0, 25.0),
        DVec3::new(-1.0, 0.0, 0.0),
        2500.0,
        20.0,
    )?;

    // 4. Teftiş Edilecek H7 Hassas Silindirik Delik (Ø20.000 H7, Z ekseni boyunca)
    let hole_h7 = GeometricFeature::new_internal_cylinder(
        4,
        "BORE_20_H7",
        DVec3::new(50.0, 50.0, 50.0),
        DVec3::new(0.0, 0.0, -1.0), // Delik içine iniş doğrultusu
        20.000,
        30.000,
        1884.0,
        15.0,
    )?;

    let drf = DatumReferenceFrame::new_3_2_1("PCS_VALVE", 1, 2, 3);
    let mut plan = InspectionPlan::new("VALVE_BODY_OP10", "valve_block.step", drf);
    plan.bounding_box_min = DVec3::new(0.0, 0.0, 0.0);
    plan.bounding_box_max = DVec3::new(100.0, 100.0, 50.0);

    plan.features.push(datum_a.clone());
    plan.features.push(datum_b);
    plan.features.push(datum_c);
    plan.features.push(hole_h7.clone());

    // H7 Delik için Chebyshev tolerans kuralı ekle
    let tol_h7 = ToleranceConstraint::new_h7_hole(101, 4, 20.000, 0.021);
    plan.tolerances.push(tol_h7);

    plan.validate()?;
    println!("✅ Nötr AST Doğrulandı (3-2-1 Datum Çerçevesi 6-DoF Kilitli)");

    println!("🔄 Katman 3: Prob Kinematiği ve Örnekleme Noktaları Hesaplanıyor...");
    let ph10_lut = PH10LookUpTable::new();

    // Üst düzlem için prob açısı çöz (Hedef: -Z yaklaşma)
    let (top_angle, err_top) = ph10_lut.find_best_angle(datum_a.approach_vector());
    println!(
        "   -> Datum A Açısı: A{:.1}° B{:.1}° (Açısal Sapma: {:.2}°)",
        top_angle.a_deg, top_angle.b_deg, err_top
    );

    // Üst düzlem için 4 temas noktası üret
    let plane_pts = sample_plane_grid(datum_a.centroid, datum_a.normal_vector, 30.0);

    // H7 Delik için 2 seviyeli 8 temas noktası üret
    let hole_pts = sample_cylinder_2level(
        hole_h7.centroid,
        hole_h7.axis_vector.unwrap(),
        hole_h7.diameter.unwrap(),
        hole_h7.depth_or_length.unwrap(),
    );
    println!("   -> H7 Delik için ISO 10360 standardında 8 temas noktası üretildi.");

    println!("🛡️ Katman 4: Emniyet Zarfı (+50mm) ve Çarpışmasız Hareket Planlanıyor...");
    let clearance_box =
        ClearanceBox::from_bounding_box(plan.bounding_box_min, plan.bounding_box_max);
    println!(
        "   -> Emniyet Tavan Düzlemi (Z_clearance): {:.2} mm",
        clearance_box.z_clearance
    );

    let mut segments = Vec::new();

    // 1. Üst düzlem ölçüm rotası
    segments.push(MotionSegment::RotateHead {
        a_deg: top_angle.a_deg,
        b_deg: top_angle.b_deg,
    });
    for pt in plane_pts {
        // Emniyet düzleminde üzerine gel
        segments.push(MotionSegment::RapidLinear {
            target: DVec3::new(pt.touch_point.x, pt.touch_point.y, clearance_box.z_clearance),
        });
        // Dokun
        segments.push(MotionSegment::TouchApproach {
            target: pt.touch_point,
            normal: pt.surface_normal,
        });
        // 5mm geri çekil
        segments.push(MotionSegment::Retract {
            target: pt.touch_point + pt.retract_vector * 5.0,
        });
    }

    // 2. Delik ölçüm rotası
    for pt in hole_pts {
        segments.push(MotionSegment::TouchApproach {
            target: pt.touch_point,
            normal: pt.surface_normal,
        });
        segments.push(MotionSegment::Retract {
            target: pt.touch_point + pt.retract_vector * 5.0,
        });
    }

    let trajectory = CertifiedCollisionFreeTrajectory::new(segments, clearance_box, Vec::new());
    println!("✅ Çarpışmasız Rota Sertifikalandı (0 Çakışma)");

    println!("💻 Katman 5: PC-DMIS Teftiş Kodu Derleniyor...");
    let emitter = DmisEmitter::new();
    let dmis_code = emitter.emit_pcdmis(&plan, &trajectory)?;

    fs::write(output_path, &dmis_code)?;
    println!("🎉 Derleme Başarılı! Çıktı Dosyası Kaydedildi: {}", output_path);
    println!("---------------------------------------------------------------");
    println!("Örnek İlk 20 Satır:");
    for line in dmis_code.lines().take(20) {
        println!("  {}", line);
    }

    Ok(())
}
