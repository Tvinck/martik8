import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

function FloatingElement({ children, delay = 0, position }: { children: React.ReactNode; delay?: number; position: { left: string; top: string }; key?: any }) {
    return (
        <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
                x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
            }}
            className="absolute pointer-events-none"
            style={position}
        >
            {children}
        </motion.div>
    );
}

export default function FloatingBackground() {
    // Fewer elements on mobile for performance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 8 : 20;

    const elements = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            type: i % 3,
        }));
    }, [count]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {elements.map((el) => (
                <FloatingElement key={el.id} delay={el.id * 0.5} position={{ left: el.left, top: el.top }}>
                    {el.type === 0 ? (
                        <Heart className="text-rose-200 w-4 h-4 fill-rose-200" />
                    ) : el.type === 1 ? (
                        <Sparkles className="text-amber-200 w-3 h-3" />
                    ) : (
                        <div className="w-1 h-1 bg-rose-300 rounded-full opacity-40" />
                    )}
                </FloatingElement>
            ))}
            {/* Dynamic Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-100/30 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-50/40 rounded-full blur-[120px]"
            />
        </div>
    );
}
