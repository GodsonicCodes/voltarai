const axios = require('axios');
const WebSocket = require('ws');

const API_BASE_URL = "https://voltarai-vagent-2.onrender.com";
const WS_URL = "wss://voltarai-vagent-2.onrender.com/ws/voice-session-binary";

/**
 * --- REST API (CHAT) ---
 */
async function testChatApi() {
  console.log('--- Testing Chat API ---');
  try {
    // 1. Health Check
    console.log('1. Checking health...');
    const health = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('Health:', health.data);

    // 2. Start Session
    console.log('\n2. Starting chat session...');
    const startRes = await axios.post(`${API_BASE_URL}/api/chat/sessions/start`, {
      user_id: "test-user-standalone"
    });
    const sessionId = startRes.data.session_id;
    console.log('Session ID:', sessionId);

    // 3. Send Message
    console.log('\n3. Sending message...');
    const msgRes = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      session_id: sessionId,
      message: "Hello, what services do you offer?"
    });
    console.log('AI Response:', msgRes.data.response);

    // 4. Get History
    console.log('\n4. Fetching history...');
    const historyRes = await axios.get(`${API_BASE_URL}/api/chat/sessions/${sessionId}/history`);
    console.log(`History count: ${historyRes.data.messages.length}`);

    // 5. End Session
    console.log('\n5. Ending session...');
    await axios.post(`${API_BASE_URL}/api/chat/sessions/${sessionId}/end`);
    console.log('Session ended successfully.');

  } catch (error) {
    console.error('Chat API Error:', error.response ? error.response.data : error.message);
  }
}

/**
 * --- WEBSOCKET (VOICE) ---
 */
function testVoiceWebSocket() {
  console.log('\n--- Testing Voice WebSocket ---');
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log('WebSocket connected to', WS_URL);

    // 1. Start session
    console.log('Sending start_session...');
    ws.send(JSON.stringify({
      type: 'start_session',
      userId: 'test-user-ws'
    }));
  });

  ws.on('message', (data) => {
    try {
      // Data can be binary (audio) or string (JSON)
      if (typeof data === 'string' || data instanceof Buffer) {
        const message = JSON.parse(data.toString());
        console.log('Server message:', message.type);

        if (message.type === 'session_started') {
          console.log('Session ID:', message.sessionId);
          
          // Simulate some dummy binary audio (PCM 16-bit)
          // In a real scenario, this would be 16kHz mono PCM
          const dummyAudio = Buffer.alloc(4096); 
          ws.send(dummyAudio);
          console.log('Sent dummy audio chunk.');

          // Wait 2 seconds and end
          setTimeout(() => {
            console.log('Ending Voice session...');
            ws.send(JSON.stringify({ type: 'end_session' }));
            ws.close();
          }, 2000);
        }
      }
    } catch (e) {
      // If not JSON, likely binary audio chunk from server
      console.log('Received binary audio chunk (size:', data.length, ')');
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket Error:', err.message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
}

// Run tests
(async () => {
  await testChatApi();
  testVoiceWebSocket();
})();
