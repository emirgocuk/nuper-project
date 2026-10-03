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
  private speedMultiplier = 1.0;
  private isPlaying = false;
  private currentPosition: THREE.Vector3 = new THREE.Vector3(0, 100, 0);
  private waypoints: Waypoint[] = [];
  private currentWaypointIndex = 0;
  private currentPhase: ProbePhase = 'IDLE';

  private baseTraverseSpeed = 100.0; // mm/s
  private baseTouchSpeed = 5.0; // mm/s

  constructor(initialSpeed = 1.0) {
    this.setSpeedMultiplier(initialSpeed);
  }

  public getAvailableSpeeds(): readonly number[] {
    return SUPPORTED_SPEEDS;
  }

  public setSpeedMultiplier(speed: number): void {
    if (speed > 0) {
      this.speedMultiplier = speed;
    }
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public setWaypoints(waypoints: Waypoint[]): void {
    this.waypoints = waypoints;
    this.reset();
  }

  public getWaypoints(): Waypoint[] {
    return this.waypoints;
  }

  public play(): void {
    if (this.waypoints.length > 0) {
      this.isPlaying = true;
      if (this.currentPhase === 'IDLE' || this.currentPhase === 'COMPLETED') {
        this.currentWaypointIndex = this.waypoints.length > 1 ? 1 : 0;
        this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
      }
    }
  }

  public pause(): void {
    this.isPlaying = false;
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
    this.isPlaying = false;
    if (this.waypoints.length > 0) {
      this.currentPosition.copy(this.waypoints[0].position);
      this.currentWaypointIndex = this.waypoints.length > 1 ? 1 : 0;
      this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
    } else {
      this.currentPosition.set(0, 100, 0);
      this.currentWaypointIndex = 0;
      this.currentPhase = 'IDLE';
    }
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
      } else {
        this.currentPhase = this.waypoints[this.currentWaypointIndex].phase;
      }
    } else {
      const step = toTarget.normalize().multiplyScalar(maxMoveDistance);
      this.currentPosition.add(step);
    }

    return this.getState();
  }

  public getState(): SimulationState {
    const totalWaypoints = this.waypoints.length;
    const progress = totalWaypoints > 0 ? Math.min(1.0, this.currentWaypointIndex / totalWaypoints) : 0;

    return {
      currentPosition: this.currentPosition.clone(),
      phase: this.currentPhase,
      progress,
      speedMultiplier: this.speedMultiplier,
      currentWaypointIndex: this.currentWaypointIndex,
      isPlaying: this.isPlaying,
    };
  }
}
