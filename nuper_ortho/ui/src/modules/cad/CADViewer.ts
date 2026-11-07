import * as THREE from 'three';
import { SceneCleaner } from './utils/SceneCleaner';
import { SimulationController } from './SimulationController';
import { SetupPrep, type BoundingBoxEnvelope, type SetupPrepOptions } from './utils/SetupPrep';
import { type GeneratedMeasurementPlan } from './utils/MeasurementPathGenerator';

export interface CADViewerOptions {
  antialias?: boolean;
  backgroundColor?: number;
  enableEdges?: boolean;
}

export class CADViewer {
  private container: HTMLElement | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer | null = null;
  private modelGroup: THREE.Group;
  private currentGeometry: THREE.BufferGeometry | null = null;
  private simulationController: SimulationController;
  private animationFrameId: number | null = null;
  private isDestroyed = false;
  private highlightedFeatureKey: string | null = null;
  private highlightGroup: THREE.Group;
  private trajectoryGroup: THREE.Group;

  constructor(options: CADViewerOptions = {}) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(options.backgroundColor ?? 0xf1f5f9);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
    this.camera.position.set(200, 150, 250);

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    this.highlightGroup = new THREE.Group();
    this.scene.add(this.highlightGroup);

    this.trajectoryGroup = new THREE.Group();
    this.scene.add(this.trajectoryGroup);

    this.simulationController = new SimulationController();

    this.setupLights();
  }

  public getSimulationController(): SimulationController {
    return this.simulationController;
  }

  public setSpeedMultiplier(speed: number): void {
    this.simulationController.setSpeedMultiplier(speed);
  }

  public getSpeedMultiplier(): number {
    return this.simulationController.getSpeedMultiplier();
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(150, 200, 100);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.4);
    dirLight2.position.set(-150, -100, -100);
    this.scene.add(dirLight2);
  }

  public initialize(container: HTMLElement): void {
    if (this.isDestroyed) return;
    this.container = container;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  public setModelGeometry(geometry: THREE.BufferGeometry): void {
    if (this.isDestroyed) return;

    this.currentGeometry = geometry;

    SceneCleaner.disposeNode(this.modelGroup);

    const material = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.35,
      roughness: 0.38,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.modelGroup.add(mesh);

    const edges = new THREE.EdgesGeometry(geometry, 26);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 1 });
    const edgeLines = new THREE.LineSegments(edges, lineMaterial);
    this.modelGroup.add(edgeLines);

    this.fitCameraToModel();
    this.render();
  }

  public applySetupOrientation(options: SetupPrepOptions): BoundingBoxEnvelope | null {
    if (!this.currentGeometry || this.isDestroyed) return null;

    const matrix = SetupPrep.create5AxisSetupMatrix(this.currentGeometry, options);
    SetupPrep.applyTransformation(this.currentGeometry, matrix);
    this.setModelGeometry(this.currentGeometry);

    return SetupPrep.computeBoundingBoxEnvelope(this.currentGeometry);
  }

  public applyOperationSetup(
    operation: 'OP10' | 'OP20',
    datumNormal?: [number, number, number]
  ): BoundingBoxEnvelope | null {
    if (!this.currentGeometry || this.isDestroyed) return null;

    if (operation === 'OP20') {
      return this.applySetupOrientation({
        rotateXDeg: 180,
        datumNormal: datumNormal ? new THREE.Vector3(datumNormal[0], datumNormal[1], datumNormal[2]) : undefined,
      });
    }

    return this.applySetupOrientation({
      datumNormal: datumNormal ? new THREE.Vector3(datumNormal[0], datumNormal[1], datumNormal[2]) : undefined,
    });
  }

  public renderTrajectory(plan: GeneratedMeasurementPlan): void {
    if (this.isDestroyed) return;

    SceneCleaner.disposeNode(this.trajectoryGroup);

    if (plan.allWaypoints.length > 1) {
      const points = plan.allWaypoints.map((w) => w.position.clone());
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        linewidth: 2,
      });
      const pathLine = new THREE.Line(lineGeo, lineMat);
      this.trajectoryGroup.add(pathLine);
    }

    for (const fp of plan.featurePaths) {
      for (const tp of fp.touchPoints) {
        const dotGeo = new THREE.SphereGeometry(1.5, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        dotMesh.position.set(tp.position[0], tp.position[1], tp.position[2]);
        this.trajectoryGroup.add(dotMesh);
      }
    }

    const probeGroup = new THREE.Group();
    const rubyGeo = new THREE.SphereGeometry(1.5, 12, 12);
    const rubyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.1, roughness: 0.2 });
    const ruby = new THREE.Mesh(rubyGeo, rubyMat);
    probeGroup.add(ruby);

    const stemGeo = new THREE.CylinderGeometry(0.6, 0.6, 20, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 10, 0);
    probeGroup.add(stem);

    this.trajectoryGroup.add(probeGroup);

    this.simulationController.bindProbeObject(probeGroup, new THREE.Vector3(0, 0, 0));
    this.simulationController.setWaypoints(plan.allWaypoints);

    this.render();
  }

  public getTrajectoryGroup(): THREE.Group {
    return this.trajectoryGroup;
  }

  public getBoundingBoxEnvelope(): BoundingBoxEnvelope | null {
    if (!this.currentGeometry) return null;
    return SetupPrep.computeBoundingBoxEnvelope(this.currentGeometry);
  }

  public fitCameraToModel(): void {
    const box = new THREE.Box3().setFromObject(this.modelGroup);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;

    this.camera.position.set(center.x + cameraZ * 0.7, center.y + cameraZ * 0.5, center.z + cameraZ);
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();
  }

  public resize(width: number, height: number): void {
    if (!this.renderer || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }

  public render(): void {
    if (this.renderer && !this.isDestroyed) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  public getModelGroup(): THREE.Group {
    return this.modelGroup;
  }

  public highlightFeature(featureKey?: string): void {
    this.highlightedFeatureKey = featureKey || null;
    SceneCleaner.disposeNode(this.highlightGroup);

    if (featureKey && this.currentGeometry) {
      const box = new THREE.Box3().setFromBufferAttribute(
        this.currentGeometry.attributes.position as THREE.BufferAttribute
      );
      const helper = new THREE.Box3Helper(box, new THREE.Color(0x0284c7));
      this.highlightGroup.add(helper);

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const radius = Math.min(size.x, size.y, size.z) * 0.2 || 4;
      const sphereGeo = new THREE.SphereGeometry(radius, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const marker = new THREE.Mesh(sphereGeo, sphereMat);
      marker.position.copy(center);
      this.highlightGroup.add(marker);
    }

    this.render();
  }

  public getHighlightedFeature(): string | null {
    return this.highlightedFeatureKey;
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Sahnedeki tüm modelleri ve vurguları temizle
    SceneCleaner.disposeNode(this.trajectoryGroup);
    SceneCleaner.disposeNode(this.highlightGroup);
    SceneCleaner.disposeNode(this.modelGroup);
    SceneCleaner.disposeNode(this.scene);

    if (this.renderer) {
      SceneCleaner.cleanRenderer(this.renderer);
      this.renderer = null;
    }
    this.container = null;
  }
}
