
import React, { useState, useRef, useEffect } from 'react';
import { chatWithEinstein } from '../services/geminiService';
import { Button } from './Button';
import { Send, User, Sparkles, Brain, Clock, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types';

export const ChatTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Greetings, fellow explorer of the cosmos. I am a digital projection of Albert Einstein. We are here to ponder the deep mysteries of space and time. What puzzles you about the relative nature of our universe?",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithEinstein(history, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-5xl mx-auto bg-space-800 rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* Dynamic Header */}
      <div className="p-6 border-b border-white/5 bg-space-900/50 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 overflow-hidden border border-white/20 shadow-lg">
                 <img src="https://picsum.photos/seed/physics/200/200" alt="Einstein" className="w-full h-full object-cover grayscale opacity-80 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-cyan-500/10"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-space-900 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          </div>
          <div>
            <h2 className="font-black text-xl text-white tracking-tight">Albert Einstein</h2>
            <p className="text-xs text-cyan-400 flex items-center gap-1.5 font-bold uppercase tracking-widest">
              <Sparkles size={12} className="animate-spin-slow" /> Neural Mind • Gemini 3 Pro
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Logic Engine</span>
              <span className="text-xs text-slate-300 font-mono">NOMINAL</span>
            </div>
            <div className="w-px h-8 bg-white/5"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Latency</span>
              <span className="text-xs text-slate-300 font-mono">1.2ms</span>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(circle_at_bottom,_#151932_0%,_#0b0d17_100%)] scrollbar-hide"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-800'}`}>
              {msg.role === 'user' ? <User size={18} /> : <Brain size={18} className="text-cyan-400" />}
            </div>
            <div 
              className={`max-w-[75%] rounded-[24px] px-6 py-4 text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/10 text-cyan-50 border border-cyan-500/20 rounded-tr-none shadow-[0_10px_30px_rgba(6,182,212,0.05)]' 
                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm'
              }`}
            >
              {msg.text}
              <div className={`text-[10px] mt-2 font-mono opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                <Brain size={18} className="text-cyan-400 animate-pulse" />
             </div>
             <div className="bg-white/5 px-6 py-4 rounded-[24px] rounded-tl-none border border-white/10 backdrop-blur-sm shadow-xl">
               <div className="flex gap-2 h-4 items-center">
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Futuristic Input Panel */}
      <div className="p-6 bg-space-900/80 backdrop-blur-xl border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-4 items-center"
        >
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about time dilation, E=mc², or the curvature of space..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 shadow-inner group-hover:border-white/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button type="button" className="p-2 text-slate-600 hover:text-cyan-400 transition-colors">
                  <Clock size={18} />
                </button>
            </div>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !input.trim()}
            className="h-[60px] w-[60px] rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Send size={24} />
          </Button>
        </form>
        <div className="mt-4 flex justify-between items-center px-2">
          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">Quantum channel: Encrypted</p>
          <div className="flex gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             <span className="cursor-pointer hover:text-cyan-400">Clear Logs</span>
             <span className="cursor-pointer hover:text-cyan-400">Export Conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
