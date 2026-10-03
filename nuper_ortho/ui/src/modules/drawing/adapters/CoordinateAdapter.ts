export interface PDFPoint {
  x: number;
  y: number;
  pageHeight: number;
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Nuper Ortho — Sınır Katmanı Koordinat Dönüştürücüsü (Boundary Adapter)
 * Kural 5 gereği: Ham koordinat sistemleri çekirdek modüllere sızamaz;
 * giriş ve çıkış anında sınır adaptöründe dönüştürülür.
 */
export class CoordinateAdapter {
  /**
   * PDF sol-alt orijinli (points) koordinatı Canvas sol-üst orijinli (piksel) koordinata çevirir.
   */
  public static pdfToCanvas(point: PDFPoint, zoom: number): CanvasPoint {
    return {
      x: point.x * zoom,
      y: (point.pageHeight - point.y) * zoom
    };
  }

  /**
   * Canvas piksel koordinatını PDF points koordinatına geri çevirir.
   */
  public static canvasToPdf(canvasPoint: CanvasPoint, pageHeight: number, zoom: number): PDFPoint {
    const scale = zoom > 0 ? zoom : 1;
    return {
      x: canvasPoint.x / scale,
      y: pageHeight - (canvasPoint.y / scale),
      pageHeight
    };
  }

  /**
   * CAD standardı Z-Yukarı koordinat sistemini Three.js standardı Y-Yukarı sistemine çevirir.
   * CAD: [X_right, Y_depth, Z_up] -> Three.js: [X_right, Z_up -> Y, -Y_depth -> Z]
   */
  public static cadToThree(cadPoint: Vector3D): Vector3D {
    return {
      x: cadPoint.x,
      y: cadPoint.z,
      z: -cadPoint.y
    };
  }

  /**
   * Three.js Y-Yukarı koordinat sistemini CAD Z-Yukarı sistemine geri çevirir.
   */
  public static threeToCad(threePoint: Vector3D): Vector3D {
    return {
      x: threePoint.x,
      y: -threePoint.z,
      z: threePoint.y
    };
  }
}
