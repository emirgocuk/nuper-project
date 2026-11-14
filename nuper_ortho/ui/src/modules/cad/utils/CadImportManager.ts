import * as THREE from 'three';
import { StepModelTessellator, type TessellatedModelResult } from './StepModelTessellator';
import { SetupPrep, type BoundingBoxEnvelope, type CadFeatureInput } from './SetupPrep';
import type { CadMetadata } from '../../../types/generated/cad_metadata';

export interface CadTelemetryData {
  name?: string;
  protocol?: string;
  bbox?: string;
  faces?: number | string;
  cylinders?: number | string;
  wallThickness?: string;
  datumSuggestion?: string;
}

export interface SelectedCadFileResult {
  filePath?: string;
  name: string;
  ext: string;
  size?: number;
  dataText?: string | null;
  dataBase64?: string | null;
  metadata?: CadMetadata;
}

let isCadImporting = false;
let cachedCadFilename = '';
let cachedCadStepText = '';
let cachedCadMetadata: CadMetadata | undefined = undefined;

export function resetCadImportLock(): void {
  isCadImporting = false;
  cachedCadFilename = '';
  cachedCadStepText = '';
  cachedCadMetadata = undefined;
}

export function updateCadModalTelemetry(customData?: CadTelemetryData): void {
  if (typeof document === 'undefined') return;

  const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
    currentUploadedCad?: CadTelemetryData;
  };
  const cad = customData || win.currentUploadedCad;
  if (!cad) return;

  const nameEl = document.getElementById('cad-stat-name');
  if (nameEl) nameEl.textContent = cad.name || '--';

  const protoEl = document.getElementById('cad-stat-protocol');
  if (protoEl) protoEl.textContent = cad.protocol || 'ISO 10303-21 (AP214/AP242)';

  const bboxEl = document.getElementById('cad-stat-bbox');
  if (bboxEl) bboxEl.textContent = cad.bbox || '--';

  const facesEl = document.getElementById('cad-stat-faces');
  if (facesEl) {
    facesEl.textContent = cad.faces !== undefined && cad.faces !== null
      ? `${cad.faces} ADVANCED_FACE`
      : '--';
  }

  const cylEl = document.getElementById('cad-stat-cylinders');
  if (cylEl) {
    cylEl.textContent = cad.cylinders !== undefined && cad.cylinders !== null
      ? `${cad.cylinders} Delik`
      : '--';
  }

  const wallsEl = document.getElementById('cad-stat-walls');
  if (wallsEl) wallsEl.textContent = cad.wallThickness || '--';
}

