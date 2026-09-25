'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Box, Flame, Crosshair, RefreshCw, Maximize2 } from 'lucide-react';

type RenderMode = 'SOLID' | 'WIREFRAME' | 'FEA_STRESS';

export function CitadelCadViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('SOLID');
  const [showCoG, setShowCoG] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Three.js nesneleri referansları
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const cogGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Mouse kontrol referansları
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Sahne & Kamera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a11);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(130, 95, 150);
    camera.lookAt(0, 10, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Işıklar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfefefe, 1.4);
    dirLight1.position.set(80, 120, 90);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 0.6); // Amber vurgulu dolgu ışığı
    dirLight2.position.set(-80, -40, -60);
    scene.add(dirLight2);

    // 4. CAD Izgara Zemin
    const gridHelper = new THREE.GridHelper(160, 16, 0xf59e0b, 0x1f2937);
    gridHelper.position.y = -15;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // 5. Procedural Aviyonik Braket Geometrisi (Machined Aerospace Bracket)
    const mainGroup = new THREE.Group();
    meshGroupRef.current = mainGroup;
    scene.add(mainGroup);

    // Taban Flanşı (Base Mounting Flange)
    const baseGeo = new THREE.BoxGeometry(90, 8, 60, 6, 2, 4);
    baseGeo.translate(0, -10, 0);

    // Dikey Aviyonik Duvar (Vertical Spine with pockets)
    const wallGeo = new THREE.BoxGeometry(80, 38, 12, 6, 4, 2);
    wallGeo.translate(0, 10, -18);

    // Destek Kanatçıkları / Kaburgalar (Stiffener Ribs)
    const rib1Geo = new THREE.BoxGeometry(6, 32, 28, 2, 3, 2);
    rib1Geo.translate(-30, 7, 0);

    const rib2Geo = new THREE.BoxGeometry(6, 32, 28, 2, 3, 2);
    rib2Geo.translate(30, 7, 0);

    // Silindirik Montaj Boss'ları (4x M4 Montaj Delik Çıkıntıları)
    const bossGeo1 = new THREE.CylinderGeometry(5.5, 5.5, 10, 16);
    bossGeo1.translate(-32, -10, -18);

    const bossGeo2 = new THREE.CylinderGeometry(5.5, 5.5, 10, 16);
    bossGeo2.translate(32, -10, -18);

    const bossGeo3 = new THREE.CylinderGeometry(5.5, 5.5, 10, 16);
    bossGeo3.translate(-32, -10, 18);

    const bossGeo4 = new THREE.CylinderGeometry(5.5, 5.5, 10, 16);
    bossGeo4.translate(32, -10, 18);

    // Parça Geometrilerini Birleştir
    const geometries = [baseGeo, wallGeo, rib1Geo, rib2Geo, bossGeo1, bossGeo2, bossGeo3, bossGeo4];
    
    // Malzemeler
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x8a99ad,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
    });

    // FEA Gerilme Haritası Malzemesi (Vertex Colors Simülasyonu)
    const feaMat = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.2,
      vertexColors: true,
    });

    // Geometrileri birleştirip sahneye ekle
    geometries.forEach((geo, idx) => {
      // FEA Vertex Color Renklendirmesi (Gerilme Konsantrasyonu)
      const count = geo.attributes.position.count;
      const colors = new Float32Array(count * 3);
      const pos = geo.attributes.position;

      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        const z = pos.getZ(i);
        // Gerilme eşiği: Duvar köklerinde ve delik çevrelerinde gerilme yükselir
        const stress = Math.min(1, Math.max(0, (y + 12) / 35 + (z < 0 ? 0.3 : 0)));
        // Mavi (0,0.4,1) -> Sarı (1,0.8,0) -> Kırmızı (0.9,0.1,0.1)
        if (stress < 0.5) {
          const t = stress / 0.5;
          colors[i * 3] = t * 0.9;
          colors[i * 3 + 1] = 0.4 + t * 0.4;
          colors[i * 3 + 2] = 1 - t * 0.8;
        } else {
          const t = (stress - 0.5) / 0.5;
          colors[i * 3] = 0.9 + t * 0.1;
          colors[i * 3 + 1] = 0.8 - t * 0.7;
          colors[i * 3 + 2] = 0.2 - t * 0.2;
        }
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mesh = new THREE.Mesh(geo, solidMat);
      mesh.name = `part_${idx}`;
      mainGroup.add(mesh);
    });

    // 6. Ağırlık Merkezi (CoG: 5.2, 0.0, 22.5) Göstergesi
    const cogGroup = new THREE.Group();
    cogGroup.position.set(5.2, 0, 8); // Görsel merkezleme
    cogGroupRef.current = cogGroup;
    scene.add(cogGroup);

    // CoG Küresi
    const cogSphereGeo = new THREE.SphereGeometry(2.5, 16, 16);
    const cogSphereMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const cogSphere = new THREE.Mesh(cogSphereGeo, cogSphereMat);
    cogGroup.add(cogSphere);

    // CoG 3D Eksen Okları (Kırmızı X, Yeşil Y, Mavi Z)
    const axesHelper = new THREE.AxesHelper(14);
    cogGroup.add(axesHelper);

    // 7. Mouse Sürükleme ile Döndürme Olayları
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !mainGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      mainGroup.rotation.y += deltaX * 0.01;
      mainGroup.rotation.x += deltaY * 0.01;
      if (cogGroup) {
        cogGroup.rotation.y = mainGroup.rotation.y;
        cogGroup.rotation.x = mainGroup.rotation.x;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.12;
      cameraRef.current.position.z = Math.max(70, Math.min(260, cameraRef.current.position.z));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 8. Render Döngüsü
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current && mainGroup) {
        mainGroup.rotation.y += 0.006;
        if (cogGroup) {
          cogGroup.rotation.y = mainGroup.rotation.y;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Gözlemcisi
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Render Modu Değiştiğinde Malzemeleri Güncelle
  useEffect(() => {
    if (!meshGroupRef.current) return;

    meshGroupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        if (renderMode === 'SOLID') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x8a99ad,
            metalness: 0.85,
            roughness: 0.25,
            wireframe: false,
          });
        } else if (renderMode === 'WIREFRAME') {
          child.material = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            wireframe: true,
          });
        } else if (renderMode === 'FEA_STRESS') {
          child.material = new THREE.MeshStandardMaterial({
            roughness: 0.4,
            metalness: 0.1,
            vertexColors: true,
          });
        }
      }
    });
  }, [renderMode]);

  // CoG Gösterim Durumu Değiştiğinde
  useEffect(() => {
    if (cogGroupRef.current) {
      cogGroupRef.current.visible = showCoG;
    }
  }, [showCoG]);

  const resetView = () => {
    if (!cameraRef.current || !meshGroupRef.current || !cogGroupRef.current) return;
    cameraRef.current.position.set(130, 95, 150);
    cameraRef.current.lookAt(0, 10, 0);
    meshGroupRef.current.rotation.set(0, 0, 0);
    cogGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#070A11] border border-amber-500/30 overflow-hidden shadow-2xl">
      {/* Üst CAD Telemetri Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0B0F19]/90 border-b border-amber-500/20 font-mono text-xs z-20 relative">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Box className="w-4 h-4 text-amber-400" />
          <span className="uppercase tracking-wider">OPENCASCADE 3D CAD B-REP GÖRÜNTÜLEYİCİ</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <span>STEP // AS9100 MANIFOLD: <span className="text-emerald-400 font-bold">GEÇERLİ</span></span>
          <span className="hidden sm:inline">TOL: <span className="text-white">±0.01 mm</span></span>
        </div>
      </div>

      {/* 3D Canvas Konteyneri */}
      <div
        ref={containerRef}
        className="w-full h-[460px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Sol Alt: Canlı CAD Geometri HUD Bilgi Kartı */}
      <div className="absolute bottom-4 left-4 z-20 p-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 font-mono text-xs space-y-1.5 pointer-events-none select-none max-w-xs sm:max-w-sm">
        <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest border-b border-white/10 pb-1 flex justify-between">
          <span>PARÇA: sample_bracket.step</span>
          <span className="text-gray-400">AL 6061-T6</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-[11px] text-gray-300">
          <div>KÜTLE: <span className="text-white font-bold">0.385 kg</span></div>
          <div>HACİM: <span className="text-white font-bold">142.590 mm³</span></div>
          <div>DELİK: <span className="text-white font-bold">4x M4 (ISO 273)</span></div>
          <div>BOYUT: <span className="text-white font-bold">120x85x45 mm</span></div>
        </div>
        <div className="text-[10px] text-gray-400 pt-0.5">
          AĞIRLIK MERKEZİ (CoG): <span className="text-red-400 font-bold">(5.2, 0.0, 22.5) mm</span>
        </div>
      </div>

      {/* Sağ Üst / Alt: İnteraktif Kontrol Butonları */}
      <div className="absolute top-16 right-4 z-20 flex flex-col gap-2 font-mono text-xs">
        {/* Mod Seçiciler */}
        <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            onClick={() => setRenderMode('SOLID')}
            className={`px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition-all ${
              renderMode === 'SOLID'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Katı Metal</span>
          </button>

          <button
            onClick={() => setRenderMode('WIREFRAME')}
            className={`px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition-all ${
              renderMode === 'WIREFRAME'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>CAD Tel Kafes</span>
          </button>

          <button
            onClick={() => setRenderMode('FEA_STRESS')}
            className={`px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition-all ${
              renderMode === 'FEA_STRESS'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>FEA Gerilme</span>
          </button>
        </div>

        {/* CoG ve Döndürme Kontrolleri */}
        <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            onClick={() => setShowCoG(!showCoG)}
            className={`px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition-all ${
              showCoG
                ? 'text-red-400 font-bold bg-red-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>CoG {showCoG ? 'Açık' : 'Kapalı'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition-all ${
              autoRotate
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Dönüş {autoRotate ? 'Açık' : 'Durdu'}</span>
          </button>

          <button
            onClick={resetView}
            className="px-3 py-1.5 rounded-lg text-left text-gray-400 hover:text-white flex items-center gap-2 transition-all"
            title="Kamerayı Sıfırla"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Alt Kullanım Rehberi */}
      <div className="px-4 py-2 bg-[#0B0F19]/80 border-t border-white/5 font-mono text-[10px] text-gray-400 flex flex-wrap items-center justify-between gap-2">
        <span>Fare Sol Tuş: 360° Çevir • Tekerlek: Yakınlaş/Uzaklaş</span>
        <span className="text-amber-400 font-bold">GERÇEK ZAMANLI ÜÇ BOYUTLU İNCELEME KONSOLU</span>
      </div>
    </div>
  );
}
