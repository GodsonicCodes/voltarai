'use client';

import { motion } from 'framer-motion';

export default function VoiceWaveform() {
    // Generate 50 bars for the waveform
    const bars = Array.from({ length: 50 }, (_, i) => i);

    return (
        <div className="flex items-center justify-center gap-[2px] h-16">
            {bars.map((bar) => (
                <motion.div
                    key={bar}
                    className="w-[3px] bg-gray-400 rounded-full"
                    animate={{
                        height: [
                            Math.random() * 20 + 10,
                            Math.random() * 40 + 20,
                            Math.random() * 30 + 15,
                            Math.random() * 50 + 10,
                            Math.random() * 20 + 10,
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bar * 0.02,
                    }}
                />
            ))}
        </div>
    );
}