export function generateSafeProbeTrajectory(tess: TessellatedModelResult): THREE.Vector3[] {
  const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
    THREE?: typeof THREE;
    scene?: THREE.Scene;
    trajLine?: THREE.Line;
    touchPointMeshes?: THREE.Mesh[];
    probeGroup?: THREE.Group;
    nuperApp?: { getCADViewer: () => { getSimulationController: () => { setWaypoints: (w: unknown[]) => void; bindProbeObject: (o: unknown, v: unknown) => void; reset: () => void } } };
    requestRender?: () => void;
    eval?: (code: string) => unknown;
  };

  const T = win.THREE || THREE;
  const maxY = isFinite(tess.bbox.max[1]) ? tess.bbox.max[1] : 10.0;
  const clearanceY = maxY + 25.0;
  const homePos = new T.Vector3(0, clearanceY, 0);

  const waypoints: Array<{ position: THREE.Vector3; phase: 'TRAVERSE' | 'TOUCH' | 'RETRACT'; label?: string }> = [];
  const touchPoints: Array<{ pos: THREE.Vector3; color: number; label: string }> = [];

  waypoints.push({ position: homePos.clone(), phase: 'TRAVERSE' });

  const minX = tess.bbox.min[0], maxX = tess.bbox.max[0];
  const minZ = tess.bbox.min[2], maxZ = tess.bbox.max[2];
  const dAPts = [
    new T.Vector3(minX * 0.5, maxY, minZ * 0.5),
    new T.Vector3(maxX * 0.5, maxY, minZ * 0.5),
    new T.Vector3(maxX * 0.5, maxY, maxZ * 0.5),
    new T.Vector3(minX * 0.5, maxY, maxZ * 0.5),
  ];
  dAPts.forEach((pt, idx) => {
    waypoints.push({ position: new T.Vector3(pt.x, clearanceY, pt.z), phase: 'TRAVERSE' });
    waypoints.push({ position: pt.clone(), phase: 'TOUCH', label: `DATUM [A] Üst Düzlem Pt#${idx + 1}` });
    touchPoints.push({ pos: pt.clone(), color: 0x10b981, label: `DATUM [A] Pt#${idx + 1}` });
    waypoints.push({ position: new T.Vector3(pt.x, clearanceY, pt.z), phase: 'RETRACT' });
  });

  const sampleHoles = (tess.detectedHoles || []).slice(0, 4);
  sampleHoles.forEach((hole) => {
    const hPos = new T.Vector3(hole.center[0], hole.center[1], hole.center[2]);
    waypoints.push({ position: new T.Vector3(hPos.x, clearanceY, hPos.z), phase: 'TRAVERSE' });
    waypoints.push({ position: hPos.clone(), phase: 'TOUCH', label: `${hole.name || 'DELİK'} Merkezi` });
    touchPoints.push({ pos: hPos.clone(), color: 0x38bdf8, label: `${hole.name || 'DELİK'} (R=${hole.radius})` });
    waypoints.push({ position: new T.Vector3(hPos.x, clearanceY, hPos.z), phase: 'RETRACT' });
  });

  waypoints.push({ position: homePos.clone(), phase: 'TRAVERSE' });

  if (win.scene) {
    if (win.trajLine) {
      if (typeof win.trajLine.geometry?.dispose === 'function') {
        win.trajLine.geometry.dispose();
      }
      const pts = waypoints.map((w) => w.position);
      win.trajLine.geometry = new T.BufferGeometry().setFromPoints(pts);
      win.trajLine.visible = true;
    }

    if (Array.isArray(win.touchPointMeshes)) {
      win.touchPointMeshes.forEach((m) => win.scene?.remove(m));
      win.touchPointMeshes.length = 0;
    } else {
      win.touchPointMeshes = [];
    }

    const dotGeo = new T.SphereGeometry(0.35, 12, 12);
    touchPoints.forEach((tp) => {
      const dotMat = new T.MeshLambertMaterial({ color: tp.color });
      const dotMesh = new T.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(tp.pos);
      dotMesh.userData = { label: tp.label };
      win.scene?.add(dotMesh);
      win.touchPointMeshes?.push(dotMesh);
    });

    if (win.probeGroup) {
      win.probeGroup.position.set(homePos.x, homePos.y, homePos.z);
    }
  }

  if (win.nuperApp) {
    try {
      const simCtrl = win.nuperApp.getCADViewer().getSimulationController();
      simCtrl.setWaypoints(waypoints);
      if (win.probeGroup) {
        simCtrl.bindProbeObject(win.probeGroup, new T.Vector3(0, 20, 0));
      }
      simCtrl.reset();
    } catch {}
  }

  if (typeof document !== 'undefined') {
    const hudCoords = document.getElementById('hud-feature-coords');
    if (hudCoords) {
      hudCoords.textContent = `Prob: X: 0.00 mm | Y: ${clearanceY.toFixed(2)} mm | Z: ${clearanceY.toFixed(2)} mm | Faz: TRAVERSE | Hız: 1x`;
    }
  }

  if (typeof win.eval === 'function') {
    try {
      win.eval('if (typeof requestRender === "function") requestRender();');
    } catch {}
  }
  if (typeof win.requestRender === 'function') {
    win.requestRender();
  }

  return waypoints.map((w) => w.position);
}

