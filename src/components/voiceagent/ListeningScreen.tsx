'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform';
import VoiceControls from './VoiceControls';

interface ListeningScreenProps {
    isRecording?: boolean;
    onVolumeClick?: () => void;
    onMicClick?: () => void;
    onPauseClick?: () => void;
    onCloseClick?: () => void;
    onBackClick?: () => void;
}

export default function ListeningScreen({
    isRecording = true,
    onVolumeClick,
    onMicClick,
    onPauseClick,
    onCloseClick,
    onBackClick,
}: ListeningScreenProps) {
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

            {/* Main listening UI — clean, no chat overlay */}
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Avatar with animated ring */}
                <div className="relative mb-6 flex items-center justify-center">
                    {/* Outer animated pulsing ring */}
                    <motion.div
                        className="absolute rounded-full border-[3px] border-indigo-600"
                        style={{ width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}
                        animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.5, 0.9, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    {/* Avatar with solid indigo border ring */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] border-indigo-600 bg-gray-200">
                        <img
                            src="/assets/voiceagent/voiceagent.png"
                            alt="Assistant"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Status */}
                <p className="text-indigo-600 font-semibold mb-6 md:mb-8 text-sm md:text-base">Listening</p>

                {/* Waveform */}
                <VoiceWaveform />
            </div>

            {/* Controls */}
            <div className="w-full max-w-lg">
                <VoiceControls
                    isRecording={isRecording}
                    onVolumeClick={onVolumeClick}
                    onMicClick={onMicClick}
                    onPauseClick={onPauseClick}
                    onCloseClick={onCloseClick}
                />
            </div>
        </motion.div>
    );
}
