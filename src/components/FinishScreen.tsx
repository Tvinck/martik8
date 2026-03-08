import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, Star, Video, Play, Lock, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS } from '../constants';

interface FinishScreenProps {
    playSound: (url: string) => void;
    resetQuest: () => void;
}

export default function FinishScreen({ playSound, resetQuest }: FinishScreenProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto"
        >
            <div className="relative inline-block">
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="glass-strong p-6 sm:p-8 rounded-full shadow-2xl shadow-rose-200"
                >
                    <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-rose-500" />
                </motion.div>
                <div className="absolute -top-4 -right-4">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-[clamp(1.75rem,6vw,2.5rem)] font-black text-slate-900 tracking-tight">
                    КВЕСТ ПРОЙДЕН! 🏆
                </h1>
                <p className="text-lg sm:text-xl gradient-text font-bold">
                    Ты справилась со всеми испытаниями!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
                    <div className="glass-strong p-5 sm:p-6 rounded-2xl text-left">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 text-amber-400 fill-current" /> Твои трофеи:
                        </h3>
                        <ul className="text-sm text-slate-600 space-y-1.5">
                            {LEVELS.filter((l) => l.bonus).map((l) => (
                                <li key={l.id} className="flex items-start gap-2">
                                    <span className="text-rose-400 mt-0.5">•</span> {l.bonus}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-strong p-5 sm:p-6 rounded-2xl text-left">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                            <Video className="w-5 h-5 text-rose-500" /> Сюрприз:
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">Я подготовил для тебя небольшое видео-послание...</p>
                        <button
                            onClick={() => window.open('https://t.me/+pbE5GRObFFI0Y2Yy', '_blank')}
                            className="w-full bg-rose-500 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors active:scale-95 shadow-lg shadow-rose-200"
                        >
                            <Play className="w-4 h-4 fill-current" /> Посмотреть
                        </button>
                    </div>
                </div>

                {/* Main Prize Reveal */}
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 sm:p-8 rounded-3xl shadow-xl shadow-rose-200 mt-6 sm:mt-8 relative overflow-hidden">
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    />
                    <p className="text-white text-base sm:text-lg font-medium leading-relaxed mb-4 relative z-10">
                        Но это еще не всё! Твой самый главный подарок...
                    </p>

                    {!isRevealed ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsRevealed(true);
                                playSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
                                confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                            }}
                            className="bg-white text-rose-500 px-6 sm:px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-lg relative z-10 text-sm sm:text-base"
                        >
                            Нажми, чтобы узнать где!
                        </motion.button>
                    ) : (
                        <motion.p
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest animate-bounce relative z-10"
                        >
                            КУХНЯ, ВЕРХНЯЯ ПОЛКА!
                        </motion.p>
                    )}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-6 sm:pt-8 space-y-8 sm:space-y-12"
            >
                <p className="text-rose-400 font-medium italic text-base sm:text-lg">
                    С 8 Марта, моя любимая! Ты — моё самое большое сокровище. ❤️
                </p>

                <div className="pt-6 sm:pt-8 border-t border-rose-100">
                    <div className="glass-strong p-5 sm:p-6 rounded-3xl space-y-4">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Следующее приключение</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Новый квест: 10 Апреля</h3>
                        <p className="text-sm text-slate-500">
                            Система готовит новые испытания. Доступ будет открыт автоматически в указанную дату.
                        </p>
                        <div className="inline-block px-4 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            Статус: Заблокировано
                        </div>
                    </div>
                </div>

                <button
                    onClick={resetQuest}
                    className="text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto py-3 active:scale-95"
                >
                    <RefreshCw className="w-3 h-3" /> Начать квест заново
                </button>
            </motion.div>
        </motion.div>
    );
}
