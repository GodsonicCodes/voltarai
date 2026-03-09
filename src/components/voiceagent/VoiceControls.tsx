'use client';

import { Volume2, Mic, Pause, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceControlsProps {
    isRecording?: boolean;
    onVolumeClick?: () => void;
    onMicClick?: () => void;
    onPauseClick?: () => void;
    onCloseClick?: () => void;
}

export default function VoiceControls({
    isRecording = false,
    onVolumeClick,
    onMicClick,
    onPauseClick,
    onCloseClick,
}: VoiceControlsProps) {
    return (
        <div className="flex items-center justify-center gap-2 md:gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onVolumeClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Volume"
            >
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMicClick}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors ${isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                aria-label="Microphone"
            >
                <Mic className={`w-5 h-5 md:w-6 md:h-6 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPauseClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Pause"
            >
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCloseClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
        </div>
    );
}
