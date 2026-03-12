# threejs-animation
Source: https://antigravity.codes/agent-skills/creative/threejs-animation

## AI Worker Instructions
When the user requests functionality related to threejs-animation, follow these guidelines and utilize this context.

## Scraped Content

# threejs-animation
```
import * as THREE from "three";// Simple procedural animationconst clock = new THREE.Clock();function animate() {  const delta = clock.getDelta();  const elapsed = clock.getElapsedTime();  mesh.rotation.y += delta;  mesh.position.y = Math.sin(elapsed) * 0.5;  requestAnimationFrame(animate);  renderer.render(scene, camera);}animate();
```
```
import * as THREE from "three";// Simple procedural animationconst clock = new THREE.Clock();function animate() {  const delta = clock.getDelta();  const elapsed = clock.getElapsedTime();  mesh.rotation.y += delta;  mesh.position.y = Math.sin(elapsed) * 0.5;  requestAnimationFrame(animate);  renderer.render(scene, camera);}animate();
```
```
// Create animation clipconst times = [0, 1, 2]; // Keyframe times (seconds)const values = [0, 1, 0]; // Values at each keyframeconst track = new THREE.NumberKeyframeTrack(  ".position[y]", // Property path  times,  values,);const clip = new THREE.AnimationClip("bounce", 2, [track]);
```
```
// Create animation clipconst times = [0, 1, 2]; // Keyframe times (seconds)const values = [0, 1, 0]; // Values at each keyframeconst track = new THREE.NumberKeyframeTrack(  ".position[y]", // Property path  times,  values,);const clip = new THREE.AnimationClip("bounce", 2, [track]);
```
```
// Number track (single value)new THREE.NumberKeyframeTrack(".opacity", times, [1, 0]);new THREE.NumberKeyframeTrack(".material.opacity", times, [1, 0]);// Vector track (position, scale)new THREE.VectorKeyframeTrack(".position", times, [  0,  0,  0, // t=0  1,  2,  0, // t=1  0,  0,  0, // t=2]);// Quaternion track (rotation)const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));new THREE.QuaternionKeyframeTrack(  ".quaternion",  [0, 1],  [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w],);// Color tracknew THREE.ColorKeyframeTrack(".material.color", times, [  1,  0,  0, // red  0,  1,  0, // green  0,  0,  1, // blue]);// Boolean tracknew THREE.BooleanKeyframeTrack(".visible", [0, 0.5, 1], [true, false, true]);// String track (for morph targets)new THREE.StringKeyframeTrack(  ".morphTargetInfluences[smile]",  [0, 1],  ["0", "1"],);
```
```
// Number track (single value)new THREE.NumberKeyframeTrack(".opacity", times, [1, 0]);new THREE.NumberKeyframeTrack(".material.opacity", times, [1, 0]);// Vector track (position, scale)new THREE.VectorKeyframeTrack(".position", times, [  0,  0,  0, // t=0  1,  2,  0, // t=1  0,  0,  0, // t=2]);// Quaternion track (rotation)const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));new THREE.QuaternionKeyframeTrack(  ".quaternion",  [0, 1],  [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w],);// Color tracknew THREE.ColorKeyframeTrack(".material.color", times, [  1,  0,  0, // red  0,  1,  0, // green  0,  0,  1, // blue]);// Boolean tracknew THREE.BooleanKeyframeTrack(".visible", [0, 0.5, 1], [true, false, true]);// String track (for morph targets)new THREE.StringKeyframeTrack(  ".morphTargetInfluences[smile]",  [0, 1],  ["0", "1"],);
```
```
const track = new THREE.VectorKeyframeTrack(".position", times, values);// Interpolationtrack.setInterpolation(THREE.InterpolateLinear); // Defaulttrack.setInterpolation(THREE.InterpolateSmooth); // Cubic splinetrack.setInterpolation(THREE.InterpolateDiscrete); // Step function
```
```
const track = new THREE.VectorKeyframeTrack(".position", times, values);// Interpolationtrack.setInterpolation(THREE.InterpolateLinear); // Defaulttrack.setInterpolation(THREE.InterpolateSmooth); // Cubic splinetrack.setInterpolation(THREE.InterpolateDiscrete); // Step function
```
```
const mixer = new THREE.AnimationMixer(model);// Create action from clipconst action = mixer.clipAction(clip);action.play();// Update in animation loopfunction animate() {  const delta = clock.getDelta();  mixer.update(delta); // Required!  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
const mixer = new THREE.AnimationMixer(model);// Create action from clipconst action = mixer.clipAction(clip);action.play();// Update in animation loopfunction animate() {  const delta = clock.getDelta();  mixer.update(delta); // Required!  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
mixer.addEventListener("finished", (e) => {  console.log("Animation finished:", e.action.getClip().name);});mixer.addEventListener("loop", (e) => {  console.log("Animation looped:", e.action.getClip().name);});
```
```
mixer.addEventListener("finished", (e) => {  console.log("Animation finished:", e.action.getClip().name);});mixer.addEventListener("loop", (e) => {  console.log("Animation looped:", e.action.getClip().name);});
```
```
const action = mixer.clipAction(clip);// Playback controlaction.play();action.stop();action.reset();action.halt(fadeOutDuration);// Playback stateaction.isRunning();action.isScheduled();// Time controlaction.time = 0.5; // Current timeaction.timeScale = 1; // Playback speed (negative = reverse)action.paused = false;// Weight (for blending)action.weight = 1; // 0-1, contribution to final poseaction.setEffectiveWeight(1);// Loop modesaction.loop = THREE.LoopRepeat; // Default: loop foreveraction.loop = THREE.LoopOnce; // Play once and stopaction.loop = THREE.LoopPingPong; // Alternate forward/backwardaction.repetitions = 3; // Number of loops (Infinity default)// Clampingaction.clampWhenFinished = true; // Hold last frame when done// Blendingaction.blendMode = THREE.NormalAnimationBlendMode;action.blendMode = THREE.AdditiveAnimationBlendMode;
```
```
const action = mixer.clipAction(clip);// Playback controlaction.play();action.stop();action.reset();action.halt(fadeOutDuration);// Playback stateaction.isRunning();action.isScheduled();// Time controlaction.time = 0.5; // Current timeaction.timeScale = 1; // Playback speed (negative = reverse)action.paused = false;// Weight (for blending)action.weight = 1; // 0-1, contribution to final poseaction.setEffectiveWeight(1);// Loop modesaction.loop = THREE.LoopRepeat; // Default: loop foreveraction.loop = THREE.LoopOnce; // Play once and stopaction.loop = THREE.LoopPingPong; // Alternate forward/backwardaction.repetitions = 3; // Number of loops (Infinity default)// Clampingaction.clampWhenFinished = true; // Hold last frame when done// Blendingaction.blendMode = THREE.NormalAnimationBlendMode;action.blendMode = THREE.AdditiveAnimationBlendMode;
```
```
// Fade inaction.reset().fadeIn(0.5).play();// Fade outaction.fadeOut(0.5);// Crossfade between animationsconst action1 = mixer.clipAction(clip1);const action2 = mixer.clipAction(clip2);action1.play();// Later, crossfade to action2action1.crossFadeTo(action2, 0.5, true);action2.play();
```
```
// Fade inaction.reset().fadeIn(0.5).play();// Fade outaction.fadeOut(0.5);// Crossfade between animationsconst action1 = mixer.clipAction(clip1);const action2 = mixer.clipAction(clip2);action1.play();// Later, crossfade to action2action1.crossFadeTo(action2, 0.5, true);action2.play();
```
```
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";const loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  const model = gltf.scene;  scene.add(model);  // Create mixer  const mixer = new THREE.AnimationMixer(model);  // Get all clips  const clips = gltf.animations;  console.log(    "Available animations:",    clips.map((c) => c.name),  );  // Play first animation  if (clips.length > 0) {    const action = mixer.clipAction(clips[0]);    action.play();  }  // Play specific animation by name  const walkClip = THREE.AnimationClip.findByName(clips, "Walk");  if (walkClip) {    mixer.clipAction(walkClip).play();  }  // Store mixer for update loop  window.mixer = mixer;});// Animation loopfunction animate() {  const delta = clock.getDelta();  if (window.mixer) window.mixer.update(delta);  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";const loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  const model = gltf.scene;  scene.add(model);  // Create mixer  const mixer = new THREE.AnimationMixer(model);  // Get all clips  const clips = gltf.animations;  console.log(    "Available animations:",    clips.map((c) => c.name),  );  // Play first animation  if (clips.length > 0) {    const action = mixer.clipAction(clips[0]);    action.play();  }  // Play specific animation by name  const walkClip = THREE.AnimationClip.findByName(clips, "Walk");  if (walkClip) {    mixer.clipAction(walkClip).play();  }  // Store mixer for update loop  window.mixer = mixer;});// Animation loopfunction animate() {  const delta = clock.getDelta();  if (window.mixer) window.mixer.update(delta);  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
// Access skeleton from skinned meshconst skinnedMesh = model.getObjectByProperty("type", "SkinnedMesh");const skeleton = skinnedMesh.skeleton;// Access bonesskeleton.bones.forEach((bone) => {  console.log(bone.name, bone.position, bone.rotation);});// Find specific bone by nameconst headBone = skeleton.bones.find((b) => b.name === "Head");if (headBone) headBone.rotation.y = Math.PI / 4; // Turn head// Skeleton helperconst helper = new THREE.SkeletonHelper(model);scene.add(helper);
```
```
// Access skeleton from skinned meshconst skinnedMesh = model.getObjectByProperty("type", "SkinnedMesh");const skeleton = skinnedMesh.skeleton;// Access bonesskeleton.bones.forEach((bone) => {  console.log(bone.name, bone.position, bone.rotation);});// Find specific bone by nameconst headBone = skeleton.bones.find((b) => b.name === "Head");if (headBone) headBone.rotation.y = Math.PI / 4; // Turn head// Skeleton helperconst helper = new THREE.SkeletonHelper(model);scene.add(helper);
```
```
function animate() {  const time = clock.getElapsedTime();  // Animate bone  const headBone = skeleton.bones.find((b) => b.name === "Head");  if (headBone) {    headBone.rotation.y = Math.sin(time) * 0.3;  }  // Update mixer if also playing clips  mixer.update(clock.getDelta());}
```
```
function animate() {  const time = clock.getElapsedTime();  // Animate bone  const headBone = skeleton.bones.find((b) => b.name === "Head");  if (headBone) {    headBone.rotation.y = Math.sin(time) * 0.3;  }  // Update mixer if also playing clips  mixer.update(clock.getDelta());}
```
```
// Attach object to boneconst weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);const handBone = skeleton.bones.find((b) => b.name === "RightHand");if (handBone) handBone.add(weapon);// Offset attachmentweapon.position.set(0, 0, 0.5);weapon.rotation.set(0, Math.PI / 2, 0);
```
```
// Attach object to boneconst weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);const handBone = skeleton.bones.find((b) => b.name === "RightHand");if (handBone) handBone.add(weapon);// Offset attachmentweapon.position.set(0, 0, 0.5);weapon.rotation.set(0, Math.PI / 2, 0);
```
```
// Morph targets are stored in geometryconst geometry = mesh.geometry;console.log("Morph attributes:", Object.keys(geometry.morphAttributes));// Access morph target influencesmesh.morphTargetInfluences; // Array of weightsmesh.morphTargetDictionary; // Name -> index mapping// Set morph target by indexmesh.morphTargetInfluences[0] = 0.5;// Set by nameconst smileIndex = mesh.morphTargetDictionary["smile"];mesh.morphTargetInfluences[smileIndex] = 1;
```
```
// Morph targets are stored in geometryconst geometry = mesh.geometry;console.log("Morph attributes:", Object.keys(geometry.morphAttributes));// Access morph target influencesmesh.morphTargetInfluences; // Array of weightsmesh.morphTargetDictionary; // Name -> index mapping// Set morph target by indexmesh.morphTargetInfluences[0] = 0.5;// Set by nameconst smileIndex = mesh.morphTargetDictionary["smile"];mesh.morphTargetInfluences[smileIndex] = 1;
```
```
// Proceduralfunction animate() {  const t = clock.getElapsedTime();  mesh.morphTargetInfluences[0] = (Math.sin(t) + 1) / 2;}// With keyframe animationconst track = new THREE.NumberKeyframeTrack(  ".morphTargetInfluences[smile]",  [0, 0.5, 1],  [0, 1, 0],);const clip = new THREE.AnimationClip("smile", 1, [track]);mixer.clipAction(clip).play();
```
```
// Proceduralfunction animate() {  const t = clock.getElapsedTime();  mesh.morphTargetInfluences[0] = (Math.sin(t) + 1) / 2;}// With keyframe animationconst track = new THREE.NumberKeyframeTrack(  ".morphTargetInfluences[smile]",  [0, 0.5, 1],  [0, 1, 0],);const clip = new THREE.AnimationClip("smile", 1, [track]);mixer.clipAction(clip).play();
```
```
// Setup actionsconst idleAction = mixer.clipAction(idleClip);const walkAction = mixer.clipAction(walkClip);const runAction = mixer.clipAction(runClip);// Play all with different weightsidleAction.play();walkAction.play();runAction.play();// Set initial weightsidleAction.setEffectiveWeight(1);walkAction.setEffectiveWeight(0);runAction.setEffectiveWeight(0);// Blend based on speedfunction updateAnimations(speed) {  if (speed < 0.1) {    idleAction.setEffectiveWeight(1);    walkAction.setEffectiveWeight(0);    runAction.setEffectiveWeight(0);  } else if (speed < 5) {    const t = speed / 5;    idleAction.setEffectiveWeight(1 - t);    walkAction.setEffectiveWeight(t);    runAction.setEffectiveWeight(0);  } else {    const t = Math.min((speed - 5) / 5, 1);    idleAction.setEffectiveWeight(0);    walkAction.setEffectiveWeight(1 - t);    runAction.setEffectiveWeight(t);  }}
```
```
// Setup actionsconst idleAction = mixer.clipAction(idleClip);const walkAction = mixer.clipAction(walkClip);const runAction = mixer.clipAction(runClip);// Play all with different weightsidleAction.play();walkAction.play();runAction.play();// Set initial weightsidleAction.setEffectiveWeight(1);walkAction.setEffectiveWeight(0);runAction.setEffectiveWeight(0);// Blend based on speedfunction updateAnimations(speed) {  if (speed < 0.1) {    idleAction.setEffectiveWeight(1);    walkAction.setEffectiveWeight(0);    runAction.setEffectiveWeight(0);  } else if (speed < 5) {    const t = speed / 5;    idleAction.setEffectiveWeight(1 - t);    walkAction.setEffectiveWeight(t);    runAction.setEffectiveWeight(0);  } else {    const t = Math.min((speed - 5) / 5, 1);    idleAction.setEffectiveWeight(0);    walkAction.setEffectiveWeight(1 - t);    runAction.setEffectiveWeight(t);  }}
```
```
// Base poseconst baseAction = mixer.clipAction(baseClip);baseAction.play();// Additive layer (e.g., breathing)const additiveAction = mixer.clipAction(additiveClip);additiveAction.blendMode = THREE.AdditiveAnimationBlendMode;additiveAction.play();// Convert clip to additiveTHREE.AnimationUtils.makeClipAdditive(additiveClip);
```
```
// Base poseconst baseAction = mixer.clipAction(baseClip);baseAction.play();// Additive layer (e.g., breathing)const additiveAction = mixer.clipAction(additiveClip);additiveAction.blendMode = THREE.AdditiveAnimationBlendMode;additiveAction.play();// Convert clip to additiveTHREE.AnimationUtils.makeClipAdditive(additiveClip);
```
```
import * as THREE from "three";// Find clip by nameconst clip = THREE.AnimationClip.findByName(clips, "Walk");// Create subclipconst subclip = THREE.AnimationUtils.subclip(clip, "subclip", 0, 30, 30);// Convert to additiveTHREE.AnimationUtils.makeClipAdditive(clip);THREE.AnimationUtils.makeClipAdditive(clip, 0, referenceClip);// Clone clipconst clone = clip.clone();// Get clip durationclip.duration;// Optimize clip (remove redundant keyframes)clip.optimize();// Reset clip to first frameclip.resetDuration();
```
```
import * as THREE from "three";// Find clip by nameconst clip = THREE.AnimationClip.findByName(clips, "Walk");// Create subclipconst subclip = THREE.AnimationUtils.subclip(clip, "subclip", 0, 30, 30);// Convert to additiveTHREE.AnimationUtils.makeClipAdditive(clip);THREE.AnimationUtils.makeClipAdditive(clip, 0, referenceClip);// Clone clipconst clone = clip.clone();// Get clip durationclip.duration;// Optimize clip (remove redundant keyframes)clip.optimize();// Reset clip to first frameclip.resetDuration();
```
```
// Smooth follow/lerpconst target = new THREE.Vector3();const current = new THREE.Vector3();const velocity = new THREE.Vector3();function smoothDamp(current, target, velocity, smoothTime, deltaTime) {  const omega = 2 / smoothTime;  const x = omega * deltaTime;  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);  const change = current.clone().sub(target);  const temp = velocity    .clone()    .add(change.clone().multiplyScalar(omega))    .multiplyScalar(deltaTime);  velocity.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);  return target.clone().add(change.add(temp).multiplyScalar(exp));}function animate() {  current.copy(smoothDamp(current, target, velocity, 0.3, delta));  mesh.position.copy(current);}
```
```
// Smooth follow/lerpconst target = new THREE.Vector3();const current = new THREE.Vector3();const velocity = new THREE.Vector3();function smoothDamp(current, target, velocity, smoothTime, deltaTime) {  const omega = 2 / smoothTime;  const x = omega * deltaTime;  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);  const change = current.clone().sub(target);  const temp = velocity    .clone()    .add(change.clone().multiplyScalar(omega))    .multiplyScalar(deltaTime);  velocity.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);  return target.clone().add(change.add(temp).multiplyScalar(exp));}function animate() {  current.copy(smoothDamp(current, target, velocity, 0.3, delta));  mesh.position.copy(current);}
```
```
class Spring {  constructor(stiffness = 100, damping = 10) {    this.stiffness = stiffness;    this.damping = damping;    this.position = 0;    this.velocity = 0;    this.target = 0;  }  update(dt) {    const force = -this.stiffness * (this.position - this.target);    const dampingForce = -this.damping * this.velocity;    this.velocity += (force + dampingForce) * dt;    this.position += this.velocity * dt;    return this.position;  }}const spring = new Spring(100, 10);spring.target = 1;function animate() {  mesh.position.y = spring.update(delta);}
```
```
class Spring {  constructor(stiffness = 100, damping = 10) {    this.stiffness = stiffness;    this.damping = damping;    this.position = 0;    this.velocity = 0;    this.target = 0;  }  update(dt) {    const force = -this.stiffness * (this.position - this.target);    const dampingForce = -this.damping * this.velocity;    this.velocity += (force + dampingForce) * dt;    this.position += this.velocity * dt;    return this.position;  }}const spring = new Spring(100, 10);spring.target = 1;function animate() {  mesh.position.y = spring.update(delta);}
```
```
function animate() {  const t = clock.getElapsedTime();  // Sine wave  mesh.position.y = Math.sin(t * 2) * 0.5;  // Bouncing  mesh.position.y = Math.abs(Math.sin(t * 3)) * 2;  // Circular motion  mesh.position.x = Math.cos(t) * 2;  mesh.position.z = Math.sin(t) * 2;  // Figure 8  mesh.position.x = Math.sin(t) * 2;  mesh.position.z = Math.sin(t * 2) * 1;}
```
```
function animate() {  const t = clock.getElapsedTime();  // Sine wave  mesh.position.y = Math.sin(t * 2) * 0.5;  // Bouncing  mesh.position.y = Math.abs(Math.sin(t * 3)) * 2;  // Circular motion  mesh.position.x = Math.cos(t) * 2;  mesh.position.z = Math.sin(t) * 2;  // Figure 8  mesh.position.x = Math.sin(t) * 2;  mesh.position.z = Math.sin(t * 2) * 1;}
```
```
clip.optimize()
```
```
// Pause animation when not visiblemesh.onBeforeRender = () => {  action.paused = false;};mesh.onAfterRender = () => {  // Check if will be visible next frame  if (!isInFrustum(mesh)) {    action.paused = true;  }};// Cache clipsconst clipCache = new Map();function getClip(name) {  if (!clipCache.has(name)) {    clipCache.set(name, loadClip(name));  }  return clipCache.get(name);}
```
```
// Pause animation when not visiblemesh.onBeforeRender = () => {  action.paused = false;};mesh.onAfterRender = () => {  // Check if will be visible next frame  if (!isInFrustum(mesh)) {    action.paused = true;  }};// Cache clipsconst clipCache = new Map();function getClip(name) {  if (!clipCache.has(name)) {    clipCache.set(name, loadClip(name));  }  return clipCache.get(name);}
```
```
threejs-loaders
```
```
threejs-fundamentals
```
```
threejs-shaders
```
The Three.js Animation skill empowers developers to bring static 3D scenes to life with fluid motion and engaging interactions. From simple object rotations to complex character movements and dynamic visual effects, this capability streamlines the process of implementing sophisticated animations within your web projects. It provides a structured approach to leveraging Three.js's robust animation system, making it easier to orchestrate timed events, blend sequences, and create compelling user experiences. Dive into advanced techniques like morph targets and skeletal rigging to achieve professional-grade animated content efficiently.

# When to Use This Skill
- •Animating interactive 3D product configurators with dynamic object states.
- •Playing pre-baked GLTF character animations (e.g., walk, run, idle) in a web-based game or simulation.
- •Creating dynamic data visualizations with animated transitions between states or values.
- •Blending multiple character animations seamlessly, such as combining a 'walk' cycle with an 'aim' pose.

# Pro Tips
- 💡Optimize performance by baking complex animations into GLTF files and using `AnimationMixer` efficiently, especially for large scenes with many animated objects.
- 💡Master the interplay between `AnimationClip`, `AnimationMixer`, and `AnimationAction` for granular control over animation playback speed, looping, and blending.
- 💡Leverage procedural animation for subtle, reactive movements that don't require pre-rendered keyframes, often combined with `THREE.Clock` for delta time calculations.

