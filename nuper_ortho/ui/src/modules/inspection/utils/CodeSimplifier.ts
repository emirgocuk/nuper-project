export interface SimplificationReport {
  rule: string;
  line: number;
  message: string;
  suggestion: string;
}

export class CodeSimplifier {
  public static scanForRedundantWrappers(code: string): SimplificationReport[] {
    const reports: SimplificationReport[] = [];
    const lines = code.split(/\r?\n/);

    const wrapperRegex = /^\s*(?:export\s+)?function\s+(\w+)\s*\([^)]*\)\s*:\s*[^{]+\s*\{\s*return\s+(\w+)\([^)]*\);\s*\}\s*$/;

    lines.forEach((line, idx) => {
      const match = line.match(wrapperRegex);
      if (match) {
        const [, wrapperName, targetName] = match;
        reports.push({
          rule: 'YAGNI_TRIVIAL_WRAPPER',
          line: idx + 1,
          message: `'${wrapperName}' tek satırlık bir sarmalayıcı (wrapper) fonksiyondur.`,
          suggestion: `'${targetName}' fonksiyonunu doğrudan çağırınız.`,
        });
      }
    });

    return reports;
  }

  public static calculatePonytailIndex(
    loc: number,
    abstractionsCount: number,
    stdlibUsageRatio: number
  ): number {
    if (loc <= 0) return 100.0;
    const abstractionDensity = (abstractionsCount / loc) * 1000.0;
    const penalty = Math.max(0, abstractionDensity - 5.0) * 2.5;
    const bonus = stdlibUsageRatio * 20.0;
    const score = Math.max(0, Math.min(100, 80.0 - penalty + bonus));
    return parseFloat(score.toFixed(1));
  }
}
