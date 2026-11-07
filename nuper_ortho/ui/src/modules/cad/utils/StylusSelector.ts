export const DEFAULT_STYLUS_BALL_MM = 2.0;
export const FALLBACK_STYLUS_BALL_MM = 1.0;
export const MAX_BALL_TO_HOLE_RATIO = 0.6;

export interface StylusChoice {
  ballDiameterMm: number;
  feasible: boolean;
  changedFromDefault: boolean;
}

export function selectStylusForHole(holeDiameterMm: number): StylusChoice {
  const fits = (ball: number): boolean => ball <= holeDiameterMm * MAX_BALL_TO_HOLE_RATIO;

  if (fits(DEFAULT_STYLUS_BALL_MM)) {
    return { ballDiameterMm: DEFAULT_STYLUS_BALL_MM, feasible: true, changedFromDefault: false };
  }
  return {
    ballDiameterMm: FALLBACK_STYLUS_BALL_MM,
    feasible: fits(FALLBACK_STYLUS_BALL_MM),
    changedFromDefault: true,
  };
}
