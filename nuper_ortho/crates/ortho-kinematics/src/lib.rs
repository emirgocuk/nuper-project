//! # ortho-kinematics
//! 
//! Katman 3: Renishaw PH10/MH20i kafa kinematiği ve ISO 10360 temas noktası örnekleme motoru.

pub mod fitting;
pub mod laser;
pub mod ph10;
pub mod plan;
pub mod sampling;
pub mod tree;
pub mod uncertainty;

pub use laser::{LaserScanPlanner, LaserScanStripe};

pub use fitting::{
    evaluate_composite_position_2d, evaluate_surface_profile, fit_chebyshev_circumscribed_cylinder,
    fit_chebyshev_cylinder, fit_least_squares_cylinder, fit_least_squares_plane,
    load_ptb_test_points, CompositePositionEvaluation, CylinderFitResult, FittingError,
    PlaneFitResult, SurfaceProfileEvaluation,
};
pub use ph10::{AngleSelectionResult, ManualIndexCluster, PH10Angle, PH10LookUpTable};
pub use plan::{CompoundFeatureInspection, OrientedFeatureInspection, OrientedSamplingPlan};
pub use sampling::{
    sample_annular_step_face, sample_cone_flank, sample_countersink_chamfer_for_center,
    sample_cylinder_2level, sample_external_cylinder, sample_freeform_feature_grid,
    sample_freeform_surface_adaptive, sample_plane_grid, sample_plane_with_margin, sample_sphere,
    sample_thread_locator_pin, SamplingPoint, SurfaceEvalSample,
};
pub use tree::{ProbeStack, StarProbeAssembly, StemMaterial};
pub use uncertainty::{
    ConformanceDecision, RobustOutlierFilter, UncertaintyBudget,
};

