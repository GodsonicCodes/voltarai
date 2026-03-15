// ============================================
// VOICE AGENT TYPES
// ============================================

export type VoiceState = 'waiting' | 'listening' | 'transcribing' | 'thinking' | 'speaking';

export interface TranscriptMessage {
    role: 'user' | 'agent';
    text: string;
    timestamp: number;
    isFinal: boolean;
}

// ============================================
// VOICE AGENT TYPES (LEGACY / BINARY)
// ============================================

// Server → Client WebSocket messages
export interface WsSessionStarted {
    type: 'session_started';
    sessionId: string;
    websocketUrl: string;
}

export interface WsStateChange {
    type: 'state_change';
    state: VoiceState;
}

export interface WsTranscriptUpdate {
    type: 'transcript_update';
    message: TranscriptMessage;
}

export interface WsAgentAudioChunk {
    type: 'agent_audio_chunk';
    data: number[];
    sequence: number;
}

export interface WsInterrupt {
    type: 'interrupt';
}

// ============================================
// VOICE AGENT TYPES (GROK SPEECH-TO-SPEECH)
// ============================================

export interface WsGrokSessionStarted {
    type: 'session_started';
    sessionId: string;
    mode: string;
}

export interface WsGrokState {
    type: 'state';
    state: 'waiting' | 'listening' | 'thinking' | 'speaking';
}

export interface WsGrokAudio {
    type: 'audio';
    data: number[];
}

export interface WsGrokTranscript {
    type: 'transcript';
    role: 'user' | 'agent';
    text: string;
}

export interface WsGrokError {
    type: 'error';
    message: string;
}

export type VoiceServerMessage =
    | WsSessionStarted
    | WsStateChange
    | WsTranscriptUpdate
    | WsAgentAudioChunk
    | WsInterrupt
    | WsGrokSessionStarted
    | WsGrokState
    | WsGrokAudio
    | WsGrokTranscript
    | WsGrokError;

// Client → Server
export interface ClientStartSession {
    type: 'start_session';
    userId?: string;
}

export interface ClientInterrupt {
    type: 'interrupt';
}

export interface ClientEndSession {
    type: 'end_session';
}

// ============================================
// CHAT AI TYPES
// ============================================

export interface ChatStartSessionResponse {
    session_id: string;
    created_at: string;
}

export interface ChatMessageResponse {
    session_id: string;
    message: string;
    response: string;
    user_info: {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
        service_interest?: string | null;
    };
    timestamp: string;
}

export interface ChatHistoryItem {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
}

export interface ChatHistoryResponse {
    session_id: string;
    messages: ChatHistoryItem[];
    user_info: Record<string, unknown>;
}

// ============================================
// UI TYPES
// ============================================

export interface UIMessage {
    type: 'user' | 'assistant';
    content: string;
    isThinking?: boolean;
    source?: 'voice' | 'chat';
}
