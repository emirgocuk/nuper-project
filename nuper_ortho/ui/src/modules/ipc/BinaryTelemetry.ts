export const TELEMETRY_MAGIC = 0x4e555052;
export const TELEMETRY_PACKET_SIZE = 80;

export const STATUS_FLAGS = {
  MOVING: 0x01,
  IN_CONTACT: 0x02,
  TRIGGERED: 0x04,
  ESTOP: 0x08,
} as const;

export interface TelemetryData {
  timestampNs: bigint;
  probePos: [number, number, number];
  probeNormal: [number, number, number];
  headA: number;
  headB: number;
  statusFlags: number;
  isMoving: boolean;
  isInContact: boolean;
  isTriggered: boolean;
  isEstop: boolean;
}

export function parseBinaryTelemetry(
  buffer: ArrayBuffer,
  byteOffset: number = 0
): TelemetryData | null {
  if (buffer.byteLength - byteOffset < TELEMETRY_PACKET_SIZE) {
    return null;
  }

  const view = new DataView(buffer, byteOffset, TELEMETRY_PACKET_SIZE);
  const magic = view.getUint32(0, true);
  if (magic !== TELEMETRY_MAGIC) {
    return null;
  }

  const statusFlags = view.getUint32(4, true);
  const timestampNs = view.getBigUint64(8, true);

  const px = view.getFloat64(16, true);
  const py = view.getFloat64(24, true);
  const pz = view.getFloat64(32, true);

  const nx = view.getFloat64(40, true);
  const ny = view.getFloat64(48, true);
  const nz = view.getFloat64(56, true);

  const headA = view.getFloat64(64, true);
  const headB = view.getFloat64(72, true);

  return {
    timestampNs,
    probePos: [px, py, pz],
    probeNormal: [nx, ny, nz],
    headA,
    headB,
    statusFlags,
    isMoving: (statusFlags & STATUS_FLAGS.MOVING) !== 0,
    isInContact: (statusFlags & STATUS_FLAGS.IN_CONTACT) !== 0,
    isTriggered: (statusFlags & STATUS_FLAGS.TRIGGERED) !== 0,
    isEstop: (statusFlags & STATUS_FLAGS.ESTOP) !== 0,
  };
}

export function parseTelemetryRingBuffer(
  buffer: ArrayBuffer,
  maxPackets: number = 1000
): TelemetryData[] {
  const count = Math.min(
    Math.floor(buffer.byteLength / TELEMETRY_PACKET_SIZE),
    maxPackets
  );
  const packets: TelemetryData[] = [];

  for (let i = 0; i < count; i++) {
    const parsed = parseBinaryTelemetry(buffer, i * TELEMETRY_PACKET_SIZE);
    if (parsed) {
      packets.push(parsed);
    }
  }

  return packets;
}
