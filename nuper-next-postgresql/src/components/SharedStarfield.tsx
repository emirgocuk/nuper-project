'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const NUM_STARS = 30;

const SharedStarfield = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [stars, setStars] = useState<{ top: number; left: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate stars only on client side to avoid hydration mismatch
        const newStars = Array.from({ length: NUM_STARS }).map(() => ({
            top: Math.random() * 90,
            left: Math.random() * 100,
            size: Math.random() * 2 + 2,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 8
        }));
        setStars(newStars);
    }, []);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const particlesCount = 7000;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 800;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff, size: 0.25, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.6
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        let animationId: number;
        const clock = new THREE.Clock();
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            particleSystem.rotation.y = elapsedTime * 0.02;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (currentMount) {
                const width = currentMount.clientWidth;
                const height = currentMount.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            // Dispose of Three.js resources
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="absolute inset-0 w-full h-full -z-10 bg-transparent">
            {stars.map((star, i) => (
                <span
                    key={i}
                    className="starfield-star"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`
                    }}
                />
            ))}
        </div>
    );
}

export default SharedStarfield;
