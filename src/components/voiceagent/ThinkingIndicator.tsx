'use client';

import { motion } from 'framer-motion';

export default function ThinkingIndicator() {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: dot * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
