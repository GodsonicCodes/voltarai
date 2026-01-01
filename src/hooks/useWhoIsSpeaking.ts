import { useState, useEffect, useRef, useCallback } from "react";
import { startMicVolumeListener } from "@/lib/volume-listener";

interface UseWhoIsSpeakingOptions {
  userSpeechThreshold?: number;
  aiSpeechThreshold?: number;
  debounceMs?: number;
}

interface UseWhoIsSpeakingReturn {
  isUserSpeaking: boolean;
  isAiSpeaking: boolean;
  isAnyoneSpeaking: boolean;
  setAiSpeaking: (speaking: boolean) => void;
  userVolume: number;
}

export const useWhoIsSpeaking = ({
  userSpeechThreshold = 15,

  debounceMs = 300,
}: UseWhoIsSpeakingOptions = {}): UseWhoIsSpeakingReturn => {
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userVolume, setUserVolume] = useState(0);
  
  const userSpeakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVolumeTimeRef = useRef<number>(Date.now());

  const setAiSpeaking = useCallback((speaking: boolean) => {
    setIsAiSpeaking(speaking);
  }, []);

  // User speech detection using microphone
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const initializeUserDetection = async () => {
      try {
        cleanup = await startMicVolumeListener((volume: number) => {
          setUserVolume(volume);
          
          const now = Date.now();

          
          if (volume > userSpeechThreshold) {
            lastVolumeTimeRef.current = now;
            
            // Clear existing timeout
            if (userSpeakingTimeoutRef.current) {
              clearTimeout(userSpeakingTimeoutRef.current);
            }
            
            // Set user as speaking immediately
            setIsUserSpeaking(true);
            
            // Set timeout to detect when user stops speaking
            userSpeakingTimeoutRef.current = setTimeout(() => {
              const timeSinceLastHighVolume = Date.now() - lastVolumeTimeRef.current;
              if (timeSinceLastHighVolume > debounceMs) {
                setIsUserSpeaking(false);
              }
            }, debounceMs);
          }
        });
      } catch (error) {
        console.error("Error initializing user speech detection:", error);
      }
    };

    initializeUserDetection();

    return () => {
      if (cleanup) {
        cleanup();
      }
      if (userSpeakingTimeoutRef.current) {
        clearTimeout(userSpeakingTimeoutRef.current);
      }
    };
  }, [userSpeechThreshold, debounceMs]);

  const isAnyoneSpeaking = isUserSpeaking || isAiSpeaking;

  return {
    isUserSpeaking,
    isAiSpeaking,
    isAnyoneSpeaking,
    setAiSpeaking,
    userVolume,
  };
};