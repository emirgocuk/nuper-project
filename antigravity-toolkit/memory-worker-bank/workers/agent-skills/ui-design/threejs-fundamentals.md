# threejs-fundamentals
Source: https://antigravity.codes/agent-skills/ui-design/threejs-fundamentals

## AI Worker Instructions
When the user requests functionality related to threejs-fundamentals, follow these guidelines and utilize this context.

## Scraped Content

# threejs-fundamentals
```
import * as THREE from "three";// Create scene, camera, rendererconst scene = new THREE.Scene();const camera = new THREE.PerspectiveCamera(  75,  window.innerWidth / window.innerHeight,  0.1,  1000,);const renderer = new THREE.WebGLRenderer({ antialias: true });renderer.setSize(window.innerWidth, window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));document.body.appendChild(renderer.domElement);// Add a meshconst geometry = new THREE.BoxGeometry(1, 1, 1);const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const cube = new THREE.Mesh(geometry, material);scene.add(cube);// Add lightscene.add(new THREE.AmbientLight(0xffffff, 0.5));const dirLight = new THREE.DirectionalLight(0xffffff, 1);dirLight.position.set(5, 5, 5);scene.add(dirLight);camera.position.z = 5;// Animation loopfunction animate() {  requestAnimationFrame(animate);  cube.rotation.x += 0.01;  cube.rotation.y += 0.01;  renderer.render(scene, camera);}animate();// Handle resizewindow.addEventListener("resize", () => {  camera.aspect = window.innerWidth / window.innerHeight;  camera.updateProjectionMatrix();  renderer.setSize(window.innerWidth, window.innerHeight);});
```
```
import * as THREE from "three";// Create scene, camera, rendererconst scene = new THREE.Scene();const camera = new THREE.PerspectiveCamera(  75,  window.innerWidth / window.innerHeight,  0.1,  1000,);const renderer = new THREE.WebGLRenderer({ antialias: true });renderer.setSize(window.innerWidth, window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));document.body.appendChild(renderer.domElement);// Add a meshconst geometry = new THREE.BoxGeometry(1, 1, 1);const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const cube = new THREE.Mesh(geometry, material);scene.add(cube);// Add lightscene.add(new THREE.AmbientLight(0xffffff, 0.5));const dirLight = new THREE.DirectionalLight(0xffffff, 1);dirLight.position.set(5, 5, 5);scene.add(dirLight);camera.position.z = 5;// Animation loopfunction animate() {  requestAnimationFrame(animate);  cube.rotation.x += 0.01;  cube.rotation.y += 0.01;  renderer.render(scene, camera);}animate();// Handle resizewindow.addEventListener("resize", () => {  camera.aspect = window.innerWidth / window.innerHeight;  camera.updateProjectionMatrix();  renderer.setSize(window.innerWidth, window.innerHeight);});
```
```
const scene = new THREE.Scene();scene.background = new THREE.Color(0x000000); // Solid colorscene.background = texture; // Skybox texturescene.background = cubeTexture; // Cubemapscene.environment = envMap; // Environment map for PBRscene.fog = new THREE.Fog(0xffffff, 1, 100); // Linear fogscene.fog = new THREE.FogExp2(0xffffff, 0.02); // Exponential fog
```
```
const scene = new THREE.Scene();scene.background = new THREE.Color(0x000000); // Solid colorscene.background = texture; // Skybox texturescene.background = cubeTexture; // Cubemapscene.environment = envMap; // Environment map for PBRscene.fog = new THREE.Fog(0xffffff, 1, 100); // Linear fogscene.fog = new THREE.FogExp2(0xffffff, 0.02); // Exponential fog
```
```
// PerspectiveCamera(fov, aspect, near, far)const camera = new THREE.PerspectiveCamera(  75, // Field of view (degrees)  window.innerWidth / window.innerHeight, // Aspect ratio  0.1, // Near clipping plane  1000, // Far clipping plane);camera.position.set(0, 5, 10);camera.lookAt(0, 0, 0);camera.updateProjectionMatrix(); // Call after changing fov, aspect, near, far
```
```
// PerspectiveCamera(fov, aspect, near, far)const camera = new THREE.PerspectiveCamera(  75, // Field of view (degrees)  window.innerWidth / window.innerHeight, // Aspect ratio  0.1, // Near clipping plane  1000, // Far clipping plane);camera.position.set(0, 5, 10);camera.lookAt(0, 0, 0);camera.updateProjectionMatrix(); // Call after changing fov, aspect, near, far
```
```
// OrthographicCamera(left, right, top, bottom, near, far)const aspect = window.innerWidth / window.innerHeight;const frustumSize = 10;const camera = new THREE.OrthographicCamera(  (frustumSize * aspect) / -2,  (frustumSize * aspect) / 2,  frustumSize / 2,  frustumSize / -2,  0.1,  1000,);
```
```
// OrthographicCamera(left, right, top, bottom, near, far)const aspect = window.innerWidth / window.innerHeight;const frustumSize = 10;const camera = new THREE.OrthographicCamera(  (frustumSize * aspect) / -2,  (frustumSize * aspect) / 2,  frustumSize / 2,  frustumSize / -2,  0.1,  1000,);
```
```
const cameras = [];for (let i = 0; i < 4; i++) {  const subcamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);  subcamera.viewport = new THREE.Vector4(    Math.floor(i % 2) * 0.5,    Math.floor(i / 2) * 0.5,    0.5,    0.5,  );  cameras.push(subcamera);}const arrayCamera = new THREE.ArrayCamera(cameras);
```
```
const cameras = [];for (let i = 0; i < 4; i++) {  const subcamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);  subcamera.viewport = new THREE.Vector4(    Math.floor(i % 2) * 0.5,    Math.floor(i / 2) * 0.5,    0.5,    0.5,  );  cameras.push(subcamera);}const arrayCamera = new THREE.ArrayCamera(cameras);
```
```
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);scene.add(cubeCamera);// Use for reflectionsmaterial.envMap = cubeRenderTarget.texture;// Update each frame (expensive!)cubeCamera.position.copy(reflectiveMesh.position);cubeCamera.update(renderer, scene);
```
```
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);scene.add(cubeCamera);// Use for reflectionsmaterial.envMap = cubeRenderTarget.texture;// Update each frame (expensive!)cubeCamera.position.copy(reflectiveMesh.position);cubeCamera.update(renderer, scene);
```
```
const renderer = new THREE.WebGLRenderer({  canvas: document.querySelector("#canvas"), // Optional existing canvas  antialias: true, // Smooth edges  alpha: true, // Transparent background  powerPreference: "high-performance", // GPU hint  preserveDrawingBuffer: true, // For screenshots});renderer.setSize(width, height);renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));// Tone mappingrenderer.toneMapping = THREE.ACESFilmicToneMapping;renderer.toneMappingExposure = 1.0;// Color space (Three.js r152+)renderer.outputColorSpace = THREE.SRGBColorSpace;// Shadowsrenderer.shadowMap.enabled = true;renderer.shadowMap.type = THREE.PCFSoftShadowMap;// Clear colorrenderer.setClearColor(0x000000, 1);// Renderrenderer.render(scene, camera);
```
```
const renderer = new THREE.WebGLRenderer({  canvas: document.querySelector("#canvas"), // Optional existing canvas  antialias: true, // Smooth edges  alpha: true, // Transparent background  powerPreference: "high-performance", // GPU hint  preserveDrawingBuffer: true, // For screenshots});renderer.setSize(width, height);renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));// Tone mappingrenderer.toneMapping = THREE.ACESFilmicToneMapping;renderer.toneMappingExposure = 1.0;// Color space (Three.js r152+)renderer.outputColorSpace = THREE.SRGBColorSpace;// Shadowsrenderer.shadowMap.enabled = true;renderer.shadowMap.type = THREE.PCFSoftShadowMap;// Clear colorrenderer.setClearColor(0x000000, 1);// Renderrenderer.render(scene, camera);
```
```
const obj = new THREE.Object3D();// Transformobj.position.set(x, y, z);obj.rotation.set(x, y, z); // Euler angles (radians)obj.quaternion.set(x, y, z, w); // Quaternion rotationobj.scale.set(x, y, z);// Local vs World transformsobj.getWorldPosition(targetVector);obj.getWorldQuaternion(targetQuaternion);obj.getWorldDirection(targetVector);// Hierarchyobj.add(child);obj.remove(child);obj.parent;obj.children;// Visibilityobj.visible = false;// Layers (for selective rendering/raycasting)obj.layers.set(1);obj.layers.enable(2);obj.layers.disable(0);// Traverse hierarchyobj.traverse((child) => {  if (child.isMesh) child.material.color.set(0xff0000);});// Matrix updatesobj.matrixAutoUpdate = true; // Default: auto-update matricesobj.updateMatrix(); // Manual matrix updateobj.updateMatrixWorld(true); // Update world matrix recursively
```
```
const obj = new THREE.Object3D();// Transformobj.position.set(x, y, z);obj.rotation.set(x, y, z); // Euler angles (radians)obj.quaternion.set(x, y, z, w); // Quaternion rotationobj.scale.set(x, y, z);// Local vs World transformsobj.getWorldPosition(targetVector);obj.getWorldQuaternion(targetQuaternion);obj.getWorldDirection(targetVector);// Hierarchyobj.add(child);obj.remove(child);obj.parent;obj.children;// Visibilityobj.visible = false;// Layers (for selective rendering/raycasting)obj.layers.set(1);obj.layers.enable(2);obj.layers.disable(0);// Traverse hierarchyobj.traverse((child) => {  if (child.isMesh) child.material.color.set(0xff0000);});// Matrix updatesobj.matrixAutoUpdate = true; // Default: auto-update matricesobj.updateMatrix(); // Manual matrix updateobj.updateMatrixWorld(true); // Update world matrix recursively
```
```
const group = new THREE.Group();group.add(mesh1);group.add(mesh2);scene.add(group);// Transform entire groupgroup.position.x = 5;group.rotation.y = Math.PI / 4;
```
```
const group = new THREE.Group();group.add(mesh1);group.add(mesh2);scene.add(group);// Transform entire groupgroup.position.x = 5;group.rotation.y = Math.PI / 4;
```
```
const mesh = new THREE.Mesh(geometry, material);// Multiple materials (one per geometry group)const mesh = new THREE.Mesh(geometry, [material1, material2]);// Useful propertiesmesh.geometry;mesh.material;mesh.castShadow = true;mesh.receiveShadow = true;// Frustum cullingmesh.frustumCulled = true; // Default: skip if outside camera view// Render ordermesh.renderOrder = 10; // Higher = rendered later
```
```
const mesh = new THREE.Mesh(geometry, material);// Multiple materials (one per geometry group)const mesh = new THREE.Mesh(geometry, [material1, material2]);// Useful propertiesmesh.geometry;mesh.material;mesh.castShadow = true;mesh.receiveShadow = true;// Frustum cullingmesh.frustumCulled = true; // Default: skip if outside camera view// Render ordermesh.renderOrder = 10; // Higher = rendered later
```
```
// Axes helperconst axesHelper = new THREE.AxesHelper(5);scene.add(axesHelper); // Red=X, Green=Y, Blue=Z
```
```
// Axes helperconst axesHelper = new THREE.AxesHelper(5);scene.add(axesHelper); // Red=X, Green=Y, Blue=Z
```
```
const v = new THREE.Vector3(x, y, z);v.set(x, y, z);v.copy(otherVector);v.clone();// Operations (modify in place)v.add(v2);v.sub(v2);v.multiply(v2);v.multiplyScalar(2);v.divideScalar(2);v.normalize();v.negate();v.clamp(min, max);v.lerp(target, alpha);// Calculations (return new value)v.length();v.lengthSq(); // Faster than length()v.distanceTo(v2);v.dot(v2);v.cross(v2); // Modifies vv.angleTo(v2);// Transformv.applyMatrix4(matrix);v.applyQuaternion(q);v.project(camera); // World to NDCv.unproject(camera); // NDC to world
```
```
const v = new THREE.Vector3(x, y, z);v.set(x, y, z);v.copy(otherVector);v.clone();// Operations (modify in place)v.add(v2);v.sub(v2);v.multiply(v2);v.multiplyScalar(2);v.divideScalar(2);v.normalize();v.negate();v.clamp(min, max);v.lerp(target, alpha);// Calculations (return new value)v.length();v.lengthSq(); // Faster than length()v.distanceTo(v2);v.dot(v2);v.cross(v2); // Modifies vv.angleTo(v2);// Transformv.applyMatrix4(matrix);v.applyQuaternion(q);v.project(camera); // World to NDCv.unproject(camera); // NDC to world
```
```
const m = new THREE.Matrix4();m.identity();m.copy(other);m.clone();// Build transformsm.makeTranslation(x, y, z);m.makeRotationX(theta);m.makeRotationY(theta);m.makeRotationZ(theta);m.makeRotationFromQuaternion(q);m.makeScale(x, y, z);// Compose/decomposem.compose(position, quaternion, scale);m.decompose(position, quaternion, scale);// Operationsm.multiply(m2); // m = m * m2m.premultiply(m2); // m = m2 * mm.invert();m.transpose();// Camera matricesm.makePerspective(left, right, top, bottom, near, far);m.makeOrthographic(left, right, top, bottom, near, far);m.lookAt(eye, target, up);
```
```
const m = new THREE.Matrix4();m.identity();m.copy(other);m.clone();// Build transformsm.makeTranslation(x, y, z);m.makeRotationX(theta);m.makeRotationY(theta);m.makeRotationZ(theta);m.makeRotationFromQuaternion(q);m.makeScale(x, y, z);// Compose/decomposem.compose(position, quaternion, scale);m.decompose(position, quaternion, scale);// Operationsm.multiply(m2); // m = m * m2m.premultiply(m2); // m = m2 * mm.invert();m.transpose();// Camera matricesm.makePerspective(left, right, top, bottom, near, far);m.makeOrthographic(left, right, top, bottom, near, far);m.lookAt(eye, target, up);
```
```
const q = new THREE.Quaternion();q.setFromEuler(euler);q.setFromAxisAngle(axis, angle);q.setFromRotationMatrix(matrix);q.multiply(q2);q.slerp(target, t); // Spherical interpolationq.normalize();q.invert();
```
```
const q = new THREE.Quaternion();q.setFromEuler(euler);q.setFromAxisAngle(axis, angle);q.setFromRotationMatrix(matrix);q.multiply(q2);q.slerp(target, t); // Spherical interpolationq.normalize();q.invert();
```
```
const euler = new THREE.Euler(x, y, z, "XYZ"); // Order matters!euler.setFromQuaternion(q);euler.setFromRotationMatrix(m);// Rotation orders: 'XYZ', 'YXZ', 'ZXY', 'XZY', 'YZX', 'ZYX'
```
```
const euler = new THREE.Euler(x, y, z, "XYZ"); // Order matters!euler.setFromQuaternion(q);euler.setFromRotationMatrix(m);// Rotation orders: 'XYZ', 'YXZ', 'ZXY', 'XZY', 'YZX', 'ZYX'
```
```
const color = new THREE.Color(0xff0000);const color = new THREE.Color("red");const color = new THREE.Color("rgb(255, 0, 0)");const color = new THREE.Color("#ff0000");color.setHex(0x00ff00);color.setRGB(r, g, b); // 0-1 rangecolor.setHSL(h, s, l); // 0-1 rangecolor.lerp(otherColor, alpha);color.multiply(otherColor);color.multiplyScalar(2);
```
```
const color = new THREE.Color(0xff0000);const color = new THREE.Color("red");const color = new THREE.Color("rgb(255, 0, 0)");const color = new THREE.Color("#ff0000");color.setHex(0x00ff00);color.setRGB(r, g, b); // 0-1 rangecolor.setHSL(h, s, l); // 0-1 rangecolor.lerp(otherColor, alpha);color.multiply(otherColor);color.multiplyScalar(2);
```
```
THREE.MathUtils.clamp(value, min, max);THREE.MathUtils.lerp(start, end, alpha);THREE.MathUtils.mapLinear(value, inMin, inMax, outMin, outMax);THREE.MathUtils.degToRad(degrees);THREE.MathUtils.radToDeg(radians);THREE.MathUtils.randFloat(min, max);THREE.MathUtils.randInt(min, max);THREE.MathUtils.smoothstep(x, min, max);THREE.MathUtils.smootherstep(x, min, max);
```
```
THREE.MathUtils.clamp(value, min, max);THREE.MathUtils.lerp(start, end, alpha);THREE.MathUtils.mapLinear(value, inMin, inMax, outMin, outMax);THREE.MathUtils.degToRad(degrees);THREE.MathUtils.radToDeg(radians);THREE.MathUtils.randFloat(min, max);THREE.MathUtils.randInt(min, max);THREE.MathUtils.smoothstep(x, min, max);THREE.MathUtils.smootherstep(x, min, max);
```
```
function dispose() {  // Dispose geometries  mesh.geometry.dispose();  // Dispose materials  if (Array.isArray(mesh.material)) {    mesh.material.forEach((m) => m.dispose());  } else {    mesh.material.dispose();  }  // Dispose textures  texture.dispose();  // Remove from scene  scene.remove(mesh);  // Dispose renderer  renderer.dispose();}
```
```
function dispose() {  // Dispose geometries  mesh.geometry.dispose();  // Dispose materials  if (Array.isArray(mesh.material)) {    mesh.material.forEach((m) => m.dispose());  } else {    mesh.material.dispose();  }  // Dispose textures  texture.dispose();  // Remove from scene  scene.remove(mesh);  // Dispose renderer  renderer.dispose();}
```
```
const clock = new THREE.Clock();function animate() {  const delta = clock.getDelta(); // Time since last frame (seconds)  const elapsed = clock.getElapsedTime(); // Total time (seconds)  mesh.rotation.y += delta * 0.5; // Consistent speed regardless of framerate  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
const clock = new THREE.Clock();function animate() {  const delta = clock.getDelta(); // Time since last frame (seconds)  const elapsed = clock.getElapsedTime(); // Total time (seconds)  mesh.rotation.y += delta * 0.5; // Consistent speed regardless of framerate  requestAnimationFrame(animate);  renderer.render(scene, camera);}
```
```
function onWindowResize() {  const width = window.innerWidth;  const height = window.innerHeight;  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));}window.addEventListener("resize", onWindowResize);
```
```
function onWindowResize() {  const width = window.innerWidth;  const height = window.innerHeight;  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));}window.addEventListener("resize", onWindowResize);
```
```
const manager = new THREE.LoadingManager();manager.onStart = (url, loaded, total) => console.log("Started loading");manager.onLoad = () => console.log("All loaded");manager.onProgress = (url, loaded, total) => console.log(${loaded}/${total});manager.onError = (url) => console.error(Error loading ${url});const textureLoader = new THREE.TextureLoader(manager);const gltfLoader = new GLTFLoader(manager);
```
```
const manager = new THREE.LoadingManager();manager.onStart = (url, loaded, total) => console.log("Started loading");manager.onLoad = () => console.log("All loaded");manager.onProgress = (url, loaded, total) => console.log(${loaded}/${total});manager.onError = (url) => console.error(Error loading ${url});const textureLoader = new THREE.TextureLoader(manager);const gltfLoader = new GLTFLoader(manager);
```
```
${loaded}/${total}
```
```
Error loading ${url}
```
```
THREE.LOD
```
```
getWorldPosition
```
```
// Merge static geometriesimport { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";const merged = mergeGeometries([geo1, geo2, geo3]);// LODconst lod = new THREE.LOD();lod.addLevel(highDetailMesh, 0);lod.addLevel(medDetailMesh, 50);lod.addLevel(lowDetailMesh, 100);scene.add(lod);
```
```
// Merge static geometriesimport { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";const merged = mergeGeometries([geo1, geo2, geo3]);// LODconst lod = new THREE.LOD();lod.addLevel(highDetailMesh, 0);lod.addLevel(medDetailMesh, 50);lod.addLevel(lowDetailMesh, 100);scene.add(lod);
```
```
threejs-geometry
```
```
threejs-materials
```
```
threejs-lighting
```
Dive into the core concepts of Three.js with this essential agent skill, designed to demystify 3D web development. It provides a solid foundation for building interactive and visually rich experiences directly in the browser. Learn to construct scenes from the ground up, handle camera perspectives, optimize rendering, and organize complex 3D objects efficiently. This skill empowers you to confidently approach advanced Three.js projects by mastering its foundational elements, ensuring a smoother development workflow and greater creative control over your 3D environments. It's perfect for both beginners and those looking to reinforce their understanding of Three.js architecture.

# When to Use This Skill
- •Setting up the initial boilerplate for a new Three.js project, including scene, camera, and renderer configuration.
- •Debugging issues related to object positioning, scaling, or rotation by understanding Three.js's coordinate systems and hierarchies.
- •Implementing responsive camera controls and renderer adjustments for various screen sizes and device pixel ratios.
- •Organizing complex 3D models and their components into logical groups using `Object3D` for easier management and transformation.

# Pro Tips
- 💡Always consider `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to leverage high-DPI screens effectively without overly stressing lower-end GPUs.
- 💡Utilize `Object3D` for grouping related meshes, lights, or even other groups; this simplifies transformations (position, rotation, scale) for entire sections of your scene.
- 💡Start with `AmbientLight` and a simple `DirectionalLight` for basic scene illumination. Progressively add more complex lighting once the fundamental scene structure is stable.

