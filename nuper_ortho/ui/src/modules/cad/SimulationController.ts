import * as THREE from 'three';

export type ProbePhase = 'IDLE' | 'TRAVERSE' | 'TOUCH' | 'RETRACT' | 'COMPLETED';

export interface Waypoint {
  position: THREE.Vector3;
  phase: ProbePhase;
}

export interface SimulationState {
  currentPosition: THREE.Vector3;
  phase: ProbePhase;
  progress: number;
  speedMultiplier: number;
  currentWaypointIndex: number;
  isPlaying: boolean;
}

export const SUPPORTED_SPEEDS = [0.5, 1.0, 2.0, 5.0] as const;
export type SupportedSpeed = (typeof SUPPORTED_SPEEDS)[number];

export class SimulationController {
  private speedMultiplier = 5.0;
  private isPlaying = false;
  private currentPosition: THREE.Vector3 = new THREE.Vector3(0, 100, 0);
  private waypoints: Waypoint[] = [];
  private currentWaypointIndex = 0;
  private currentPhase: ProbePhase = 'IDLE';

  private baseTraverseSpeed = 150.0;
  private baseTouchSpeed = 5.0;

  private animationFrameId: number | null = null;
  private lastTimestamp: number | null = null;
  private listeners: Array<(state: SimulationState) => void> = [];
  private boundObject: THREE.Object3D | null = null;
  private boundOffset: THREE.Vector3 = new THREE.Vector3(0, 20, 0);

  constructor(initialSpeed = 5.0) {
    this.setSpeedMultiplier(initialSpeed);
  }

  public getAvailableSpeeds(): readonly number[] {
    return SUPPORTED_SPEEDS;
  }

  public setSpeedMultiplier(speed: number): void {
    if (speed > 0) {
      this.speedMultiplier = speed;
      this.notifyListeners();
    }
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public getBaseTraverseSpeed(): number {
    return this.baseTraverseSpeed;
  }

  public getBaseTouchSpeed(): number {
    return this.baseTouchSpeed;
  }

  public bindProbeObject(object: THREE.Object3D | null, offset: THREE.Vector3 = new THREE.Vector3(0, 20, 0)): void {
    this.boundObject = object;
    this.boundOffset.copy(offset);
    if (this.boundObject) {
      this.boundObject.position.copy(this.currentPosition).add(this.boundOffset);
    }
  }

  public onUpdate(listener: (state: SimulationState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx !== -1) {
        this.listeners.splice(idx, 1);
      }
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    if (this.boundObject) {
      this.boundObject.position.copy(this.currentPosition).add(this.boundOffset);
    }
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public static wireSpeedButtons(
    containerOrSelector: HTMLElement | string = '.speed-controls',
    controller?: SimulationController,
    onSpeedChange?: (speed: number) => void
  ): () => void {
    if (typeof document === 'undefined') return () => {};
    const container = typeof containerOrSelector === 'string'
      ? document.querySelector<HTMLElement>(containerOrSelector)
      : containerOrSelector;

    const cleanups: Array<() => void> = [];

    if (container) {
      const buttons = container.querySelectorAll<HTMLButtonElement>('button[data-speed]');
      const activeSpeed = controller ? controller.getSpeedMultiplier() : 5.0;

      buttons.forEach((btn) => {
        const speedAttr = btn.getAttribute('data-speed');
        const speedVal = speedAttr ? parseFloat(speedAttr) : 1.0;

        if (Math.abs(speedVal - activeSpeed) < 1e-3) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }

        const clickHandler = () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          if (controller) {
            controller.setSpeedMultiplier(speedVal);
            if (!controller.getState().isPlaying) {
              controller.play();
            }
          }
          if (typeof window !== 'undefined') {
            (window as unknown as { simSpeedMultiplier: number }).simSpeedMultiplier = speedVal;
            const globalCtrl = (window as unknown as { SimulationController?: { setSpeedMultiplier: (s: number) => void } }).SimulationController;
            if (globalCtrl && typeof globalCtrl.setSpeedMultiplier === 'function' && globalCtrl !== (controller as unknown)) {
              globalCtrl.setSpeedMultiplier(speedVal);
            }
          }
          if (onSpeedChange) {
            onSpeedChange(speedVal);
          }
        };

        btn.addEventListener('click', clickHandler);
        cleanups.push(() => btn.removeEventListener('click', clickHandler));
      });
    }

    if (controller) {
      const playBtn = document.getElementById('play-pause-btn') as HTMLButtonElement | null;
      if (playBtn) {
        const playHandler = () => {
          controller.togglePlay();
        };
        playBtn.addEventListener('click', playHandler);
        cleanups.push(() => playBtn.removeEventListener('click', playHandler));
      }

      const timeSlider = document.getElementById('time-slider') as HTMLInputElement | null;
      if (timeSlider) {
        const inputHandler = (e: Event) => {
          const val = parseFloat((e.target as HTMLInputElement).value);
          controller.pause();
          controller.seek(val / 100.0);
        };
        timeSlider.addEventListener('input', inputHandler);
        cleanups.push(() => timeSlider.removeEventListener('input', inputHandler));
      }

      const unsubscribe = controller.onUpdate((state) => {
        if (playBtn) {
          playBtn.innerText = state.isPlaying ? '⏸' : '▶';
        }
        if (timeSlider && document.activeElement !== timeSlider) {
          timeSlider.value = String(Math.floor(state.progress * 100));
        }
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
          const sec = Math.floor(state.progress * 34);
          timeDisplay.innerText = `00:${sec < 10 ? '0' + sec : sec} / 00:34`;
        }
        const hudCoords = document.getElementById('hud-feature-coords');
        if (hudCoords) {
          hudCoords.innerText = `Prob: X: ${state.currentPosition.x.toFixed(2)} mm | Y: ${state.currentPosition.y.toFixed(2)} mm | Z: ${state.currentPosition.z.toFixed(2)} mm | Faz: ${state.phase} | Hız: ${state.speedMultiplier}x`;
        }
        const codeLines = document.querySelectorAll('.code-line');
        if (codeLines.length > 0) {
          const activeLineIdx = Math.min(Math.floor(state.progress * Math.min(codeLines.length, 25)), codeLines.length - 1);
          codeLines.forEach((cl, idx) => {
            cl.classList.toggle('active', idx === activeLineIdx);
          });
        }
      });
      cleanups.push(unsubscribe);
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }

