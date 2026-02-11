import React from 'react';
import { Database, Brain, Activity, LineChart, Target, Check, PieChart, Network, Binary } from 'lucide-react';
import { usePageTracking } from '../contexts/AnalyticsContext';

export const ResearchPage: React.FC = () => {
  usePageTracking("ResearchPage");

  // Matrix Data Structure
  const variableMatrix = [
    {
      idv: "Parameter Control Interaction",
      conceptual: true, problemSolving: true, retention: true, application: false,
      engagement: false, motivation: false, persistence: false,
      accuracy: true, time: true, improvement: true
    },
    {
      idv: "AR-Based Visualization",
      conceptual: true, problemSolving: false, retention: true, application: true,
      engagement: true, motivation: true, persistence: false,
      accuracy: false, time: false, improvement: false
    },
    {
      idv: "Manipulation & Object Interaction",
      conceptual: true, problemSolving: true, retention: false, application: true,
      engagement: true, motivation: false, persistence: true,
      accuracy: true, time: true, improvement: false
    },
    {
      idv: "Learning Task Design",
      conceptual: true, problemSolving: true, retention: true, application: true,
      engagement: true, motivation: true, persistence: true,
      accuracy: false, time: false, improvement: true
    },
    {
      idv: "System Responsiveness & Feedback",
      conceptual: true, problemSolving: true, retention: false, application: true,
      engagement: true, motivation: true, persistence: true,
      accuracy: true, time: true, improvement: true
    }
  ];

  const CheckMark = ({ active }: { active: boolean }) => (
    <div className={`flex items-center justify-center h-full w-full ${active ? 'opacity-100' : 'opacity-10'}`}>
        {active ? <Check size={18} className="text-cyan-400" strokeWidth={3} /> : <div className="w-1 h-1 bg-slate-700 rounded-full"></div>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Research Framework</h1>
        <p className="text-xl text-cyan-400 max-w-3xl mx-auto">
          Analyzing the intersection of Augmented Reality, Physics Education, and Learning Analytics.
        </p>
      </div>

      {/* IDV / DV Matrix Table */}
      <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
              <Activity className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Variable Relationship Matrix</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
              Mapping Independent Variables (System Features) to Dependent Variables (Learning Outcomes).
          </p>

          <div className="overflow-x-auto rounded-xl border border-space-700 bg-space-800/50 shadow-2xl">
              <table className="w-full min-w-[1000px] border-collapse">
                  <thead>
                      {/* Top Header Row (Categories) */}
                      <tr>
                          <th className="p-4 border-b border-r border-space-600 bg-space-900/80 text-left min-w-[200px]">
                              <div className="flex flex-col text-xs uppercase tracking-widest text-slate-500 font-bold">
                                  <span>DV &rarr;</span>
                                  <span className="mt-2 text-white">INV &darr;</span>
                              </div>
                          </th>
                          
                          <th colSpan={4} className="p-4 border-b border-r border-space-600 bg-blue-900/20 text-blue-200 font-bold">
                              Cognitive / Learning Performance
                          </th>
                          <th colSpan={3} className="p-4 border-b border-r border-space-600 bg-purple-900/20 text-purple-200 font-bold">
                              Engagement & Motivation
                          </th>
                          <th colSpan={3} className="p-4 border-b border-space-600 bg-green-900/20 text-green-200 font-bold">
                              Assessment Outcomes
                          </th>
                      </tr>

                      {/* Sub Header Row (Specific Metrics) */}
                      <tr className="text-xs font-bold text-slate-300">
                          <th className="p-4 border-b border-r border-space-600 bg-space-900 text-left">
                              Independent Variables (System Features)
                          </th>
                          {/* Cognitive */}
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Conceptual Understanding</th>
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Problem-Solving Skill</th>
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Retention</th>
                          <th className="p-2 border-b border-r border-space-600 bg-space-800 w-24">Relativity Theory Application</th>
                          {/* Engagement */}
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Engagement</th>
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Motivation</th>
                          <th className="p-2 border-b border-r border-space-600 bg-space-800 w-24">Persistence</th>
                          {/* Assessment */}
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Accuracy</th>
                          <th className="p-2 border-b border-r border-space-700 bg-space-800 w-24">Completion Time</th>
                          <th className="p-2 border-b border-space-700 bg-space-800 w-24">Improvement</th>
                      </tr>
                  </thead>
                  <tbody>
                      {variableMatrix.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 border-b border-r border-space-700 font-medium text-slate-200 text-sm">
                                  {row.idv}
                              </td>
                              {/* Cognitive Data */}
                              <td className="border-b border-r border-space-700"><CheckMark active={row.conceptual} /></td>
                              <td className="border-b border-r border-space-700"><CheckMark active={row.problemSolving} /></td>
                              <td className="border-b border-r border-space-700"><CheckMark active={row.retention} /></td>
                              <td className="border-b border-r border-space-600"><CheckMark active={row.application} /></td>
                              {/* Engagement Data */}
                              <td className="border-b border-r border-space-700"><CheckMark active={row.engagement} /></td>
                              <td className="border-b border-r border-space-700"><CheckMark active={row.motivation} /></td>
                              <td className="border-b border-r border-space-600"><CheckMark active={row.persistence} /></td>
                              {/* Assessment Data */}
                              <td className="border-b border-r border-space-700"><CheckMark active={row.accuracy} /></td>
                              <td className="border-b border-r border-space-700"><CheckMark active={row.time} /></td>
                              <td className="border-b border-space-700"><CheckMark active={row.improvement} /></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Stage 2 Roadmap */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-space-700">
         <div className="bg-space-800 p-6 rounded-xl border border-space-600 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-400">
               <Database size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">1. Descriptive Analytics</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Clean & normalize logs</li>
                <li>Usage Volume (Trimmed Means)</li>
                <li>Engagement Rhythm (STL)</li>
                <li>Sequencing (N-gram/Entropy)</li>
                <li>Visualisation via Power BI</li>
            </ul>
         </div>

         <div className="bg-space-800 p-6 rounded-xl border border-space-600 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 text-purple-400">
               <PieChart size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">2. Clustering Analysis</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Identify Learner Archetypes</li>
                <li>Algorithms: K-means, GMM, SpectralNet</li>
                <li>Metrics: Silhouette Score, AIC/BIC</li>
                <li>Group by Pace & Style</li>
            </ul>
         </div>

         <div className="bg-space-800 p-6 rounded-xl border border-space-600 hover:border-pink-500/50 transition-colors">
            <div className="w-12 h-12 bg-pink-900/50 rounded-lg flex items-center justify-center mb-4 text-pink-400">
               <Network size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">3. Predictive Modeling</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Models: XGBoost, LSTM, Bi-LSTM</li>
                <li>Engagement Detection</li>
                <li>Dropout Prediction</li>
                <li>AR Usage Forecasting</li>
                <li>Performance Estimation</li>
            </ul>
         </div>

         <div className="bg-space-800 p-6 rounded-xl border border-space-600 hover:border-green-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-4 text-green-400">
               <Brain size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">4. Explanation Layer</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>SHAP Values Integration</li>
                <li>Feature Importance</li>
                <li>Model Transparency</li>
                <li>Educator Insights Dashboard</li>
            </ul>
         </div>
      </div>

    </div>
  );
};