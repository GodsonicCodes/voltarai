'use client';

import { Mic, MicOff, MessageSquare, X, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { VoiceState } from '@/types/voltar-ai';

interface VoiceControlsProps {
    isRecording?: boolean;
    isMuted?: boolean;
    voiceState?: VoiceState;
    onMicClick?: () => void;
    onInterrupt?: () => void;
    onCloseClick?: () => void;
}

export default function VoiceControls({
    isRecording = false,
    isMuted = false,
    voiceState = 'waiting',
    onMicClick,
    onInterrupt,
    onCloseClick,
}: VoiceControlsProps) {
    const isSpeaking = voiceState === 'speaking';

    return (
        <div className="flex items-center justify-center">
            {/* Pill container */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md">

                {/* Mic / Mute toggle */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={onMicClick}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                    {isMuted ? (
                        <MicOff className="w-4 h-4 text-gray-500" />
                    ) : (
                        <Mic className="w-4 h-4 text-gray-600" />
                    )}
                </motion.button>

                {/* End call — central red button, slightly larger */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={onCloseClick}
                    className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="End call"
                    title="End call"
                >
                    <PhoneOff className="w-5 h-5 text-white" />
                </motion.button>

                {/* Chat / Message toggle */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Open chat"
                    title="Open chat"
                >
                    <MessageSquare className="w-4 h-4 text-black" fill="currentColor" />
                </motion.button>

                {/* Close / dismiss */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={onCloseClick}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Close"
                    title="Close"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </motion.button>
            </div>
        </div>
    );
}
