'use client';

import { motion } from 'framer-motion';
import type { VoiceState } from '@/types/voltar-ai';

interface VoiceWaveformProps {
    voiceState?: VoiceState;
}

const BARS = Array.from({ length: 32 }, (_, i) => i);

// Height ranges per voice state
const stateConfig: Record<VoiceState, { min: number; max: number; speed: number }> = {
    waiting:      { min: 3,  max: 6,  speed: 3 },
    listening:    { min: 8,  max: 40, speed: 0.8 },
    transcribing: { min: 4,  max: 20, speed: 1.2 },
    thinking:     { min: 3,  max: 10, speed: 2 },
    speaking:     { min: 10, max: 48, speed: 0.6 },
};

export default function VoiceWaveform({ voiceState = 'waiting' }: VoiceWaveformProps) {
    const cfg = stateConfig[voiceState];
    const isActive = voiceState === 'listening' || voiceState === 'speaking';

    return (
        <div className="flex items-center justify-center gap-[3px] h-14 w-full max-w-xs">
            {BARS.map((bar) => {
                const seed = (bar * 7 + 13) % 17; // deterministic pseudo-random per bar
                const minH = cfg.min + (seed % 3);
                const maxH = cfg.max - (seed % 8);

                return (
                    <motion.div
                        key={bar}
                        className={`rounded-full w-[3px] ${isActive ? 'bg-indigo-500' : 'bg-gray-300'}`}
                        animate={
                            isActive
                                ? {
                                      height: [
                                          minH,
                                          minH + (maxH - minH) * 0.6,
                                          maxH,
                                          minH + (maxH - minH) * 0.3,
                                          minH,
                                      ],
                                  }
                                : { height: minH }
                        }
                        transition={
                            isActive
                                ? {
                                      duration: cfg.speed,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                      delay: bar * 0.03,
                                  }
                                : { duration: 0.4 }
                        }
                    />
                );
            })}
        </div>
    );
}
