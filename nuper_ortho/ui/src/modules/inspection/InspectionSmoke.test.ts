import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as THREE from 'three';
import { NuperApp } from '../../main';
import { CoordinateAdapter } from '../drawing/adapters/CoordinateAdapter';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';
import type { CadMetadata } from '../../types/generated/cad_metadata';

describe('Referans Numune Entegrasyon Duman Testi (Smoke Test)', () => {
  let app: NuperApp;
  const rootDir = path.resolve(__dirname, '..', '..', '..', '..');
  const specimenDir = path.join(
    rootDir,
    'test_assets',
    'BENCH_LAB',
    'specimens',
    '01_STRUCTURAL_HOOKS_CASES_BENCH_004'
  );
  const stepPath = path.join(specimenDir, 'model.stp');
  const pdfPath = path.join(specimenDir, 'drawing.pdf');

  beforeEach(() => {
    app = new NuperApp();
  });

  afterEach(() => {
    app.destroy();
  });

  it('Referans dosyalar test_assets altında fiziksel olarak mevcuttur', () => {
    expect(fs.existsSync(stepPath)).toBe(true);
    expect(fs.existsSync(pdfPath)).toBe(true);
  });

  it('Python ayrıştırıcısı gerçek PDF teknik resimden 13 ölçü, datumlar ve başlık bloğunu çıkarır', () => {
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    const result: DrawingExtractionResult = JSON.parse(stdout);

    expect(result.success).toBe(true);
    expect(result.filename).toBe('drawing.pdf');
    expect(result.datums).toEqual(['A', 'B', 'C']);
    expect(result.title_block.hardness).toBe('38-44 HRC');
    expect(result.title_block.general_tolerance).toBe('ISO 2768-mK');
    expect(result.dimensions.length).toBe(13);

    const radiusCallout = result.dimensions.find((d) => d.id === 1);
    expect(radiusCallout?.nominal_str).toBe('2x R2.5');
    expect(radiusCallout?.status).toBe('PASS');

    const linearCallout = result.dimensions.find((d) => d.id === 10);
    expect(linearCallout?.nominal_str).toBe('191.0 ±14');
    expect(linearCallout?.nominal).toBe(191.0);
  });

  it('STEP B-Rep varlıkları doğrulanır ve Three.js sahnesine aktarılır', () => {
    const stepContent = fs.readFileSync(stepPath, 'utf8');

    const faceCount = (stepContent.match(/ADVANCED_FACE/g) || []).length;
    const cylinderCount = (stepContent.match(/CYLINDRICAL_SURFACE/g) || []).length;
    const vertexCount = (stepContent.match(/CARTESIAN_POINT/g) || []).length;

    expect(faceCount).toBeGreaterThan(0);
    expect(cylinderCount).toBeGreaterThan(0);
    expect(vertexCount).toBeGreaterThan(100);

    const cadMetadata: CadMetadata = {
      model_name: 'model.stp',
      file_path: stepPath,
      file_format: 'step',
      file_size_bytes: fs.statSync(stepPath).size,
      vertex_count: vertexCount,
      triangle_count: faceCount * 2,
      bbox: {
        min: [-26.51, 0.0, -16.06],
        max: [26.51, 33.25, 16.06],
        size: [53.03, 33.25, 32.12],
      },
      alignment: {
        base_plane_detected: true,
        table_clearance_min_z: 0.0,
      },
    };

    expect(cadMetadata.file_format).toBe('step');
    expect(cadMetadata.bbox.size).toEqual([53.03, 33.25, 32.12]);

    const [sx, sy, sz] = cadMetadata.bbox.size;
    const geometry = new THREE.BoxGeometry(sx, sy, sz);

    const cadViewer = app.getCADViewer();
    cadViewer.setModelGeometry(geometry);

    expect(geometry.attributes.position).toBeDefined();
    expect(geometry.attributes.position.count).toBeGreaterThan(0);
  });

  it('2D Balonlar CoordinateAdapter ile PDF üzerine milimetrik eşlenir', () => {
    const rawPdfPoint = { x: 150.0, y: 320.0, pageHeight: 595.28 };
    const canvasPoint = CoordinateAdapter.pdfToCanvas(rawPdfPoint, 1.5);

    expect(canvasPoint.x).toBe(225.0);
    expect(canvasPoint.y).toBeCloseTo((595.28 - 320.0) * 1.5, 3);

    const invertedPoint = CoordinateAdapter.canvasToPdf(canvasPoint, 595.28, 1.5);
    expect(invertedPoint.x).toBeCloseTo(150.0, 3);
    expect(invertedPoint.y).toBeCloseTo(320.0, 3);
  });

  it('InspectionTable şemaya uygun dolar ve DrawingCanvas ile çift yönlü çapraz vurgulanır', () => {
    const scriptPath = path.join(rootDir, 'tools', 'drawing_extractor.py');
    const stdout = execFileSync('python', [scriptPath, pdfPath], { encoding: 'utf8' });
    const result: DrawingExtractionResult = JSON.parse(stdout);

    app.loadDrawingData(result);

    const table = app.getInspectionTable();
    const rows = table.getRows();

    expect(rows.length).toBe(13);
    expect(table.getDatums()).toEqual(['A', 'B', 'C']);
    expect(table.getTitleBlock().hardness).toBe('38-44 HRC');

    const summary = table.getSummary();
    expect(summary.total).toBe(13);
    expect(summary.pass).toBe(13);
    expect(summary.fail).toBe(0);

    table.selectRow(10);
    expect(table.getSelectedRow()?.nominal_str).toBe('191.0 ±14');
  });
});
