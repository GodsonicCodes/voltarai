'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VoiceWaveform from './VoiceWaveform';
import VoiceControls from './VoiceControls';
import type { VoiceState, TranscriptMessage } from '@/types/voltar-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ListeningScreenProps {
    isRecording?: boolean;
    isMuted?: boolean;
    voiceState?: VoiceState;
    transcript?: TranscriptMessage[];
    onMicClick?: () => void;
    onInterrupt?: () => void;
    onCloseClick?: () => void;
    onBackClick?: () => void;
}

const STATE_LABELS: Record<VoiceState, string> = {
    waiting: 'Ready',
    listening: 'Listening',
    transcribing: 'Transcribing…',
    thinking: 'Thinking…',
    speaking: 'Speaking…',
};

export default function ListeningScreen({
    isRecording = true,
    isMuted = false,
    voiceState = 'waiting',
    transcript = [],
    onMicClick,
    onInterrupt,
    onCloseClick,
    onBackClick,
}: ListeningScreenProps) {
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const visibleTranscript = transcript.filter((t) => t.text?.trim());
    const hasTranscript = visibleTranscript.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full py-10 md:py-16 px-4 md:px-12 relative"
        >
            {/* ── SVG connector lines ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden pb-40 z-0">
                {/* Left line from corner */}
                <svg
                    className="absolute top-0 left-0 w-full h-full text-indigo-400 opacity-40"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 45 0 L 45 15 L 35 25 L 35 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                
                {/* Right line from corner */}
                <svg
                    className="absolute top-0 left-0 w-full h-full text-indigo-400 opacity-40"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 72 0 L 72 15 L 82 25 L 82 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>

            {/* ── Top section: avatar + transcript (split when active) ───────── */}
            {hasTranscript ? (
                /* Two-column on md, vertical stack on mobile */
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-14 flex-1 min-h-0 relative z-10 w-full max-w-4xl mx-auto md:pt-6">
                    {/* Left column / Top mobile block — avatar + state label */}
                    <div className="flex flex-col items-center shrink-0 w-full md:w-[160px] order-1 md:order-1 mb-2 md:mb-0">
                        {/* Avatar with animated ring */}
                        <div className="relative flex items-center justify-center mb-3">
                            <motion.div
                                className="absolute rounded-full border-[4px] border-[#3B00E6]"
                                style={{ width: 'calc(100% + 18px)', height: 'calc(100% + 18px)' }}
                                animate={
                                    voiceState === 'speaking' || voiceState === 'listening'
                                        ? { scale: [1, 1.12, 1], opacity: [0.4, 1, 0.4] }
                                        : { scale: 1, opacity: 0.25 }
                                }
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-[4px] border-[#3B00E6] bg-gray-200">
                                <img
                                    src="/assets/voiceagent/voiceagent.png"
                                    alt="Assistant"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <motion.p
                            key={voiceState}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#3B00E6] text-lg md:text-xl font-medium tracking-wide"
                        >
                            {STATE_LABELS[voiceState]}
                        </motion.p>
                    </div>

                    {/* Waveform - exclusively for Mobile layout (sits between avatar and chats) */}
                    <div className="flex justify-center w-full md:hidden order-2 my-2 relative z-10">
                        <VoiceWaveform voiceState={voiceState} />
                    </div>

                    {/* Right column / Bottom mobile block — transcript bubbles */}
                    <div className="flex-1 w-full overflow-y-auto space-y-4 min-h-0 max-h-full px-2 md:px-0 md:pr-2 pb-4 order-3 md:order-2 mt-2 md:mt-8">
                        {visibleTranscript.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Assistant avatar thumbnail */}
                                {msg.role === 'agent' && (
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-300 bg-gray-200 shrink-0 mb-0.5">
                                        <img
                                            src="/assets/voiceagent/voiceagent.png"
                                            alt="Assistant"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <span
                                    className={`text-xs md:text-[13px] px-5 py-3.5 max-w-[85%] shadow-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-[#3B00E6] text-white rounded-[20px] rounded-br-sm'
                                            : 'bg-[#F3F4F6] text-gray-800 rounded-[20px] rounded-bl-sm border border-gray-100'
                                    } ${!msg.isFinal ? 'opacity-70 italic' : ''}`}
                                >
                                    <div className={`prose prose-xs max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </span>
                            </motion.div>
                        ))}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>
            ) : (
                /* Centered layout when no transcript yet */
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            className="absolute rounded-full border-[4px] border-[#3B00E6]"
                            style={{ width: 'calc(100% + 20px)', height: 'calc(100% + 20px)' }}
                            animate={
                                voiceState === 'speaking' || voiceState === 'listening'
                                    ? { scale: [1, 1.12, 1], opacity: [0.4, 1, 0.4] }
                                    : { scale: 1, opacity: 0.25 }
                            }
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[4px] border-[#3B00E6] bg-gray-200">
                            <img
                                src="/assets/voiceagent/voiceagent.png"
                                alt="Assistant"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <motion.p
                        key={voiceState}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#3B00E6] font-semibold text-sm md:text-base"
                    >
                        {STATE_LABELS[voiceState]}
                    </motion.p>
                </div>
            )}

            {/* ── Waveform — visible on Desktop only, placed at bottom ─────────────────── */}
            <div className="hidden md:flex justify-center my-6 relative z-10">
                <VoiceWaveform voiceState={voiceState} />
            </div>

            {/* ── Controls pill — pinned to bottom ───────────────────────────── */}
            <div className="flex justify-center relative z-10">
                <VoiceControls
                    isRecording={isRecording}
                    isMuted={isMuted}
                    voiceState={voiceState}
                    onMicClick={onMicClick}
                    onInterrupt={onInterrupt}
                    onCloseClick={onCloseClick}
                />
            </div>
        </motion.div>
    );
}
