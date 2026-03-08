import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Bath, Bed, Gamepad2, Home, RefreshCw, User, Star, ArrowLeft } from 'lucide-react';
import type { ArtemStats, ArtemAction, RoomId } from '../types';
import { OUTFITS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface ArtemViewProps {
    stats: ArtemStats;
    isSwitchingRoom: boolean;
    onAction: (action: ArtemAction) => void;
    onSwitchRoom: (room: RoomId) => void;
    onBack: () => void;
}

const ROOMS_CONFIG: Record<RoomId, { name: string; bg: string; color: string; icon: React.ReactNode }> = {
    kitchen: { name: 'Кухня', bg: "#fed7aa", color: 'text-orange-500', icon: <Utensils /> },
    bathroom: { name: 'Ванная', bg: "#bfdbfe", color: 'text-blue-500', icon: <Bath /> },
    bedroom: { name: 'Спальня', bg: "#020617", color: 'text-indigo-500', icon: <Bed /> },
    living: { name: 'Гостиная', bg: "#ffe4e6", color: 'text-rose-500', icon: <Home /> },
};

// Simplified room visuals for better performance and mobile support
const RoomVisuals = ({ room }: { room: RoomId }) => {
    switch (room) {
        case 'kitchen':
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[#ffedd5]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#fdba74] border-t-4 border-[#f97316]/20 shadow-inner" />
                    <div className="absolute bottom-[35%] right-10 w-24 h-56 bg-slate-50 border-4 border-slate-200 rounded-t-xl" />
                </div>
            );
        case 'bathroom':
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[#eff6ff] opacity-50" />
                    <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#dbeafe] border-t-4 border-blue-200 shadow-inner" />
                    <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-48 sm:w-56 h-12 bg-white rounded-full shadow-lg border-b-8 border-slate-100" />
                </div>
            );
        case 'bedroom':
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#312e81]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-indigo-950/40 border-t-8 border-indigo-900/30" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-indigo-900/20 rounded-t-[60px]" />
                </div>
            );
        case 'living':
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[#fff1f2]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#fecdd3] border-t-4 border-rose-300/40" />
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-rose-400/20 rounded-[100px] blur-sm" />
                    <div className="absolute bottom-[37%] left-1/2 -translate-x-1/2 w-40 sm:w-48 h-28 sm:h-32 bg-slate-800 rounded-xl" />
                </div>
            );
        default:
            return null;
    }
};

