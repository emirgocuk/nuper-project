# threejs-interaction
Source: https://antigravity.codes/agent-skills/ui-design/threejs-interaction

## AI Worker Instructions
When the user requests functionality related to threejs-interaction, follow these guidelines and utilize this context.

## Scraped Content

# threejs-interaction
```
import * as THREE from "three";import { OrbitControls } from "three/addons/controls/OrbitControls.js";// Camera controlsconst controls = new OrbitControls(camera, renderer.domElement);controls.enableDamping = true;// Raycasting for click detectionconst raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();function onClick(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(scene.children);  if (intersects.length > 0) {    console.log("Clicked:", intersects[0].object);  }}window.addEventListener("click", onClick);
```
```
import * as THREE from "three";import { OrbitControls } from "three/addons/controls/OrbitControls.js";// Camera controlsconst controls = new OrbitControls(camera, renderer.domElement);controls.enableDamping = true;// Raycasting for click detectionconst raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();function onClick(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(scene.children);  if (intersects.length > 0) {    console.log("Clicked:", intersects[0].object);  }}window.addEventListener("click", onClick);
```
```
const raycaster = new THREE.Raycaster();// From camera (mouse picking)raycaster.setFromCamera(mousePosition, camera);// From any origin and directionraycaster.set(origin, direction); // origin: Vector3, direction: normalized Vector3// Get intersectionsconst intersects = raycaster.intersectObjects(objects, recursive);// intersects array contains:// {//   distance: number,          // Distance from ray origin//   point: Vector3,            // Intersection point in world coords//   face: Face3,               // Intersected face//   faceIndex: number,         // Face index//   object: Object3D,          // Intersected object//   uv: Vector2,               // UV coordinates at intersection//   uv1: Vector2,              // Second UV channel//   normal: Vector3,           // Interpolated face normal//   instanceId: number         // For InstancedMesh// }
```
```
const raycaster = new THREE.Raycaster();// From camera (mouse picking)raycaster.setFromCamera(mousePosition, camera);// From any origin and directionraycaster.set(origin, direction); // origin: Vector3, direction: normalized Vector3// Get intersectionsconst intersects = raycaster.intersectObjects(objects, recursive);// intersects array contains:// {//   distance: number,          // Distance from ray origin//   point: Vector3,            // Intersection point in world coords//   face: Face3,               // Intersected face//   faceIndex: number,         // Face index//   object: Object3D,          // Intersected object//   uv: Vector2,               // UV coordinates at intersection//   uv1: Vector2,              // Second UV channel//   normal: Vector3,           // Interpolated face normal//   instanceId: number         // For InstancedMesh// }
```
```
const mouse = new THREE.Vector2();function updateMouse(event) {  // For full window  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;}// For specific canvas elementfunction updateMouseCanvas(event, canvas) {  const rect = canvas.getBoundingClientRect();  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;}
```
```
const mouse = new THREE.Vector2();function updateMouse(event) {  // For full window  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;}// For specific canvas elementfunction updateMouseCanvas(event, canvas) {  const rect = canvas.getBoundingClientRect();  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;}
```
```
function onTouchStart(event) {  event.preventDefault();  if (event.touches.length === 1) {    const touch = event.touches[0];    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;    raycaster.setFromCamera(mouse, camera);    const intersects = raycaster.intersectObjects(clickableObjects);    if (intersects.length > 0) {      handleSelection(intersects[0]);    }  }}renderer.domElement.addEventListener("touchstart", onTouchStart);
```
```
function onTouchStart(event) {  event.preventDefault();  if (event.touches.length === 1) {    const touch = event.touches[0];    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;    raycaster.setFromCamera(mouse, camera);    const intersects = raycaster.intersectObjects(clickableObjects);    if (intersects.length > 0) {      handleSelection(intersects[0]);    }  }}renderer.domElement.addEventListener("touchstart", onTouchStart);
```
```
const raycaster = new THREE.Raycaster();// Near/far clipping (default: 0, Infinity)raycaster.near = 0;raycaster.far = 100;// Line/Points precisionraycaster.params.Line.threshold = 0.1;raycaster.params.Points.threshold = 0.1;// Layers (only intersect objects on specific layers)raycaster.layers.set(1);
```
```
const raycaster = new THREE.Raycaster();// Near/far clipping (default: 0, Infinity)raycaster.near = 0;raycaster.far = 100;// Line/Points precisionraycaster.params.Line.threshold = 0.1;raycaster.params.Points.threshold = 0.1;// Layers (only intersect objects on specific layers)raycaster.layers.set(1);
```
```
// Only check specific objectsconst clickables = [mesh1, mesh2, mesh3];const intersects = raycaster.intersectObjects(clickables, false);// Use layers for filteringmesh1.layers.set(1); // Clickable layerraycaster.layers.set(1);// Throttle raycast for hover effectslet lastRaycast = 0;function onMouseMove(event) {  const now = Date.now();  if (now - lastRaycast < 50) return; // 20fps max  lastRaycast = now;  // Raycast here}
```
```
// Only check specific objectsconst clickables = [mesh1, mesh2, mesh3];const intersects = raycaster.intersectObjects(clickables, false);// Use layers for filteringmesh1.layers.set(1); // Clickable layerraycaster.layers.set(1);// Throttle raycast for hover effectslet lastRaycast = 0;function onMouseMove(event) {  const now = Date.now();  if (now - lastRaycast < 50) return; // 20fps max  lastRaycast = now;  // Raycast here}
```
```
import { OrbitControls } from "three/addons/controls/OrbitControls.js";const controls = new OrbitControls(camera, renderer.domElement);// Damping (smooth movement)controls.enableDamping = true;controls.dampingFactor = 0.05;// Rotation limitscontrols.minPolarAngle = 0; // Topcontrols.maxPolarAngle = Math.PI / 2; // Horizoncontrols.minAzimuthAngle = -Math.PI / 4; // Leftcontrols.maxAzimuthAngle = Math.PI / 4; // Right// Zoom limitscontrols.minDistance = 2;controls.maxDistance = 50;// Enable/disable featurescontrols.enableRotate = true;controls.enableZoom = true;controls.enablePan = true;// Auto-rotatecontrols.autoRotate = true;controls.autoRotateSpeed = 2.0;// Target (orbit point)controls.target.set(0, 1, 0);// Update in animation loopfunction animate() {  controls.update(); // Required for damping and auto-rotate  renderer.render(scene, camera);}
```
```
import { OrbitControls } from "three/addons/controls/OrbitControls.js";const controls = new OrbitControls(camera, renderer.domElement);// Damping (smooth movement)controls.enableDamping = true;controls.dampingFactor = 0.05;// Rotation limitscontrols.minPolarAngle = 0; // Topcontrols.maxPolarAngle = Math.PI / 2; // Horizoncontrols.minAzimuthAngle = -Math.PI / 4; // Leftcontrols.maxAzimuthAngle = Math.PI / 4; // Right// Zoom limitscontrols.minDistance = 2;controls.maxDistance = 50;// Enable/disable featurescontrols.enableRotate = true;controls.enableZoom = true;controls.enablePan = true;// Auto-rotatecontrols.autoRotate = true;controls.autoRotateSpeed = 2.0;// Target (orbit point)controls.target.set(0, 1, 0);// Update in animation loopfunction animate() {  controls.update(); // Required for damping and auto-rotate  renderer.render(scene, camera);}
```
```
import { FlyControls } from "three/addons/controls/FlyControls.js";const controls = new FlyControls(camera, renderer.domElement);controls.movementSpeed = 10;controls.rollSpeed = Math.PI / 24;controls.dragToLook = true;// Update with deltafunction animate() {  controls.update(clock.getDelta());  renderer.render(scene, camera);}
```
```
import { FlyControls } from "three/addons/controls/FlyControls.js";const controls = new FlyControls(camera, renderer.domElement);controls.movementSpeed = 10;controls.rollSpeed = Math.PI / 24;controls.dragToLook = true;// Update with deltafunction animate() {  controls.update(clock.getDelta());  renderer.render(scene, camera);}
```
```
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";const controls = new FirstPersonControls(camera, renderer.domElement);controls.movementSpeed = 10;controls.lookSpeed = 0.1;controls.lookVertical = true;controls.constrainVertical = true;controls.verticalMin = Math.PI / 4;controls.verticalMax = (Math.PI * 3) / 4;function animate() {  controls.update(clock.getDelta());}
```
```
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";const controls = new FirstPersonControls(camera, renderer.domElement);controls.movementSpeed = 10;controls.lookSpeed = 0.1;controls.lookVertical = true;controls.constrainVertical = true;controls.verticalMin = Math.PI / 4;controls.verticalMax = (Math.PI * 3) / 4;function animate() {  controls.update(clock.getDelta());}
```
```
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";const controls = new PointerLockControls(camera, document.body);// Lock pointer on clickdocument.addEventListener("click", () => {  controls.lock();});controls.addEventListener("lock", () => {  console.log("Pointer locked");});controls.addEventListener("unlock", () => {  console.log("Pointer unlocked");});// Movementconst velocity = new THREE.Vector3();const direction = new THREE.Vector3();const moveForward = false;const moveBackward = false;document.addEventListener("keydown", (event) => {  switch (event.code) {    case "KeyW":      moveForward = true;      break;    case "KeyS":      moveBackward = true;      break;  }});function animate() {  if (controls.isLocked) {    direction.z = Number(moveForward) - Number(moveBackward);    direction.normalize();    velocity.z -= direction.z * 0.1;    velocity.z *= 0.9; // Friction    controls.moveForward(-velocity.z);  }}
```
```
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";const controls = new PointerLockControls(camera, document.body);// Lock pointer on clickdocument.addEventListener("click", () => {  controls.lock();});controls.addEventListener("lock", () => {  console.log("Pointer locked");});controls.addEventListener("unlock", () => {  console.log("Pointer unlocked");});// Movementconst velocity = new THREE.Vector3();const direction = new THREE.Vector3();const moveForward = false;const moveBackward = false;document.addEventListener("keydown", (event) => {  switch (event.code) {    case "KeyW":      moveForward = true;      break;    case "KeyS":      moveBackward = true;      break;  }});function animate() {  if (controls.isLocked) {    direction.z = Number(moveForward) - Number(moveBackward);    direction.normalize();    velocity.z -= direction.z * 0.1;    velocity.z *= 0.9; // Friction    controls.moveForward(-velocity.z);  }}
```
```
import { TrackballControls } from "three/addons/controls/TrackballControls.js";const controls = new TrackballControls(camera, renderer.domElement);controls.rotateSpeed = 2.0;controls.zoomSpeed = 1.2;controls.panSpeed = 0.8;controls.staticMoving = true;function animate() {  controls.update();}
```
```
import { TrackballControls } from "three/addons/controls/TrackballControls.js";const controls = new TrackballControls(camera, renderer.domElement);controls.rotateSpeed = 2.0;controls.zoomSpeed = 1.2;controls.panSpeed = 0.8;controls.staticMoving = true;function animate() {  controls.update();}
```
```
import { MapControls } from "three/addons/controls/MapControls.js";const controls = new MapControls(camera, renderer.domElement);controls.enableDamping = true;controls.dampingFactor = 0.05;controls.screenSpacePanning = false;controls.maxPolarAngle = Math.PI / 2;
```
```
import { MapControls } from "three/addons/controls/MapControls.js";const controls = new MapControls(camera, renderer.domElement);controls.enableDamping = true;controls.dampingFactor = 0.05;controls.screenSpacePanning = false;controls.maxPolarAngle = Math.PI / 2;
```
```
import { TransformControls } from "three/addons/controls/TransformControls.js";const transformControls = new TransformControls(camera, renderer.domElement);scene.add(transformControls);// Attach to objecttransformControls.attach(selectedMesh);// Switch modestransformControls.setMode("translate"); // 'translate', 'rotate', 'scale'// Change spacetransformControls.setSpace("local"); // 'local', 'world'// SizetransformControls.setSize(1);// EventstransformControls.addEventListener("dragging-changed", (event) => {  // Disable orbit controls while dragging  orbitControls.enabled = !event.value;});transformControls.addEventListener("change", () => {  renderer.render(scene, camera);});// Keyboard shortcutswindow.addEventListener("keydown", (event) => {  switch (event.key) {    case "g":      transformControls.setMode("translate");      break;    case "r":      transformControls.setMode("rotate");      break;    case "s":      transformControls.setMode("scale");      break;    case "Escape":      transformControls.detach();      break;  }});
```
```
import { TransformControls } from "three/addons/controls/TransformControls.js";const transformControls = new TransformControls(camera, renderer.domElement);scene.add(transformControls);// Attach to objecttransformControls.attach(selectedMesh);// Switch modestransformControls.setMode("translate"); // 'translate', 'rotate', 'scale'// Change spacetransformControls.setSpace("local"); // 'local', 'world'// SizetransformControls.setSize(1);// EventstransformControls.addEventListener("dragging-changed", (event) => {  // Disable orbit controls while dragging  orbitControls.enabled = !event.value;});transformControls.addEventListener("change", () => {  renderer.render(scene, camera);});// Keyboard shortcutswindow.addEventListener("keydown", (event) => {  switch (event.key) {    case "g":      transformControls.setMode("translate");      break;    case "r":      transformControls.setMode("rotate");      break;    case "s":      transformControls.setMode("scale");      break;    case "Escape":      transformControls.detach();      break;  }});
```
```
import { DragControls } from "three/addons/controls/DragControls.js";const draggableObjects = [mesh1, mesh2, mesh3];const dragControls = new DragControls(  draggableObjects,  camera,  renderer.domElement,);dragControls.addEventListener("dragstart", (event) => {  orbitControls.enabled = false;  event.object.material.emissive.set(0xaaaaaa);});dragControls.addEventListener("drag", (event) => {  // Constrain to ground plane  event.object.position.y = 0;});dragControls.addEventListener("dragend", (event) => {  orbitControls.enabled = true;  event.object.material.emissive.set(0x000000);});
```
```
import { DragControls } from "three/addons/controls/DragControls.js";const draggableObjects = [mesh1, mesh2, mesh3];const dragControls = new DragControls(  draggableObjects,  camera,  renderer.domElement,);dragControls.addEventListener("dragstart", (event) => {  orbitControls.enabled = false;  event.object.material.emissive.set(0xaaaaaa);});dragControls.addEventListener("drag", (event) => {  // Constrain to ground plane  event.object.position.y = 0;});dragControls.addEventListener("dragend", (event) => {  orbitControls.enabled = true;  event.object.material.emissive.set(0x000000);});
```
```
const raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();let selectedObject = null;function onMouseDown(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(selectableObjects);  // Deselect previous  if (selectedObject) {    selectedObject.material.emissive.set(0x000000);  }  // Select new  if (intersects.length > 0) {    selectedObject = intersects[0].object;    selectedObject.material.emissive.set(0x444444);  } else {    selectedObject = null;  }}
```
```
const raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();let selectedObject = null;function onMouseDown(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(selectableObjects);  // Deselect previous  if (selectedObject) {    selectedObject.material.emissive.set(0x000000);  }  // Select new  if (intersects.length > 0) {    selectedObject = intersects[0].object;    selectedObject.material.emissive.set(0x444444);  } else {    selectedObject = null;  }}
```
```
import { SelectionBox } from "three/addons/interactive/SelectionBox.js";import { SelectionHelper } from "three/addons/interactive/SelectionHelper.js";const selectionBox = new SelectionBox(camera, scene);const selectionHelper = new SelectionHelper(renderer, "selectBox"); // CSS classdocument.addEventListener("pointerdown", (event) => {  selectionBox.startPoint.set(    (event.clientX / window.innerWidth) * 2 - 1,    -(event.clientY / window.innerHeight) * 2 + 1,    0.5,  );});document.addEventListener("pointermove", (event) => {  if (selectionHelper.isDown) {    selectionBox.endPoint.set(      (event.clientX / window.innerWidth) * 2 - 1,      -(event.clientY / window.innerHeight) * 2 + 1,      0.5,    );  }});document.addEventListener("pointerup", (event) => {  selectionBox.endPoint.set(    (event.clientX / window.innerWidth) * 2 - 1,    -(event.clientY / window.innerHeight) * 2 + 1,    0.5,  );  const selected = selectionBox.select();  console.log("Selected objects:", selected);});
```
```
import { SelectionBox } from "three/addons/interactive/SelectionBox.js";import { SelectionHelper } from "three/addons/interactive/SelectionHelper.js";const selectionBox = new SelectionBox(camera, scene);const selectionHelper = new SelectionHelper(renderer, "selectBox"); // CSS classdocument.addEventListener("pointerdown", (event) => {  selectionBox.startPoint.set(    (event.clientX / window.innerWidth) * 2 - 1,    -(event.clientY / window.innerHeight) * 2 + 1,    0.5,  );});document.addEventListener("pointermove", (event) => {  if (selectionHelper.isDown) {    selectionBox.endPoint.set(      (event.clientX / window.innerWidth) * 2 - 1,      -(event.clientY / window.innerHeight) * 2 + 1,      0.5,    );  }});document.addEventListener("pointerup", (event) => {  selectionBox.endPoint.set(    (event.clientX / window.innerWidth) * 2 - 1,    -(event.clientY / window.innerHeight) * 2 + 1,    0.5,  );  const selected = selectionBox.select();  console.log("Selected objects:", selected);});
```
```
const raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();let hoveredObject = null;function onMouseMove(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(hoverableObjects);  // Reset previous hover  if (hoveredObject) {    hoveredObject.material.color.set(hoveredObject.userData.originalColor);    document.body.style.cursor = "default";  }  // Apply new hover  if (intersects.length > 0) {    hoveredObject = intersects[0].object;    if (!hoveredObject.userData.originalColor) {      hoveredObject.userData.originalColor =        hoveredObject.material.color.getHex();    }    hoveredObject.material.color.set(0xff6600);    document.body.style.cursor = "pointer";  } else {    hoveredObject = null;  }}window.addEventListener("mousemove", onMouseMove);
```
```
const raycaster = new THREE.Raycaster();const mouse = new THREE.Vector2();let hoveredObject = null;function onMouseMove(event) {  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  raycaster.setFromCamera(mouse, camera);  const intersects = raycaster.intersectObjects(hoverableObjects);  // Reset previous hover  if (hoveredObject) {    hoveredObject.material.color.set(hoveredObject.userData.originalColor);    document.body.style.cursor = "default";  }  // Apply new hover  if (intersects.length > 0) {    hoveredObject = intersects[0].object;    if (!hoveredObject.userData.originalColor) {      hoveredObject.userData.originalColor =        hoveredObject.material.color.getHex();    }    hoveredObject.material.color.set(0xff6600);    document.body.style.cursor = "pointer";  } else {    hoveredObject = null;  }}window.addEventListener("mousemove", onMouseMove);
```
```
const keys = {};document.addEventListener("keydown", (event) => {  keys[event.code] = true;});document.addEventListener("keyup", (event) => {  keys[event.code] = false;});function update() {  const speed = 0.1;  if (keys["KeyW"]) player.position.z -= speed;  if (keys["KeyS"]) player.position.z += speed;  if (keys["KeyA"]) player.position.x -= speed;  if (keys["KeyD"]) player.position.x += speed;  if (keys["Space"]) player.position.y += speed;  if (keys["ShiftLeft"]) player.position.y -= speed;}
```
```
const keys = {};document.addEventListener("keydown", (event) => {  keys[event.code] = true;});document.addEventListener("keyup", (event) => {  keys[event.code] = false;});function update() {  const speed = 0.1;  if (keys["KeyW"]) player.position.z -= speed;  if (keys["KeyS"]) player.position.z += speed;  if (keys["KeyA"]) player.position.x -= speed;  if (keys["KeyD"]) player.position.x += speed;  if (keys["Space"]) player.position.y += speed;  if (keys["ShiftLeft"]) player.position.y -= speed;}
```
```
function worldToScreen(position, camera) {  const vector = position.clone();  vector.project(camera);  return {    x: ((vector.x + 1) / 2) * window.innerWidth,    y: (-(vector.y - 1) / 2) * window.innerHeight,  };}// Position HTML element over 3D objectconst screenPos = worldToScreen(mesh.position, camera);element.style.left = screenPos.x + "px";element.style.top = screenPos.y + "px";
```
```
function worldToScreen(position, camera) {  const vector = position.clone();  vector.project(camera);  return {    x: ((vector.x + 1) / 2) * window.innerWidth,    y: (-(vector.y - 1) / 2) * window.innerHeight,  };}// Position HTML element over 3D objectconst screenPos = worldToScreen(mesh.position, camera);element.style.left = screenPos.x + "px";element.style.top = screenPos.y + "px";
```
```
function screenToWorld(screenX, screenY, camera, targetZ = 0) {  const vector = new THREE.Vector3(    (screenX / window.innerWidth) * 2 - 1,    -(screenY / window.innerHeight) * 2 + 1,    0.5,  );  vector.unproject(camera);  const dir = vector.sub(camera.position).normalize();  const distance = (targetZ - camera.position.z) / dir.z;  return camera.position.clone().add(dir.multiplyScalar(distance));}
```
```
function screenToWorld(screenX, screenY, camera, targetZ = 0) {  const vector = new THREE.Vector3(    (screenX / window.innerWidth) * 2 - 1,    -(screenY / window.innerHeight) * 2 + 1,    0.5,  );  vector.unproject(camera);  const dir = vector.sub(camera.position).normalize();  const distance = (targetZ - camera.position.z) / dir.z;  return camera.position.clone().add(dir.multiplyScalar(distance));}
```
```
function getRayPlaneIntersection(mouse, camera, plane) {  const raycaster = new THREE.Raycaster();  raycaster.setFromCamera(mouse, camera);  const intersection = new THREE.Vector3();  raycaster.ray.intersectPlane(plane, intersection);  return intersection;}// Ground planeconst groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);const worldPos = getRayPlaneIntersection(mouse, camera, groundPlane);
```
```
function getRayPlaneIntersection(mouse, camera, plane) {  const raycaster = new THREE.Raycaster();  raycaster.setFromCamera(mouse, camera);  const intersection = new THREE.Vector3();  raycaster.ray.intersectPlane(plane, intersection);  return intersection;}// Ground planeconst groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);const worldPos = getRayPlaneIntersection(mouse, camera, groundPlane);
```
```
class InteractionManager {  constructor(camera, renderer, scene) {    this.camera = camera;    this.renderer = renderer;    this.scene = scene;    this.raycaster = new THREE.Raycaster();    this.mouse = new THREE.Vector2();    this.clickables = [];    this.bindEvents();  }  bindEvents() {    const canvas = this.renderer.domElement;    canvas.addEventListener("click", (e) => this.onClick(e));    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));    canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));  }  updateMouse(event) {    const rect = this.renderer.domElement.getBoundingClientRect();    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;  }  getIntersects() {    this.raycaster.setFromCamera(this.mouse, this.camera);    return this.raycaster.intersectObjects(this.clickables, true);  }  onClick(event) {    this.updateMouse(event);    const intersects = this.getIntersects();    if (intersects.length > 0) {      const object = intersects[0].object;      if (object.userData.onClick) {        object.userData.onClick(intersects[0]);      }    }  }  addClickable(object, callback) {    this.clickables.push(object);    object.userData.onClick = callback;  }  dispose() {    // Remove event listeners  }}// Usageconst interaction = new InteractionManager(camera, renderer, scene);interaction.addClickable(mesh, (intersect) => {  console.log("Clicked at:", intersect.point);});
```
```
class InteractionManager {  constructor(camera, renderer, scene) {    this.camera = camera;    this.renderer = renderer;    this.scene = scene;    this.raycaster = new THREE.Raycaster();    this.mouse = new THREE.Vector2();    this.clickables = [];    this.bindEvents();  }  bindEvents() {    const canvas = this.renderer.domElement;    canvas.addEventListener("click", (e) => this.onClick(e));    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));    canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));  }  updateMouse(event) {    const rect = this.renderer.domElement.getBoundingClientRect();    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;  }  getIntersects() {    this.raycaster.setFromCamera(this.mouse, this.camera);    return this.raycaster.intersectObjects(this.clickables, true);  }  onClick(event) {    this.updateMouse(event);    const intersects = this.getIntersects();    if (intersects.length > 0) {      const object = intersects[0].object;      if (object.userData.onClick) {        object.userData.onClick(intersects[0]);      }    }  }  addClickable(object, callback) {    this.clickables.push(object);    object.userData.onClick = callback;  }  dispose() {    // Remove event listeners  }}// Usageconst interaction = new InteractionManager(camera, renderer, scene);interaction.addClickable(mesh, (intersect) => {  console.log("Clicked at:", intersect.point);});
```
```
controls.enabled = false
```
```
// Use simpler geometry for raycastingconst complexMesh = loadedModel;const collisionMesh = new THREE.Mesh(  new THREE.BoxGeometry(1, 1, 1),  new THREE.MeshBasicMaterial({ visible: false }),);collisionMesh.userData.target = complexMesh;clickables.push(collisionMesh);
```
```
// Use simpler geometry for raycastingconst complexMesh = loadedModel;const collisionMesh = new THREE.Mesh(  new THREE.BoxGeometry(1, 1, 1),  new THREE.MeshBasicMaterial({ visible: false }),);collisionMesh.userData.target = complexMesh;clickables.push(collisionMesh);
```
```
threejs-fundamentals
```
```
threejs-animation
```
```
threejs-shaders
```
Crafting engaging 3D web experiences hinges on effective user interaction. This skill empowers you to imbue your Three.js scenes with responsiveness, allowing users to intuitively navigate and manipulate virtual environments. From detecting precise clicks on objects using raycasting to implementing smooth camera controls like OrbitControls, it covers the essential techniques for capturing and responding to user input. Build applications where users can truly interact with your 3D models, creating dynamic and immersive interfaces that stand out. Leverage these capabilities to design intuitive controls and interactive elements that bring your Three.js projects to life.

# When to Use This Skill
- •Implementing clickable 3D objects to trigger events or display information.
- •Adding responsive camera navigation (e.g., orbiting, panning, zooming) in a 3D scene.
- •Creating drag-and-drop functionality for 3D models within a Three.js application.
- •Detecting touch gestures on mobile devices for intuitive 3D scene manipulation.

# Pro Tips
- 💡Optimize raycasting performance by only checking intersections with a subset of relevant objects (e.g., using layers or specific groups) instead of all `scene.children` in complex scenes.
- 💡For mobile experiences, ensure both mouse events and touch events (touchstart, touchmove, touchend) are handled correctly, mapping them to `THREE.Vector2` for consistent raycasting.
- 💡Combine different control types (e.g., OrbitControls with custom object manipulation logic) by carefully managing their enable/disable states or using event listeners to prevent conflicts.

