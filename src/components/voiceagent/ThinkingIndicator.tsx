'use client';

import { motion } from 'framer-motion';

export default function ThinkingIndicator() {
    return (
        <div className="flex items-center gap-1 px-1">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1 h-1 bg-black rounded-full"
                    animate={{
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: dot * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
