export interface PalletSlotDto {
  slotId: number;
  row: number;
  col: number;
  originOffset: [number, number, number];
  isOccupied: boolean;
}

export interface PalletGridDto {
  rows: number;
  cols: number;
  baseOrigin: [number, number, number];
  deltaX: number;
  deltaY: number;
  slots: PalletSlotDto[];
}

export interface PalletPointDto {
  slotId: number;
  point: [number, number, number];
  normal?: [number, number, number];
  headAngleA?: number;
  headAngleB?: number;
}

export class PalletManager {
  public static createGrid(
    rows: number,
    cols: number,
    baseOrigin: [number, number, number] = [0, 0, 0],
    deltaX = 120.0,
    deltaY = 150.0
  ): PalletGridDto {
    const slots: PalletSlotDto[] = [];
    let slotId = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        slots.push({
          slotId,
          row: r,
          col: c,
          originOffset: [
            baseOrigin[0] + c * deltaX,
            baseOrigin[1] + r * deltaY,
            baseOrigin[2],
          ],
          isOccupied: true,
        });
        slotId++;
      }
    }

    return {
      rows,
      cols,
      baseOrigin,
      deltaX,
      deltaY,
      slots,
    };
  }

  public static setSlotOccupied(grid: PalletGridDto, slotId: number, occupied: boolean): void {
    const slot = grid.slots.find((s) => s.slotId === slotId);
    if (slot) {
      slot.isOccupied = occupied;
    }
  }

  public static transformToGlobal(
    grid: PalletGridDto,
    slotId: number,
    localPt: [number, number, number]
  ): [number, number, number] | null {
    const slot = grid.slots.find((s) => s.slotId === slotId);
    if (!slot) return null;
    return [
      slot.originOffset[0] + localPt[0],
      slot.originOffset[1] + localPt[1],
      slot.originOffset[2] + localPt[2],
    ];
  }

  public static groupCrossNestPlan<T extends { headAngleA?: number; headAngleB?: number }>(
    grid: PalletGridDto,
    singlePartElements: T[]
  ): { headAngleA: number; headAngleB: number; items: { slotId: number; item: T }[] }[] {
    const occupied = grid.slots.filter((s) => s.isOccupied);
    const orientationMap = new Map<string, { headAngleA: number; headAngleB: number; items: { slotId: number; item: T }[] }>();

    for (const el of singlePartElements) {
      const a = el.headAngleA ?? 0;
      const b = el.headAngleB ?? 0;
      const key = `A${a}_B${b}`;

      if (!orientationMap.has(key)) {
        orientationMap.set(key, {
          headAngleA: a,
          headAngleB: b,
          items: [],
        });
      }

      const group = orientationMap.get(key)!;
      for (const slot of occupied) {
        group.items.push({
          slotId: slot.slotId,
          item: el,
        });
      }
    }

    return Array.from(orientationMap.values());
  }
}
