import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Layers, Split } from 'lucide-react';

interface MountingHole {
  diameter_mm: number;
  center: { x: number; y: number; z: number };
  center_rel?: { x: number; y: number; z: number };
  direction_rel?: { x: number; y: number; z: number };
  screw_fit?: string;
}

interface AssemblyPart {
  part_id: string;
  part_name: string;
  material_name: string;
  mass_kg: number;
  color?: { name: string; hex: string; accent: string };
  holes?: MountingHole[];
  tessellation?: {
    vertices: number[];
    indices: number[];
    vertices_count?: number;
    triangles_count?: number;
  };
}

interface AssemblyJoint {
  joint_id: string;
  part_a_name: string;
  part_b_name: string;
  nominal_diameter_mm: number;
  screw_fit: string;
  axial_gap_mm?: number;
  center_rel?: { x: number; y: number; z: number };
}

interface CADDataProps {
  metadata?: {
    file_name: string;
    material_name: string;
    is_assembly?: boolean;
    parts_count?: number;
    joints_count?: number;
  };
  assembly_tree?: Array<{
    part_id: string;
    part_name: string;
    material_name: string;
    mass_kg: number;
    mass_share_percent: number;
    holes_count: number;
    color?: { name: string; hex: string; accent: string };
  }>;
  parts?: AssemblyPart[];
  inter_part_joints?: AssemblyJoint[];
  physical_properties?: {
    mass_kg: number;
    volume_mm3: number;
    cog_mm: { x: number; y: number; z: number };
    cog_rel?: { x: number; y: number; z: number };
  };
  bounding_box_mm?: {
    length_x: number;
    width_y: number;
    height_z: number;
  };
  mounting_interface?: {
    overturning_moment_arm_h_cg_mm: number;
    holes: MountingHole[];
  };
  tessellation?: {
    has_mesh: boolean;
    vertices: number[];
    indices: number[];
    triangles_count: number;
    center_offset?: { x: number; y: number; z: number };
  };
}

