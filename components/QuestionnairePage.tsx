import React, { useState } from 'react';
import { Button } from './Button';
import { db } from '../services/databaseService';
import { LearningStyleType } from '../types';
import { Check, ClipboardList } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: () => void;
}

// Data from O'Brien 1985 PDF
const QUESTIONS = [
  // SECTION ONE: VISUAL
  { id: 1, section: 'visual', text: "I enjoy doodling and even my notes have lots of pictures and arrows in them." },
  { id: 2, section: 'visual', text: "I remember something better if I write it down." },
  { id: 3, section: 'visual', text: "I get lost or am late if someone tells me how to get to a new place, and I don't write down the directions." },
  { id: 4, section: 'visual', text: "When trying to remember someone's telephone number, or something new like that, it helps me to get a picture of it in my mind." },
  { id: 5, section: 'visual', text: "If I am taking a test, I can 'see' the textbook page and where the answer is located." },
  { id: 6, section: 'visual', text: "It helps me to look at the person while listening; it keeps me focused." },
  { id: 7, section: 'visual', text: "Using flashcards helps me to retain material for tests." },
  { id: 8, section: 'visual', text: "It's hard for me to understand what a person is saying when there are people talking or music playing." },
  { id: 9, section: 'visual', text: "It's hard for me to understand a joke when someone tells me." },
  { id: 10, section: 'visual', text: "It is better for me to get work done in a quiet place." },

  // SECTION TWO: AUDITORY
  { id: 11, section: 'auditory', text: "My written work doesn't look neat to me. My papers have crossed-out words and erasures." },
  { id: 12, section: 'auditory', text: "It helps to use my finger as a pointer when reading to keep my place." },
  { id: 13, section: 'auditory', text: "Papers with very small print, blotchy dittos or poor copies are tough on me." },
  { id: 14, section: 'auditory', text: "I understand how to do something if someone tells me, rather than having to read the same thing to myself." },
  { id: 15, section: 'auditory', text: "I remember things that I hear, rather than things that I see or read." },
  { id: 16, section: 'auditory', text: "Writing is tiring. I press down too hard with my pen or pencil." },
  { id: 17, section: 'auditory', text: "My eyes get tired fast, even though the eye doctor says that my eyes are ok." },
  { id: 18, section: 'auditory', text: "When I read, I mix up words that look alike, such as 'them' and 'then', 'bad' and 'dad'." },
  { id: 19, section: 'auditory', text: "It's hard for me to read other people's handwriting." },
  { id: 20, section: 'auditory', text: "If I had the choice to learn new information through a lecture or textbook, I would choose to hear it rather than read it." },

  // SECTION THREE: KINESTHETIC
  { id: 21, section: 'kinesthetic', text: "I don't like to read directions; I'd rather just start doing." },
  { id: 22, section: 'kinesthetic', text: "I learn best when I am shown how to do something, and I have the opportunity to do it." },
  { id: 23, section: 'kinesthetic', text: "Studying at a desk is not for me." },
  { id: 24, section: 'kinesthetic', text: "I tend to solve problems through a more trial-and-error approach, rather than from a step-by-step method." },
  { id: 25, section: 'kinesthetic', text: "Before I follow directions, it helps me to see someone else do it first." },
  { id: 26, section: 'kinesthetic', text: "I find myself needing frequent breaks while studying." },
  { id: 27, section: 'kinesthetic', text: "I am not skilled in giving verbal explanations or directions." },
  { id: 28, section: 'kinesthetic', text: "I do not become easily lost, even in strange surroundings." },
  { id: 29, section: 'kinesthetic', text: "I think better when I have the freedom to move around." },
  { id: 30, section: 'kinesthetic', text: "When I can't think of a specific word, I'll use my hands a lot and call something a 'what-cha-ma-call-it' or a 'thing-a-ma-jig'." }
];

