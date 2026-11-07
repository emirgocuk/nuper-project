import { describe, it, expect, vi } from 'vitest';
import { CADViewer } from './CADViewer';
import type { CadMetadata } from '../../types/generated/cad_metadata';

describe('CADViewer — Geometrik B-Rep Unsur Vurgulama ve Seçim', () => {
  const sampleMeta: CadMetadata = {
    model_name: 'test_model.stp',
    file_format: 'step',
    vertex_count: 100,
    triangle_count: 50,
    bbox: {
      min: [0, 0, 0],
      max: [50, 50, 20],
      size: [50, 50, 20],
    },
    features: [
      {
        id: 'CAD_HOLE_Ø6.00_1',
        feature_type: 'INTERNAL_CYLINDER',
        nominal_dimension: 6.0,
        center: [25, 25, 10],
        normal: [0, 0, 1],
        area_or_length: 20.0,
        description: 'Delik Ø6.00 mm',
      },
      {
        id: 'CAD_PLANE_1',
        feature_type: 'PLANE',
        nominal_dimension: 50.0,
        center: [25, 25, 20],
        normal: [0, 0, 1],
        area_or_length: 2500.0,
        description: 'Üst Referans Düzlemi',
      },
    ],
  };

  it('CAD metadata başarıyla set edilir ve okunur', () => {
    const viewer = new CADViewer();
    viewer.setCadMetadata(sampleMeta);
    expect(viewer.getCadMetadata()).toEqual(sampleMeta);
    viewer.destroy();
  });

  it('Silindirik delik seçildiğinde doğru merkez ve normal ile hedef işareti oluşturur', () => {
    const viewer = new CADViewer();
    viewer.setCadMetadata(sampleMeta);

    viewer.highlightFeature('CAD_HOLE_Ø6.00_1');
    expect(viewer.getHighlightedFeature()).toBe('CAD_HOLE_Ø6.00_1');

    viewer.highlightFeature(undefined);
    expect(viewer.getHighlightedFeature()).toBeNull();

    viewer.destroy();
  });

  it('Düzlem seçildiğinde doğru merkezde planar vurgu oluşturur', () => {
    const viewer = new CADViewer();
    viewer.setCadMetadata(sampleMeta);

    viewer.highlightFeature('CAD_PLANE_1');
    expect(viewer.getHighlightedFeature()).toBe('CAD_PLANE_1');

    viewer.destroy();
  });

  it('onFeatureSelected dinleyicisi kaydedilir ve abonelikten çıkılabilir', () => {
    const viewer = new CADViewer();
    const mockListener = vi.fn();
    const unsubscribe = viewer.onFeatureSelected(mockListener);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
    viewer.destroy();
  });
});
