import { useState, useCallback } from 'react';

export function useSound() {
    const [isMuted, setIsMuted] = useState(false);

    const playSound = useCallback((url: string) => {
        if (isMuted) return;
        try {
            const audio = new Audio(url);
            audio.volume = 0.4;
            audio.play().catch(() => { }); // Ignore autoplay blocks
        } catch {
            // Silently fail
        }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const haptic = useCallback((duration: number = 10) => {
        try {
            if ('vibrate' in navigator) {
                navigator.vibrate(duration);
            }
        } catch {
            // Not supported
        }
    }, []);

    return { isMuted, playSound, toggleMute, haptic };
}
