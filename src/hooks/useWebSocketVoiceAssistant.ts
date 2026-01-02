import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceAgentWebSocketService, VoiceState } from '@/services/voice-agent-websocket.service';
import { Message } from '@/types/voltar-ai';
import { VOICE_WS_URL } from '@/lib/constants';

interface UseWebSocketVoiceAssistantOptions {
  autoStart?: boolean;
  userId?: string;
}

interface UseWebSocketVoiceAssistantReturn {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
  hasActiveSession: boolean;
  currentState: VoiceState;
  transcript: Message[];
  error: string | null;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  interrupt: () => void;
  reconnectSession: (userId?: string) => Promise<void>;
  addTranscriptMessage: (message: Message) => void;
  clearTranscript: () => void;
}

export const useWebSocketVoiceAssistant = ({
  autoStart = false,
  userId,
}: UseWebSocketVoiceAssistantOptions = {}): UseWebSocketVoiceAssistantReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [currentState, setCurrentState] = useState<VoiceState>('waiting');
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const voiceServiceRef = useRef<VoiceAgentWebSocketService | null>(null);

  // Initialize the voice service
  useEffect(() => {
    voiceServiceRef.current = new VoiceAgentWebSocketService(
      VOICE_WS_URL,
      {
        onStateChange: (state) => {
          setCurrentState(state);
          setIsListening(['listening', 'transcribing'].includes(state));
          setIsProcessing(['transcribing', 'thinking'].includes(state));
          setIsSpeaking(state === 'speaking');
          // Set session as active when we receive any state change after connection
          setHasActiveSession(true);
        },
        onTranscript: (message) => {
          setTranscript(prev => [...prev, message]);
        },
        onSessionStarted: (sessionId) => {
          console.log('Session started:', sessionId);
          // Store session ID in localStorage for persistence
          if (sessionId) {
            localStorage.setItem('voice-assistant-session-id', sessionId);
          }
          setIsConnecting(false);
          setIsListening(true);
          setHasActiveSession(true);
        },
        onError: (err) => {
          setError(err.message);
          setIsConnecting(false);
          setIsListening(false);
          setHasActiveSession(false);
        },
        onConnectionClose: () => {
          setIsListening(false);
          setIsConnecting(false);
          setHasActiveSession(false);
        },
      }
    );

    // Cleanup on unmount
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.endSession();
      }
      setHasActiveSession(false);
    };
  }, []);

  const startSession = useCallback(async () => {
    if (!voiceServiceRef.current || isListening || isConnecting) return;

    setError(null);
    setIsConnecting(true);
    try {
      // Start a new session
      await voiceServiceRef.current.startSession(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start voice session';
      
      // Provide more specific error messages based on common issues
      let userFriendlyMessage = `Failed to start voice session. ${errorMessage}.`;
      
      if (errorMessage.toLowerCase().includes('websocket') || errorMessage.toLowerCase().includes('connection')) {
        userFriendlyMessage += ' Please check your internet connection and make sure the voice service is available.';
      } else if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('microphone')) {
        userFriendlyMessage += ' Please check microphone permissions.';
      }
      
      setError(userFriendlyMessage);
      setIsConnecting(false);
    }
  }, [isListening, isConnecting, userId]);

  const endSession = useCallback(async () => {
    if (!voiceServiceRef.current) return;

    try {
      await voiceServiceRef.current.endSession();
      setIsListening(false);
      setIsConnecting(false);
      setHasActiveSession(false);
      // Clear stored session ID when session ends
      localStorage.removeItem('voice-assistant-session-id');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
      setHasActiveSession(false);
    }
  }, []);

  const interrupt = useCallback(() => {
    voiceServiceRef.current?.interrupt();
  }, []);
  
  const reconnectSession = useCallback(async (userId?: string) => {
    if (!voiceServiceRef.current) return;
    
    try {
      await voiceServiceRef.current.reconnectSession(userId);
      setIsListening(true);
      setHasActiveSession(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reconnect session');
      setIsListening(false);
      setHasActiveSession(false);
    }
  }, []);

  const addTranscriptMessage = useCallback((message: Message) => {
    setTranscript(prev => [...prev, message]);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isListening && !isConnecting) {
      startSession();
    }
  }, [autoStart, isListening, isConnecting, startSession]);

  return {
    isListening,
    isProcessing,
    isSpeaking,
    isConnecting,
    hasActiveSession,
    currentState,
    transcript,
    error,
    startSession,
    endSession,
    interrupt,
    reconnectSession,
    addTranscriptMessage,
    clearTranscript,
  };
};