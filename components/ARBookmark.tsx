
import React from 'react';
import { QrCode, Smartphone, ExternalLink, Info } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface ARBookmarkProps {
  title: string;
  simId: string;
}

export const ARBookmark: React.FC<ARBookmarkProps> = ({ title, simId }) => {
  const { trackARInteraction } = useAnalytics();
  
  // Use a special mode 'ar-only' that triggers a full-screen dedicated AR experience
  const baseUrl = window.location.origin + window.location.pathname;
  const deepLinkUrl = `${baseUrl}?mode=ar-only&sim=${simId}`;
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deepLinkUrl)}`;

  const handleManualTrigger = () => {
      trackARInteraction(simId, `qr_manual_launch_${simId}`);
      // Open in a new tab to simulate what the phone would do
      window.open(deepLinkUrl, '_blank');
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
          <span className="font-bold uppercase tracking-widest text-sm">Dedicated AR Manifestation</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Immersive Scene: {title}</h3>
        <p className="text-slate-400 text-sm max-w-md">
          Scan this with your mobile phone. It will open a <strong>standalone AR manifestation</strong> of the {title} experiment, overlaying the 3D physics model directly onto your physical surroundings.
        </p>
        
        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-space-900 px-3 py-1.5 rounded-full border border-space-700">
            <Smartphone size={14} /> Mobile View Optimized
          </div>
          <button 
            onClick={handleManualTrigger}
            className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
          >
            <ExternalLink size={14} /> Test AR Route
          </button>
        </div>
      </div>

      <div className="hidden lg:block w-px h-24 bg-space-700"></div>

      <div className="hidden lg:flex flex-col gap-2">
         <div className="flex items-start gap-3 max-w-[200px]">
            <div className="mt-1"><Info size={14} className="text-cyan-500" /></div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Deep Linking: This route strips away the website UI for a pure AR camera experience on your device.
            </p>
         </div>
      </div>
    </div>
  );
};
