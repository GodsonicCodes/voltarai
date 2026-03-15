'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
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
    listening: 'Listening…',
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

    // Auto-scroll as new transcript lines arrive
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const finalTranscript = transcript.filter((t) => t.isFinal && t.text?.trim());
    const pendingEntries = transcript.filter((t) => !t.isFinal && t.text?.trim());

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-between h-full py-8 md:py-12 px-4 md:px-6 relative"
        >
            {/* Back button */}
            <div className="w-full flex items-center mb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBackClick}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Go back"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </motion.button>
            </div>

            {/* Avatar + state */}
            <div className="flex flex-col items-center">
                <div className="relative mb-4 flex items-center justify-center">
                    {/* Outer animated ring */}
                    <motion.div
                        className="absolute rounded-full border-[3px] border-indigo-600"
                        style={{ width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}
                        animate={
                            voiceState === 'speaking' || voiceState === 'listening'
                                ? { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }
                                : { scale: 1, opacity: 0.3 }
                        }
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] border-indigo-600 bg-gray-200">
                        <img
                            src="/assets/voiceagent/voiceagent.png"
                            alt="Assistant"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Dynamic state label */}
                <motion.p
                    key={voiceState}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-indigo-600 font-semibold text-sm md:text-base mb-4"
                >
                    {STATE_LABELS[voiceState]}
                </motion.p>

                {/* Waveform — only active when listening or speaking */}
                <VoiceWaveform voiceState={voiceState} />
            </div>

            {/* In-call transcript scroll */}
            {(finalTranscript.length > 0 || pendingEntries.length > 0) && (
                <div className="w-full max-w-lg flex-1 overflow-y-auto mt-4 px-1 space-y-2 max-h-40">
                    {finalTranscript.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <span
                                className={`text-xs px-3 py-1.5 rounded-2xl max-w-[80%] shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-violet-600 text-white rounded-tr-sm'
                                        : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                                }`}
                            >
                                <div className={`prose prose-xs max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </span>
                        </div>
                    ))}
                    {/* Streaming / in-progress entries */}
                    {pendingEntries.map((pendingMsg, i) => (
                        <div
                            key={`pending-${i}`}
                            className={`flex ${pendingMsg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <span
                                className={`text-xs px-3 py-1.5 rounded-2xl max-w-[80%] opacity-70 italic shadow-sm ${
                                    pendingMsg.role === 'user'
                                        ? 'bg-violet-500 text-white rounded-tr-sm'
                                        : 'bg-gray-100 text-gray-500 rounded-tl-sm'
                                }`}
                            >
                                <div className={`prose prose-xs max-w-none ${pendingMsg.role === 'user' ? 'prose-invert' : ''}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {pendingMsg.text}
                                    </ReactMarkdown>
                                </div>
                            </span>
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
            )}

            {/* Controls */}
            <div className="w-full max-w-lg mt-4">
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
