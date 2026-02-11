
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePhysicsExplanation } from '../services/geminiService';
import { Button } from './Button';
import { Info, Play, Pause, RotateCcw, Rocket, Layout, Binary, Box } from 'lucide-react';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { ARBookmark } from './ARBookmark';
import { Relativistic3DViewer } from './Relativistic3DViewer';

interface SimulationProps {
  velocity: number;
  setVelocity: (v: number) => void;
}

const LorentzGraph = ({ currentV }: { currentV: number }) => {
  const data = [];
  for (let v = 0; v <= 99; v += 1) {
    const vel = v / 100;
    const g = 1 / Math.sqrt(1 - vel * vel);
    data.push({ v: vel, gamma: g > 10 ? 10 : g });
  }

  return (
    <div className="h-48 w-full mt-4 bg-space-800/50 rounded-lg p-2 border border-space-700">
      <p className="text-xs text-slate-400 mb-2 text-center">Lorentz Factor (γ) vs Velocity (c)</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGamma" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2548" />
          <XAxis dataKey="v" stroke="#64748b" tickFormatter={(val) => `${val.toFixed(1)}c`} />
          <YAxis stroke="#64748b" domain={[1, 10]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0b0d17', borderColor: '#1e2548', color: '#fff' }}
            formatter={(value: number) => [value.toFixed(2), 'Gamma']}
            labelFormatter={(label) => `Velocity: ${label}c`}
          />
          <Area type="monotone" dataKey="gamma" stroke="#06b6d4" fillOpacity={1} fill="url(#colorGamma)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const Simulation: React.FC<SimulationProps> = ({ velocity, setVelocity }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [explanation, setExplanation] = useState<string>("");
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  usePageTracking("WarpDriveSandbox");
  const { trackSlider, trackClick } = useAnalytics();

  const gamma = 1 / Math.sqrt(1 - velocity * velocity);

  const handleVelocityChange = (v: number) => {
    setVelocity(v);
  };

  const handleExplain = async () => {
    trackClick("btn-explain-sim");
    setLoadingExpl(true);
    const text = await generatePhysicsExplanation("Time Dilation and Length Contraction", velocity, gamma);
    setExplanation(text);
    setLoadingExpl(false);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Viewport Container */}
          <div className="relative w-full h-[500px] bg-space-900 rounded-2xl overflow-hidden border-2 border-space-700 shadow-2xl">
            
            {/* View Mode Toggle Overlay */}
            <div className="absolute top-4 right-4 z-50 flex bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/10">
                <button 
                  onClick={() => setViewMode('2d')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === '2d' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  <Layout size={14} /> 2D Schematic
                </button>
                <button 
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === '3d' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  <Box size={14} /> 3D Spatial
                </button>
            </div>

            {viewMode === '3d' ? (
                <Relativistic3DViewer velocity={velocity} gamma={gamma} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 w-full h-full max-w-2xl flex flex-col items-center justify-center">
                        <div className="w-full flex items-center justify-between px-10 mb-4 opacity-50">
                            <div className="text-[10px] font-mono text-cyan-400">REF_FRAME: STATIONARY</div>
                            <div className="text-[10px] font-mono text-cyan-400">ENGINE_STATUS: NOMINAL</div>
                        </div>
                        
                        <div className="relative w-full h-1/2 border-y border-space-600 flex items-center justify-center">
                            <div 
                              className="h-16 bg-gradient-to-r from-cyan-900 to-cyan-500 rounded border border-cyan-400 flex items-center justify-center transition-all duration-300 relative shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                              style={{ width: `${100 / gamma}%` }}
                            >
                                <Rocket className="text-white" size={32} />
                                <div className="absolute -top-6 text-[10px] font-mono text-white whitespace-nowrap">L' = L/γ = {(100/gamma).toFixed(1)}m</div>
                            </div>
                            <div className="absolute inset-0 flex flex-col justify-around py-4 opacity-20 pointer-events-none overflow-hidden">
                                {[...Array(5)].map((_, i) => (
                                   <div key={i} className="h-px bg-white w-[200%] animate-[slide_2s_linear_infinite]" style={{ animationDuration: `${0.5 + (1-velocity)}s` }}></div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-8 w-full">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Observer Clock</div>
                                <div className="text-2xl font-mono text-white">1.00s</div>
                            </div>
                            <div className="text-center">
                                 <div className="text-[10px] text-slate-500 uppercase font-bold">Relative Velocity</div>
                                 <div className="text-2xl font-mono text-cyan-400">{(velocity * 100).toFixed(1)}% c</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Dilated Clock</div>
                                <div className="text-2xl font-mono text-neon-pink">{(1 * gamma).toFixed(3)}s</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
               <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                   {viewMode === '3d' ? <Box size={20} className="text-cyan-400" /> : <Layout size={20} className="text-cyan-400" />}
                   {viewMode === '3d' ? '3D Spatial Projection' : 'Warp Drive Blueprint'}
               </h2>
               <div className="font-mono text-[10px] text-slate-500 mt-1 uppercase">Immersive Engine V3.0</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-space-800 p-6 rounded-xl border border-space-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Engine Modulation</h2>
              <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleVelocityChange(0)}>
                      <RotateCcw size={16} />
                  </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Set Velocity (v/c)</label>
                  <span className="font-mono text-cyan-400 text-lg">{velocity.toFixed(3)}c</span>
                </div>
                <input type="range" min="0" max="0.995" step="0.001" value={velocity} onChange={(e) => { setVelocity(parseFloat(e.target.value)); trackSlider("warp-velocity", parseFloat(e.target.value)); }} className="w-full h-2 bg-space-600 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-space-900/50 p-4 rounded-lg border border-space-700">
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Time Dilation</div>
                    <div className="text-2xl font-bold text-white">γ = {gamma.toFixed(2)}</div>
                 </div>
                 <div className="bg-space-900/50 p-4 rounded-lg border border-space-700">
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Length Contraction</div>
                    <div className="text-2xl font-bold text-neon-pink">{(100/gamma).toFixed(1)}%</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
           <div className="bg-space-800 p-6 rounded-xl border border-space-700 h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Info size={18} className="text-cyan-400" />
                  Physics Analysis
              </h3>
              <div className="text-sm text-slate-300 space-y-4 mb-6 leading-relaxed">
                  <p>In the 3D viewer, rotate the ship to observe how length contraction ONLY affects the dimension parallel to the velocity vector (X-axis).</p>
                  <p>As you approach 0.99c, the spaceship literally flattens into a disc from the stationary observer's perspective.</p>
              </div>
              <Button onClick={handleExplain} disabled={loadingExpl} className="w-full mb-4" variant="outline">
                  {loadingExpl ? 'Analyzing Space-Time...' : 'Ask AI to Explain This State'}
              </Button>
              {explanation && <div className="bg-space-900 p-4 rounded border border-cyan-900/50 text-sm leading-relaxed mb-4"><p className="text-cyan-100 italic">"{explanation}"</p></div>}
              <LorentzGraph currentV={velocity} />
           </div>
        </div>
      </div>

      {/* The AR Bookmark Section */}
      <ARBookmark title="3D Warp Drive Interaction" simId="warp" />

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
