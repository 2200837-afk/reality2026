
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Relativistic3DViewerProps {
  velocity: number;
  gamma: number;
}

export const Relativistic3DViewer: React.FC<Relativistic3DViewerProps> = ({ velocity, gamma }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f3ff, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Ship Geometry (Stylized Rocket)
    const shipGroup = new THREE.Group();
    
    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.5, 2, 4, 16);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2; // Horizontal
    shipGroup.add(body);

    // Fins
    const finGeo = new THREE.BoxGeometry(0.1, 1, 0.5);
    const finMat = new THREE.MeshPhongMaterial({ color: 0x00f3ff });
    for(let i=0; i<4; i++) {
        const fin = new THREE.Mesh(finGeo, finMat);
        fin.position.x = -1;
        fin.rotation.x = (i * Math.PI) / 2;
        fin.position.y = Math.sin(fin.rotation.x) * 0.5;
        fin.position.z = Math.cos(fin.rotation.x) * 0.5;
        shipGroup.add(fin);
    }

    // Glow
    const glowGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.5 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.x = -1.5;
    shipGroup.add(glow);

    scene.add(shipGroup);
    (shipRef as any).current = shipGroup;

    // Grid helper
    const grid = new THREE.GridHelper(20, 20, 0x1e2548, 0x151932);
    grid.position.y = -2;
    scene.add(grid);

    camera.position.z = 5;
    camera.position.y = 1;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (shipRef.current) {
          // IMPORTANT: Length contraction happens in the direction of motion (X-axis)
          // Scale X by 1/gamma
          shipRef.current.scale.x = 1 / gamma;
          
          // Hover effect
          shipRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
          
          // Subtle tilt based on velocity
          shipRef.current.rotation.z = (Math.PI / 2) + (velocity * 0.1);
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Update scale when gamma changes
  useEffect(() => {
    if (shipRef.current) {
      shipRef.current.scale.x = 1 / gamma;
    }
  }, [gamma]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};
