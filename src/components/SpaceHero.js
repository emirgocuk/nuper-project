import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper function to create a texture with reliable shades of blue
const createPlanetTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Create a base color with a corporate blue gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0d324d'); // Dark Navy Blue
    gradient.addColorStop(1, '#2a6f97'); // A lighter, reliable blue
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle, light blue swirling clouds
    for (let i = 0; i < 50; i++) {
        context.beginPath();
        context.arc(
            Math.random() * canvas.width, 
            Math.random() * canvas.height, 
            Math.random() * 100, 
            0, 
            Math.PI * 2
        );
        context.fillStyle = `rgba(135, 206, 235, ${Math.random() * 0.08})`; // Light Sky Blue
        context.fill();
    }
    
    // Add Craters
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 20 + 5;

        // Dark base for the crater
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.fill();

        // Lighter rim highlight on one side
        context.beginPath();
        context.arc(x - radius * 0.1, y - radius * 0.1, radius, Math.PI * 1.2, Math.PI * 1.8);
        context.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        context.lineWidth = 2;
        context.stroke();
    }

    // Add fine noise
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
        context.fillRect(x, y, 1, 1);
    }

    return new THREE.CanvasTexture(canvas);
};

// Helper function to create a glowing blue texture for the rings
const createRingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0.0, 'rgba(173, 216, 230, 0.0)');  // Transparent edge
    gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.8)');    // Bright Blue center
    gradient.addColorStop(1.0, 'rgba(173, 216, 230, 0.0)'); // Transparent edge

    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 256);

    return new THREE.CanvasTexture(canvas);
}


const SpaceHero = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- Scene, Camera, and Renderer Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 90);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Set scene background to black
        // scene.background = new THREE.Color(0x000000); // Bunu kaldırın veya yorum satırı yapın
        scene.background = null; // Şeffaf yapar

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(10, 20, 30);
        scene.add(directionalLight);
        
        // --- Planet and Rings Group ---
        const planetGroup = new THREE.Group();
        scene.add(planetGroup);
        
        // The Planet
        const planetGeometry = new THREE.SphereGeometry(15, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({
            map: createPlanetTexture(),
            metalness: 0.1,
            roughness: 0.8
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planetGroup.add(planet);

        // --- Ring 1 (The original) ---
        const ring1Group = new THREE.Group();
        planetGroup.add(ring1Group);
        const ring1Geometry = new THREE.RingGeometry(22, 23, 128); 
        const ring1Material = new THREE.MeshBasicMaterial({
            map: createRingTexture(), side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending,
        });
        const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
        ring1.rotation.x = Math.PI * 0.5;
        ring1Group.add(ring1);
        
        const stars1 = createStarField(22.5, 200);
        ring1Group.add(stars1);
        
        // --- Ring 2 (New Inner Ring) ---
        const ring2Group = new THREE.Group();
        planetGroup.add(ring2Group);
        const ring2Geometry = new THREE.RingGeometry(18, 19, 128);
        const ring2 = new THREE.Mesh(ring2Geometry, ring1Material); // Re-use material
        ring2.rotation.x = Math.PI * 0.5;
        ring2.rotation.z = Math.PI * 0.1;
        ring2Group.add(ring2);
        
        const stars2 = createStarField(18.5, 150);
        ring2Group.add(stars2);
        
        // --- Ring 3 (New Outer Ring) ---
        const ring3Group = new THREE.Group();
        planetGroup.add(ring3Group);
        const ring3Geometry = new THREE.RingGeometry(26, 27, 128);
        const ring3 = new THREE.Mesh(ring3Geometry, ring1Material); // Re-use material
        ring3.rotation.x = Math.PI * 0.5;
        ring3.rotation.y = Math.PI * 0.2;
        ring3Group.add(ring3);
        
        const stars3 = createStarField(26.5, 250);
        ring3Group.add(stars3);


        // --- Floating Particles (background nebula) ---
        const particlesCount = 3000;
        const positions = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 300;
        }
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff, size: 0.2, transparent: true, blending: THREE.AdditiveBlending
        });
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Planet and base ring rotation
            planetGroup.rotation.x = elapsedTime * 0.05;
            planetGroup.rotation.y = elapsedTime * 0.1;
            
            // Faster, independent rotation for new rings
            ring2Group.rotation.y = elapsedTime * 0.15;
            ring3Group.rotation.y = elapsedTime * -0.12;

            particleSystem.rotation.y = elapsedTime * 0.02;

            // Camera is now static, looking at the center
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        animate();
        
        // --- Handle Window Resize ---
        const handleResize = () => {
            if (mountRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };
        window.addEventListener('resize', handleResize);

        // --- Cleanup on Component Unmount ---
        return () => {
            cancelAnimationFrame(animationId);
            // Removed mousemove event listener cleanup
            if (currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden"> {/* bg-black kaldırıldı */}
            <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />
            {/* ...gerekirse diğer içerikler... */}
        </div>
    );
};

function createStarField(radius, count) {
    const starMaterial = new THREE.PointsMaterial({
        color: 0x00BFFF,
        size: 0.15,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
    });
    const starPositions = [];
    for(let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.2; // Tightly clustered vertically
        starPositions.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    return new THREE.Points(starGeometry, starMaterial);
}

export default function App() {
    return (
        <main>
            <style>{`
                body {
                    background-color: black;
                }
            `}</style>
            <SpaceHero />
        </main>
    );
}
