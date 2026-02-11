
import React, { useState } from 'react';
import { Button } from './Button';
import { db } from '../services/databaseService';
import { usePageTracking } from '../contexts/AnalyticsContext';
import { Send, CheckCircle, HelpCircle, ArrowLeft, Heart } from 'lucide-react';

interface FeedbackPageProps {
  onComplete?: () => void;
  goToQuiz?: () => void;
}

interface Question {
  id: string;
  text: string;
}

const SECTIONS = [
  {
    title: "1. Parameter Control Interaction",
    questions: [
      { id: 'sec1_q1', text: "I found it easy to adjust the velocity sliders to change the speed." },
      { id: 'sec1_q2', text: "Changing the velocity helped me visualize the changes in Time Dilation directly." },
      { id: 'sec1_q3', text: "The system was responsive when I adjusted the parameters." },
      { id: 'sec1_q4', text: "The controls allowed me to explore 'what-if' scenarios effectively." }
    ]
  },
  {
    title: "2. AR-Based Visualization",
    questions: [
      { id: 'sec2_q1', text: "The AR objects (spaceships/planets) appeared realistic in my environment." },
      { id: 'sec2_q2', text: "Seeing the 3D models in my space helped me visualize physics concepts better than 2D diagrams." },
      { id: 'sec2_q3', text: "The AR view was stable and easy to observe from different angles." },
      { id: 'sec2_q4', text: "The AR overlay made abstract physics concepts feel more concrete." }
    ]
  },
  {
    title: "3. Manipulation & Object Interaction",
    questions: [
      { id: 'sec3_q1', text: "Rotating and viewing the 3D objects using touch/mouse was intuitive." },
      { id: 'sec3_q2', text: "Manipulating the viewing angle helped clarify the paradoxes." },
      { id: 'sec3_q3', text: "Switching between different reference frames (e.g., Train vs Tunnel) was easy." },
      { id: 'sec3_q4', text: "The interactive elements helped me feel in control of the simulation." }
    ]
  },
  {
    title: "4. Learning Task Design",
    questions: [
      { id: 'sec4_q1', text: "The sequence of experiments (Doppler → Paradoxes) was logical." },
      { id: 'sec4_q2', text: "The instructions and 'What is Happening' explanations were clear." },
      { id: 'sec4_q3', text: "The tasks challenged my understanding appropriately (not too difficult or too easy)." },
      { id: 'sec4_q4', text: "The guided text helped me discover the answers independently." }
    ]
  },
  {
    title: "5. System Responsiveness & Feedback",
    questions: [
      { id: 'sec5_q1', text: "The AI Narrator’s explanations were helpful." },
      { id: 'sec5_q2', text: "The visual cues (e.g., color shifts, length changes) provided clear feedback on my actions." },
      { id: 'sec5_q3', text: "The interface was smooth and lag-free during interactions." },
      { id: 'sec5_q4', text: "The system effectively guided me when I was stuck." }
    ]
  },
  {
    title: "6. Cognitive / Learning Performance",
    questions: [
      { id: 'sec6_q1', text: "I can clearly visualize Time Dilation in my mind now." },
      { id: 'sec6_q2', text: "I feel confident applying these concepts to solve physics problems." },
      { id: 'sec6_q3', text: "I believe I will remember these concepts better than if I had just read a book." },
      { id: 'sec6_q4', text: "I can explain the Twins Paradox to someone else correctly." }
    ]
  },
  {
    title: "7. Engagement & Motivation",
    questions: [
      { id: 'sec7_q1', text: "I felt fully immersed and focused while using the app." },
      { id: 'sec7_q2', text: "I was curious to explore every feature and experiment." },
      { id: 'sec7_q3', text: "I kept trying until I understood the paradoxes, even when they were confusing." },
      { id: 'sec7_q4', text: "Learning physics this way was fun and interesting." }
    ]
  },
  {
    title: "8. Assessment Outcomes",
    questions: [
      { id: 'sec8_q1', text: "I felt my answers in the quiz accurately reflected what I learned." },
      { id: 'sec8_q2', text: "I was able to understand the scenarios quickly." },
      { id: 'sec8_q3', text: "My understanding improved significantly from the start to the end of the session." },
      { id: 'sec8_q4', text: "I feel more capable of learning complex physics topics now." }
    ]
  }
];

