'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import WelcomeScreen from '@/components/voiceagent/WelcomeScreen';
import ListeningScreen from '@/components/voiceagent/ListeningScreen';
import ChatScreen from '@/components/voiceagent/ChatScreen';
import { VoiceAgentService } from '@/services/voice-agent.service';
import { ChatAIService } from '@/services/chat-ai.service';
import type { VoiceState, TranscriptMessage, UIMessage } from '@/types/voltar-ai';

type ViewMode = 'welcome' | 'listening' | 'chat';

export default function VoiceAgentPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('welcome');
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceState, setVoiceState] = useState<VoiceState>('waiting');
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [micError, setMicError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    const voiceServiceRef = useRef<VoiceAgentService | null>(null);
    const chatServiceRef = useRef<ChatAIService | null>(null);

    // Ensure chat service is initialised
    const getChatService = useCallback(async (): Promise<ChatAIService> => {
        if (!chatServiceRef.current) {
            chatServiceRef.current = new ChatAIService();
        }
        if (!chatServiceRef.current.hasActiveSession()) {
            await chatServiceRef.current.startSession();
        }
        return chatServiceRef.current;
    }, []);

    // Clean up on page leave
    useEffect(() => {
        return () => {
            voiceServiceRef.current?.endSession();
            chatServiceRef.current?.endSession();
        };
    }, []);

    // demo call 
    const handleCallClick = useCallback(async () => {
        setMicError(null);
        setTranscript([]);
        setVoiceState('waiting');
        setIsRecording(true);
        setViewMode('listening');

        // MOCK: Simulate connection delay
        setTimeout(() => {
            setVoiceState('listening');
            
            // MOCK: Simulate user speaking
            setTimeout(() => {
                setVoiceState('transcribing');
                setTranscript(prev => [
                    ...prev, 
                    { role: 'user', text: 'Hello, I\'m Doe. Your voice agent. How may I help you? We offer a lot of services', isFinal: true, timestamp: Date.now() }
                ]);

                // MOCK: Simulate agent thinking
                setTimeout(() => {
                    setVoiceState('thinking');

                    // MOCK: Simulate agent speaking response
                    setTimeout(() => {
                        setVoiceState('speaking');
                        setTranscript(prev => [
                            ...prev, 
                            { role: 'agent', text: 'Hello, I\'m Doe. Your voice agent. How may I help you? We offer a lot of services', isFinal: true, timestamp: Date.now() }
                        ]);

                        // MOCK: Return to listening after response is done
                        setTimeout(() => {
                            setVoiceState('listening');
                        }, 4000);

                    }, 2000);
                }, 1500);
            }, 3000);
        }, 1000);
    }, []);

    const handleMicClick = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const handleInterrupt = useCallback(() => {
        setVoiceState('listening');
    }, []);

    const handleCloseCall = useCallback(async () => {
        setIsRecording(false);
        setVoiceState('waiting');
        setIsMuted(false);

        // Convert voice transcript to UIMessages and show chat screen
        if (transcript.length > 0) {
            const converted: UIMessage[] = transcript
                .filter((t) => t.isFinal && t.text?.trim())
                .map((t) => ({
                    type: t.role === 'user' ? 'user' : 'assistant',
                    content: t.text,
                    source: 'voice',
                }));
            setMessages(converted);
            setViewMode('chat');
            setTranscript([]); // Clear transcript after converting
        } else {
            setViewMode('welcome');
        }
    }, [transcript]);

    const handleBackFromListening = useCallback(async () => {
        await handleCloseCall();
    }, [handleCloseCall]);

    const handleBackFromChat = useCallback(() => {
        setViewMode('welcome');
    }, []);

    //  Text chat (MOCKED FOR UI TESTING) 

    const handleSendMessage = useCallback(
        async (message: string) => {
            const userMsg: UIMessage = { type: 'user', content: message, source: 'chat' };
            setMessages((prev) => [...prev, userMsg]);
            setViewMode('chat');

            // Thinking placeholder
            setMessages((prev) => [
                ...prev,
                { type: 'assistant', content: '', isThinking: true, source: 'chat' },
            ]);

            // MOCK: Simulate chat response
            setTimeout(() => {
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        type: 'assistant',
                        content: 'This is a mock response because the API calls are currently commented out for UI testing.',
                        isThinking: false,
                        source: 'chat',
                    };
                    return next;
                });
            }, 1500);
        },
        []
    );

    return (
      <div className="min-h-screen bg-black flex items-stretch relative overflow-hidden">
        {/* Background Glow Effects  */}
        {/* 
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[70%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" /> */}

        {/* Left dark sidebar   */}
        <div className="hidden md:flex md:flex-col md:justify-between shrink-0 md:px-8 py-12 relative">
          {/* Logo */}
          <div className="relative z-10">
            <Image
              src={"assets/logo/logodesktop.svg"}
              width={120}
              height={40}
              className="w-auto h-8"
              alt="Voltar AI logo"
            />
          </div>

          {/* lines */}
          <div className="w-full h-full ">
            {/* top */}
            <div className="">
              <Image
                src="/assets/voiceagent/Vector-top.png"
                width={100}
                height={100}
                alt="Picture of the author"
                className="absolute left-15 top-17 opacity-50"
              />
            </div>

            <div className="">
              <Image
                src="/assets/voiceagent/vectordown-left.png"
                width={300}
                height={300}
                alt="Picture of the author"
                className="absolute left-15 opacity-60  bottom-20"
              />
            </div>
          </div>
        </div>

        {/*Right area centres the card  */}
        <div className="flex-1 flex  items-center justify-center bg-transparent md:py-6 md:pr-6 relative z-10">
          {/* Mobile: full screen white bg */}
          <div className="md:hidden fixed inset-0 bg-white z-0" />

          {/* Microphone / connection error toast */}
          <AnimatePresence>
            {micError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow-lg max-w-sm text-center"
              >
                {micError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[900px] h-[100dvh] md:h-[560px] bg-[#F5F5F7] md:rounded md:shadow-[0_0_50px_-12px_rgba(59,0,230,0.25)] overflow-hidden relative z-10 border border-white/5"
          >
            {/* Decorative corner brackets
                    <div className="hidden md:block absolute top-5 left-5 w-16 h-16 border-l-2 border-t-2 border-blue-300/40 rounded-tl-2xl" />
                    <div className="hidden md:block absolute top-5 right-5 w-16 h-16 border-r-2 border-t-2 border-blue-300/40 rounded-tr-2xl" />
                    <div className="hidden md:block absolute bottom-5 left-5 w-16 h-16 border-l-2 border-b-2 border-blue-300/40 rounded-bl-2xl" />
                    <div className="hidden md:block absolute bottom-5 right-5 w-16 h-16 border-r-2 border-b-2 border-blue-300/40 rounded-br-2xl" /> */}

            {/* lines */}
            <Image
              src="/assets/voiceagent/Vector1.png"
              width={100}
              height={100}
              alt="Picture of the author"
              className="absolute opacity-60 left-30 top-0"
            />

            <Image
              src="/assets/voiceagent/Vector2.png"
              width={100}
              height={100}
              alt="Picture of the author"
              className="absolute opacity-60 right-30 top-0"
            />

            {/* Content */}
            <div className="relative h-full z-10">
              <AnimatePresence mode="wait">
                {viewMode === "welcome" && (
                  <WelcomeScreen
                    key="welcome"
                    onSend={handleSendMessage}
                    onCallClick={handleCallClick}
                  />
                )}

                {viewMode === "listening" && (
                  <ListeningScreen
                    key="listening"
                    isRecording={isRecording}
                    isMuted={isMuted}
                    voiceState={voiceState}
                    transcript={transcript}
                    onMicClick={handleMicClick}
                    onInterrupt={handleInterrupt}
                    onCloseClick={handleCloseCall}
                    onBackClick={handleBackFromListening}
                  />
                )}

                {viewMode === "chat" && (
                  <ChatScreen
                    key="chat"
                    messages={messages}
                    onSend={handleSendMessage}
                    onCallClick={handleCallClick}
                    onBackClick={handleBackFromChat}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    );
}
