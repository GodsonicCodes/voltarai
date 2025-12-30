// ============================================
// VOICE AGENT TYPES
// ============================================

export type VoiceState = "waiting" | "listening" | "transcribing" | "thinking" | "speaking";

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
  state: VoiceState;
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

export interface Message {
  role: "user" | "agent" | "assistant";
  text?: string;
  content?: string;
  timestamp: number;
  isFinal?: boolean;
  is_final?: boolean;
}

export type VoiceServerMessage =
  | VoiceSessionStartResponse
  | VoiceStateChangeMessage
  | VoiceTranscriptUpdateMessage
  | VoiceAudioChunkMessage
  | VoiceInterruptMessage;