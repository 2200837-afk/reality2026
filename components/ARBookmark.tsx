
import React from 'react';
import { QrCode, Smartphone, ExternalLink, Info } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface ARBookmarkProps {
  title: string;
  simId: string;
}

export const ARBookmark: React.FC<ARBookmarkProps> = ({ title, simId }) => {
  const { trackARInteraction } = useAnalytics();
  
  // Construct a clean deep-link URL for Vercel/Production
  // We use window.location.origin to get the base domain and append params
  const baseUrl = window.location.origin + window.location.pathname;
  const deepLinkUrl = `${baseUrl}?mode=ar&sim=${simId}`;
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deepLinkUrl)}`;

  const handleManualTrigger = () => {
      trackARInteraction(simId, `qr_manual_launch_${simId}`);
  };

  return (
    <div className="mt-12 bg-space-800 border-2 border-dashed border-space-600 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-cyan-500/50 transition-all duration-300">
      <div 
        className="bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-cyan-500/20 transition-all cursor-pointer"
        onClick={handleManualTrigger}
      >
        <img src={qrUrl} alt="QR Code for AR" className="w-32 h-32" />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 mb-2">
          <QrCode size={20} />
          <span className="font-bold uppercase tracking-widest text-sm">AR Interaction Trigger</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Launch Immersive AR: {title}</h3>
        <p className="text-slate-400 text-sm max-w-md">
          Scan this bookmark with your mobile device to manifest the relativistic 3D model in your physical space. 
          The mobile lens will focus specifically on the <strong>{title}</strong> simulation.
        </p>
        
        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-space-900 px-3 py-1.5 rounded-full border border-space-700">
            <Smartphone size={14} /> Mobile Optimized
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-space-900 px-3 py-1.5 rounded-full border border-space-700">
            <ExternalLink size={14} /> Direct Deep Link
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px h-24 bg-space-700"></div>

      <div className="hidden lg:flex flex-col gap-2">
         <div className="flex items-start gap-3 max-w-[200px]">
            <div className="mt-1"><Info size={14} className="text-cyan-500" /></div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Deep Linking: This QR code bypasses the home screen to land exactly on the {simId} experiment context.
            </p>
         </div>
      </div>
    </div>
  );
};
