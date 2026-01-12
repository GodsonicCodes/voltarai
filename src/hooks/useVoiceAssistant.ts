import { useState, useCallback, useRef, useEffect } from 'react';
import VoiceAssistantService, { VoiceMessage, AIResponse } from '@/services/voice-assistant';
import { useWebSpeechTranscription } from './useWebSpeechTranscription';

interface UseVoiceAssistantOptions {
  autoStart?: boolean;
  maxRecordingTime?: number;
  silenceThreshold?: number;
}

interface UseVoiceAssistantReturn {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  conversation: VoiceMessage[];
  lastResponse: AIResponse | null;
  currentTranscript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  retryLastAction: () => Promise<void>;
}

export const useVoiceAssistant = ({
  autoStart = false,
}: UseVoiceAssistantOptions = {}): UseVoiceAssistantReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<VoiceMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const voiceService = useRef<VoiceAssistantService>(new VoiceAssistantService());
  
  // Initialize conversation from storage
  useEffect(() => {
    voiceService.current.loadConversationFromStorage();
    setConversation(voiceService.current.getConversation());
  }, []);
  
  // Use Web Speech API for transcription
  const { startListening, stopListening } = useWebSpeechTranscription(
    ({ finalText, interimText }) => {
      // Update current transcript with interim text
      setCurrentTranscript(interimText);
      
      // Handle speech recognition results
      if (finalText.trim()) {
        // Add user message to conversation when final text is available
        const userMessage: VoiceMessage = {
          text: finalText.trim(),
          timestamp: Date.now(),
          isUser: true
        };
        
        // Update both local state and service
        setConversation(prev => {
          const newConversation = [...prev, userMessage];
          voiceService.current.setConversation(newConversation);
          voiceService.current.saveConversationToStorage();
          return newConversation;
        });
        
        // Clear the current transcript after final text is processed
        setCurrentTranscript('');
        
        // Process the user message with AI
        processUserMessage(finalText.trim());
      }
    }
  );

  // Process user message with AI
  const processUserMessage = useCallback(async (userText: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await voiceService.current.getAIResponse(userText);
      
      setLastResponse(response);
      setIsSpeaking(true);
      
      // Add AI response to conversation
      const aiMessage: VoiceMessage = {
        text: response.text,
        timestamp: Date.now(),
        isUser: false
      };
      
      // Update both local state and service
      setConversation(prev => {
        const newConversation = [...prev, aiMessage];
        voiceService.current.setConversation(newConversation);
        voiceService.current.saveConversationToStorage();
        return newConversation;
      });
      
      // Stop speaking when audio finishes
      setTimeout(() => {
        setIsSpeaking(false);
      }, Math.min(response.text.length * 100, 10000)); // Estimate based on text length
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process message');
    } finally {
      setIsProcessing(false);
    }
  }, []);



  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsRecording(true);
      
      startListening();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  }, [startListening]);

  const stopRecording = useCallback(async () => {
    try {
      if (!isRecording) return;

      setIsRecording(false);
      stopListening();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
    }
  }, [isRecording, stopListening]);

  const sendMessage = useCallback(async (text: string) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      const response = await voiceService.current.getAIResponse(text);
      
      setLastResponse(response);
      setIsSpeaking(true);
      
      setTimeout(() => {
        setIsSpeaking(false);
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    voiceService.current.clearConversation();
    voiceService.current.saveConversationToStorage(); // Save the cleared conversation
    setConversation([]);
    setLastResponse(null);
    setError(null);
  }, []);

  const retryLastAction = useCallback(async () => {
    if (lastResponse) {
      await sendMessage(lastResponse.text);
    }
  }, [lastResponse, sendMessage]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart, startRecording]);

  return {
    isRecording,
    isProcessing,
    isSpeaking,
    conversation,
    lastResponse,
    currentTranscript,
    error,
    startRecording,
    stopRecording,
    sendMessage,
    clearConversation,
    retryLastAction,
  };
};
