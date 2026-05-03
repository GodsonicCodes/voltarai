import type {
    VoiceState,
    VoiceServerMessage,
    TranscriptMessage,
} from '@/types/voltar-ai';

// ── API calls commented out ──────────────────────────────────────────────────
// const WS_URL = 'wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary';
const SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;
const CHUNK_SIZE = 4096;

export interface VoiceAgentCallbacks {
    onStateChange?: (state: VoiceState) => void;
    onTranscript?: (message: TranscriptMessage) => void;
    onSessionStarted?: (sessionId: string) => void;
    onConnectionOpen?: () => void;
    onConnectionClose?: () => void;
    onError?: (error: string) => void;
}

export class VoiceAgentService {
    private ws: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private scriptProcessor: ScriptProcessorNode | null = null;
    private sessionId: string | null = null;
    private callbacks: VoiceAgentCallbacks;
    private muted = false;
    private connected = false;

    // ── Gapless audio scheduling ────────────────────────────────────────────
    private nextPlayTime = 0;
    private audioSequenceExpected = 0;
    private pendingChunks = new Map<number, Float32Array>();

    constructor(callbacks: VoiceAgentCallbacks = {}) {
        this.callbacks = callbacks;
    }

    // ── Lifecycle ────────────────────────────────────────────────────────────

    async startSession(_userId?: string): Promise<void> {
        // ── API call commented out ──────────────────────────────────────────
        // this.mediaStream = await navigator.mediaDevices.getUserMedia({
        //     audio: {
        //         sampleRate: INPUT_SAMPLE_RATE,
        //         channelCount: 1,
        //         echoCancellation: true,
        //         noiseSuppression: true,
        //         autoGainControl: true,
        //     },
        // });
        // this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
        // if (this.audioContext.state === 'suspended') {
        //     await this.audioContext.resume();
        // }
        // this.nextPlayTime = 0;
        // await this.connectWebSocket(userId);
        // this.startAudioCapture();

        console.log('[VoiceAgent] startSession: API calls are commented out (no-op)');
        this.connected = true;
        this.callbacks.onConnectionOpen?.();
        this.callbacks.onSessionStarted?.('mock-session-id');
    }

    private connectWebSocket(_userId?: string): Promise<void> {
        // ── WebSocket API call commented out ───────────────────────────────
        // return new Promise((resolve, reject) => {
        //     this.ws = new WebSocket(WS_URL);
        //     this.ws.binaryType = 'arraybuffer';
        //     this.ws.onopen = () => {
        //         this.connected = true;
        //         this.callbacks.onConnectionOpen?.();
        //         this.ws!.send(JSON.stringify({ type: 'start_session', userId: _userId ?? undefined }));
        //         resolve();
        //     };
        //     this.ws.onmessage = (event) => this.handleMessage(event);
        //     this.ws.onerror = () => {
        //         this.callbacks.onError?.('WebSocket connection error');
        //         reject(new Error('WebSocket connection error'));
        //     };
        //     this.ws.onclose = () => {
        //         this.connected = false;
        //         this.callbacks.onConnectionClose?.();
        //     };
        // });
        return Promise.resolve();
    }

    // ── Incoming message routing ─────────────────────────────────────────────

    private handleMessage(_event: MessageEvent): void {
        // ── API message handling commented out ─────────────────────────────
        // if (event.data instanceof ArrayBuffer) {
        //     const pcm = new Int16Array(event.data);
        //     this.receiveAgentAudio(pcm, this.audioSequenceExpected);
        //     return;
        // }
        // try {
        //     const dataStr = event.data as string;
        //     const msg: VoiceServerMessage = JSON.parse(dataStr);
        //     switch (msg.type) {
        //         case 'session_started':
        //             this.sessionId = msg.sessionId;
        //             this.callbacks.onSessionStarted?.(msg.sessionId);
        //             break;
        //         case 'state_change':
        //         case 'state' as any:
        //             this.callbacks.onStateChange?.((msg as any).state as VoiceState);
        //             break;
        //         case 'transcript_update':
        //         case 'transcript' as any: { ... }
        //         case 'agent_audio_chunk':
        //         case 'audio' as any: { ... }
        //         case 'interrupt':
        //             this.clearScheduledAudio();
        //             this.callbacks.onStateChange?.('waiting');
        //             break;
        //         case 'error' as any:
        //             this.callbacks.onError?.((msg as any).message);
        //             break;
        //     }
        // } catch (err) {
        //     console.warn('[VoiceAgent] Failed to parse server message:', err);
        // }
    }

