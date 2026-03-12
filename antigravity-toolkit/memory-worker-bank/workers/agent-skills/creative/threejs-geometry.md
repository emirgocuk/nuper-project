# threejs-geometry
Source: https://antigravity.codes/agent-skills/creative/threejs-geometry

## AI Worker Instructions
When the user requests functionality related to threejs-geometry, follow these guidelines and utilize this context.

## Scraped Content

# threejs-geometry
```
import * as THREE from "three";// Built-in geometryconst box = new THREE.BoxGeometry(1, 1, 1);const sphere = new THREE.SphereGeometry(0.5, 32, 32);const plane = new THREE.PlaneGeometry(10, 10);// Create meshconst material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const mesh = new THREE.Mesh(box, material);scene.add(mesh);
```
```
import * as THREE from "three";// Built-in geometryconst box = new THREE.BoxGeometry(1, 1, 1);const sphere = new THREE.SphereGeometry(0.5, 32, 32);const plane = new THREE.PlaneGeometry(10, 10);// Create meshconst material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const mesh = new THREE.Mesh(box, material);scene.add(mesh);
```
```
// Box - width, height, depth, widthSegments, heightSegments, depthSegmentsnew THREE.BoxGeometry(1, 1, 1, 1, 1, 1);// Sphere - radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLengthnew THREE.SphereGeometry(1, 32, 32);new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI); // Full spherenew THREE.SphereGeometry(1, 32, 32, 0, Math.PI); // Hemisphere// Plane - width, height, widthSegments, heightSegmentsnew THREE.PlaneGeometry(10, 10, 1, 1);// Circle - radius, segments, thetaStart, thetaLengthnew THREE.CircleGeometry(1, 32);new THREE.CircleGeometry(1, 32, 0, Math.PI); // Semicircle// Cylinder - radiusTop, radiusBottom, height, radialSegments, heightSegments, openEndednew THREE.CylinderGeometry(1, 1, 2, 32, 1, false);new THREE.CylinderGeometry(0, 1, 2, 32); // Conenew THREE.CylinderGeometry(1, 1, 2, 6); // Hexagonal prism// Cone - radius, height, radialSegments, heightSegments, openEndednew THREE.ConeGeometry(1, 2, 32, 1, false);// Torus - radius, tube, radialSegments, tubularSegments, arcnew THREE.TorusGeometry(1, 0.4, 16, 100);// TorusKnot - radius, tube, tubularSegments, radialSegments, p, qnew THREE.TorusKnotGeometry(1, 0.4, 100, 16, 2, 3);// Ring - innerRadius, outerRadius, thetaSegments, phiSegmentsnew THREE.RingGeometry(0.5, 1, 32, 1);
```
```
// Box - width, height, depth, widthSegments, heightSegments, depthSegmentsnew THREE.BoxGeometry(1, 1, 1, 1, 1, 1);// Sphere - radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLengthnew THREE.SphereGeometry(1, 32, 32);new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI); // Full spherenew THREE.SphereGeometry(1, 32, 32, 0, Math.PI); // Hemisphere// Plane - width, height, widthSegments, heightSegmentsnew THREE.PlaneGeometry(10, 10, 1, 1);// Circle - radius, segments, thetaStart, thetaLengthnew THREE.CircleGeometry(1, 32);new THREE.CircleGeometry(1, 32, 0, Math.PI); // Semicircle// Cylinder - radiusTop, radiusBottom, height, radialSegments, heightSegments, openEndednew THREE.CylinderGeometry(1, 1, 2, 32, 1, false);new THREE.CylinderGeometry(0, 1, 2, 32); // Conenew THREE.CylinderGeometry(1, 1, 2, 6); // Hexagonal prism// Cone - radius, height, radialSegments, heightSegments, openEndednew THREE.ConeGeometry(1, 2, 32, 1, false);// Torus - radius, tube, radialSegments, tubularSegments, arcnew THREE.TorusGeometry(1, 0.4, 16, 100);// TorusKnot - radius, tube, tubularSegments, radialSegments, p, qnew THREE.TorusKnotGeometry(1, 0.4, 100, 16, 2, 3);// Ring - innerRadius, outerRadius, thetaSegments, phiSegmentsnew THREE.RingGeometry(0.5, 1, 32, 1);
```
```
// Capsule - radius, length, capSegments, radialSegmentsnew THREE.CapsuleGeometry(0.5, 1, 4, 8);// Dodecahedron - radius, detailnew THREE.DodecahedronGeometry(1, 0);// Icosahedron - radius, detail (0 = 20 faces, higher = smoother)new THREE.IcosahedronGeometry(1, 0);// Octahedron - radius, detailnew THREE.OctahedronGeometry(1, 0);// Tetrahedron - radius, detailnew THREE.TetrahedronGeometry(1, 0);// Polyhedron - vertices, indices, radius, detailconst vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
```
```
// Capsule - radius, length, capSegments, radialSegmentsnew THREE.CapsuleGeometry(0.5, 1, 4, 8);// Dodecahedron - radius, detailnew THREE.DodecahedronGeometry(1, 0);// Icosahedron - radius, detail (0 = 20 faces, higher = smoother)new THREE.IcosahedronGeometry(1, 0);// Octahedron - radius, detailnew THREE.OctahedronGeometry(1, 0);// Tetrahedron - radius, detailnew THREE.TetrahedronGeometry(1, 0);// Polyhedron - vertices, indices, radius, detailconst vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
```
```
// Lathe - points[], segments, phiStart, phiLengthconst points = [  new THREE.Vector2(0, 0),  new THREE.Vector2(0.5, 0),  new THREE.Vector2(0.5, 1),  new THREE.Vector2(0, 1),];new THREE.LatheGeometry(points, 32);// Extrude - shape, optionsconst shape = new THREE.Shape();shape.moveTo(0, 0);shape.lineTo(1, 0);shape.lineTo(1, 1);shape.lineTo(0, 1);shape.lineTo(0, 0);const extrudeSettings = {  steps: 2,  depth: 1,  bevelEnabled: true,  bevelThickness: 0.1,  bevelSize: 0.1,  bevelSegments: 3,};new THREE.ExtrudeGeometry(shape, extrudeSettings);// Tube - path, tubularSegments, radius, radialSegments, closedconst curve = new THREE.CatmullRomCurve3([  new THREE.Vector3(-1, 0, 0),  new THREE.Vector3(0, 1, 0),  new THREE.Vector3(1, 0, 0),]);new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
```
```
// Lathe - points[], segments, phiStart, phiLengthconst points = [  new THREE.Vector2(0, 0),  new THREE.Vector2(0.5, 0),  new THREE.Vector2(0.5, 1),  new THREE.Vector2(0, 1),];new THREE.LatheGeometry(points, 32);// Extrude - shape, optionsconst shape = new THREE.Shape();shape.moveTo(0, 0);shape.lineTo(1, 0);shape.lineTo(1, 1);shape.lineTo(0, 1);shape.lineTo(0, 0);const extrudeSettings = {  steps: 2,  depth: 1,  bevelEnabled: true,  bevelThickness: 0.1,  bevelSize: 0.1,  bevelSegments: 3,};new THREE.ExtrudeGeometry(shape, extrudeSettings);// Tube - path, tubularSegments, radius, radialSegments, closedconst curve = new THREE.CatmullRomCurve3([  new THREE.Vector3(-1, 0, 0),  new THREE.Vector3(0, 1, 0),  new THREE.Vector3(1, 0, 0),]);new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
```
```
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";const loader = new FontLoader();loader.load("fonts/helvetiker_regular.typeface.json", (font) => {  const geometry = new TextGeometry("Hello", {    font: font,    size: 1,    depth: 0.2, // Was 'height' in older versions    curveSegments: 12,    bevelEnabled: true,    bevelThickness: 0.03,    bevelSize: 0.02,    bevelSegments: 5,  });  // Center text  geometry.computeBoundingBox();  geometry.center();  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";const loader = new FontLoader();loader.load("fonts/helvetiker_regular.typeface.json", (font) => {  const geometry = new TextGeometry("Hello", {    font: font,    size: 1,    depth: 0.2, // Was 'height' in older versions    curveSegments: 12,    bevelEnabled: true,    bevelThickness: 0.03,    bevelSize: 0.02,    bevelSegments: 5,  });  // Center text  geometry.computeBoundingBox();  geometry.center();  const mesh = new THREE.Mesh(geometry, material);  scene.add(mesh);});
```
```
const geometry = new THREE.BufferGeometry();// Vertices (3 floats per vertex: x, y, z)const vertices = new Float32Array([  -1,  -1,  0, // vertex 0  1,  -1,  0, // vertex 1  1,  1,  0, // vertex 2  -1,  1,  0, // vertex 3]);geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));// Indices (for indexed geometry - reuse vertices)const indices = new Uint16Array([  0,  1,  2, // triangle 1  0,  2,  3, // triangle 2]);geometry.setIndex(new THREE.BufferAttribute(indices, 1));// Normals (required for lighting)const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));// UVs (for texturing)const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));// Colors (per-vertex colors)const colors = new Float32Array([  1,  0,  0, // red  0,  1,  0, // green  0,  0,  1, // blue  1,  1,  0, // yellow]);geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));// Use with: material.vertexColors = true
```
```
const geometry = new THREE.BufferGeometry();// Vertices (3 floats per vertex: x, y, z)const vertices = new Float32Array([  -1,  -1,  0, // vertex 0  1,  -1,  0, // vertex 1  1,  1,  0, // vertex 2  -1,  1,  0, // vertex 3]);geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));// Indices (for indexed geometry - reuse vertices)const indices = new Uint16Array([  0,  1,  2, // triangle 1  0,  2,  3, // triangle 2]);geometry.setIndex(new THREE.BufferAttribute(indices, 1));// Normals (required for lighting)const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));// UVs (for texturing)const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));// Colors (per-vertex colors)const colors = new Float32Array([  1,  0,  0, // red  0,  1,  0, // green  0,  0,  1, // blue  1,  1,  0, // yellow]);geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));// Use with: material.vertexColors = true
```
```
// Common attribute typesnew THREE.BufferAttribute(array, itemSize);// Typed array optionsnew Float32Array(count * itemSize); // Positions, normals, UVsnew Uint16Array(count); // Indices (up to 65535 vertices)new Uint32Array(count); // Indices (larger meshes)new Uint8Array(count * itemSize); // Colors (0-255 range)// Item sizes// Position: 3 (x, y, z)// Normal: 3 (x, y, z)// UV: 2 (u, v)// Color: 3 (r, g, b) or 4 (r, g, b, a)// Index: 1
```
```
// Common attribute typesnew THREE.BufferAttribute(array, itemSize);// Typed array optionsnew Float32Array(count * itemSize); // Positions, normals, UVsnew Uint16Array(count); // Indices (up to 65535 vertices)new Uint32Array(count); // Indices (larger meshes)new Uint8Array(count * itemSize); // Colors (0-255 range)// Item sizes// Position: 3 (x, y, z)// Normal: 3 (x, y, z)// UV: 2 (u, v)// Color: 3 (r, g, b) or 4 (r, g, b, a)// Index: 1
```
```
const positions = geometry.attributes.position;// Modify vertexpositions.setXYZ(index, x, y, z);// Access vertexconst x = positions.getX(index);const y = positions.getY(index);const z = positions.getZ(index);// Flag for GPU updatepositions.needsUpdate = true;// Recompute normals after position changesgeometry.computeVertexNormals();// Recompute bounding box/sphere after changesgeometry.computeBoundingBox();geometry.computeBoundingSphere();
```
```
const positions = geometry.attributes.position;// Modify vertexpositions.setXYZ(index, x, y, z);// Access vertexconst x = positions.getX(index);const y = positions.getY(index);const z = positions.getZ(index);// Flag for GPU updatepositions.needsUpdate = true;// Recompute normals after position changesgeometry.computeVertexNormals();// Recompute bounding box/sphere after changesgeometry.computeBoundingBox();geometry.computeBoundingSphere();
```
```
// More efficient memory layout for large meshesconst interleavedBuffer = new THREE.InterleavedBuffer(  new Float32Array([    // pos.x, pos.y, pos.z, uv.u, uv.v (repeated per vertex)    -1, -1, 0, 0, 0, 1, -1, 0, 1, 0, 1, 1, 0, 1, 1, -1, 1, 0, 0, 1,  ]),  5, // stride (floats per vertex));geometry.setAttribute(  "position",  new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0),); // size 3, offset 0geometry.setAttribute(  "uv",  new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3),); // size 2, offset 3
```
```
// More efficient memory layout for large meshesconst interleavedBuffer = new THREE.InterleavedBuffer(  new Float32Array([    // pos.x, pos.y, pos.z, uv.u, uv.v (repeated per vertex)    -1, -1, 0, 0, 0, 1, -1, 0, 1, 0, 1, 1, 0, 1, 1, -1, 1, 0, 0, 1,  ]),  5, // stride (floats per vertex));geometry.setAttribute(  "position",  new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0),); // size 3, offset 0geometry.setAttribute(  "uv",  new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3),); // size 2, offset 3
```
```
// Edge lines (only hard edges)const edges = new THREE.EdgesGeometry(boxGeometry, 15); // 15 = threshold angleconst edgeMesh = new THREE.LineSegments(  edges,  new THREE.LineBasicMaterial({ color: 0xffffff }),);// Wireframe (all triangles)const wireframe = new THREE.WireframeGeometry(boxGeometry);const wireMesh = new THREE.LineSegments(  wireframe,  new THREE.LineBasicMaterial({ color: 0xffffff }),);
```
```
// Edge lines (only hard edges)const edges = new THREE.EdgesGeometry(boxGeometry, 15); // 15 = threshold angleconst edgeMesh = new THREE.LineSegments(  edges,  new THREE.LineBasicMaterial({ color: 0xffffff }),);// Wireframe (all triangles)const wireframe = new THREE.WireframeGeometry(boxGeometry);const wireMesh = new THREE.LineSegments(  wireframe,  new THREE.LineBasicMaterial({ color: 0xffffff }),);
```
```
// Create point cloudconst geometry = new THREE.BufferGeometry();const positions = new Float32Array(1000 * 3);for (let i = 0; i < 1000; i++) {  positions[i * 3] = (Math.random() - 0.5) * 10;  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;}geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));const material = new THREE.PointsMaterial({  size: 0.1,  sizeAttenuation: true, // Size decreases with distance  color: 0xffffff,});const points = new THREE.Points(geometry, material);scene.add(points);
```
```
// Create point cloudconst geometry = new THREE.BufferGeometry();const positions = new Float32Array(1000 * 3);for (let i = 0; i < 1000; i++) {  positions[i * 3] = (Math.random() - 0.5) * 10;  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;}geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));const material = new THREE.PointsMaterial({  size: 0.1,  sizeAttenuation: true, // Size decreases with distance  color: 0xffffff,});const points = new THREE.Points(geometry, material);scene.add(points);
```
```
// Line (connected points)const points = [  new THREE.Vector3(-1, 0, 0),  new THREE.Vector3(0, 1, 0),  new THREE.Vector3(1, 0, 0),];const geometry = new THREE.BufferGeometry().setFromPoints(points);const line = new THREE.Line(  geometry,  new THREE.LineBasicMaterial({ color: 0xff0000 }),);// LineLoop (closed loop)const loop = new THREE.LineLoop(geometry, material);// LineSegments (pairs of points)const segmentsGeometry = new THREE.BufferGeometry();segmentsGeometry.setAttribute(  "position",  new THREE.BufferAttribute(    new Float32Array([      -1,      0,      0,      0,      1,      0, // segment 1      0,      1,      0,      1,      0,      0, // segment 2    ]),    3,  ),);const segments = new THREE.LineSegments(segmentsGeometry, material);
```
```
// Line (connected points)const points = [  new THREE.Vector3(-1, 0, 0),  new THREE.Vector3(0, 1, 0),  new THREE.Vector3(1, 0, 0),];const geometry = new THREE.BufferGeometry().setFromPoints(points);const line = new THREE.Line(  geometry,  new THREE.LineBasicMaterial({ color: 0xff0000 }),);// LineLoop (closed loop)const loop = new THREE.LineLoop(geometry, material);// LineSegments (pairs of points)const segmentsGeometry = new THREE.BufferGeometry();segmentsGeometry.setAttribute(  "position",  new THREE.BufferAttribute(    new Float32Array([      -1,      0,      0,      0,      1,      0, // segment 1      0,      1,      0,      1,      0,      0, // segment 2    ]),    3,  ),);const segments = new THREE.LineSegments(segmentsGeometry, material);
```
```
const geometry = new THREE.BoxGeometry(1, 1, 1);const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const count = 1000;const instancedMesh = new THREE.InstancedMesh(geometry, material, count);// Set transforms for each instanceconst dummy = new THREE.Object3D();const matrix = new THREE.Matrix4();for (let i = 0; i < count; i++) {  dummy.position.set(    (Math.random() - 0.5) * 20,    (Math.random() - 0.5) * 20,    (Math.random() - 0.5) * 20,  );  dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);  dummy.scale.setScalar(0.5 + Math.random());  dummy.updateMatrix();  instancedMesh.setMatrixAt(i, dummy.matrix);}// Flag for GPU updateinstancedMesh.instanceMatrix.needsUpdate = true;// Optional: per-instance colorsinstancedMesh.instanceColor = new THREE.InstancedBufferAttribute(  new Float32Array(count * 3),  3,);for (let i = 0; i < count; i++) {  instancedMesh.setColorAt(    i,    new THREE.Color(Math.random(), Math.random(), Math.random()),  );}instancedMesh.instanceColor.needsUpdate = true;scene.add(instancedMesh);
```
```
const geometry = new THREE.BoxGeometry(1, 1, 1);const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });const count = 1000;const instancedMesh = new THREE.InstancedMesh(geometry, material, count);// Set transforms for each instanceconst dummy = new THREE.Object3D();const matrix = new THREE.Matrix4();for (let i = 0; i < count; i++) {  dummy.position.set(    (Math.random() - 0.5) * 20,    (Math.random() - 0.5) * 20,    (Math.random() - 0.5) * 20,  );  dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);  dummy.scale.setScalar(0.5 + Math.random());  dummy.updateMatrix();  instancedMesh.setMatrixAt(i, dummy.matrix);}// Flag for GPU updateinstancedMesh.instanceMatrix.needsUpdate = true;// Optional: per-instance colorsinstancedMesh.instanceColor = new THREE.InstancedBufferAttribute(  new Float32Array(count * 3),  3,);for (let i = 0; i < count; i++) {  instancedMesh.setColorAt(    i,    new THREE.Color(Math.random(), Math.random(), Math.random()),  );}instancedMesh.instanceColor.needsUpdate = true;scene.add(instancedMesh);
```
```
// Update single instanceconst matrix = new THREE.Matrix4();instancedMesh.getMatrixAt(index, matrix);// Modify matrix...instancedMesh.setMatrixAt(index, matrix);instancedMesh.instanceMatrix.needsUpdate = true;// Raycasting with instanced meshconst intersects = raycaster.intersectObject(instancedMesh);if (intersects.length > 0) {  const instanceId = intersects[0].instanceId;}
```
```
// Update single instanceconst matrix = new THREE.Matrix4();instancedMesh.getMatrixAt(index, matrix);// Modify matrix...instancedMesh.setMatrixAt(index, matrix);instancedMesh.instanceMatrix.needsUpdate = true;// Raycasting with instanced meshconst intersects = raycaster.intersectObject(instancedMesh);if (intersects.length > 0) {  const instanceId = intersects[0].instanceId;}
```
```
const geometry = new THREE.InstancedBufferGeometry();geometry.copy(new THREE.BoxGeometry(1, 1, 1));// Add per-instance attributeconst offsets = new Float32Array(count * 3);for (let i = 0; i < count; i++) {  offsets[i * 3] = Math.random() * 10;  offsets[i * 3 + 1] = Math.random() * 10;  offsets[i * 3 + 2] = Math.random() * 10;}geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));// Use in shader// attribute vec3 offset;// vec3 transformed = position + offset;
```
```
const geometry = new THREE.InstancedBufferGeometry();geometry.copy(new THREE.BoxGeometry(1, 1, 1));// Add per-instance attributeconst offsets = new Float32Array(count * 3);for (let i = 0; i < count; i++) {  offsets[i * 3] = Math.random() * 10;  offsets[i * 3 + 1] = Math.random() * 10;  offsets[i * 3 + 2] = Math.random() * 10;}geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));// Use in shader// attribute vec3 offset;// vec3 transformed = position + offset;
```
```
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";// Merge geometries (must have same attributes)const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2, geo3]);// Merge with groups (for multi-material)const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2], true);// Compute tangents (required for normal maps)BufferGeometryUtils.computeTangents(geometry);// Interleave attributes for better performanceconst interleaved = BufferGeometryUtils.interleaveAttributes([  geometry.attributes.position,  geometry.attributes.normal,  geometry.attributes.uv,]);
```
```
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";// Merge geometries (must have same attributes)const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2, geo3]);// Merge with groups (for multi-material)const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2], true);// Compute tangents (required for normal maps)BufferGeometryUtils.computeTangents(geometry);// Interleave attributes for better performanceconst interleaved = BufferGeometryUtils.interleaveAttributes([  geometry.attributes.position,  geometry.attributes.normal,  geometry.attributes.uv,]);
```
```
geometry.computeBoundingBox();geometry.center(); // Move vertices so center is at origin
```
```
geometry.computeBoundingBox();geometry.center(); // Move vertices so center is at origin
```
```
geometry.computeBoundingBox();const size = new THREE.Vector3();geometry.boundingBox.getSize(size);const maxDim = Math.max(size.x, size.y, size.z);geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
```
```
geometry.computeBoundingBox();const size = new THREE.Vector3();geometry.boundingBox.getSize(size);const maxDim = Math.max(size.x, size.y, size.z);geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
```
```
const clone = geometry.clone();clone.rotateX(Math.PI / 2);clone.translate(0, 1, 0);clone.scale(2, 2, 2);
```
```
const clone = geometry.clone();clone.rotateX(Math.PI / 2);clone.translate(0, 1, 0);clone.scale(2, 2, 2);
```
```
// Base geometryconst geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);// Create morph targetconst morphPositions = geometry.attributes.position.array.slice();for (let i = 0; i < morphPositions.length; i += 3) {  morphPositions[i] *= 2; // Scale X  morphPositions[i + 1] *= 0.5; // Squash Y}geometry.morphAttributes.position = [  new THREE.BufferAttribute(new Float32Array(morphPositions), 3),];const mesh = new THREE.Mesh(geometry, material);mesh.morphTargetInfluences[0] = 0.5; // 50% blend
```
```
// Base geometryconst geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);// Create morph targetconst morphPositions = geometry.attributes.position.array.slice();for (let i = 0; i < morphPositions.length; i += 3) {  morphPositions[i] *= 2; // Scale X  morphPositions[i + 1] *= 0.5; // Squash Y}geometry.morphAttributes.position = [  new THREE.BufferAttribute(new Float32Array(morphPositions), 3),];const mesh = new THREE.Mesh(geometry, material);mesh.morphTargetInfluences[0] = 0.5; // 50% blend
```
```
mergeGeometries
```
```
geometry.dispose()
```
```
// Good segment counts for common usesnew THREE.SphereGeometry(1, 32, 32); // Good qualitynew THREE.SphereGeometry(1, 64, 64); // High qualitynew THREE.SphereGeometry(1, 16, 16); // Performance mode// Dispose when donegeometry.dispose();
```
```
// Good segment counts for common usesnew THREE.SphereGeometry(1, 32, 32); // Good qualitynew THREE.SphereGeometry(1, 64, 64); // High qualitynew THREE.SphereGeometry(1, 16, 16); // Performance mode// Dispose when donegeometry.dispose();
```
```
threejs-fundamentals
```
```
threejs-materials
```
```
threejs-shaders
```
This skill empowers AI agents to expertly handle the foundational aspect of 3D graphics in Three.js: geometry. From generating standard primitives like boxes and spheres to crafting intricate custom shapes using BufferGeometry, it provides a comprehensive toolkit. Developers can leverage this to quickly scaffold 3D scenes, optimize performance with advanced techniques like instancing, and precisely manipulate vertices for dynamic visual effects. It streamlines the creation of interactive and visually rich web experiences, making complex 3D object definition accessible and efficient for AI-assisted coding.

# When to Use This Skill
- •Rapidly prototyping 3D scenes with standard geometric shapes.
- •Implementing custom 3D models from raw vertex data or procedural generation.
- •Optimizing rendering performance for scenes with many identical objects using instanced meshes.
- •Generating dynamic or parametric 3D content based on real-time data or user interactions.

# Pro Tips
- 💡Always reuse geometries and materials where possible to reduce memory footprint and improve rendering performance, especially for identical objects.
- 💡When creating custom geometries, leverage BufferGeometry for optimal performance by directly working with typed arrays for attributes like position, normal, and UVs.
- 💡For scenes with thousands of similar objects, explore InstancedMesh to drastically reduce draw calls and enhance frame rates.

