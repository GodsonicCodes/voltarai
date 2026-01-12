# 📌 API Quick Reference - Voltar AI

**Base URL:** `https://voltarai-vagent-2.onrender.com`

---

## 🏥 Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-29T10:30:00",
  "service": "Voltar AI Voice Agent"
}
```

---

## 💬 Chat AI Endpoints

### Start Chat Session
```http
POST /api/chat/sessions/start
Content-Type: application/json

{
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "created_at": "2025-12-29T10:30:00"
}
```

---

### Send Message (Regular)
```http
POST /api/chat/message
Content-Type: application/json

{
  "session_id": "your-session-id",
  "message": "What services do you offer?"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "message": "What services do you offer?",
  "response": "Voltar AI offers...",
  "user_info": {
    "name": null,
    "email": null,
    "phone": null,
    "service_interest": null
  },
  "timestamp": "2025-12-29T10:30:01"
}
```

---

### Send Message (Streaming)
```http
POST /api/chat/message/stream
Content-Type: application/json

{
  "session_id": "your-session-id",
  "message": "Tell me about AI automation"
}
```

**Response:** Streamed text chunks

---

### Get Chat Session Info
```http
GET /api/chat/sessions/{session_id}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "user_id": "user-123",
  "status": "active",
  "message_count": 10,
  "user_info": {},
  "created_at": "2025-12-29T10:30:00",
  "duration": 300
}
```

---

### Get Chat History
```http
GET /api/chat/sessions/{session_id}/history
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": 1703001234
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "timestamp": 1703001235
    }
  ],
  "user_info": {}
}
```

---

### End Chat Session
```http
POST /api/chat/sessions/{session_id}/end
```

**Response:**
```json
{
  "status": "ended",
  "session_id": "uuid-string"
}
```

---

## 🎤 Voice Agent WebSocket

### Connection URL
```
wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary
```

### Protocol: Binary + JSON

---

### Client → Server Messages

#### Start Session (JSON)
```json
{
  "type": "start_session",
  "userId": "optional-user-id"
}
```

#### Audio Data (Binary)
- Send raw PCM audio
- Format: **16-bit PCM, 16kHz, Mono**
- Chunk size: 4096 samples

#### Interrupt (JSON)
```json
{
  "type": "interrupt"
}
```

#### End Session (JSON)
```json
{
  "type": "end_session"
}
```

---

### Server → Client Messages

#### Session Started (JSON)
```json
{
  "type": "session_started",
  "sessionId": "uuid-string",
  "websocketUrl": "ws://..."
}
```

#### State Change (JSON)
```json
{
  "type": "state_change",
  "state": "waiting" | "listening" | "transcribing" | "thinking" | "speaking"
}
```

**States:**
- `waiting` - Ready for user input
- `listening` - Receiving user audio
- `transcribing` - Converting speech to text
- `thinking` - AI processing
- `speaking` - AI responding

#### Transcript Update (JSON)
```json
{
  "type": "transcript_update",
  "message": {
    "role": "user" | "agent",
    "text": "Transcribed text",
    "timestamp": 1703001234567,
    "isFinal": true
  }
}
```

#### Agent Audio Chunk (JSON)
```json
{
  "type": "agent_audio_chunk",
  "data": [1, 2, 3, ...],
  "sequence": 0
}
```

#### Interrupt (JSON)
```json
{
  "type": "interrupt"
}
```

---

## 🎯 Voice Session REST APIs

### Start Voice Session
```http
POST /api/sessions/start
Content-Type: application/json