  public setWaypoints(waypoints: Waypoint[]): void {
    this.waypoints = waypoints;
    this.reset();
  }

  public getWaypoints(): Waypoint[] {
    return this.waypoints;
  }

  private ensureDefaultWaypoints(): void {
    if (this.waypoints.length === 0) {
      const defaultPts: Waypoint[] = [
        { position: new THREE.Vector3(50, 115, 25), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(20, 115, 20), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(20, 50, 20), phase: 'TOUCH' },
        { position: new THREE.Vector3(20, 65, 20), phase: 'RETRACT' },
        { position: new THREE.Vector3(50, 115, 25), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(80, 115, 20), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(80, 50, 20), phase: 'TOUCH' },
        { position: new THREE.Vector3(80, 65, 20), phase: 'RETRACT' },
        { position: new THREE.Vector3(50, 115, 25), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(50, 115, 80), phase: 'TRAVERSE' },
        { position: new THREE.Vector3(50, 50, 80), phase: 'TOUCH' },
        { position: new THREE.Vector3(50, 65, 80), phase: 'RETRACT' },
        { position: new THREE.Vector3(50, 115, 25), phase: 'TRAVERSE' },
      ];
      this.waypoints = defaultPts;
      this.currentPosition.copy(defaultPts[0].position);
    }
  }

