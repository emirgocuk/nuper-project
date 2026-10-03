import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { SceneCleaner } from './SceneCleaner';

describe('SceneCleaner (WebGL / Three.js VRAM ve Kaynak Temizleme)', () => {
  it('null veya undefined nesneleri hatasız atlar', () => {
    expect(() => SceneCleaner.disposeNode(null)).not.toThrow();
    expect(() => SceneCleaner.disposeNode(undefined)).not.toThrow();
  });

  it('Mesh geometrisini ve materyalini dispose eder', () => {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const mesh = new THREE.Mesh(geometry, material);

    const geoDisposeSpy = vi.spyOn(geometry, 'dispose');
    const matDisposeSpy = vi.spyOn(material, 'dispose');

    SceneCleaner.disposeNode(mesh);

    expect(geoDisposeSpy).toHaveBeenCalledOnce();
    expect(matDisposeSpy).toHaveBeenCalledOnce();
  });

  it('Çoklu materyalli (array) Mesh nesnelerini eksiksiz dispose eder', () => {
    const geometry = new THREE.BufferGeometry();
    const mat1 = new THREE.MeshBasicMaterial();
    const mat2 = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, [mat1, mat2]);

    const mat1Spy = vi.spyOn(mat1, 'dispose');
    const mat2Spy = vi.spyOn(mat2, 'dispose');

    SceneCleaner.disposeNode(mesh);

    expect(mat1Spy).toHaveBeenCalledOnce();
    expect(mat2Spy).toHaveBeenCalledOnce();
  });

  it('Hiyerarşik sahne ağacındaki tüm çocukları özyinelemeli temizler ve sahneden koparır', () => {
    const parent = new THREE.Group();
    const childGroup = new THREE.Group();
    const leafGeo = new THREE.SphereGeometry(5);
    const leafMat = new THREE.MeshLambertMaterial();
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);

    childGroup.add(leafMesh);
    parent.add(childGroup);

    const geoSpy = vi.spyOn(leafGeo, 'dispose');
    const matSpy = vi.spyOn(leafMat, 'dispose');

    expect(parent.children.length).toBe(1);
    expect(childGroup.children.length).toBe(1);

    SceneCleaner.disposeNode(parent);

    expect(geoSpy).toHaveBeenCalledOnce();
    expect(matSpy).toHaveBeenCalledOnce();
    expect(parent.children.length).toBe(0);
  });

  it('Materyale bağlı dokuları (texture) tespit edip dispose eder', () => {
    const texture = new THREE.Texture();
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const texDisposeSpy = vi.spyOn(texture, 'dispose');
    const matDisposeSpy = vi.spyOn(material, 'dispose');

    SceneCleaner.disposeMaterial(material);

    expect(matDisposeSpy).toHaveBeenCalledOnce();
    expect(texDisposeSpy).toHaveBeenCalledOnce();
  });

  it('cleanRenderer ile renderer.dispose ve forceContextLoss tetikler', () => {
    const mockRenderer = {
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
      domElement: {
        parentElement: {
          removeChild: vi.fn(),
        },
      },
    } as unknown as THREE.WebGLRenderer;

    SceneCleaner.cleanRenderer(mockRenderer);

    expect(mockRenderer.dispose).toHaveBeenCalledOnce();
    expect(mockRenderer.forceContextLoss).toHaveBeenCalledOnce();
  });
});
