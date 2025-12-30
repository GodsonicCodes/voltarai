# Voice Assistant API Endpoints

This document describes the API endpoints required for the voice assistant functionality.

## Base URL
```
https://volta-ai-backend.vercel.app/api
```

## Authentication
All endpoints should include appropriate authentication (API keys, JWT tokens, etc.)

## Endpoints

### 1. Speech-to-Text
**POST** `/voice/speech-to-text/`

Converts audio recording to text transcription.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `audio`: Audio file (webm, mp3, wav)
  - `language`: Language code (default: "en-US")

**Response:**
```json
{
  "success": true,
  "data": {
    "transcription": "Hello, how can I help you today?"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to transcribe audio"
}
```

### 2. Text-to-Speech
**POST** `/voice/text-to-speech/`

Converts text to audio speech.

**Request:**
```json
{
  "text": "Hello! I'm your AI assistant.",
  "voice": "en-US-AriaNeural",
  "language": "en-US"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audioUrl": "https://example.com/audio/response.mp3"
  }
}
```

### 3. AI Chat
**POST** `/voice/chat/`

Processes user message and returns AI response.

**Request:**
```json
{
  "message": "What's the weather like today?",
  "sessionId": "session_1234567890_abc123",
  "conversation": [
    {
      "text": "Hello",
      "timestamp": 1640995200000,
      "isUser": true
    },
    {
      "text": "Hi! How can I help you?",
      "timestamp": 1640995260000,
      "isUser": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I'd be happy to help you with the weather, but I don't have access to current weather data. You might want to check a weather app or website for the most accurate information.",
    "audioUrl": "https://example.com/audio/weather_response.mp3"
  }
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid authentication |
| 413 | Payload Too Large - Audio file too big |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting
- Speech-to-Text: 60 requests per minute
- Text-to-Speech: 100 requests per minute  
- AI Chat: 30 requests per minute

## File Specifications
- **Audio Formats**: WebM, MP3, WAV
- **Max File Size**: 25MB
- **Sample Rate**: 16kHz recommended
- **Channels**: Mono recommended

## Integration Notes

### Frontend Integration
The frontend service (`VoiceAssistantService`) handles:
1. Audio recording and processing
2. API communication
3. Conversation state management
4. Error handling and retries

### Session Management
- Each conversation gets a unique session ID
- Sessions are used to maintain conversation context
- Consider implementing session persistence for longer conversations

### Security Considerations
- Validate all input data
- Sanitize transcriptions before processing
- Implement rate limiting per user/session
- Use HTTPS for all communications

## Testing

### Sample Requests

**Speech-to-Text:**
```bash
curl -X POST \
  https://volta-ai-backend.vercel.app/api/voice/speech-to-text/ \
  -H 'Content-Type: multipart/form-data' \
  -F 'audio=@recording.webm' \
  -F 'language=en-US'
```

**AI Chat:**
```bash
curl -X POST \
  https://volta-ai-backend.vercel.app/api/voice/chat/ \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello AI",
    "sessionId": "test_session",
    "conversation": []
  }'
```

## Development Setup

1. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://volta-ai-backend.vercel.app/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues
1. **Microphone Access**: Ensure HTTPS is used for microphone permissions
2. **Audio Quality**: Check sample rate and format compatibility
3. **API Timeouts**: Implement proper timeout handling
4. **CORS Issues**: Ensure backend allows frontend origin

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('voice-assistant-debug', 'true');
```
