import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart?: () => void;
}

interface TranscriptionResult {
  finalText: string;
  interimText: string;
}

interface UseWebSpeechTranscriptionReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

export const useWebSpeechTranscription = (
  onResult: (result: TranscriptionResult) => void
): UseWebSpeechTranscriptionReturn => {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      interimTranscriptRef.current = interimTranscript;
      
      onResult({
        finalText: finalTranscriptRef.current,
        interimText: interimTranscriptRef.current,
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error, event.message);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        // Restart recognition if it stopped unexpectedly
        try {
          recognition.start();
        } catch (e) {
          // Ignore error if recognition is already started
          console.warn('Recognition restart failed:', e instanceof Error ? e.message : e);
        }
      } else {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
      } catch (e) {
        console.error('Failed to start speech recognition:', e instanceof Error ? e.message : e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, [isListening]);

  const reset = useCallback(() => {
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    onResult({ finalText: '', interimText: '' });
  }, [onResult]);

  return {
    isListening,
    startListening,
    stopListening,
    reset,
  };
};