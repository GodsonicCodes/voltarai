'use client';

import { Volume2, Mic, MicOff, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VoiceState } from '@/types/voltar-ai';

interface VoiceControlsProps {
    isRecording?: boolean;
    isMuted?: boolean;
    voiceState?: VoiceState;
    onVolumeClick?: () => void;
    onMicClick?: () => void;
    onInterrupt?: () => void;
    onCloseClick?: () => void;
}

export default function VoiceControls({
    isRecording = false,
    isMuted = false,
    voiceState = 'waiting',
    onVolumeClick,
    onMicClick,
    onInterrupt,
    onCloseClick,
}: VoiceControlsProps) {
    const isSpeaking = voiceState === 'speaking';

    return (
        <div className="flex items-center justify-center gap-2 md:gap-3">
            {/* Volume / speaker indicator */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onVolumeClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Volume"
            >
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>

            {/* Mic / Mute toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMicClick}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors ${
                    isMuted
                        ? 'bg-gray-300 hover:bg-gray-400'
                        : isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
                {isMuted ? (
                    <MicOff className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                ) : (
                    <Mic className={`w-5 h-5 md:w-6 md:h-6 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
                )}
            </motion.button>

            {/* Interrupt — only visible when agent is speaking */}
            <AnimatePresence>
                {isSpeaking && (
                    <motion.button
                        key="interrupt"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onInterrupt}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center transition-colors"
                        aria-label="Interrupt agent"
                        title="Interrupt"
                    >
                        <Square className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* End call */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCloseClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                aria-label="End call"
                title="End call"
            >
                <X className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </motion.button>
        </div>
    );
}
