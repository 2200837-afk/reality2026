
import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircle, XCircle, Award, RotateCcw, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { db } from '../services/databaseService';

interface QuizPageProps {
  onComplete?: () => void;
  goToFeedback?: () => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "According to the Second Postulate of Special Relativity, the speed of light in a vacuum is:",
    options: [
      "Faster if the source is moving towards you",
      "Slower if the source is moving away from you",
      "Constant for all observers, regardless of motion",
      "Dependent on the gravity of nearby stars"
    ],
    correctIndex: 2,
    explanation: "The speed of light (c) is a universal constant (approx 300,000 km/s) and remains the same for all observers, no matter how fast they are moving."
  },
  {
    id: 2,
    text: "In the Twin Paradox, why does the traveling twin return younger than the earthbound twin?",
    options: [
      "Biology works differently in space",
      "The traveling twin accelerates (changes inertial frames), breaking symmetry",
      "The earthbound twin was closer to the sun's gravity",
      "Time dilation only affects mechanical clocks, not humans"
    ],
    correctIndex: 1,
    explanation: "While velocity is relative, acceleration is absolute. The traveling twin turns around to return, switching inertial frames, which distinguishes their timeline from the Earth twin."
  },
  {
    id: 3,
    text: "What happens to the length of an object as it approaches the speed of light?",
    options: [
      "It expands in all directions",
      "It contracts (shrinks) only in the direction of motion",
      "It contracts in all directions",
      "Its length remains unchanged"
    ],
    correctIndex: 1,
    explanation: "This is Length Contraction. Objects appear shorter along the axis of travel relative to a stationary observer."
  },
  {
    id: 4,
    text: "If a spaceship travels towards a star at 0.5c, what color shift will the astronaut observe?",
    options: [
      "Redshift (Lower frequency)",
      "Blueshift (Higher frequency)",
      "No shift (Green stays Green)",
      "Grayscale shift"
    ],
    correctIndex: 1,
    explanation: "Doppler Effect: Moving towards a light source compresses the waves, increasing frequency and shifting visible light towards the Blue/Violet end of the spectrum."
  },
  {
    id: 5,
    text: "In the Train-Tunnel paradox, why does the tunnel observer think the train fits inside?",
    options: [
      "The tunnel gets longer",
      "The train gets shorter due to length contraction",
      "The driver brakes just in time",
      "It's an optical illusion"
    ],
    correctIndex: 1,
    explanation: "From the tunnel's perspective (stationary), the moving train undergoes length contraction, making it physically shorter than its rest length."
  },
  {
    id: 6,
    text: "Two events happen simultaneously in a stationary frame. To a moving observer, they are:",
    options: [
      "Always simultaneous",
      "Never simultaneous",
      "Not necessarily simultaneous (Relativity of Simultaneity)",
      "Backwards in time"
    ],
    correctIndex: 2,
    explanation: "Simultaneity is relative. Observers in relative motion will disagree on the timing of events separated by space."
  },
  {
    id: 7,
    text: "As an object with mass approaches the speed of light, its relativistic mass (energy required to accelerate it):",
    options: [
      "Decreases to zero",
      "Remains constant",
      "Increases towards infinity",
      "Fluctuates randomly"
    ],
    correctIndex: 2,
    explanation: "As v approaches c, the gamma factor approaches infinity. This means it would take infinite energy to accelerate a massive object to the speed of light."
  },
  {
    id: 8,
    text: "What is the Gamma factor (γ) at 0 velocity?",
    options: [
      "0",
      "1",
      "Infinity",
      "0.5"
    ],
    correctIndex: 1,
    explanation: "At rest (v=0), gamma = 1 / sqrt(1 - 0) = 1. This means time flows normally and length is normal."
  },
  {
    id: 9,
    text: "If you could travel at 99.9% the speed of light, how would the universe look ahead of you?",
    options: [
      "Pitch black",
      "Stars would spread out evenly",
      "Stars would cluster in front of you (Aberration) and shift color",
      "Everything would look blurry"
    ],
    correctIndex: 2,
    explanation: "Relativistic Aberration causes the field of view to warp, making stars appear to bunch up in the direction of travel."
  },
  {
    id: 10,
    text: "Which equation famously relates mass and energy in relativity?",
    options: [
      "F = ma",
      "E = mc²",
      "a² + b² = c²",
      "PV = nRT"
    ],
    correctIndex: 1,
    explanation: "Einstein's E=mc² shows that mass and energy are interchangeable."
  }
];

