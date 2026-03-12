# threejs-shaders
Source: https://antigravity.codes/agent-skills/creative/threejs-shaders

## AI Worker Instructions
When the user requests functionality related to threejs-shaders, follow these guidelines and utilize this context.

## Scraped Content

# threejs-shaders
```
import * as THREE from "three";const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    color: { value: new THREE.Color(0xff0000) },  },  vertexShader:     void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform vec3 color;    void main() {      gl_FragColor = vec4(color, 1.0);    }  ,});// Update in animation loopmaterial.uniforms.time.value = clock.getElapsedTime();
```
```
import * as THREE from "three";const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    color: { value: new THREE.Color(0xff0000) },  },  vertexShader:     void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform vec3 color;    void main() {      gl_FragColor = vec4(color, 1.0);    }  ,});// Update in animation loopmaterial.uniforms.time.value = clock.getElapsedTime();
```
```
void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
uniform vec3 color;    void main() {      gl_FragColor = vec4(color, 1.0);    }
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     // Built-in uniforms available:    // uniform mat4 modelMatrix;    // uniform mat4 modelViewMatrix;    // uniform mat4 projectionMatrix;    // uniform mat4 viewMatrix;    // uniform mat3 normalMatrix;    // uniform vec3 cameraPosition;    // Built-in attributes available:    // attribute vec3 position;    // attribute vec3 normal;    // attribute vec2 uv;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     // Built-in uniforms available:    // uniform mat4 modelMatrix;    // uniform mat4 modelViewMatrix;    // uniform mat4 projectionMatrix;    // uniform mat4 viewMatrix;    // uniform mat3 normalMatrix;    // uniform vec3 cameraPosition;    // Built-in attributes available:    // attribute vec3 position;    // attribute vec3 normal;    // attribute vec2 uv;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
// Built-in uniforms available:    // uniform mat4 modelMatrix;    // uniform mat4 modelViewMatrix;    // uniform mat4 projectionMatrix;    // uniform mat4 viewMatrix;    // uniform mat3 normalMatrix;    // uniform vec3 cameraPosition;    // Built-in attributes available:    // attribute vec3 position;    // attribute vec3 normal;    // attribute vec2 uv;    void main() {      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }
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
const material = new THREE.ShaderMaterial({  uniforms: {    // Numbers    floatValue: { value: 1.5 },    intValue: { value: 1 },    // Vectors    vec2Value: { value: new THREE.Vector2(1, 2) },    vec3Value: { value: new THREE.Vector3(1, 2, 3) },    vec4Value: { value: new THREE.Vector4(1, 2, 3, 4) },    // Colors (converted to vec3)    colorValue: { value: new THREE.Color(0xff0000) },    // Matrices    mat3Value: { value: new THREE.Matrix3() },    mat4Value: { value: new THREE.Matrix4() },    // Textures    textureValue: { value: texture },    cubeTextureValue: { value: cubeTexture },    // Arrays    floatArray: { value: [1.0, 2.0, 3.0] },    vec3Array: {      value: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)],    },  },});
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    // Numbers    floatValue: { value: 1.5 },    intValue: { value: 1 },    // Vectors    vec2Value: { value: new THREE.Vector2(1, 2) },    vec3Value: { value: new THREE.Vector3(1, 2, 3) },    vec4Value: { value: new THREE.Vector4(1, 2, 3, 4) },    // Colors (converted to vec3)    colorValue: { value: new THREE.Color(0xff0000) },    // Matrices    mat3Value: { value: new THREE.Matrix3() },    mat4Value: { value: new THREE.Matrix4() },    // Textures    textureValue: { value: texture },    cubeTextureValue: { value: cubeTexture },    // Arrays    floatArray: { value: [1.0, 2.0, 3.0] },    vec3Array: {      value: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)],    },  },});
```
```
// In shaderuniform float floatValue;uniform int intValue;uniform vec2 vec2Value;uniform vec3 vec3Value;uniform vec3 colorValue;    // Color becomes vec3uniform vec4 vec4Value;uniform mat3 mat3Value;uniform mat4 mat4Value;uniform sampler2D textureValue;uniform samplerCube cubeTextureValue;uniform float floatArray[3];uniform vec3 vec3Array[2];
```
```
// In shaderuniform float floatValue;uniform int intValue;uniform vec2 vec2Value;uniform vec3 vec3Value;uniform vec3 colorValue;    // Color becomes vec3uniform vec4 vec4Value;uniform mat3 mat3Value;uniform mat4 mat4Value;uniform sampler2D textureValue;uniform samplerCube cubeTextureValue;uniform float floatArray[3];uniform vec3 vec3Array[2];
```
```
// Direct assignmentmaterial.uniforms.time.value = clock.getElapsedTime();// Vector/Color updatesmaterial.uniforms.position.value.set(x, y, z);material.uniforms.color.value.setHSL(hue, 1, 0.5);// Matrix updatesmaterial.uniforms.matrix.value.copy(mesh.matrixWorld);
```
```
// Direct assignmentmaterial.uniforms.time.value = clock.getElapsedTime();// Vector/Color updatesmaterial.uniforms.position.value.set(x, y, z);material.uniforms.color.value.setHSL(hue, 1, 0.5);// Matrix updatesmaterial.uniforms.matrix.value.copy(mesh.matrixWorld);
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      vUv = uv;      vNormal = normalize(normalMatrix * normal);      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      // Use interpolated values      gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      vUv = uv;      vNormal = normalize(normalMatrix * normal);      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      // Use interpolated values      gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    }  ,});
```
```
varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      vUv = uv;      vNormal = normalize(normalMatrix * normal);      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
varying vec2 vUv;    varying vec3 vNormal;    varying vec3 vPosition;    void main() {      // Use interpolated values      gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    }
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    map: { value: texture },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D map;    varying vec2 vUv;    void main() {      vec4 texColor = texture2D(map, vUv);      gl_FragColor = texColor;    }  ,});
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    map: { value: texture },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D map;    varying vec2 vUv;    void main() {      vec4 texColor = texture2D(map, vUv);      gl_FragColor = texColor;    }  ,});
```
```
varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
uniform sampler2D map;    varying vec2 vUv;    void main() {      vec4 texColor = texture2D(map, vUv);      gl_FragColor = texColor;    }
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    amplitude: { value: 0.5 },  },  vertexShader:     uniform float time;    uniform float amplitude;    void main() {      vec3 pos = position;      // Wave displacement      pos.z += sin(pos.x * 5.0 + time) * amplitude;      pos.z += sin(pos.y * 5.0 + time) * amplitude;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    time: { value: 0 },    amplitude: { value: 0.5 },  },  vertexShader:     uniform float time;    uniform float amplitude;    void main() {      vec3 pos = position;      // Wave displacement      pos.z += sin(pos.x * 5.0 + time) * amplitude;      pos.z += sin(pos.y * 5.0 + time) * amplitude;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);    }  ,});
```
```
uniform float time;    uniform float amplitude;    void main() {      vec3 pos = position;      // Wave displacement      pos.z += sin(pos.x * 5.0 + time) * amplitude;      pos.z += sin(pos.y * 5.0 + time) * amplitude;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }
```
```
void main() {      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);    }
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      // cameraPosition is auto-provided by ShaderMaterial      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);      vec3 baseColor = vec3(0.0, 0.0, 0.5);      vec3 fresnelColor = vec3(0.5, 0.8, 1.0);      gl_FragColor = vec4(mix(baseColor, fresnelColor, fresnel), 1.0);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      // cameraPosition is auto-provided by ShaderMaterial      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);      vec3 baseColor = vec3(0.0, 0.0, 0.5);      vec3 fresnelColor = vec3(0.5, 0.8, 1.0);      gl_FragColor = vec4(mix(baseColor, fresnelColor, fresnel), 1.0);    }  ,});
```
```
varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
varying vec3 vNormal;    varying vec3 vWorldPosition;    void main() {      // cameraPosition is auto-provided by ShaderMaterial      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);      vec3 baseColor = vec3(0.0, 0.0, 0.5);      vec3 fresnelColor = vec3(0.5, 0.8, 1.0);      gl_FragColor = vec4(mix(baseColor, fresnelColor, fresnel), 1.0);    }
```
```
// Simple noise functionfloat random(vec2 st) {  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);}// Value noisefloat noise(vec2 st) {  vec2 i = floor(st);  vec2 f = fract(st);  float a = random(i);  float b = random(i + vec2(1.0, 0.0));  float c = random(i + vec2(0.0, 1.0));  float d = random(i + vec2(1.0, 1.0));  vec2 u = f * f * (3.0 - 2.0 * f);  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;}// Usagefloat n = noise(vUv * 10.0 + time);
```
```
// Simple noise functionfloat random(vec2 st) {  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);}// Value noisefloat noise(vec2 st) {  vec2 i = floor(st);  vec2 f = fract(st);  float a = random(i);  float b = random(i + vec2(1.0, 0.0));  float c = random(i + vec2(0.0, 1.0));  float d = random(i + vec2(1.0, 1.0));  vec2 u = f * f * (3.0 - 2.0 * f);  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;}// Usagefloat n = noise(vUv * 10.0 + time);
```
```
// Linear gradientvec3 color = mix(colorA, colorB, vUv.y);// Radial gradientfloat dist = distance(vUv, vec2(0.5));vec3 color = mix(centerColor, edgeColor, dist * 2.0);// Smooth gradient with custom curvefloat t = smoothstep(0.0, 1.0, vUv.y);vec3 color = mix(colorA, colorB, t);
```
```
// Linear gradientvec3 color = mix(colorA, colorB, vUv.y);// Radial gradientfloat dist = distance(vUv, vec2(0.5));vec3 color = mix(centerColor, edgeColor, dist * 2.0);// Smooth gradient with custom curvefloat t = smoothstep(0.0, 1.0, vUv.y);vec3 color = mix(colorA, colorB, t);
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);      vViewPosition = mvPosition.xyz;      gl_Position = projectionMatrix * mvPosition;    }  ,  fragmentShader:     varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vec3 viewDir = normalize(-vViewPosition);      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));      rim = pow(rim, 4.0);      vec3 baseColor = vec3(0.2, 0.2, 0.8);      vec3 rimColor = vec3(1.0, 0.5, 0.0);      gl_FragColor = vec4(baseColor + rimColor * rim, 1.0);    }  ,});
```
```
const material = new THREE.ShaderMaterial({  vertexShader:     varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);      vViewPosition = mvPosition.xyz;      gl_Position = projectionMatrix * mvPosition;    }  ,  fragmentShader:     varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vec3 viewDir = normalize(-vViewPosition);      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));      rim = pow(rim, 4.0);      vec3 baseColor = vec3(0.2, 0.2, 0.8);      vec3 rimColor = vec3(1.0, 0.5, 0.0);      gl_FragColor = vec4(baseColor + rimColor * rim, 1.0);    }  ,});
```
```
varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vNormal = normalize(normalMatrix * normal);      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);      vViewPosition = mvPosition.xyz;      gl_Position = projectionMatrix * mvPosition;    }
```
```
varying vec3 vNormal;    varying vec3 vViewPosition;    void main() {      vec3 viewDir = normalize(-vViewPosition);      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));      rim = pow(rim, 4.0);      vec3 baseColor = vec3(0.2, 0.2, 0.8);      vec3 rimColor = vec3(1.0, 0.5, 0.0);      gl_FragColor = vec4(baseColor + rimColor * rim, 1.0);    }
```
```
uniform float progress;uniform sampler2D noiseMap;void main() {  float noise = texture2D(noiseMap, vUv).r;  if (noise < progress) {    discard;  }  // Edge glow  float edge = smoothstep(progress, progress + 0.1, noise);  vec3 edgeColor = vec3(1.0, 0.5, 0.0);  vec3 baseColor = vec3(0.5);  gl_FragColor = vec4(mix(edgeColor, baseColor, edge), 1.0);}
```
```
uniform float progress;uniform sampler2D noiseMap;void main() {  float noise = texture2D(noiseMap, vUv).r;  if (noise < progress) {    discard;  }  // Edge glow  float edge = smoothstep(progress, progress + 0.1, noise);  vec3 edgeColor = vec3(1.0, 0.5, 0.0);  vec3 baseColor = vec3(0.5);  gl_FragColor = vec4(mix(edgeColor, baseColor, edge), 1.0);}
```
```
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });material.onBeforeCompile = (shader) => {  // Add custom uniform  shader.uniforms.time = { value: 0 };  // Store reference for updates  material.userData.shader = shader;  // Modify vertex shader  shader.vertexShader = shader.vertexShader.replace(    "#include <begin_vertex>",        #include <begin_vertex>    transformed.y += sin(position.x * 10.0 + time) * 0.1;    ,  );  // Add uniform declaration  shader.vertexShader = "uniform float time;\n" + shader.vertexShader;};// Update in animation loopif (material.userData.shader) {  material.userData.shader.uniforms.time.value = clock.getElapsedTime();}
```
```
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });material.onBeforeCompile = (shader) => {  // Add custom uniform  shader.uniforms.time = { value: 0 };  // Store reference for updates  material.userData.shader = shader;  // Modify vertex shader  shader.vertexShader = shader.vertexShader.replace(    "#include <begin_vertex>",        #include <begin_vertex>    transformed.y += sin(position.x * 10.0 + time) * 0.1;    ,  );  // Add uniform declaration  shader.vertexShader = "uniform float time;\n" + shader.vertexShader;};// Update in animation loopif (material.userData.shader) {  material.userData.shader.uniforms.time.value = clock.getElapsedTime();}
```
```
#include <begin_vertex>    transformed.y += sin(position.x * 10.0 + time) * 0.1;
```
```
// Vertex shader chunks"#include <begin_vertex>"; // After position is calculated"#include <project_vertex>"; // After gl_Position"#include <beginnormal_vertex>"; // Normal calculation start// Fragment shader chunks"#include <color_fragment>"; // After diffuse color"#include <output_fragment>"; // Final output"#include <fog_fragment>"; // After fog applied
```
```
// Vertex shader chunks"#include <begin_vertex>"; // After position is calculated"#include <project_vertex>"; // After gl_Position"#include <beginnormal_vertex>"; // Normal calculation start// Fragment shader chunks"#include <color_fragment>"; // After diffuse color"#include <output_fragment>"; // Final output"#include <fog_fragment>"; // After fog applied
```
```
// Basicabs(x), sign(x), floor(x), ceil(x), fract(x)mod(x, y), min(x, y), max(x, y), clamp(x, min, max)mix(a, b, t), step(edge, x), smoothstep(edge0, edge1, x)// Trigonometrysin(x), cos(x), tan(x)asin(x), acos(x), atan(y, x), atan(x)radians(degrees), degrees(radians)// Exponentialpow(x, y), exp(x), log(x), exp2(x), log2(x)sqrt(x), inversesqrt(x)
```
```
// Basicabs(x), sign(x), floor(x), ceil(x), fract(x)mod(x, y), min(x, y), max(x, y), clamp(x, min, max)mix(a, b, t), step(edge, x), smoothstep(edge0, edge1, x)// Trigonometrysin(x), cos(x), tan(x)asin(x), acos(x), atan(y, x), atan(x)radians(degrees), degrees(radians)// Exponentialpow(x, y), exp(x), log(x), exp2(x), log2(x)sqrt(x), inversesqrt(x)
```
```
// Length and distancelength(v), distance(p0, p1), dot(x, y), cross(x, y)// Normalizationnormalize(v)// Reflection and refractionreflect(I, N), refract(I, N, eta)// Component-wiselessThan(x, y), lessThanEqual(x, y)greaterThan(x, y), greaterThanEqual(x, y)equal(x, y), notEqual(x, y)any(bvec), all(bvec)
```
```
// Length and distancelength(v), distance(p0, p1), dot(x, y), cross(x, y)// Normalizationnormalize(v)// Reflection and refractionreflect(I, N), refract(I, N, eta)// Component-wiselessThan(x, y), lessThanEqual(x, y)greaterThan(x, y), greaterThanEqual(x, y)equal(x, y), notEqual(x, y)any(bvec), all(bvec)
```
```
// GLSL 1.0 (default) - use texture2D/textureCubetexture2D(sampler, coord)texture2D(sampler, coord, bias)textureCube(sampler, coord)// GLSL 3.0 (glslVersion: THREE.GLSL3) - use texture()// texture(sampler, coord) replaces texture2D/textureCube// Also use: out vec4 fragColor instead of gl_FragColor// Texture size (GLSL 1.30+)textureSize(sampler, lod)
```
```
// GLSL 1.0 (default) - use texture2D/textureCubetexture2D(sampler, coord)texture2D(sampler, coord, bias)textureCube(sampler, coord)// GLSL 3.0 (glslVersion: THREE.GLSL3) - use texture()// texture(sampler, coord) replaces texture2D/textureCube// Also use: out vec4 fragColor instead of gl_FragColor// Texture size (GLSL 1.30+)textureSize(sampler, lod)
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    /* ... */  },  vertexShader: "/* ... */",  fragmentShader: "/* ... */",  // Rendering  transparent: true,  opacity: 1.0,  side: THREE.DoubleSide,  depthTest: true,  depthWrite: true,  // Blending  blending: THREE.NormalBlending,  // AdditiveBlending, SubtractiveBlending, MultiplyBlending  // Wireframe  wireframe: false,  wireframeLinewidth: 1, // Note: >1 has no effect on most platforms (WebGL limitation)  // Extensions  extensions: {    derivatives: true, // For fwidth, dFdx, dFdy    fragDepth: true, // gl_FragDepth    drawBuffers: true, // Multiple render targets    shaderTextureLOD: true, // texture2DLod  },  // GLSL version  glslVersion: THREE.GLSL3, // For WebGL2 features});
```
```
const material = new THREE.ShaderMaterial({  uniforms: {    /* ... */  },  vertexShader: "/* ... */",  fragmentShader: "/* ... */",  // Rendering  transparent: true,  opacity: 1.0,  side: THREE.DoubleSide,  depthTest: true,  depthWrite: true,  // Blending  blending: THREE.NormalBlending,  // AdditiveBlending, SubtractiveBlending, MultiplyBlending  // Wireframe  wireframe: false,  wireframeLinewidth: 1, // Note: >1 has no effect on most platforms (WebGL limitation)  // Extensions  extensions: {    derivatives: true, // For fwidth, dFdx, dFdy    fragDepth: true, // gl_FragDepth    drawBuffers: true, // Multiple render targets    shaderTextureLOD: true, // texture2DLod  },  // GLSL version  glslVersion: THREE.GLSL3, // For WebGL2 features});
```
```
import { ShaderChunk } from "three";const fragmentShader =   ${ShaderChunk.common}  ${ShaderChunk.packing}  uniform sampler2D depthTexture;  varying vec2 vUv;  void main() {    float depth = texture2D(depthTexture, vUv).r;    float linearDepth = perspectiveDepthToViewZ(depth, 0.1, 1000.0);    gl_FragColor = vec4(vec3(-linearDepth / 100.0), 1.0);  };
```
```
import { ShaderChunk } from "three";const fragmentShader =   ${ShaderChunk.common}  ${ShaderChunk.packing}  uniform sampler2D depthTexture;  varying vec2 vUv;  void main() {    float depth = texture2D(depthTexture, vUv).r;    float linearDepth = perspectiveDepthToViewZ(depth, 0.1, 1000.0);    gl_FragColor = vec4(vec3(-linearDepth / 100.0), 1.0);  };
```
```
${ShaderChunk.common}  ${ShaderChunk.packing}  uniform sampler2D depthTexture;  varying vec2 vUv;  void main() {    float depth = texture2D(depthTexture, vUv).r;    float linearDepth = perspectiveDepthToViewZ(depth, 0.1, 1000.0);    gl_FragColor = vec4(vec3(-linearDepth / 100.0), 1.0);  }
```
```
// With vite/webpackimport vertexShader from "./shaders/vertex.glsl";import fragmentShader from "./shaders/fragment.glsl";const material = new THREE.ShaderMaterial({  vertexShader,  fragmentShader,});
```
```
// With vite/webpackimport vertexShader from "./shaders/vertex.glsl";import fragmentShader from "./shaders/fragment.glsl";const material = new THREE.ShaderMaterial({  vertexShader,  fragmentShader,});
```
```
// Instanced attributeconst offsets = new Float32Array(instanceCount * 3);// Fill offsets...geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));const material = new THREE.ShaderMaterial({  vertexShader:     attribute vec3 offset;    void main() {      vec3 pos = position + offset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
// Instanced attributeconst offsets = new Float32Array(instanceCount * 3);// Fill offsets...geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));const material = new THREE.ShaderMaterial({  vertexShader:     attribute vec3 offset;    void main() {      vec3 pos = position + offset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }  ,  fragmentShader:     void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }  ,});
```
```
attribute vec3 offset;    void main() {      vec3 pos = position + offset;      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);    }
```
```
void main() {      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    }
```
```
// Check for compile errorsmaterial.onBeforeCompile = (shader) => {  console.log("Vertex Shader:", shader.vertexShader);  console.log("Fragment Shader:", shader.fragmentShader);};// Visual debuggingfragmentShader:   void main() {    // Debug UV    gl_FragColor = vec4(vUv, 0.0, 1.0);    // Debug normals    gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    // Debug position    gl_FragColor = vec4(vPosition * 0.1 + 0.5, 1.0);  };// Check WebGL errorsrenderer.debug.checkShaderErrors = true;
```
```
// Check for compile errorsmaterial.onBeforeCompile = (shader) => {  console.log("Vertex Shader:", shader.vertexShader);  console.log("Fragment Shader:", shader.fragmentShader);};// Visual debuggingfragmentShader:   void main() {    // Debug UV    gl_FragColor = vec4(vUv, 0.0, 1.0);    // Debug normals    gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    // Debug position    gl_FragColor = vec4(vPosition * 0.1 + 0.5, 1.0);  };// Check WebGL errorsrenderer.debug.checkShaderErrors = true;
```
```
void main() {    // Debug UV    gl_FragColor = vec4(vUv, 0.0, 1.0);    // Debug normals    gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);    // Debug position    gl_FragColor = vec4(vPosition * 0.1 + 0.5, 1.0);  }
```
```
// Instead of:if (value > 0.5) {  color = colorA;} else {  color = colorB;}// Use:color = mix(colorB, colorA, step(0.5, value));
```
```
// Instead of:if (value > 0.5) {  color = colorA;} else {  color = colorB;}// Use:color = mix(colorB, colorA, step(0.5, value));
```
```
threejs-materials
```
```
threejs-postprocessing
```
```
threejs-textures
```
Unleash the full creative power of Three.js by diving deep into shaders. This agent skill provides comprehensive guidance on crafting custom visual effects, from manipulating vertices to designing intricate fragment shaders with GLSL. Whether you're aiming for photorealistic rendering, stylized aesthetics, or dynamic real-time animations, understanding shaders is paramount. Move beyond standard materials to achieve unique graphical expressions, optimizing performance and pushing the boundaries of what's possible in web-based 3D graphics. Harness the flexibility of `ShaderMaterial` and `RawShaderMaterial` to truly make your scenes come alive.

# When to Use This Skill
- •Creating stylized, non-photorealistic rendering effects (e.g., cel-shading, cartoon outlines).
- •Implementing advanced visual effects like custom post-processing, volumetric lighting, or unique particle systems.
- •Optimizing rendering performance by offloading complex calculations to the GPU through custom vertex manipulations.
- •Extending or modifying built-in Three.js materials with bespoke lighting models or texture blending techniques.

# Pro Tips
- 💡Start Simple: Begin with basic modifications to existing materials or simple color changes before tackling complex lighting models or geometric transformations.
- 💡Leverage Built-ins: Utilize Three.js's built-in uniforms (`modelMatrix`, `projectionMatrix`, `cameraPosition`) and attributes (`position`, `normal`, `uv`) when using `ShaderMaterial` to simplify your GLSL code.
- 💡Performance First: Be mindful of shader complexity, especially in fragment shaders. Optimize calculations and avoid branching where possible to maintain high frame rates on various devices.

