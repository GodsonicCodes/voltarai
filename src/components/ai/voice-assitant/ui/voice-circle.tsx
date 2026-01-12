"use client";

import { useEffect, useRef, useState } from "react";
import { startMicVolumeListener } from "@/lib/volume-listener";
import AiAgent from "../../../../../public/assets/ai/ai-agent.png";
import Image from "next/image";

interface VoiceCircleProps {
  isUserSpeaking?: boolean;
  isAiSpeaking?: boolean;
  isListening?: boolean;
}

export default function VoiceCircle({ isUserSpeaking = false, isAiSpeaking = false, isListening= false }: VoiceCircleProps) {
  const ringRef = useRef<HTMLDivElement>(null);

  // When AI is speaking, we'll apply a different animation
  const [aiScale, setAiScale] = useState(1);

  useEffect(() => {
    let stop: (() => void) | null = null;

    const initVolumeListener = () => {
      startMicVolumeListener((volume) => {
        if (!ringRef.current || isAiSpeaking) return; // Don't scale when AI is speaking

        // Apply scaling based on volume, but with a minimum threshold to reduce noise
        const minThreshold = 0.5; // Minimum volume threshold to trigger scaling
        const scaledVolume = volume > minThreshold ? volume : 0;
        const scale = 1 + scaledVolume / 300; // Reduced sensitivity
        
        // Use a smooth transition to reduce flickering
        ringRef.current!.style.transition = 'transform 0.1s ease-out';
        ringRef.current!.style.transform = `scale(${scale})`;
      }).then((cleanup) => {
        stop = cleanup;
      }).catch((error) => {
        console.error('Error starting volume listener:', error);
      });
    };

    if (isListening && !isAiSpeaking) {
      initVolumeListener();
    }

    return () => {
      if (stop) stop();
    };
  }, [isListening, isAiSpeaking]);

  // Handle AI speaking animation
  useEffect(() => {
    if (isAiSpeaking) {
      // Create a pulsing animation when AI is speaking
      const interval = setInterval(() => {
        setAiScale(prev => {
          // Alternate between 1.1 and 1.3 for a pulsing effect
          return prev > 1.2 ? 1.1 : 1.3;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setAiScale(1);
    }
  }, [isAiSpeaking]);

  // Apply the appropriate transform based on state
  useEffect(() => {
    if (ringRef.current) {
      if (isAiSpeaking) {
        // Apply AI speaking animation with blue gradient
        ringRef.current.style.transform = `scale(${aiScale})`;
        ringRef.current.style.background = 'linear-gradient(224.01deg, #004ae9 12.4%, #022266 84.58%)';
        // Ensure the ring is visible
        ringRef.current.style.opacity = '1';
      } else {
        // Reset to default when not AI speaking
        ringRef.current.style.transform = 'scale(1)';
        // Set a different style for user speaking (if needed)
        if (isUserSpeaking) {
          ringRef.current.style.background = 'radial-gradient(circle, rgba(0,74,233,0.3) 0%, rgba(0,74,233,0) 70%)';
        } else {
          ringRef.current.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)';
        }
        ringRef.current.style.opacity = '1';
      }
    }
  }, [isAiSpeaking, aiScale, isUserSpeaking]);

  // Determine status text based on state
  const getStatusText = () => {
    if (isAiSpeaking) return "AI Speaking";
    if (isUserSpeaking) return "Listening";
    if (isListening) return "Ready";
    return "Waiting";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-8">
      <div className="radial-ai-wrapper flex items-center justify-center">
        <div ref={ringRef} className="radial-ai-ring" />
        <Image
          src={AiAgent}
          alt="AI Agent"
          width={64}
          height={64}
          className="w-12 h-12 md:w-[90px] md:h-[90px] rounded-full relative z-10"
        />
      </div>

      <p className="text-xl md:text-[30px] font-[375] text-[#004AE9]">
        {getStatusText()}<span className="animate-dots"></span>
      </p>
    </div>
  );
}
