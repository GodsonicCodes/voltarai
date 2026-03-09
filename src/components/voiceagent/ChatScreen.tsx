'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';
import VoiceInput from './VoiceInput';

interface Message {
    type: 'user' | 'assistant';
    content: string;
    isThinking?: boolean;
}

interface ChatScreenProps {
    messages: Message[];
    onSend?: (message: string) => void;
    onCallClick?: () => void;
    onBackClick?: () => void;
}

export default function ChatScreen({ messages, onSend, onCallClick, onBackClick }: ChatScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
        >
            {/* Header */}
            <div className="flex items-center px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBackClick}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Go back"
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center gap-2 flex-1 justify-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 overflow-hidden border border-indigo-500">
                        <img
                            src="/assets/voiceagent/voiceagent.png"
                            alt="Assistant"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-900">V-Agent</span>
                </div>

                {/* Spacer to balance the back button */}
                <div className="w-8" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6">
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={idx}
                        type={msg.type}
                        content={msg.content}
                        isThinking={msg.isThinking}
                    />
                ))}
            </div>

            {/* Input */}
            <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200">
                <VoiceInput
                    onSend={onSend}
                    onCallClick={onCallClick}
                    placeholder="Ask me anything you want..."
                />
            </div>
        </motion.div>
    );
}
