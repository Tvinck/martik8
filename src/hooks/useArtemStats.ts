import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { ArtemStats, ArtemAction, RoomId } from '../types';
import { OUTFITS, SOUNDS } from '../constants';

const DEFAULT_STATS: ArtemStats = {
    hunger: 80,
    hygiene: 90,
    energy: 70,
    happiness: 100,
    isSleeping: false,
    outfit: 'classic',
    level: 1,
    exp: 0,
    activeRoom: 'living',
};

export function useArtemStats(isActive: boolean, playSound: (url: string) => void) {
    const [stats, setStats] = useState<ArtemStats>(DEFAULT_STATS);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [isSwitchingRoom, setIsSwitchingRoom] = useState(false);

    // Stats decay
    useEffect(() => {
        if (!isActive || stats.isSleeping) return;

        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 0.5),
                hygiene: Math.max(0, prev.hygiene - 0.3),
                energy: Math.max(0, prev.energy - 0.4),
                happiness: Math.max(0, prev.happiness - 0.2),
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [isActive, stats.isSleeping]);

    // Sleep recovery
    useEffect(() => {
        if (!stats.isSleeping) return;

        const interval = setInterval(() => {
            setStats(prev => {
                if (prev.energy >= 100) {
                    return { ...prev, isSleeping: false, energy: 100 };
                }
                return { ...prev, energy: prev.energy + 2 };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stats.isSleeping]);

    const switchRoom = useCallback((room: RoomId) => {
        if (stats.isSleeping && room !== 'bedroom') return;
        if (room === stats.activeRoom) return;

        setIsSwitchingRoom(true);
        playSound(SOUNDS.success);

        setTimeout(() => {
            setStats(prev => ({ ...prev, activeRoom: room }));
            setTimeout(() => setIsSwitchingRoom(false), 300);
        }, 300);
    }, [stats.isSleeping, stats.activeRoom, playSound]);

    const handleAction = useCallback((action: ArtemAction) => {
        if (stats.isSleeping && action !== 'sleep') return;

        playSound(SOUNDS.success);
        if (action !== 'poke') {
            confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
        }

        // Haptic feedback
        try {
            if ('vibrate' in navigator) navigator.vibrate(action === 'poke' ? 5 : 15);
        } catch { /* noop */ }

        setStats(prev => {
            let nextExp = prev.exp + (action === 'poke' ? 1 : 10);
            let nextLevel = prev.level;
            if (nextExp >= 100) {
                nextExp = 0;
                nextLevel += 1;
                setShowLevelUp(true);
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
            }

            switch (action) {
                case 'feed': return { ...prev, hunger: Math.min(100, prev.hunger + 20), happiness: Math.min(100, prev.happiness + 5), exp: nextExp, level: nextLevel };
                case 'wash': return { ...prev, hygiene: Math.min(100, prev.hygiene + 30), happiness: Math.min(100, prev.happiness + 2), exp: nextExp, level: nextLevel };
                case 'sleep': return { ...prev, isSleeping: !prev.isSleeping };
                case 'play': return { ...prev, happiness: Math.min(100, prev.happiness + 25), energy: Math.max(0, prev.energy - 10), exp: nextExp, level: nextLevel };
                case 'poke': return { ...prev, happiness: Math.min(100, prev.happiness + 1), exp: nextExp, level: nextLevel };
                case 'outfit': {
                    const currentIndex = OUTFITS.findIndex(o => o.id === prev.outfit);
                    const nextOutfit = OUTFITS[(currentIndex + 1) % OUTFITS.length].id;
                    return { ...prev, outfit: nextOutfit };
                }
                default: return prev;
            }
        });
    }, [stats.isSleeping, playSound]);

    return {
        stats,
        showLevelUp,
        setShowLevelUp,
        isSwitchingRoom,
        switchRoom,
        handleAction,
    };
}
