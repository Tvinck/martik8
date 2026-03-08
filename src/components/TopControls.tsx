import { Wind, Sparkles, Lock, User } from 'lucide-react';
import type { GameState } from '../types';

interface TopControlsProps {
    gameState: GameState;
    isMuted: boolean;
    toggleMute: () => void;
    resetQuest: () => void;
}

export default function TopControls({ gameState, isMuted, toggleMute, resetQuest }: TopControlsProps) {
    return (
        <div className="fixed top-0 right-0 flex gap-2 z-50 p-4 pt-[max(1rem,var(--sat))] pr-[max(1rem,var(--sar))]">
            <div className="glass px-4 py-3 rounded-full shadow-lg text-rose-300 flex items-center gap-2 cursor-help group relative">
                <User className="w-5 h-5 opacity-50" />
                <span className="text-[10px] font-black uppercase tracking-widest">Скоро</span>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 right-0 bg-slate-900 text-white text-[8px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-tighter">
                    Раздел на техобслуживании
                </div>
            </div>
            <button
                onClick={toggleMute}
                className="glass p-3 rounded-full shadow-lg text-rose-400 hover:text-rose-600 transition-colors active:scale-90"
                aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
                {isMuted ? <Wind className="w-5 h-5 opacity-50" /> : <Sparkles className="w-5 h-5" />}
            </button>
            {gameState === 'finished' && (
                <button
                    onClick={resetQuest}
                    className="glass p-3 rounded-full shadow-lg text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
                    aria-label="Начать заново"
                >
                    <Lock className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
