import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface IntroScreenProps {
    onStart: () => void;
    playSound: (url: string) => void;
}

export default function IntroScreen({ onStart, playSound }: IntroScreenProps) {
    const [heartClicks, setHeartClicks] = useState(0);

    return (
        <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="text-center space-y-10 sm:space-y-12 px-2"
        >
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-rose-300 uppercase tracking-[0.3em] text-xs sm:text-sm font-bold"
            >
                Инициализация протокола...
            </motion.div>

            <div className="space-y-6">
                <div className="relative inline-block">
                    <motion.div
                        animate={{
                            scale: heartClicks > 5 ? [1, 1.3, 1] : [1, 1.1, 1],
                            rotate: heartClicks > 5 ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{
                            duration: heartClicks > 5 ? 0.3 : 1.5,
                            repeat: Infinity,
                        }}
                        onClick={() => {
                            setHeartClicks(prev => prev + 1);
                            if (heartClicks === 10) playSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
                        }}
                        className="cursor-pointer"
                    >
                        <Heart className={`w-14 h-14 sm:w-16 sm:h-16 ${heartClicks > 10 ? 'text-rose-600' : 'text-rose-400'} fill-current drop-shadow-lg`} />
                    </motion.div>
                    {heartClicks > 10 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-rose-500"
                        >
                            Я тебя очень сильно люблю! ❤️
                        </motion.div>
                    )}
                </div>

                <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-light text-slate-800 leading-tight">
                    Если ты зашла на этот сайт, значит это{' '}
                    <span className="font-bold gradient-text">только начало</span>.
                </h1>
                <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
                    Тебе предстоит выполнить ряд заданий, чтобы добраться до финала и получить свой приз.
                </p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="bg-slate-900 text-white px-8 sm:px-10 py-4 rounded-full font-bold tracking-widest uppercase text-xs sm:text-sm shadow-2xl animate-glow-pulse"
            >
                Я готова принять вызов
            </motion.button>

            <div className="pt-8 sm:pt-12">
                <div className="border-t border-rose-100 pt-6">
                    <p className="text-[10px] text-rose-400 uppercase tracking-widest leading-relaxed opacity-60 max-w-xs mx-auto">
                        Дисклеймер: Задания могут быть крайне опасными для твоей лени.
                        Пути назад нет. Система заблокирует выход, пока подарок не будет найден.
                        Действуй на свой страх и риск.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
