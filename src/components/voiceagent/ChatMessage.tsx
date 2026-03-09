'use client';

import { motion } from 'framer-motion';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatMessageProps {
    type: 'user' | 'assistant';
    content: string;
    isThinking?: boolean;
}

export default function ChatMessage({ type, content, isThinking = false }: ChatMessageProps) {
    if (type === 'user') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end mb-3"
            >
                <div className="bg-violet-700 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-2xl rounded-tr-sm max-w-md text-xs md:text-sm">
                    {content}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2 mb-3"
        >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-400">
                <img
                    src="/assets/voiceagent/voiceagent.png"
                    alt="Assistant"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="bg-white border border-gray-200 px-3 md:px-4 py-2 md:py-2.5 rounded-2xl rounded-tl-sm max-w-md text-xs md:text-sm text-gray-700">
                {isThinking ? <ThinkingIndicator /> : content}
            </div>
        </motion.div>
    );
}
