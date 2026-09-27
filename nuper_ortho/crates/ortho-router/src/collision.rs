//! # ortho-router::collision
//! 
//! Broad-Phase (AABB) ve Narrow-Phase (GJK/EPA / Parry3D) Süpürülmüş Kapsül Çarpışma Motoru.
//! Pabuç, mengene, fikstür ve tabla engellerine karşı otomatik Lift-and-Hop rota düzeltmesi yapar.

use glam::DVec3;
use parry3d::math::{Isometry, Point, Real, Vector};
use parry3d::query;
use parry3d::shape::{Capsule, Cuboid};
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::clearance::{ClearanceBox, KeepOutZone};
use crate::stylus::StylusAssembly;
use crate::MotionSegment;

#[derive(Error, Debug, PartialEq)]
pub enum CollisionError {
    #[error("Kritik Çarpışma: '{obstacle_name}' engeline temas tespit edildi (Başlangıç: {start:?}, Bitiş: {end:?})")]
    CollisionDetected {
        obstacle_name: String,
        start: DVec3,
        end: DVec3,
    },

    #[error("Ölçüm Temas Hatası: Ölçüm noktası ({touch:?}) yasaklı bölge içinde")]
    TouchPointInsideObstacle {
        obstacle_name: String,
        touch: DVec3,
    },
}

/// Çarpışma Raporu
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CollisionReport {
    pub obstacle_name: String,
    pub segment_start: DVec3,
    pub segment_end: DVec3,
    pub description: String,
}

/// İki 3D nokta arasında süpürülen silindirik kapsül (Swept Volume Capsule) ile
/// bir KeepOutZone kutusu arasındaki GJK/EPA çarpışmasını test eder.
pub fn test_swept_capsule_obstacle(
    start: DVec3,
    end: DVec3,
    radius: f64,
    obstacle: &KeepOutZone,
) -> bool {
    // 1. Broad-Phase (Geniş Faz): AABB Kutu Kesişim Testi
    let seg_min_x = start.x.min(end.x) - radius;
    let seg_max_x = start.x.max(end.x) + radius;
    let seg_min_y = start.y.min(end.y) - radius;
    let seg_max_y = start.y.max(end.y) + radius;
    let seg_min_z = start.z.min(end.z) - radius;
    let seg_max_z = start.z.max(end.z) + radius;

    if seg_max_x < obstacle.min.x
        || seg_min_x > obstacle.max.x
        || seg_max_y < obstacle.min.y
        || seg_min_y > obstacle.max.y
        || seg_max_z < obstacle.min.z
        || seg_min_z > obstacle.max.z
    {
        return false; // Geniş fazda güvenle elendi
    }

    // 2. Narrow-Phase (Dar Faz): Parry3D Capsule vs Cuboid GJK Kesişim Testi
    let p1 = Point::new(start.x as Real, start.y as Real, start.z as Real);
    let p2 = Point::new(end.x as Real, end.y as Real, end.z as Real);

    // Segment uzunluğu sıfıra çok yakınsa tekil küre/nokta gibi davran
    let capsule = if (start - end).length_squared() < 1e-6 {
        let p_offset = Point::new(start.x as Real, start.y as Real, (start.z + 0.001) as Real);
        Capsule::new(p1, p_offset, radius as Real)
    } else {
        Capsule::new(p1, p2, radius as Real)
    };

    let obs_center = (obstacle.min + obstacle.max) * 0.5;
    let obs_half_extents = (obstacle.max - obstacle.min) * 0.5;

    let cuboid = Cuboid::new(Vector::new(
        obs_half_extents.x as Real,
        obs_half_extents.y as Real,
        obs_half_extents.z as Real,
    ));

    let cuboid_pos = Isometry::translation(
        obs_center.x as Real,
        obs_center.y as Real,
        obs_center.z as Real,
    );
    let capsule_pos = Isometry::identity();

    query::intersection_test(&capsule_pos, &capsule, &cuboid_pos, &cuboid).unwrap_or(false)
}

/// Engel üzerinden güvenli aşırtma (Lift-and-Hop) rota segmentleri üretir
pub fn generate_lift_and_hop(
    start: DVec3,
    end: DVec3,
    obstacle: &KeepOutZone,
    clearance_z: f64,
) -> Vec<MotionSegment> {
    // Engelin tepesinden +40 mm yukarıda veya Emniyet Tavan Düzleminde intikal et
    let hop_z = (obstacle.max.z + 40.0).max(clearance_z);

    vec![
        // 1. Dikey tırmanış: Start noktasından doğrudan hop_z emniyet seviyesine çık
        MotionSegment::RapidLinear {
            target: DVec3::new(start.x, start.y, hop_z),
        },
        // 2. Havada yatay geçiş: Engel üzerinden hedef koordinatın tepesine intikal et
        MotionSegment::RapidLinear {
            target: DVec3::new(end.x, end.y, hop_z),
        },
        // 3. Emniyetli iniş: Hedef noktaya dikey olarak in
        MotionSegment::RapidLinear { target: end },
    ]
}

