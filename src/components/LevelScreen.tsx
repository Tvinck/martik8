import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock, Unlock, Gift, Star } from 'lucide-react';
import { LEVELS, HINT_DELAY } from '../constants';
import type { Level } from '../types';

const TypingText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, [text]);

    return <span>«{displayedText}»</span>;
};

interface LevelScreenProps {
    currentLevelIndex: number;
    level: Level;
    onSubmit: (password: string) => void;
    error: boolean;
}

export default function LevelScreen({ currentLevelIndex, level, onSubmit, error }: LevelScreenProps) {
    const [password, setPassword] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [levelStartTime] = useState<number>(() => {
        const saved = localStorage.getItem('level_start_time');
        return saved ? parseInt(saved) : Date.now();
    });
    const [timeLeftToHint, setTimeLeftToHint] = useState<number>(0);

    // Reset password when level changes
    useEffect(() => {
        setPassword('');
        setShowHint(false);
    }, [currentLevelIndex]);

    // Timer for hint
    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = Date.now() - levelStartTime;
            const remaining = Math.max(0, HINT_DELAY - elapsed);
            setTimeLeftToHint(remaining);
        }, 1000);
        return () => clearInterval(timer);
    }, [levelStartTime]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <motion.div
            key={`level-${level.id}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6 sm:space-y-8"
        >
            {/* Progress Bar */}
            <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Уровень любви</span>
                    <span className="text-[10px] font-bold text-rose-400">{Math.round(((currentLevelIndex + 1) / LEVELS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-rose-100 h-3 rounded-full overflow-hidden p-0.5 border border-rose-50 relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentLevelIndex + 1) / LEVELS.length) * 100}%` }}
                        className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full shadow-inner relative overflow-hidden"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                </div>
                <div className="flex justify-center gap-1.5 sm:gap-2">
                    {LEVELS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-500 ${i === currentLevelIndex
                                ? 'bg-rose-500 w-5 sm:w-6'
                                : i < currentLevelIndex
                                    ? 'bg-rose-300 w-2'
                                    : 'bg-rose-100 w-2'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Level Card */}
            <div className="glass-strong p-6 sm:p-8 rounded-3xl shadow-xl shadow-rose-100/50 space-y-5 sm:space-y-6 relative overflow-hidden animate-glow-pulse">
                <div className="absolute top-0 right-0 p-4 opacity-10">{level.icon}</div>

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Этап {level.id} из {LEVELS.length}
                    </span>
                    <div className="flex-1 h-1 bg-rose-50 rounded-full overflow-hidden min-w-[40px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentLevelIndex + 1) / LEVELS.length) * 100}%` }}
                            className="h-full bg-rose-400"
                        />
                    </div>
                    <Heart className="w-4 h-4 text-rose-400 fill-current animate-pulse" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{level.title}</h2>

                <motion.p
                    key={`riddle-${level.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base sm:text-lg text-slate-600 italic leading-relaxed min-h-[60px] sm:min-h-[80px]"
                >
                    <TypingText text={level.riddle} />
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите кодовое слово..."
                            className={`w-full bg-slate-50/80 border-2 ${error ? 'border-red-400 animate-shake' : 'border-slate-100'
                                } focus:border-rose-400 outline-none rounded-2xl py-4 px-12 transition-all text-center font-bold uppercase tracking-widest text-sm sm:text-base`}
                            autoFocus
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            {password ? <Unlock className="w-5 h-5 text-rose-400" /> : <Lock className="w-5 h-5 text-slate-300" />}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg transition-colors active:bg-slate-950"
                    >
                        Проверить код
                    </motion.button>
                </form>

                {/* Hint */}
                <div className="text-center">
                    <button
                        onClick={() => {
                            if (timeLeftToHint === 0) setShowHint(!showHint);
                        }}
                        disabled={timeLeftToHint > 0}
                        className={`text-sm transition-all flex items-center justify-center gap-2 mx-auto py-2 ${timeLeftToHint > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-rose-400 hover:underline'
                            }`}
                    >
                        {timeLeftToHint > 0 ? (
                            <>
                                <Lock className="w-3 h-3" />
                                Подсказка откроется через {Math.floor(timeLeftToHint / 60000)}м{' '}
                                {Math.floor((timeLeftToHint % 60000) / 1000)}с
                            </>
                        ) : showHint ? (
                            'Скрыть подсказку'
                        ) : (
                            'Нужна подсказка?'
                        )}
                    </button>
                    <AnimatePresence>
                        {showHint && timeLeftToHint === 0 && (
                            <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 text-slate-500 text-sm italic"
                            >
                                {level.hint}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bonus Gifts Collection */}
            {currentLevelIndex > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-4 sm:p-5 rounded-3xl shadow-xl shadow-rose-100/50"
                >
                    <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3 sm:mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Star className="w-3 h-3 fill-current" /> Твоя коллекция
                        </span>
                        <span className="text-rose-300">
                            {currentLevelIndex} / {LEVELS.length - 1}
                        </span>
                    </h3>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {LEVELS.slice(0, currentLevelIndex)
                            .filter((l) => l.bonus)
                            .map((l) => (
                                <motion.div
                                    key={l.id}
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="aspect-square bg-rose-50 rounded-2xl flex items-center justify-center relative group cursor-help"
                                    title={l.bonus}
                                >
                                    <Gift className="w-5 h-5 text-rose-400 group-hover:text-rose-500 transition-colors" />
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-rose-100">
                                        <Heart className="w-2 h-2 text-rose-500 fill-current" />
                                    </div>
                                </motion.div>
                            ))}
                        {[...Array(Math.max(0, LEVELS.length - 1 - currentLevelIndex))].map((_, i) => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                                <Lock className="w-4 h-4 text-slate-200" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