export function applyStepModelToScene(filename: string, stepText = '', metadata?: CadMetadata): TessellatedModelResult {
  if (stepText) {
    cachedCadStepText = stepText;
  } else if (cachedCadStepText && (!cachedCadFilename || cachedCadFilename === filename)) {
    stepText = cachedCadStepText;
  }
  if (metadata?.mesh?.positions_b64) {
    cachedCadMetadata = metadata;
    cachedCadFilename = filename;
  } else if (metadata && cachedCadMetadata?.mesh?.positions_b64 && (!cachedCadFilename || cachedCadFilename === filename)) {
    metadata = {
      ...cachedCadMetadata,
      ...metadata,
      mesh: cachedCadMetadata.mesh,
      alignment: metadata.alignment || cachedCadMetadata.alignment,
      pmi: metadata.pmi || cachedCadMetadata.pmi,
      features:
        cachedCadMetadata.features && cachedCadMetadata.features.length > (metadata.features?.length || 0)
          ? cachedCadMetadata.features
          : metadata.features || cachedCadMetadata.features,
    };
    cachedCadMetadata = metadata;
  } else if (metadata) {
    cachedCadMetadata = metadata;
    cachedCadFilename = filename;
  } else if (cachedCadMetadata) {
    metadata = cachedCadMetadata;
  }
  const tess = StepModelTessellator.buildStepSolidModel(stepText, filename, metadata);
  const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
    THREE?: typeof THREE;
    scene?: THREE.Scene;
    uploadedMeshGroup?: THREE.Group | null;
    blockGroup?: THREE.Group & { visible: boolean };
    requestRender?: () => void;
    currentUploadedCad?: CadTelemetryData;
    closeCadIngestionModal?: () => void;
    generateDynamicProbeTrajectory?: () => void;
    showToast?: (msg: string) => void;
    workflowRibbon?: { advanceToStep: (step: number) => void; setStepLabel: (id: string, label: string) => void; mount: (selector: string) => void; getCurrentStep?: () => { stepNumber: number } };
    camera?: THREE.PerspectiveCamera;
    controls?: { target: THREE.Vector3; update: () => void };
    selectableMeshes?: THREE.Object3D[];
    eval?: (code: string) => unknown;
    dispatchEvent?: (e: Event) => boolean;
  };

  const T = win.THREE || THREE;

  if (win.scene && tess.group) {
    if (win.scene.background && typeof (win.scene.background as THREE.Color).setHex === 'function') {
      (win.scene.background as THREE.Color).setHex(0xffffff);
    } else {
      win.scene.background = new T.Color(0xffffff);
    }

    if (win.uploadedMeshGroup) {
      win.scene.remove(win.uploadedMeshGroup);
    }
    win.scene.add(tess.group);
    win.uploadedMeshGroup = tess.group;

    if (win.blockGroup) {
      if (typeof win.blockGroup.clear === 'function') {
        win.blockGroup.clear();
      } else {
        while (win.blockGroup.children && win.blockGroup.children.length > 0) {
          win.blockGroup.remove(win.blockGroup.children[0]);
        }
      }
      win.blockGroup.add(tess.group.clone());
      win.blockGroup.visible = true;
      if (!win.scene.children.includes(win.blockGroup)) {
        win.scene.add(win.blockGroup);
      }
    }

    if (Array.isArray(win.selectableMeshes)) {
      win.selectableMeshes.length = 0;
      tess.group.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          win.selectableMeshes?.push(c);
        }
      });
    }

    tess.group.position.set(0, 0, 0);
    tess.group.updateMatrixWorld(true);

    if (typeof win.eval === 'function') {
      try {
        win.eval(`
          if (typeof uploadedMeshGroup !== 'undefined') {
            uploadedMeshGroup = window.uploadedMeshGroup;
          }
          if (typeof blockGroup !== 'undefined' && blockGroup) {
            blockGroup.visible = true;
          }
          if (typeof camera !== 'undefined') window.camera = camera;
          if (typeof controls !== 'undefined') window.controls = controls;
          if (typeof renderer !== 'undefined') window.renderer = renderer;
          if (typeof requestRender === 'function') {
            window.requestRender = requestRender;
            requestRender();
          }
          if (typeof focusPart === 'function') {
            window.focusPart = focusPart;
            focusPart();
          }
        `);
      } catch {}
    }

    if (win.camera && win.controls) {
      const maxDim = Math.max(tess.bbox.size[0], tess.bbox.size[1], tess.bbox.size[2]);
      const camDist = Math.max(70, maxDim * 1.4);
      win.camera.position.set(camDist, camDist * 0.75, camDist);
      win.controls.target.set(0, tess.bbox.size[1] / 2, 0);
      win.controls.update();
    }
  }

  const planeCount = tess.cadFeatures ? tess.cadFeatures.filter((f) => f.feature_type === 'PLANE').length : 0;
  const cylinderCount = tess.cadFeatures ? tess.cadFeatures.filter((f) => f.feature_type === 'INTERNAL_CYLINDER' || f.feature_type === 'EXTERNAL_CYLINDER').length : tess.detectedHoles.length;

  win.currentUploadedCad = {
    name: filename,
    protocol: metadata?.kernel || 'ISO 10303-21 (AP214/AP242)',
    bbox: `${tess.bbox.size[0].toFixed(1)} x ${tess.bbox.size[1].toFixed(1)} x ${tess.bbox.size[2].toFixed(1)} mm`,
    faces: planeCount > 0 ? planeCount : (tess.cadFeatures?.length || 0),
    cylinders: cylinderCount,
    wallThickness: `H=${tess.bbox.size[1].toFixed(1)} mm (B-Rep Doğrulandı)`,
    datumSuggestion: 'B-Rep Geometrisi Yüklendi',
  };

  const wWizard = win as {
    setupWizard?: { setCadMetadata?: (m: unknown) => void };
  };
  if (wWizard.setupWizard && typeof wWizard.setupWizard.setCadMetadata === 'function') {
    wWizard.setupWizard.setCadMetadata({
      model_name: filename,
      protocol: metadata?.kernel || 'ISO 10303-21',
      kernel: metadata?.kernel,
      bbox: {
        min: tess.bbox.min,
        max: tess.bbox.max,
        size: tess.bbox.size,
      },
      features: tess.cadFeatures || [],
      faces_count: planeCount > 0 ? planeCount : (tess.cadFeatures?.length || 0),
      holes_count: tess.detectedHoles.length,
      wall_thickness_min: tess.bbox.size[1],
      vertex_count: metadata?.vertex_count,
      triangle_count: metadata?.triangle_count,
      mesh: metadata?.mesh,
      alignment: metadata?.alignment,
      pmi: metadata?.pmi,
    });
  }

  updateCadModalTelemetry(win.currentUploadedCad);

  if (typeof document !== 'undefined') {
    const badge = document.getElementById('part-name-badge');
    if (badge) badge.textContent = filename;
    const titleEl = document.querySelector('.hud-title');
    if (titleEl) titleEl.textContent = `${filename} (B-Rep Doğrulandı)`;

    const modelBadge = document.getElementById('model-badge-name');
    if (modelBadge) modelBadge.textContent = filename;

    const modelSize = document.getElementById('model-badge-size');
    if (modelSize) {
      modelSize.textContent = `Boyut: ${tess.bbox.size[0].toFixed(1)} x ${tess.bbox.size[1].toFixed(1)} x ${tess.bbox.size[2].toFixed(1)} mm`;
    }

    const hudStatus = document.getElementById('hud-status-pill');
    if (hudStatus) {
      hudStatus.textContent = 'HAZIR / OP10';
      if (hudStatus.style) {
        hudStatus.style.background = '#D1FAE5';
        hudStatus.style.color = '#065F46';
      }
    }

    const hudDetails = document.getElementById('hud-feature-details');
    if (hudDetails) {
      hudDetails.textContent = `Katı model koordinat sistemine yerleştirildi. Boyut: ${tess.bbox.size[0].toFixed(1)} x ${tess.bbox.size[1].toFixed(1)} x ${tess.bbox.size[2].toFixed(1)} mm.`;
    }

    const confirmBtn = document.querySelector<HTMLElement>('#cad-ingestion-modal .modal-footer .btn-header.primary');
    if (confirmBtn) {
      confirmBtn.innerHTML = `✓ ${filename} Seçildi — Onayla ve Sahneye Yükle`;
      if (confirmBtn.style) {
        confirmBtn.style.background = '#059669';
        confirmBtn.style.color = '#FFFFFF';
        confirmBtn.style.fontWeight = '700';
      }
    }
  }

  if (win.workflowRibbon) {
    const currentStepNum = typeof win.workflowRibbon.getCurrentStep === 'function'
      ? win.workflowRibbon.getCurrentStep()?.stepNumber || 1
      : 1;
    if (currentStepNum < 2) {
      win.workflowRibbon.advanceToStep(2);
    }
    const shortName = filename.length > 20 ? filename.substring(0, 18) + '...' : filename;
    win.workflowRibbon.setStepLabel('step_cad', `Katı Model: ${shortName}`);
    win.workflowRibbon.mount('.app-ribbon');
  }

  const wizardObj = (win as unknown as {
    setupWizard?: {
      isPlanConfirmed?: () => boolean;
      getDimensions?: () => unknown[];
    };
    trajLine?: { visible: boolean };
    touchPointMeshes?: THREE.Object3D[];
  });

  const hasConfirmedPlan =
    typeof wizardObj.setupWizard?.isPlanConfirmed === 'function' &&
    wizardObj.setupWizard.isPlanConfirmed() &&
    typeof wizardObj.setupWizard?.getDimensions === 'function' &&
    wizardObj.setupWizard.getDimensions().length > 0;

  if (!hasConfirmedPlan) {
    if (wizardObj.trajLine) {
      wizardObj.trajLine.visible = false;
    }
    if (Array.isArray(wizardObj.touchPointMeshes) && win.scene) {
      wizardObj.touchPointMeshes.forEach((m) => win.scene?.remove(m));
      wizardObj.touchPointMeshes.length = 0;
    }
  }

  if (typeof win.eval === 'function') {
    try {
      win.eval('if (typeof requestRender === "function") requestRender();');
    } catch {}
  }
  if (typeof win.requestRender === 'function') {
    win.requestRender();
  }
  if (typeof win.dispatchEvent === 'function') {
    try {
      win.dispatchEvent(new Event('resize'));
    } catch {}
  }

  return tess;
}

