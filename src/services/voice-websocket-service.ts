import { 
  VoiceState, 
  VoiceServerMessage, 
  Message 
} from '../types/voice-assistant';
import { VOICE_WS_URL } from '@/lib/constants';

export type VoiceAgentCallbacks = {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (message: Message) => void;
  onAudioChunk?: (audioData: Uint8Array, sequence: number) => void;
  onInterrupt?: () => void;
  onSessionStarted?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  onConnectionOpen?: () => void;
  onConnectionClose?: () => void;
};

export class VoiceWebSocketService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private sessionId: string | null = null;
  private callbacks: VoiceAgentCallbacks;
  private wsUrl: string;
  private isRecording: boolean = false;

  constructor(
    wsUrl: string = VOICE_WS_URL,
    callbacks: VoiceAgentCallbacks = {}
  ) {
    this.wsUrl = wsUrl;
    this.callbacks = callbacks;
  }

  /**
   * Start a voice session
   */
  async startSession(userId?: string): Promise<void> {
    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Initialize AudioContext
      this.audioContext = new AudioContext({ sampleRate: 16000 });

      // Connect to WebSocket
      await this.connectWebSocket(userId);

      // Start audio processing
      await this.startAudioProcessing();

    } catch (error) {
      console.error('Failed to start voice session:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Connect to WebSocket server
   */
  private async connectWebSocket(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Attempting to connect to WebSocket:', this.wsUrl);
      
      // Check if WebSocket is supported
      if (!window.WebSocket) {
        const error = new Error('WebSocket is not supported by this browser');
        console.error(error.message);
        this.callbacks.onError?.(error);
        reject(error);
        return;
      }
      
      this.ws = new WebSocket(this.wsUrl);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');

        // Send start_session message
        this.ws?.send(JSON.stringify({
          type: 'start_session',
          userId: userId,
        }));

        this.callbacks.onConnectionOpen?.();
        resolve();
      };

      this.ws.onmessage = (event) => {
        this.handleServerMessage(event);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.callbacks.onError?.(new Error('WebSocket connection error'));
        
        // Check if debug mode is enabled
        if (typeof window !== 'undefined' && localStorage.getItem('voice-assistant-debug') === 'true') {
          console.log('Debug: WebSocket error details:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.callbacks.onConnectionClose?.();
        
        // Check if debug mode is enabled
        if (typeof window !== 'undefined' && localStorage.getItem('voice-assistant-debug') === 'true') {
          console.log('Debug: WebSocket close event details:', event);
        }
      };
    });
  }

  /**
   * Handle messages from server
   */
  private handleServerMessage(event: MessageEvent): void {
    // Binary message (audio chunk from server)
    if (event.data instanceof ArrayBuffer) {
      const audioData = new Uint8Array(event.data);
      // Play audio through speakers (implement playAudio method)
      this.playAudio(audioData);
      return;
    }

    // JSON message
    try {
      const message: VoiceServerMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'session_started':
          this.sessionId = message.sessionId;
          this.callbacks.onSessionStarted?.(message.sessionId);
          break;

        case 'state_change':
          this.callbacks.onStateChange?.(message.state as VoiceState);
          break;

        case 'transcript_update':
          this.callbacks.onTranscript?.({
            role: message.message.role,
            text: message.message.text,
            timestamp: message.message.timestamp,
            isFinal: message.message.isFinal,
          });
          break;

        case 'agent_audio_chunk':
          const audioArray = new Uint8Array(message.data);
          this.callbacks.onAudioChunk?.(audioArray, message.sequence);
          this.playAudio(audioArray);
          break;

        case 'interrupt':
          this.callbacks.onInterrupt?.();
          break;
      }
    } catch (error) {
      console.error('Failed to parse server message:', error);
    }
  }

  /**
   * Start audio processing from microphone
   */
  private async startAudioProcessing(): Promise<void> {
    if (!this.audioContext || !this.mediaStream) {
      throw new Error('AudioContext or MediaStream not initialized');
    }

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);

    // Create ScriptProcessorNode for audio processing
    this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.audioProcessor.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      
      // Check if audio context is still running before processing
      if (!this.audioContext || this.audioContext.state === 'closed') {
        return; // Don't process audio if context is closed
      }
      
      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32Array to Int16Array (PCM 16-bit)
      const pcmData = this.float32ToInt16(inputData);

      // Send to server via WebSocket
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(pcmData.buffer);
      }
    };

    source.connect(this.audioProcessor);
    this.audioProcessor.connect(this.audioContext.destination);
  }

  /**
   * Convert Float32Array to Int16Array (PCM 16-bit)
   */
  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }

  /**
   * Play audio received from server
   */
  private async playAudio(audioData: Uint8Array): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'closed') return;

    try {
      // Create audio buffer and play
      const audioBuffer = this.audioContext.createBuffer(1, audioData.length, 16000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < audioData.length; i++) {
        channelData[i] = audioData[i] / 128.0 - 1.0; // Convert from unsigned 8-bit to float
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  /**
   * Start recording audio from microphone
   */
  startRecording(): void {
    this.isRecording = true;
  }

  /**
   * Stop recording audio from microphone
   */
  stopRecording(): void {
    this.isRecording = false;
  }

  /**
   * Send interrupt signal to stop agent speaking
   */
  interrupt(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
  }

  /**
   * End the voice session
   */
  async endSession(): Promise<void> {
    // Send end_session message
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'end_session' }));
    }

    // Close WebSocket
    this.ws?.close();
    this.ws = null;

    // Stop audio processing
    this.audioProcessor?.disconnect();
    this.audioProcessor = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close AudioContext
    await this.audioContext?.close();
    this.audioContext = null;

    this.sessionId = null;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current state
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }
}