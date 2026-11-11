import { describe, expect, it } from 'vitest';
import {
  parseBinaryTelemetry,
  parseTelemetryRingBuffer,
  STATUS_FLAGS,
  TELEMETRY_MAGIC,
  TELEMETRY_PACKET_SIZE,
} from './BinaryTelemetry';

function createMockPacketBuffer(
  flags: number = STATUS_FLAGS.MOVING | STATUS_FLAGS.IN_CONTACT,
  pos: [number, number, number] = [120.5, 45.2, -10.8],
  normal: [number, number, number] = [0.0, 0.0, 1.0],
  angles: [number, number] = [45.0, 90.0]
): ArrayBuffer {
  const buffer = new ArrayBuffer(TELEMETRY_PACKET_SIZE);
  const view = new DataView(buffer);

  view.setUint32(0, TELEMETRY_MAGIC, true);
  view.setUint32(4, flags, true);
  view.setBigUint64(8, 1700000000123456n, true);

  view.setFloat64(16, pos[0], true);
  view.setFloat64(24, pos[1], true);
  view.setFloat64(32, pos[2], true);

  view.setFloat64(40, normal[0], true);
  view.setFloat64(48, normal[1], true);
  view.setFloat64(56, normal[2], true);

  view.setFloat64(64, angles[0], true);
  view.setFloat64(72, angles[1], true);

  return buffer;
}

describe('BinaryTelemetry zero-copy parser (Faz 9)', () => {
  it('80 baytlık ikili paketi doğrudan ayrıştırır ve alanları doğrular', () => {
    const buffer = createMockPacketBuffer();
    const data = parseBinaryTelemetry(buffer);

    expect(data).not.toBeNull();
    if (!data) return;

    expect(data.timestampNs).toBe(1700000000123456n);
    expect(data.probePos).toEqual([120.5, 45.2, -10.8]);
    expect(data.probeNormal).toEqual([0.0, 0.0, 1.0]);
    expect(data.headA).toBe(45.0);
    expect(data.headB).toBe(90.0);
    expect(data.isMoving).toBe(true);
    expect(data.isInContact).toBe(true);
    expect(data.isTriggered).toBe(false);
    expect(data.isEstop).toBe(false);
  });

  it('Geçersiz magic baytı olan bozuk paketleri reddeder', () => {
    const buffer = createMockPacketBuffer();
    const view = new DataView(buffer);
    view.setUint32(0, 0x12345678, true);

    const data = parseBinaryTelemetry(buffer);
    expect(data).toBeNull();
  });

  it('Çoklu paket içeren halka arabelleğini (ring buffer) sıfır kopyayla çözer', () => {
    const totalPackets = 10;
    const multiBuffer = new ArrayBuffer(TELEMETRY_PACKET_SIZE * totalPackets);

    for (let i = 0; i < totalPackets; i++) {
      const single = createMockPacketBuffer(
        STATUS_FLAGS.MOVING,
        [i * 10, i * 20, i * 5],
        [0, 0, 1],
        [0, 0]
      );
      new Uint8Array(multiBuffer).set(
        new Uint8Array(single),
        i * TELEMETRY_PACKET_SIZE
      );
    }

    const packets = parseTelemetryRingBuffer(multiBuffer);
    expect(packets.length).toBe(10);
    expect(packets[3].probePos).toEqual([30, 60, 15]);
  });
});
