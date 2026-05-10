// ── API calls commented out ──────────────────────────────────────────────────
// Route through the Next.js proxy to avoid CORS in development.
// In production, we hit the backend directly.
// const isBrowser = typeof window !== 'undefined';
// const BASE_URL = isBrowser
//     ? '/api/proxy'
//     : 'https://voltarai-vagent-2.onrender.com/api';

const CHAT_TIMEOUT_MS = 35_000;

// ── Stub fetch helper (kept for shape; unused while API calls are off) ────────
async function fetchWithTimeout(_url: string, _init: RequestInit, _ms: number): Promise<Response> {
    // ── API call commented out ─────────────────────────────────────────────
    // const controller = new AbortController();
    // const timer = setTimeout(() => controller.abort(), _ms);
    // try {
    //     return await fetch(_url, { ..._init, signal: controller.signal });
    // } finally {
    //     clearTimeout(timer);
    // }
    throw new Error('[ChatAI] API calls are currently commented out.');
}

export class ChatAIService {
    private sessionId: string | null = null;

    async startSession(_userId?: string): Promise<string> {
        // ── API call commented out ─────────────────────────────────────────
        // const res = await fetchWithTimeout(
        //     `${BASE_URL}/chat/sessions/start`,
        //     {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ user_id: _userId }),
        //     },
        //     CHAT_TIMEOUT_MS
        // );
        // if (!res.ok) throw new Error(`Failed to start chat session: ${res.status}`);
        // const data = await res.json();
        // this.sessionId = data.session_id;
        // return this.sessionId!;

        console.log('[ChatAI] startSession: API call commented out (mock session)');
        this.sessionId = 'mock-chat-session-id';
        return this.sessionId;
    }

    async sendMessage(_message: string): Promise<string> {
        // ── API call commented out ─────────────────────────────────────────
        // if (!this.sessionId) await this.startSession();
        // const attempt = async (): Promise<Response> =>
        //     fetchWithTimeout(
        //         `${BASE_URL}/chat/message`,
        //         {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ session_id: this.sessionId, message: _message }),
        //         },
        //         CHAT_TIMEOUT_MS
        //     );
        // let res = await attempt();
        // if (res.status === 500 || res.status === 404) {
        //     await this.startSession();
        //     res = await attempt();
        // }
        // if (!res.ok) {
        //     const text = await res.text().catch(() => '');
        //     throw new Error(`Chat API error: ${res.status}`);
        // }
        // const data = await res.json();
        // return (data.response as string).replace(/Learn English for free www\.engvid\.com/gi, '').trim();

        console.log('[ChatAI] sendMessage: API call commented out (mock response)');
        return 'This is a mock response — the chat API is currently disabled.';
    }

    async *sendMessageStream(_message: string): AsyncGenerator<string, void, unknown> {
        // ── Streaming API call commented out ───────────────────────────────
        // if (!this.sessionId) await this.startSession();
        // const res = await fetchWithTimeout(
        //     `${BASE_URL}/chat/message/stream`,
        //     {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ session_id: this.sessionId, message: _message }),
        //     },
        //     CHAT_TIMEOUT_MS
        // );
        // if (!res.ok) throw new Error(`Stream failed: ${res.status}`);
        // const reader = res.body?.getReader();
        // if (!reader) return;
        // const decoder = new TextDecoder();
        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     const chunk = decoder.decode(value, { stream: true });
        //     yield chunk.replace(/Learn English for free www\.engvid\.com/gi, '');
        // }

        console.log('[ChatAI] sendMessageStream: API call commented out (mock stream)');
        yield 'This is a mock streamed response — the chat API is currently disabled.';
    }

    async endSession(): Promise<void> {
        if (!this.sessionId) return;
        // ── API call commented out ─────────────────────────────────────────
        // const sid = this.sessionId;
        // this.sessionId = null;
        // try {
        //     await fetch(`${BASE_URL}/chat/sessions/${sid}/end`, { method: 'POST' });
        // } catch {
        //     // Best-effort cleanup
        // }
        this.sessionId = null;
    }

    hasActiveSession(): boolean {
        return this.sessionId !== null;
    }

    getSessionId(): string | null {
        return this.sessionId;
    }
}

// ── Silence unused-variable warning while API calls are commented out ─────────
void CHAT_TIMEOUT_MS;
void fetchWithTimeout;
