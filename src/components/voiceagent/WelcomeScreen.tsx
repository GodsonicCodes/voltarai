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
        className="flex flex-col items-center h-full py-16 md:py-24 px-4 md:px-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mb-8">
            {/* Simple small avatar without the ring */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ">
              <Image
                src={"/assets/voiceagent/voiceagent.png"}
                className="w-full h-full object-cover"
                alt="voice assist"
                width={64}
                height={64}
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-xl md:text-[22px] font-bold text-gray-900 mb-4 text-center">
            How can I assist you today?
          </h1>

          {/* Description */}
          <div className="text-center text-xs md:text-[13px] text-gray-500 max-w-lg leading-relaxed px-2">
            <p className="mb-1.5">
              I am <span className="font-semibold text-[#3B00E6]">V-Agent</span>, Voltar AI's Intelligent Assistant.
            </p>
            <p>
              I go beyond answering questions - I qualify leads, schedule demos,
              <br className="hidden md:inline" />
              and deliver strategic automation advice tailored to your business.
            </p>
          </div>
        </div>

        {/* Input & Call Form */}
        <div className="w-full max-w-2xl mt-auto mb-4">
          <VoiceInput
            onSend={onSend}
            onCallClick={onCallClick}
            placeholder="Ask me anything you want.."
          />
        </div>
      </motion.div>
    );
}
