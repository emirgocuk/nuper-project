import { describe, it, expect } from 'vitest';
import { PRECISION, isEqual, isZero, isVectorEqual } from './precision';
import { CoordinateAdapter } from '../../drawing/adapters/CoordinateAdapter';
import * as THREE from 'three';
import { SceneCleaner } from '../../cad/utils/SceneCleaner';

describe('Sayısal Hassasiyet ve EPSILON Kontrolleri (Kural 5)', () => {
  it('0.1 mikron doğrusal hassasiyet toleransını (EPSILON_LINEAR) doğrular', () => {
    expect(PRECISION.EPSILON_LINEAR).toBe(1e-4);
    // 0.1 + 0.2 floating point hatasını yakalar ve eşit kabul eder
    expect(isEqual(0.1 + 0.2, 0.3)).toBe(true);
    // 0.00005 farkı tolerans dahilinde kabul eder
    expect(isEqual(10.00005, 10.0)).toBe(true);
    // 0.0005 farkı tolerans dışı (farklı) kabul eder
    expect(isEqual(10.0005, 10.0)).toBe(false);
  });

  it('Sıfır denetimini tolerans ile doğrular', () => {
    expect(isZero(0.00001)).toBe(true);
    expect(isZero(0.001)).toBe(false);
  });

  it('3D Vektör eşitliğini tolerans ile doğrular', () => {
    expect(isVectorEqual([1.0, 2.00004, 3.0], [1.0, 2.0, 3.0])).toBe(true);
    expect(isVectorEqual([1.0, 2.001, 3.0], [1.0, 2.0, 3.0])).toBe(false);
  });
});

describe('Sınır Katmanı Koordinat Adaptörü (Kural 5 & Boundary Adapter)', () => {
  it('PDF sol-alt koordinatını Canvas sol-üst koordinatına doğru ters çevirir', () => {
    const pdfPoint = { x: 50, y: 100, pageHeight: 800 };
    const canvasPoint = CoordinateAdapter.pdfToCanvas(pdfPoint, 1.5);
    // X: 50 * 1.5 = 75
    // Y: (800 - 100) * 1.5 = 700 * 1.5 = 1050
    expect(canvasPoint.x).toBe(75);
    expect(canvasPoint.y).toBe(1050);

    // Geriye dönüştürme (Canvas -> PDF)
    const inverted = CoordinateAdapter.canvasToPdf(canvasPoint, 800, 1.5);
    expect(isEqual(inverted.x, 50)).toBe(true);
    expect(isEqual(inverted.y, 100)).toBe(true);
  });

  it('CAD Z-Yukarı eksenini Three.js Y-Yukarı eksenine dönüştürür', () => {
    const cad = { x: 10, y: 20, z: 30 };
    const three = CoordinateAdapter.cadToThree(cad);
    expect(three.x).toBe(10);
    expect(three.y).toBe(30);
    expect(three.z).toBe(-20);

    const backToCad = CoordinateAdapter.threeToCad(three);
    expect(backToCad.x).toBe(10);
    expect(backToCad.y).toBe(20);
    expect(backToCad.z).toBe(30);
  });
});

describe('WebGL / Three.js Bellek Temizleme Motoru (SceneCleaner - Kural 2)', () => {
  it('Sahnedeki mesh, geometry ve materyalleri sızıntı bırakmadan dispose eder', () => {
    const scene = new THREE.Scene();
    const geom = new THREE.BoxGeometry(10, 10, 10);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    expect(scene.children.length).toBe(1);

    // SceneCleaner çalıştır
    SceneCleaner.disposeNode(scene);

    // Çocuklar tamamen temizlenmeli
    expect(scene.children.length).toBe(0);
  });
});
