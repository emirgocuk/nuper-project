# threejs-postprocessing
Source: https://antigravity.codes/agent-skills/creative/threejs-postprocessing

## AI Worker Instructions
When the user requests functionality related to threejs-postprocessing, follow these guidelines and utilize this context.

## Scraped Content

# threejs-postprocessing
```
import * as THREE from "three";import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";// Setup composerconst composer = new EffectComposer(renderer);// Render sceneconst renderPass = new RenderPass(scene, camera);composer.addPass(renderPass);// Add bloomconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  1.5, // strength  0.4, // radius  0.85, // threshold);composer.addPass(bloomPass);// Animation loop - use composer instead of rendererfunction animate() {  requestAnimationFrame(animate);  composer.render(); // NOT renderer.render()}
```
```
import * as THREE from "three";import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";// Setup composerconst composer = new EffectComposer(renderer);// Render sceneconst renderPass = new RenderPass(scene, camera);composer.addPass(renderPass);// Add bloomconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  1.5, // strength  0.4, // radius  0.85, // threshold);composer.addPass(bloomPass);// Animation loop - use composer instead of rendererfunction animate() {  requestAnimationFrame(animate);  composer.render(); // NOT renderer.render()}
```
```
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";const composer = new EffectComposer(renderer);// First pass: render sceneconst renderPass = new RenderPass(scene, camera);composer.addPass(renderPass);// Add more passes...composer.addPass(effectPass);// Last pass should render to screeneffectPass.renderToScreen = true; // Default for last pass// Handle resizefunction onResize() {  const width = window.innerWidth;  const height = window.innerHeight;  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  composer.setSize(width, height);}
```
```
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";const composer = new EffectComposer(renderer);// First pass: render sceneconst renderPass = new RenderPass(scene, camera);composer.addPass(renderPass);// Add more passes...composer.addPass(effectPass);// Last pass should render to screeneffectPass.renderToScreen = true; // Default for last pass// Handle resizefunction onResize() {  const width = window.innerWidth;  const height = window.innerHeight;  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  composer.setSize(width, height);}
```
```
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";const bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  1.5, // strength - intensity of glow  0.4, // radius - spread of glow  0.85, // threshold - brightness threshold);composer.addPass(bloomPass);// Adjust at runtimebloomPass.strength = 2.0;bloomPass.threshold = 0.5;bloomPass.radius = 0.8;
```
```
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";const bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  1.5, // strength - intensity of glow  0.4, // radius - spread of glow  0.85, // threshold - brightness threshold);composer.addPass(bloomPass);// Adjust at runtimebloomPass.strength = 2.0;bloomPass.threshold = 0.5;bloomPass.radius = 0.8;
```
```
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";// Layer setupconst BLOOM_LAYER = 1;const bloomLayer = new THREE.Layers();bloomLayer.set(BLOOM_LAYER);// Mark objects to bloomglowingMesh.layers.enable(BLOOM_LAYER);// Dark material for non-blooming objectsconst darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });const materials = {};function darkenNonBloomed(obj) {  if (obj.isMesh && !bloomLayer.test(obj.layers)) {    materials[obj.uuid] = obj.material;    obj.material = darkMaterial;  }}function restoreMaterial(obj) {  if (materials[obj.uuid]) {    obj.material = materials[obj.uuid];    delete materials[obj.uuid];  }}// Custom render loopfunction render() {  // Render bloom pass  scene.traverse(darkenNonBloomed);  composer.render();  scene.traverse(restoreMaterial);  // Render final scene over bloom  renderer.render(scene, camera);}
```
```
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";// Layer setupconst BLOOM_LAYER = 1;const bloomLayer = new THREE.Layers();bloomLayer.set(BLOOM_LAYER);// Mark objects to bloomglowingMesh.layers.enable(BLOOM_LAYER);// Dark material for non-blooming objectsconst darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });const materials = {};function darkenNonBloomed(obj) {  if (obj.isMesh && !bloomLayer.test(obj.layers)) {    materials[obj.uuid] = obj.material;    obj.material = darkMaterial;  }}function restoreMaterial(obj) {  if (materials[obj.uuid]) {    obj.material = materials[obj.uuid];    delete materials[obj.uuid];  }}// Custom render loopfunction render() {  // Render bloom pass  scene.traverse(darkenNonBloomed);  composer.render();  scene.traverse(restoreMaterial);  // Render final scene over bloom  renderer.render(scene, camera);}
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { FXAAShader } from "three/addons/shaders/FXAAShader.js";const fxaaPass = new ShaderPass(FXAAShader);fxaaPass.material.uniforms["resolution"].value.set(  1 / window.innerWidth,  1 / window.innerHeight,);composer.addPass(fxaaPass);// Update on resizefunction onResize() {  fxaaPass.material.uniforms["resolution"].value.set(    1 / window.innerWidth,    1 / window.innerHeight,  );}
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { FXAAShader } from "three/addons/shaders/FXAAShader.js";const fxaaPass = new ShaderPass(FXAAShader);fxaaPass.material.uniforms["resolution"].value.set(  1 / window.innerWidth,  1 / window.innerHeight,);composer.addPass(fxaaPass);// Update on resizefunction onResize() {  fxaaPass.material.uniforms["resolution"].value.set(    1 / window.innerWidth,    1 / window.innerHeight,  );}
```
```
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";const smaaPass = new SMAAPass(  window.innerWidth * renderer.getPixelRatio(),  window.innerHeight * renderer.getPixelRatio(),);composer.addPass(smaaPass);
```
```
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";const smaaPass = new SMAAPass(  window.innerWidth * renderer.getPixelRatio(),  window.innerHeight * renderer.getPixelRatio(),);composer.addPass(smaaPass);
```
```
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";const ssaoPass = new SSAOPass(  scene,  camera,  window.innerWidth,  window.innerHeight,);ssaoPass.kernelRadius = 16;ssaoPass.minDistance = 0.005;ssaoPass.maxDistance = 0.1;composer.addPass(ssaoPass);// Output modesssaoPass.output = SSAOPass.OUTPUT.Default;// SSAOPass.OUTPUT.Default - Final composited output// SSAOPass.OUTPUT.SSAO - Just the AO// SSAOPass.OUTPUT.Blur - Blurred AO// SSAOPass.OUTPUT.Depth - Depth buffer// SSAOPass.OUTPUT.Normal - Normal buffer
```
```
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";const ssaoPass = new SSAOPass(  scene,  camera,  window.innerWidth,  window.innerHeight,);ssaoPass.kernelRadius = 16;ssaoPass.minDistance = 0.005;ssaoPass.maxDistance = 0.1;composer.addPass(ssaoPass);// Output modesssaoPass.output = SSAOPass.OUTPUT.Default;// SSAOPass.OUTPUT.Default - Final composited output// SSAOPass.OUTPUT.SSAO - Just the AO// SSAOPass.OUTPUT.Blur - Blurred AO// SSAOPass.OUTPUT.Depth - Depth buffer// SSAOPass.OUTPUT.Normal - Normal buffer
```
```
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";const bokehPass = new BokehPass(scene, camera, {  focus: 10.0, // Focus distance  aperture: 0.025, // Aperture (smaller = more DOF)  maxblur: 0.01, // Max blur amount});composer.addPass(bokehPass);// Update focus dynamicallybokehPass.uniforms["focus"].value = distanceToTarget;
```
```
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";const bokehPass = new BokehPass(scene, camera, {  focus: 10.0, // Focus distance  aperture: 0.025, // Aperture (smaller = more DOF)  maxblur: 0.01, // Max blur amount});composer.addPass(bokehPass);// Update focus dynamicallybokehPass.uniforms["focus"].value = distanceToTarget;
```
```
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";const filmPass = new FilmPass(  0.35, // noise intensity  0.5, // scanline intensity  648, // scanline count  false, // grayscale);composer.addPass(filmPass);
```
```
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";const filmPass = new FilmPass(  0.35, // noise intensity  0.5, // scanline intensity  648, // scanline count  false, // grayscale);composer.addPass(filmPass);
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { VignetteShader } from "three/addons/shaders/VignetteShader.js";const vignettePass = new ShaderPass(VignetteShader);vignettePass.uniforms["offset"].value = 1.0; // Vignette sizevignettePass.uniforms["darkness"].value = 1.0; // Vignette intensitycomposer.addPass(vignettePass);
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { VignetteShader } from "three/addons/shaders/VignetteShader.js";const vignettePass = new ShaderPass(VignetteShader);vignettePass.uniforms["offset"].value = 1.0; // Vignette sizevignettePass.uniforms["darkness"].value = 1.0; // Vignette intensitycomposer.addPass(vignettePass);
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { ColorCorrectionShader } from "three/addons/shaders/ColorCorrectionShader.js";const colorPass = new ShaderPass(ColorCorrectionShader);colorPass.uniforms["powRGB"].value = new THREE.Vector3(1.2, 1.2, 1.2); // PowercolorPass.uniforms["mulRGB"].value = new THREE.Vector3(1.0, 1.0, 1.0); // Multiplycomposer.addPass(colorPass);
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { ColorCorrectionShader } from "three/addons/shaders/ColorCorrectionShader.js";const colorPass = new ShaderPass(ColorCorrectionShader);colorPass.uniforms["powRGB"].value = new THREE.Vector3(1.2, 1.2, 1.2); // PowercolorPass.uniforms["mulRGB"].value = new THREE.Vector3(1.0, 1.0, 1.0); // Multiplycomposer.addPass(colorPass);
```
```
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";const gammaPass = new ShaderPass(GammaCorrectionShader);composer.addPass(gammaPass);
```
```
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";const gammaPass = new ShaderPass(GammaCorrectionShader);composer.addPass(gammaPass);
```
```
import { RenderPixelatedPass } from "three/addons/postprocessing/RenderPixelatedPass.js";const pixelPass = new RenderPixelatedPass(6, scene, camera); // 6 = pixel sizecomposer.addPass(pixelPass);
```
```
import { RenderPixelatedPass } from "three/addons/postprocessing/RenderPixelatedPass.js";const pixelPass = new RenderPixelatedPass(6, scene, camera); // 6 = pixel sizecomposer.addPass(pixelPass);
```
```
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";const glitchPass = new GlitchPass();glitchPass.goWild = false; // Continuous glitchingcomposer.addPass(glitchPass);
```
```
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";const glitchPass = new GlitchPass();glitchPass.goWild = false; // Continuous glitchingcomposer.addPass(glitchPass);
```
```
import { HalftonePass } from "three/addons/postprocessing/HalftonePass.js";const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, {  shape: 1, // 1 = dot, 2 = ellipse, 3 = line, 4 = square  radius: 4, // Dot size  rotateR: Math.PI / 12,  rotateB: (Math.PI / 12) * 2,  rotateG: (Math.PI / 12) * 3,  scatter: 0,  blending: 1,  blendingMode: 1,  greyscale: false,});composer.addPass(halftonePass);
```
```
import { HalftonePass } from "three/addons/postprocessing/HalftonePass.js";const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, {  shape: 1, // 1 = dot, 2 = ellipse, 3 = line, 4 = square  radius: 4, // Dot size  rotateR: Math.PI / 12,  rotateB: (Math.PI / 12) * 2,  rotateG: (Math.PI / 12) * 3,  scatter: 0,  blending: 1,  blendingMode: 1,  greyscale: false,});composer.addPass(halftonePass);
```
```
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";const outlinePass = new OutlinePass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  scene,  camera,);outlinePass.edgeStrength = 3;outlinePass.edgeGlow = 0;outlinePass.edgeThickness = 1;outlinePass.pulsePeriod = 0;outlinePass.visibleEdgeColor.set(0xffffff);outlinePass.hiddenEdgeColor.set(0x190a05);// Select objects to outlineoutlinePass.selectedObjects = [mesh1, mesh2];composer.addPass(outlinePass);
```
```
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";const outlinePass = new OutlinePass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  scene,  camera,);outlinePass.edgeStrength = 3;outlinePass.edgeGlow = 0;outlinePass.edgeThickness = 1;outlinePass.pulsePeriod = 0;outlinePass.visibleEdgeColor.set(0xffffff);outlinePass.hiddenEdgeColor.set(0x190a05);// Select objects to outlineoutlinePass.selectedObjects = [mesh1, mesh2];composer.addPass(outlinePass);
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";const CustomShader = {  uniforms: {    tDiffuse: { value: null }, // Required: input texture    time: { value: 0 },    intensity: { value: 1.0 },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    uniform float time;    uniform float intensity;    varying vec2 vUv;    void main() {      vec2 uv = vUv;      // Wave distortion      uv.x += sin(uv.y * 10.0 + time) * 0.01 * intensity;      vec4 color = texture2D(tDiffuse, uv);      gl_FragColor = color;    }  ,};const customPass = new ShaderPass(CustomShader);composer.addPass(customPass);// Update in animation loopcustomPass.uniforms.time.value = clock.getElapsedTime();
```
```
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";const CustomShader = {  uniforms: {    tDiffuse: { value: null }, // Required: input texture    time: { value: 0 },    intensity: { value: 1.0 },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    uniform float time;    uniform float intensity;    varying vec2 vUv;    void main() {      vec2 uv = vUv;      // Wave distortion      uv.x += sin(uv.y * 10.0 + time) * 0.01 * intensity;      vec4 color = texture2D(tDiffuse, uv);      gl_FragColor = color;    }  ,};const customPass = new ShaderPass(CustomShader);composer.addPass(customPass);// Update in animation loopcustomPass.uniforms.time.value = clock.getElapsedTime();
```
```
varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
uniform sampler2D tDiffuse;    uniform float time;    uniform float intensity;    varying vec2 vUv;    void main() {      vec2 uv = vUv;      // Wave distortion      uv.x += sin(uv.y * 10.0 + time) * 0.01 * intensity;      vec4 color = texture2D(tDiffuse, uv);      gl_FragColor = color;    }
```
```
const InvertShader = {  uniforms: {    tDiffuse: { value: null },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    varying vec2 vUv;    void main() {      vec4 color = texture2D(tDiffuse, vUv);      gl_FragColor = vec4(1.0 - color.rgb, color.a);    }  ,};
```
```
const InvertShader = {  uniforms: {    tDiffuse: { value: null },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    varying vec2 vUv;    void main() {      vec4 color = texture2D(tDiffuse, vUv);      gl_FragColor = vec4(1.0 - color.rgb, color.a);    }  ,};
```
```
varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
uniform sampler2D tDiffuse;    varying vec2 vUv;    void main() {      vec4 color = texture2D(tDiffuse, vUv);      gl_FragColor = vec4(1.0 - color.rgb, color.a);    }
```
```
const ChromaticAberrationShader = {  uniforms: {    tDiffuse: { value: null },    amount: { value: 0.005 },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    uniform float amount;    varying vec2 vUv;    void main() {      vec2 dir = vUv - 0.5;      float dist = length(dir);      float r = texture2D(tDiffuse, vUv - dir * amount * dist).r;      float g = texture2D(tDiffuse, vUv).g;      float b = texture2D(tDiffuse, vUv + dir * amount * dist).b;      gl_FragColor = vec4(r, g, b, 1.0);    }  ,};
```
```
const ChromaticAberrationShader = {  uniforms: {    tDiffuse: { value: null },    amount: { value: 0.005 },  },  vertexShader:     varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }  ,  fragmentShader:     uniform sampler2D tDiffuse;    uniform float amount;    varying vec2 vUv;    void main() {      vec2 dir = vUv - 0.5;      float dist = length(dir);      float r = texture2D(tDiffuse, vUv - dir * amount * dist).r;      float g = texture2D(tDiffuse, vUv).g;      float b = texture2D(tDiffuse, vUv + dir * amount * dist).b;      gl_FragColor = vec4(r, g, b, 1.0);    }  ,};
```
```
varying vec2 vUv;    void main() {      vUv = uv;      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    }
```
```
uniform sampler2D tDiffuse;    uniform float amount;    varying vec2 vUv;    void main() {      vec2 dir = vUv - 0.5;      float dist = length(dir);      float r = texture2D(tDiffuse, vUv - dir * amount * dist).r;      float g = texture2D(tDiffuse, vUv).g;      float b = texture2D(tDiffuse, vUv + dir * amount * dist).b;      gl_FragColor = vec4(r, g, b, 1.0);    }
```
```
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { FXAAShader } from "three/addons/shaders/FXAAShader.js";import { VignetteShader } from "three/addons/shaders/VignetteShader.js";import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";const composer = new EffectComposer(renderer);// 1. Render scenecomposer.addPass(new RenderPass(scene, camera));// 2. Bloomconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  0.5,  0.4,  0.85,);composer.addPass(bloomPass);// 3. Vignetteconst vignettePass = new ShaderPass(VignetteShader);vignettePass.uniforms["offset"].value = 0.95;vignettePass.uniforms["darkness"].value = 1.0;composer.addPass(vignettePass);// 4. Gamma correctioncomposer.addPass(new ShaderPass(GammaCorrectionShader));// 5. Anti-aliasing (always last before output)const fxaaPass = new ShaderPass(FXAAShader);fxaaPass.uniforms["resolution"].value.set(  1 / window.innerWidth,  1 / window.innerHeight,);composer.addPass(fxaaPass);
```
```
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";import { RenderPass } from "three/addons/postprocessing/RenderPass.js";import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";import { FXAAShader } from "three/addons/shaders/FXAAShader.js";import { VignetteShader } from "three/addons/shaders/VignetteShader.js";import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";const composer = new EffectComposer(renderer);// 1. Render scenecomposer.addPass(new RenderPass(scene, camera));// 2. Bloomconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth, window.innerHeight),  0.5,  0.4,  0.85,);composer.addPass(bloomPass);// 3. Vignetteconst vignettePass = new ShaderPass(VignetteShader);vignettePass.uniforms["offset"].value = 0.95;vignettePass.uniforms["darkness"].value = 1.0;composer.addPass(vignettePass);// 4. Gamma correctioncomposer.addPass(new ShaderPass(GammaCorrectionShader));// 5. Anti-aliasing (always last before output)const fxaaPass = new ShaderPass(FXAAShader);fxaaPass.uniforms["resolution"].value.set(  1 / window.innerWidth,  1 / window.innerHeight,);composer.addPass(fxaaPass);
```
```
// Create render targetconst renderTarget = new THREE.WebGLRenderTarget(512, 512);// Render scene to targetrenderer.setRenderTarget(renderTarget);renderer.render(scene, camera);renderer.setRenderTarget(null);// Use textureconst texture = renderTarget.texture;otherMaterial.map = texture;
```
```
// Create render targetconst renderTarget = new THREE.WebGLRenderTarget(512, 512);// Render scene to targetrenderer.setRenderTarget(renderTarget);renderer.render(scene, camera);renderer.setRenderTarget(null);// Use textureconst texture = renderTarget.texture;otherMaterial.map = texture;
```
```
// Multiple composers for different scenes/layersconst bgComposer = new EffectComposer(renderer);bgComposer.addPass(new RenderPass(bgScene, camera));const fgComposer = new EffectComposer(renderer);fgComposer.addPass(new RenderPass(fgScene, camera));fgComposer.addPass(bloomPass);// Combine in render loopfunction animate() {  // Render background without clearing  renderer.autoClear = false;  renderer.clear();  bgComposer.render();  // Render foreground over it  renderer.clearDepth();  fgComposer.render();}
```
```
// Multiple composers for different scenes/layersconst bgComposer = new EffectComposer(renderer);bgComposer.addPass(new RenderPass(bgScene, camera));const fgComposer = new EffectComposer(renderer);fgComposer.addPass(new RenderPass(fgScene, camera));fgComposer.addPass(bloomPass);// Combine in render loopfunction animate() {  // Render background without clearing  renderer.autoClear = false;  renderer.clear();  bgComposer.render();  // Render foreground over it  renderer.clearDepth();  fgComposer.render();}
```
```
import { postProcessing } from "three/addons/nodes/Nodes.js";import { pass, bloom, dof } from "three/addons/nodes/Nodes.js";// Using node-based systemconst scenePass = pass(scene, camera);const bloomNode = bloom(scenePass, 0.5, 0.4, 0.85);const postProcessing = new THREE.PostProcessing(renderer);postProcessing.outputNode = bloomNode;// Renderfunction animate() {  postProcessing.render();}
```
```
import { postProcessing } from "three/addons/nodes/Nodes.js";import { pass, bloom, dof } from "three/addons/nodes/Nodes.js";// Using node-based systemconst scenePass = pass(scene, camera);const bloomNode = bloom(scenePass, 0.5, 0.4, 0.85);const postProcessing = new THREE.PostProcessing(renderer);postProcessing.outputNode = bloomNode;// Renderfunction animate() {  postProcessing.render();}
```
```
// Disable passbloomPass.enabled = false;// Reduce bloom resolutionconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),  strength,  radius,  threshold,);// Only apply effects in high-performance scenariosconst isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);if (!isMobile) {  composer.addPass(expensivePass);}
```
```
// Disable passbloomPass.enabled = false;// Reduce bloom resolutionconst bloomPass = new UnrealBloomPass(  new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),  strength,  radius,  threshold,);// Only apply effects in high-performance scenariosconst isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);if (!isMobile) {  composer.addPass(expensivePass);}
```
```
function onWindowResize() {  const width = window.innerWidth;  const height = window.innerHeight;  const pixelRatio = renderer.getPixelRatio();  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  composer.setSize(width, height);  // Update pass-specific resolutions  if (fxaaPass) {    fxaaPass.material.uniforms["resolution"].value.set(      1 / (width * pixelRatio),      1 / (height * pixelRatio),    );  }  if (bloomPass) {    bloomPass.resolution.set(width, height);  }}window.addEventListener("resize", onWindowResize);
```
```
function onWindowResize() {  const width = window.innerWidth;  const height = window.innerHeight;  const pixelRatio = renderer.getPixelRatio();  camera.aspect = width / height;  camera.updateProjectionMatrix();  renderer.setSize(width, height);  composer.setSize(width, height);  // Update pass-specific resolutions  if (fxaaPass) {    fxaaPass.material.uniforms["resolution"].value.set(      1 / (width * pixelRatio),      1 / (height * pixelRatio),    );  }  if (bloomPass) {    bloomPass.resolution.set(width, height);  }}window.addEventListener("resize", onWindowResize);
```
```
threejs-shaders
```
```
threejs-textures
```
```
threejs-fundamentals
```
Unlock stunning visual fidelity in your Three.js projects with this powerful post-processing agent skill. Moving beyond raw renders, post-processing allows you to apply a vast array of screen-space effects like cinematic depth-of-field, glowing bloom, realistic color grading, and dynamic blurs. This skill empowers you to transform ordinary 3D scenes into captivating experiences, providing the tools to implement complex render pipelines and custom shaders with ease. Elevate your web graphics to a professional standard, making your interactive applications visually immersive and unforgettable.

# When to Use This Skill
- •Adding cinematic depth of field (DOF) to focus on specific objects in a scene.
- •Applying a glow effect (bloom) to emissive materials or light sources for enhanced realism.
- •Implementing color grading or vignetting to achieve a specific mood or aesthetic for your 3D application.
- •Creating custom screen-space shaders for unique visual distortions, outlines, or abstract effects.

# Pro Tips
- 💡Chain multiple passes: Leverage the `EffectComposer` to combine various passes (e.g., `RenderPass`, `UnrealBloomPass`, `SAOPass`) for layered visual effects, optimizing their order for desired output.
- 💡Optimize performance: Be mindful of the number and complexity of your post-processing passes, as they can be GPU intensive. Consider techniques like downsampling for passes that don't require full resolution, or using conditional rendering based on user device capabilities.
- 💡Custom shader integration: Use `ShaderPass` to easily integrate your own GLSL shaders into the post-processing pipeline, allowing for limitless creative control over visual effects beyond the standard Three.js library.

