
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakExplanation } from '../services/ttsService';
import { VoicePersona } from '../types';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface SpeechControlProps {
  text: string;
}

export const SpeechControl: React.FC<SpeechControlProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [persona, setPersona] = useState<VoicePersona>('SISTER');
  const { trackVoiceInteraction } = useAnalytics();

  const handleSpeak = async () => {
    if (isPlaying) return;
    
    // Log the interaction with full text context
    trackVoiceInteraction(persona, text);
    
    setIsPlaying(true);
    await speakExplanation(text, persona);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3 mt-4 bg-black/20 p-2 rounded-lg w-full">
       <div className="text-xs text-slate-400 font-bold uppercase mr-2">Narrator:</div>
       
       <div className="flex gap-2">
         <button 
            type="button"
            onClick={() => setPersona('HEADMASTER')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${persona === 'HEADMASTER' ? 'bg-cyan-900 border-cyan-500 text-white' : 'bg-space-800 border-space-600 text-slate-400 hover:text-white'}`}
         >
            Headmaster
         </button>
         <button 
            type="button"
            onClick={() => setPersona('SISTER')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${persona === 'SISTER' ? 'bg-pink-900 border-pink-500 text-white' : 'bg-space-800 border-space-600 text-slate-400 hover:text-white'}`}
         >
            Sister
         </button>
         <button 
            type="button"
            onClick={() => setPersona('REBEL')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${persona === 'REBEL' ? 'bg-orange-900 border-orange-500 text-white' : 'bg-space-800 border-space-600 text-slate-400 hover:text-white'}`}
         >
            Rebel
         </button>
       </div>

       <div className="flex-1"></div>

       <button 
         type="button"
         onClick={handleSpeak}
         disabled={isPlaying}
         className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
       >
          {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span className="text-sm font-bold">{isPlaying ? 'Speaking...' : 'Listen'}</span>
       </button>
    </div>
  );
};
