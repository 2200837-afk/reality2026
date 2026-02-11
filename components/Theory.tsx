import React from 'react';
import { Clock, Ruler, Zap } from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
          Special Relativity
        </h1>
        <p className="text-xl text-cyan-400 font-light">
          The Two Postulates that Broke Physics (1905)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-space-800 to-space-900 p-8 rounded-2xl border border-space-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 text-9xl font-bold text-white/5 -translate-y-4 translate-x-4">1</div>
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">The Principle of Relativity</h3>
          <p className="text-slate-300 leading-relaxed relative z-10 text-lg">
            There is no "absolute rest." If you are in a spaceship moving smoothly (constant velocity), physics works exactly the same as if you were sitting on Earth. You cannot tell if you are moving or standing still without looking outside.
          </p>
        </div>

        <div className="bg-gradient-to-br from-space-800 to-space-900 p-8 rounded-2xl border border-space-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 text-9xl font-bold text-white/5 -translate-y-4 translate-x-4">2</div>
          <h3 className="text-2xl font-bold text-neon-pink mb-4 relative z-10">The Speed of Light (c)</h3>
          <p className="text-slate-300 leading-relaxed relative z-10 text-lg">
            Light always travels at <strong>299,792,458 m/s</strong>. It doesn't matter if the light source is moving towards you or away from you. The speed of light is the universal speed limit and constant for everyone.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">The Consequences</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-space-800/50 p-6 rounded-xl border border-space-700 hover:bg-space-800 transition-colors">
            <Clock className="text-cyan-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Time Dilation</h3>
            <p className="text-slate-400 text-sm">
              Moving clocks tick slower. Time is personal, not universal.
            </p>
          </div>

          <div className="bg-space-800/50 p-6 rounded-xl border border-space-700 hover:bg-space-800 transition-colors">
            <Ruler className="text-purple-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Length Contraction</h3>
            <p className="text-slate-400 text-sm">
              Moving objects shrink in the direction of motion.
            </p>
          </div>

          <div className="bg-space-800/50 p-6 rounded-xl border border-space-700 hover:bg-space-800 transition-colors">
            <Zap className="text-yellow-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Mass Increases</h3>
            <p className="text-slate-400 text-sm">
              The faster you go, the heavier you get. Reaching 'c' requires infinite energy.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};