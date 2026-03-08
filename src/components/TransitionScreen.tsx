import { motion } from 'motion/react';
import { Gift, Star } from 'lucide-react';
import type { Level } from '../types';

interface TransitionScreenProps {
    level: Level;
}

export default function TransitionScreen({ level }: TransitionScreenProps) {
    return (
        <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center space-y-8 px-4"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-4"
            >
                <div className="relative inline-block">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="glass-strong p-8 rounded-full shadow-2xl shadow-rose-200 relative z-10"
                    >
                        <Gift className="w-14 h-14 sm:w-16 sm:h-16 text-rose-500" />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-rose-400 rounded-full blur-2xl -z-10"
                    />
                </div>

                <div className="space-y-2">
                    <motion.h2
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-2xl sm:text-3xl font-black gradient-text uppercase tracking-tighter"
                    >
                        БОНУС ПОЛУЧЕН!
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass py-3 px-6 rounded-2xl shadow-lg inline-block relative overflow-hidden"
                    >
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                        />
                        <p className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 relative z-10">
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            {level.bonus}
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="space-y-4 pt-4">
                {level.note && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-slate-600 italic text-base sm:text-lg leading-relaxed max-w-xs mx-auto"
                    >
                        «{level.note}»
                    </motion.p>
                )}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                    className="h-1 bg-rose-200 rounded-full overflow-hidden max-w-[200px] mx-auto"
                >
                    <div className="h-full bg-rose-500" />
                </motion.div>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Загрузка следующего этапа...</p>
            </div>
        </motion.div>
    );
}
