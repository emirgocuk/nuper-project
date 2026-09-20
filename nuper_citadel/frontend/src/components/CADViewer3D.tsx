import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MountingHole {
  diameter_mm: number;
  center: { x: number; y: number; z: number };
  center_rel?: { x: number; y: number; z: number };
  direction_rel?: { x: number; y: number; z: number };
  screw_fit?: string;
}

interface CADDataProps {
  metadata?: {
    file_name: string;
    material_name: string;
  };
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
    controls.screenSpacePanning = true; // Right-click pans in screen plane (up/down/left/right)
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

    if (hasRealMesh) {
      // OpenCASCADE'den gelen gerçek 3D üçgen ağı (Tessellation)
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(data.tessellation!.vertices, 3));
      geo.setIndex(data.tessellation!.indices);
      geo.computeVertexNormals();

      // Saten Havacılık Alüminyum Malzemesi (6061-T6 Anodized Milled Look)
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

      // Hassas CAD Kenar Çizgileri (SolidWorks / NX Shaded with Edges)
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

    // 5. Montaj Deliklerini Vurgula (Hassas Mavi Halkalar - Yüzey Normaline Uyumlu)
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

    // 6. Ağırlık Merkezi (CoG) Kırmızı Hassas Küresi ve Eksenleri
    const cogPos = data.physical_properties?.cog_rel
      ? new THREE.Vector3(data.physical_properties.cog_rel.x, data.physical_properties.cog_rel.y, data.physical_properties.cog_rel.z)
      : new THREE.Vector3(0, lz * 0.25, 0);

    const cogGeo = new THREE.SphereGeometry(Math.max(1.8, maxDim * 0.035), 20, 20);
    const cogMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const cogMesh = new THREE.Mesh(cogGeo, cogMat);
    cogMesh.position.copy(cogPos);
    partGroup.add(cogMesh);

    const axesHelper = new THREE.AxesHelper(Math.max(12, maxDim * 0.22));
    axesHelper.position.copy(cogPos);
    partGroup.add(axesHelper);

    scene.add(partGroup);

    // 7. Parçanın Gerçek Boyutuna Göre Dinamik Işıklandırma ve Zemin Izgarası
    const box = new THREE.Box3().setFromObject(partGroup);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const radius = Math.max(sphere.radius, 15);
    targetSphereRef.current = { center: sphere.center, radius };

    const grid = new THREE.GridHelper(radius * 3.5, 24, 0x94a3b8, 0xe2e8f0);
    grid.position.set(sphere.center.x, box.min.y - 1.0, sphere.center.z);
    scene.add(grid);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 1.1);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(sphere.center.x + radius * 2.5, sphere.center.y + radius * 3.5, sphere.center.z + radius * 2.5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.7);
    dirLight2.position.set(sphere.center.x - radius * 2.5, sphere.center.y + radius * 2.0, sphere.center.z - radius * 2.5);
    scene.add(dirLight2);

    // 8. Kamerayı Modele Göre Kusursuz Odakla (Textbook CAD Fit)
    controls.target.copy(sphere.center);
    controls.minDistance = Math.max(1.5, radius * 0.15);
    controls.maxDistance = Math.max(200, radius * 15);

    const fov = camera.fov * (Math.PI / 180);
    const fitDist = radius / Math.sin(fov / 2);

    camera.position.set(
      sphere.center.x + fitDist * 0.75,
      sphere.center.y + fitDist * 0.6,
      sphere.center.z + fitDist * 0.95
    );
    camera.lookAt(sphere.center);
    controls.update();

    // 9. Animation Loop
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

  // Kamera Bakış Açıları (View Angles)
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
      camera.position.set(center.x + fitDist * 0.75, center.y + fitDist * 0.6, center.z + fitDist * 0.95);
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
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-md font-mono pointer-events-none space-y-1 z-10">
        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          {data.metadata?.file_name || 'sample_bracket.step'}
          {data.tessellation?.has_mesh && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200 font-sans">
              Gerçek 3D Mesh
            </span>
          )}
        </div>
        <div className="text-slate-600 text-[11px]">
          Kütle: <b className="text-slate-900">{data.physical_properties?.mass_kg?.toFixed(3) || '0.385'} kg</b>
        </div>
        <div className="text-slate-600 text-[11px]">
          Zarf: {data.bounding_box_mm?.length_x || 120}×{data.bounding_box_mm?.width_y || 85}×{data.bounding_box_mm?.height_z || 45} mm
        </div>
        <div className="text-red-600 font-semibold text-[11px]">
          ● CoG: X={data.physical_properties?.cog_mm?.x || 0}, Y={data.physical_properties?.cog_mm?.y || 0}, Z={data.physical_properties?.cog_mm?.z || 22.5} mm
        </div>
        <div className="text-blue-600 font-semibold text-[11px]">
          ● Montaj: {data.mounting_interface?.holes?.length || 4}x DIN 912 Delik
        </div>
      </div>

      {/* Sağ Üst: Kamera Kontrol Çubuğu (CAD Orbit Controls Dock) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md z-10">
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

      {/* Sağ Alt: CAD Kontrol Kılavuzu */}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-medium border border-slate-200 shadow-xs pointer-events-none z-10 flex items-center gap-3">
        <span><b>Sol Tık:</b> Döndür (Orbit)</span>
        <span>·</span>
        <span><b>Tekerlek:</b> Yaklaş / Uzaklaş (Zoom)</span>
        <span>·</span>
        <span><b>Sağ Tık:</b> Kaydır (Pan)</span>
      </div>
    </div>
  );
};
