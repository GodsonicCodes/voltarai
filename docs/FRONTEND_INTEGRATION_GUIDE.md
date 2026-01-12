# 🚀 Frontend Integration Guide - Voltar AI Voice & Chat Agent

**Complete TypeScript Integration for Chat AI and Voice Agent**

This guide provides everything your frontend team needs to integrate the Voltar AI Chat and Voice Agent into your TypeScript application.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [API Base URL](#api-base-url)
3. [TypeScript Types & Interfaces](#typescript-types--interfaces)
4. [Chat AI Integration](#chat-ai-integration)
5. [Voice Agent Integration](#voice-agent-integration)
6. [WebSocket Protocol](#websocket-protocol)
7. [Error Handling](#error-handling)
8. [Complete Code Examples](#complete-code-examples)
9. [Best Practices](#best-practices)
10. [Testing](#testing)

---

## 🎯 Quick Start

### Installation

```bash
npm install axios  # For HTTP requests (Chat AI)
# WebSocket is native in browsers - no installation needed
```

### API Base URL

```typescript
// Production
const API_BASE_URL = "https://voltarai-vagent-2.onrender.com";

// Local Development
// const API_BASE_URL = "http://localhost:10000";
```

---

## 📦 TypeScript Types & Interfaces

Create a file: `types/voltar-ai.ts`

```typescript
// ============================================
// COMMON TYPES
// ============================================

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  service: string;
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  service_interest?: string;
  company?: string;
}

export interface Message {
  role: "user" | "agent" | "assistant";
  text?: string;
  content?: string;
  timestamp: number;
  isFinal?: boolean;
  is_final?: boolean;
}

// ============================================
// CHAT AI TYPES
// ============================================

export interface ChatStartSessionRequest {
  user_id?: string;
}

export interface ChatStartSessionResponse {
  session_id: string;
  created_at: string;
}

export interface ChatMessageRequest {
  session_id: string;
  message: string;
}

export interface ChatMessageResponse {
  session_id: string;
  message: string;
  response: string;
  user_info: UserInfo;
  timestamp: string;
}

export interface ChatSessionInfoResponse {
  session_id: string;
  user_id?: string;
  status: "active" | "ended";
  message_count: number;
  user_info: UserInfo;
  created_at: string;
  duration: number;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: number;
  }>;
  user_info: UserInfo;
}

// ============================================
// VOICE AGENT TYPES
// ============================================

export interface VoiceSessionStartRequest {
  type: "start_session";
  userId?: string;
}

export interface VoiceSessionStartResponse {
  type: "session_started";
  sessionId: string;
  websocketUrl: string;
}

export interface VoiceStateChangeMessage {
  type: "state_change";
  state: "waiting" | "listening" | "transcribing" | "thinking" | "speaking";
}

export interface VoiceTranscriptUpdateMessage {
  type: "transcript_update";
  message: {
    role: "user" | "agent";
    text: string;
    timestamp: number;
    isFinal: boolean;
  };
}

export interface VoiceAudioChunkMessage {
  type: "agent_audio_chunk";
  data: number[];  // Array of bytes
  sequence: number;
}

export interface VoiceInterruptMessage {
  type: "interrupt";
}

export interface VoiceEndSessionMessage {
  type: "end_session";
}

export type VoiceServerMessage =
  | VoiceSessionStartResponse
  | VoiceStateChangeMessage
  | VoiceTranscriptUpdateMessage
  | VoiceAudioChunkMessage
  | VoiceInterruptMessage;

// ============================================
// REST API SESSION TYPES
// ============================================

export interface SessionInfoResponse {
  session_id: string;
  user_id?: string;
  status: "active" | "ended";
  created_at: string;
  duration: number;
  message_count: number;
}

export interface TranscriptResponse {
  session_id: string;
  messages: Message[];
  lead_data: UserInfo;
}
```

---

## 💬 Chat AI Integration

### Step 1: Create Chat Service

Create a file: `services/chat-ai.service.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import {
  ChatStartSessionResponse,
  ChatMessageResponse,
  ChatSessionInfoResponse,
  ChatHistoryResponse,
  UserInfo,
} from '../types/voltar-ai';

export class ChatAIService {
  private api: AxiosInstance;
  private sessionId: string | null = null;

  constructor(baseURL: string = "https://voltarai-vagent-2.onrender.com") {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });
  }

  /**
   * Start a new chat session
   */
  async startSession(userId?: string): Promise<string> {
    try {
      const response = await this.api.post<ChatStartSessionResponse>(
        '/api/chat/sessions/start',
        { user_id: userId }
      );

      this.sessionId = response.data.session_id;
      return this.sessionId;
    } catch (error) {
      console.error('Failed to start chat session:', error);
      throw new Error('Failed to start chat session');
    }
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(message: string): Promise<ChatMessageResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Call startSession() first.');
    }

    try {
      const response = await this.api.post<ChatMessageResponse>(
        '/api/chat/message',
        {
          session_id: this.sessionId,
          message: message,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Send a message and stream the response
   * Returns an async generator that yields response chunks
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.sessionId) {
      throw new Error('No active session. Call startSession() first.');
    }

    try {
      const response = await fetch(
        `${this.api.defaults.baseURL}/api/chat/message/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: this.sessionId,
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        yield chunk;
      }
    } catch (error) {
      console.error('Failed to stream message:', error);
      throw new Error('Failed to stream message');
    }
  }

  /**
   * Get current session information
   */
  async getSessionInfo(): Promise<ChatSessionInfoResponse> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await this.api.get<ChatSessionInfoResponse>(
        `/api/chat/sessions/${this.sessionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get session info:', error);
      throw new Error('Failed to get session info');
    }
  }

  /**
   * Get conversation history
   */
  async getHistory(): Promise<ChatHistoryResponse> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await this.api.get<ChatHistoryResponse>(
        `/api/chat/sessions/${this.sessionId}/history`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get history:', error);
      throw new Error('Failed to get history');
    }
  }

  /**
   * End the current chat session
   */
  async endSession(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      await this.api.post(`/api/chat/sessions/${this.sessionId}/end`);
      this.sessionId = null;
    } catch (error) {
      console.error('Failed to end session:', error);
      throw new Error('Failed to end session');
    }
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
  hasActiveSession(): boolean {
    return this.sessionId !== null;
  }
}
```

### Step 2: Use Chat Service in React Component

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { ChatAIService } from '../services/chat-ai.service';
import { ChatMessageResponse } from '../types/voltar-ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatService = useRef<ChatAIService | null>(null);

  useEffect(() => {
    // Initialize chat service and start session
    const initChat = async () => {
      chatService.current = new ChatAIService();
      try {
        await chatService.current.startSession();
        console.log('Chat session started');
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (chatService.current) {
        chatService.current.endSession();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !chatService.current) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Regular response (non-streaming)
      const response: ChatMessageResponse = await chatService.current.sendMessage(inputMessage);

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageStreaming = async () => {
    if (!inputMessage.trim() || !chatService.current) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);

    try {
      let fullResponse = '';

      // Create placeholder for streaming response
      const aiMessageIndex = messages.length + 1;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }]);

      // Stream the response
      for await (const chunk of chatService.current.sendMessageStream(userMessage.content)) {
        fullResponse += chunk;

        // Update the AI message with accumulated response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[aiMessageIndex] = {
            role: 'assistant',
            content: fullResponse,
            timestamp: Date.now(),
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Failed to stream message:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="loading">Maya is typing...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading || isStreaming}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || isStreaming || !inputMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
```

### Step 3: Use Chat Service in Vue Component

```typescript
<template>
  <div class="chat-widget">
    <div class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role]"
      >
        <div class="message-content">{{ msg.content }}</div>
      </div>
      <div v-if="isLoading" class="loading">Maya is typing...</div>
    </div>

    <div class="chat-input">
      <input
        v-model="inputMessage"
        @keypress.enter="sendMessage"
        placeholder="Type your message..."
        :disabled="isLoading"
      />
      <button
        @click="sendMessage"
        :disabled="isLoading || !inputMessage.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChatAIService } from '../services/chat-ai.service';
import type { ChatMessageResponse } from '../types/voltar-ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const messages = ref<ChatMessage[]>([]);
const inputMessage = ref('');
const isLoading = ref(false);
const chatService = ref<ChatAIService | null>(null);

onMounted(async () => {
  chatService.value = new ChatAIService();
  try {
    await chatService.value.startSession();
    console.log('Chat session started');
  } catch (error) {
    console.error('Failed to initialize chat:', error);
  }
});

onUnmounted(() => {
  if (chatService.value) {
    chatService.value.endSession();
  }
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !chatService.value) return;

  const userMessage: ChatMessage = {
    role: 'user',
    content: inputMessage.value,
    timestamp: Date.now(),
  };

  messages.value.push(userMessage);
  const messageToSend = inputMessage.value;
  inputMessage.value = '';
  isLoading.value = true;

  try {
    const response: ChatMessageResponse = await chatService.value.sendMessage(messageToSend);

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: response.response,
      timestamp: Date.now(),
    };

    messages.value.push(aiMessage);
  } catch (error) {
    console.error('Failed to send message:', error);
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: Date.now(),
    };
    messages.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

## 🎤 Voice Agent Integration

### Step 1: Create Voice Service

Create a file: `services/voice-agent.service.ts`

```typescript
import {
  VoiceServerMessage,
  VoiceStateChangeMessage,
  VoiceTranscriptUpdateMessage,
  VoiceAudioChunkMessage,
  Message,
} from '../types/voltar-ai';

export type VoiceState = "waiting" | "listening" | "transcribing" | "thinking" | "speaking";

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

export class VoiceAgentService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private sessionId: string | null = null;
  private callbacks: VoiceAgentCallbacks;
  private wsUrl: string;

  constructor(
    wsUrl: string = "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary",
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
      this.ws = new WebSocket(this.wsUrl);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('WebSocket connected');

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
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.callbacks.onConnectionClose?.();
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
          this.callbacks.onStateChange?.(message.state);
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
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32Array to Int16Array (PCM 16-bit)
      const pcmData = this.float32ToInt16(inputData);

      // Send to server via WebSocket
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(pcmData.buffer);
      }
    };

    source.connect(processor);
    processor.connect(this.audioContext.destination);
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
    if (!this.audioContext) return;

    try {
      // Convert PCM data to AudioBuffer and play
      // Note: You'll need to implement proper audio decoding based on your format
      // This is a simplified example
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
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
}
```

### Step 2: Use Voice Service in React Component

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { VoiceAgentService, VoiceState } from '../services/voice-agent.service';
import { Message } from '../types/voltar-ai';

export const VoiceWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentState, setCurrentState] = useState<VoiceState>('waiting');
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const voiceService = useRef<VoiceAgentService | null>(null);

  useEffect(() => {
    // Initialize voice service
    voiceService.current = new VoiceAgentService(
      "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary",
      {
        onStateChange: (state) => {
          setCurrentState(state);
          console.log('State changed:', state);
        },
        onTranscript: (message) => {
          setTranscript(prev => [...prev, message]);
        },
        onSessionStarted: (sessionId) => {
          console.log('Session started:', sessionId);
          setIsActive(true);
        },
        onError: (err) => {
          console.error('Voice error:', err);
          setError(err.message);
        },
        onConnectionClose: () => {
          setIsActive(false);
        },
      }
    );

    // Cleanup on unmount
    return () => {
      if (voiceService.current) {
        voiceService.current.endSession();
      }
    };
  }, []);

  const startCall = async () => {
    setError(null);
    try {
      await voiceService.current?.startSession();
    } catch (err) {
      setError('Failed to start call. Please check microphone permissions.');
    }
  };

  const endCall = async () => {
    await voiceService.current?.endSession();
    setIsActive(false);
  };

  const interrupt = () => {
    voiceService.current?.interrupt();
  };

  const getStateLabel = (state: VoiceState): string => {
    const labels: Record<VoiceState, string> = {
      waiting: '⏸️ Waiting',
      listening: '🎤 Listening',
      transcribing: '📝 Transcribing',
      thinking: '💭 Thinking',
      speaking: '🔊 Speaking',
    };
    return labels[state];
  };

  return (
    <div className="voice-widget">
      <div className="voice-status">
        <div className={`status-indicator ${currentState}`}>
          {getStateLabel(currentState)}
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="voice-transcript">
        {transcript.map((msg, index) => (
          <div key={index} className={`transcript-message ${msg.role}`}>
            <span className="role">{msg.role === 'user' ? 'You' : 'Maya'}:</span>
            <span className="text">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="voice-controls">
        {!isActive ? (
          <button onClick={startCall} className="btn-start">
            📞 Start Call
          </button>
        ) : (
          <>
            <button onClick={interrupt} className="btn-interrupt">
              ⏸️ Interrupt
            </button>
            <button onClick={endCall} className="btn-end">
              ❌ End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};
```

---

## 🔌 WebSocket Protocol

### Connection Flow

```
Client                          Server
  |                               |
  |------ WebSocket Connect ----->|
  |                               |
  |<------ Connection Opened -----|
  |                               |
  |---- start_session (JSON) ---->|
  |                               |
  |<--- session_started (JSON) ---|
  |<--- state_change: speaking ---|
  |<--- transcript_update (JSON)--|
  |<--- agent_audio_chunk (JSON)--|
  |<--- state_change: waiting ----|
  |                               |
  |---- audio_data (Binary) ----->|
  |                               |
  |<--- state_change: listening --|
  |<--- state_change: transcribing|
  |<--- transcript_update (JSON)--|
  |<--- state_change: thinking ---|
  |<--- state_change: speaking ---|
  |<--- agent_audio_chunk (JSON)--|
  |                               |
  |---- interrupt (JSON) -------->|
  |                               |
  |<--- interrupt (JSON) ---------|
  |                               |
  |---- end_session (JSON) ------>|
  |                               |
  |<------ Connection Closed -----|
```

### Client → Server Messages

#### 1. Start Session
```json
{
  "type": "start_session",
  "userId": "optional-user-id"
}
```

#### 2. Audio Data (Binary)
- Send raw PCM audio data as binary WebSocket frames
- Format: PCM 16-bit, 16kHz, Mono
- Chunk size: 4096 samples (256KB)

#### 3. Interrupt
```json
{
  "type": "interrupt"
}
```

#### 4. End Session
```json
{
  "type": "end_session"
}
```

### Server → Client Messages

#### 1. Session Started
```json
{
  "type": "session_started",
  "sessionId": "uuid-string",
  "websocketUrl": "ws://..."
}
```

#### 2. State Change
```json
{
  "type": "state_change",
  "state": "waiting" | "listening" | "transcribing" | "thinking" | "speaking"
}
```

#### 3. Transcript Update
```json
{
  "type": "transcript_update",
  "message": {
    "role": "user" | "agent",
    "text": "Transcribed or generated text",
    "timestamp": 1703001234567,
    "isFinal": true
  }
}
```

#### 4. Agent Audio Chunk
```json
{
  "type": "agent_audio_chunk",
  "data": [byte, array, of, audio],
  "sequence": 0
}
```

#### 5. Interrupt Acknowledgment
```json
{
  "type": "interrupt"
}
```

---

## 🎨 Complete Code Examples

### Example 1: Simple Chat Integration

```typescript
// simple-chat.ts
import { ChatAIService } from './services/chat-ai.service';

async function simpleChat() {
  const chat = new ChatAIService();

  // Start session
  await chat.startSession();
  console.log('Session started');

  // Send message
  const response = await chat.sendMessage("What services does Voltar AI offer?");
  console.log('Maya:', response.response);

  // End session
  await chat.endSession();
}

simpleChat();
```

### Example 2: Streaming Chat

```typescript
// streaming-chat.ts
import { ChatAIService } from './services/chat-ai.service';

async function streamingChat() {
  const chat = new ChatAIService();

  await chat.startSession();

  console.log('User: What can you help me with?');
  console.log('Maya: ', { end: '' });

  // Stream response
  for await (const chunk of chat.sendMessageStream("What can you help me with?")) {
    process.stdout.write(chunk);
  }

  console.log('\n');
  await chat.endSession();
}

streamingChat();
```

### Example 3: Voice Call with Full Transcript

```typescript
// voice-call.ts
import { VoiceAgentService } from './services/voice-agent.service';
import { Message } from './types/voltar-ai';

async function makeVoiceCall() {
  const transcript: Message[] = [];

  const voice = new VoiceAgentService(
    "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary",
    {
      onStateChange: (state) => console.log(`State: ${state}`),
      onTranscript: (message) => {
        transcript.push(message);
        console.log(`${message.role}: ${message.text}`);
      },
      onSessionStarted: (sessionId) => {
        console.log(`Call started: ${sessionId}`);
      },
      onError: (error) => {
        console.error('Error:', error.message);
      },
    }
  );

  // Start call
  await voice.startSession('user-123');

  // Let the call run for 60 seconds
  await new Promise(resolve => setTimeout(resolve, 60000));

  // End call
  await voice.endSession();

  // Print full transcript
  console.log('\n=== Full Transcript ===');
  transcript.forEach(msg => {
    console.log(`[${msg.role}]: ${msg.text}`);
  });
}

makeVoiceCall();
```

---

## ⚠️ Error Handling

### Best Practices

```typescript
// error-handling.ts
import { ChatAIService } from './services/chat-ai.service';
import { VoiceAgentService } from './services/voice-agent.service';

// Chat error handling
async function safeChatMessage(chat: ChatAIService, message: string) {
  try {
    const response = await chat.sendMessage(message);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        // Session not found - restart session
        await chat.startSession();
        return await chat.sendMessage(message);
      } else if (error.message.includes('timeout')) {
        // Timeout - retry once
        return await chat.sendMessage(message);
      } else {
        // Unknown error - log and throw
        console.error('Chat error:', error);
        throw error;
      }
    }
    throw error;
  }
}

// Voice error handling
async function safeVoiceSession() {
  const voice = new VoiceAgentService(
    "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary",
    {
      onError: async (error) => {
        console.error('Voice error:', error);

        // Attempt reconnection
        if (error.message.includes('WebSocket')) {
          console.log('Attempting reconnection...');
          setTimeout(async () => {
            try {
              await voice.startSession();
            } catch (reconnectError) {
              console.error('Reconnection failed:', reconnectError);
            }
          }, 2000);
        }
      },
    }
  );

  try {
    await voice.startSession();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Permission denied')) {
      alert('Please allow microphone access to use voice features.');
    } else {
      console.error('Failed to start voice session:', error);
    }
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `No active session` | Session not started or expired | Call `startSession()` first |
| `WebSocket connection error` | Network issue or server down | Retry connection after delay |
| `Permission denied` | Microphone access denied | Request permission again |
| `404 Session not found` | Session expired on server | Create new session |
| `Timeout` | Request took too long | Increase timeout or retry |

---

## ✅ Best Practices

### 1. Session Management

```typescript
// Always clean up sessions
useEffect(() => {
  const chat = new ChatAIService();
  chat.startSession();

  return () => {
    chat.endSession(); // Cleanup on unmount
  };
}, []);
```

### 2. Error Boundaries

```typescript
// React Error Boundary for voice/chat
class VoiceErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    if (error.message.includes('microphone')) {
      // Show user-friendly message
      this.setState({ error: 'Please enable microphone access' });
    }
  }
}
```

### 3. Loading States

```typescript
// Always show loading states
const [isLoading, setIsLoading] = useState(false);

const sendMessage = async () => {
  setIsLoading(true);
  try {
    await chat.sendMessage(message);
  } finally {
    setIsLoading(false); // Always reset loading
  }
};
```

### 4. Retry Logic

```typescript
// Implement exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** i)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 5. Responsive Design

```typescript
// Detect mobile and adjust audio settings
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const audioConstraints = {
  audio: {
    sampleRate: isMobile ? 16000 : 48000,
    echoCancellation: true,
    noiseSuppression: true,
  },
};
```

---

## 🧪 Testing

### Unit Tests (Jest)

```typescript
// chat-ai.service.test.ts
import { ChatAIService } from './chat-ai.service';

describe('ChatAIService', () => {
  let service: ChatAIService;

  beforeEach(() => {
    service = new ChatAIService('http://localhost:10000');
  });

  afterEach(async () => {
    if (service.hasActiveSession()) {
      await service.endSession();
    }
  });

  test('should start a session', async () => {
    const sessionId = await service.startSession();
    expect(sessionId).toBeTruthy();
    expect(service.hasActiveSession()).toBe(true);
  });

  test('should send a message', async () => {
    await service.startSession();
    const response = await service.sendMessage('Hello');

    expect(response.response).toBeTruthy();
    expect(response.session_id).toBeTruthy();
  });

  test('should throw error without session', async () => {
    await expect(service.sendMessage('Hello')).rejects.toThrow('No active session');
  });
});
```

### Integration Test

```typescript
// integration.test.ts
import { ChatAIService } from './services/chat-ai.service';

describe('Full Chat Flow', () => {
  test('complete conversation', async () => {
    const chat = new ChatAIService();

    // Start session
    await chat.startSession('test-user');

    // Send messages
    const r1 = await chat.sendMessage('What services do you offer?');
    expect(r1.response).toContain('Voltar AI');

    const r2 = await chat.sendMessage('I need help with automation');
    expect(r2.user_info).toBeDefined();

    // Get history
    const history = await chat.getHistory();
    expect(history.messages.length).toBeGreaterThanOrEqual(4);

    // End session
    await chat.endSession();
    expect(chat.hasActiveSession()).toBe(false);
  }, 30000); // 30s timeout
});
```

---

## 📱 Platform-Specific Notes

### React Native

```typescript
// Install dependencies
// npm install react-native-webrtc

// Use react-native-webrtc for audio
import { mediaDevices } from 'react-native-webrtc';

async startSession() {
  const stream = await mediaDevices.getUserMedia({
    audio: true,
  });
  // Continue with voice session...
}
```

### Next.js

```typescript
// Use dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

const VoiceWidget = dynamic(
  () => import('../components/VoiceWidget'),
  { ssr: false } // Disable server-side rendering
);
```

### Electron

```typescript
// Request microphone permission in main.js
const { systemPreferences } = require('electron');

const micAccess = await systemPreferences.askForMediaAccess('microphone');
if (!micAccess) {
  console.error('Microphone access denied');
}
```

---

## 🚀 Production Checklist

- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Session cleanup on component unmount
- [ ] Retry logic for network failures
- [ ] Microphone permission handling
- [ ] Mobile responsiveness tested
- [ ] WebSocket reconnection logic
- [ ] HTTPS/WSS in production (required for microphone)
- [ ] User feedback for all states
- [ ] Analytics tracking (optional)

---

## 📞 Support

**API Documentation:** https://voltarai-vagent-2.onrender.com/docs

**Issues:** Contact your backend team

**Health Check:** https://voltarai-vagent-2.onrender.com/api/health

---

## 🎉 You're Ready!

Your frontend team now has everything needed to integrate the Voltar AI Chat and Voice Agent. Happy coding! 🚀