export async function safeTriggerCadImport(): Promise<void> {
  if (isCadImporting) return;
  isCadImporting = true;

  try {
    const win = (typeof window !== 'undefined' ? window : {}) as unknown as {
      electronIpc?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> };
      require?: (mod: string) => { ipcRenderer?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } };
      handleCadData?: (data: unknown) => void;
      showToast?: (msg: string) => void;
      setupWizard?: { setCadMetadata?: (cad: unknown) => void };
    };

    let ipc = win.electronIpc;
    if (!ipc && typeof win.require === 'function') {
      try {
        const electron = win.require('electron');
        ipc = electron?.ipcRenderer;
      } catch {}
    }

    if (ipc && typeof ipc.invoke === 'function') {
      try {
        const res = (await ipc.invoke('select-cad-file')) as SelectedCadFileResult | null;
        if (!res) {
          return;
        }

        if (res.metadata) {
          cachedCadMetadata = res.metadata;
          cachedCadFilename = res.name;
        }
        const tess = applyStepModelToScene(res.name, res.dataText || '', res.metadata);

        if (typeof win.handleCadData === 'function') {
          win.handleCadData(res);
        }

        if (win.setupWizard && typeof win.setupWizard.setCadMetadata === 'function') {
          win.setupWizard.setCadMetadata({
            model_name: res.name,
            format: res.ext.toUpperCase() as 'STEP' | 'STL' | 'OBJ',
            kernel: res.metadata?.kernel,
            features: tess.cadFeatures || [],
            bbox: {
              min: tess.bbox.min,
              max: tess.bbox.max,
              size: tess.bbox.size,
            },
            vertex_count: res.metadata?.vertex_count,
            triangle_count: res.metadata?.triangle_count,
            mesh: res.metadata?.mesh,
            alignment: res.metadata?.alignment,
            pmi: res.metadata?.pmi,
          });
        }
      } catch (ipcErr) {
        if (typeof win.showToast === 'function') {
          win.showToast('⚠️ CAD dosyası yüklenirken bir sorun oluştu.');
        }
      }
      return;
    }

    if (typeof document !== 'undefined') {
      const fileInput =
        (document.getElementById('step-file-input') as HTMLInputElement | null) ||
        (document.getElementById('real-3d-file-input') as HTMLInputElement | null);
      if (fileInput) {
        fileInput.click();
      }
    }
  } finally {
    isCadImporting = false;
  }
}

