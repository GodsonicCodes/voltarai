import { api } from "@/actions/api";

export interface VoiceMessage {
  text: string;
  timestamp: number;
  isUser: boolean;
}

export interface AIResponse {
  text: string;
  audioUrl?: string;
  timestamp: number;
}

export interface ConversationSession {
  sessionId: string;
  messages: VoiceMessage[];
  createdAt: number;
}

export interface VoiceAssistantConfig {
  model?: string;
  language?: string;
  voice?: string;
  maxTokens?: number;
}

class VoiceAssistantService {
  private sessionId: string;
  private conversation: VoiceMessage[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(config: VoiceAssistantConfig = {}) {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start recording user's voice
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });

      this.audioChunks = [];
      
      const options = {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      };

      this.mediaRecorder = new MediaRecorder(stream, options);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone');
    }
  }

  // Stop recording and get audio blob
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.mediaRecorder?.mimeType || 'audio/webm' 
        });
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = () => {
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    });
  }

  // Convert speech to text using the API
  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en-US');

      const response = await api<{ transcription: string }>('/voice/speech-to-text/', {
        method: 'POST',
        body: formData,
      });

      if (!response.success || !response.data?.transcription) {
        throw new Error(response.error || 'Speech to text failed');
      }

      return response.data.transcription;
    } catch (error) {
      console.error('Speech to text error:', error);
      throw error;
    }
  }

  // Get AI response from text
  async getAIResponse(text: string): Promise<AIResponse> {
    try {
      // Add user message to conversation
      const userMessage: VoiceMessage = {
        text,
        timestamp: Date.now(),
        isUser: true
      };
      this.conversation.push(userMessage);

      const response = await api<{ 
        response: string;
        audioUrl?: string;
      }>('/voice/chat/', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          sessionId: this.sessionId,
          conversation: this.conversation.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.success || !response.data?.response) {
        throw new Error(response.error || 'AI response failed');
      }

      // Add AI response to conversation
      const aiResponse: AIResponse = {
        text: response.data.response,
        audioUrl: response.data.audioUrl,
        timestamp: Date.now()
      };

      const aiMessage: VoiceMessage = {
        text: aiResponse.text,
        timestamp: aiResponse.timestamp,
        isUser: false
      };
      this.conversation.push(aiMessage);

      return aiResponse;
    } catch (error) {
      console.error('AI response error:', error);
      throw error;
    }
  }

  // Convert AI text response to speech
  async textToSpeech(text: string): Promise<string> {
    try {
      const response = await api<{ audioUrl: string }>('/voice/text-to-speech/', {
        method: 'POST',
        body: JSON.stringify({
          text,
          voice: 'en-US-AriaNeural',
          language: 'en-US'
        }),
      });

      if (!response.success || !response.data?.audioUrl) {
        throw new Error(response.error || 'Text to speech failed');
      }

      return response.data.audioUrl;
    } catch (error) {
      console.error('Text to speech error:', error);
      throw error;
    }
  }

  // Play audio response
  async playAudio(audioUrl: string): Promise<void> {
    try {
      const audio = new Audio(audioUrl);
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      throw error;
    }
  }

  // Complete conversation flow
  async processVoiceInput(audioBlob: Blob): Promise<AIResponse> {
    try {
      // Step 1: Convert speech to text
      const transcription = await this.speechToText(audioBlob);
      
      if (!transcription.trim()) {
        throw new Error('No speech detected');
      }

      // Step 2: Get AI response
      const aiResponse = await this.getAIResponse(transcription);

      // Step 3: Convert AI response to speech (optional)
      if (aiResponse.audioUrl) {
        await this.playAudio(aiResponse.audioUrl);
      } else {
        const audioUrl = await this.textToSpeech(aiResponse.text);
        await this.playAudio(audioUrl);
      }

      return aiResponse;
    } catch (error) {
      console.error('Voice processing error:', error);
      throw error;
    }
  }

  // Get conversation history
  getConversation(): VoiceMessage[] {
    return [...this.conversation];
  }

  // Set conversation history
  setConversation(conversation: VoiceMessage[]): void {
    this.conversation = [...conversation];
  }

  // Clear conversation
  clearConversation(): void {
    this.conversation = [];
  }

  // Save conversation to storage
  saveConversationToStorage(key: string = 'voiceAssistantConversation'): void {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        messages: this.conversation,
        createdAt: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save conversation to storage:', error);
    }
  }

  // Load conversation from storage
  loadConversationFromStorage(key: string = 'voiceAssistantConversation'): void {
    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const sessionData = JSON.parse(storedData);
        if (sessionData.messages && Array.isArray(sessionData.messages)) {
          this.conversation = sessionData.messages.map((msg: { text: string; timestamp: number; isUser: boolean }) => ({
            text: msg.text,
            timestamp: msg.timestamp,
            isUser: msg.isUser
          }));
          if (sessionData.sessionId) {
            this.sessionId = sessionData.sessionId;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load conversation from storage:', error);
    }
  }

  // Get session info
  getSessionInfo(): ConversationSession {
    return {
      sessionId: this.sessionId,
      messages: this.conversation,
      createdAt: Date.now()
    };
  }
}

export const voiceAssistantService = new VoiceAssistantService();
export default VoiceAssistantService;