const OPEN_QUESTIONS = [
  { id: 'open_1', text: "Please describe your overall experience using the AR learning system. What aspects did you find most engaging or enjoyable?" },
  { id: 'open_2', text: "How did using the AR system impact your understanding of the physics concepts? Please explain any specific improvements or challenges you noticed." },
  { id: 'open_3', text: "Were there any aspects of the system that you found particularly difficult to use or understand? Please describe the difficulties and suggest possible improvements." },
  { id: 'open_4', text: "Do you have any suggestions to improve the system’s functionality or interactive features? Please describe any changes or additions that could make the system work more effectively." },
  { id: 'open_5', text: "Do you have any suggestions to improve the interface design of the AR learning system? Please describe any changes that could enhance usability, navigation, or overall user experience." },
  { id: 'open_6', text: "Is there anything else you would like to share about your experience, the content, or the AR system in general?" }
];

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onComplete, goToQuiz }) => {
  usePageTracking("FeedbackPage");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [openEnded, setOpenEnded] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.getUser();
    if (user) {
      db.saveFeedback({
        userId: user.id,
        ratings,
        openEnded
      });
      setSubmitted(true);
      if (onComplete) onComplete();
      window.scrollTo(0, 0);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center p-4 text-center gap-8">
        {/* Thank You Alert Block */}
        <div className="max-w-md w-full bg-purple-950/20 border border-purple-500/30 rounded-2xl p-6 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-lg">
           <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white shrink-0">
             <Heart size={28} />
           </div>
           <div className="text-left">
             <h3 className="font-bold text-white">Your voice matters!</h3>
             <p className="text-slate-400 text-sm">Thank you for helping us improve immersive physics education with your feedback.</p>
           </div>
        </div>

        <div className="bg-space-800 p-8 rounded-2xl border border-space-700 max-w-md w-full shadow-2xl animate-in zoom-in-95">
          <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Submission Complete</h2>
          <p className="text-slate-400 mb-8">Your contributions are essential to our research. We've archived your responses.</p>
          
          <Button onClick={goToQuiz} variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 group">
             Back to Aptitude Quiz <ArrowLeft className="group-hover:-translate-x-1 transition-transform rotate-180" size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">User Experience Survey</h1>
        <p className="text-slate-400">Please provide honest feedback to help us refine the system.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="bg-space-800 rounded-2xl border border-space-700 overflow-hidden shadow-lg">
            <div className="bg-space-900 px-6 py-4 border-b border-space-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">{section.title}</h2>
              <div className="hidden md:flex gap-4 text-[10px] uppercase font-bold text-slate-500">
                <span>Disagree</span>
                <span>Agree</span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {section.questions.map((q) => (
                <div key={q.id} className="space-y-4">
                  <p className="text-slate-200 text-lg">{q.text}</p>
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRatings(prev => ({ ...prev, [q.id]: val }))}
                        className={`py-3 rounded-lg border transition-all text-sm font-bold flex flex-col items-center gap-1 ${
                          ratings[q.id] === val 
                            ? 'bg-cyan-600 border-cyan-400 text-white' 
                            : 'bg-space-900 border-space-600 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {val}
                        <span className="text-[8px] opacity-60 hidden md:block">
                           {val === 1 ? 'S. Disagree' : val === 5 ? 'S. Agree' : val === 3 ? 'Neutral' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-space-800 rounded-2xl border border-space-700 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-purple-400" />
            9. Open-Ended Feedback
          </h2>
          <div className="space-y-8">
            {OPEN_QUESTIONS.map((q) => (
              <div key={q.id}>
                <label className="block text-slate-200 font-medium mb-3">{q.text}</label>
                <textarea
                  required
                  value={openEnded[q.id] || ''}
                  onChange={(e) => setOpenEnded(prev => ({ ...prev, [q.id]: e.target.value }))}
                  className="w-full bg-space-900 border border-space-600 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none h-32 transition-colors"
                  placeholder="Your thoughts..."
                ></textarea>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6">
           <Button type="submit" size="lg" className="w-full md:w-auto px-12 py-4 flex items-center gap-2">
              <Send size={20} /> Submit Research Data
           </Button>
        </div>
      </form>
    </div>
  );
};
