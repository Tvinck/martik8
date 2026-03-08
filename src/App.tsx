import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw } from 'lucide-react';

import { LEVELS, SOUNDS } from './constants';
import type { GameState } from './types';
import { useSound } from './hooks/useSound';
import { useArtemStats } from './hooks/useArtemStats';

import FloatingBackground from './components/FloatingBackground';
import TopControls from './components/TopControls';
import IntroScreen from './components/IntroScreen';
import LevelScreen from './components/LevelScreen';
import TransitionScreen from './components/TransitionScreen';
import FinishScreen from './components/FinishScreen';
import ArtemView from './components/ArtemView';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [error, setError] = useState(false);

  const { isMuted, playSound, toggleMute, haptic } = useSound();
  const { stats, showLevelUp, setShowLevelUp, isSwitchingRoom, switchRoom, handleAction } = useArtemStats(
    gameState === 'my-artem',
    playSound
  );

  // Persistence: Load on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('quest_level');
    const savedState = localStorage.getItem('quest_state');
    const savedStartTime = localStorage.getItem('level_start_time');

    if (savedLevel && savedState) {
      setCurrentLevelIndex(parseInt(savedLevel, 10));
      setGameState(savedState as GameState);
    }

    if (!savedStartTime) {
      localStorage.setItem('level_start_time', Date.now().toString());
    }
  }, []);

  // Persistence: Save on change
  useEffect(() => {
    localStorage.setItem('quest_level', currentLevelIndex.toString());
    localStorage.setItem('quest_state', gameState);

    // Bonus confetti during transition
    if (gameState === 'transition') {
      const end = Date.now() + 1000;
      const colors = ['#f43f5e', '#fb7185', '#fbbf24'];

      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [currentLevelIndex, gameState]);

  const updateLevelStartTime = useCallback(() => {
    localStorage.setItem('level_start_time', Date.now().toString());
  }, []);

  const handleStart = useCallback(() => {
    setGameState('playing');
    playSound(SOUNDS.success);
    updateLevelStartTime();
  }, [playSound, updateLevelStartTime]);

  const handlePasswordSubmit = useCallback((password: string) => {
    const currentLevel = LEVELS[currentLevelIndex];
    if (password.trim().toUpperCase() === currentLevel.password.toUpperCase()) {
      playSound(SOUNDS.success);
      haptic(20);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af'],
      });

      if (currentLevelIndex < LEVELS.length - 1) {
        setGameState('transition');
        setTimeout(() => {
          setCurrentLevelIndex(prev => prev + 1);
          setError(false);
          setGameState('playing');
          updateLevelStartTime();
        }, 3000);
      } else {
        setGameState('finished');
        playSound(SOUNDS.finish);

        // Final heart rain
        const end = Date.now() + 3000;
        (function frame() {
          confetti({ particleCount: 5, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 }, colors: ['#f43f5e'] });
          confetti({ particleCount: 5, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 }, colors: ['#fb7185'] });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();

        confetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.3 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24'],
        });
      }
    } else {
      playSound(SOUNDS.error);
      haptic([10, 30, 10]); // Error vibration pattern
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  }, [currentLevelIndex, playSound, haptic, updateLevelStartTime]);

  const resetQuest = useCallback(() => {
    if (window.confirm('Ты уверена, что хочешь начать квест заново? Всё придется проходить сначала.')) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#FFF5F7] text-slate-800 font-sans selection:bg-rose-200 selection:text-slate-900 relative overflow-x-hidden">
      <FloatingBackground />

      {/* Render TopControls unless we are in the ArtemView which has its own header */}
      {gameState !== 'my-artem' && (
        <TopControls
          gameState={gameState}
          isMuted={isMuted}
          toggleMute={toggleMute}
          resetQuest={resetQuest}
        />
      )}

      {/* Level Up Modal (from ArtemView hook state) */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-white rounded-[40px] p-8 text-center space-y-5 shadow-2xl max-w-sm w-full relative overflow-hidden focus:outline-none"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-fuchsia-400 to-rose-400" />
              <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-rose-200 animate-bounce">
                {stats.level}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Новый уровень!</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Артём становится круче!</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Награды</p>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-500">+100 Монет</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-500">Новый стиль</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLevelUp(false)}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
              >
                Круто!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 flex min-h-[100dvh] flex-col justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroScreen onStart={handleStart} playSound={playSound} />
          )}

          {gameState === 'playing' && (
            <LevelScreen
              currentLevelIndex={currentLevelIndex}
              level={LEVELS[currentLevelIndex]}
              onSubmit={handlePasswordSubmit}
              error={error}
            />
          )}

          {gameState === 'transition' && (
            <TransitionScreen level={LEVELS[currentLevelIndex - 1]} />
          )}

          {gameState === 'finished' && (
            <FinishScreen playSound={playSound} resetQuest={resetQuest} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {gameState === 'my-artem' && (
          <ArtemView
            stats={stats}
            isSwitchingRoom={isSwitchingRoom}
            onAction={handleAction}
            onSwitchRoom={switchRoom}
            onBack={() => setGameState('playing')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
