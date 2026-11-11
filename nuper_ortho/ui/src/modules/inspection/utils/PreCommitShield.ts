export interface ContractValidationResult {
  valid: boolean;
  unauthorizedKeys: string[];
  missingRequired: string[];
  unresolvedAssumptions: string[];
}

export interface DimensionContractInput {
  id?: number;
  balloon: string;
  nominal?: number;
  upper_tol?: string;
  lower_tol?: string;
  tolerance_source?: string;
  [key: string]: unknown;
}

export class PreCommitShield {
  public static checkContract(
    payload: Record<string, unknown>,
    allowedRootKeys: string[],
    requiredRootKeys: string[] = []
  ): ContractValidationResult {
    const rootKeys = Object.keys(payload);
    const unauthorizedKeys = rootKeys.filter((k) => !allowedRootKeys.includes(k));
    const missingRequired = requiredRootKeys.filter((k) => !(k in payload));

    const dimensions = Array.isArray(payload.dimensions)
      ? (payload.dimensions as DimensionContractInput[])
      : [];

    const unresolvedAssumptions = this.auditSilentAssumptions(dimensions);

    return {
      valid: unauthorizedKeys.length === 0 && missingRequired.length === 0 && unresolvedAssumptions.length === 0,
      unauthorizedKeys,
      missingRequired,
      unresolvedAssumptions,
    };
  }

  public static auditSilentAssumptions(
    dimensions: DimensionContractInput[],
    generalToleranceStandard?: string
  ): string[] {
    const flaggedBalloons: string[] = [];

    for (const d of dimensions) {
      const utol = String(d.upper_tol ?? '').trim();
      const ltol = String(d.lower_tol ?? '').trim();
      const source = d.tolerance_source;

      const isDefaultPm01 = (utol === '0.1' || utol === '+0.1') && (ltol === '-0.1' || ltol === '0.1');
      const isZeroOrEmpty = (!utol || utol === '0' || utol === '0.0') && (!ltol || ltol === '0' || ltol === '0.0');

      const hasLegitSource = source && [
        'DRAWING_EXPLICIT',
        'ISO_2768_MK',
        'ISO_2768_FH',
        'ISO_2768_M',
        'ISO_2768_F',
        'ASME_Y14_5',
        'TITLE_BLOCK_DEFAULT',
      ].includes(source);

      if (!hasLegitSource && !generalToleranceStandard && (isDefaultPm01 || isZeroOrEmpty)) {
        flaggedBalloons.push(d.balloon);
      }
    }

    return flaggedBalloons;
  }
}
