export interface PH10Angle {
  aDeg: number;
  bDeg: number;
  direction: [number, number, number];
  label: string;
}

export interface AngleMatchResult {
  angle: PH10Angle;
  angularErrorDeg: number;
}

export class Ph10Kinematics {
  private static cachedLut: PH10Angle[] | null = null;

  public static computeDirection(aDeg: number, bDeg: number): [number, number, number] {
    const aRad = (aDeg * Math.PI) / 180.0;
    const bRad = (bDeg * Math.PI) / 180.0;

    const x = Math.sin(aRad) * Math.sin(bRad);
    const y = -Math.sin(aRad) * Math.cos(bRad);
    const z = -Math.cos(aRad);

    const len = Math.hypot(x, y, z) || 1.0;
    return [
      parseFloat((x / len).toFixed(6)),
      parseFloat((y / len).toFixed(6)),
      parseFloat((z / len).toFixed(6)),
    ];
  }

  public static getLookUpTable(): readonly PH10Angle[] {
    if (!this.cachedLut) {
      const angles: PH10Angle[] = [];
      const aSteps = 15;
      const bSteps = 48;

      for (let i = 0; i <= aSteps; i++) {
        const aDeg = i * 7.5;
        for (let j = 0; j < bSteps; j++) {
          const bDeg = -180.0 + j * 7.5;
          const direction = this.computeDirection(aDeg, bDeg);
          angles.push({
            aDeg,
            bDeg,
            direction,
            label: `A${aDeg}° B${bDeg}°`,
          });
        }
      }
      this.cachedLut = angles;
    }
    return this.cachedLut;
  }

  public static findBestAngle(approachVector: [number, number, number]): AngleMatchResult {
    const len = Math.hypot(approachVector[0], approachVector[1], approachVector[2]);
    if (len < 1e-6) {
      return {
        angle: { aDeg: 0, bDeg: 0, direction: [0, 0, -1], label: 'A0° B0°' },
        angularErrorDeg: 0,
      };
    }

    const nx = approachVector[0] / len;
    const ny = approachVector[1] / len;
    const nz = approachVector[2] / len;

    const lut = this.getLookUpTable();
    let bestAngle = lut[0];
    let maxDot = -Infinity;

    for (const cand of lut) {
      const dot = cand.direction[0] * nx + cand.direction[1] * ny + cand.direction[2] * nz;
      if (dot > maxDot) {
        maxDot = dot;
        bestAngle = cand;
      }
    }

    const clampedDot = Math.max(-1.0, Math.min(1.0, maxDot));
    const errorDeg = parseFloat(((Math.acos(clampedDot) * 180.0) / Math.PI).toFixed(2));

    if (bestAngle.aDeg === 0) {
      return {
        angle: { aDeg: 0, bDeg: 0, direction: [0, 0, -1], label: 'A0° B0°' },
        angularErrorDeg: errorDeg,
      };
    }

    return {
      angle: bestAngle,
      angularErrorDeg: errorDeg,
    };
  }

  public static clusterFeaturesByAngle<T>(
    items: T[],
    getApproachVector: (item: T) => [number, number, number]
  ): Map<string, { angle: PH10Angle; items: T[] }> {
    const clusterMap = new Map<string, { angle: PH10Angle; items: T[] }>();

    for (const item of items) {
      const vec = getApproachVector(item);
      const match = this.findBestAngle(vec);
      const key = match.angle.label;

      const existing = clusterMap.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        clusterMap.set(key, {
          angle: match.angle,
          items: [item],
        });
      }
    }

    return clusterMap;
  }
}