export const QuizPage: React.FC<QuizPageProps> = ({ onComplete, goToFeedback }) => {
  usePageTracking("QuizPage");
  const { trackClick } = useAnalytics();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = async () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (onComplete) onComplete();
      const user = db.getUser();
      if (user) {
        await db.saveQuizResult({
          userId: user.id,
          score: score,
          totalQuestions: QUESTIONS.length
        });
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = (score / QUESTIONS.length) * 100;
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center p-4 gap-8">
        {/* Thank You Alert Block */}
        <div className="max-w-md w-full bg-green-950/20 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-lg">
           <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0">
             <CheckCircle size={28} />
           </div>
           <div>
             <h3 className="font-bold text-white">Thank You!</h3>
             <p className="text-slate-400 text-sm">Your aptitude assessment has been successfully logged to our research database.</p>
           </div>
        </div>

        <div className="max-w-md w-full bg-space-800 rounded-2xl border border-space-700 p-8 text-center animate-in zoom-in-95 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
           <Award size={80} className="text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
           <h2 className="text-3xl font-bold text-white mb-2">Researcher Certified!</h2>
           <p className="text-slate-400 mb-6 italic">You have successfully navigated the paradoxes of special relativity.</p>
           <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-8">{percentage}%</div>
           <div className="text-slate-500 text-sm mb-8">Score: {score} out of {QUESTIONS.length}</div>
           
           <div className="space-y-3">
              <Button onClick={goToFeedback} size="lg" className="w-full flex items-center justify-center gap-2 group">
                 Proceed to Feedback <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleRetry} variant="secondary" size="md" className="w-full flex items-center justify-center gap-2 opacity-50 hover:opacity-100">
                 <RotateCcw size={16} /> Re-run Examination
              </Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:py-8 lg:py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <HelpCircle className="text-cyan-400" />
             Aptitude Assessment
           </h1>
           <p className="text-slate-400 text-sm mt-1">Validation of relativistic conceptual mastery</p>
         </div>
         <div className="flex items-center gap-6">
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Progress</div>
             <div className="text-white font-mono text-xl">{currentQuestionIdx + 1} / {QUESTIONS.length}</div>
           </div>
           <div className="h-10 w-px bg-space-700"></div>
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
             <div className="text-cyan-400 font-mono text-xl font-bold">{score} Correct</div>
           </div>
         </div>
      </div>

      <div className="bg-space-800 rounded-3xl border border-space-700 p-8 md:p-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
         
         <h2 className="text-2xl font-medium text-white mb-10 leading-relaxed relative z-10">
           {currentQuestion.text}
         </h2>
         
         <div className="grid grid-cols-1 gap-4 relative z-10">
            {currentQuestion.options.map((option, idx) => {
               const isCorrect = idx === currentQuestion.correctIndex;
               const isSelected = idx === selectedOption;
               
               let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ";
               if (!isAnswered) {
                 buttonClass += isSelected 
                    ? "bg-cyan-900/40 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                    : "bg-space-900 border-space-700 text-slate-400 hover:border-space-500 hover:text-white";
               } else {
                 if (isCorrect) buttonClass += "bg-green-900/40 border-green-500 text-white";
                 else if (isSelected) buttonClass += "bg-red-900/40 border-red-500 text-white";
                 else buttonClass += "bg-space-900 border-space-800 text-slate-600 opacity-50";
               }

               return (
                 <button
                   key={idx}
                   onClick={() => handleSelect(idx)}
                   disabled={isAnswered}
                   className={buttonClass}
                 >
                    <span className="flex-1 pr-4">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle className="text-green-500 shrink-0" size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" size={20} />}
                 </button>
               );
            })}
         </div>

         {isAnswered ? (
            <div className="mt-10 pt-8 border-t border-space-700 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-4 mb-8 bg-space-900/50 p-4 rounded-2xl border border-space-700">
                  <div className={`p-2 rounded-lg ${selectedOption === currentQuestion.correctIndex ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Scientific Insight</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleNext} className="px-10 py-4 text-lg">
                    {currentQuestionIdx === QUESTIONS.length - 1 ? 'View Final Results' : 'Proceed to Next Paradox'}
                  </Button>
                </div>
            </div>
         ) : (
            <div className="mt-10 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
                className="px-12 py-4 text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Submit Answer
              </Button>
            </div>
         )}
      </div>

      <div className="mt-12 w-full h-1 bg-space-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-500 transition-all duration-1000 ease-out"
          style={{ width: `${((currentQuestionIdx + (isAnswered ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
