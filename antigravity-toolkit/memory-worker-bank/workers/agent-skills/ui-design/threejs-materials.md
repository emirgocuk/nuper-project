# threejs-materials
Source: https://antigravity.codes/agent-skills/ui-design/threejs-materials

## AI Worker Instructions
When the user requests functionality related to threejs-materials, follow these guidelines and utilize this context.

## Scraped Content

# threejs-materials
```
import * as THREE from "three";// PBR material (recommended for realistic rendering)const material = new THREE.MeshStandardMaterial({  color: 0x00ff00,  roughness: 0.5,  metalness: 0.5,});const mesh = new THREE.Mesh(geometry, material);
```
```
import * as THREE from "three";// PBR material (recommended for realistic rendering)const material = new THREE.MeshStandardMaterial({  color: 0x00ff00,  roughness: 0.5,  metalness: 0.5,});const mesh = new THREE.Mesh(geometry, material);
```
```
const material = new THREE.MeshBasicMaterial({  color: 0xff0000,  transparent: true,  opacity: 0.5,  side: THREE.DoubleSide, // FrontSide, BackSide, DoubleSide  wireframe: false,  map: texture, // Color/diffuse texture  alphaMap: alphaTexture, // Transparency texture  envMap: envTexture, // Reflection texture  reflectivity: 1, // Env map intensity  fog: true, // Affected by scene fog});
```
```
const material = new THREE.MeshBasicMaterial({  color: 0xff0000,  transparent: true,  opacity: 0.5,  side: THREE.DoubleSide, // FrontSide, BackSide, DoubleSide  wireframe: false,  map: texture, // Color/diffuse texture  alphaMap: alphaTexture, // Transparency texture  envMap: envTexture, // Reflection texture  reflectivity: 1, // Env map intensity  fog: true, // Affected by scene fog});
```
```
const material = new THREE.MeshLambertMaterial({  color: 0x00ff00,  emissive: 0x111111, // Self-illumination color  emissiveIntensity: 1,  map: texture,  emissiveMap: emissiveTexture,  envMap: envTexture,  reflectivity: 0.5,});
```
```
const material = new THREE.MeshLambertMaterial({  color: 0x00ff00,  emissive: 0x111111, // Self-illumination color  emissiveIntensity: 1,  map: texture,  emissiveMap: emissiveTexture,  envMap: envTexture,  reflectivity: 0.5,});
```
```
const material = new THREE.MeshPhongMaterial({  color: 0x0000ff,  specular: 0xffffff, // Highlight color  shininess: 100, // Highlight sharpness (0-1000)  emissive: 0x000000,  flatShading: false, // Flat vs smooth shading  map: texture,  specularMap: specTexture, // Per-pixel shininess  normalMap: normalTexture,  normalScale: new THREE.Vector2(1, 1),  bumpMap: bumpTexture,  bumpScale: 1,  displacementMap: dispTexture,  displacementScale: 1,});
```
```
const material = new THREE.MeshPhongMaterial({  color: 0x0000ff,  specular: 0xffffff, // Highlight color  shininess: 100, // Highlight sharpness (0-1000)  emissive: 0x000000,  flatShading: false, // Flat vs smooth shading  map: texture,  specularMap: specTexture, // Per-pixel shininess  normalMap: normalTexture,  normalScale: new THREE.Vector2(1, 1),  bumpMap: bumpTexture,  bumpScale: 1,  displacementMap: dispTexture,  displacementScale: 1,});
```
```
const material = new THREE.MeshStandardMaterial({  color: 0xffffff,  roughness: 0.5, // 0 = mirror, 1 = diffuse  metalness: 0.0, // 0 = dielectric, 1 = metal  // Textures  map: colorTexture, // Albedo/base color  roughnessMap: roughTexture, // Per-pixel roughness  metalnessMap: metalTexture, // Per-pixel metalness  normalMap: normalTexture, // Surface detail  normalScale: new THREE.Vector2(1, 1),  aoMap: aoTexture, // Ambient occlusion (uses uv2!)  aoMapIntensity: 1,  displacementMap: dispTexture, // Vertex displacement  displacementScale: 0.1,  displacementBias: 0,  // Emissive  emissive: 0x000000,  emissiveIntensity: 1,  emissiveMap: emissiveTexture,  // Environment  envMap: envTexture,  envMapIntensity: 1,  // Other  flatShading: false,  wireframe: false,  fog: true,});// Note: aoMap requires second UV channelgeometry.setAttribute("uv2", geometry.attributes.uv);
```
```
const material = new THREE.MeshStandardMaterial({  color: 0xffffff,  roughness: 0.5, // 0 = mirror, 1 = diffuse  metalness: 0.0, // 0 = dielectric, 1 = metal  // Textures  map: colorTexture, // Albedo/base color  roughnessMap: roughTexture, // Per-pixel roughness  metalnessMap: metalTexture, // Per-pixel metalness  normalMap: normalTexture, // Surface detail  normalScale: new THREE.Vector2(1, 1),  aoMap: aoTexture, // Ambient occlusion (uses uv2!)  aoMapIntensity: 1,  displacementMap: dispTexture, // Vertex displacement  displacementScale: 0.1,  displacementBias: 0,  // Emissive  emissive: 0x000000,  emissiveIntensity: 1,  emissiveMap: emissiveTexture,  // Environment  envMap: envTexture,  envMapIntensity: 1,  // Other  flatShading: false,  wireframe: false,  fog: true,});// Note: aoMap requires second UV channelgeometry.setAttribute("uv2", geometry.attributes.uv);
```
```
const material = new THREE.MeshPhysicalMaterial({  // All MeshStandardMaterial properties plus:  // Clearcoat (car paint, lacquer)  clearcoat: 1.0, // 0-1 clearcoat layer strength  clearcoatRoughness: 0.1,  clearcoatMap: ccTexture,  clearcoatRoughnessMap: ccrTexture,  clearcoatNormalMap: ccnTexture,  clearcoatNormalScale: new THREE.Vector2(1, 1),  // Transmission (glass, water)  transmission: 1.0, // 0 = opaque, 1 = fully transparent  transmissionMap: transTexture,  thickness: 0.5, // Volume thickness for refraction  thicknessMap: thickTexture,  attenuationDistance: 1, // Absorption distance  attenuationColor: new THREE.Color(0xffffff),  // Refraction  ior: 1.5, // Index of refraction (1-2.333)  // Sheen (fabric, velvet)  sheen: 1.0,  sheenRoughness: 0.5,  sheenColor: new THREE.Color(0xffffff),  sheenColorMap: sheenTexture,  sheenRoughnessMap: sheenRoughTexture,  // Iridescence (soap bubbles, oil slicks)  iridescence: 1.0,  iridescenceIOR: 1.3,  iridescenceThicknessRange: [100, 400],  iridescenceMap: iridTexture,  iridescenceThicknessMap: iridThickTexture,  // Anisotropy (brushed metal)  anisotropy: 1.0,  anisotropyRotation: 0,  anisotropyMap: anisoTexture,  // Specular  specularIntensity: 1,  specularColor: new THREE.Color(0xffffff),  specularIntensityMap: specIntTexture,  specularColorMap: specColorTexture,});
```
```
const material = new THREE.MeshPhysicalMaterial({  // All MeshStandardMaterial properties plus:  // Clearcoat (car paint, lacquer)  clearcoat: 1.0, // 0-1 clearcoat layer strength  clearcoatRoughness: 0.1,  clearcoatMap: ccTexture,  clearcoatRoughnessMap: ccrTexture,  clearcoatNormalMap: ccnTexture,  clearcoatNormalScale: new THREE.Vector2(1, 1),  // Transmission (glass, water)  transmission: 1.0, // 0 = opaque, 1 = fully transparent  transmissionMap: transTexture,  thickness: 0.5, // Volume thickness for refraction  thicknessMap: thickTexture,  attenuationDistance: 1, // Absorption distance  attenuationColor: new THREE.Color(0xffffff),  // Refraction  ior: 1.5, // Index of refraction (1-2.333)  // Sheen (fabric, velvet)  sheen: 1.0,  sheenRoughness: 0.5,  sheenColor: new THREE.Color(0xffffff),  sheenColorMap: sheenTexture,  sheenRoughnessMap: sheenRoughTexture,  // Iridescence (soap bubbles, oil slicks)  iridescence: 1.0,  iridescenceIOR: 1.3,  iridescenceThicknessRange: [100, 400],  iridescenceMap: iridTexture,  iridescenceThicknessMap: iridThickTexture,  // Anisotropy (brushed metal)  anisotropy: 1.0,  anisotropyRotation: 0,  anisotropyMap: anisoTexture,  // Specular  specularIntensity: 1,  specularColor: new THREE.Color(0xffffff),  specularIntensityMap: specIntTexture,  specularColorMap: specColorTexture,});
```
```
const glass = new THREE.MeshPhysicalMaterial({  color: 0xffffff,  metalness: 0,  roughness: 0,  transmission: 1,  thickness: 0.5,  ior: 1.5,  envMapIntensity: 1,});
```
```
const glass = new THREE.MeshPhysicalMaterial({  color: 0xffffff,  metalness: 0,  roughness: 0,  transmission: 1,  thickness: 0.5,  ior: 1.5,  envMapIntensity: 1,});
```
```
const carPaint = new THREE.MeshPhysicalMaterial({  color: 0xff0000,  metalness: 0.9,  roughness: 0.5,  clearcoat: 1,  clearcoatRoughness: 0.1,});
```
```
const carPaint = new THREE.MeshPhysicalMaterial({  color: 0xff0000,  metalness: 0.9,  roughness: 0.5,  clearcoat: 1,  clearcoatRoughness: 0.1,});
```
```
const material = new THREE.MeshToonMaterial({  color: 0x00ff00,  gradientMap: gradientTexture, // Optional: custom shading gradient});// Create step gradient textureconst colors = new Uint8Array([0, 128, 255]);const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);gradientMap.minFilter = THREE.NearestFilter;gradientMap.magFilter = THREE.NearestFilter;gradientMap.needsUpdate = true;
```
```
const material = new THREE.MeshToonMaterial({  color: 0x00ff00,  gradientMap: gradientTexture, // Optional: custom shading gradient});// Create step gradient textureconst colors = new Uint8Array([0, 128, 255]);const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);gradientMap.minFilter = THREE.NearestFilter;gradientMap.magFilter = THREE.NearestFilter;gradientMap.needsUpdate = true;
```
```
const material = new THREE.MeshNormalMaterial({  flatShading: false,  wireframe: false,});
```
```
const material = new THREE.MeshNormalMaterial({  flatShading: false,  wireframe: false,});
```
```
const material = new THREE.MeshDepthMaterial({  depthPacking: THREE.RGBADepthPacking,});
```
```
const material = new THREE.MeshDepthMaterial({  depthPacking: THREE.RGBADepthPacking,});
```
```
const material = new THREE.PointsMaterial({  color: 0xffffff,  size: 0.1,  sizeAttenuation: true, // Scale with distance  map: pointTexture,  alphaMap: alphaTexture,  transparent: true,  alphaTest: 0.5, // Discard pixels below threshold  vertexColors: true, // Use per-vertex colors});const points = new THREE.Points(geometry, material);
```
```
const material = new THREE.PointsMaterial({  color: 0xffffff,  size: 0.1,  sizeAttenuation: true, // Scale with distance  map: pointTexture,  alphaMap: alphaTexture,  transparent: true,  alphaTest: 0.5, // Discard pixels below threshold  vertexColors: true, // Use per-vertex colors});const points = new THREE.Points(geometry, material);
```
```
// Solid linesconst lineMaterial = new THREE.LineBasicMaterial({  color: 0xffffff,  linewidth: 1, // Note: >1 only works on some systems  linecap: "round",  linejoin: "round",});// Dashed linesconst dashedMaterial = new THREE.LineDashedMaterial({  color: 0xffffff,  dashSize: 0.5,  gapSize: 0.25,  scale: 1,});// Required for dashed linesconst line = new THREE.Line(geometry, dashedMaterial);line.computeLineDistances();
```
```
// Solid linesconst lineMaterial = new THREE.LineBasicMaterial({  color: 0xffffff,  linewidth: 1, // Note: >1 only works on some systems  linecap: "round",  linejoin: "round",});// Dashed linesconst dashedMaterial = new THREE.LineDashedMaterial({  color: 0xffffff,  dashSize: 0.5,  gapSize: 0.25,  scale: 1,});// Required for dashed linesconst line = new THREE.Line(geometry, dashedMaterial);line.computeLineDistances();
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    color: { value: new THREE.Color(0xff0000) },    texture1: { value: texture },  },  vertexShader:     varying vec2 vUv;    uniform float time;    void main() {      vUv = uv;      vec3 pos = position;      pos.z += sin(pos.x * 10.0 + time) * 0.1;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    uniform vec3 color;    uniform sampler2D texture1;    void main() {      // Use texture2D() for GLSL 1.0, texture() for GLSL 3.0 (glslVersion: THREE.GLSL3)      vec4 texColor = texture2D(texture1, vUv);      gl_FragColor = vec4(color * texColor.rgb, 1.0);    }  ,  transparent: true,  side: THREE.DoubleSide,});// Update uniform in animation loopmaterial.uniforms.time.value = clock.getElapsedTime();
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    color: { value: new THREE.Color(0xff0000) },    texture1: { value: texture },  },  vertexShader:     varying vec2 vUv;    uniform float time;    void main() {      vUv = uv;      vec3 pos = position;      pos.z += sin(pos.x * 10.0 + time) * 0.1;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    uniform vec3 color;    uniform sampler2D texture1;    void main() {      // Use texture2D() for GLSL 1.0, texture() for GLSL 3.0 (glslVersion: THREE.GLSL3)      vec4 texColor = texture2D(texture1, vUv);      gl_FragColor = vec4(color * texColor.rgb, 1.0);    }  ,  transparent: true,  side: THREE.DoubleSide,});// Update uniform in animation loopmaterial.uniforms.time.value = clock.getElapsedTime();
```
```
varying vec2 vUv;    uniform float time;    void main() {      vUv = uv;      vec3 pos = position;      pos.z += sin(pos.x * 10.0 + time) * 0.1;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }
```
```
varying vec2 vUv;    uniform vec3 color;    uniform sampler2D texture1;    void main() {      // Use texture2D() for GLSL 1.0, texture() for GLSL 3.0 (glslVersion: THREE.GLSL3)      vec4 texColor = texture2D(texture1, vUv);      gl_FragColor = vec4(color * texColor.rgb, 1.0);    }
```
```
// Vertex shaderuniform mat4 modelMatrix;         // Object to worlduniform mat4 modelViewMatrix;     // Object to camerauniform mat4 projectionMatrix;    // Camera projectionuniform mat4 viewMatrix;          // World to camerauniform mat3 normalMatrix;        // For transforming normalsuniform vec3 cameraPosition;      // Camera world position// Attributesattribute vec3 position;attribute vec3 normal;attribute vec2 uv;
```
```
// Vertex shaderuniform mat4 modelMatrix;         // Object to worlduniform mat4 modelViewMatrix;     // Object to camerauniform mat4 projectionMatrix;    // Camera projectionuniform mat4 viewMatrix;          // World to camerauniform mat3 normalMatrix;        // For transforming normalsuniform vec3 cameraPosition;      // Camera world position// Attributesattribute vec3 position;attribute vec3 normal;attribute vec2 uv;
```
```
const material = new THREE.RawShaderMaterial({  uniforms: {    projectionMatrix: { value: camera.projectionMatrix },    modelViewMatrix: { value: new THREE.Matrix4() },  },  vertexShader:     precision highp float;    attribute vec3 position;    uniform mat4 projectionMatrix;    uniform mat4 modelViewMatrix;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     precision highp float;    void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
const material = new THREE.RawShaderMaterial({  uniforms: {    projectionMatrix: { value: camera.projectionMatrix },    modelViewMatrix: { value: new THREE.Matrix4() },  },  vertexShader:     precision highp float;    attribute vec3 position;    uniform mat4 projectionMatrix;    uniform mat4 modelViewMatrix;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     precision highp float;    void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
precision highp float;    attribute vec3 position;    uniform mat4 projectionMatrix;    uniform mat4 modelViewMatrix;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
precision highp float;    void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }
```
```
// Visibilitymaterial.visible = true;material.transparent = false;material.opacity = 1.0;material.alphaTest = 0; // Discard pixels with alpha < value// Renderingmaterial.side = THREE.FrontSide; // FrontSide, BackSide, DoubleSidematerial.depthTest = true;material.depthWrite = true;material.colorWrite = true;// Blendingmaterial.blending = THREE.NormalBlending;// NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending// Stencilmaterial.stencilWrite = false;material.stencilFunc = THREE.AlwaysStencilFunc;material.stencilRef = 0;material.stencilMask = 0xff;// Polygon offset (z-fighting fix)material.polygonOffset = false;material.polygonOffsetFactor = 0;material.polygonOffsetUnits = 0;// Miscmaterial.dithering = false;material.toneMapped = true;
```
```
// Visibilitymaterial.visible = true;material.transparent = false;material.opacity = 1.0;material.alphaTest = 0; // Discard pixels with alpha < value// Renderingmaterial.side = THREE.FrontSide; // FrontSide, BackSide, DoubleSidematerial.depthTest = true;material.depthWrite = true;material.colorWrite = true;// Blendingmaterial.blending = THREE.NormalBlending;// NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending// Stencilmaterial.stencilWrite = false;material.stencilFunc = THREE.AlwaysStencilFunc;material.stencilRef = 0;material.stencilMask = 0xff;// Polygon offset (z-fighting fix)material.polygonOffset = false;material.polygonOffsetFactor = 0;material.polygonOffsetUnits = 0;// Miscmaterial.dithering = false;material.toneMapped = true;
```
```
// Assign different materials to geometry groupsconst geometry = new THREE.BoxGeometry(1, 1, 1);const materials = [  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // front  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // back];const mesh = new THREE.Mesh(geometry, materials);// Custom groupsgeometry.clearGroups();geometry.addGroup(0, 6, 0); // start, count, materialIndexgeometry.addGroup(6, 6, 1);
```
```
// Assign different materials to geometry groupsconst geometry = new THREE.BoxGeometry(1, 1, 1);const materials = [  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // front  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // back];const mesh = new THREE.Mesh(geometry, materials);// Custom groupsgeometry.clearGroups();geometry.addGroup(0, 6, 0); // start, count, materialIndexgeometry.addGroup(6, 6, 1);
```
```
// Load cube textureconst cubeLoader = new THREE.CubeTextureLoader();const envMap = cubeLoader.load([  "px.jpg",  "nx.jpg", // positive/negative X  "py.jpg",  "ny.jpg", // positive/negative Y  "pz.jpg",  "nz.jpg", // positive/negative Z]);// Apply to materialmaterial.envMap = envMap;material.envMapIntensity = 1;// Or set as scene environment (affects all PBR materials)scene.environment = envMap;// HDR environment (recommended)import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});
```
```
// Load cube textureconst cubeLoader = new THREE.CubeTextureLoader();const envMap = cubeLoader.load([  "px.jpg",  "nx.jpg", // positive/negative X  "py.jpg",  "ny.jpg", // positive/negative Y  "pz.jpg",  "nz.jpg", // positive/negative Z]);// Apply to materialmaterial.envMap = envMap;material.envMapIntensity = 1;// Or set as scene environment (affects all PBR materials)scene.environment = envMap;// HDR environment (recommended)import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  scene.environment = texture;  scene.background = texture;});
```
```
// Clone materialconst clone = material.clone();clone.color.set(0x00ff00);// Modify at runtimematerial.color.set(0xff0000);material.needsUpdate = true; // Only needed for some changes// When needsUpdate is required:// - Changing flat shading// - Changing texture// - Changing transparent// - Custom shader code changes
```
```
// Clone materialconst clone = material.clone();clone.color.set(0x00ff00);// Modify at runtimematerial.color.set(0xff0000);material.needsUpdate = true; // Only needed for some changes// When needsUpdate is required:// - Changing flat shading// - Changing texture// - Changing transparent// - Custom shader code changes
```
```
// Material poolingconst materialCache = new Map();function getMaterial(color) {  const key = color.toString(16);  if (!materialCache.has(key)) {    materialCache.set(key, new THREE.MeshStandardMaterial({ color }));  }  return materialCache.get(key);}// Dispose when donematerial.dispose();
```
```
// Material poolingconst materialCache = new Map();function getMaterial(color) {  const key = color.toString(16);  if (!materialCache.has(key)) {    materialCache.set(key, new THREE.MeshStandardMaterial({ color }));  }  return materialCache.get(key);}// Dispose when donematerial.dispose();
```
```
threejs-textures
```
```
threejs-shaders
```
```
threejs-lighting
```
Understanding and effectively utilizing materials is fundamental to creating visually compelling 3D scenes in Three.js. This expert agent skill provides comprehensive guidance on various material types, from simple unlit options to advanced Physically Based Rendering (PBR) and custom shaders. Whether you're aiming for realistic textures, stylized cartoon effects, or intricate visual effects, mastering material properties is key. Leverage this skill to intelligently select and configure materials, optimize performance, and bring your 3D models to life with rich, dynamic appearances tailored to your project's specific aesthetic requirements.

# When to Use This Skill
- •Implementing realistic 3D models with advanced PBR (Physically Based Rendering) textures.
- •Creating stylized visuals such as cel-shaded characters, wireframe objects, or flat-shaded environments.
- •Optimizing rendering performance for complex scenes by selecting the most efficient material types.
- •Developing custom visual effects and unique surface properties using Three.js ShaderMaterial.

# Pro Tips
- 💡Always consider `MeshStandardMaterial` for modern PBR workflows as a default, then simplify to basic or phong materials only if performance is critical or a specific non-PBR look is desired.
- 💡Leverage `material.onBeforeCompile` to inject custom GLSL code into standard materials, offering fine-grained shader control without rewriting entire shaders from scratch.
- 💡For static UI elements, background objects, or performance-critical areas that don't require complex lighting, utilize `MeshBasicMaterial` or `MeshLambertMaterial` to minimize GPU load.

