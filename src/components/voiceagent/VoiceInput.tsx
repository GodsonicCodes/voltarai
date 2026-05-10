'use client';

import { Send, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VoiceInputProps {
    onSend?: (message: string) => void;
    onCallClick?: () => void;
    onStop?: () => void;
    placeholder?: string;
    isLoading?: boolean;
}

export default function VoiceInput({
    onSend,
    onCallClick,
    onStop,
    placeholder = "Ask me anything you want..",
    isLoading = false,
}: VoiceInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading) {
            if (onStop) onStop();
            return;
        }

        if (message.trim() && onSend) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-3 md:gap-4 justify-center w-full">
                {/* Input Pill */}
                <div className="flex-1 flex items-center bg-[#F9FAFB] border border-gray-200 rounded-full px-4 md:px-5 py-3 md:py-3.5 shadow-sm max-w-lg">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 disabled:opacity-50"
                    />

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ml-2 ${
                            isLoading || message.trim()
                                ? 'bg-black hover:bg-gray-900' 
                                : 'bg-slate-600 hover:bg-gray-400'
                        }`}
                        aria-label={isLoading ? "Stop generating" : "Send message"}
                    >
                        {isLoading ? (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                        ) : (
                            <Send className="w-3.5 h-3.5 text-white ml-0.5" />
                        )}
                    </motion.button>
                </div>

                {/* Call Button Pill */}
                <motion.button
                    type="button"
                    onClick={onCallClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-2 md:px-6 py-3 md:py-3.5 rounded-full bg-[#002983] hover:bg-blue-800 transition-colors shadow-sm shrink-0"
                    aria-label="Start voice call"
                >
                    <Phone className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Call</span>
                </motion.button>
            </div>
        </form>
    );
}
