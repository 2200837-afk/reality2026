
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Play, RotateCcw, Info, Radio } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { ARBookmark } from './ARBookmark';

export const ExpSimultaneity: React.FC = () => {
  const [frame, setFrame] = useState<'platform' | 'train'>('platform');
  const [playing, setPlaying] = useState(false);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  usePageTracking("ExpSimultaneity");
  const { trackClick } = useAnalytics();

  const reset = () => {
      setPlaying(false);
      setProgress(0);
      progressRef.current = 0;
  };

  const explanationText = frame === 'platform' 
    ? "Events are NOT simultaneous. The back wall moves toward the light, hitting first."
    : "Events ARE simultaneous. The walls are equidistant and the light speed is constant.";

  // Animation logic for 2D representation
  React.useEffect(() => {
    let interval: any;
    if (playing) {
        interval = setInterval(() => {
            setProgress(p => {
                if (p >= 1) { setPlaying(false); return 1; }
                return p + 0.01;
            });
        }, 30);
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-space-800 p-6 rounded-xl border border-space-700">
        <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Radio className="text-green-400" />
                Relativity of Simultaneity
            </h2>
        </div>
        
        <div className="flex gap-4 mb-8 justify-center">
            <Button size="sm" variant={frame === 'platform' ? 'primary' : 'secondary'} onClick={() => { setFrame('platform'); reset(); }}>
                Platform View
            </Button>
            <Button size="sm" variant={frame === 'train' ? 'primary' : 'secondary'} onClick={() => { setFrame('train'); reset(); }}>
                Train View
            </Button>
        </div>

        {/* 2D Schematic Viewport */}
        <div className="relative w-full h-[350px] bg-space-900 rounded-xl overflow-hidden border border-space-600 shadow-2xl flex flex-col items-center justify-center p-12">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1e2548 1px, transparent 1px), linear-gradient(90deg, #1e2548 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             
             {/* Schematic Elements */}
             <div className="relative z-10 w-full max-w-2xl h-full flex flex-col items-center justify-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono mb-8">Synchronicity Blueprint ({frame.toUpperCase()}_FRAME)</div>
                
                <div className="relative w-full h-24 border-x-4 border-slate-700 bg-space-800/50 rounded flex items-center justify-center">
                    {/* The Light Source */}
                    <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] z-20"></div>
                    
                    {/* Expanding Light Waves */}
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-yellow-500/50 rounded-full transition-all duration-75"
                        style={{ 
                            width: `${progress * 200}%`, 
                            height: `${progress * 200}%`,
                            opacity: 1 - progress 
                        }}
                    ></div>

                    {/* Left/Right Detectors */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors ${progress > (frame === 'platform' ? 0.3 : 0.5) ? 'bg-green-500' : 'bg-red-900'}`}></div>
                    <div className={`absolute right-0 top-0 bottom-0 w-2 transition-colors ${progress > (frame === 'platform' ? 0.7 : 0.5) ? 'bg-green-500' : 'bg-red-900'}`}></div>
                </div>

                <div className="mt-12 flex justify-between w-full px-4 text-[10px] font-mono text-slate-500">
                    <div>DETECTOR_A (BACK)</div>
                    <div className="text-yellow-400">EMISSION_POINT</div>
                    <div>DETECTOR_B (FRONT)</div>
                </div>

                <div className="absolute bottom-4 flex gap-4">
                    <Button onClick={() => setPlaying(!playing)} variant="primary" size="sm">
                       {playing ? 'Active...' : 'Fire Pulse'}
                    </Button>
                    <Button onClick={reset} variant="secondary" size="sm">
                       <RotateCcw size={14} />
                    </Button>
                </div>
             </div>
        </div>
        
        <div className="mt-6 bg-green-900/10 p-4 rounded border border-green-500/20">
            <p className="text-sm text-slate-300 leading-relaxed italic">
                {explanationText}
            </p>
            <SpeechControl text={explanationText} />
        </div>
      </div>

      <ARBookmark title="Simultaneity Paradox Interaction" simId="simultaneity" />
    </div>
  );
};
