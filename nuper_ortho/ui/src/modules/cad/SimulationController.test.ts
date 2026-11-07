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

  it('Prob intikal (TRAVERSE) hareket mesafesi 150 mm/s temel hızıyla deltaTime * speedMultiplier ile ölçeklenir', () => {
    const waypoints = [
      { position: new THREE.Vector3(0, 0, 0), phase: 'TRAVERSE' as const },
      { position: new THREE.Vector3(100, 0, 0), phase: 'TRAVERSE' as const },
    ];

    controller.setWaypoints(waypoints);
    controller.setSpeedMultiplier(1.0);
    controller.play();

    // 0.1 saniye @ 150 mm/s traverse = 15 mm ilerleme
    const state1x = controller.update(0.1);
    expect(state1x.currentPosition.x).toBeCloseTo(15.0, 2);

    controller.reset();
    controller.setSpeedMultiplier(2.0);
    controller.play();

    // 0.1 saniye @ 2x hız = 30 mm ilerleme
    const state2x = controller.update(0.1);
    expect(state2x.currentPosition.x).toBeCloseTo(30.0, 2);

    controller.reset();
    controller.setSpeedMultiplier(0.5);
    controller.play();

    // 0.1 saniye @ 0.5x hız = 7.5 mm ilerleme
    const stateHalfX = controller.update(0.1);
    expect(stateHalfX.currentPosition.x).toBeCloseTo(7.5, 2);
  });

  it('Prob dokunma (TOUCH) hareket mesafesi 5 mm/s temel hızıyla deltaTime * speedMultiplier ile ölçeklenir', () => {
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

  it('Oynatma durumu, duraklatma ve seek kontrolleri doğru çalışır', () => {
    const waypoints = [
      { position: new THREE.Vector3(0, 0, 0), phase: 'TRAVERSE' as const },
      { position: new THREE.Vector3(100, 0, 0), phase: 'TRAVERSE' as const },
    ];
    controller.setWaypoints(waypoints);
    expect(controller.getState().isPlaying).toBe(false);

    controller.play();
    expect(controller.getState().isPlaying).toBe(true);

    controller.pause();
    expect(controller.getState().isPlaying).toBe(false);

    controller.togglePlay();
    expect(controller.getState().isPlaying).toBe(true);

    controller.seek(0.5);
    expect(controller.getState().currentPosition.x).toBeCloseTo(50.0, 1);
  });

  it('CADViewer ile SimulationController entegre çalışır', () => {
    const viewer = new CADViewer();
    expect(viewer.getSpeedMultiplier()).toBe(1.0);

    viewer.setSpeedMultiplier(2.0);
    expect(viewer.getSpeedMultiplier()).toBe(2.0);
    expect(viewer.getSimulationController().getSpeedMultiplier()).toBe(2.0);

    viewer.destroy();
  });

  it('CADViewer otomatik ölçüm yolunu (renderTrajectory) sahnede görselleştirir ve kontrolcüye bağlar', () => {
    const viewer = new CADViewer();
    const mockPlan = {
      operation: 'OP10' as const,
      zClearance: 85.0,
      featurePaths: [
        {
          featureId: 1,
          balloon: '#1',
          ph10Angle: { aDeg: 0, bDeg: 0, direction: [0, 0, -1] as [number, number, number], label: 'A0° B0°' },
          touchPoints: [{ position: [50, 50, 47] as [number, number, number], normal: [-1, 0, 0] as [number, number, number] }],
          waypoints: [
            { position: new THREE.Vector3(50, 50, 85), phase: 'TRAVERSE' as const },
            { position: new THREE.Vector3(50, 50, 47), phase: 'TOUCH' as const },
          ],
        },
      ],
      allWaypoints: [
        { position: new THREE.Vector3(0, 0, 85), phase: 'IDLE' as const },
        { position: new THREE.Vector3(50, 50, 85), phase: 'TRAVERSE' as const },
        { position: new THREE.Vector3(50, 50, 47), phase: 'TOUCH' as const },
        { position: new THREE.Vector3(0, 0, 85), phase: 'COMPLETED' as const },
      ],
      totalDistanceMm: 120.0,
      estimatedDurationSec: 5.2,
      probeHeadRotations: 0,
      stylusRecommendations: [],
    };

    viewer.renderTrajectory(mockPlan);

    const trajGroup = viewer.getTrajectoryGroup();
    expect(trajGroup.children.length).toBeGreaterThan(0);
    expect(viewer.getSimulationController().getWaypoints().length).toBe(4);

    viewer.destroy();
  });

  it('CADViewer OP10 ve OP20 kurulumlarına göre modeli 3D uzayda çevirir', () => {
    const viewer = new CADViewer();
    const boxGeo = new THREE.BoxGeometry(100, 100, 50);
    viewer.setModelGeometry(boxGeo);

    const envOp10 = viewer.applyOperationSetup('OP10');
    expect(envOp10).toBeDefined();

    const envOp20 = viewer.applyOperationSetup('OP20');
    expect(envOp20).toBeDefined();

    viewer.destroy();
  });
});