export const QuestionnairePage: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState(0); // 0=Vis, 1=Aud, 2=Kin, 3=Result

  const handleSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getSectionQuestions = (step: number) => {
    if (step === 0) return QUESTIONS.slice(0, 10);
    if (step === 1) return QUESTIONS.slice(10, 20);
    return QUESTIONS.slice(20, 30);
  };

  const calculateResults = () => {
    let visual = 0, auditory = 0, kinesthetic = 0;
    
    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 0;
      if (q.section === 'visual') visual += val;
      if (q.section === 'auditory') auditory += val;
      if (q.section === 'kinesthetic') kinesthetic += val;
    });

    let style: LearningStyleType = 'Multi-Sensory';
    const max = Math.max(visual, auditory, kinesthetic);
    
    // Simple logic: if one score is significantly higher (>2 pts) than others
    const scores = [
      { type: 'Visual', val: visual },
      { type: 'Auditory', val: auditory },
      { type: 'Kinesthetic', val: kinesthetic }
    ];
    
    const sorted = scores.sort((a,b) => b.val - a.val);
    if (sorted[0].val - sorted[1].val > 2) {
      style = sorted[0].type as LearningStyleType;
    }

    db.updateUserStyle(style, { visual, auditory, kinesthetic });
    
    return { style, visual, auditory, kinesthetic };
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      setCurrentStep(3);
    }
  };

  // Check if current section is fully answered
  const isSectionComplete = () => {
    const qs = getSectionQuestions(currentStep);
    return qs.every(q => answers[q.id] !== undefined);
  };

  if (currentStep === 3) {
    const result = calculateResults();
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
         <div className="max-w-lg w-full bg-space-800 rounded-2xl border border-space-700 p-8 text-center animate-in zoom-in-95">
            <h2 className="text-3xl font-bold text-white mb-4">Analysis Complete</h2>
            <p className="text-slate-400 mb-6">Based on your responses, your preferred learning style is:</p>
            
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8">
               {result.style} Learner
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-space-900 p-4 rounded border border-space-700">
                  <div className="text-xl font-bold text-cyan-400">{result.visual}</div>
                  <div className="text-xs text-slate-500 uppercase">Visual</div>
               </div>
               <div className="bg-space-900 p-4 rounded border border-space-700">
                  <div className="text-xl font-bold text-pink-400">{result.auditory}</div>
                  <div className="text-xs text-slate-500 uppercase">Auditory</div>
               </div>
               <div className="bg-space-900 p-4 rounded border border-space-700">
                  <div className="text-xl font-bold text-green-400">{result.kinesthetic}</div>
                  <div className="text-xs text-slate-500 uppercase">Kinesthetic</div>
               </div>
            </div>

            <p className="text-sm text-slate-400 mb-8">
               We have personalized the simulation experience to match your {result.style} preferences.
            </p>

            <Button onClick={onComplete} size="lg" className="w-full">
               Enter Simulation
            </Button>
         </div>
      </div>
    )
  }

  const sectionTitles = ["Visual Preference", "Auditory Preference", "Kinesthetic Preference"];

  return (
    <div className="min-h-screen bg-space-900 py-12 px-4">
       <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
             <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                <ClipboardList />
                <span className="font-bold uppercase tracking-wider">Learning Style Questionnaire</span>
             </div>
             <h1 className="text-3xl font-bold text-white">Section {currentStep + 1}: {sectionTitles[currentStep]}</h1>
             <p className="text-slate-400 mt-2">
                Evaluate each statement (1 = Never, 2 = Sometimes, 3 = Often)
             </p>
          </header>

          <div className="bg-space-800 rounded-2xl border border-space-700 p-8 shadow-xl space-y-8">
              {getSectionQuestions(currentStep).map((q) => (
                 <div key={q.id} className="border-b border-space-700 pb-6 last:border-0 last:pb-0">
                    <p className="text-lg text-slate-200 mb-4">{q.id}. {q.text}</p>
                    <div className="flex gap-4">
                       {[1, 2, 3].map((val) => (
                         <label key={val} className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${answers[q.id] === val ? 'bg-cyan-900/50 border-cyan-500 text-white' : 'bg-space-900 border-space-600 text-slate-400 hover:bg-space-700'}`}>
                            <input 
                              type="radio" 
                              name={`q-${q.id}`} 
                              value={val} 
                              checked={answers[q.id] === val} 
                              onChange={() => handleSelect(q.id, val)}
                              className="hidden"
                            />
                            {answers[q.id] === val && <Check size={16} />}
                            <span className="font-bold">
                               {val === 1 && "Never"}
                               {val === 2 && "Sometimes"}
                               {val === 3 && "Often"}
                            </span>
                         </label>
                       ))}
                    </div>
                 </div>
              ))}

              <div className="pt-6">
                 <Button 
                   onClick={handleNext} 
                   disabled={!isSectionComplete()} 
                   size="lg" 
                   className="w-full"
                 >
                   {currentStep === 2 ? "Finish & Analyze" : "Next Section"}
                 </Button>
              </div>
          </div>
          
          <div className="text-center mt-6 text-slate-500 text-sm">
             Questionnaire based on O'Brien (1985)
          </div>
       </div>
    </div>
  );
};