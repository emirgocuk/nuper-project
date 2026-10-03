import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NuperApp } from '../../main';
import type { DrawingExtractionResult } from '../../types/generated/drawing_data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..', '..');

describe('Hızlı Dev Modu ve Mock Veri Okuma (FAZ 4 / Ara Faz 4.3)', () => {
  it('Statik .dev/mocks/aski_kancasi.json verisini okur ve şemaya uygun teyit eder', () => {
    const filePath = path.resolve(rootDir, '.dev', 'mocks', 'aski_kancasi.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const mockData = JSON.parse(raw) as DrawingExtractionResult;

    expect(mockData.success).toBe(true);
    expect(mockData.filename).toBe('050-164849-000 - Kopya.pdf');
    expect(mockData.title_block.part_number).toBe('050-164849-000');
    expect(mockData.datums).toEqual(['A', 'B', 'C']);
    expect(mockData.dimensions.length).toBe(3);
  });

  it('Statik .dev/mocks/avionic_panel.json verisini okur ve şemaya uygun teyit eder', () => {
    const filePath = path.resolve(rootDir, '.dev', 'mocks', 'avionic_panel.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const mockData = JSON.parse(raw) as DrawingExtractionResult;

    expect(mockData.success).toBe(true);
    expect(mockData.filename).toBe('DACP_Avionic_Panel.pdf');
    expect(mockData.title_block.part_number).toBe('DACP-AV-002');
    expect(mockData.dimensions.length).toBe(2);
  });

  it('NuperApp sınıfı mock verisini yükler ve balonları kanvasa aktarır', () => {
    const filePath = path.resolve(rootDir, '.dev', 'mocks', 'aski_kancasi.json');
    const mockData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as DrawingExtractionResult;

    const app = new NuperApp();
    expect(app.getCADViewer()).toBeDefined();
    expect(app.getDrawingCanvas()).toBeDefined();

    expect(() => app.loadSampleData(mockData)).not.toThrow();
    app.destroy();
  });
});
