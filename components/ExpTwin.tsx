
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Play, RotateCcw, Info, Users } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { ARBookmark } from './ARBookmark';

export const ExpTwin: React.FC = () => {
  const [velocity, setVelocity] = useState(0.8);
  const [distance, setDistance] = useState(5); 
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  usePageTracking("ExpTwinParadox");
  const { trackSlider } = useAnalytics();

  useEffect(() => {
    let interval: any;
    if (playing) {
        interval = setInterval(() => {
            setProgress(p => {
                if (p >= 1) { setPlaying(false); return 1; }
                return p + 0.005;
            });
        }, 20);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const gamma = 1 / Math.sqrt(1 - velocity * velocity);
  const totalTripTimeEarth = (distance / velocity) * 2; 
  const earthAgeVal = 20 + (progress * totalTripTimeEarth);
  const shipAgeVal = 20 + (progress * totalTripTimeEarth / gamma);

  const explanationText = "The space-time path of the traveling twin is shorter than the earthbound twin's path because of the acceleration and shift in reference frames.";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-space-800 p-6 rounded-xl border border-space-700">
        <div className="flex justify-between mb-6">
             <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-purple-400" />
                Twin Paradox Worldline
             </h2>
        </div>
        
        {/* 2D Schematic Viewport: Minkowski Diagram Style */}
        <div className="relative w-full h-[400px] bg-space-900 rounded-xl overflow-hidden border border-space-600 shadow-2xl flex flex-col items-center justify-center p-8">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1e2548 1px, transparent 1px), linear-gradient(90deg, #1e2548 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             
             {/* The Diagram */}
             <div className="relative z-10 w-full max-w-xl h-full border-l-2 border-b-2 border-slate-700 p-8 flex flex-col justify-end">
                <div className="absolute -left-10 top-0 text-[10px] text-slate-500 font-mono rotate-90 origin-left">TIME (Years) &uarr;</div>
                <div className="absolute -bottom-6 right-0 text-[10px] text-slate-500 font-mono">DISTANCE (Light Years) &rarr;</div>

                {/* Earth Worldline (Vertical) */}
                <div className="absolute left-0 bottom-0 w-1 bg-blue-500/30 h-full"></div>
                
                {/* Traveling Twin Worldline (Angle) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Trip Out */}
                    <line 
                        x1="0" y1="100" x2="80" y2="50" 
                        stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,2" 
                    />
                    {/* Trip Back */}
                    <line 
                        x1="80" y1="50" x2="0" y2="0" 
                        stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,2" 
                    />
                    
                    {/* Current Position Marker */}
                    {playing || progress > 0 ? (
                        <circle 
                            cx={progress <= 0.5 ? progress * 160 : 160 - (progress * 160)} 
                            cy={100 - (progress * 100)} 
                            r="4" 
                            fill="#06b6d4" 
                            className="shadow-lg shadow-cyan-500"
                        />
                    ) : null}
                </svg>

                <div className="mt-auto text-center font-mono text-xs text-slate-500">Minkowski Projection Plot</div>
             </div>

             <div className="absolute bottom-4 flex gap-4">
                <Button onClick={() => setPlaying(!playing)} variant="primary" size="sm">
                   {playing ? 'In Flight...' : 'Launch Simulation'}
                </Button>
                <Button onClick={() => { setProgress(0); setPlaying(false); }} variant="secondary" size="sm">
                   <RotateCcw size={14} />
                </Button>
             </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-300">Set Velocity: {velocity.toFixed(2)}c</label>
                    <input type="range" min="0.1" max="0.99" step="0.01" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-space-900 p-4 rounded border border-space-700">
                        <div className="text-[10px] text-slate-500 uppercase">Earth Twin Age</div>
                        <div className="text-2xl font-mono text-blue-400">{earthAgeVal.toFixed(1)}</div>
                    </div>
                    <div className="bg-space-900 p-4 rounded border border-space-700">
                        <div className="text-[10px] text-slate-500 uppercase">Space Twin Age</div>
                        <div className="text-2xl font-mono text-cyan-400">{shipAgeVal.toFixed(1)}</div>
                    </div>
                </div>
            </div>
            
            <div className="bg-purple-900/10 p-4 rounded border border-purple-500/20">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    {explanationText}
                </p>
                <SpeechControl text={explanationText} />
            </div>
        </div>
      </div>

      <ARBookmark title="Twin Paradox Spatial Interaction" simId="twin" />
    </div>
  );
};
