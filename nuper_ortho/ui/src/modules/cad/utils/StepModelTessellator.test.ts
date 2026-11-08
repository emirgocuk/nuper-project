import { describe, it, expect } from 'vitest';
import { StepModelTessellator } from './StepModelTessellator';
import type { CadMetadata } from '../../../types/generated/cad_metadata';

describe('StepModelTessellator', () => {
  it('buildFromMetadata OpenCASCADE B-Rep mesh ve özelliklerinden Three.js modeli üretir', () => {
    const positions = new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0]);
    const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
    const indices = new Uint32Array([0, 1, 2]);
    const edges = new Float32Array([0, 0, 0, 10, 0, 0]);

    const posB64 = Buffer.from(positions.buffer).toString('base64');
    const normB64 = Buffer.from(normals.buffer).toString('base64');
    const idxB64 = Buffer.from(indices.buffer).toString('base64');
    const edgeB64 = Buffer.from(edges.buffer).toString('base64');

    const meta: CadMetadata = {
      model_name: 'test_bracket.stp',
      file_format: 'step',
      vertex_count: 3,
      triangle_count: 1,
      kernel: 'OpenCASCADE 8.0 (OCP)',
      bbox: {
        min: [0, 0, 0],
        max: [10, 10, 5],
        size: [10, 10, 5],
      },
      features: [
        {
          id: 'CAD_HOLE_Ø4.00_1',
          feature_type: 'INTERNAL_CYLINDER',
          nominal_dimension: 4.0,
          center: [5, 5, 2.5],
          normal: [0, 0, 1],
          area_or_length: 31.4,
        },
        {
          id: 'CAD_PLANE_1',
          feature_type: 'PLANE',
          center: [5, 5, 0],
          normal: [0, 0, -1],
          area_or_length: 100,
        },
      ],
      mesh: {
        positions_b64: posB64,
        normals_b64: normB64,
        indices_b64: idxB64,
        edges_b64: edgeB64,
        linear_deflection: 0.05,
        faces: [{ id: 'FACE_1', surface_type: 'PLANE', triangle_start: 0, triangle_count: 1, area: 50 }],
      },
    };

    const res = StepModelTessellator.buildFromMetadata(meta, 'test_bracket.stp');

    expect(res.group).toBeDefined();
    expect(res.geometry).toBeDefined();
    expect(res.geometry?.attributes.position.count).toBe(3);
    expect(res.geometry?.attributes.normal.count).toBe(3);
    expect(res.geometry?.index?.count).toBe(3);

    expect(res.bbox.size).toEqual([10, 10, 5]);
    expect(res.detectedHoles.length).toBe(1);
    expect(res.detectedHoles[0].name).toBe('CAD_HOLE_Ø4.00_1');
    expect(res.detectedHoles[0].radius).toBe(2.0);

    expect(res.cadFeatures?.length).toBe(2);
    expect(res.cadFeatures?.[0].feature_type).toBe('INTERNAL_CYLINDER');
  });

  it('buildStepSolidModel metadata verildiğinde doğrudan B-Rep çekirdeğinden türetir', () => {
    const meta: CadMetadata = {
      model_name: 'sample.stp',
      file_format: 'step',
      vertex_count: 0,
      triangle_count: 0,
      bbox: { min: [0, 0, 0], max: [20, 10, 15], size: [20, 10, 15] },
      mesh: {
        positions_b64: Buffer.from(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]).buffer).toString('base64'),
        normals_b64: Buffer.from(new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]).buffer).toString('base64'),
        indices_b64: Buffer.from(new Uint32Array([0, 1, 2]).buffer).toString('base64'),
        edges_b64: '',
        linear_deflection: 0.05,
        faces: [],
      },
    };

    const res = StepModelTessellator.buildStepSolidModel('', 'sample.stp', meta);
    expect(res.group).toBeDefined();
    expect(res.bbox.size).toEqual([20, 10, 15]);
  });

  it('buildGenericStepModel STEP metnini okuyup bounding box ve delikleri üretir', () => {
    const mockStep = `
      #1=CARTESIAN_POINT('',(-10.0, 0.0, -15.0));
      #2=CARTESIAN_POINT('',(10.0, 20.0, 15.0));
      #3=CIRCLE('',#10, 2.5);
    `;
    const res = StepModelTessellator.buildGenericStepModel(mockStep, 'generic_part.stp');

    expect(res.group).toBeDefined();
    expect(res.bbox.size[0]).toBeGreaterThanOrEqual(10);
    expect(res.detectedHoles.length).toBe(1);
    expect(res.detectedHoles[0].radius).toBe(2.5);
  });

  it('soldaki duvar yüzeyinin (cx < 0) yaklaşma normalini dışarıya (-X) çevirir', () => {
    const positions = new Float32Array([
      -30, 0, -20, 30, 0, -20, 30, 0, 20,
      -30, 5, -20, 30, 5, -20, 30, 5, 20,
    ]);
    const normals = new Float32Array([
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
    ]);
    const indices = new Uint32Array([0, 1, 2, 3, 4, 5]);
    const meta: CadMetadata = {
      model_name: 'left_wall_plate.stp',
      file_format: 'step',
      vertex_count: 6,
      triangle_count: 2,
      bbox: { min: [-30, 0, -20], max: [30, 5, 20], size: [60, 5, 40] },
      features: [
        {
          id: 'CAD_STEP_DIST_16.00_1',
          feature_type: 'PLANE',
          nominal_dimension: 16.0,
          center: [-30, 2.5, 0],
          normal: [1, 0, 0],
          area_or_length: 16.0,
        },
      ],
      mesh: {
        positions_b64: Buffer.from(positions.buffer).toString('base64'),
        normals_b64: Buffer.from(normals.buffer).toString('base64'),
        indices_b64: Buffer.from(indices.buffer).toString('base64'),
        edges_b64: '',
        linear_deflection: 0.05,
        faces: [],
      },
    };

    const res = StepModelTessellator.buildFromMetadata(meta, 'left_wall_plate.stp');
    const feat = res.cadFeatures?.find((f) => f.id === 'CAD_STEP_DIST_16.00_1');
    expect(feat).toBeDefined();
    expect(feat?.normal?.[0]).toBeLessThan(0);
  });

  it('generates faceId and surfaceType vertex attributes for raycasting and selection', () => {
    const positions = new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0]);
    const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
    const indices = new Uint32Array([0, 1, 2]);

    const meta: CadMetadata = {
      model_name: 'test_face_id.stp',
      file_format: 'step',
      vertex_count: 3,
      triangle_count: 1,
      kernel: 'OpenCASCADE 8.0 (OCP)',
      bbox: { min: [0, 0, 0], max: [10, 10, 5], size: [10, 10, 5] },
      features: [],
      mesh: {
        positions_b64: Buffer.from(positions.buffer).toString('base64'),
        normals_b64: Buffer.from(normals.buffer).toString('base64'),
        indices_b64: Buffer.from(indices.buffer).toString('base64'),
        edges_b64: '',
        linear_deflection: 0.05,
        faces: [{ id: 'FACE_10', surface_type: 'CYLINDER', triangle_start: 0, triangle_count: 1, area: 42.5 }],
      },
    };

    const res = StepModelTessellator.buildFromMetadata(meta, 'test_face_id.stp');
    expect(res.geometry).toBeDefined();
    const faceIdAttr = res.geometry?.getAttribute('faceId');
    const surfaceTypeAttr = res.geometry?.getAttribute('surfaceType');

    expect(faceIdAttr).toBeDefined();
    expect(faceIdAttr?.getX(0)).toBe(1);
    expect(surfaceTypeAttr).toBeDefined();
    expect(surfaceTypeAttr?.getX(0)).toBe(2);
    expect(res.geometry?.userData.bRepFaces?.length).toBe(1);
    expect(res.geometry?.userData.bRepFaces[0].surfaceType).toBe('CYLINDER');
  });
});
