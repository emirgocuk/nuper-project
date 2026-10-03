import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { SimulationController, SUPPORTED_SPEEDS } from './SimulationController';
import { CADViewer } from './CADViewer';

describe('Simülasyon Oynatma Hızı Kontrolü (SimulationController)', () => {
  let controller: SimulationController;

  beforeEach(() => {
    controller = new SimulationController();
  });

  it('Varsayılan oynatma hızı 1.0x olarak başlar', () => {
    expect(controller.getSpeedMultiplier()).toBe(1.0);
    expect(controller.getAvailableSpeeds()).toEqual(SUPPORTED_SPEEDS);
  });

  it('Hız çarpanı 0.5x, 1x, 2x, 5x buton değerlerine güncellenebilir', () => {
    for (const speed of SUPPORTED_SPEEDS) {
      controller.setSpeedMultiplier(speed);
      expect(controller.getSpeedMultiplier()).toBe(speed);
    }
  });

  it('Geçersiz negatif veya 0 hız değerleri yoksayılır', () => {
    controller.setSpeedMultiplier(2.0);
    controller.setSpeedMultiplier(-1.0);
    expect(controller.getSpeedMultiplier()).toBe(2.0);
    controller.setSpeedMultiplier(0);
    expect(controller.getSpeedMultiplier()).toBe(2.0);
  });

  it('Prob intikal (TRAVERSE) hareket mesafesi deltaTime * speedMultiplier ile ölçeklenir', () => {
    const waypoints = [
      { position: new THREE.Vector3(0, 0, 0), phase: 'TRAVERSE' as const },
      { position: new THREE.Vector3(100, 0, 0), phase: 'TRAVERSE' as const },
    ];

    controller.setWaypoints(waypoints);
    controller.setSpeedMultiplier(1.0);
    controller.play();

    // 0.1 saniye @ 100 mm/s traverse = 10 mm ilerleme
    const state1x = controller.update(0.1);
    expect(state1x.currentPosition.x).toBeCloseTo(10.0, 2);

    controller.reset();
    controller.setSpeedMultiplier(2.0);
    controller.play();

    // 0.1 saniye @ 2x hız = 20 mm ilerleme
    const state2x = controller.update(0.1);
    expect(state2x.currentPosition.x).toBeCloseTo(20.0, 2);

    controller.reset();
    controller.setSpeedMultiplier(0.5);
    controller.play();

    // 0.1 saniye @ 0.5x hız = 5 mm ilerleme
    const stateHalfX = controller.update(0.1);
    expect(stateHalfX.currentPosition.x).toBeCloseTo(5.0, 2);
  });

  it('Prob dokunma (TOUCH) hareket mesafesi deltaTime * speedMultiplier ile ölçeklenir', () => {
    const waypoints = [
      { position: new THREE.Vector3(0, 10, 0), phase: 'TOUCH' as const },
      { position: new THREE.Vector3(0, 0, 0), phase: 'TOUCH' as const },
    ];

    controller.setWaypoints(waypoints);
    controller.setSpeedMultiplier(1.0);
    controller.play();

    // Touch hızı 5 mm/s; 0.2 saniye @ 1.0x = 1.0 mm iniş (10 -> 9)
    const state = controller.update(0.2);
    expect(state.phase).toBe('TOUCH');
    expect(state.currentPosition.y).toBeCloseTo(9.0, 2);

    controller.reset();
    controller.setSpeedMultiplier(5.0);
    controller.play();

    // 0.2 saniye @ 5.0x = 5.0 mm iniş (10 -> 5)
    const stateFast = controller.update(0.2);
    expect(stateFast.currentPosition.y).toBeCloseTo(5.0, 2);
  });

  it('CADViewer ile SimulationController entegre çalışır', () => {
    const viewer = new CADViewer();
    expect(viewer.getSpeedMultiplier()).toBe(1.0);

    viewer.setSpeedMultiplier(2.0);
    expect(viewer.getSpeedMultiplier()).toBe(2.0);
    expect(viewer.getSimulationController().getSpeedMultiplier()).toBe(2.0);

    viewer.destroy();
  });
});