  public play(): void {
    if (this.waypoints.length === 0) {
      this.ensureDefaultWaypoints();
    }
    if (this.waypoints.length > 0) {
      this.isPlaying = true;
      if (this.currentPhase === 'IDLE' || this.currentPhase === 'COMPLETED') {
        this.currentWaypointIndex = this.waypoints.length > 1 ? 1 : 0;
        this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
      }
      this.startLoop();
      this.notifyListeners();
    }
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopLoop();
    this.notifyListeners();
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public reset(): void {
    this.pause();
    if (this.waypoints.length > 0) {
      this.currentPosition.copy(this.waypoints[0].position);
      this.currentWaypointIndex = this.waypoints.length > 1 ? 1 : 0;
      this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
    } else {
      this.currentPosition.set(0, 100, 0);
      this.currentWaypointIndex = 0;
      this.currentPhase = 'IDLE';
    }
    this.notifyListeners();
  }

  private startLoop(): void {
    if (this.animationFrameId !== null || typeof requestAnimationFrame === 'undefined') return;
    this.lastTimestamp = null;

    const tick = (timestamp: number) => {
      if (!this.isPlaying) {
        this.animationFrameId = null;
        this.lastTimestamp = null;
        return;
      }

      if (this.lastTimestamp !== null) {
        const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.update(deltaTime);
      }
      this.lastTimestamp = timestamp;

      if (this.isPlaying) {
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        this.animationFrameId = null;
        this.lastTimestamp = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.lastTimestamp = null;
  }

  public update(deltaTime: number): SimulationState {
    if (!this.isPlaying || this.waypoints.length === 0 || this.currentWaypointIndex >= this.waypoints.length) {
      return this.getState();
    }

    const effectiveDelta = deltaTime * this.speedMultiplier;
    const targetWaypoint = this.waypoints[this.currentWaypointIndex];
    this.currentPhase = targetWaypoint.phase;

    const currentSpeed = this.currentPhase === 'TOUCH' ? this.baseTouchSpeed : this.baseTraverseSpeed;
    const maxMoveDistance = currentSpeed * effectiveDelta;

    const toTarget = new THREE.Vector3().subVectors(targetWaypoint.position, this.currentPosition);
    const distanceToTarget = toTarget.length();

    if (distanceToTarget <= maxMoveDistance || distanceToTarget < 1e-4) {
      this.currentPosition.copy(targetWaypoint.position);
      this.currentWaypointIndex += 1;

      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.isPlaying = false;
        this.currentPhase = 'COMPLETED';
        this.stopLoop();
      } else {
        this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
      }
    } else {
      const step = toTarget.normalize().multiplyScalar(maxMoveDistance);
      this.currentPosition.add(step);
    }

    this.notifyListeners();
    return this.getState();
  }

  public seek(progress: number): SimulationState {
    const clamped = Math.max(0, Math.min(1.0, progress));
    if (this.waypoints.length === 0) {
      return this.getState();
    }
    if (this.waypoints.length === 1) {
      this.currentPosition.copy(this.waypoints[0].position);
      this.currentWaypointIndex = 0;
      this.currentPhase = this.waypoints[0].phase;
      this.notifyListeners();
      return this.getState();
    }

    const totalSegments = this.waypoints.length - 1;
    const floatIndex = clamped * totalSegments;
    const segmentIndex = Math.min(Math.floor(floatIndex), totalSegments - 1);
    const alpha = floatIndex - segmentIndex;

    const p1 = this.waypoints[segmentIndex].position;
    const p2 = this.waypoints[segmentIndex + 1].position;
    this.currentPosition.lerpVectors(p1, p2, alpha);
    this.currentWaypointIndex = Math.min(segmentIndex + 1, this.waypoints.length - 1);
    this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;

    this.notifyListeners();
    return this.getState();
  }

  public getState(): SimulationState {
    const totalWaypoints = this.waypoints.length;
    const progress = totalWaypoints > 1 ? Math.min(1.0, this.currentWaypointIndex / (totalWaypoints - 1)) : (totalWaypoints === 1 ? 1.0 : 0);

    return {
      currentPosition: this.currentPosition.clone(),
      phase: this.currentPhase,
      progress,
      speedMultiplier: this.speedMultiplier,
      currentWaypointIndex: this.currentWaypointIndex,
      isPlaying: this.isPlaying,
    };
  }

  public destroy(): void {
    this.pause();
    this.listeners = [];
    this.boundObject = null;
  }
}
