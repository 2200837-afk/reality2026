
import React, { useState } from 'react';
import { Button } from './Button';
import { Info, AlertTriangle, Activity, Zap } from 'lucide-react';
import { SpeechControl } from './SpeechControl';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { ARBookmark } from './ARBookmark';

export const ExpDoppler: React.FC = () => {
  const [velocity, setVelocity] = useState(0); 
  usePageTracking("ExpDoppler");
  const { trackSlider } = useAnalytics();

  const baseWavelength = 550;
  const calculateWavelength = (v: number) => baseWavelength * Math.sqrt((1 - v) / (1 + v));
  const observedWavelength = calculateWavelength(velocity);

  const wavelengthToColor = (wavelength: number) => {
    let r, g, b;
    if (wavelength >= 380 && wavelength < 440) { r = -(wavelength - 440) / (440 - 380); g = 0; b = 1; } 
    else if (wavelength >= 440 && wavelength < 490) { r = 0; g = (wavelength - 440) / (490 - 440); b = 1; } 
    else if (wavelength >= 490 && wavelength < 510) { r = 0; g = 1; b = -(wavelength - 510) / (510 - 490); } 
    else if (wavelength >= 510 && wavelength < 580) { r = (wavelength - 510) / (580 - 510); g = 1; b = 0; } 
    else if (wavelength >= 580 && wavelength < 645) { r = 1; g = -(wavelength - 645) / (645 - 580); b = 0; } 
    else if (wavelength >= 645 && wavelength < 781) { r = 1; g = 0; b = 0; } 
    else {
      if (wavelength < 380) return '#440088'; // UV
      if (wavelength > 781) return '#880000'; // IR
      return '#000000';
    }
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const colorHex = wavelengthToColor(observedWavelength);
  const isInvisible = observedWavelength < 380 || observedWavelength > 780;
  
  const explanationText = Math.abs(velocity) < 0.05 
    ? "Stationary state. The spectral lines remain in their original green position."
    : velocity > 0 
        ? "Blueshift: Wavelengths are compressed. Frequency increases as you approach the source."
        : "Redshift: Wavelengths are stretched. Frequency decreases as you recede from the source.";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-space-800 p-6 rounded-xl border border-space-700">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="text-yellow-400" />
                  Relativistic Doppler Shift
                </h2>
                <p className="text-slate-300 mt-1">
                  Exploring the frequency modulation of light at extreme velocities.
                </p>
            </div>
        </div>

        {/* 2D Schematic Viewport */}
        <div className="relative w-full h-[350px] bg-space-900 rounded-xl overflow-hidden border border-space-600 shadow-inner flex flex-col items-center justify-center p-4">
             <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 50px)' }}></div>
             
             {/* Spectral Diagram */}
             <div className="relative z-10 w-full max-w-3xl space-y-12">
                <div className="flex flex-col items-center">
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-4">Waveform Visualisation (λ = {observedWavelength.toFixed(0)}nm)</div>
                    <div className="h-24 w-full flex items-center justify-center relative overflow-hidden bg-black/40 rounded-lg border border-space-700">
                        {/* Animated Wave SVG */}
                        <svg className="w-full h-full" viewBox="0 0 800 100">
                            <path 
                              d={`M 0 50 ${[...Array(40)].map((_, i) => `Q ${i * 20 + 10} ${i % 2 === 0 ? 20 : 80}, ${i * 20 + 20} 50`).join(' ')}`} 
                              fill="none" 
                              stroke={colorHex} 
                              strokeWidth="3"
                              className="transition-all duration-300"
                              style={{ 
                                strokeDasharray: '10, 5',
                                transform: `scaleX(${observedWavelength / 550})`,
                                transformOrigin: 'left'
                              }}
                            />
                        </svg>
                        {isInvisible && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3">
                             <AlertTriangle className="text-red-500" />
                             <span className="text-white font-bold uppercase tracking-widest text-sm">Invisible Spectrum: {observedWavelength < 380 ? 'UV' : 'IR'}</span>
                          </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="text-center bg-space-800/50 p-4 rounded-lg border border-space-700">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Observed Color</div>
                      <div className="h-10 w-full rounded border border-white/20 shadow-inner transition-colors duration-300" style={{ backgroundColor: colorHex }}></div>
                   </div>
                   <div className="text-center bg-space-800/50 p-4 rounded-lg border border-space-700">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Shift Type</div>
                      <div className={`text-xl font-bold uppercase ${velocity > 0 ? 'text-cyan-400' : velocity < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                        {velocity > 0 ? 'Blueshift' : velocity < 0 ? 'Redshift' : 'Rest'}
                      </div>
                   </div>
                </div>
             </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center text-sm">
             <span className="text-red-400 font-bold uppercase tracking-widest text-[10px]">Receding ←</span>
             <span className="text-slate-400 font-mono bg-space-900 px-3 py-1 rounded">
                v = {velocity > 0 ? '+' : ''}{velocity.toFixed(2)}c
             </span>
             <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">→ Approaching</span>
          </div>
          
          <input 
            type="range" min="-0.90" max="0.90" step="0.01" 
            value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-red-900 via-green-900 to-blue-900 rounded-lg appearance-none cursor-pointer accent-white"
          />

           <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-space-900 p-4 rounded border border-space-600">
                    <h4 className="text-[10px] text-slate-500 uppercase mb-2 font-bold">Spectral Mapping</h4>
                    <div className="relative h-10 w-full rounded bg-gradient-to-r from-purple-900 via-green-500 to-red-900 mb-2 overflow-hidden border border-space-700">
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white/30" style={{ left: '50%' }}></div>
                        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-300" style={{ left: `${Math.min(100, Math.max(0, ((observedWavelength - 300) / (800 - 300)) * 100))}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-600 uppercase font-mono">
                        <span>300nm</span>
                        <span>550nm</span>
                        <span>800nm</span>
                    </div>
                </div>

                <div className="bg-cyan-900/10 p-4 rounded border border-cyan-500/20">
                     <p className="text-sm text-slate-300 leading-relaxed italic">
                        {explanationText}
                     </p>
                     <SpeechControl text={explanationText} />
                </div>
           </div>
        </div>
      </div>

      <ARBookmark title="Spectral Doppler Interaction" simId="doppler" />
    </div>
  );
};
