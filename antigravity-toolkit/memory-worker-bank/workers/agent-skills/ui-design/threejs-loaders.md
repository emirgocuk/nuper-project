# threejs-loaders
Source: https://antigravity.codes/agent-skills/ui-design/threejs-loaders

## AI Worker Instructions
When the user requests functionality related to threejs-loaders, follow these guidelines and utilize this context.

## Scraped Content

# threejs-loaders
```
import * as THREE from "three";import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";// Load GLTF modelconst loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  scene.add(gltf.scene);});// Load textureconst textureLoader = new THREE.TextureLoader();const texture = textureLoader.load("texture.jpg");
```
```
import * as THREE from "three";import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";// Load GLTF modelconst loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  scene.add(gltf.scene);});// Load textureconst textureLoader = new THREE.TextureLoader();const texture = textureLoader.load("texture.jpg");
```
```
const manager = new THREE.LoadingManager();// Callbacksmanager.onStart = (url, loaded, total) => {  console.log(Started loading: ${url});};manager.onLoad = () => {  console.log("All assets loaded!");  startGame();};manager.onProgress = (url, loaded, total) => {  const progress = (loaded / total) * 100;  console.log(Loading: ${progress.toFixed(1)}%);  updateProgressBar(progress);};manager.onError = (url) => {  console.error(Error loading: ${url});};// Use manager with loadersconst textureLoader = new THREE.TextureLoader(manager);const gltfLoader = new GLTFLoader(manager);// Load assetstextureLoader.load("texture1.jpg");textureLoader.load("texture2.jpg");gltfLoader.load("model.glb");// onLoad fires when ALL are complete
```
```
const manager = new THREE.LoadingManager();// Callbacksmanager.onStart = (url, loaded, total) => {  console.log(Started loading: ${url});};manager.onLoad = () => {  console.log("All assets loaded!");  startGame();};manager.onProgress = (url, loaded, total) => {  const progress = (loaded / total) * 100;  console.log(Loading: ${progress.toFixed(1)}%);  updateProgressBar(progress);};manager.onError = (url) => {  console.error(Error loading: ${url});};// Use manager with loadersconst textureLoader = new THREE.TextureLoader(manager);const gltfLoader = new GLTFLoader(manager);// Load assetstextureLoader.load("texture1.jpg");textureLoader.load("texture2.jpg");gltfLoader.load("model.glb");// onLoad fires when ALL are complete
```
```
Started loading: ${url}
```
```
Loading: ${progress.toFixed(1)}%
```
```
Error loading: ${url}
```
```
const loader = new THREE.TextureLoader();// Callback styleloader.load(  "texture.jpg",  (texture) => {    // onLoad    material.map = texture;    material.needsUpdate = true;  },  undefined, // onProgress - not supported for image loading  (error) => {    // onError    console.error("Error loading texture", error);  },);// Synchronous (returns texture, loads async)const texture = loader.load("texture.jpg");material.map = texture;
```
```
const loader = new THREE.TextureLoader();// Callback styleloader.load(  "texture.jpg",  (texture) => {    // onLoad    material.map = texture;    material.needsUpdate = true;  },  undefined, // onProgress - not supported for image loading  (error) => {    // onError    console.error("Error loading texture", error);  },);// Synchronous (returns texture, loads async)const texture = loader.load("texture.jpg");material.map = texture;
```
```
const texture = loader.load("texture.jpg", (tex) => {  // Color space (important for color accuracy)  tex.colorSpace = THREE.SRGBColorSpace; // For color/albedo maps  // tex.colorSpace = THREE.LinearSRGBColorSpace;  // For data maps (normal, roughness)  // Wrapping  tex.wrapS = THREE.RepeatWrapping;  tex.wrapT = THREE.RepeatWrapping;  // ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping  // Repeat/offset  tex.repeat.set(2, 2);  tex.offset.set(0.5, 0.5);  tex.rotation = Math.PI / 4;  tex.center.set(0.5, 0.5);  // Filtering  tex.minFilter = THREE.LinearMipmapLinearFilter; // Default  tex.magFilter = THREE.LinearFilter; // Default  // NearestFilter - pixelated  // LinearFilter - smooth  // LinearMipmapLinearFilter - smooth with mipmaps  // Anisotropic filtering (sharper at angles)  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();  // Flip Y (usually true for standard textures)  tex.flipY = true;  tex.needsUpdate = true;});
```
```
const texture = loader.load("texture.jpg", (tex) => {  // Color space (important for color accuracy)  tex.colorSpace = THREE.SRGBColorSpace; // For color/albedo maps  // tex.colorSpace = THREE.LinearSRGBColorSpace;  // For data maps (normal, roughness)  // Wrapping  tex.wrapS = THREE.RepeatWrapping;  tex.wrapT = THREE.RepeatWrapping;  // ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping  // Repeat/offset  tex.repeat.set(2, 2);  tex.offset.set(0.5, 0.5);  tex.rotation = Math.PI / 4;  tex.center.set(0.5, 0.5);  // Filtering  tex.minFilter = THREE.LinearMipmapLinearFilter; // Default  tex.magFilter = THREE.LinearFilter; // Default  // NearestFilter - pixelated  // LinearFilter - smooth  // LinearMipmapLinearFilter - smooth with mipmaps  // Anisotropic filtering (sharper at angles)  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();  // Flip Y (usually true for standard textures)  tex.flipY = true;  tex.needsUpdate = true;});
```
```
const loader = new THREE.CubeTextureLoader();// Load 6 facesconst cubeTexture = loader.load([  "px.jpg",  "nx.jpg", // positive/negative X  "py.jpg",  "ny.jpg", // positive/negative Y  "pz.jpg",  "nz.jpg", // positive/negative Z]);// Use as backgroundscene.background = cubeTexture;// Use as environment mapscene.environment = cubeTexture;material.envMap = cubeTexture;
```
```
const loader = new THREE.CubeTextureLoader();// Load 6 facesconst cubeTexture = loader.load([  "px.jpg",  "nx.jpg", // positive/negative X  "py.jpg",  "ny.jpg", // positive/negative Y  "pz.jpg",  "nz.jpg", // positive/negative Z]);// Use as backgroundscene.background = cubeTexture;// Use as environment mapscene.environment = cubeTexture;material.envMap = cubeTexture;
```
```
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";import { EXRLoader } from "three/addons/loaders/EXRLoader.js";// HDRconst rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});// EXRconst exrLoader = new EXRLoader();exrLoader.load("environment.exr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;});
```
```
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";import { EXRLoader } from "three/addons/loaders/EXRLoader.js";// HDRconst rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});// EXRconst exrLoader = new EXRLoader();exrLoader.load("environment.exr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;});
```
```
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";const pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();new RGBELoader().load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  scene.background = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";const pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();new RGBELoader().load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  scene.background = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";const loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  // The loaded scene  const model = gltf.scene;  scene.add(model);  // Animations  const animations = gltf.animations;  if (animations.length > 0) {    const mixer = new THREE.AnimationMixer(model);    animations.forEach((clip) => {      mixer.clipAction(clip).play();    });  }  // Cameras (if any)  const cameras = gltf.cameras;  // Asset info  console.log(gltf.asset); // Version, generator, etc.  // User data from Blender/etc  console.log(gltf.userData);});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";const loader = new GLTFLoader();loader.load("model.glb", (gltf) => {  // The loaded scene  const model = gltf.scene;  scene.add(model);  // Animations  const animations = gltf.animations;  if (animations.length > 0) {    const mixer = new THREE.AnimationMixer(model);    animations.forEach((clip) => {      mixer.clipAction(clip).play();    });  }  // Cameras (if any)  const cameras = gltf.cameras;  // Asset info  console.log(gltf.asset); // Version, generator, etc.  // User data from Blender/etc  console.log(gltf.userData);});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";const dracoLoader = new DRACOLoader();dracoLoader.setDecoderPath(  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",);dracoLoader.preload();const gltfLoader = new GLTFLoader();gltfLoader.setDRACOLoader(dracoLoader);gltfLoader.load("compressed-model.glb", (gltf) => {  scene.add(gltf.scene);});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";const dracoLoader = new DRACOLoader();dracoLoader.setDecoderPath(  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",);dracoLoader.preload();const gltfLoader = new GLTFLoader();gltfLoader.setDRACOLoader(dracoLoader);gltfLoader.load("compressed-model.glb", (gltf) => {  scene.add(gltf.scene);});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";const ktx2Loader = new KTX2Loader();ktx2Loader.setTranscoderPath(  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/",);ktx2Loader.detectSupport(renderer);const gltfLoader = new GLTFLoader();gltfLoader.setKTX2Loader(ktx2Loader);gltfLoader.load("model-with-ktx2.glb", (gltf) => {  scene.add(gltf.scene);});
```
```
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";const ktx2Loader = new KTX2Loader();ktx2Loader.setTranscoderPath(  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/",);ktx2Loader.detectSupport(renderer);const gltfLoader = new GLTFLoader();gltfLoader.setKTX2Loader(ktx2Loader);gltfLoader.load("model-with-ktx2.glb", (gltf) => {  scene.add(gltf.scene);});
```
```
loader.load("model.glb", (gltf) => {  const model = gltf.scene;  // Enable shadows  model.traverse((child) => {    if (child.isMesh) {      child.castShadow = true;      child.receiveShadow = true;    }  });  // Find specific mesh  const head = model.getObjectByName("Head");  // Adjust materials  model.traverse((child) => {    if (child.isMesh && child.material) {      child.material.envMapIntensity = 0.5;    }  });  // Center and scale  const box = new THREE.Box3().setFromObject(model);  const center = box.getCenter(new THREE.Vector3());  const size = box.getSize(new THREE.Vector3());  model.position.sub(center);  const maxDim = Math.max(size.x, size.y, size.z);  model.scale.setScalar(1 / maxDim);  scene.add(model);});
```
```
loader.load("model.glb", (gltf) => {  const model = gltf.scene;  // Enable shadows  model.traverse((child) => {    if (child.isMesh) {      child.castShadow = true;      child.receiveShadow = true;    }  });  // Find specific mesh  const head = model.getObjectByName("Head");  // Adjust materials  model.traverse((child) => {    if (child.isMesh && child.material) {      child.material.envMapIntensity = 0.5;    }  });  // Center and scale  const box = new THREE.Box3().setFromObject(model);  const center = box.getCenter(new THREE.Vector3());  const size = box.getSize(new THREE.Vector3());  model.position.sub(center);  const maxDim = Math.max(size.x, size.y, size.z);  model.scale.setScalar(1 / maxDim);  scene.add(model);});
```
```
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";import { MTLLoader } from "three/addons/loaders/MTLLoader.js";const mtlLoader = new MTLLoader();mtlLoader.load("model.mtl", (materials) => {  materials.preload();  const objLoader = new OBJLoader();  objLoader.setMaterials(materials);  objLoader.load("model.obj", (object) => {    scene.add(object);  });});
```
```
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";import { MTLLoader } from "three/addons/loaders/MTLLoader.js";const mtlLoader = new MTLLoader();mtlLoader.load("model.mtl", (materials) => {  materials.preload();  const objLoader = new OBJLoader();  objLoader.setMaterials(materials);  objLoader.load("model.obj", (object) => {    scene.add(object);  });});
```
```
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";const loader = new FBXLoader();loader.load("model.fbx", (object) => {  // FBX often has large scale  object.scale.setScalar(0.01);  // Animations  const mixer = new THREE.AnimationMixer(object);  object.animations.forEach((clip) => {    mixer.clipAction(clip).play();  });  scene.add(object);});
```
```
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";const loader = new FBXLoader();loader.load("model.fbx", (object) => {  // FBX often has large scale  object.scale.setScalar(0.01);  // Animations  const mixer = new THREE.AnimationMixer(object);  object.animations.forEach((clip) => {    mixer.clipAction(clip).play();  });  scene.add(object);});
```
```
import { STLLoader } from "three/addons/loaders/STLLoader.js";const loader = new STLLoader();loader.load("model.stl", (geometry) => {  const material = new THREE.MeshStandardMaterial({ color: 0x888888 });  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
import { STLLoader } from "three/addons/loaders/STLLoader.js";const loader = new STLLoader();loader.load("model.stl", (geometry) => {  const material = new THREE.MeshStandardMaterial({ color: 0x888888 });  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";const loader = new PLYLoader();loader.load("model.ply", (geometry) => {  geometry.computeVertexNormals();  const material = new THREE.MeshStandardMaterial({ vertexColors: true });  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";const loader = new PLYLoader();loader.load("model.ply", (geometry) => {  geometry.computeVertexNormals();  const material = new THREE.MeshStandardMaterial({ vertexColors: true });  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
function loadModel(url) {  return new Promise((resolve, reject) => {    loader.load(url, resolve, undefined, reject);  });}// Usageasync function init() {  try {    const gltf = await loadModel("model.glb");    scene.add(gltf.scene);  } catch (error) {    console.error("Failed to load model:", error);  }}
```
```
function loadModel(url) {  return new Promise((resolve, reject) => {    loader.load(url, resolve, undefined, reject);  });}// Usageasync function init() {  try {    const gltf = await loadModel("model.glb");    scene.add(gltf.scene);  } catch (error) {    console.error("Failed to load model:", error);  }}
```
```
async function loadAssets() {  const [modelGltf, envTexture, colorTexture] = await Promise.all([    loadGLTF("model.glb"),    loadRGBE("environment.hdr"),    loadTexture("color.jpg"),  ]);  scene.add(modelGltf.scene);  scene.environment = envTexture;  material.map = colorTexture;}// Helper functionsfunction loadGLTF(url) {  return new Promise((resolve, reject) => {    new GLTFLoader().load(url, resolve, undefined, reject);  });}function loadRGBE(url) {  return new Promise((resolve, reject) => {    new RGBELoader().load(      url,      (texture) => {        texture.mapping = THREE.EquirectangularReflectionMapping;        resolve(texture);      },      undefined,      reject,    );  });}function loadTexture(url) {  return new Promise((resolve, reject) => {    new THREE.TextureLoader().load(url, resolve, undefined, reject);  });}
```
```
async function loadAssets() {  const [modelGltf, envTexture, colorTexture] = await Promise.all([    loadGLTF("model.glb"),    loadRGBE("environment.hdr"),    loadTexture("color.jpg"),  ]);  scene.add(modelGltf.scene);  scene.environment = envTexture;  material.map = colorTexture;}// Helper functionsfunction loadGLTF(url) {  return new Promise((resolve, reject) => {    new GLTFLoader().load(url, resolve, undefined, reject);  });}function loadRGBE(url) {  return new Promise((resolve, reject) => {    new RGBELoader().load(      url,      (texture) => {        texture.mapping = THREE.EquirectangularReflectionMapping;        resolve(texture);      },      undefined,      reject,    );  });}function loadTexture(url) {  return new Promise((resolve, reject) => {    new THREE.TextureLoader().load(url, resolve, undefined, reject);  });}
```
```
// Enable cacheTHREE.Cache.enabled = true;// Clear cacheTHREE.Cache.clear();// Manual cache managementTHREE.Cache.add("key", data);THREE.Cache.get("key");THREE.Cache.remove("key");
```
```
// Enable cacheTHREE.Cache.enabled = true;// Clear cacheTHREE.Cache.clear();// Manual cache managementTHREE.Cache.add("key", data);THREE.Cache.get("key");THREE.Cache.remove("key");
```
```
class AssetManager {  constructor() {    this.textures = new Map();    this.models = new Map();    this.gltfLoader = new GLTFLoader();    this.textureLoader = new THREE.TextureLoader();  }  async loadTexture(key, url) {    if (this.textures.has(key)) {      return this.textures.get(key);    }    const texture = await new Promise((resolve, reject) => {      this.textureLoader.load(url, resolve, undefined, reject);    });    this.textures.set(key, texture);    return texture;  }  async loadModel(key, url) {    if (this.models.has(key)) {      return this.models.get(key).clone();    }    const gltf = await new Promise((resolve, reject) => {      this.gltfLoader.load(url, resolve, undefined, reject);    });    this.models.set(key, gltf.scene);    return gltf.scene.clone();  }  dispose() {    this.textures.forEach((t) => t.dispose());    this.textures.clear();    this.models.clear();  }}// Usageconst assets = new AssetManager();const texture = await assets.loadTexture("brick", "brick.jpg");const model = await assets.loadModel("tree", "tree.glb");
```
```
class AssetManager {  constructor() {    this.textures = new Map();    this.models = new Map();    this.gltfLoader = new GLTFLoader();    this.textureLoader = new THREE.TextureLoader();  }  async loadTexture(key, url) {    if (this.textures.has(key)) {      return this.textures.get(key);    }    const texture = await new Promise((resolve, reject) => {      this.textureLoader.load(url, resolve, undefined, reject);    });    this.textures.set(key, texture);    return texture;  }  async loadModel(key, url) {    if (this.models.has(key)) {      return this.models.get(key).clone();    }    const gltf = await new Promise((resolve, reject) => {      this.gltfLoader.load(url, resolve, undefined, reject);    });    this.models.set(key, gltf.scene);    return gltf.scene.clone();  }  dispose() {    this.textures.forEach((t) => t.dispose());    this.textures.clear();    this.models.clear();  }}// Usageconst assets = new AssetManager();const texture = await assets.loadTexture("brick", "brick.jpg");const model = await assets.loadModel("tree", "tree.glb");
```
```
const loader = new THREE.TextureLoader();const texture = loader.load("data:image/png;base64,iVBORw0KGgo...");
```
```
const loader = new THREE.TextureLoader();const texture = loader.load("data:image/png;base64,iVBORw0KGgo...");
```
```
async function loadFromBlob(blob) {  const url = URL.createObjectURL(blob);  const texture = await loadTexture(url);  URL.revokeObjectURL(url);  return texture;}
```
```
async function loadFromBlob(blob) {  const url = URL.createObjectURL(blob);  const texture = await loadTexture(url);  URL.revokeObjectURL(url);  return texture;}
```
```
// From fetchconst response = await fetch("model.glb");const buffer = await response.arrayBuffer();// Parse with loaderconst loader = new GLTFLoader();loader.parse(buffer, "", (gltf) => {  scene.add(gltf.scene);});
```
```
// From fetchconst response = await fetch("model.glb");const buffer = await response.arrayBuffer();// Parse with loaderconst loader = new GLTFLoader();loader.parse(buffer, "", (gltf) => {  scene.add(gltf.scene);});
```
```
// Set base pathloader.setPath("assets/models/");loader.load("model.glb"); // Loads from assets/models/model.glb// Set resource path (for textures referenced in model)loader.setResourcePath("assets/textures/");// Custom URL modifiermanager.setURLModifier((url) => {  return https://cdn.example.com/${url};});
```
```
// Set base pathloader.setPath("assets/models/");loader.load("model.glb"); // Loads from assets/models/model.glb// Set resource path (for textures referenced in model)loader.setResourcePath("assets/textures/");// Custom URL modifiermanager.setURLModifier((url) => {  return https://cdn.example.com/${url};});
```
```
https://cdn.example.com/${url}
```
```
// Graceful fallbackasync function loadWithFallback(primaryUrl, fallbackUrl) {  try {    return await loadModel(primaryUrl);  } catch (error) {    console.warn(Primary failed, trying fallback: ${error});    return await loadModel(fallbackUrl);  }}// Retry logicasync function loadWithRetry(url, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await loadModel(url);    } catch (error) {      if (i === maxRetries - 1) throw error;      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));    }  }}// Timeoutasync function loadWithTimeout(url, timeout = 30000) {  const controller = new AbortController();  const timeoutId = setTimeout(() => controller.abort(), timeout);  try {    const response = await fetch(url, { signal: controller.signal });    clearTimeout(timeoutId);    return response;  } catch (error) {    if (error.name === "AbortError") {      throw new Error("Loading timed out");    }    throw error;  }}
```
```
// Graceful fallbackasync function loadWithFallback(primaryUrl, fallbackUrl) {  try {    return await loadModel(primaryUrl);  } catch (error) {    console.warn(Primary failed, trying fallback: ${error});    return await loadModel(fallbackUrl);  }}// Retry logicasync function loadWithRetry(url, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await loadModel(url);    } catch (error) {      if (i === maxRetries - 1) throw error;      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));    }  }}// Timeoutasync function loadWithTimeout(url, timeout = 30000) {  const controller = new AbortController();  const timeoutId = setTimeout(() => controller.abort(), timeout);  try {    const response = await fetch(url, { signal: controller.signal });    clearTimeout(timeoutId);    return response;  } catch (error) {    if (error.name === "AbortError") {      throw new Error("Loading timed out");    }    throw error;  }}
```
```
Primary failed, trying fallback: ${error}
```
```
THREE.Cache.enabled = true
```
```
// Progressive loading with placeholderconst placeholder = new THREE.Mesh(  new THREE.BoxGeometry(1, 1, 1),  new THREE.MeshBasicMaterial({ wireframe: true }),);scene.add(placeholder);loadModel("model.glb").then((gltf) => {  scene.remove(placeholder);  scene.add(gltf.scene);});
```
```
// Progressive loading with placeholderconst placeholder = new THREE.Mesh(  new THREE.BoxGeometry(1, 1, 1),  new THREE.MeshBasicMaterial({ wireframe: true }),);scene.add(placeholder);loadModel("model.glb").then((gltf) => {  scene.remove(placeholder);  scene.add(gltf.scene);});
```
```
threejs-textures
```
```
threejs-animation
```
```
threejs-materials
```
Unlock the full potential of interactive 3D web experiences by mastering asset loading with Three.js. This Agent Skill provides comprehensive guidance on integrating various multimedia assets, from intricate GLTF models to high-resolution textures and HDR environments, into your scenes. Learn how to efficiently manage asynchronous operations, track loading progress, and ensure a smooth user experience. Whether you're building a portfolio piece, an e-commerce visualization, or an immersive game, this skill equips you with the tools to handle complex asset pipelines with ease and precision, making your 3D projects come alive.

# When to Use This Skill
- •Building an interactive 3D product configurator that loads different parts or textures dynamically.
- •Developing a web-based game that requires loading multiple models, sounds, and textures with a progress bar.
- •Creating a virtual tour or architectural visualization with complex 3D scenes and environmental maps.
- •Implementing a metaverse-like experience where user-generated content or complex environments need to be streamed.

# Pro Tips
- 💡Always use `THREE.LoadingManager` for projects with multiple assets; it centralizes progress tracking and error handling, making your code cleaner and more robust.
- 💡Optimize your 3D models (e.g., using `gltf-pipeline` for GLTF) and textures (e.g., compressed formats like KTX2) *before* loading to minimize file sizes and improve load times significantly.
- 💡Implement a visual loading indicator or progress bar early in development to provide immediate feedback to users, especially for larger assets, preventing perceived delays.

