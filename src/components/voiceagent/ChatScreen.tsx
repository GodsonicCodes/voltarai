'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';
import VoiceInput from './VoiceInput';
import type { UIMessage } from '@/types/voltar-ai';

interface ChatScreenProps {
    messages: UIMessage[];
    onSend?: (message: string) => void;
    onCallClick?: () => void;
    onBackClick?: () => void;
}

export default function ChatScreen({ messages, onSend, onCallClick, onBackClick }: ChatScreenProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to newest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isLoading = messages.length > 0 && messages[messages.length - 1].isThinking;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full relative"
        >
            {/* ── SVG connector lines ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden pb-40 z-0">
                {/* Left line to avatar */}
                {/* <svg
                    className="absolute top-0 left-0 w-full h-full text-indigo-400 opacity-40"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 45 0 L 45 15 L 35 25 L 35 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg> */}
                
                {/* Right line to bubble */}
                {/* <svg
                    className="absolute top-0 left-0 w-full h-full text-indigo-400 opacity-40"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 72 0 L 72 15 L 82 25 L 82 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg> */}
            </div>

            {/* Header Pill (Centered) */}
            <div className="flex justify-center pt-8 pb-4 relative z-10">
                <div className="flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img
                            src="/assets/voiceagent/voiceagent.png"
                            alt="Assistant"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 pr-2 tracking-wide">V-Agent</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 w-full max-w-4xl mx-auto space-y-4 relative z-10">
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={idx}
                        type={msg.type}
                        content={msg.content}
                        isThinking={msg.isThinking}
                        source={msg.source}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input Form at the Bottom (Matches Welcome Screen) */}
            <div className="w-full max-w-2xl mx-auto px-4 pb-6 mt-4 relative z-10">
                <VoiceInput
                    onSend={onSend}
                    onCallClick={onCallClick}
                    placeholder="Ask me anything you want.."
                    isLoading={isLoading}
                />
            </div>
        </motion.div>
    );
}