export default function ArtemView({ stats, isSwitchingRoom, onAction, onSwitchRoom, onBack }: ArtemViewProps) {
    const [artemImage, setArtemImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Swipe handling for rooms
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        // Swipe left/right threshold
        if (Math.abs(diff) > 50) {
            const roomIds: RoomId[] = ['kitchen', 'bathroom', 'bedroom', 'living'];
            const currentIndex = roomIds.indexOf(stats.activeRoom);

            if (diff > 0 && currentIndex < roomIds.length - 1) {
                onSwitchRoom(roomIds[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                onSwitchRoom(roomIds[currentIndex - 1]);
            }
        }
        setTouchStart(null);
    };

    const generateCharacter = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            // @ts-ignore
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: "A cute 2D stylized cartoon character of a young man with a short buzz cut, blue eyes, and a friendly expression. Full body view, standing in a neutral pose. Wearing a simple white t-shirt and blue jeans. Art style should be clean, vibrant, and similar to 'My Talking Tom' or modern mobile pet games. High quality.",
                config: { imageConfig: { aspectRatio: "3:4" } }
            });

            const content = (response as any).candidates?.[0]?.content;
            if (content?.parts) {
                for (const part of content.parts) {
                    if (part.inlineData) {
                        setArtemImage(`data:image/png;base64,${part.inlineData.data}`);
                        break;
                    }
                }
            }
        } catch (e: any) {
            console.error('Failed to generate character:', e);
            // Fallback or error handling can be added here
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div
            key="my-artem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col pt-[var(--sat)] pb-[var(--sab)] pl-[var(--sal)] pr-[var(--sar)]"
        >
            {/* Header */}
            <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-md border-b border-rose-50 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-black shadow-lg text-lg sm:text-xl">
                        {stats.level}
                    </div>
                    <div className="space-y-1">
                        <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${stats.exp}%` }} className="h-full bg-rose-400" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Опыт до {stats.level + 1}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="p-2 sm:p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
                >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Main Area */}
            <div
                className="flex-1 relative overflow-hidden transition-colors duration-1000"
                style={{ background: ROOMS_CONFIG[stats.activeRoom].bg }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stats.activeRoom}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        <RoomVisuals room={stats.activeRoom} />
                    </motion.div>
                </AnimatePresence>

                {/* Room Name Badge */}
                <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                        key={stats.activeRoom}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass px-4 sm:px-6 py-1.5 rounded-full shadow-sm"
                    >
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                            {ROOMS_CONFIG[stats.activeRoom].name}
                        </span>
                    </motion.div>
                </div>

                {/* Character */}
                <div className="absolute inset-0 flex items-center justify-center p-4 pt-10 pb-32">
                    {artemImage ? (
                        <div className="relative flex flex-col items-center w-full max-w-[280px] sm:max-w-sm">
                            {/* Shadow */}
                            <motion.div
                                animate={{
                                    scale: isSwitchingRoom ? [0.8, 1.2, 0.8] : stats.isSleeping ? [0.7, 0.75, 0.7] : [1, 1.05, 1],
                                    opacity: stats.isSleeping ? 0.15 : 0.25,
                                    x: isSwitchingRoom ? [0, 30, -30, 0] : 0,
                                }}
                                transition={{ duration: isSwitchingRoom ? 0.3 : 3, repeat: Infinity }}
                                className="absolute bottom-2 sm:bottom-4 w-24 sm:w-32 h-4 sm:h-6 bg-black rounded-full blur-xl"
                            />

                            <motion.div
                                onClick={() => onAction('poke')}
                                animate={{
                                    y: isSwitchingRoom ? [0, -20, 0] : stats.isSleeping ? [0, 8, 0] : [0, -15, 0],
                                    x: isSwitchingRoom ? [0, 40, -40, 0] : 0,
                                    scale: stats.isSleeping ? 0.85 : isSwitchingRoom ? [1, 1.05, 1] : [1, 1.02, 1],
                                    rotate: isSwitchingRoom ? [0, 5, -5, 0] : stats.activeRoom === 'living' ? [0, 1, -1, 0] : 0,
                                }}
                                whileTap={{ scale: 0.9, rotate: [0, -5, 5, 0] }}
                                transition={{
                                    y: { duration: isSwitchingRoom ? 0.3 : 3, repeat: Infinity, ease: 'easeInOut' },
                                    x: { duration: 0.6, ease: 'easeInOut' },
                                    scale: { duration: isSwitchingRoom ? 0.3 : 3, repeat: Infinity, ease: 'easeInOut' },
                                    rotate: { duration: isSwitchingRoom ? 0.3 : 4, repeat: Infinity, ease: 'easeInOut' },
                                }}
                                className="relative z-10 w-full aspect-[3/4] cursor-pointer"
                            >
                                <motion.img
                                    animate={{
                                        scaleY: stats.isSleeping ? [1, 1.02, 1] : [1, 1.03, 1],
                                        scaleX: stats.isSleeping ? [1, 1.01, 1] : [1, 1.01, 1],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    src={artemImage}
                                    alt="Artem"
                                    style={{
                                        filter: stats.isSleeping
                                            ? 'grayscale(1) brightness(0.2) drop-shadow(0 0 30px rgba(99, 102, 241, 0.4))'
                                            : `${OUTFITS.find((o) => o.id === stats.outfit)?.style} drop-shadow(0 20px 40px rgba(0,0,0,0.2))`,
                                    }}
                                    className="w-full h-full object-contain transition-all duration-1000"
                                    referrerPolicy="no-referrer"
                                />

                                <AnimatePresence>
                                    {stats.happiness > 95 && !stats.isSleeping && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl pointer-events-none"
                                        >
                                            ✨
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {stats.isSleeping && (
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.4, 1, 0.4],
                                            y: [0, -20, -40],
                                            x: [0, 10, 0],
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-8 sm:-top-12 -right-4 sm:-right-6 text-5xl sm:text-7xl pointer-events-none select-none"
                                    >
                                        💤
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 sm:space-y-6 glass-strong p-6 sm:p-10 rounded-[40px] shadow-2xl w-[90%] max-w-[280px]">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-inner">
                                <User className="w-10 h-10 sm:w-12 sm:h-12 text-rose-300" />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Твой Артём</h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                                    Создай своего персонального героя прямо сейчас!
                                </p>
                            </div>
                            <button
                                onClick={generateCharacter}
                                disabled={isGenerating}
                                className="w-full bg-rose-500 text-white py-3 sm:py-4 rounded-3xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-200 active:scale-95 text-sm sm:text-base"
                            >
                                {isGenerating ? 'Магия...' : 'Создать'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Room specific actions */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-30">
                    {stats.activeRoom === 'kitchen' && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onAction('feed')}
                            className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-orange-500 hover:bg-white"
                        >
                            <Utensils className="w-6 h-6 sm:w-7 sm:h-7" />
                        </motion.button>
                    )}
                    {stats.activeRoom === 'bathroom' && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onAction('wash')}
                            className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-blue-500 hover:bg-white"
                        >
                            <Bath className="w-6 h-6 sm:w-7 sm:h-7" />
                        </motion.button>
                    )}
                    {stats.activeRoom === 'bedroom' && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onAction('sleep')}
                            className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-indigo-500 hover:bg-white"
                        >
                            {stats.isSleeping ? <Star className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" /> : <Bed className="w-6 h-6 sm:w-7 sm:h-7" />}
                        </motion.button>
                    )}
                    {stats.activeRoom === 'living' && (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onAction('play')}
                                className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-rose-500 hover:bg-white"
                            >
                                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onAction('outfit')}
                                className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-slate-500 hover:bg-white"
                            >
                                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7" />
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-[5.5rem] sm:bottom-24 left-4 right-4 sm:left-6 sm:right-6 grid grid-cols-4 gap-2 sm:gap-3 z-20">
                    {[
                        { label: 'Еда', val: stats.hunger, color: 'bg-orange-400', icon: <Utensils /> },
                        { label: 'Душ', val: stats.hygiene, color: 'bg-blue-400', icon: <Bath /> },
                        { label: 'Сон', val: stats.energy, color: 'bg-indigo-400', icon: <Bed /> },
                        { label: 'Фан', val: stats.happiness, color: 'bg-rose-400', icon: <Gamepad2 /> },
                    ].map((s) => (
                        <div key={s.label} className="glass p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-1 gap-1">
                                <div className={`w-4 h-4 rounded-full ${s.color} flex items-center justify-center text-white hidden sm:flex`}>
                                    {React.cloneElement(s.icon as React.ReactElement, { className: 'w-2.5 h-2.5' })}
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-700">{Math.round(s.val)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${s.val}%` }} className={`h-full ${s.color}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="bg-white/90 backdrop-blur-lg border-t border-slate-100 p-2 sm:p-4 flex justify-around items-center z-20 shrink-0">
                {[
                    { id: 'kitchen', icon: <Utensils />, label: 'Кухня', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { id: 'bathroom', icon: <Bath />, label: 'Ванная', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'bedroom', icon: <Bed />, label: 'Спальня', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { id: 'living', icon: <Home />, label: 'Дом', color: 'text-rose-500', bg: 'bg-rose-50' },
                ].map((r) => (
                    <button
                        key={r.id}
                        onClick={() => onSwitchRoom(r.id as any)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[60px] py-1 ${stats.activeRoom === r.id ? `${r.color} scale-105` : 'text-slate-400'
                            }`}
                    >
                        <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-[20px] flex items-center justify-center transition-all ${stats.activeRoom === r.id ? `${r.bg} shadow-sm` : 'bg-transparent'
                                }`}
                        >
                            {React.cloneElement(r.icon as React.ReactElement, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                    </button>
                ))}
            </div>

            {/* Level Up Modal */}
            <AnimatePresence>
                {/* We would render showLevelUp modal here, but the state is managed in the parent. Let's assume parent handles modal for consistency, or we could lift modal here. Since hook returns showLevelUp, parent should render it. */}
            </AnimatePresence>
        </motion.div>
    );
}
