// Types for our fetch API responses
interface ApiResponse<T> extends Response {
  jsonBody?: T;
}

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const apiResponse = response as ApiResponse<T>;
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(errorData)}`
    );
  }

  if (response.status !== 204) { // No Content
    apiResponse.jsonBody = await response.json();
  }
  
  return apiResponse;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp?: number;
  isFinal?: boolean;
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  service_interest?: string;
  company?: string;
}

export interface ChatSession {
  sessionId: string;
  userId?: string;
  status: 'active' | 'ended';
  createdAt: string;
  messageCount: number;
  userInfo?: UserInfo;
}

export class ChatAIService {
  private baseURL: string;
  private sessionId: string | null = null;
  private defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  private abortController: AbortController | null = null;

  constructor(baseURL: string = 'https://voltarai-vagent-2.onrender.com') {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAbort: boolean = false
  ): Promise<ApiResponse<T>> {
    // Only abort if not skipping and there's an existing controller
    if (!skipAbort && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    // Create new abort controller if not skipping
    if (!skipAbort) {
      this.abortController = new AbortController();
    }
    
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log('Request:', options.method || 'GET', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(options.headers || {}),
        },
        signal: this.abortController?.signal,
      });
      
      return await handleResponse<T>(response);
    } catch (error: unknown) {
      // Don't log aborted requests as errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Fetch Error:', error);
      }
      throw error;
    } finally {
      // Clean up the abort controller after request completes
      if (this.abortController) {
        this.abortController = null;
      }
    }
  }

  /**
   * Start a new chat session
   */
  async startSession(userId?: string): Promise<ChatSession> {
    try {
      // Skip abort for initial session start to prevent race conditions
      const response = await this.fetch<{ session_id: string; created_at: string }>(
        '/api/chat/sessions/start',
        {
          method: 'POST',
          body: JSON.stringify({ 
            user_id: userId
          }),
        },
        true // Skip abort for initial request
      );
      
      if (!response.jsonBody) {
        throw new Error('No data received from server');
      }
      
      this.sessionId = response.jsonBody.session_id;
      
      return {
        sessionId: response.jsonBody.session_id,
        status: 'active',
        createdAt: response.jsonBody.created_at,
        messageCount: 0,
        userId,
      };
    } catch (error) {
      console.error('Failed to start chat session:', error);
      throw error;
    }
  }

  /**
   * Send a message to the chat
   */
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<{
    response: string;
    sessionId: string;
    userInfo: UserInfo;
  }> {
    const targetSessionId = sessionId || this.sessionId;
    
    if (!targetSessionId) {
      throw new Error('No active chat session. Please start a session first.');
    }

    try {
      const response = await this.fetch<{
        session_id: string;
        message: string;
        response: string;
        user_info: UserInfo;
        timestamp: string;
      }>('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          session_id: targetSessionId,
          message,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.jsonBody) {
        throw new Error('No data received from server');
      }

      return {
        response: response.jsonBody.response,
        sessionId: response.jsonBody.session_id,
        userInfo: response.jsonBody.user_info,
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
    const targetSessionId = sessionId || this.sessionId;
    
    if (!targetSessionId) {
      console.warn('No active chat session. Starting a new one...');
      await this.startSession();
      return [];
    }

    try {
      const response = await this.fetch<{
        session_id: string;
        messages: Array<{
          role: 'user' | 'assistant' | 'agent';
          content: string;
          timestamp?: number;
        }>;
        user_info: UserInfo;
      }>(`/api/chat/sessions/${targetSessionId}/history`, {
        method: 'GET',
        // Skip abort for history fetch to prevent race conditions
      }, true);

      if (!response.jsonBody) {
        return [];
      }

      return response.jsonBody.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || Date.now(),
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return [];
    }
  }

  /**
   * End the current chat session
   */
  async endSession(sessionId?: string): Promise<boolean> {
    const targetSessionId = sessionId || this.sessionId;
    
    if (!targetSessionId) {
      console.warn('No active session to end');
      return false;
    }

    try {
      // Skip abort for session end to ensure it completes
      await this.fetch<void>(`/api/chat/sessions/${targetSessionId}/end`, {
        method: 'POST',
      }, true);
      
      if (this.sessionId === targetSessionId) {
        this.sessionId = null;
      }
      return true;
    } catch (error) {
      console.error('Failed to end chat session:', error);
      return false;
    }
  }

  /**
   * Get the current session ID
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }
  
  /**
   * Set the current session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }
  
  /**
   * Send a message and stream the response
   * Returns an async generator that yields response chunks
   */
  async *sendMessageStream(
    message: string,
    sessionId?: string
  ): AsyncGenerator<string, void, unknown> {
    const targetSessionId = sessionId || this.sessionId;
    
    if (!targetSessionId) {
      throw new Error('No active chat session. Please start a session first.');
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/chat/message/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: targetSessionId,
            message,
            timestamp: new Date().toISOString()
          }),
        }
      );

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
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
}

// Create a singleton instance
export const chatAIService = new ChatAIService(
  process.env.NEXT_PUBLIC_API_URL || 'https://voltarai-vagent-2.onrender.com'
);