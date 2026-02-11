
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from './Button';
import { Camera, CameraOff, Play, RotateCcw, Info, Sparkles } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useARTracking, useAnalytics } from '../contexts/AnalyticsContext';

export const ExpTwin: React.FC<{ forceAR?: boolean }> = ({ forceAR = false }) => {
  // Fix: Property 'env' does not exist on type 'ImportMeta' - cast to any
  const asset = (path: string) => (import.meta as any).env.BASE_URL + path.replace(/^\.\//, '');
  const [velocity, setVelocity] = useState(0.8);
  const [distance, setDistance] = useState(5); 
  const [arMode, setArMode] = useState(forceAR);
  const [playing, setPlaying] = useState(false);

  usePageTracking("ExpTwinParadox");
  useARTracking("ExpTwinParadox", arMode);
  const { trackSlider } = useAnalytics();
  
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const lifeForceRef = useRef<THREE.Mesh | null>(null);
  const progressRef = useRef(0);
  const playingRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene(); sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer; mountRef.current.appendChild(renderer.domElement);

    // Fix: Property 'set' does not exist on type 'PointLight' - use position.set
    const pLight = new THREE.PointLight(0xffffff, 2, 100);
    pLight.position.set(-10, 10, -10);
    scene.add(pLight);
    scene.add(new THREE.AmbientLight(0x404040));

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x2233ff }));
    earth.position.set(-8, 0, 0); scene.add(earth); earthRef.current = earth;

    const lifeForce = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: 0x00f3ff, transparent: true, opacity: 0.8 }));
    lifeForce.position.set(-8, 3, 0); scene.add(lifeForce); lifeForceRef.current = lifeForce;

    const ship = new THREE.Group();
    const shipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 8).rotateZ(-Math.PI/2), new THREE.MeshStandardMaterial({ color: 0x00f3ff }));
    ship.add(shipMesh); scene.add(ship); shipRef.current = ship;

    const animate = () => {
        if (earthRef.current) earthRef.current.rotation.y += 0.01;
        if (playingRef.current) {
            progressRef.current += 0.005;
            if (progressRef.current > 2) { progressRef.current = 2; playingRef.current = false; setPlaying(false); }
        }
        const t = progressRef.current;
        const v = (window as any).twinVelocity || 0.8;
        const d = (window as any).twinDistance || 5;
        const g = 1 / Math.sqrt(1 - v*v);
        if (shipRef.current) {
            let xPos = t <= 1 ? -8 + (t * 16) : 8 - ((t - 1) * 16);
            shipRef.current.position.x = xPos;
            shipRef.current.rotation.z = t <= 1 ? -Math.PI / 2 : Math.PI / 2;
            shipRef.current.scale.set(1/g, 1, 1);
        }
        const earthAge = (t/2) * (d/v) * 2;
        (window as any).currentEarthAge = 20 + earthAge;
        (window as any).currentShipAge = 20 + (earthAge/g);

        if (lifeForceRef.current) {
             const lifeRatio = Math.max(0, 1 - (earthAge) / 80);
             const s = 0.2 + (lifeRatio * 0.8); lifeForceRef.current.scale.set(s, s, s);
             const c = new THREE.Color(0x00f3ff).lerp(new THREE.Color(0x333333), 1 - lifeRatio);
             (lifeForceRef.current.material as any).color.set(c);
        }
        renderer.render(scene, camera); requestAnimationFrame(animate);
    };
    animate();
    return () => renderer.dispose();
  }, [arMode]);

  useEffect(() => { (window as any).twinVelocity = velocity; (window as any).twinDistance = distance; }, [velocity, distance]);
  useEffect(() => { playingRef.current = playing; if (playing && progressRef.current >= 2) progressRef.current = 0; }, [playing]);

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

  const explanationText = "Symmetry is broken because Space Twin turns around, changing frames.";

  return (
    <div className={`flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 ${forceAR ? 'h-full m-0 p-0' : 'animate-in fade-in'}`}>
      <div className="flex-1 flex flex-col gap-4">
        <div className={`bg-space-800 p-6 rounded-xl border border-space-700 ${forceAR ? 'h-full bg-black border-none rounded-none' : ''}`}>
            {!forceAR && (
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold">The Twin Paradox</h2>
                     <Button size="sm" variant={arMode ? 'primary' : 'outline'} onClick={() => setArMode(!arMode)}>
                         {arMode ? <><CameraOff size={16} /> Disable AR</> : <><Camera size={16} /> AR View</>}
                     </Button>
                </div>
            )}
            <div className={`relative w-full ${forceAR ? 'flex-1' : 'h-[400px]'} bg-black rounded-xl overflow-hidden border border-space-600 shadow-2xl`}>
                <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${arMode ? 'opacity-100' : 'opacity-0'}`} playsInline muted />
                <div ref={mountRef} className="absolute inset-0 z-10" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <Button onClick={() => setPlaying(!playing)} variant="primary">{playing ? 'In Flight...' : 'Launch Mission'}</Button>
                </div>
            </div>
            <div className={`mt-6 space-y-6 ${forceAR ? 'bg-black/60 p-4 rounded-t-3xl' : ''}`}>
                <input type="range" min="0.1" max="0.99" step="0.01" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                <input type="range" min="1" max="20" step="1" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
        </div>
      </div>
      {!forceAR && (
        <div className="w-full lg:w-96 flex flex-col gap-4">
            <div className="bg-space-800 p-6 rounded-xl border border-space-700">
                <p className="text-sm text-slate-300 leading-relaxed">{explanationText}</p>
                <SpeechControl text={explanationText} />
            </div>
        </div>
      )}
    </div>
  );
};
