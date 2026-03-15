// Route through the Next.js proxy to avoid CORS in development.
// In production, we hit the backend directly.
const isBrowser = typeof window !== 'undefined';
const BASE_URL = isBrowser
    ? '/api/proxy'
    : 'https://voltarai-vagent-2.onrender.com/api';

const CHAT_TIMEOUT_MS = 35_000;

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
        return await fetch(url, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

export class ChatAIService {
    private sessionId: string | null = null;

    async startSession(userId?: string): Promise<string> {
        const res = await fetchWithTimeout(
            `${BASE_URL}/chat/sessions/start`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId }),
            },
            CHAT_TIMEOUT_MS
        );

        if (!res.ok) throw new Error(`Failed to start chat session: ${res.status}`);

        const data = await res.json();
        this.sessionId = data.session_id;
        return this.sessionId!;
    }

    async sendMessage(message: string): Promise<string> {
        // Ensure we have an active session; restart if needed.
        if (!this.sessionId) {
            await this.startSession();
        }

        const attempt = async (): Promise<Response> =>
            fetchWithTimeout(
                `${BASE_URL}/chat/message`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: this.sessionId, message }),
                },
                CHAT_TIMEOUT_MS
            );

        let res = await attempt();

        // On 500 / expired session: reset and retry once with a fresh session
        if (res.status === 500 || res.status === 404) {
            await this.startSession();
            res = await attempt();
        }

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error('[ChatAI] sendMessage failed:', res.status, text);
            throw new Error(`Chat API error: ${res.status}`);
        }

        const data = await res.json();
        const response = data.response as string;
        return response.replace(/Learn English for free www\.engvid\.com/gi, '').trim();
    }

    async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
        if (!this.sessionId) await this.startSession();

        const res = await fetchWithTimeout(
            `${BASE_URL}/chat/message/stream`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: this.sessionId, message }),
            },
            CHAT_TIMEOUT_MS
        );

        if (!res.ok) {
            console.error('[ChatAI] stream failed:', res.status);
            throw new Error(`Stream failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
            console.error('[ChatAI] No reader available for stream');
            return;
        }

        const decoder = new TextDecoder();
        let accumulatedBuffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            accumulatedBuffer += chunk;

            // Simple chunk-level filter (might miss it if split, but keeps performance)
            const filteredChunk = chunk.replace(/Learn English for free www\.engvid\.com/gi, '');
            yield filteredChunk;
        }
    }

    async endSession(): Promise<void> {
        if (!this.sessionId) return;
        const sid = this.sessionId;
        this.sessionId = null;
        try {
            await fetch(`${BASE_URL}/chat/sessions/${sid}/end`, { method: 'POST' });
        } catch {
            // Best-effort cleanup
        }
    }

    hasActiveSession(): boolean {
        return this.sessionId !== null;
    }

    getSessionId(): string | null {
        return this.sessionId;
    }
}