{
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "websocket_url": "ws://localhost:10000/ws/voice-session-binary",
  "created_at": "2025-12-29T10:30:00"
}
```

---

### Get Voice Session Info
```http
GET /api/sessions/{session_id}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "user_id": "user-123",
  "status": "active",
  "created_at": "2025-12-29T10:30:00",
  "duration": 120,
  "message_count": 6
}
```

---

### Get Voice Transcript
```http
GET /api/sessions/{session_id}/transcript
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "messages": [
    {
      "role": "agent",
      "text": "Hey! Thanks for calling Voltar AI...",
      "timestamp": 1703001234,
      "is_final": true
    },
    {
      "role": "user",
      "text": "I need help with automation",
      "timestamp": 1703001240,
      "is_final": true
    }
  ],
  "lead_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0241234567",
    "service_interest": "AI automation"
  }
}
```

---

### End Voice Session
```http
POST /api/sessions/{session_id}/end
```

**Response:**
```json
{
  "status": "ended",
  "session_id": "uuid-string"
}
```

---

## 🔧 Common Headers

```http
Content-Type: application/json
Accept: application/json
```

---

## ⚡ Quick Copy-Paste

### TypeScript Fetch (Chat)
```typescript
// Start chat session
const response = await fetch('https://voltarai-vagent-2.onrender.com/api/chat/sessions/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 'user-123' })
});
const { session_id } = await response.json();

// Send message
const msgResponse = await fetch('https://voltarai-vagent-2.onrender.com/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: session_id,
    message: 'Hello'
  })
});
const data = await msgResponse.json();
console.log(data.response);
```

### JavaScript WebSocket (Voice)
```javascript
// Connect to voice agent
const ws = new WebSocket('wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary');

ws.onopen = () => {
  // Start session
  ws.send(JSON.stringify({
    type: 'start_session',
    userId: 'user-123'
  }));
};

ws.onmessage = (event) => {
  if (typeof event.data === 'string') {
    const message = JSON.parse(event.data);
    console.log('Server message:', message);
  } else {
    // Binary audio data
    console.log('Received audio chunk');
  }
};
```

### cURL (Testing)
```bash
# Health check
curl https://voltarai-vagent-2.onrender.com/api/health

# Start chat session
curl -X POST https://voltarai-vagent-2.onrender.com/api/chat/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user"}'

# Send message
curl -X POST https://voltarai-vagent-2.onrender.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id":"YOUR_SESSION_ID",
    "message":"What services do you offer?"
  }'
```

---

## 📊 Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 404 | Not Found | Session not found |
| 422 | Validation Error | Invalid request body |
| 500 | Server Error | Internal server error |

---

## 🔒 CORS

All origins are allowed. No special headers needed.

---

## 📱 Important Notes

1. **WebSocket URL:**
   - Production: `wss://` (secure WebSocket)
   - Local: `ws://` (unsecure)

2. **Audio Format:**
   - Sample Rate: 16kHz
   - Bit Depth: 16-bit
   - Channels: Mono (1 channel)
   - Encoding: PCM

3. **Session Expiry:**
   - Sessions expire after 24 hours of inactivity
   - Always call `/end` to clean up

4. **Microphone Permission:**
   - Required for voice agent
   - Must be HTTPS/WSS in production

---

## 🎨 Example Responses

### Successful Chat Message
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "What services do you offer?",
  "response": "Hey! Great question. Voltar AI specializes in custom AI automation systems. We help businesses with lead generation automation, customer support AI, workflow optimization, voice AI agents, and chatbots. What specific challenge are you looking to solve?",
  "user_info": {
    "name": null,
    "email": null,
    "phone": null,
    "service_interest": null
  },
  "timestamp": "2025-12-29T10:30:15.123456"
}
```

### Voice Transcript Update
```json
{
  "type": "transcript_update",
  "message": {
    "role": "agent",
    "text": "Hey! Thanks for calling Voltar AI. I'm your AI sales assistant. What brings you here today?",
    "timestamp": 1703001234567,
    "isFinal": true
  }
}
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Session not found | Session expired or invalid ID - create new session |
| WebSocket connection failed | Check URL (wss:// for production, ws:// for local) |
| Microphone permission denied | Request permission again or check browser settings |
| CORS error | Should not happen - contact backend if it does |
| Timeout | Increase request timeout or retry |

---

## 📖 Full Documentation

See **FRONTEND_INTEGRATION_GUIDE.md** for:
- Complete TypeScript types
- Service class implementations
- React/Vue component examples
- Error handling
- Best practices
- Testing guide

---

**Updated:** 2025-12-29
**API Version:** 1.0.0
