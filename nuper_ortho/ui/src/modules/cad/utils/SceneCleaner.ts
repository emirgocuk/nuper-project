import * as THREE from 'three';

/**
 * Nuper Ortho — WebGL / Three.js Bellek Sızıntısı ve Kaynak Temizleme Motoru
 * Kural 2 & 4 gereği: Sahneden kaldırılan tüm nesneler VRAM sızıntısını önlemek için
 * özyinelemeli (recursive) serbest bırakılır (dispose).
 */
export class SceneCleaner {
  public static disposeNode(node: THREE.Object3D | null | undefined): void {
    if (!node) return;

    // 1. Özyinelemeli olarak çocukları temizle ve sahneden kopar
    while (node.children.length > 0) {
      const child = node.children[0];
      this.disposeNode(child);
      node.remove(child);
    }

    // 2. Geometriyi serbest bırak
    if ('geometry' in node && node.geometry instanceof THREE.BufferGeometry) {
      node.geometry.dispose();
    }

    // 3. Materyalleri ve dokuları serbest bırak
    if ('material' in node && node.material) {
      const mat = (node as THREE.Mesh).material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => this.disposeMaterial(m));
      } else if (mat instanceof THREE.Material) {
        this.disposeMaterial(mat);
      }
    }
  }

  public static disposeMaterial(material: THREE.Material): void {
    if (!material) return;
    material.dispose();

    // Materyal üzerindeki olası tüm dokuları (textures) tespit edip serbest bırak
    const matRecord = material as unknown as Record<string, unknown>;
    for (const key of Object.keys(matRecord)) {
      const value = matRecord[key];
      if (value && typeof value === 'object' && 'isTexture' in value && (value as { isTexture: boolean }).isTexture) {
        (value as THREE.Texture).dispose();
      }
    }
  }

  public static cleanRenderer(renderer: THREE.WebGLRenderer): void {
    if (!renderer) return;
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  }
}
