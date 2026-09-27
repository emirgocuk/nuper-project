//! # crates/ortho-kinematics/tests/ptb_benchmarks.rs
//! 
//! PTB Akreditasyon Entegrasyon Testleri.

use approx::assert_relative_eq;
use ortho_kinematics::{
    fit_chebyshev_cylinder, fit_least_squares_plane, load_ptb_test_points,
};

#[test]
fn test_ptb_reference_cylinder_evaluation() {
    let sample_points = load_ptb_test_points("tests/data/ptb_cyl_01.dat")
        .or_else(|_| load_ptb_test_points("../../tests/data/ptb_cyl_01.dat"))
        .expect("PTB silindir verisi yüklenemedi");

    let result = fit_chebyshev_cylinder(&sample_points).expect("Chebyshev silindir fitting başarısız");

    let certified_diameter = 50.0023;
    assert_relative_eq!(result.diameter, certified_diameter, epsilon = 1e-3);
    assert_relative_eq!(result.axis.z, 1.0, epsilon = 1e-4);
}

#[test]
fn test_ptb_reference_plane_evaluation() {
    let sample_points = load_ptb_test_points("tests/data/ptb_pln_01.dat")
        .or_else(|_| load_ptb_test_points("../../tests/data/ptb_pln_01.dat"))
        .expect("PTB düzlem verisi yüklenemedi");

    let result = fit_least_squares_plane(&sample_points).expect("Gauss düzlem fitting başarısız");

    assert_relative_eq!(result.normal.z, 1.0, epsilon = 1e-4);
    assert_relative_eq!(result.flatness, 0.002624, epsilon = 1e-4);
    assert_relative_eq!(result.centroid.x, 50.0, epsilon = 1e-3);
    assert_relative_eq!(result.centroid.y, 50.0, epsilon = 1e-3);
    assert_relative_eq!(result.centroid.z, 50.0, epsilon = 1e-3);
}
