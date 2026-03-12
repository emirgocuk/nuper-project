# threejs-textures
Source: https://antigravity.codes/agent-skills/ui-design/threejs-textures

## AI Worker Instructions
When the user requests functionality related to threejs-textures, follow these guidelines and utilize this context.

## Scraped Content

# threejs-textures
```
import * as THREE from "three";// Load textureconst loader = new THREE.TextureLoader();const texture = loader.load("texture.jpg");// Apply to materialconst material = new THREE.MeshStandardMaterial({  map: texture,});
```
```
import * as THREE from "three";// Load textureconst loader = new THREE.TextureLoader();const texture = loader.load("texture.jpg");// Apply to materialconst material = new THREE.MeshStandardMaterial({  map: texture,});
```
```
const loader = new THREE.TextureLoader();// Async with callbacksloader.load(  "texture.jpg",  (texture) => console.log("Loaded"),  (progress) => console.log("Progress"),  (error) => console.error("Error"),);// Synchronous style (loads async internally)const texture = loader.load("texture.jpg");material.map = texture;
```
```
const loader = new THREE.TextureLoader();// Async with callbacksloader.load(  "texture.jpg",  (texture) => console.log("Loaded"),  (progress) => console.log("Progress"),  (error) => console.error("Error"),);// Synchronous style (loads async internally)const texture = loader.load("texture.jpg");material.map = texture;
```
```
function loadTexture(url) {  return new Promise((resolve, reject) => {    new THREE.TextureLoader().load(url, resolve, undefined, reject);  });}// Usageconst [colorMap, normalMap, roughnessMap] = await Promise.all([  loadTexture("color.jpg"),  loadTexture("normal.jpg"),  loadTexture("roughness.jpg"),]);
```
```
function loadTexture(url) {  return new Promise((resolve, reject) => {    new THREE.TextureLoader().load(url, resolve, undefined, reject);  });}// Usageconst [colorMap, normalMap, roughnessMap] = await Promise.all([  loadTexture("color.jpg"),  loadTexture("normal.jpg"),  loadTexture("roughness.jpg"),]);
```
```
// Color/albedo textures - use sRGBcolorTexture.colorSpace = THREE.SRGBColorSpace;// Data textures (normal, roughness, metalness, AO) - leave as default// Do NOT set colorSpace for data textures (NoColorSpace is default)
```
```
// Color/albedo textures - use sRGBcolorTexture.colorSpace = THREE.SRGBColorSpace;// Data textures (normal, roughness, metalness, AO) - leave as default// Do NOT set colorSpace for data textures (NoColorSpace is default)
```
```
texture.wrapS = THREE.RepeatWrapping; // Horizontaltexture.wrapT = THREE.RepeatWrapping; // Vertical// Options:// THREE.ClampToEdgeWrapping - Stretches edge pixels (default)// THREE.RepeatWrapping - Tiles the texture// THREE.MirroredRepeatWrapping - Tiles with mirror flip
```
```
texture.wrapS = THREE.RepeatWrapping; // Horizontaltexture.wrapT = THREE.RepeatWrapping; // Vertical// Options:// THREE.ClampToEdgeWrapping - Stretches edge pixels (default)// THREE.RepeatWrapping - Tiles the texture// THREE.MirroredRepeatWrapping - Tiles with mirror flip
```
```
// Tile texture 4x4texture.repeat.set(4, 4);texture.wrapS = THREE.RepeatWrapping;texture.wrapT = THREE.RepeatWrapping;// Offset (0-1 range)texture.offset.set(0.5, 0.5);// Rotation (radians, around center)texture.rotation = Math.PI / 4;texture.center.set(0.5, 0.5); // Rotation pivot
```
```
// Tile texture 4x4texture.repeat.set(4, 4);texture.wrapS = THREE.RepeatWrapping;texture.wrapT = THREE.RepeatWrapping;// Offset (0-1 range)texture.offset.set(0.5, 0.5);// Rotation (radians, around center)texture.rotation = Math.PI / 4;texture.center.set(0.5, 0.5); // Rotation pivot
```
```
// Minification (texture larger than screen pixels)texture.minFilter = THREE.LinearMipmapLinearFilter; // Default, smoothtexture.minFilter = THREE.NearestFilter; // Pixelatedtexture.minFilter = THREE.LinearFilter; // Smooth, no mipmaps// Magnification (texture smaller than screen pixels)texture.magFilter = THREE.LinearFilter; // Smooth (default)texture.magFilter = THREE.NearestFilter; // Pixelated (retro games)// Anisotropic filtering (sharper at angles)texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```
```
// Minification (texture larger than screen pixels)texture.minFilter = THREE.LinearMipmapLinearFilter; // Default, smoothtexture.minFilter = THREE.NearestFilter; // Pixelatedtexture.minFilter = THREE.LinearFilter; // Smooth, no mipmaps// Magnification (texture smaller than screen pixels)texture.magFilter = THREE.LinearFilter; // Smooth (default)texture.magFilter = THREE.NearestFilter; // Pixelated (retro games)// Anisotropic filtering (sharper at angles)texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```
```
// Usually true by defaulttexture.generateMipmaps = true;// Disable for non-power-of-2 textures or data texturestexture.generateMipmaps = false;texture.minFilter = THREE.LinearFilter;
```
```
// Usually true by defaulttexture.generateMipmaps = true;// Disable for non-power-of-2 textures or data texturestexture.generateMipmaps = false;texture.minFilter = THREE.LinearFilter;
```
```
const texture = new THREE.Texture(image);texture.needsUpdate = true;
```
```
const texture = new THREE.Texture(image);texture.needsUpdate = true;
```
```
// Create gradient textureconst size = 256;const data = new Uint8Array(size * size * 4);for (let i = 0; i < size; i++) {  for (let j = 0; j < size; j++) {    const index = (i * size + j) * 4;    data[index] = i; // R    data[index + 1] = j; // G    data[index + 2] = 128; // B    data[index + 3] = 255; // A  }}const texture = new THREE.DataTexture(data, size, size);texture.needsUpdate = true;
```
```
// Create gradient textureconst size = 256;const data = new Uint8Array(size * size * 4);for (let i = 0; i < size; i++) {  for (let j = 0; j < size; j++) {    const index = (i * size + j) * 4;    data[index] = i; // R    data[index + 1] = j; // G    data[index + 2] = 128; // B    data[index + 3] = 255; // A  }}const texture = new THREE.DataTexture(data, size, size);texture.needsUpdate = true;
```
```
const canvas = document.createElement("canvas");canvas.width = 256;canvas.height = 256;const ctx = canvas.getContext("2d");// Draw on canvasctx.fillStyle = "red";ctx.fillRect(0, 0, 256, 256);ctx.fillStyle = "white";ctx.font = "48px Arial";ctx.fillText("Hello", 50, 150);const texture = new THREE.CanvasTexture(canvas);// Update when canvas changestexture.needsUpdate = true;
```
```
const canvas = document.createElement("canvas");canvas.width = 256;canvas.height = 256;const ctx = canvas.getContext("2d");// Draw on canvasctx.fillStyle = "red";ctx.fillRect(0, 0, 256, 256);ctx.fillStyle = "white";ctx.font = "48px Arial";ctx.fillText("Hello", 50, 150);const texture = new THREE.CanvasTexture(canvas);// Update when canvas changestexture.needsUpdate = true;
```
```
const video = document.createElement("video");video.src = "video.mp4";video.loop = true;video.muted = true;video.play();const texture = new THREE.VideoTexture(video);texture.colorSpace = THREE.SRGBColorSpace;// No need to set needsUpdate - auto-updates
```
```
const video = document.createElement("video");video.src = "video.mp4";video.loop = true;video.muted = true;video.play();const texture = new THREE.VideoTexture(video);texture.colorSpace = THREE.SRGBColorSpace;// No need to set needsUpdate - auto-updates
```
```
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";const ktx2Loader = new KTX2Loader();ktx2Loader.setTranscoderPath("path/to/basis/");ktx2Loader.detectSupport(renderer);ktx2Loader.load("texture.ktx2", (texture) => {  material.map = texture;});
```
```
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";const ktx2Loader = new KTX2Loader();ktx2Loader.setTranscoderPath("path/to/basis/");ktx2Loader.detectSupport(renderer);ktx2Loader.load("texture.ktx2", (texture) => {  material.map = texture;});
```
```
const loader = new THREE.CubeTextureLoader();const cubeTexture = loader.load([  "px.jpg",  "nx.jpg", // +X, -X  "py.jpg",  "ny.jpg", // +Y, -Y  "pz.jpg",  "nz.jpg", // +Z, -Z]);// As backgroundscene.background = cubeTexture;// As environment mapscene.environment = cubeTexture;material.envMap = cubeTexture;
```
```
const loader = new THREE.CubeTextureLoader();const cubeTexture = loader.load([  "px.jpg",  "nx.jpg", // +X, -X  "py.jpg",  "ny.jpg", // +Y, -Y  "pz.jpg",  "nz.jpg", // +Z, -Z]);// As backgroundscene.background = cubeTexture;// As environment mapscene.environment = cubeTexture;material.envMap = cubeTexture;
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();new RGBELoader().load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  scene.background = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();new RGBELoader().load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  scene.background = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const loader = new RGBELoader();loader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const loader = new RGBELoader();loader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});
```
```
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";const loader = new EXRLoader();loader.load("environment.exr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;});
```
```
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";const loader = new EXRLoader();loader.load("environment.exr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;});
```
```
scene.background = texture;scene.backgroundBlurriness = 0.5; // 0-1, blur backgroundscene.backgroundIntensity = 1.0; // Brightnessscene.backgroundRotation.y = Math.PI; // Rotate background
```
```
scene.background = texture;scene.backgroundBlurriness = 0.5; // 0-1, blur backgroundscene.backgroundIntensity = 1.0; // Brightnessscene.backgroundRotation.y = Math.PI; // Rotate background
```
```
// Create render targetconst renderTarget = new THREE.WebGLRenderTarget(512, 512, {  minFilter: THREE.LinearFilter,  magFilter: THREE.LinearFilter,  format: THREE.RGBAFormat,});// Render scene to targetrenderer.setRenderTarget(renderTarget);renderer.render(scene, camera);renderer.setRenderTarget(null); // Back to screen// Use as texturematerial.map = renderTarget.texture;
```
```
// Create render targetconst renderTarget = new THREE.WebGLRenderTarget(512, 512, {  minFilter: THREE.LinearFilter,  magFilter: THREE.LinearFilter,  format: THREE.RGBAFormat,});// Render scene to targetrenderer.setRenderTarget(renderTarget);renderer.render(scene, camera);renderer.setRenderTarget(null); // Back to screen// Use as texturematerial.map = renderTarget.texture;
```
```
const renderTarget = new THREE.WebGLRenderTarget(512, 512);renderTarget.depthTexture = new THREE.DepthTexture(  512,  512,  THREE.UnsignedShortType,);// Access depthconst depthTexture = renderTarget.depthTexture;
```
```
const renderTarget = new THREE.WebGLRenderTarget(512, 512);renderTarget.depthTexture = new THREE.DepthTexture(  512,  512,  THREE.UnsignedShortType,);// Access depthconst depthTexture = renderTarget.depthTexture;
```
```
const renderTarget = new THREE.WebGLRenderTarget(512, 512, {  samples: 4, // MSAA});
```
```
const renderTarget = new THREE.WebGLRenderTarget(512, 512, {  samples: 4, // MSAA});
```
```
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {  generateMipmaps: true,  minFilter: THREE.LinearMipmapLinearFilter,});const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);scene.add(cubeCamera);// Apply to reflective materialreflectiveMaterial.envMap = cubeRenderTarget.texture;// Update in animation loop (expensive!)function animate() {  // Hide reflective object, update env map, show again  reflectiveObject.visible = false;  cubeCamera.position.copy(reflectiveObject.position);  cubeCamera.update(renderer, scene);  reflectiveObject.visible = true;}
```
```
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {  generateMipmaps: true,  minFilter: THREE.LinearMipmapLinearFilter,});const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);scene.add(cubeCamera);// Apply to reflective materialreflectiveMaterial.envMap = cubeRenderTarget.texture;// Update in animation loop (expensive!)function animate() {  // Hide reflective object, update env map, show again  reflectiveObject.visible = false;  cubeCamera.position.copy(reflectiveObject.position);  cubeCamera.update(renderer, scene);  reflectiveObject.visible = true;}
```
```
const uvs = geometry.attributes.uv;// Read UVconst u = uvs.getX(vertexIndex);const v = uvs.getY(vertexIndex);// Modify UVuvs.setXY(vertexIndex, newU, newV);uvs.needsUpdate = true;
```
```
const uvs = geometry.attributes.uv;// Read UVconst u = uvs.getX(vertexIndex);const v = uvs.getY(vertexIndex);// Modify UVuvs.setXY(vertexIndex, newU, newV);uvs.needsUpdate = true;
```
```
// Required for aoMapgeometry.setAttribute("uv2", geometry.attributes.uv);// Or create custom second UVconst uv2 = new Float32Array(vertexCount * 2);// ... fill uv2 datageometry.setAttribute("uv2", new THREE.BufferAttribute(uv2, 2));
```
```
// Required for aoMapgeometry.setAttribute("uv2", geometry.attributes.uv);// Or create custom second UVconst uv2 = new Float32Array(vertexCount * 2);// ... fill uv2 datageometry.setAttribute("uv2", new THREE.BufferAttribute(uv2, 2));
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    map: { value: texture },    uvOffset: { value: new THREE.Vector2(0, 0) },    uvScale: { value: new THREE.Vector2(1, 1) },  },  vertexShader:     varying vec2 vUv;    uniform vec2 uvOffset;    uniform vec2 uvScale;    void main() {      vUv = uv * uvScale + uvOffset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    uniform sampler2D map;    void main() {      gl_FragColor = texture2D(map, vUv);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    map: { value: texture },    uvOffset: { value: new THREE.Vector2(0, 0) },    uvScale: { value: new THREE.Vector2(1, 1) },  },  vertexShader:     varying vec2 vUv;    uniform vec2 uvOffset;    uniform vec2 uvScale;    void main() {      vUv = uv * uvScale + uvOffset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    uniform sampler2D map;    void main() {      gl_FragColor = texture2D(map, vUv);    }  ,});
```
```
varying vec2 vUv;    uniform vec2 uvOffset;    uniform vec2 uvScale;    void main() {      vUv = uv * uvScale + uvOffset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
varying vec2 vUv;    uniform sampler2D map;    void main() {      gl_FragColor = texture2D(map, vUv);    }
```
```
// Atlas with 4 sprites (2x2 grid)const atlas = loader.load("atlas.png");atlas.wrapS = THREE.ClampToEdgeWrapping;atlas.wrapT = THREE.ClampToEdgeWrapping;// Select sprite by UV offset/scalefunction selectSprite(row, col, gridSize = 2) {  atlas.offset.set(col / gridSize, 1 - (row + 1) / gridSize);  atlas.repeat.set(1 / gridSize, 1 / gridSize);}// Select top-left spriteselectSprite(0, 0);
```
```
// Atlas with 4 sprites (2x2 grid)const atlas = loader.load("atlas.png");atlas.wrapS = THREE.ClampToEdgeWrapping;atlas.wrapT = THREE.ClampToEdgeWrapping;// Select sprite by UV offset/scalefunction selectSprite(row, col, gridSize = 2) {  atlas.offset.set(col / gridSize, 1 - (row + 1) / gridSize);  atlas.repeat.set(1 / gridSize, 1 / gridSize);}// Select top-left spriteselectSprite(0, 0);
```
```
const material = new THREE.MeshStandardMaterial({  // Base color (sRGB)  map: colorTexture,  // Surface detail (Linear)  normalMap: normalTexture,  normalScale: new THREE.Vector2(1, 1),  // Roughness (Linear, grayscale)  roughnessMap: roughnessTexture,  roughness: 1, // Multiplier  // Metalness (Linear, grayscale)  metalnessMap: metalnessTexture,  metalness: 1, // Multiplier  // Ambient occlusion (Linear, uses uv2)  aoMap: aoTexture,  aoMapIntensity: 1,  // Self-illumination (sRGB)  emissiveMap: emissiveTexture,  emissive: 0xffffff,  emissiveIntensity: 1,  // Vertex displacement (Linear)  displacementMap: displacementTexture,  displacementScale: 0.1,  displacementBias: 0,  // Alpha (Linear)  alphaMap: alphaTexture,  transparent: true,});// Don't forget UV2 for AOgeometry.setAttribute("uv2", geometry.attributes.uv);
```
```
const material = new THREE.MeshStandardMaterial({  // Base color (sRGB)  map: colorTexture,  // Surface detail (Linear)  normalMap: normalTexture,  normalScale: new THREE.Vector2(1, 1),  // Roughness (Linear, grayscale)  roughnessMap: roughnessTexture,  roughness: 1, // Multiplier  // Metalness (Linear, grayscale)  metalnessMap: metalnessTexture,  metalness: 1, // Multiplier  // Ambient occlusion (Linear, uses uv2)  aoMap: aoTexture,  aoMapIntensity: 1,  // Self-illumination (sRGB)  emissiveMap: emissiveTexture,  emissive: 0xffffff,  emissiveIntensity: 1,  // Vertex displacement (Linear)  displacementMap: displacementTexture,  displacementScale: 0.1,  displacementBias: 0,  // Alpha (Linear)  alphaMap: alphaTexture,  transparent: true,});// Don't forget UV2 for AOgeometry.setAttribute("uv2", geometry.attributes.uv);
```
```
// OpenGL style normals (default)material.normalMapType = THREE.TangentSpaceNormalMap;// Object space normalsmaterial.normalMapType = THREE.ObjectSpaceNormalMap;
```
```
// OpenGL style normals (default)material.normalMapType = THREE.TangentSpaceNormalMap;// Object space normalsmaterial.normalMapType = THREE.ObjectSpaceNormalMap;
```
```
function generateNoiseTexture(size = 256) {  const data = new Uint8Array(size * size * 4);  for (let i = 0; i < size * size; i++) {    const value = Math.random() * 255;    data[i * 4] = value;    data[i * 4 + 1] = value;    data[i * 4 + 2] = value;    data[i * 4 + 3] = 255;  }  const texture = new THREE.DataTexture(data, size, size);  texture.needsUpdate = true;  return texture;}
```
```
function generateNoiseTexture(size = 256) {  const data = new Uint8Array(size * size * 4);  for (let i = 0; i < size * size; i++) {    const value = Math.random() * 255;    data[i * 4] = value;    data[i * 4 + 1] = value;    data[i * 4 + 2] = value;    data[i * 4 + 3] = 255;  }  const texture = new THREE.DataTexture(data, size, size);  texture.needsUpdate = true;  return texture;}
```
```
function generateGradientTexture(color1, color2, size = 256) {  const canvas = document.createElement("canvas");  canvas.width = size;  canvas.height = 1;  const ctx = canvas.getContext("2d");  const gradient = ctx.createLinearGradient(0, 0, size, 0);  gradient.addColorStop(0, color1);  gradient.addColorStop(1, color2);  ctx.fillStyle = gradient;  ctx.fillRect(0, 0, size, 1);  return new THREE.CanvasTexture(canvas);}
```
```
function generateGradientTexture(color1, color2, size = 256) {  const canvas = document.createElement("canvas");  canvas.width = size;  canvas.height = 1;  const ctx = canvas.getContext("2d");  const gradient = ctx.createLinearGradient(0, 0, size, 0);  gradient.addColorStop(0, color1);  gradient.addColorStop(1, color2);  ctx.fillStyle = gradient;  ctx.fillRect(0, 0, size, 1);  return new THREE.CanvasTexture(canvas);}
```
```
// Single texturetexture.dispose();// Material texturesfunction disposeMaterial(material) {  const maps = [    "map",    "normalMap",    "roughnessMap",    "metalnessMap",    "aoMap",    "emissiveMap",    "displacementMap",    "alphaMap",    "envMap",    "lightMap",    "bumpMap",    "specularMap",  ];  maps.forEach((mapName) => {    if (material[mapName]) {      material[mapName].dispose();    }  });  material.dispose();}
```
```
// Single texturetexture.dispose();// Material texturesfunction disposeMaterial(material) {  const maps = [    "map",    "normalMap",    "roughnessMap",    "metalnessMap",    "aoMap",    "emissiveMap",    "displacementMap",    "alphaMap",    "envMap",    "lightMap",    "bumpMap",    "specularMap",  ];  maps.forEach((mapName) => {    if (material[mapName]) {      material[mapName].dispose();    }  });  material.dispose();}
```
```
class TexturePool {  constructor() {    this.textures = new Map();    this.loader = new THREE.TextureLoader();  }  async get(url) {    if (this.textures.has(url)) {      return this.textures.get(url);    }    const texture = await new Promise((resolve, reject) => {      this.loader.load(url, resolve, undefined, reject);    });    this.textures.set(url, texture);    return texture;  }  dispose(url) {    const texture = this.textures.get(url);    if (texture) {      texture.dispose();      this.textures.delete(url);    }  }  disposeAll() {    this.textures.forEach((t) => t.dispose());    this.textures.clear();  }}
```
```
class TexturePool {  constructor() {    this.textures = new Map();    this.loader = new THREE.TextureLoader();  }  async get(url) {    if (this.textures.has(url)) {      return this.textures.get(url);    }    const texture = await new Promise((resolve, reject) => {      this.loader.load(url, resolve, undefined, reject);    });    this.textures.set(url, texture);    return texture;  }  dispose(url) {    const texture = this.textures.get(url);    if (texture) {      texture.dispose();      this.textures.delete(url);    }  }  disposeAll() {    this.textures.forEach((t) => t.dispose());    this.textures.clear();  }}
```
```
// Check texture memoryconsole.log(renderer.info.memory.textures);// Optimize for mobileconst maxSize = renderer.capabilities.maxTextureSize;const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);const textureSize = isMobile ? 1024 : 2048;
```
```
// Check texture memoryconsole.log(renderer.info.memory.textures);// Optimize for mobileconst maxSize = renderer.capabilities.maxTextureSize;const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);const textureSize = isMobile ? 1024 : 2048;
```
```
threejs-materials
```
```
threejs-loaders
```
```
threejs-shaders
```
Textures are fundamental to bringing visual realism and detail to 3D environments. This agent skill unlocks a comprehensive understanding of how to effectively apply, manage, and optimize textures within your Three.js projects. From basic image mapping and understanding UV coordinates to implementing complex environment maps and fine-tuning texture settings, it empowers you to transform simple geometries into visually rich and immersive scenes. Leverage this skill to ensure your 3D models are rendered with accuracy and stunning visual fidelity, making your creations truly stand out.

# When to Use This Skill
- •Applying image files (JPG, PNG) as color, normal, or roughness maps to 3D models in Three.js.
- •Implementing dynamic cubemaps or HDR environment maps for realistic reflections and global illumination.
- •Debugging and optimizing texture memory usage and loading performance in a Three.js application.
- •Working with UV coordinates to precisely control how textures wrap around custom 3D geometries.

# Pro Tips
- 💡**Color Space Consistency**: Always ensure your color/albedo textures are set to `THREE.SRGBColorSpace` for accurate color reproduction, while non-color data (normals, roughness) should use `THREE.NoColorSpace`.
- 💡**Mipmapping & Anisotropy**: For textures viewed at varying distances, enable mipmaps and set a suitable `anisotropy` level on your texture to prevent aliasing and improve visual quality from oblique angles.
- 💡**Texture Packing**: For performance, consider packing multiple grayscale textures (e.g., roughness, metallic, AO) into separate channels of a single RGB image to reduce draw calls and memory footprint.

