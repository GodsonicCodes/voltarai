import type {
    VoiceState,
    VoiceServerMessage,
    TranscriptMessage,
} from '@/types/voltar-ai';

const WS_URL = 'wss://voltarai-vagent-2.onrender.com/ws/grok-voice-session';
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
    // Instead of chaining via onended, we schedule each chunk at an exact
    // AudioContext time so chunks play back-to-back with zero gap.
    private nextPlayTime = 0;               // absolute AudioContext time for next chunk start
    private audioSequenceExpected = 0;
    private pendingChunks = new Map<number, Float32Array>();

    constructor(callbacks: VoiceAgentCallbacks = {}) {
        this.callbacks = callbacks;
    }

    // ── Lifecycle ────────────────────────────────────────────────────────────

    async startSession(userId?: string): Promise<void> {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: INPUT_SAMPLE_RATE,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });

        this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        this.nextPlayTime = 0; // reset scheduling clock

        await this.connectWebSocket(userId);
        this.startAudioCapture();
    }

    private connectWebSocket(userId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(WS_URL);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onopen = () => {
                this.connected = true;
                this.callbacks.onConnectionOpen?.();
                this.ws!.send(
                    JSON.stringify({ type: 'start_session', userId: userId ?? undefined })
                );
                resolve();
            };

            this.ws.onmessage = (event) => this.handleMessage(event);

            this.ws.onerror = () => {
                this.callbacks.onError?.('WebSocket connection error');
                reject(new Error('WebSocket connection error'));
            };

            this.ws.onclose = () => {
                this.connected = false;
                this.callbacks.onConnectionClose?.();
            };
        });
    }

    // ── Incoming message routing ─────────────────────────────────────────────

    private handleMessage(event: MessageEvent): void {
        // Raw binary frame from server
        if (event.data instanceof ArrayBuffer) {
            const pcm = new Int16Array(event.data);
            this.receiveAgentAudio(pcm, this.audioSequenceExpected);
            return;
        }

        try {
            const dataStr = event.data as string;
            const msg: VoiceServerMessage = JSON.parse(dataStr);

            switch (msg.type) {
                case 'session_started':
                    console.log('[VoiceAgent] Session started:', msg.sessionId);
                    this.sessionId = msg.sessionId;
                    this.callbacks.onSessionStarted?.(msg.sessionId);
                    break;

                case 'state_change':
                case 'state' as any: {
                    const state = (msg as any).state as VoiceState;
                    console.log('[VoiceAgent] State change:', state);
                    this.callbacks.onStateChange?.(state);
                    break;
                }

                case 'transcript_update':
                case 'transcript' as any: {
                    let text: string;
                    let role: 'user' | 'agent';
                    let isFinal = true;

                    if (msg.type === 'transcript_update') {
                        text = msg.message.text;
                        role = msg.message.role;
                        isFinal = msg.message.isFinal;
                    } else {
                        text = (msg as any).text;
                        role = (msg as any).role;
                    }

                    console.log('[VoiceAgent] Transcript update:', { role, text, isFinal });

                    if (text) {
                        const filteredText = text.replace(/Learn English for free www\.engvid\.com/gi, '').trim();
                        if (filteredText) {
                            this.callbacks.onTranscript?.({
                                role,
                                text: filteredText,
                                isFinal,
                                timestamp: Date.now()
                            });
                        }
                    }
                    break;
                }

                case 'agent_audio_chunk':
                case 'audio' as any: {
                    const audioData = (msg as any).data;
                    if (Array.isArray(audioData)) {
                        const pcm = new Int16Array(audioData);
                        const sequence = (msg as any).sequence ?? this.audioSequenceExpected;
                        this.receiveAgentAudio(pcm, sequence);
                    } else {
                        console.warn('[VoiceAgent] Received audio chunk with non-array data');
                    }
                    break;
                }

                case 'interrupt':
                    console.log('[VoiceAgent] Interrupt received');
                    this.clearScheduledAudio();
                    this.callbacks.onStateChange?.('waiting');
                    break;

                case 'error' as any:
                    console.error('[VoiceAgent] Server error:', (msg as any).message);
                    this.callbacks.onError?.((msg as any).message);
                    break;
            }
        } catch (err) {
            console.warn('[VoiceAgent] Failed to parse server message:', err);
        }
    }

    // ── Microphone → WebSocket ───────────────────────────────────────────────

    private startAudioCapture(): void {
        if (!this.audioContext || !this.mediaStream) return;

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.scriptProcessor = this.audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);

        this.scriptProcessor.onaudioprocess = (e) => {
            if (this.muted) return;
            if (this.ws?.readyState !== WebSocket.OPEN) return;

            const float32 = e.inputBuffer.getChannelData(0);
            this.ws.send(this.float32ToInt16(float32).buffer);
        };

        source.connect(this.scriptProcessor);
        // Connect to destination with zero volume so the processor stays alive
        // without playing mic audio back to the user.
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        this.scriptProcessor.connect(gain);
        gain.connect(this.audioContext.destination);
    }

    private float32ToInt16(float32: Float32Array): Int16Array {
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return int16;
    }

    // ── Gapless WebSocket audio streaming ────────────────────────────────────
    //
    // The server sends PCM chunks tagged with a monotonically-increasing
    // `sequence` number. We buffer out-of-order chunks and play them in-order
    // by scheduling each BufferSource at a precise AudioContext timestamp:
    //
    //   nextPlayTime = Math.max(ctx.currentTime, nextPlayTime) + chunk.duration
    //
    // This ensures zero gap between consecutive chunks regardless of network
    // jitter, while still handling the first chunk arriving after silence
    // (where nextPlayTime may lag behind currentTime).

    private receiveAgentAudio(pcm: Int16Array, sequence: number): void {
        const float32 = this.int16ToFloat32(pcm);
        this.pendingChunks.set(sequence, float32);

        // If this is the first chunk ever, or if we've been waiting too long,
        // we might need to "jump" to this sequence.
        if (this.nextPlayTime === 0 && this.audioSequenceExpected === 0) {
            this.audioSequenceExpected = sequence;
        }

        // Drain in-order
        while (this.pendingChunks.has(this.audioSequenceExpected)) {
            const chunk = this.pendingChunks.get(this.audioSequenceExpected)!;
            this.pendingChunks.delete(this.audioSequenceExpected);
            this.audioSequenceExpected++;
            this.scheduleAudioChunk(chunk);
        }

        // If we have a lot of pending chunks that aren't being drained,
        // it means we lost a chunk in between. To avoid silence, skip ahead
        // if the buffer gets too large (e.g. > 10 chunks).
        if (this.pendingChunks.size > 10) {
            const keys = Array.from(this.pendingChunks.keys()).sort((a, b) => a - b);
            const smallest = keys[0];
            console.warn(`[VoiceAgent] Audio sequence gap detected. Skipping from ${this.audioSequenceExpected} to ${smallest}`);
            this.audioSequenceExpected = smallest;
            
            // Re-run drain
            while (this.pendingChunks.has(this.audioSequenceExpected)) {
                const chunk = this.pendingChunks.get(this.audioSequenceExpected)!;
                this.pendingChunks.delete(this.audioSequenceExpected);
                this.audioSequenceExpected++;
                this.scheduleAudioChunk(chunk);
            }
        }
    }

    private scheduleAudioChunk(float32: Float32Array): void {
        if (!this.audioContext) return;

        // Resume AudioContext if it was suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const buffer = this.audioContext.createBuffer(1, float32.length, SAMPLE_RATE);
        buffer.copyToChannel(float32, 0);

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);

        // Pin start to the later of: "right now" or "end of previous chunk"
        const now = this.audioContext.currentTime;
        const start = Math.max(this.nextPlayTime, now);
        source.start(start);

        // Advance the cursor by exactly this chunk's duration
        this.nextPlayTime = start + buffer.duration;
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
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'interrupt' }));
        }
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
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'end_session' }));
        }

        this.ws?.close();
        this.ws = null;

        this.scriptProcessor?.disconnect();
        this.scriptProcessor = null;

        this.mediaStream?.getTracks().forEach((t) => t.stop());
        this.mediaStream = null;

        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }

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
