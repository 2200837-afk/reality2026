
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ViewMode } from '../types';
import { ArrowRight, Clock, TrainFront, Zap, Users, Sparkles, Binary, MoveRight } from 'lucide-react';

interface HomeProps {
  setMode: (mode: ViewMode) => void;
}

const PARADOXES = [
  {
    id: 1,
    title: "The Twin Paradox",
    subtitle: "Dilation of Biological Time",
    desc: "A stellar journey at relativistic speeds creates a rift in aging. One twin traverses the stars; the other remains on Earth. Upon reunion, their watches—and cells—no longer agree.",
    icon: <Users size={48} className="text-purple-400" />,
    color: "from-purple-900/40 via-blue-900/40 to-space-900",
    accent: "bg-purple-500"
  },
  {
    id: 2,
    title: "Train in a Tunnel",
    subtitle: "Simultaneity of Space",
    desc: "A physical impossibility in Newtonian physics becomes reality. A train longer than its tunnel fits inside entirely—but only from one perspective. Witness the relativity of length.",
    icon: <TrainFront size={48} className="text-cyan-400" />,
    color: "from-cyan-900/40 via-blue-900/40 to-space-900",
    accent: "bg-cyan-500"
  },
  {
    id: 3,
    title: "Time Dilation",
    subtitle: "The Elasticity of Seconds",
    desc: "Time is not a universal clock. It is a personal dimension that stretches and compresses. At 0.99c, minutes for you become hours for the galaxy.",
    icon: <Clock size={48} className="text-pink-400" />,
    color: "from-pink-900/40 via-rose-900/40 to-space-900",
    accent: "bg-pink-500"
  }
];

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PARADOXES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeItem = PARADOXES[activeIdx];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden bg-space-900">
      
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0b0d17_80%)]"></div>
         <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
         
         {/* Moving Stars */}
         <div className="absolute inset-0 opacity-30 animate-[spin-slow_120s_linear_infinite]" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
         
         {/* Distant Nebula Effect */}
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center py-12">
        
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
            <Sparkles size={14} /> Exploring the fabric of space-time
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white animate-in fade-in slide-in-from-left-6 duration-1000">
            Reality is <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Relative.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            Dive into Einstein's Special Theory of Relativity. 
            Visualize paradoxes that defy common sense through immersive, high-velocity simulations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button size="lg" onClick={() => setMode(ViewMode.EXPERIMENTS)} className="h-16 px-10 rounded-2xl flex items-center gap-3 group text-lg font-bold">
              Enter Laboratory <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setMode(ViewMode.SIMULATION)} className="h-16 px-10 rounded-2xl text-lg font-medium hover:bg-white/5 border-white/20">
              Launch Warp Drive
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 max-w-lg mx-auto lg:mx-0 opacity-60">
             <div className="space-y-1">
                <div className="text-2xl font-bold text-white">299k</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">km/s Velocity</div>
             </div>
             <div className="space-y-1">
                <div className="text-2xl font-bold text-white">0.99c</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Warp Limit</div>
             </div>
             <div className="space-y-1">
                <div className="text-2xl font-bold text-white">E=mc²</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mass-Energy</div>
             </div>
          </div>
        </div>

        {/* Right Column: Interactive Carousel */}
        <div className="lg:col-span-5 relative h-[500px] w-full perspective-1000">
            {PARADOXES.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                    <div 
                        key={item.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
                            isActive 
                            ? 'opacity-100 translate-y-0 scale-100 rotate-0 pointer-events-auto' 
                            : 'opacity-0 translate-y-12 scale-90 rotate-2 pointer-events-none'
                        }`}
                    >
                        <div className={`h-full bg-gradient-to-br ${item.color} border border-white/10 backdrop-blur-xl rounded-[40px] p-10 flex flex-col shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-white/30`}>
                            <div className={`absolute top-0 right-0 p-40 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${item.accent}`}></div>
                            
                            <div className="mb-8 p-5 bg-black/40 rounded-3xl border border-white/10 w-fit shadow-inner">
                                {item.icon}
                            </div>
                            
                            <div className="space-y-2 mb-6">
                              <h2 className="text-4xl font-black text-white">{item.title}</h2>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.accent} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}></div>
                                <h3 className="text-lg font-medium text-white/70">{item.subtitle}</h3>
                              </div>
                            </div>

                            <p className="text-slate-300 text-lg leading-relaxed font-light mb-auto">
                                {item.desc}
                            </p>
                            
                            <div className="flex items-center justify-between mt-12">
                                <div className="flex gap-3">
                                    {PARADOXES.map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setActiveIdx(i)}
                                            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIdx ? 'w-10 bg-white' : 'w-2 bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                                <div className="text-white/20 font-mono text-sm uppercase tracking-tighter">Paradox_0{item.id}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

      </div>

      {/* Floating UI element: Current Ship Stats */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-12 px-8 py-4 bg-black/40 backdrop-blur-md rounded-full border border-white/5 animate-bounce">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inertial Frame: Stable</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Physics Core: Active</span>
         </div>
         <div className="flex items-center gap-3">
            <Binary size={14} className="text-cyan-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Analysis Engine: Online</span>
         </div>
      </div>
      
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};