    // ── Microphone → WebSocket ───────────────────────────────────────────────

    private startAudioCapture(): void {
        // ── Audio capture / WebSocket send commented out ───────────────────
        // if (!this.audioContext || !this.mediaStream) return;
        // const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        // this.scriptProcessor = this.audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);
        // this.scriptProcessor.onaudioprocess = (e) => {
        //     if (this.muted) return;
        //     if (this.ws?.readyState !== WebSocket.OPEN) return;
        //     const float32 = e.inputBuffer.getChannelData(0);
        //     this.ws.send(this.float32ToInt16(float32).buffer);
        // };
        // const gain = this.audioContext.createGain();
        // gain.gain.value = 0;
        // this.scriptProcessor.connect(gain);
        // gain.connect(this.audioContext.destination);
        // source.connect(this.scriptProcessor);
        void CHUNK_SIZE; // silence unused-var warning while code is commented out
        void INPUT_SAMPLE_RATE;
    }

    private float32ToInt16(float32: Float32Array<ArrayBuffer>): Int16Array {
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return int16;
    }

    // ── Gapless audio playback ────────────────────────────────────────────────

    private receiveAgentAudio(pcm: Int16Array, sequence: number): void {
        // ── Audio playback commented out ───────────────────────────────────
        // const float32 = this.int16ToFloat32(pcm);
        // this.pendingChunks.set(sequence, float32);
        // if (this.nextPlayTime === 0 && this.audioSequenceExpected === 0) {
        //     this.audioSequenceExpected = sequence;
        // }
        // while (this.pendingChunks.has(this.audioSequenceExpected)) {
        //     const chunk = this.pendingChunks.get(this.audioSequenceExpected)!;
        //     this.pendingChunks.delete(this.audioSequenceExpected);
        //     this.audioSequenceExpected++;
        //     this.scheduleAudioChunk(chunk);
        // }
        // if (this.pendingChunks.size > 10) { ... }
        void pcm;
        void sequence;
    }

    private scheduleAudioChunk(_float32: Float32Array): void {
        // ── AudioContext scheduling commented out ──────────────────────────
        // if (!this.audioContext) return;
        // if (this.audioContext.state === 'suspended') this.audioContext.resume();
        // const buffer = this.audioContext.createBuffer(1, float32.length, SAMPLE_RATE);
        // buffer.copyToChannel(float32, 0);
        // const source = this.audioContext.createBufferSource();
        // source.buffer = buffer;
        // source.connect(this.audioContext.destination);
        // const now = this.audioContext.currentTime;
        // const start = Math.max(this.nextPlayTime, now);
        // source.start(start);
        // this.nextPlayTime = start + buffer.duration;
        void SAMPLE_RATE;
    }

    private clearScheduledAudio(): void {
        this.nextPlayTime = 0;
        this.pendingChunks.clear();
        this.audioSequenceExpected = 0;
    }

    private int16ToFloat32(int16: Int16Array): Float32Array {
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
        }
        return float32;
    }

    // ── Public controls ──────────────────────────────────────────────────────

    interrupt(): void {
        // ── WebSocket interrupt call commented out ─────────────────────────
        // if (this.ws?.readyState === WebSocket.OPEN) {
        //     this.ws.send(JSON.stringify({ type: 'interrupt' }));
        // }
        this.clearScheduledAudio();
    }

    toggleMute(): boolean {
        this.muted = !this.muted;
        return this.muted;
    }

    get isMuted(): boolean {
        return this.muted;
    }

    async endSession(): Promise<void> {
        // ── WebSocket end_session + resource teardown commented out ────────
        // if (this.ws?.readyState === WebSocket.OPEN) {
        //     this.ws.send(JSON.stringify({ type: 'end_session' }));
        // }
        // this.ws?.close();
        // this.ws = null;
        // this.scriptProcessor?.disconnect();
        // this.scriptProcessor = null;
        // this.mediaStream?.getTracks().forEach((t) => t.stop());
        // this.mediaStream = null;
        // if (this.audioContext) {
        //     await this.audioContext.close();
        //     this.audioContext = null;
        // }

        this.clearScheduledAudio();
        this.sessionId = null;
        this.connected = false;
    }

    getSessionId(): string | null {
        return this.sessionId;
    }

    isActive(): boolean {
        return this.connected && this.ws?.readyState === WebSocket.OPEN;
    }
}

// ── Silence unused-import warnings for commented-out type references ─────────
void (null as unknown as VoiceServerMessage);
