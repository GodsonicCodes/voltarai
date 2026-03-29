'use client';

import { motion } from 'framer-motion';
import type { VoiceState } from '@/types/voltar-ai';

interface VoiceWaveformProps {
    voiceState?: VoiceState;
}

const BARS_COUNT = 60;
const BARS = Array.from({ length: BARS_COUNT }, (_, i) => i);

// Height ranges per voice state
const stateConfig: Record<VoiceState, { min: number; max: number; speed: number }> = {
    waiting:      { min: 3,  max: 6,  speed: 3 },
    listening:    { min: 8,  max: 45, speed: 0.7 },
    transcribing: { min: 4,  max: 20, speed: 1.0 },
    thinking:     { min: 3,  max: 12, speed: 1.8 },
    speaking:     { min: 10, max: 55, speed: 0.5 },
};

export default function VoiceWaveform({ voiceState = 'waiting' }: VoiceWaveformProps) {
    const cfg = stateConfig[voiceState];
    const isActive = voiceState === 'listening' || voiceState === 'speaking';

    return (
        <div className="flex items-center justify-center h-14 w-full max-w-md px-2 overflow-hidden">
            {BARS.map((bar) => {
                const isLeftHalf = bar < BARS.length / 2;
                const seed = (bar * 13 + 7) % 23;
                const minH = cfg.min + (seed % 4);
                const maxH = cfg.max - (seed % 10);

                // Design: subtle asymmetry - left half is more uniform, right half is more dynamic
                const baseColor = isLeftHalf ? 'bg-gray-400/80' : 'bg-gray-800';
                const widthCls = isLeftHalf ? 'w-[1.5px]' : 'w-[2.5px]';
                const marginCls = 'mx-[1px]';

                return (
                    <motion.div
                        key={bar}
                        className={`rounded-full ${widthCls} ${marginCls} ${
                            isActive ? baseColor : 'bg-gray-300'
                        }`}
                        animate={
                            isActive
                                ? {
                                      height: [
                                          minH,
                                          minH + (maxH - minH) * (isLeftHalf ? 0.35 : 0.75),
                                          maxH,
                                          minH + (maxH - minH) * 0.25,
                                          minH,
                                      ],
                                  }
                                : { height: minH }
                        }
                        transition={
                            isActive
                                ? {
                                      duration: cfg.speed * (isLeftHalf ? 1.1 : 0.9),
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                      delay: bar * 0.02,
                                  }
                                : { duration: 0.4 }
                        }
                    />
                );
            })}
        </div>
    );
}
