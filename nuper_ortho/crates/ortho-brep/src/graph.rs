use glam::DVec3;
use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::visit::EdgeRef;
use petgraph::Direction;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct FaceNode {
    pub surface_id: u32,
    pub surface_type: String,
    pub area: f64,
    pub normal: Option<DVec3>,
    pub axis: Option<DVec3>,
    pub origin: Option<DVec3>,
    pub radius: Option<f64>,
    pub is_internal: bool,
    pub z_min: f64,
    pub z_max: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BRepNode {
    Solid { id: u32, name: String },
    Shell { id: u32, is_closed: bool },
    Face(FaceNode),
    Wire { id: u32, is_outer: bool },
    Edge { id: u32, length: f64 },
    Vertex { id: u32, point: DVec3 },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BRepEdge {
    Contains,
    Boundary,
    AdjacentFaces,
    CoaxialCylinders { axis_dist: f64, angle_rad: f64 },
    ParallelPlanes { distance: f64 },
    OppositeNormals { distance: f64 },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BoltCirclePattern {
    pub center: DVec3,
    pub pcd_radius: f64,
    pub hole_radius: f64,
    pub hole_surface_ids: Vec<u32>,
}

#[derive(Debug, Clone)]
pub struct BRepGraphEngine {
    pub graph: DiGraph<BRepNode, BRepEdge>,
    pub face_map: HashMap<u32, NodeIndex>,
}

impl Default for BRepGraphEngine {
    fn default() -> Self {
        Self::new()
    }
}

impl BRepGraphEngine {
    pub fn new() -> Self {
        Self {
            graph: DiGraph::new(),
            face_map: HashMap::new(),
        }
    }

    pub fn add_face(&mut self, face: FaceNode) -> NodeIndex {
        let sid = face.surface_id;
        let idx = self.graph.add_node(BRepNode::Face(face));
        self.face_map.insert(sid, idx);
        idx
    }

    pub fn build_relations(&mut self) {
        let face_indices: Vec<(u32, NodeIndex, FaceNode)> = self
            .face_map
            .iter()
            .filter_map(|(&sid, &idx)| {
                if let Some(BRepNode::Face(f)) = self.graph.node_weight(idx) {
                    Some((sid, idx, f.clone()))
                } else {
                    None
                }
            })
            .collect();

        for i in 0..face_indices.len() {
            for j in (i + 1)..face_indices.len() {
                let (_, idx_a, ref f_a) = face_indices[i];
                let (_, idx_b, ref f_b) = face_indices[j];

                if f_a.surface_type == "Cylinder" && f_b.surface_type == "Cylinder" {
                    if let (Some(ax_a), Some(ax_b), Some(org_a), Some(org_b)) =
                        (f_a.axis, f_b.axis, f_a.origin, f_b.origin)
                    {
                        let cross_mag = ax_a.cross(ax_b).length();
                        let is_parallel = cross_mag < 1e-4 || (ax_a.cross(-ax_b).length() < 1e-4);
                        if is_parallel {
                            let diff = org_b - org_a;
                            let axis_norm = ax_a.normalize();
                            let perp_dist = diff.cross(axis_norm).length();
                            if perp_dist < 1e-3 {
                                self.graph.add_edge(
                                    idx_a,
                                    idx_b,
                                    BRepEdge::CoaxialCylinders {
                                        axis_dist: perp_dist,
                                        angle_rad: cross_mag.asin().abs(),
                                    },
                                );
                            }
                        }
                    }
                } else if f_a.surface_type == "Plane" && f_b.surface_type == "Plane" {
                    if let (Some(n_a), Some(n_b), Some(org_a), Some(org_b)) =
                        (f_a.normal, f_b.normal, f_a.origin, f_b.origin)
                    {
                        let dot = n_a.dot(n_b);
                        let diff = org_b - org_a;
                        let dist = (diff.dot(n_a)).abs();

                        if dot > 0.999 {
                            self.graph.add_edge(
                                idx_a,
                                idx_b,
                                BRepEdge::ParallelPlanes { distance: dist },
                            );
                        } else if dot < -0.999 {
                            self.graph.add_edge(
                                idx_a,
                                idx_b,
                                BRepEdge::OppositeNormals { distance: dist },
                            );
                        }
                    }
                }
            }
        }
    }

    pub fn find_coaxial_groups(&self) -> Vec<Vec<u32>> {
        let mut visited: HashMap<NodeIndex, bool> = HashMap::new();
        let mut groups = Vec::new();

        for &idx in self.face_map.values() {
            if visited.contains_key(&idx) {
                continue;
            }

            let mut group = Vec::new();
            let mut stack = vec![idx];
            visited.insert(idx, true);

            while let Some(curr) = stack.pop() {
                if let Some(BRepNode::Face(f)) = self.graph.node_weight(curr) {
                    if f.surface_type == "Cylinder" {
                        group.push(f.surface_id);
                    }
                }

                for edge in self.graph.edges_directed(curr, Direction::Outgoing) {
                    if let BRepEdge::CoaxialCylinders { .. } = edge.weight() {
                        let target = edge.target();
                        if !visited.contains_key(&target) {
                            visited.insert(target, true);
                            stack.push(target);
                        }
                    }
                }

                for edge in self.graph.edges_directed(curr, Direction::Incoming) {
                    if let BRepEdge::CoaxialCylinders { .. } = edge.weight() {
                        let source = edge.source();
                        if !visited.contains_key(&source) {
                            visited.insert(source, true);
                            stack.push(source);
                        }
                    }
                }
            }

            if group.len() > 1 {
                groups.push(group);
            }
        }

        groups
    }

    pub fn find_parallel_plane_pairs(
        &self,
        target_dist: f64,
        tolerance: f64,
    ) -> Vec<(u32, u32, f64)> {
        let mut pairs = Vec::new();
        for edge in self.graph.raw_edges() {
            if let BRepEdge::ParallelPlanes { distance } = edge.weight {
                if (distance - target_dist).abs() <= tolerance {
                    let s_node = self.graph.node_weight(edge.source());
                    let t_node = self.graph.node_weight(edge.target());
                    if let (Some(BRepNode::Face(fa)), Some(BRepNode::Face(fb))) = (s_node, t_node) {
                        pairs.push((fa.surface_id, fb.surface_id, distance));
                    }
                }
            }
        }
        pairs
    }

    pub fn find_opposite_pairs(
        &self,
        target_dist: f64,
        tolerance: f64,
    ) -> Vec<(u32, u32, f64)> {
        let mut pairs = Vec::new();
        for edge in self.graph.raw_edges() {
            if let BRepEdge::OppositeNormals { distance } = edge.weight {
                if (distance - target_dist).abs() <= tolerance {
                    let s_node = self.graph.node_weight(edge.source());
                    let t_node = self.graph.node_weight(edge.target());
                    if let (Some(BRepNode::Face(fa)), Some(BRepNode::Face(fb))) = (s_node, t_node) {
                        pairs.push((fa.surface_id, fb.surface_id, distance));
                    }
                }
            }
        }
        pairs
    }

    pub fn find_bolt_circle_patterns(&self, min_holes: usize) -> Vec<BoltCirclePattern> {
        let mut cyls: Vec<FaceNode> = Vec::new();
        for &idx in self.face_map.values() {
            if let Some(BRepNode::Face(f)) = self.graph.node_weight(idx) {
                if f.surface_type == "Cylinder" && f.is_internal {
                    cyls.push(f.clone());
                }
            }
        }

        let mut patterns = Vec::new();
        let mut matched: HashMap<u32, bool> = HashMap::new();

        for i in 0..cyls.len() {
            if matched.contains_key(&cyls[i].surface_id) {
                continue;
            }

            let c_i = &cyls[i];
            let r_i = c_i.radius.unwrap_or(0.0);
            let ax_i = match c_i.axis {
                Some(a) => a.normalize(),
                None => continue,
            };
            let org_i = match c_i.origin {
                Some(o) => o,
                None => continue,
            };

            let mut cluster = vec![c_i.surface_id];
            let mut origins = vec![org_i];

            for j in (i + 1)..cyls.len() {
                if matched.contains_key(&cyls[j].surface_id) {
                    continue;
                }
                let c_j = &cyls[j];
                let r_j = c_j.radius.unwrap_or(0.0);
                if (r_i - r_j).abs() > 0.05 {
                    continue;
                }

                let ax_j = match c_j.axis {
                    Some(a) => a.normalize(),
                    None => continue,
                };
                if ax_i.cross(ax_j).length() > 1e-3 && ax_i.cross(-ax_j).length() > 1e-3 {
                    continue;
                }

                let org_j = match c_j.origin {
                    Some(o) => o,
                    None => continue,
                };
                cluster.push(c_j.surface_id);
                origins.push(org_j);
            }

            if cluster.len() >= min_holes {
                let count = origins.len() as f64;
                let mean_center = origins.iter().fold(DVec3::ZERO, |acc, &p| acc + p) / count;
                let mut radii = Vec::with_capacity(origins.len());
                for p in &origins {
                    let diff = *p - mean_center;
                    let proj = diff - ax_i * diff.dot(ax_i);
                    radii.push(proj.length());
                }

                let avg_rad = radii.iter().sum::<f64>() / count;
                let max_dev = radii.iter().map(|&r| (r - avg_rad).abs()).fold(0.0f64, f64::max);

                if max_dev < 0.25 && avg_rad > r_i {
                    for &id in &cluster {
                        matched.insert(id, true);
                    }
                    patterns.push(BoltCirclePattern {
                        center: mean_center,
                        pcd_radius: avg_rad,
                        hole_radius: r_i,
                        hole_surface_ids: cluster,
                    });
                }
            }
        }

        patterns
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_coaxial_cylinders_detection() {
        let mut engine = BRepGraphEngine::new();

        engine.add_face(FaceNode {
            surface_id: 1,
            surface_type: "Cylinder".to_string(),
            area: 120.0,
            normal: None,
            axis: Some(DVec3::new(0.0, 0.0, 1.0)),
            origin: Some(DVec3::new(0.0, 0.0, 0.0)),
            radius: Some(10.0),
            is_internal: true,
            z_min: -10.0,
            z_max: 0.0,
        });

        engine.add_face(FaceNode {
            surface_id: 2,
            surface_type: "Cylinder".to_string(),
            area: 80.0,
            normal: None,
            axis: Some(DVec3::new(0.0, 0.0, 1.0)),
            origin: Some(DVec3::new(0.0, 0.0, -20.0)),
            radius: Some(5.0),
            is_internal: true,
            z_min: -30.0,
            z_max: -10.0,
        });

        engine.add_face(FaceNode {
            surface_id: 3,
            surface_type: "Cylinder".to_string(),
            area: 50.0,
            normal: None,
            axis: Some(DVec3::new(1.0, 0.0, 0.0)),
            origin: Some(DVec3::new(50.0, 0.0, 0.0)),
            radius: Some(4.0),
            is_internal: true,
            z_min: -4.0,
            z_max: 4.0,
        });

        engine.build_relations();
        let groups = engine.find_coaxial_groups();
        assert_eq!(groups.len(), 1);
        assert!(groups[0].contains(&1));
        assert!(groups[0].contains(&2));
        assert!(!groups[0].contains(&3));
    }

    #[test]
    fn test_parallel_and_opposite_planes() {
        let mut engine = BRepGraphEngine::new();

        engine.add_face(FaceNode {
            surface_id: 10,
            surface_type: "Plane".to_string(),
            area: 400.0,
            normal: Some(DVec3::new(0.0, 1.0, 0.0)),
            axis: None,
            origin: Some(DVec3::new(0.0, 10.0, 0.0)),
            radius: None,
            is_internal: false,
            z_min: 0.0,
            z_max: 20.0,
        });

        engine.add_face(FaceNode {
            surface_id: 11,
            surface_type: "Plane".to_string(),
            area: 400.0,
            normal: Some(DVec3::new(0.0, 1.0, 0.0)),
            axis: None,
            origin: Some(DVec3::new(0.0, 30.0, 0.0)),
            radius: None,
            is_internal: false,
            z_min: 0.0,
            z_max: 20.0,
        });

        engine.add_face(FaceNode {
            surface_id: 12,
            surface_type: "Plane".to_string(),
            area: 400.0,
            normal: Some(DVec3::new(0.0, -1.0, 0.0)),
            axis: None,
            origin: Some(DVec3::new(0.0, 50.0, 0.0)),
            radius: None,
            is_internal: false,
            z_min: 0.0,
            z_max: 20.0,
        });

        engine.build_relations();

        let par_pairs = engine.find_parallel_plane_pairs(20.0, 0.05);
        assert_eq!(par_pairs.len(), 1);
        let min_par_id = par_pairs[0].0.min(par_pairs[0].1);
        let max_par_id = par_pairs[0].0.max(par_pairs[0].1);
        assert_eq!(min_par_id, 10);
        assert_eq!(max_par_id, 11);
        assert!((par_pairs[0].2 - 20.0).abs() < 1e-4);

        let opp_pairs = engine.find_opposite_pairs(40.0, 0.05);
        assert_eq!(opp_pairs.len(), 1);
        let min_id = opp_pairs[0].0.min(opp_pairs[0].1);
        let max_id = opp_pairs[0].0.max(opp_pairs[0].1);
        assert_eq!(min_id, 10);
        assert_eq!(max_id, 12);
        assert!((opp_pairs[0].2 - 40.0).abs() < 1e-4);
    }

    #[test]
    fn test_bolt_circle_pattern() {
        let mut engine = BRepGraphEngine::new();

        let coords = [
            (201, DVec3::new(50.0, 0.0, 0.0)),
            (202, DVec3::new(0.0, 50.0, 0.0)),
            (203, DVec3::new(-50.0, 0.0, 0.0)),
            (204, DVec3::new(0.0, -50.0, 0.0)),
        ];

        for (sid, pos) in coords {
            engine.add_face(FaceNode {
                surface_id: sid,
                surface_type: "Cylinder".to_string(),
                area: 50.0,
                normal: None,
                axis: Some(DVec3::new(0.0, 0.0, 1.0)),
                origin: Some(pos),
                radius: Some(3.0),
                is_internal: true,
                z_min: -15.0,
                z_max: 0.0,
            });
        }

        let patterns = engine.find_bolt_circle_patterns(3);
        assert_eq!(patterns.len(), 1);
        let pat = &patterns[0];
        assert_eq!(pat.hole_surface_ids.len(), 4);
        assert!((pat.pcd_radius - 50.0).abs() < 0.1);
        assert!((pat.hole_radius - 3.0).abs() < 1e-4);
    }
}