export const CADViewer3D: FC<{ data: CADDataProps }> = ({ data }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetSphereRef = useRef<{ center: THREE.Vector3; radius: number }>({
    center: new THREE.Vector3(0, 0, 0),
    radius: 60,
  });

  const [viewMode, setViewMode] = useState<string>('ISO');
  const [showShakerTable, setShowShakerTable] = useState<boolean>(true);
  const [showFixturePlate, setShowFixturePlate] = useState<boolean>(false);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);

  // References to dynamic scene elements
  const shakerGroupRef = useRef<THREE.Group | null>(null);
  const fixtureGroupRef = useRef<THREE.Group | null>(null);
  const explodedPartsRef = useRef<Array<{ group: THREE.Group; basePos: THREE.Vector3; dir: THREE.Vector3 }>>([]);

  const isMultiPart = Boolean(data.parts && data.parts.length > 1);

  // Update exploded view positions in real-time
  useEffect(() => {
    if (explodedPartsRef.current.length > 0) {
      explodedPartsRef.current.forEach(({ group, basePos, dir }) => {
        group.position.copy(basePos).addScaledVector(dir, explodeFactor);
      });
    }
  }, [explodeFactor]);

  // Update Shaker & Fixture visibility
  useEffect(() => {
    if (shakerGroupRef.current) {
      shakerGroupRef.current.visible = showShakerTable;
    }
  }, [showShakerTable]);

  useEffect(() => {
    if (fixtureGroupRef.current) {
      fixtureGroupRef.current.visible = showFixturePlate;
    }
  }, [showFixturePlate]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Slate-50 clean background

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 10000);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Prevent context menu to allow seamless right-click panning
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    mountRef.current.addEventListener('contextmenu', preventContextMenu);

    // 3. OrbitControls (Left: Rotate, Wheel: Zoom, Right: Pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = true;
    controls.zoomSpeed = 1.25;
    controls.rotateSpeed = 0.85;
    controls.panSpeed = 0.95;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controlsRef.current = controls;

    // 4. Parça Geometrisi: GERÇEK 3D STEP TESSELLATION VEYA PARAMETRİK MODEL
    const partGroup = new THREE.Group();

    const lx = data.bounding_box_mm?.length_x || 120;
    const ly = data.bounding_box_mm?.width_y || 85;
    const lz = data.bounding_box_mm?.height_z || 45;
    const maxDim = Math.max(lx, ly, lz, 40);

    const hasRealMesh =
      data.tessellation &&
      data.tessellation.has_mesh &&
      data.tessellation.vertices &&
      data.tessellation.vertices.length > 0;

    explodedPartsRef.current = [];

    if (isMultiPart) {
      // Çoklu Parça Montajı: Her parçayı kendi havacılık rengiyle render et
      // Assembly CoG for outward explosion vectors
      const assyCog = data.physical_properties?.cog_rel
        ? new THREE.Vector3(data.physical_properties.cog_rel.x, data.physical_properties.cog_rel.y, data.physical_properties.cog_rel.z)
        : new THREE.Vector3(0, lz * 0.25, 0);

      data.parts!.forEach((part, partIdx) => {
        if (!part.tessellation || !part.tessellation.vertices || part.tessellation.vertices.length === 0) return;
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.Float32BufferAttribute(part.tessellation.vertices, 3));
        pGeo.setIndex(part.tessellation.indices);
        pGeo.computeVertexNormals();

        pGeo.computeBoundingBox();
        const pBox = pGeo.boundingBox;
        const partCenter = new THREE.Vector3();
        if (pBox) pBox.getCenter(partCenter);

        const colorHex = part.color?.hex ? parseInt(part.color.hex.replace('#', '0x'), 16) : 0x94a3b8;
        const partMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.35,
          metalness: 0.62,
          side: THREE.DoubleSide,
        });

        const pMesh = new THREE.Mesh(pGeo, partMat);
        pMesh.castShadow = true;
        pMesh.receiveShadow = true;
        pMesh.name = part.part_id;

        const edges = new THREE.EdgesGeometry(pGeo, 24);
        const edgeLine = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.65 })
        );

        const singlePartGroup = new THREE.Group();
        singlePartGroup.add(pMesh);
        singlePartGroup.add(edgeLine);

        // Calculate explode direction vector
        let explodeDir = new THREE.Vector3().subVectors(partCenter, assyCog);
        if (explodeDir.length() < 0.1) {
          // Fallback direction based on index if coincident
          const angle = (partIdx / data.parts!.length) * Math.PI * 2;
          explodeDir = new THREE.Vector3(Math.cos(angle), 0.5, Math.sin(angle));
        }
        explodeDir.normalize().multiplyScalar(maxDim * 0.85);

        explodedPartsRef.current.push({
          group: singlePartGroup,
          basePos: new THREE.Vector3(0, 0, 0),
          dir: explodeDir,
        });

        partGroup.add(singlePartGroup);
      });
    } else if (hasRealMesh) {
      // Tekil Katı Gövde: OpenCASCADE'den gelen gerçek 3D üçgen ağı (Tessellation)
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(data.tessellation!.vertices, 3));
      geo.setIndex(data.tessellation!.indices);
      geo.computeVertexNormals();

      const metalMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.32,
        metalness: 0.65,
        side: THREE.DoubleSide,
      });

      const partMesh = new THREE.Mesh(geo, metalMat);
      partMesh.castShadow = true;
      partMesh.receiveShadow = true;
      partGroup.add(partMesh);

      const edges = new THREE.EdgesGeometry(geo, 22);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.75 })
      );
      partGroup.add(edgeLine);
    } else {
      // Fallback: Parametrik Model (STEP yüklenmemişse)
      const baseGeo = new THREE.BoxGeometry(lx, lz * 0.35, ly);
      const metalMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.3,
        metalness: 0.6,
      });
      const baseMesh = new THREE.Mesh(baseGeo, metalMat);
      baseMesh.position.set(0, (lz * 0.35) / 2, 0);
      partGroup.add(baseMesh);

      const wallGeo = new THREE.BoxGeometry(lx * 0.25, lz, ly);
      const wallMesh = new THREE.Mesh(wallGeo, metalMat);
      wallMesh.position.set(-lx / 2 + (lx * 0.25) / 2, lz / 2, 0);
      partGroup.add(wallMesh);

      const bboxGeo = new THREE.BoxGeometry(lx, lz, ly);
      const bboxEdges = new THREE.EdgesGeometry(bboxGeo);
      const bboxLine = new THREE.LineSegments(
        bboxEdges,
        new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })
      );
      bboxLine.position.set(0, lz / 2, 0);
      partGroup.add(bboxLine);
    }

    // 5. Montaj Deliklerini Vurgula (Hassas Mavi Halkalar)
    const holes = data.mounting_interface?.holes || [];
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide });

    holes.forEach((h) => {
      const ringGeo = new THREE.RingGeometry(Math.max(0.6, h.diameter_mm * 0.28), h.diameter_mm * 0.58, 24);
      const ringMesh = new THREE.Mesh(ringGeo, holeMat);

      if (h.direction_rel) {
        const dir = new THREE.Vector3(h.direction_rel.x, h.direction_rel.y, h.direction_rel.z).normalize();
        ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
      } else {
        ringMesh.rotation.x = -Math.PI / 2;
      }

      let hx = 0;
      let hy = 0;
      let hz = 0;

      if (h.center_rel) {
        hx = h.center_rel.x;
        hy = h.center_rel.y;
        hz = h.center_rel.z;
      } else if (data.tessellation?.center_offset) {
        hx = h.center.x - data.tessellation.center_offset.x;
        hy = h.center.z - data.tessellation.center_offset.z;
        hz = h.center.y - data.tessellation.center_offset.y;
      } else {
        hx = Math.max(-lx / 2, Math.min(lx / 2, (h.center.x || 0) % (lx || 100)));
        hy = 1.0;
        hz = Math.max(-ly / 2, Math.min(ly / 2, (h.center.y || 0) % (ly || 100)));
      }

      ringMesh.position.set(hx, hy, hz);
      partGroup.add(ringMesh);
    });

    // 5.1. Parçalar Arası Ortak Bağlantı Noktaları (Amber Rings)
    const joints = data.inter_part_joints || [];
    const jointMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });

    joints.forEach((j) => {
      const jRadius = Math.max(1.0, (j.nominal_diameter_mm || 4.0) * 0.55);
      const ringGeo = new THREE.RingGeometry(jRadius * 0.6, jRadius * 1.35, 24);
      const ringMesh = new THREE.Mesh(ringGeo, jointMat);
      ringMesh.rotation.x = -Math.PI / 2;
      const jPos = j.center_rel || { x: 0, y: 0, z: 0 };
      ringMesh.position.set(jPos.x, jPos.y, jPos.z);
      partGroup.add(ringMesh);
    });

    // 6. Ağırlık Merkezi (CoG) Kırmızı Küre ve Eksenleri
    const cogPos = data.physical_properties?.cog_rel
      ? new THREE.Vector3(data.physical_properties.cog_rel.x, data.physical_properties.cog_rel.y, data.physical_properties.cog_rel.z)
      : new THREE.Vector3(0, lz * 0.25, 0);

    const cogGeo = new THREE.SphereGeometry(Math.max(2.2, maxDim * 0.04), 20, 20);
    const cogMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const cogMesh = new THREE.Mesh(cogGeo, cogMat);
    cogMesh.position.copy(cogPos);
    partGroup.add(cogMesh);

    const axesHelper = new THREE.AxesHelper(Math.max(12, maxDim * 0.22));
    axesHelper.position.copy(cogPos);
    partGroup.add(axesHelper);

    scene.add(partGroup);

    // Calculate part bounding box and sphere
    const partBox = new THREE.Box3().setFromObject(partGroup);
    const partMinY = partBox.min.y;

    // -----------------------------------------------------------------
    // 7. SHAKER SLIP TABLE & 50x50 mm M10 GRID
    // -----------------------------------------------------------------
    const shakerGroup = new THREE.Group();
    shakerGroupRef.current = shakerGroup;

    const tableDim = Math.max(350, Math.ceil((maxDim * 2.2) / 50) * 50);
    const tableThickness = 22;
    const tableTopY = partMinY - (showFixturePlate ? 18.0 : 3.0);

    // Main steel slip table body
    const tableGeo = new THREE.BoxGeometry(tableDim, tableThickness, tableDim);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark slate tool-steel
      metalness: 0.85,
      roughness: 0.28,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, tableTopY - tableThickness / 2, 0);
    tableMesh.receiveShadow = true;
    shakerGroup.add(tableMesh);

    // Slip table beveled border wireframe
    const tableEdges = new THREE.EdgesGeometry(tableGeo);
    const tableEdgeLine = new THREE.LineSegments(
      tableEdges,
      new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 })
    );
    tableEdgeLine.position.copy(tableMesh.position);
    shakerGroup.add(tableEdgeLine);

    // 50x50 mm M10 threaded hole grid
    const pitch = 50.0;
    const halfSpan = tableDim / 2 - 25;
    const holeRingMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide });
    const holeCenterMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    for (let gx = -halfSpan; gx <= halfSpan; gx += pitch) {
      for (let gz = -halfSpan; gz <= halfSpan; gz += pitch) {
        // Outer threaded chamfer
        const holeGeo = new THREE.RingGeometry(4.2, 5.8, 16);
        const hMesh = new THREE.Mesh(holeGeo, holeRingMat);
        hMesh.rotation.x = -Math.PI / 2;
        hMesh.position.set(gx, tableTopY + 0.1, gz);
        shakerGroup.add(hMesh);

        // Inner tapped bore
        const centerCircle = new THREE.CircleGeometry(4.1, 16);
        const cMesh = new THREE.Mesh(centerCircle, holeCenterMat);
        cMesh.rotation.x = -Math.PI / 2;
        cMesh.position.set(gx, tableTopY + 0.05, gz);
        shakerGroup.add(cMesh);
      }
    }
    shakerGroup.visible = showShakerTable;
    scene.add(shakerGroup);

    // -----------------------------------------------------------------
    // 8. TEST FİKTÜRÜ ADAPTÖR PLAKASI (FIXTURE BASEPLATE)
    // -----------------------------------------------------------------
    const fixtureGroup = new THREE.Group();
    fixtureGroupRef.current = fixtureGroup;

    const fixWidth = Math.max(lx + 40, 140);
    const fixDepth = Math.max(ly + 40, 110);
    const fixThick = 15;
    const fixTopY = partMinY - 1.0;

    const fixGeo = new THREE.BoxGeometry(fixWidth, fixThick, fixDepth);
    const fixMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Machined 7075-T6 aluminum
      metalness: 0.75,
      roughness: 0.35,
    });
    const fixMesh = new THREE.Mesh(fixGeo, fixMat);
    fixMesh.position.set(0, fixTopY - fixThick / 2, 0);
    fixMesh.receiveShadow = true;
    fixtureGroup.add(fixMesh);

    const fixEdges = new THREE.EdgesGeometry(fixGeo);
    const fixEdgeLine = new THREE.LineSegments(
      fixEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 })
    );
    fixEdgeLine.position.copy(fixMesh.position);
    fixtureGroup.add(fixEdgeLine);

    fixtureGroup.visible = showFixturePlate;
    scene.add(fixtureGroup);

    // -----------------------------------------------------------------
    // 9. Camera Fit & Lighting
    // -----------------------------------------------------------------
    const totalBox = new THREE.Box3().setFromObject(scene);
    const sphere = new THREE.Sphere();
    totalBox.getBoundingSphere(sphere);
    const radius = Math.max(sphere.radius, 25);
    targetSphereRef.current = { center: sphere.center, radius };

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 1.2);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight1.position.set(sphere.center.x + radius * 2.5, sphere.center.y + radius * 3.5, sphere.center.z + radius * 2.5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.7);
    dirLight2.position.set(sphere.center.x - radius * 2.5, sphere.center.y + radius * 2.0, sphere.center.z - radius * 2.5);
    scene.add(dirLight2);

    controls.target.copy(sphere.center);
    controls.minDistance = Math.max(2.0, radius * 0.15);
    controls.maxDistance = Math.max(300, radius * 15);

    const fov = camera.fov * (Math.PI / 180);
    const fitDist = radius / Math.sin(fov / 2);

    camera.position.set(
      sphere.center.x + fitDist * 0.75,
      sphere.center.y + fitDist * 0.65,
      sphere.center.z + fitDist * 0.95
    );
    camera.lookAt(sphere.center);
    controls.update();

    // 10. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('contextmenu', preventContextMenu);
      }
      controls.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [data]);

  const setCameraView = (mode: 'ISO' | 'TOP' | 'FRONT' | 'SIDE') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const { center, radius } = targetSphereRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    setViewMode(mode);
    controls.target.copy(center);

    const fov = camera.fov * (Math.PI / 180);
    const fitDist = (radius / Math.sin(fov / 2)) * 1.15;

    if (mode === 'ISO') {
      camera.position.set(center.x + fitDist * 0.75, center.y + fitDist * 0.65, center.z + fitDist * 0.95);
    } else if (mode === 'TOP') {
      camera.position.set(center.x, center.y + fitDist * 1.35, center.z + 0.001);
    } else if (mode === 'FRONT') {
      camera.position.set(center.x, center.y, center.z + fitDist * 1.35);
    } else if (mode === 'SIDE') {
      camera.position.set(center.x + fitDist * 1.35, center.y, center.z);
    }
    camera.lookAt(center);
    controls.update();
  };

  const handleZoom = (direction: 'IN' | 'OUT') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    if (direction === 'IN') {
      controls.dollyIn(1.3);
    } else {
      controls.dollyOut(1.3);
    }
    controls.update();
  };

  const resetView = () => {
    setCameraView('ISO');
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100 flex items-center justify-center select-none" ref={mountRef}>
      {/* Sol Üst: HUD Parça Bilgi Kartı */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-md font-mono pointer-events-none space-y-1 z-10 max-w-xs">
        {data.metadata?.is_assembly && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300 font-sans tracking-wide">
              ÇOKLU MONTAJ ({data.metadata.parts_count || data.parts?.length || 2} PARÇA)
            </span>
            {data.inter_part_joints && data.inter_part_joints.length > 0 && (
              <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 font-sans">
                {data.inter_part_joints.length}x Ortak Cıvata
              </span>
            )}
          </div>
        )}
        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="truncate">{data.metadata?.file_name || 'sample_bracket.step'}</span>
          {data.tessellation?.has_mesh && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200 font-sans shrink-0">
              Gerçek 3D Mesh
            </span>
          )}
        </div>
        <div className="text-slate-600 text-[11px]">
          {data.metadata?.is_assembly ? 'Bileşik Kütle:' : 'Kütle:'} <b className="text-slate-900">{data.physical_properties?.mass_kg?.toFixed(3) || '0.385'} kg</b>
        </div>
        <div className="text-slate-600 text-[11px]">
          Zarf: {data.bounding_box_mm?.length_x || 120}×{data.bounding_box_mm?.width_y || 85}×{data.bounding_box_mm?.height_z || 45} mm
        </div>
        <div className="text-red-600 font-semibold text-[11px]">
          ● {data.metadata?.is_assembly ? 'Bileşik CoG:' : 'CoG:'} X={data.physical_properties?.cog_mm?.x || 0}, Y={data.physical_properties?.cog_mm?.y || 0}, Z={data.physical_properties?.cog_mm?.z || 22.5} mm
        </div>
        <div className="text-blue-600 font-semibold text-[11px]">
          ● Taban Arayüzü: {data.mounting_interface?.holes?.length || 4}x DIN 912 Delik
        </div>
        {data.inter_part_joints && data.inter_part_joints.length > 0 && (
          <div className="text-amber-600 font-semibold text-[11px]">
            ● Parçalar Arası: {data.inter_part_joints.length}x Cıvata Eşleşmesi
          </div>
        )}
      </div>

      {/* Sağ Üst: Kamera ve Sahne Kontrol Çubuğu */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md z-10">
        {/* Shaker Grid Toggle */}
        <button
          onClick={() => setShowShakerTable(!showShakerTable)}
          title={showShakerTable ? 'Shaker Tablasını Gizle' : 'Shaker Tablasını Göster (50x50 mm Izgara)'}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
            showShakerTable ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Shaker</span>
        </button>

        {/* Fixture Plate Toggle */}
        <button
          onClick={() => setShowFixturePlate(!showFixturePlate)}
          title={showFixturePlate ? 'Fikstür Plakasını Gizle' : 'Fikstür Taban Plakasını Göster'}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
            showFixturePlate ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Fikstür</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />

        <button
          onClick={() => handleZoom('IN')}
          title="Yakınlaştır (Zoom In)"
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('OUT')}
          title="Uzaklaştır (Zoom Out)"
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={() => setCameraView('ISO')}
          className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
            viewMode === 'ISO' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          İZO
        </button>
        <button
          onClick={() => setCameraView('TOP')}
          className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
            viewMode === 'TOP' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          ÜST
        </button>
        <button
          onClick={() => setCameraView('FRONT')}
          className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
            viewMode === 'FRONT' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          ÖN
        </button>
        <button
          onClick={() => setCameraView('SIDE')}
          className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
            viewMode === 'SIDE' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          YAN
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={resetView}
          title="Görünümü Sıfırla"
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alt Orta: Çoklu Montaj Patlatılmış Görünüm (Exploded View) Kaydırıcısı */}
      {isMultiPart && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-300 shadow-xl z-20 flex items-center gap-3 font-sans">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <Split className="w-4 h-4 text-amber-600" />
            <span>Patlatılmış Görünüm:</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            className="w-36 accent-amber-600 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">
            {Math.round(explodeFactor * 100)}%
          </span>
          {explodeFactor > 0 && (
            <button
              onClick={() => setExplodeFactor(0)}
              className="text-[10px] text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer ml-1"
            >
              Sıfırla
            </button>
          )}
        </div>
      )}

      {/* Sağ Alt: CAD Kontrol Kılavuzu */}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-medium border border-slate-200 shadow-xs pointer-events-none z-10 flex items-center gap-3">
        <span><b>Sol Tık:</b> Döndür</span>
        <span>·</span>
        <span><b>Tekerlek:</b> Yakınlaş</span>
        <span>·</span>
        <span><b>Sağ Tık:</b> Kaydır</span>
      </div>
    </div>
  );
};
