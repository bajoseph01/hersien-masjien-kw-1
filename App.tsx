
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestions, shuffle } from './constants';
import { Question, GameState, Category } from './types';
import Button from './components/Button';
import NeoBox from './components/NeoBox';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    learnedCount: 0,
    isFinished: false,
    status: 'idle',
    questions: []
  });

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'revealed' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startNewGame = () => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      learnedCount: 0,
      isFinished: false,
      status: 'playing',
      questions: generateQuestions()
    });
    setFeedback(null);
    setUserInput('');
    setShowConfetti(false);
  };

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    // Clean up input: remove extra spaces, case insensitive, handle curly quotes if they creep in
    const cleanUser = answer.trim().toLowerCase().replace(/[‘’]/g, "'");
    const cleanAnswer = currentQuestion.answer.toLowerCase().replace(/[‘’]/g, "'");

    const isCorrect = cleanUser === cleanAnswer;

    if (isCorrect) {
      setFeedback('correct');
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      setShowConfetti(true);
      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      setFeedback('wrong');
      // Briefly show wrong state then let them try again (per requirements: "Try Again" feedback)
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const revealAnswer = () => {
    if (feedback) return;
    setFeedback('revealed');
    // Marks as learned rather than correct
    setGameState(prev => ({ ...prev, learnedCount: prev.learnedCount + 1 }));
    setTimeout(() => {
      nextQuestion();
    }, 2500);
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserInput('');
    setShowConfetti(false);
    
    if (gameState.currentQuestionIndex < gameState.questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        isFinished: true
      }));
    }
  };

  useEffect(() => {
    if (gameState.status === 'playing' && currentQuestion?.type === 'text' && !feedback) {
      inputRef.current?.focus();
    }
  }, [gameState.status, gameState.currentQuestionIndex, currentQuestion?.type, feedback]);

  const renderContent = () => {
    if (gameState.status === 'idle') {
      return (
        <motion.div 
          key="splash"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center justify-center text-center space-y-8"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <NeoBox color="bg-[#A855F7]" className="p-8 md:p-12 relative z-10">
                <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white">
                  HERSIEN<br/>MASJIEN
                </h1>
                <p className="mt-4 font-bold text-black bg-[#BEF264] px-4 py-2 inline-block neo-border">
                  KWARTAAL 1 - GRAAD 6
                </p>
              </NeoBox>
            </motion.div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full neo-border z-20 flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>
          
          <div className="max-w-md">
            <p className="text-lg font-bold text-zinc-400">
              Is jy gereed om jou Afrikaans te toets? Pasop vir die strikvrae!
            </p>
          </div>

          <Button onClick={startNewGame} className="text-2xl px-12 py-6">
            BEGIN NOU!
          </Button>
        </motion.div>
      );
    }

    if (gameState.status === 'playing') {
      return (
        <motion.div 
          key="playing"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full max-w-2xl mx-auto space-y-6"
        >
          <ProgressBar 
            current={gameState.currentQuestionIndex + 1} 
            total={gameState.questions.length} 
          />

          <NeoBox color="bg-[#18181B]" className="relative overflow-hidden min-h-[450px] flex flex-col justify-between">
            {/* Category Tag */}
            <div className="flex justify-between items-start">
              <span className="bg-[#A855F7] text-white px-3 py-1 rounded-full text-xs font-bold uppercase neo-border">
                {currentQuestion.category}
              </span>
              <div className="text-zinc-500 font-bold text-sm tracking-widest">
                TELLING: {gameState.score}
              </div>
            </div>

            {/* Question Text */}
            <div className="my-6 text-center space-y-2">
              <p className="text-zinc-500 font-black uppercase text-xs tracking-widest">VRAAG {gameState.currentQuestionIndex + 1}</p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Input Area */}
            <div className="flex-grow flex flex-col items-center justify-center w-full px-2">
              <AnimatePresence mode="wait">
                {feedback ? (
                  <motion.div
                    key="feedback"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-center py-8 flex flex-col items-center gap-4`}
                  >
                    <span className={`text-4xl font-black uppercase italic ${
                      feedback === 'correct' ? 'text-[#BEF264]' : 
                      feedback === 'revealed' ? 'text-yellow-400' : 'text-red-500'
                    }`}>
                      {feedback === 'correct' && 'WELGEDAAN! 🎉'}
                      {feedback === 'revealed' && 'LEER HIERDIE EEN! 💡'}
                      {feedback === 'wrong' && 'PROBEER WEER! ❌'}
                    </span>
                    
                    {feedback === 'revealed' && (
                      <NeoBox color="bg-zinc-800" className="mt-2 py-4 px-8 border-2 border-yellow-400" noShadow>
                         <span className="text-2xl font-black text-white">{currentQuestion.answer}</span>
                      </NeoBox>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="input-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    {currentQuestion.type === 'mcq' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {currentQuestion.options?.map((opt, i) => (
                          <Button 
                            key={`${currentQuestion.id}-${i}`} 
                            onClick={() => handleAnswer(opt)}
                            variant="secondary"
                            className="text-lg normal-case py-4 md:py-6"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6 flex flex-col items-center w-full">
                        <input
                          ref={inputRef}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userInput)}
                          placeholder="Tik jou antwoord..."
                          className="w-full max-w-sm bg-zinc-900 neo-border p-5 rounded-xl text-2xl font-bold text-[#BEF264] outline-none text-center focus:ring-4 focus:ring-[#BEF264]/20 transition-all"
                        />
                        <Button onClick={() => handleAnswer(userInput)} className="w-full max-w-sm">STUUR</Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lifeline */}
            {!feedback && (
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={revealAnswer}
                  className="text-xs px-4 py-2 border-2 opacity-80 hover:opacity-100"
                >
                  💡 WYS ANTWOORD
                </Button>
              </div>
            )}
          </NeoBox>
          
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
               {[...Array(30)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ y: 0, x: 0, opacity: 1 }}
                   animate={{ 
                     y: [0, -150, 600], 
                     x: [0, (i - 15) * 50],
                     rotate: [0, 720],
                     opacity: [1, 1, 0]
                   }}
                   transition={{ duration: 1.8, ease: "easeOut" }}
                   className={`w-4 h-4 rounded-sm absolute ${['bg-red-400', 'bg-blue-400', 'bg-[#BEF264]', 'bg-yellow-400', 'bg-[#A855F7]'][i % 5]}`}
                 />
               ))}
            </div>
          )}
        </motion.div>
      );
    }

    if (gameState.status === 'finished') {
      const scorePercentage = (gameState.score / gameState.questions.length) * 100;
      let message = "";
      if (scorePercentage === 100) message = "PERFEK! JY IS 'N AFRIKAANS-MEESTER!";
      else if (scorePercentage >= 70) message = "BAIE GOED! JY KEN JOU STORIE!";
      else if (scorePercentage >= 50) message = "NIE SLEGT NIE, MAAR DAAR IS RUIMTE VIR VERBETERING.";
      else message = "TYD OM WEER TE LEER! HIERDIE TOETS IS TAAI.";

      return (
        <motion.div 
          key="finished"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-xl mx-auto"
        >
          <NeoBox color="bg-[#BEF264]" className="p-8 md:p-12 w-full">
            <h1 className="text-5xl font-black text-black italic tracking-tighter">RESULTATE</h1>
            
            <div className="my-10 flex flex-wrap justify-center items-center gap-4">
              <div className="bg-white p-6 neo-border neo-shadow-sm rounded-2xl flex-1 min-w-[120px]">
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">KORREK</span>
                <span className="text-4xl font-black text-green-600 leading-none">{gameState.score}</span>
              </div>
              <div className="bg-white p-6 neo-border neo-shadow-sm rounded-2xl flex-1 min-w-[120px]">
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">GELEER</span>
                <span className="text-4xl font-black text-yellow-500 leading-none">{gameState.learnedCount}</span>
              </div>
              <div className="bg-white p-6 neo-border neo-shadow-sm rounded-2xl flex-1 min-w-[120px]">
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">TOTAAL</span>
                <span className="text-4xl font-black text-black leading-none">{gameState.questions.length}</span>
              </div>
            </div>

            <div className="bg-black/5 p-6 rounded-2xl neo-border mb-10">
               <p className="text-xl md:text-2xl font-black text-black leading-tight uppercase">
                {message}
              </p>
            </div>

            <Button onClick={startNewGame} className="w-full text-xl py-6 md:py-8">
              BEGIN WEER! 🔄
            </Button>
          </NeoBox>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border-[20px] border-white rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] border-[20px] border-white"></div>
        <div className="absolute top-[40%] left-[60%] w-[10%] h-[10%] bg-white transform rotate-45"></div>
        <div className="grid grid-cols-12 gap-4 w-full h-full">
           {[...Array(144)].map((_, i) => (
             <div key={i} className="border border-white/20 h-20 w-full"></div>
           ))}
        </div>
      </div>

      <main className="relative z-10 w-full max-w-4xl flex items-center justify-center">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] text-center">
        KWARTAAL 1 • AFRIKAANS GRAAD 6 • HERSIEN-MASJIEN
      </footer>
    </div>
  );
};

export default App;