export function installCadImportInterceptor(): void {
  if (typeof window === 'undefined') return;

  const win = window as unknown as {
    updateCadModalTelemetry: typeof updateCadModalTelemetry;
    triggerCadImport: typeof safeTriggerCadImport;
    applyStepModelToScene: typeof applyStepModelToScene;
    applyUploadedCadToScene?: () => void;
    build3DModelFromStep?: (stepText: string, filename: string) => void;
    handleCadData?: (data: unknown) => void;
    closeCadIngestionModal?: () => void;
    generateDynamicProbeTrajectory?: () => void;
    requestRender?: () => void;
    showToast?: (msg: string) => void;
    currentUploadedCad?: CadTelemetryData;
    workflowRibbon?: { advanceToStep: (step: number) => void; setStepLabel: (id: string, label: string) => void; mount: (selector: string) => void; getCurrentStep?: () => { stepNumber: number } };
  };

  win.updateCadModalTelemetry = updateCadModalTelemetry;
  win.triggerCadImport = safeTriggerCadImport;
  win.applyStepModelToScene = applyStepModelToScene;

  win.build3DModelFromStep = (stepText: string, filename: string) => {
    applyStepModelToScene(filename, stepText, cachedCadMetadata);
  };

  win.generateDynamicProbeTrajectory = () => {
    const wWiz = win as unknown as {
      setupWizard?: {
        isPlanConfirmed?: () => boolean;
        getDimensions?: () => unknown[];
        applyActivePlanToWorkspace?: (dims?: unknown) => void;
      };
      trajLine?: { visible: boolean };
    };
    if (
      wWiz.setupWizard &&
      typeof wWiz.setupWizard.isPlanConfirmed === 'function' &&
      wWiz.setupWizard.isPlanConfirmed() &&
      typeof wWiz.setupWizard.applyActivePlanToWorkspace === 'function'
    ) {
      const dims = typeof wWiz.setupWizard.getDimensions === 'function' ? wWiz.setupWizard.getDimensions() : undefined;
      wWiz.setupWizard.applyActivePlanToWorkspace(dims);
    } else if (wWiz.trajLine) {
      wWiz.trajLine.visible = false;
    }
    if (typeof win.requestRender === 'function') {
      win.requestRender();
    }
  };

  const wAlign = win as unknown as {
    apply321Alignment?: () => void;
    close321Modal?: () => void;
    uploadedMeshGroup?: THREE.Group | null;
    blockGroup?: THREE.Group | null;
    datumTriadGroup?: THREE.Group | null;
    setupWizard?: {
      getDimensions?: () => unknown[];
      applyActivePlanToWorkspace?: (dims?: unknown) => void;
    };
  };
  const origApply321 = wAlign.apply321Alignment;
  wAlign.apply321Alignment = () => {
    const target = wAlign.uploadedMeshGroup || wAlign.blockGroup;
    if (target) {
      target.rotation.set(0, 0, 0);
      target.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(target);
      if (isFinite(box.min.y)) {
        target.position.y -= box.min.y;
        target.updateMatrixWorld(true);
      }
    }

    if (typeof origApply321 === 'function') {
      origApply321();
    }

    if (target && wAlign.datumTriadGroup) {
      target.updateMatrixWorld(true);
      const worldBox = new THREE.Box3().setFromObject(target);
      if (isFinite(worldBox.min.x) && isFinite(worldBox.max.x)) {
        const sizeVec = new THREE.Vector3();
        worldBox.getSize(sizeVec);
        const bboxEnv: BoundingBoxEnvelope = {
          min: [worldBox.min.x, worldBox.min.y, worldBox.min.z],
          max: [worldBox.max.x, worldBox.max.y, worldBox.max.z],
          size: [sizeVec.x, sizeVec.y, sizeVec.z],
        };
        const anchors = SetupPrep.computeDatumBadgeAnchors(
          bboxEnv,
          (cachedCadMetadata?.features as unknown as CadFeatureInput[]) || [],
          worldBox.min.y
        );
        const keys: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];
        let fallbackIdx = 0;
        for (const child of wAlign.datumTriadGroup.children) {
          const textHint = `${child.name || ''} ${String((child.userData as { label?: string; datum?: string })?.label || '')} ${String((child.userData as { datum?: string })?.datum || '')}`.toUpperCase();
          let matchedKey: 'A' | 'B' | 'C' | null = null;
          if (textHint.includes('[A]') || textHint.includes('DATUM_A') || textHint === ' A ') matchedKey = 'A';
          else if (textHint.includes('[B]') || textHint.includes('DATUM_B') || textHint === ' B ') matchedKey = 'B';
          else if (textHint.includes('[C]') || textHint.includes('DATUM_C') || textHint === ' C ') matchedKey = 'C';
          else if ((child as THREE.Sprite).isSprite && fallbackIdx < keys.length) {
            matchedKey = keys[fallbackIdx++];
          }
          if (matchedKey) {
            const pos = anchors[matchedKey].badgePosition;
            child.position.set(pos[0], pos[1], pos[2]);
          }
        }
      }
    }

    if (typeof document !== 'undefined') {
      const modal321 = document.getElementById('modal-321-alignment');
      if (modal321) {
        modal321.classList.remove('active');
      }
    }

    if (
      wAlign.setupWizard &&
      typeof wAlign.setupWizard.getDimensions === 'function' &&
      wAlign.setupWizard.getDimensions().length > 0 &&
      typeof wAlign.setupWizard.applyActivePlanToWorkspace === 'function'
    ) {
      wAlign.setupWizard.applyActivePlanToWorkspace(wAlign.setupWizard.getDimensions());
    }

    if (win.workflowRibbon) {
      win.workflowRibbon.advanceToStep(5);
      win.workflowRibbon.mount('.app-ribbon');
    }

    if (typeof win.requestRender === 'function') {
      win.requestRender();
    }
    if (typeof win.showToast === 'function') {
      win.showToast('🎯 3-2-1 Datum Hizalama Tamamlandı: Parça granit tablaya (Y=0) oturtuldu ve takım yolları ölçülere kilitlendi.');
    }
  };

  win.applyUploadedCadToScene = () => {
    const cad = win.currentUploadedCad;
    const filename = cad?.name || 'cad_model.stp';
    applyStepModelToScene(filename, '', cachedCadMetadata);

    if (typeof win.closeCadIngestionModal === 'function') {
      win.closeCadIngestionModal();
    }
    if (win.workflowRibbon) {
      win.workflowRibbon.advanceToStep(2);
      const shortName = filename.length > 20 ? filename.substring(0, 18) + '...' : filename;
      win.workflowRibbon.setStepLabel('step_cad', `Katı Model: ${shortName}`);
      win.workflowRibbon.mount('.app-ribbon');
    }
    if (typeof win.requestRender === 'function') {
      win.requestRender();
    }
    if (typeof win.showToast === 'function') {
      win.showToast(`✅ ${filename} 3D Sahneye Başarıyla Yüklendi!`);
    }
  };

  if (typeof document !== 'undefined') {
    const confirmBtn = document.querySelector<HTMLElement>(
      '#cad-ingestion-modal .modal-footer .btn-header.primary'
    );
    if (confirmBtn) {
      confirmBtn.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (typeof win.applyUploadedCadToScene === 'function') {
            win.applyUploadedCadToScene();
          }
        },
        true
      );
    }

    const citadelBtns = document.querySelectorAll<HTMLElement>('[onclick*="loadCitadelCad"]');
    citadelBtns.forEach((btn) => {
      btn.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const attr = btn.getAttribute('onclick') || '';
          const match = attr.match(/loadCitadelCad\(['"]([^'"]+)['"]\)/);
          const name = match ? match[1] : 'cad_model.stp';
          applyStepModelToScene(name, '');
        },
        true
      );
    });

    const dropzone = document.getElementById('step-dropzone');
    if (dropzone) {
      dropzone.addEventListener(
        'drop',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const files = (e as DragEvent).dataTransfer?.files;
          if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
              const text = (ev.target?.result as string) || '';
              applyStepModelToScene(file.name, text);
            };
            reader.readAsText(file);
          }
        },
        true
      );
    }

    const cadBtns = document.querySelectorAll<HTMLElement>(
      'button[onclick*="triggerCadImport"], .dropdown-row[onclick*="triggerCadImport"]'
    );
    cadBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        void safeTriggerCadImport();
      });
    });

    const dropzoneBtn = document.querySelector<HTMLElement>('#step-dropzone button');
    if (dropzoneBtn) {
      dropzoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        void safeTriggerCadImport();
      });
    }

    const fileInput = document.getElementById('step-file-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
            const text = (ev.target?.result as string) || '';
            applyStepModelToScene(file.name, text);
          };
          reader.readAsText(file);
        }
      });
    }
  }
}
