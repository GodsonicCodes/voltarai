import {
  VoiceServerMessage,
  Message,
} from "../types/voice-assistant";

export type VoiceState =
  | "waiting"
  | "listening"
  | "transcribing"
  | "thinking"
  | "speaking";

export interface VoiceAgentCallbacks {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (message: Message) => void;
  onAudioChunk?: (audioData: Uint8Array, sequence: number) => void;
  onInterrupt?: () => void;
  onSessionStarted?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  onConnectionOpen?: () => void;
  onConnectionClose?: () => void;
}

export class VoiceAgentWebSocketService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private sessionId: string | null = null;
  private callbacks: VoiceAgentCallbacks;
  private wsUrl: string;

  constructor(
    wsUrl: string = "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary",
    callbacks: VoiceAgentCallbacks = {}
  ) {
    this.wsUrl = process.env.NEXT_PUBLIC_VOICE_WS_URL || wsUrl;
    this.callbacks = callbacks;
  }

  async startSession(userId?: string): Promise<void> {
    try {
      await this.checkServerHealth();

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });

      await this.connectWebSocketWithRetry(userId, 3);

      await this.startAudioProcessing();
    } catch (error) {
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async reconnectSession(userId?: string): Promise<void> {
    if (!this.audioContext || this.audioContext.state === "closed") {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
    }

    await this.connectWebSocketWithRetry(userId, 3);

    if (this.mediaStream) {
      await this.startAudioProcessing();
    }
  }

  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(
        "https://voltarai-vagent-2.onrender.com/api/health"
      );
      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`);
      }

      await response.json();
      return true;
    } catch {
      return true;
    }
  }

  /**
   * FIXED: retry loop and error scoping
   */
  private async connectWebSocketWithRetry(
    userId?: string,
    maxRetries: number = 3
  ): Promise<void> {
    let attempts = 0;
    let lastError: unknown;

    while (attempts < maxRetries) {
      try {
        await this.connectWebSocket(userId);
        return;
      } catch (err) {
        attempts++;
        lastError = err;
        await new Promise((res) => setTimeout(res, 1000 * attempts));
      }
    }

    throw lastError;
  }

  private async connectWebSocket(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.WebSocket) {
        const error = new Error("WebSocket not supported");
        this.callbacks.onError?.(error);
        reject(error);
        return;
      }

      this.ws = new WebSocket(this.wsUrl);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        this.ws?.send(
          JSON.stringify({
            type: "start_session",
            userId,
          })
        );

        this.callbacks.onConnectionOpen?.();
        resolve();
      };

      this.ws.onmessage = (event) => this.handleServerMessage(event);

      this.ws.onerror = () => {
        const error = new Error("WebSocket connection error");
        this.callbacks.onError?.(error);
      };

      this.ws.onclose = async (event) => {
        this.callbacks.onConnectionClose?.();

        if (event.code === 1005 || event.code === 1011) {
          try {
            await this.reconnectSession(userId);
          } catch {
            // swallow error
          }
        }
      };
    });
  }

  private handleServerMessage(event: MessageEvent): void {
    if (event.data instanceof ArrayBuffer) {
      const audioData = new Uint8Array(event.data);
      this.playAudio(audioData);
      return;
    }

    try {
      const message: VoiceServerMessage = JSON.parse(event.data);

      switch (message.type) {
        case "session_started":
          this.sessionId = message.sessionId;
          this.callbacks.onSessionStarted?.(message.sessionId);
          break;

        case "state_change":
          this.callbacks.onStateChange?.(message.state);
          break;

        case "transcript_update":
          this.callbacks.onTranscript?.({
            role: message.message.role,
            text: message.message.text,
            timestamp: message.message.timestamp,
            isFinal: message.message.isFinal,
          });
          break;

        case "agent_audio_chunk":
          const audioArray = new Uint8Array(message.data);
          this.callbacks.onAudioChunk?.(audioArray, message.sequence);
          this.playAudio(audioArray);
          break;

        case "interrupt":
          this.callbacks.onInterrupt?.();
          break;
      }
    } catch {
      // ignore bad JSON
    }
  }

  private async startAudioProcessing(): Promise<void> {
    if (!this.audioContext || !this.mediaStream) {
      throw new Error("Audio not initialized");
    }

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);

    this.audioProcessor =
      this.audioContext.createScriptProcessor(4096, 1, 1);

    this.audioProcessor.onaudioprocess = (e) => {
      if (!this.audioContext || this.audioContext.state === "closed") return;

      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = this.float32ToInt16(inputData);

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(pcmData.buffer);
        } catch {
          // ignore
        }
      }
    };

    source.connect(this.audioProcessor);
    this.audioProcessor.connect(this.audioContext.destination);
  }

  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  }

  private async playAudio(audioData: Uint8Array): Promise<void> {
    if (!this.audioContext || this.audioContext.state === "closed") return;

    try {
      const audioBuffer = this.audioContext.createBuffer(
        1,
        audioData.length,
        16000
      );
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < audioData.length; i++) {
        channelData[i] = audioData[i] / 128 - 1;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch {
      // ignore
    }
  }

  interrupt(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "interrupt" }));
    }
  }

  async endSession(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "end_session" }));
    }

    this.ws?.close();
    this.ws = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    this.audioProcessor?.disconnect();
    this.audioProcessor = null;

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.sessionId = null;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isActive(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
