
import React, { useState } from 'react';
import { Button } from './Button';
import { Info, TrainFront } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { ARBookmark } from './ARBookmark';

export const ExpTrainTunnel: React.FC = () => {
  const [velocity, setVelocity] = useState(0.866);
  const [viewFrame, setViewFrame] = useState<'tunnel' | 'train'>('tunnel');

  usePageTracking("ExpTrainTunnel");
  const { trackSlider } = useAnalytics();

  const gamma = 1 / Math.sqrt(1 - velocity * velocity);

  const explanationText = viewFrame === 'tunnel' 
    ? "From the Tunnel's perspective, the moving train contracts and physically fits inside."
    : "From the Train's perspective, the tunnel contracts, so the train appears too long.";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-space-800 p-6 rounded-xl border border-space-700">
        <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrainFront className="text-cyan-400" />
                Train-Tunnel Paradox Schematic
            </h2>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
            <Button size="sm" variant={viewFrame === 'tunnel' ? 'primary' : 'secondary'} onClick={() => setViewFrame('tunnel')}>
                Tunnel Frame
            </Button>
            <Button size="sm" variant={viewFrame === 'train' ? 'primary' : 'secondary'} onClick={() => setViewFrame('train')}>
                Train Frame
            </Button>
        </div>

        {/* 2D Schematic Viewport */}
        <div className="relative w-full h-[350px] bg-space-900 rounded-xl overflow-hidden border border-space-600 shadow-2xl flex flex-col items-center justify-center p-12">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1e2548 0px, #1e2548 1px, transparent 1px, transparent 10px)' }}></div>
             
             {/* Blueprint Layout */}
             <div className="relative z-10 w-full max-w-3xl space-y-12">
                 <div className="text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-4 tracking-widest">Length Comparison Blueprint (γ = {gamma.toFixed(2)})</div>
                 </div>

                 <div className="space-y-8">
                    {/* Tunnel Schematic */}
                    <div className="relative flex flex-col items-center">
                        <div className="text-[9px] text-slate-500 uppercase mb-1">Tunnel Blueprint (Stationary Ref: {viewFrame === 'tunnel' ? 'X' : "X'"})</div>
                        <div 
                            className="h-12 bg-slate-800 border-x-4 border-slate-600 flex items-center justify-center text-[10px] text-slate-400 transition-all duration-300"
                            style={{ width: viewFrame === 'train' ? `${100 / gamma}%` : '100%' }}
                        >
                            TUNNEL_SECTION_A
                        </div>
                    </div>

                    {/* Train Schematic */}
                    <div className="relative flex flex-col items-center">
                         <div className="text-[9px] text-cyan-500 uppercase mb-1">Relativistic Train Blueprint</div>
                         <div 
                            className="h-10 bg-cyan-900/30 border-2 border-cyan-500 rounded flex items-center justify-center text-[10px] text-cyan-200 transition-all duration-300"
                            style={{ width: viewFrame === 'tunnel' ? `${100 / gamma}%` : '100%' }}
                         >
                            TRAIN_ID_05
                         </div>
                    </div>
                 </div>
             </div>
        </div>

        <div className="mt-8 space-y-6">
             <div>
                <label className="text-sm text-slate-400">Modulate Velocity: {velocity.toFixed(3)}c</label>
                <input type="range" min="0" max="0.95" step="0.01" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
             </div>

             <div className="bg-blue-900/10 p-4 rounded border border-blue-500/20">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    {explanationText}
                </p>
                <SpeechControl text={explanationText} />
             </div>
        </div>
      </div>

      <ARBookmark title="Train-Tunnel Spatial Paradox" simId="train_tunnel" />
    </div>
  );
};
