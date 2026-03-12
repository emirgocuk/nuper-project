# threejs-lighting
Source: https://antigravity.codes/agent-skills/other/threejs-lighting

## AI Worker Instructions
When the user requests functionality related to threejs-lighting, follow these guidelines and utilize this context.

## Scraped Content

# threejs-lighting
```
import * as THREE from "three";// Basic lighting setupconst ambientLight = new THREE.AmbientLight(0xffffff, 0.5);scene.add(ambientLight);const directionalLight = new THREE.DirectionalLight(0xffffff, 1);directionalLight.position.set(5, 5, 5);scene.add(directionalLight);
```
```
import * as THREE from "three";// Basic lighting setupconst ambientLight = new THREE.AmbientLight(0xffffff, 0.5);scene.add(ambientLight);const directionalLight = new THREE.DirectionalLight(0xffffff, 1);directionalLight.position.set(5, 5, 5);scene.add(directionalLight);
```
```
// AmbientLight(color, intensity)const ambient = new THREE.AmbientLight(0xffffff, 0.5);scene.add(ambient);// Modify at runtimeambient.color.set(0xffffcc);ambient.intensity = 0.3;
```
```
// AmbientLight(color, intensity)const ambient = new THREE.AmbientLight(0xffffff, 0.5);scene.add(ambient);// Modify at runtimeambient.color.set(0xffffcc);ambient.intensity = 0.3;
```
```
// HemisphereLight(skyColor, groundColor, intensity)const hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6);hemi.position.set(0, 50, 0);scene.add(hemi);// Propertieshemi.color; // Sky colorhemi.groundColor; // Ground colorhemi.intensity;
```
```
// HemisphereLight(skyColor, groundColor, intensity)const hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6);hemi.position.set(0, 50, 0);scene.add(hemi);// Propertieshemi.color; // Sky colorhemi.groundColor; // Ground colorhemi.intensity;
```
```
// DirectionalLight(color, intensity)const dirLight = new THREE.DirectionalLight(0xffffff, 1);dirLight.position.set(5, 10, 5);// Light points at target (default: 0, 0, 0)dirLight.target.position.set(0, 0, 0);scene.add(dirLight.target);scene.add(dirLight);
```
```
// DirectionalLight(color, intensity)const dirLight = new THREE.DirectionalLight(0xffffff, 1);dirLight.position.set(5, 10, 5);// Light points at target (default: 0, 0, 0)dirLight.target.position.set(0, 0, 0);scene.add(dirLight.target);scene.add(dirLight);
```
```
dirLight.castShadow = true;// Shadow map size (higher = sharper, more expensive)dirLight.shadow.mapSize.width = 2048;dirLight.shadow.mapSize.height = 2048;// Shadow camera (orthographic)dirLight.shadow.camera.near = 0.5;dirLight.shadow.camera.far = 50;dirLight.shadow.camera.left = -10;dirLight.shadow.camera.right = 10;dirLight.shadow.camera.top = 10;dirLight.shadow.camera.bottom = -10;// Shadow softnessdirLight.shadow.radius = 4; // Blur radius (PCFSoftShadowMap only)// Shadow bias (fixes shadow acne)dirLight.shadow.bias = -0.0001;dirLight.shadow.normalBias = 0.02;// Helper to visualize shadow cameraconst helper = new THREE.CameraHelper(dirLight.shadow.camera);scene.add(helper);
```
```
dirLight.castShadow = true;// Shadow map size (higher = sharper, more expensive)dirLight.shadow.mapSize.width = 2048;dirLight.shadow.mapSize.height = 2048;// Shadow camera (orthographic)dirLight.shadow.camera.near = 0.5;dirLight.shadow.camera.far = 50;dirLight.shadow.camera.left = -10;dirLight.shadow.camera.right = 10;dirLight.shadow.camera.top = 10;dirLight.shadow.camera.bottom = -10;// Shadow softnessdirLight.shadow.radius = 4; // Blur radius (PCFSoftShadowMap only)// Shadow bias (fixes shadow acne)dirLight.shadow.bias = -0.0001;dirLight.shadow.normalBias = 0.02;// Helper to visualize shadow cameraconst helper = new THREE.CameraHelper(dirLight.shadow.camera);scene.add(helper);
```
```
// PointLight(color, intensity, distance, decay)const pointLight = new THREE.PointLight(0xffffff, 1, 100, 2);pointLight.position.set(0, 5, 0);scene.add(pointLight);// PropertiespointLight.distance; // Maximum range (0 = infinite)pointLight.decay; // Light falloff (physically correct = 2)
```
```
// PointLight(color, intensity, distance, decay)const pointLight = new THREE.PointLight(0xffffff, 1, 100, 2);pointLight.position.set(0, 5, 0);scene.add(pointLight);// PropertiespointLight.distance; // Maximum range (0 = infinite)pointLight.decay; // Light falloff (physically correct = 2)
```
```
pointLight.castShadow = true;pointLight.shadow.mapSize.width = 1024;pointLight.shadow.mapSize.height = 1024;// Shadow camera (perspective - 6 directions for cube map)pointLight.shadow.camera.near = 0.5;pointLight.shadow.camera.far = 50;pointLight.shadow.bias = -0.005;
```
```
pointLight.castShadow = true;pointLight.shadow.mapSize.width = 1024;pointLight.shadow.mapSize.height = 1024;// Shadow camera (perspective - 6 directions for cube map)pointLight.shadow.camera.near = 0.5;pointLight.shadow.camera.far = 50;pointLight.shadow.bias = -0.005;
```
```
// SpotLight(color, intensity, distance, angle, penumbra, decay)const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);spotLight.position.set(0, 10, 0);// Target (light points at this)spotLight.target.position.set(0, 0, 0);scene.add(spotLight.target);scene.add(spotLight);// PropertiesspotLight.angle; // Cone angle (radians, max Math.PI/2)spotLight.penumbra; // Soft edge (0-1)spotLight.distance; // RangespotLight.decay; // Falloff
```
```
// SpotLight(color, intensity, distance, angle, penumbra, decay)const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);spotLight.position.set(0, 10, 0);// Target (light points at this)spotLight.target.position.set(0, 0, 0);scene.add(spotLight.target);scene.add(spotLight);// PropertiesspotLight.angle; // Cone angle (radians, max Math.PI/2)spotLight.penumbra; // Soft edge (0-1)spotLight.distance; // RangespotLight.decay; // Falloff
```
```
spotLight.castShadow = true;spotLight.shadow.mapSize.width = 1024;spotLight.shadow.mapSize.height = 1024;// Shadow camera (perspective)spotLight.shadow.camera.near = 0.5;spotLight.shadow.camera.far = 50;spotLight.shadow.camera.fov = 30;spotLight.shadow.bias = -0.0001;// Focus (affects shadow projection)spotLight.shadow.focus = 1;
```
```
spotLight.castShadow = true;spotLight.shadow.mapSize.width = 1024;spotLight.shadow.mapSize.height = 1024;// Shadow camera (perspective)spotLight.shadow.camera.near = 0.5;spotLight.shadow.camera.far = 50;spotLight.shadow.camera.fov = 30;spotLight.shadow.bias = -0.0001;// Focus (affects shadow projection)spotLight.shadow.focus = 1;
```
```
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";// Must initialize uniforms firstRectAreaLightUniformsLib.init();// RectAreaLight(color, intensity, width, height)const rectLight = new THREE.RectAreaLight(0xffffff, 5, 4, 2);rectLight.position.set(0, 5, 0);rectLight.lookAt(0, 0, 0);scene.add(rectLight);// Helperconst helper = new RectAreaLightHelper(rectLight);rectLight.add(helper);// Note: Only works with MeshStandardMaterial and MeshPhysicalMaterial// Does not cast shadows natively
```
```
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";// Must initialize uniforms firstRectAreaLightUniformsLib.init();// RectAreaLight(color, intensity, width, height)const rectLight = new THREE.RectAreaLight(0xffffff, 5, 4, 2);rectLight.position.set(0, 5, 0);rectLight.lookAt(0, 0, 0);scene.add(rectLight);// Helperconst helper = new RectAreaLightHelper(rectLight);rectLight.add(helper);// Note: Only works with MeshStandardMaterial and MeshPhysicalMaterial// Does not cast shadows natively
```
```
// 1. Enable on rendererrenderer.shadowMap.enabled = true;renderer.shadowMap.type = THREE.PCFSoftShadowMap;// Shadow map types:// THREE.BasicShadowMap - fastest, low quality// THREE.PCFShadowMap - default, filtered// THREE.PCFSoftShadowMap - softer edges// THREE.VSMShadowMap - variance shadow map// 2. Enable on lightlight.castShadow = true;// 3. Enable on objectsmesh.castShadow = true;mesh.receiveShadow = true;// Ground planefloor.receiveShadow = true;floor.castShadow = false; // Usually false for floors
```
```
// 1. Enable on rendererrenderer.shadowMap.enabled = true;renderer.shadowMap.type = THREE.PCFSoftShadowMap;// Shadow map types:// THREE.BasicShadowMap - fastest, low quality// THREE.PCFShadowMap - default, filtered// THREE.PCFSoftShadowMap - softer edges// THREE.VSMShadowMap - variance shadow map// 2. Enable on lightlight.castShadow = true;// 3. Enable on objectsmesh.castShadow = true;mesh.receiveShadow = true;// Ground planefloor.receiveShadow = true;floor.castShadow = false; // Usually false for floors
```
```
// Tight shadow camera frustumconst d = 10;dirLight.shadow.camera.left = -d;dirLight.shadow.camera.right = d;dirLight.shadow.camera.top = d;dirLight.shadow.camera.bottom = -d;dirLight.shadow.camera.near = 0.5;dirLight.shadow.camera.far = 30;// Fix shadow acnedirLight.shadow.bias = -0.0001; // Depth biasdirLight.shadow.normalBias = 0.02; // Bias along normal// Shadow map size (balance quality vs performance)// 512 - low quality// 1024 - medium quality// 2048 - high quality// 4096 - very high quality (expensive)
```
```
// Tight shadow camera frustumconst d = 10;dirLight.shadow.camera.left = -d;dirLight.shadow.camera.right = d;dirLight.shadow.camera.top = d;dirLight.shadow.camera.bottom = -d;dirLight.shadow.camera.near = 0.5;dirLight.shadow.camera.far = 30;// Fix shadow acnedirLight.shadow.bias = -0.0001; // Depth biasdirLight.shadow.normalBias = 0.02; // Bias along normal// Shadow map size (balance quality vs performance)// 512 - low quality// 1024 - medium quality// 2048 - high quality// 4096 - very high quality (expensive)
```
```
import { ContactShadows } from "three/examples/jsm/objects/ContactShadows.js";const contactShadows = new ContactShadows({  resolution: 512,  blur: 2,  opacity: 0.5,  scale: 10,  position: [0, 0, 0],});scene.add(contactShadows);
```
```
import { ContactShadows } from "three/examples/jsm/objects/ContactShadows.js";const contactShadows = new ContactShadows({  resolution: 512,  blur: 2,  opacity: 0.5,  scale: 10,  position: [0, 0, 0],});scene.add(contactShadows);
```
```
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";// DirectionalLight helperconst dirHelper = new THREE.DirectionalLightHelper(dirLight, 5);scene.add(dirHelper);// PointLight helperconst pointHelper = new THREE.PointLightHelper(pointLight, 1);scene.add(pointHelper);// SpotLight helperconst spotHelper = new THREE.SpotLightHelper(spotLight);scene.add(spotHelper);// Hemisphere helperconst hemiHelper = new THREE.HemisphereLightHelper(hemiLight, 5);scene.add(hemiHelper);// RectAreaLight helperconst rectHelper = new RectAreaLightHelper(rectLight);rectLight.add(rectHelper);// Update helpers when light changesdirHelper.update();spotHelper.update();
```
```
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";// DirectionalLight helperconst dirHelper = new THREE.DirectionalLightHelper(dirLight, 5);scene.add(dirHelper);// PointLight helperconst pointHelper = new THREE.PointLightHelper(pointLight, 1);scene.add(pointHelper);// SpotLight helperconst spotHelper = new THREE.SpotLightHelper(spotLight);scene.add(spotHelper);// Hemisphere helperconst hemiHelper = new THREE.HemisphereLightHelper(hemiLight, 5);scene.add(hemiHelper);// RectAreaLight helperconst rectHelper = new RectAreaLightHelper(rectLight);rectLight.add(rectHelper);// Update helpers when light changesdirHelper.update();spotHelper.update();
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  // Set as scene environment (affects all PBR materials)  scene.environment = texture;  // Optional: also use as background  scene.background = texture;  scene.backgroundBlurriness = 0; // 0-1, blur the background  scene.backgroundIntensity = 1;});// PMREMGenerator for better reflectionsconst pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();rgbeLoader.load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";const rgbeLoader = new RGBELoader();rgbeLoader.load("environment.hdr", (texture) => {  texture.mapping = THREE.EquirectangularReflectionMapping;  // Set as scene environment (affects all PBR materials)  scene.environment = texture;  // Optional: also use as background  scene.background = texture;  scene.backgroundBlurriness = 0; // 0-1, blur the background  scene.backgroundIntensity = 1;});// PMREMGenerator for better reflectionsconst pmremGenerator = new THREE.PMREMGenerator(renderer);pmremGenerator.compileEquirectangularShader();rgbeLoader.load("environment.hdr", (texture) => {  const envMap = pmremGenerator.fromEquirectangular(texture).texture;  scene.environment = envMap;  texture.dispose();  pmremGenerator.dispose();});
```
```
const cubeLoader = new THREE.CubeTextureLoader();const envMap = cubeLoader.load([  "px.jpg",  "nx.jpg",  "py.jpg",  "ny.jpg",  "pz.jpg",  "nz.jpg",]);scene.environment = envMap;scene.background = envMap;
```
```
const cubeLoader = new THREE.CubeTextureLoader();const envMap = cubeLoader.load([  "px.jpg",  "nx.jpg",  "py.jpg",  "ny.jpg",  "pz.jpg",  "nz.jpg",]);scene.environment = envMap;scene.background = envMap;
```
```
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator.js";// Generate from cube textureconst lightProbe = new THREE.LightProbe();scene.add(lightProbe);lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));// Or from render targetconst cubeCamera = new THREE.CubeCamera(  0.1,  100,  new THREE.WebGLCubeRenderTarget(256),);cubeCamera.update(renderer, scene);lightProbe.copy(  LightProbeGenerator.fromCubeRenderTarget(renderer, cubeCamera.renderTarget),);
```
```
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator.js";// Generate from cube textureconst lightProbe = new THREE.LightProbe();scene.add(lightProbe);lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));// Or from render targetconst cubeCamera = new THREE.CubeCamera(  0.1,  100,  new THREE.WebGLCubeRenderTarget(256),);cubeCamera.update(renderer, scene);lightProbe.copy(  LightProbeGenerator.fromCubeRenderTarget(renderer, cubeCamera.renderTarget),);
```
```
// Key light (main light)const keyLight = new THREE.DirectionalLight(0xffffff, 1);keyLight.position.set(5, 5, 5);scene.add(keyLight);// Fill light (softer, opposite side)const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);fillLight.position.set(-5, 3, 5);scene.add(fillLight);// Back light (rim lighting)const backLight = new THREE.DirectionalLight(0xffffff, 0.3);backLight.position.set(0, 5, -5);scene.add(backLight);// Ambient fillconst ambient = new THREE.AmbientLight(0x404040, 0.3);scene.add(ambient);
```
```
// Key light (main light)const keyLight = new THREE.DirectionalLight(0xffffff, 1);keyLight.position.set(5, 5, 5);scene.add(keyLight);// Fill light (softer, opposite side)const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);fillLight.position.set(-5, 3, 5);scene.add(fillLight);// Back light (rim lighting)const backLight = new THREE.DirectionalLight(0xffffff, 0.3);backLight.position.set(0, 5, -5);scene.add(backLight);// Ambient fillconst ambient = new THREE.AmbientLight(0x404040, 0.3);scene.add(ambient);
```
```
// Sunconst sun = new THREE.DirectionalLight(0xffffcc, 1.5);sun.position.set(50, 100, 50);sun.castShadow = true;scene.add(sun);// Sky ambientconst hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6);scene.add(hemi);
```
```
// Sunconst sun = new THREE.DirectionalLight(0xffffcc, 1.5);sun.position.set(50, 100, 50);sun.castShadow = true;scene.add(sun);// Sky ambientconst hemi = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6);scene.add(hemi);
```
```
// Multiple area lightsRectAreaLightUniformsLib.init();const light1 = new THREE.RectAreaLight(0xffffff, 5, 2, 2);light1.position.set(3, 3, 3);light1.lookAt(0, 0, 0);scene.add(light1);const light2 = new THREE.RectAreaLight(0xffffff, 3, 2, 2);light2.position.set(-3, 3, 3);light2.lookAt(0, 0, 0);scene.add(light2);// Ambient fillconst ambient = new THREE.AmbientLight(0x404040, 0.2);scene.add(ambient);
```
```
// Multiple area lightsRectAreaLightUniformsLib.init();const light1 = new THREE.RectAreaLight(0xffffff, 5, 2, 2);light1.position.set(3, 3, 3);light1.lookAt(0, 0, 0);scene.add(light1);const light2 = new THREE.RectAreaLight(0xffffff, 3, 2, 2);light2.position.set(-3, 3, 3);light2.lookAt(0, 0, 0);scene.add(light2);// Ambient fillconst ambient = new THREE.AmbientLight(0x404040, 0.2);scene.add(ambient);
```
```
const clock = new THREE.Clock();function animate() {  const time = clock.getElapsedTime();  // Orbit light around scene  light.position.x = Math.cos(time) * 5;  light.position.z = Math.sin(time) * 5;  // Pulsing intensity  light.intensity = 1 + Math.sin(time * 2) * 0.5;  // Color cycling  light.color.setHSL((time * 0.1) % 1, 1, 0.5);  // Update helpers if using  lightHelper.update();}
```
```
const clock = new THREE.Clock();function animate() {  const time = clock.getElapsedTime();  // Orbit light around scene  light.position.x = Math.cos(time) * 5;  light.position.z = Math.sin(time) * 5;  // Pulsing intensity  light.intensity = 1 + Math.sin(time * 2) * 0.5;  // Color cycling  light.color.setHSL((time * 0.1) % 1, 1, 0.5);  // Update helpers if using  lightHelper.update();}
```
```
// Light layerslight.layers.set(1); // Light only affects layer 1mesh.layers.enable(1); // Mesh is on layer 1otherMesh.layers.disable(1); // Other mesh not affected// Selective shadowsmesh.castShadow = true;mesh.receiveShadow = true;decorMesh.castShadow = false; // Small objects often don't need to cast
```
```
// Light layerslight.layers.set(1); // Light only affects layer 1mesh.layers.enable(1); // Mesh is on layer 1otherMesh.layers.disable(1); // Other mesh not affected// Selective shadowsmesh.castShadow = true;mesh.receiveShadow = true;decorMesh.castShadow = false; // Small objects often don't need to cast
```
```
threejs-materials
```
```
threejs-textures
```
```
threejs-postprocessing
```
Effective lighting is crucial for creating immersive and realistic 3D environments in Three.js. This agent skill provides comprehensive guidance on integrating and optimizing various light sources, from simple ambient fills to complex shadow-casting directional and point lights. Developers will learn to manipulate light properties, achieve compelling visual effects, and ensure optimal rendering performance. Whether you're enhancing realism with Physically Based Rendering (PBR) or simply illuminating your scene, this skill equips you with the knowledge to make your 3D projects shine, transforming flat models into vibrant, dynamic experiences.

# When to Use This Skill
- •Implementing a day-night cycle with dynamic sun and moon lighting in a Three.js scene.
- •Setting up realistic interior scenes with multiple point and spot lights for specific ambiance and effects.
- •Optimizing lighting for performance in complex Three.js scenes with many objects or real-time shadows.
- •Integrating image-based lighting (IBL) using HDRI maps for environmental reflections and diffuse illumination.

# Pro Tips
- 💡**Prioritize Performance**: Use `AmbientLight` and `HemisphereLight` for general illumination before adding costly shadow-casting lights. Limit shadow map resolutions and only enable shadows on essential objects to maintain high frame rates.
- 💡**Experiment with IBL**: Leverage `THREE.CubeTextureLoader` or `THREE.PMREMGenerator` with HDRIs to achieve highly realistic environment reflections and diffuse lighting for PBR materials, significantly enhancing visual quality with minimal performance impact compared to many individual lights.
- 💡**Group Lights for Control**: Organize related lights into `THREE.Group` objects to easily manage their visibility, position, and intensity as a unit, which is especially useful for scene sections, light fixtures, or complex lighting setups.

