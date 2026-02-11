
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Simulation } from './components/Simulation';
import { Theory } from './components/Theory';
import { ExperimentsView } from './components/ExperimentsView';
import { Home } from './components/Home';
import { LoginPage } from './components/LoginPage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { QuizPage } from './components/QuizPage';
import { ResearchPage } from './components/ResearchPage';
import { FeedbackPage } from './components/FeedbackPage';
import { ExpDoppler } from './components/ExpDoppler';
import { ExpSimultaneity } from './components/ExpSimultaneity';
import { ExpTwin } from './components/ExpTwin';
import { ExpTrainTunnel } from './components/ExpTrainTunnel';
import { ViewMode } from './types';
import { BrowserRouter as Router } from 'react-router-dom';
import { db } from './services/databaseService';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { AlertCircle, ArrowRight, X, Cpu, XCircle } from 'lucide-react';
import { Button } from './components/Button';

const AppContent: React.FC = () => {
  const [currentMode, setMode] = useState<ViewMode>(ViewMode.HOME);
  const [velocity, setVelocity] = useState(0); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasStyle, setHasStyle] = useState(false);
  const [isAROnlyMode, setIsAROnlyMode] = useState(false);
  const [targetSim, setTargetSim] = useState<string | null>(null);
  
  // Track completion of research tasks
  const [isQuizDone, setIsQuizDone] = useState(false);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);
  const [showExitReminder, setShowExitReminder] = useState(false);

  useEffect(() => {
    // Check for Deep Links (QR Code scanning)
    const params = new URLSearchParams(window.location.search);
    const simParam = params.get('sim');
    const modeParam = params.get('mode');

    if (modeParam === 'ar-only') {
      setIsAROnlyMode(true);
      setTargetSim(simParam);
      // For AR-only mode, we can auto-login or use a guest session to bypass barriers
      if (!db.getUser()) {
          const guestUser = {
              id: 'ar-guest-' + crypto.randomUUID(),
              name: 'AR Explorer',
              email: 'ar@explor.er',
              gender: 'N/A', age: 0, education: 'N/A', university: 'N/A', fieldOfStudy: 'N/A', country: 'N/A',
              loginTime: Date.now(), sessionCount: 1, learningStyle: 'Visual',
              learningScores: { visual: 10, auditory: 5, kinesthetic: 5 }
          };
          db.saveUser(guestUser as any);
      }
      setIsLoggedIn(true);
      setHasStyle(true);
      return;
    }

    const user = db.getUser();
    if (user) {
      setIsLoggedIn(true);
      if (user.learningStyle) {
        setHasStyle(true);
      }
      if (simParam) {
        handleDeepLink(simParam);
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoggedIn && !isAROnlyMode && (!isQuizDone || !isFeedbackDone)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoggedIn]);

  const handleDeepLink = (simId: string) => {
    switch (simId) {
      case 'warp': setMode(ViewMode.SIMULATION); break;
      case 'doppler': 
      case 'simultaneity':
      case 'twin':
      case 'train_tunnel':
        setMode(ViewMode.EXPERIMENTS);
        break;
      default: setMode(ViewMode.HOME);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const user = db.getUser();
    if (user?.learningStyle) {
      setHasStyle(true);
    }
  };

  const handleQuestionnaireComplete = () => {
    setHasStyle(true);
  };

  const attemptExit = () => {
    if (!isQuizDone || !isFeedbackDone) {
      setShowExitReminder(true);
    } else {
      setMode(ViewMode.HOME);
    }
  };

  // Dedicated AR-Only Immersive View
  if (isAROnlyMode && targetSim) {
      const renderARSim = () => {
          switch(targetSim) {
              case 'warp': return <Simulation velocity={velocity} setVelocity={setVelocity} forceAR={true} />;
              case 'doppler': return <ExpDoppler forceAR={true} />;
              case 'simultaneity': return <ExpSimultaneity forceAR={true} />;
              case 'twin': return <ExpTwin forceAR={true} />;
              case 'train_tunnel': return <ExpTrainTunnel forceAR={true} />;
              default: return <div className="p-8 text-center">Sim not found</div>;
          }
      };

      return (
          <div className="fixed inset-0 bg-black z-[200] flex flex-col">
              <div className="absolute top-4 left-4 right-4 z-[210] flex justify-between items-center pointer-events-none">
                  <div className="bg-cyan-500/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 pointer-events-auto shadow-lg">
                      <Cpu size={12} className="animate-pulse" /> Immersive Spatial View: {targetSim}
                  </div>
                  <button 
                    onClick={() => { window.location.href = window.location.origin + window.location.pathname; }}
                    className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto border border-white/20 hover:bg-red-500/50"
                  >
                    <XCircle size={24} />
                  </button>
              </div>
              <div className="flex-1">
                  {renderARSim()}
              </div>
          </div>
      );
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  if (!hasStyle) {
    return <QuestionnairePage onComplete={handleQuestionnaireComplete} />;
  }

  const renderContent = () => {
    switch (currentMode) {
      case ViewMode.HOME:
        return <Home setMode={setMode} />;
      case ViewMode.SIMULATION:
        return <Simulation velocity={velocity} setVelocity={setVelocity} />;
      case ViewMode.EXPERIMENTS:
        return <ExperimentsView />;
      case ViewMode.THEORY:
        return <Theory />;
      case ViewMode.QUIZ:
        return <QuizPage onComplete={() => setIsQuizDone(true)} goToFeedback={() => setMode(ViewMode.FEEDBACK)} />;
      case ViewMode.RESEARCH:
        return <ResearchPage />;
      case ViewMode.FEEDBACK:
        return <FeedbackPage onComplete={() => setIsFeedbackDone(true)} goToQuiz={() => setMode(ViewMode.QUIZ)} />;
      default:
        return <Home setMode={setMode} />;
    }
  };

  return (
      <div className="min-h-screen bg-space-900 text-slate-100 font-sans selection:bg-cyan-500/30 flex flex-col">
        <Navbar currentMode={currentMode} setMode={setMode} onExit={attemptExit} />
        
        <main className="flex-1 py-8 animate-in fade-in duration-300">
          {renderContent()}
        </main>

        <footer className="border-t border-space-800 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
            <p>Relativity In Motion • Improved with React & Gemini</p>
            <div className="flex gap-6">
               <div className={`flex items-center gap-2 ${isQuizDone ? 'text-green-500' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${isQuizDone ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  Quiz Status: {isQuizDone ? 'Complete' : 'Pending'}
               </div>
               <div className={`flex items-center gap-2 ${isFeedbackDone ? 'text-green-500' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${isFeedbackDone ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  Feedback Status: {isFeedbackDone ? 'Complete' : 'Pending'}
               </div>
            </div>
          </div>
        </footer>

        {/* Exit Reminder Modal */}
        {showExitReminder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-space-800 border border-red-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
              <button 
                onClick={() => setShowExitReminder(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Hold on!</h2>
                  <p className="text-slate-400 text-sm">Your session isn't quite finished yet.</p>
                </div>
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed">
                To help our research into relativistic visualization, please ensure you complete both the <span className="text-cyan-400 font-bold">Aptitude Assessment (Quiz)</span> and the <span className="text-purple-400 font-bold">Feedback Survey</span> before exiting.
              </p>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {!isQuizDone && (
                  <Button 
                    variant="outline" 
                    className="w-full py-4 justify-between border-cyan-500/50 text-cyan-400"
                    onClick={() => { setMode(ViewMode.QUIZ); setShowExitReminder(false); }}
                  >
                    Complete Quiz <ArrowRight size={18} />
                  </Button>
                )}
                {!isFeedbackDone && (
                  <Button 
                    variant="outline" 
                    className="w-full py-4 justify-between border-purple-500/50 text-purple-400"
                    onClick={() => { setMode(ViewMode.FEEDBACK); setShowExitReminder(false); }}
                  >
                    Complete Feedback <ArrowRight size={18} />
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  className="flex-1 text-xs" 
                  onClick={() => { setMode(ViewMode.HOME); setShowExitReminder(false); }}
                >
                  Exit Anyway
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  onClick={() => setShowExitReminder(false)}
                >
                  Stay & Finish
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
       <AnalyticsProvider>
          <AppContent />
       </AnalyticsProvider>
    </Router>
  );
}

export default App;