/// Verilen hareket segmentlerini engellere karşı denetler ve gerekirse Lift-and-Hop ile otonom iyileştirir
pub fn resolve_collision_free_path(
    raw_segments: &[MotionSegment],
    clearance_box: &ClearanceBox,
    keep_outs: &[KeepOutZone],
    stylus: &StylusAssembly,
) -> Result<Vec<MotionSegment>, CollisionError> {
    let mut resolved_segments = Vec::with_capacity(raw_segments.len() * 2);
    let mut current_pos = DVec3::new(0.0, 0.0, clearance_box.z_clearance);

    // Çarpışma yarıçapı: Bilye + Şaft en geniş yarıçapı (güvenlik tamponu ile)
    let collision_radius = stylus.ball_radius.max(stylus.stem_radius) + 1.0;

    for segment in raw_segments {
        match segment {
            MotionSegment::RapidLinear { target } => {
                let target_pt = *target;
                let mut collided_obstacle: Option<&KeepOutZone> = None;

                for obstacle in keep_outs {
                    if test_swept_capsule_obstacle(
                        current_pos,
                        target_pt,
                        collision_radius,
                        obstacle,
                    ) {
                        collided_obstacle = Some(obstacle);
                        break;
                    }
                }

                if let Some(obstacle) = collided_obstacle {
                    // Otomatik Lift-and-Hop ile engeli aş
                    let hop_segments = generate_lift_and_hop(
                        current_pos,
                        target_pt,
                        obstacle,
                        clearance_box.z_clearance,
                    );
                    resolved_segments.extend(hop_segments);
                } else {
                    resolved_segments.push(segment.clone());
                }
                current_pos = target_pt;
            }
            MotionSegment::TouchApproach { target, normal: _ } => {
                // Temas noktasının kendisi yasaklı bölge içinde olamaz
                for obstacle in keep_outs {
                    if obstacle.contains_point(*target) {
                        return Err(CollisionError::TouchPointInsideObstacle {
                            obstacle_name: obstacle.name.clone(),
                            touch: *target,
                        });
                    }
                }
                resolved_segments.push(segment.clone());
                current_pos = *target;
            }
            MotionSegment::Retract { target } => {
                resolved_segments.push(segment.clone());
                current_pos = *target;
            }
            MotionSegment::RotateHead { .. } => {
                // Kafa rotasyonu yalnızca tavan emniyet düzleminde (z >= z_clearance) yapılmalıdır
                if current_pos.z < (clearance_box.z_clearance - 0.1) {
                    // Önce tavan düzlemine kaldır
                    resolved_segments.push(MotionSegment::RapidLinear {
                        target: DVec3::new(current_pos.x, current_pos.y, clearance_box.z_clearance),
                    });
                    current_pos.z = clearance_box.z_clearance;
                }
                resolved_segments.push(segment.clone());
            }
        }
    }

    Ok(resolved_segments)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_swept_capsule_hits_clamp() {
        // [X: 20..40, Y: 20..40, Z: 0..30] ebatlarında bir çelik bağlama pabucu
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );

        // Pabucun tam ortasından geçen yatay bir intikal çizgisi: (0, 30, 15) -> (50, 30, 15)
        let start = DVec3::new(0.0, 30.0, 15.0);
        let end = DVec3::new(50.0, 30.0, 15.0);

        let hit = test_swept_capsule_obstacle(start, end, 2.0, &clamp);
        assert!(hit, "Süpürülen kapsül pabuca çarpmalıydı!");
    }

    #[test]
    fn test_swept_capsule_clears_clamp_above() {
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );

        // Pabucun üstünden geçen güvenli intikal çizgisi: Z = 45 mm (pabuç tavanı 30 mm)
        let start = DVec3::new(0.0, 30.0, 45.0);
        let end = DVec3::new(50.0, 30.0, 45.0);

        let hit = test_swept_capsule_obstacle(start, end, 2.0, &clamp);
        assert!(!hit, "Pabucun 15mm üzerinden geçen hat temiz olmalıydı!");
    }

    #[test]
    fn test_autonomous_lift_and_hop_resolution() {
        let clamp = KeepOutZone::new(
            "CLAMP_FRONT_LEFT",
            DVec3::new(20.0, 20.0, 0.0),
            DVec3::new(40.0, 40.0, 30.0),
        );
        let clearance_box =
            ClearanceBox::from_bounding_box(DVec3::ZERO, DVec3::new(100.0, 100.0, 50.0));
        let stylus = StylusAssembly::default();

        // Pabucun içinden geçmeye çalışan tehlikeli hareket
        let raw_trajectory = vec![MotionSegment::RapidLinear {
            target: DVec3::new(50.0, 30.0, 15.0),
        }];

        let resolved = resolve_collision_free_path(
            &raw_trajectory,
            &clearance_box,
            &[clamp.clone()],
            &stylus,
        )
        .expect("Çözüm başarısız olmamalı");

        // Doğrudan geçiş engellenip 3 parçalı Lift-and-Hop (Yukarı çık -> Havada git -> İndir) üretilmeli
        assert_eq!(resolved.len(), 3);
        if let MotionSegment::RapidLinear { target } = resolved[0] {
            assert!(target.z >= 70.0); // 30 + 40 = 70mm
        } else {
            panic!("İlk hareket dikey tırmanış olmalıydı");
        }
    }
}
