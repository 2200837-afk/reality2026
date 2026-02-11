
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Button } from './Button';
import { Camera, CameraOff, Info, TrainFront } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useARTracking, useAnalytics } from '../contexts/AnalyticsContext';

export const ExpTrainTunnel: React.FC<{ forceAR?: boolean }> = ({ forceAR = false }) => {
  // Fix: Property 'env' does not exist on type 'ImportMeta' - cast to any
  const asset = (path: string) => (import.meta as any).env.BASE_URL + path.replace(/^\.\//, '');
  const [velocity, setVelocity] = useState(0.866);
  const [viewFrame, setViewFrame] = useState<'tunnel' | 'train'>('tunnel');
  const [arMode, setArMode] = useState(forceAR);

  usePageTracking("ExpTrainTunnel");
  useARTracking("ExpTrainTunnel", arMode);
  const { trackSlider, trackClick } = useAnalytics();

  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const trainRef = useRef<THREE.Group | null>(null);
  const tunnelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const REST_TRAIN_LEN = 10;
  const REST_TUNNEL_LEN = 5;

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene(); sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 20);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer; mountRef.current.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    
    // Fix: Property 'set' does not exist on type 'DirectionalLight' - use position.set
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(5, 10, 5);
    scene.add(dLight);

    if (!arMode) {
      // Fix: Property 'set' does not exist on type 'GridHelper' - use position.set
      const grid = new THREE.GridHelper(50, 50, 0x1e2548, 0x0f1225);
      grid.position.set(0, -2, 0);
      scene.add(grid);
    }
    
    const pivot = new THREE.Group(); scene.add(pivot);
    const tunnelGroup = new THREE.Group(); pivot.add(tunnelGroup); tunnelRef.current = tunnelGroup;
    new GLTFLoader().load(asset('./model/low_poly_style_subway_tunnel_section.glb'), (gltf) => {
        const m = gltf.scene; m.rotation.y = Math.PI * 1.5; m.position.y = 3.3;
        const s = REST_TUNNEL_LEN / (new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).z || 1) * 5;
        m.scale.set(s, s, s); tunnelGroup.add(m);
    }, undefined, () => {
        const f = new THREE.Mesh(new THREE.CylinderGeometry(3,3,REST_TUNNEL_LEN,32,1,true), new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true}));
        f.rotateZ(Math.PI/2); tunnelGroup.add(f);
    });

    const trainGroup = new THREE.Group(); pivot.add(trainGroup); trainRef.current = trainGroup;
    new GLTFLoader().load(asset('./model/train_-_british_rail_class_08_rail_blue_livery.glb'), (gltf) => {
        const m = gltf.scene; m.rotation.y = Math.PI / 2; m.position.z = 0.5; m.position.y = -1.7;
        const s = REST_TRAIN_LEN / (new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).z || 1);
        m.scale.set(s * 0.75, s * 0.5, s * 0.5); trainGroup.add(m);
        if (gltf.animations?.length) {
            const mx = new THREE.AnimationMixer(m); gltf.animations.forEach(c => mx.clipAction(c).play());
            (trainGroup as any).mixer = mx;
        }
    });

    const controls = new OrbitControls(camera, renderer.domElement); controlsRef.current = controls;
    const animate = () => {
        if (controlsRef.current) controlsRef.current.update();
        const v = (window as any).ttVelocity || 0;
        const f = (window as any).ttFrame || 'tunnel';
        const g = 1 / Math.sqrt(1 - v * v);
        const off = ((Date.now() / 1000 % 6) * 8) - 24;
        if (f === 'tunnel') {
            if (tunnelRef.current) tunnelRef.current.scale.set(1,1,1);
            if (trainRef.current) { trainRef.current.scale.set(1/g, 1, 1); trainRef.current.position.x = off; }
        } else {
            if (tunnelRef.current) { tunnelRef.current.scale.set(1/g, 1, 1); tunnelRef.current.position.x = -off; }
            if (trainRef.current) { trainRef.current.scale.set(1, 1, 1); trainRef.current.position.x = 0; }
        }
        if (trainRef.current && (trainRef.current as any).mixer) (trainRef.current as any).mixer.update(0.016);
        renderer.render(scene, camera); requestAnimationFrame(animate);
    };
    animate();
    return () => renderer.dispose();
  }, [arMode]);

  useEffect(() => { (window as any).ttVelocity = velocity; (window as any).ttFrame = viewFrame; }, [velocity, viewFrame]);

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

  const explanationText = viewFrame === 'tunnel' ? "Tunnel frame: moving train contracts and fits." : "Train frame: tunnel contracts, train appears too long.";

  return (
    <div className={`flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 ${forceAR ? 'h-full m-0 p-0' : 'animate-in fade-in zoom-in-95 duration-300'}`}>
      <div className="flex-1 flex flex-col gap-4">
        <div className={`bg-space-800 p-6 rounded-xl border border-space-700 ${forceAR ? 'h-full border-none bg-black rounded-none flex flex-col' : ''}`}>
            {!forceAR && (
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><TrainFront className="text-cyan-400" /> Train-Tunnel Paradox</h2>
                  <Button size="sm" variant={arMode ? 'primary' : 'outline'} onClick={() => setArMode(!arMode)}>
                      {arMode ? <><CameraOff size={16} /> Disable AR</> : <><Camera size={16} /> AR View</>}
                  </Button>
              </div>
            )}
            <div className="flex gap-4 mb-4 justify-center">
                <Button size="sm" variant={viewFrame === 'tunnel' ? 'primary' : 'secondary'} onClick={() => setViewFrame('tunnel')}>Tunnel Frame</Button>
                <Button size="sm" variant={viewFrame === 'train' ? 'primary' : 'secondary'} onClick={() => setViewFrame('train')}>Train Frame</Button>
            </div>
            <div className={`relative w-full ${forceAR ? 'flex-1' : 'h-[400px]'} bg-black rounded-xl overflow-hidden border border-space-600 shadow-2xl`}>
                 <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${arMode ? 'opacity-100' : 'opacity-0'}`} playsInline muted />
                 <div ref={mountRef} className="absolute inset-0 z-10" />
            </div>
            <div className={`mt-6 space-y-4 ${forceAR ? 'bg-black/60 p-4 rounded-t-3xl' : ''}`}>
                <label className="text-xs text-slate-400 font-mono">v: {velocity.toFixed(3)}c | γ: {(1/Math.sqrt(1-velocity*velocity)).toFixed(2)}</label>
                <input type="range" min="0" max="0.95" step="0.01" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </div>
        </div>
      </div>
      {!forceAR && (
        <div className="w-full lg:w-96 flex flex-col gap-4">
            <div className="bg-space-800 p-6 rounded-xl border border-space-700 flex flex-col">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-2"><Info size={14} /> Whose truth is real?</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{explanationText}</p>
                <SpeechControl text={explanationText} />
            </div>
        </div>
      )}
    </div>
  );
};
