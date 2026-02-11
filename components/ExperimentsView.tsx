import React, { useState } from 'react';
import { ExpDoppler } from './ExpDoppler';
import { ExpSimultaneity } from './ExpSimultaneity';
import { ExpTwin } from './ExpTwin';
import { ExpTrainTunnel } from './ExpTrainTunnel';
import { ArrowLeft, Radio, TrainFront, Users, Zap } from 'lucide-react';

type ExperimentType = 'DOPPLER' | 'SIMULTANEITY' | 'TWIN' | 'TRAIN' | null;

export const ExperimentsView: React.FC = () => {
  const [activeExp, setActiveExp] = useState<ExperimentType>(null);

  const experiments = [
    {
      id: 'DOPPLER',
      title: 'Doppler Shift',
      desc: 'Visualize how light changes color as you approach the speed of light.',
      icon: <Zap className="text-yellow-400" size={32} />,
      color: 'hover:border-yellow-500/50'
    },
    {
      id: 'SIMULTANEITY',
      title: 'Simultaneity',
      desc: 'Why "now" means something different for moving observers.',
      icon: <Radio className="text-green-400" size={32} />,
      color: 'hover:border-green-500/50'
    },
    {
      id: 'TWIN',
      title: 'Twin Paradox',
      desc: 'Calculate how much younger a space traveler returns compared to their twin.',
      icon: <Users className="text-purple-400" size={32} />,
      color: 'hover:border-purple-500/50'
    },
    {
      id: 'TRAIN',
      title: 'Train & Tunnel',
      desc: 'Can a long train fit in a short tunnel? Exploring length contraction.',
      icon: <TrainFront className="text-cyan-400" size={32} />,
      color: 'hover:border-cyan-500/50'
    }
  ];

  const renderActiveExperiment = () => {
    switch (activeExp) {
        case 'DOPPLER': return <ExpDoppler />;
        case 'SIMULTANEITY': return <ExpSimultaneity />;
        case 'TWIN': return <ExpTwin />;
        case 'TRAIN': return <ExpTrainTunnel />;
        default: return null;
    }
  };

  if (activeExp) {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <button 
                onClick={() => setActiveExp(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Experiments
            </button>
            {renderActiveExperiment()}
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Thought Experiments</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
            Einstein used "Gedankenexperiments" (thought experiments) to uncover the secrets of the universe. 
            Select a paradox below to explore it interactively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {experiments.map((exp) => (
            <div 
                key={exp.id}
                onClick={() => setActiveExp(exp.id as ExperimentType)}
                className={`bg-space-800 p-8 rounded-xl border border-space-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${exp.color} group`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-space-900 rounded-lg border border-space-600 group-hover:border-white/20 transition-colors">
                        {exp.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 text-sm font-bold flex items-center gap-1">
                        Explore <ArrowLeft className="rotate-180" size={14} />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                <p className="text-slate-400">{exp.desc}</p>
            </div>
        ))}
      </div>
    </div>
  );
};