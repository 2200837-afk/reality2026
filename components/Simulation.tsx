
import React, { useState, useEffect, useRef } from 'react';
import { generatePhysicsExplanation } from '../services/geminiService';
import { Button } from './Button';
import { Info, Play, Pause, RotateCcw, Camera, CameraOff, Rocket } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { usePageTracking, useARTracking, useAnalytics } from '../contexts/AnalyticsContext';

export const Simulation: React.FC<{ velocity: number, setVelocity: (v: number) => void, forceAR?: boolean }> = ({ velocity, setVelocity, forceAR = false }) => {
  // Fix: Property 'env' does not exist on type 'ImportMeta' - cast to any
  const asset = (path: string) => (import.meta as any).env.BASE_URL + path.replace(/^\.\//, '');
  const [isPlaying, setIsPlaying] = useState(true);
  const [explanation, setExplanation] = useState<string>("");
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [arMode, setArMode] = useState(forceAR);

  usePageTracking("WarpDriveSandbox");
  useARTracking("WarpDriveSandbox", arMode);
  const { trackSlider, trackClick } = useAnalytics();

  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const gamma = 1 / Math.sqrt(1 - velocity * velocity);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene(); sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer; mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404040, 2));
    // Fix: Property 'set' does not exist on type 'PointLight' - use position.set
    const pLight = new THREE.PointLight(0x00f3ff, 2, 50);
    pLight.position.set(0, 5, 5);
    scene.add(pLight);

    const shipGroup = new THREE.Group();
    new GLTFLoader().load(asset('./model/multi_universe_space_ship_3d_model.glb'), (gltf) => {
        const s = gltf.scene; s.scale.set(0.8, 0.8, 0.8); shipGroup.add(s); scene.add(shipGroup); shipRef.current = shipGroup;
        if (gltf.animations?.length) {
            const mx = new THREE.AnimationMixer(s); gltf.animations.forEach(c => mx.clipAction(c).play());
            (shipGroup as any).mixer = mx;
        }
    }, undefined, () => {
        shipGroup.add(new THREE.Mesh(new THREE.ConeGeometry(0.5, 3, 32).rotateX(Math.PI/2), new THREE.MeshStandardMaterial({ color: 0xcccccc })));
        scene.add(shipGroup); shipRef.current = shipGroup;
    });

    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const pos = new Float32Array(starCount * 3);
    const orig = new Float32Array(starCount * 3);
    for(let i = 0; i < starCount * 3; i+=3) {
        pos[i] = orig[i] = (Math.random() - 0.5) * 100;
        pos[i+1] = orig[i+1] = (Math.random() - 0.5) * 100;
        pos[i+2] = orig[i+2] = (Math.random() - 0.5) * 100;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starsGeo.userData = { originalPositions: orig };
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.15, color: 0xffffff }));
    scene.add(stars); starsRef.current = stars;

    const controls = new OrbitControls(camera, renderer.domElement); controlsRef.current = controls;

    const animate = () => {
        if (controlsRef.current) controlsRef.current.update();
        if (shipRef.current) {
            shipRef.current.scale.set(1, 1, 1/gamma);
            shipRef.current.position.y = Math.sin(Date.now()*0.001) * 0.1;
            if ((shipRef.current as any).mixer) (shipRef.current as any).mixer.update(0.016 * (1 + velocity * 2));
        }
        if (starsRef.current) {
            const p = starsRef.current.geometry.attributes.position.array as Float32Array;
            const o = starsRef.current.geometry.userData.originalPositions;
            const s = 0.05 + (velocity * 2.0);
            for(let i = 0; i < p.length; i+=3) {
                p[i+2] += s; if (p[i+2] > 20) p[i+2] = -80;
                const c = 1.0 - (velocity * 0.8); p[i] = o[i] * c; p[i+1] = o[i+1] * c;
            }
            starsRef.current.geometry.attributes.position.needsUpdate = true;
        }
        renderer.render(scene, camera); requestAnimationFrame(animate);
    };
    animate();
    return () => renderer.dispose();
  }, [arMode]);

  useEffect(() => {
    if (!rendererRef.current) return;
    if (arMode) {
        rendererRef.current.setClearColor(0x000000, 0);
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(s => { if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); } });
    } else {
        rendererRef.current.setClearColor(0x0b0d17, 1);
        if (videoRef.current?.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); videoRef.current.srcObject = null; }
    }
  }, [arMode]);

  const handleExplain = async () => { setExplanation(await generatePhysicsExplanation("Relativity", velocity, gamma)); };

  return (
    <div className={`flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 ${forceAR ? 'h-full m-0 p-0' : ''}`}>
      <div className="flex-1 flex flex-col gap-4">
        <div className={`bg-black rounded-xl overflow-hidden border-2 border-space-700 shadow-2xl relative ${forceAR ? 'h-full border-none rounded-none' : 'h-[400px]'}`}>
          <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${arMode ? 'opacity-100' : 'opacity-0'}`} playsInline muted />
          <div ref={mountRef} className="absolute inset-0 z-10" />
          {!forceAR && (
              <div className="absolute top-4 right-4 z-20"><Button size="sm" onClick={() => setArMode(!arMode)}>{arMode ? 'Disable AR' : 'Enable AR'}</Button></div>
          )}
        </div>
        <div className={`bg-space-800 p-6 rounded-xl border border-space-700 ${forceAR ? 'bg-black/60 backdrop-blur-md rounded-t-3xl border-t border-white/10' : ''}`}>
          <input type="range" min="0" max="0.995" step="0.001" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
          <div className="mt-4 text-center font-mono text-cyan-400">{(velocity * 100).toFixed(1)}% Speed of Light</div>
        </div>
      </div>
      {!forceAR && (
        <div className="w-full lg:w-96 bg-space-800 p-6 rounded-xl border border-space-700">
           <Button onClick={handleExplain} className="w-full">Explain State</Button>
           {explanation && <p className="mt-4 text-sm text-cyan-100 italic">"{explanation}"</p>}
        </div>
      )}
    </div>
  );
};
