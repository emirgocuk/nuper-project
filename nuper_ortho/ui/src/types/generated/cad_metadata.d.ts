export interface CadMetadata {
  model_name: string;
  file_path?: string;
  file_format: "step" | "stp" | "stl" | "obj";
  file_size_bytes?: number;
  
  kernel?: string;
  vertex_count: number;
  triangle_count: number;
  bbox: {
    
    min: [number, number, number];
    
    max: [number, number, number];
    
    size: [number, number, number];
    [k: string]: unknown;
  };
  features?: {
    id: string;
    feature_type: "PLANE" | "INTERNAL_CYLINDER" | "EXTERNAL_CYLINDER" | "CONE" | "SPHERE" | "TORUS" | "FREEFORM";
    
    nominal_dimension?: number;
    
    center?: [number, number, number];
    
    normal?: [number, number, number];
    area_or_length?: number;
    
    angular_span_deg?: number;
    description?: string;
    
    face_ids?: string[];
    axis?: "X" | "Y" | "Z";
    distance_type?: "INTERNAL_SLOT" | "EXTERNAL_WIDTH" | "STEP_HEIGHT" | "AXIS_DISTANCE";
    faceA_id?: string;
    faceB_id?: string;
    
    faceA_center?: [number, number, number];
    
    faceB_center?: [number, number, number];
    
    faceA_normal?: [number, number, number];
    
    faceB_normal?: [number, number, number];
    [k: string]: unknown;
  }[];
  
  mesh?: {
    
    positions_b64: string;
    
    normals_b64: string;
    
    indices_b64: string;
    
    edges_b64: string;
    linear_deflection: number;
    faces: {
      id: string;
      surface_type:
        | "PLANE"
        | "CYLINDER"
        | "CONE"
        | "SPHERE"
        | "TORUS"
        | "BSPLINE"
        | "BEZIER"
        | "REVOLUTION"
        | "EXTRUSION"
        | "OFFSET"
        | "OTHER";
      triangle_start: number;
      triangle_count: number;
      area?: number;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  alignment?: {
    base_plane_detected?: boolean;
    table_clearance_min_z?: number;
    
    orientation_matrix?: [number, number, number, number, number, number, number, number, number];
    [k: string]: unknown;
  };
  
  pmi?: {
    datums?: {
      label: string;
      target_type?: string;
      [k: string]: unknown;
    }[];
    tolerances?: {
      tolerance_type: string;
      magnitude: number;
      zone_unit?: string;
      datums?: string[];
      [k: string]: unknown;
    }[];
    dimensions?: {
      nominal_value: number;
      dimension_type?: string;
      upper_tolerance?: number;
      lower_tolerance?: number;
      [k: string]: unknown;
    }[];
    views?: {
      name: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
