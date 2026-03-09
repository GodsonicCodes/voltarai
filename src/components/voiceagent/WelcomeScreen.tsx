'use client';

import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import Image from 'next/image';

interface WelcomeScreenProps {
    onSend?: (message: string) => void;
    onCallClick?: () => void;
}

export default function WelcomeScreen({ onSend, onCallClick }: WelcomeScreenProps) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-between h-full py-8 md:py-12 px-4 md:px-6"
      >
        {/* Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4 md:mb-6">
            {/* Avatar with indigo ring border matching the design */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-[3px] border-blue-700 bg-gray-200">
              <Image
                src={"/assets/voiceagent/voiceagent.png"}
                className="w-full h-full object-cover"
                alt="voice assist"
                width={100}
                height={100}
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
            How can I assist you today?
          </h1>

          {/* Description */}
          <p className="text-center text-xs md:text-sm text-gray-600 max-w-md leading-relaxed px-2">
            I am <span className="font-semibold text-blue-600">V-Agent</span>,
            your AI Intelligent Assistant.
            <br />
            I go beyond answering questions - I qualify leads, schedule demos,
            <br className="hidden md:inline" />
            and deliver strategic automation advice tailored to your business.
          </p>
        </div>

        {/* Input */}
        <div className="w-full max-w-lg">
          <VoiceInput
            onSend={onSend}
            onCallClick={onCallClick}
            placeholder="Ask me anything you want..."
          />
        </div>
      </motion.div>
    );
}
