use std::path::{Path, PathBuf};
use glam::DVec3;
use ortho_ast::{DatumReferenceFrame, FeatureType, InspectionPlan};
use ortho_brep::StepParser;
use ortho_emitter::DmisEmitter;
use ortho_kinematics::sample_circle_4points;
use ortho_router::{CertifiedCollisionFreeTrajectory, ClearanceBox, StylusAssembly};

#[test]
fn test_end_to_end_phase2_real_step_pipeline() {
    println!("================================================================================");
    println!("NUPER ORTHO CMM METROLOJI DERLEYICISI - UÇTAN UCA FAZ 2 ENTEGRASYON TESTİ");
    println!("================================================================================");

    // =========================================================================
    // 1. GİRDİ DOĞRULAMA (STEP Parsing)
    // =========================================================================
    let step_path = if Path::new("tests/fixtures/sample_bracket.step").exists() {
        PathBuf::from("tests/fixtures/sample_bracket.step")
    } else if Path::new("../../tests/fixtures/sample_bracket.step").exists() {
        PathBuf::from("../../tests/fixtures/sample_bracket.step")
    } else {
        panic!("sample_bracket.step fixture dosyası bulunamadı!");
    };

    let mut parser = StepParser::new();
    parser
        .parse_file(&step_path)
        .expect("STEP dosyası ayrıştırılamadı (ISO 10303-21 parse hatası)");

    let features = parser
        .extract_geometric_features()
        .expect("B-Rep geometrik unsurları çıkarılamadı");

    // Delik 1'i (Internal Cylinder) tespit et
    let hole_1 = features
        .iter()
        .find(|f| f.feature_type == FeatureType::InternalCylinder || f.name.contains("HOLE") || f.name.contains("BORE"))
        .expect("Modelde Delik 1 (Internal Cylinder) unsuru bulunamadı!");

    let hole_diameter = hole_1.diameter.expect("Delik 1 nominal çapı tanımlı olmalıdır");
    let hole_axis = hole_1.axis_vector.unwrap_or(DVec3::Z);
    let hole_center = hole_1.centroid;
    let hole_depth = hole_1.depth_or_length.unwrap_or(30.0);

    println!("\n1. GİRDİ DOĞRULAMA (STEP Parsing):");
    println!("--------------------------------------------------------------------------------");
    println!("  -> Kaynak STEP Dosyası : {:?}", step_path);
    println!("  -> Toplam Analitik Unsur: {}", features.len());
    println!("  -> Tespit Edilen Unsur  : {}", hole_1.name);
    println!("  -> Merkez (X, Y, Z)     : [{:.4}, {:.4}, {:.4}] mm", hole_center.x, hole_center.y, hole_center.z);
    println!("  -> Nominal Çap          : {:.4} mm", hole_diameter);
    println!("  -> Nominal Derinlik     : {:.4} mm", hole_depth);
    println!("  -> Eksen Vektörü        : [{:.4}, {:.4}, {:.4}]", hole_axis.x, hole_axis.y, hole_axis.z);

    // Gerçek STEP CAD nominal koordinat doğrulaması
    assert!((hole_center.x - 50.0).abs() < 1e-4, "Merkez X koordinatı 50.0 olmalıdır");
    assert!((hole_center.y - 50.0).abs() < 1e-4, "Merkez Y koordinatı 50.0 olmalıdır");
    assert!((hole_center.z - 25.0).abs() < 1e-4, "Merkez Z koordinatı 25.0 olmalıdır");
    assert!((hole_diameter - 20.0).abs() < 1e-4, "Nominal çap 20.0 mm olmalıdır");
    assert!((hole_axis.z - 1.0).abs() < 1e-4, "Eksen doğrultusu Z ekseni olmalıdır");

    // =========================================================================
    // 2. YOL VE TEMAS NOKTALARI (Sampling & Kinematics)
    // =========================================================================
    let hit_points = sample_circle_4points(hole_center, hole_axis, hole_diameter);
    assert_eq!(hit_points.len(), 4, "Delik için 4 adet temas noktası üretilmelidir");

    println!("\n2. YOL VE TEMAS NOKTALARI (Sampling & Collision):");
    println!("--------------------------------------------------------------------------------");
    let expected_radius = hole_diameter / 2.0;

    for (idx, hp) in hit_points.iter().enumerate() {
        let dist = hp.touch_point.distance(hole_center);
        let radial_dir = (hp.touch_point - hole_center).normalize();
        let approach_dot = hp.approach_vector.dot(radial_dir);

        println!(
            "  -> Nokta {}: Temas=[{:.4}, {:.4}, {:.4}] mm | Yaklaşma=[{:.4}, {:.4}, {:.4}] | Merkeze Uzaklık={:.4} mm",
            idx + 1,
            hp.touch_point.x, hp.touch_point.y, hp.touch_point.z,
            hp.approach_vector.x, hp.approach_vector.y, hp.approach_vector.z,
            dist
        );

        // 1. Noktalar delik çeperinde mi? (merkeze uzaklık == yarıçap)
        assert!(
            (dist - expected_radius).abs() < 1e-4,
            "Nokta {} delik çeperinde (R={:.4}) olmalıdır, hesaplanan: {:.4}",
            idx + 1, expected_radius, dist
        );

        // 2. Prob merkezden çepere doğru mu yaklaşıyor? (approach_vector . radial_dir == 1.0)
        assert!(
            (approach_dot - 1.0).abs() < 1e-4,
            "Nokta {} yaklaşma vektörü delik merkezinden dış çepere doğru olmalıdır",
            idx + 1
        );
    }

    // =========================================================================
    // 3. TEFTİŞ PLANI VE PC-DMIS KOD ÜRETİMİ
    // =========================================================================
    let drf = DatumReferenceFrame::new_3_2_1("PCS_BRACKET", 1, 3, 4);
    let mut plan = InspectionPlan::new("SAMPLE_BRACKET", step_path.to_str().unwrap(), drf);
    for f in &features {
        plan.add_feature(f.clone());
    }

    let clearance_box = ClearanceBox::from_bounding_box(
        DVec3::new(0.0, 0.0, 0.0),
        DVec3::new(100.0, 100.0, 60.0),
    );
    let stylus = StylusAssembly::default();
    let trajectory = CertifiedCollisionFreeTrajectory::verify_and_certify(
        &[],
        clearance_box,
        vec![],
        &stylus,
    )
    .expect("Sertifikalı yörünge oluşturulamadı");

    let emitter = DmisEmitter::new();
    let dmis_code = emitter
        .emit_pcdmis(&plan, &trajectory)
        .expect("PC-DMIS kodu üretilemedi");

    // Çıktıyı hem yerel hem kök dizindeki output_pcdmis.dmi dosyasına yaz
    let _ = std::fs::write("output_pcdmis.dmi", &dmis_code);
    let _ = std::fs::write("../../output_pcdmis.dmi", &dmis_code);
    let output_path = "output_pcdmis.dmi";

    // =========================================================================
    // 4. ÇIKTI DOĞRULAMA (DMIS Export)
    // =========================================================================
    println!("\n3. ÇIKTI DOĞRULAMA (DMIS Export):");
    println!("--------------------------------------------------------------------------------");
    println!("Üretilen DMIS Kodundan Delik 1 Bloğu:");

    let mut hole_block = Vec::new();
    let mut capturing = false;

    for line in dmis_code.lines() {
        if line.contains("FEAT/CIRCLE") && (line.contains(&hole_1.name) || line.contains("HOLE_1") || line.contains("BORE_20")) {
            capturing = true;
        }
        if capturing {
            hole_block.push(line);
            println!("  {}", line);
            if line.contains("ENDMES") {
                break;
            }
        }
    }

    println!("--------------------------------------------------------------------------------");

    // Bloğun eksiksiz olduğunu doğrula
    assert!(!hole_block.is_empty(), "Delik 1 bloğu DMIS çıktısında bulunamadı!");
    assert!(hole_block.iter().any(|l| l.contains("FEAT/CIRCLE")), "FEAT/CIRCLE komutu eksik");
    assert!(hole_block.iter().any(|l| l.contains("MEAS/CIRCLE")), "MEAS/CIRCLE komutu eksik");
    assert_eq!(
        hole_block.iter().filter(|l| l.contains("HIT/BASIC")).count(),
        4,
        "Tam 4 adet HIT/BASIC satırı bulunmalıdır"
    );
    assert!(hole_block.iter().any(|l| l.contains("ENDMES")), "ENDMES kapatma komutu eksik");

    // Nominal koordinatların ve 4 temas noktasının kod bloğu içindeki doğrulanması
    let block_str = hole_block.join("\n");
    assert!(block_str.contains("50.0000, 50.0000, 25.0000"), "Delik merkez koordinatı eksik veya hatalı");
    assert!(block_str.contains("20.0000"), "Delik çapı (20.0000 mm) eksik veya hatalı");
    assert!(block_str.contains("60.0000, 50.0000, 25.0000"), "HIT 1 koordinatları hatalı");
    assert!(block_str.contains("50.0000, 60.0000, 25.0000"), "HIT 2 koordinatları hatalı");
    assert!(block_str.contains("40.0000, 50.0000, 25.0000"), "HIT 3 koordinatları hatalı");
    assert!(block_str.contains("50.0000, 40.0000, 25.0000"), "HIT 4 koordinatları hatalı");

    // output_pcdmis.dmi dosyasının diskte var olduğunu doğrula
    assert!(Path::new(output_path).exists(), "output_pcdmis.dmi dosyası diskte oluşturulmalıdır");
    println!("✅ Tüm adımlar başarıyla tamamlandı. Dosya kaydedildi: {}", output_path);
}
