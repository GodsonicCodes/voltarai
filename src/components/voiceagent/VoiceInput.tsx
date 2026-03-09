'use client';

import { Send, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VoiceInputProps {
    onSend?: (message: string) => void;
    onCallClick?: () => void;
    placeholder?: string;
}

export default function VoiceInput({
    onSend,
    onCallClick,
    placeholder = "Ask me anything you want...",
}: VoiceInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && onSend) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2 md:gap-3 bg-white border border-gray-200 rounded-full px-3 md:px-5 py-2 md:py-3 shadow-sm">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                    aria-label="Send message"
                >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </motion.button>

                <motion.button
                    type="button"
                    onClick={onCallClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 md:px-4 h-8 md:h-9 rounded-full bg-blue-700 hover:bg-blue-700 transition-colors flex-shrink-0"
                    aria-label="Start voice call"
                >
                    <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                    <span className="text-white text-xs md:text-sm font-medium">Call</span>
                </motion.button>
            </div>
        </form>
    );
}
