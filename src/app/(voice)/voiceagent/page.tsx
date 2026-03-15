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

    // ─── Voice call ──────────────────────────────────────────────────────────

    const handleCallClick = useCallback(async () => {
        setMicError(null);
        setTranscript([]);
        setVoiceState('waiting');
        setIsRecording(true);
        setViewMode('listening');

        try {
            const svc = new VoiceAgentService({
                onSessionStarted: (id) => {
                    console.log('[Voice] Session started:', id);
                },
                onStateChange: (state) => {
                    setVoiceState(state);
                },
                onTranscript: (msg) => {
                    setTranscript((prev) => {
                        // Replace the last pending entry for the same role if not yet final
                        const last = prev[prev.length - 1];
                        if (!msg.isFinal && last && last.role === msg.role && !last.isFinal) {
                            return [...prev.slice(0, -1), msg];
                        }
                        return [...prev, msg];
                    });
                },
                onError: (err) => {
                    setMicError(err);
                    setIsRecording(false);
                    setViewMode('welcome');
                },
                onConnectionClose: () => {
                    setIsRecording(false);
                    setVoiceState('waiting');
                },
            });

            voiceServiceRef.current = svc;
            await svc.startSession();
        } catch (err) {
            const msg =
                err instanceof Error && err.message.toLowerCase().includes('permission')
                    ? 'Microphone access denied. Please allow microphone access and try again.'
                    : 'Failed to start voice session. Please try again.';
            setMicError(msg);
            setIsRecording(false);
            setViewMode('welcome');
        }
    }, []);

    const handleMicClick = useCallback(() => {
        const svc = voiceServiceRef.current;
        if (!svc) return;
        const nowMuted = svc.toggleMute();
        setIsMuted(nowMuted);
    }, []);

    const handleInterrupt = useCallback(() => {
        voiceServiceRef.current?.interrupt();
    }, []);

    const handleCloseCall = useCallback(async () => {
        const svc = voiceServiceRef.current;
        if (svc) {
            await svc.endSession();
            voiceServiceRef.current = null;
        }

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

    // ─── Text chat ───────────────────────────────────────────────────────────

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

            try {
                const svc = await getChatService();

                // Streaming response
                let fullResponse = '';
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        type: 'assistant',
                        content: '',
                        isThinking: false,
                        source: 'chat',
                    };
                    return next;
                });

                for await (const chunk of svc.sendMessageStream(message)) {
                    fullResponse += chunk;
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            ...next[next.length - 1],
                            content: fullResponse,
                        };
                        return next;
                    });
                }
            } catch (err) {
                console.error('[Chat] Error:', err);
                const isApiDown =
                    err instanceof Error &&
                    (err.message.includes('500') || err.message.includes('fetch'));
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        type: 'assistant',
                        content: isApiDown
                            ? 'The chat service is temporarily unavailable. You can still use the voice call feature above!'
                            : 'Sorry, something went wrong. Please try again.',
                        isThinking: false,
                        source: 'chat',
                    };
                    return next;
                });
            }
        },
        [getChatService]
    );

    return (
        <div className="min-h-screen bg-white md:bg-black flex items-center justify-center md:p-4">
            {/* VOLTAR AI Logo - only show on desktop */}
            <div className="hidden md:flex fixed top-8 left-8 items-center gap-2 z-50">
                <Image src={'assets/logo/logodesktop.svg'} width={100} height={100} className='' alt='logo' />
            </div>

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
                className="w-full max-w-2xl h-[100dvh] md:h-[600px] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden relative"
            >
                {/* Decorative corner elements - only on desktop */}
                <div className="hidden md:block absolute top-12 left-12 w-20 h-20 border-l-2 border-t-2 border-indigo-200 opacity-30 rounded-tl-3xl" />
                <div className="hidden md:block absolute top-12 right-12 w-20 h-20 border-r-2 border-t-2 border-indigo-200 opacity-30 rounded-tr-3xl" />
                <div className="hidden md:block absolute bottom-12 left-12 w-20 h-20 border-l-2 border-b-2 border-indigo-200 opacity-30 rounded-bl-3xl" />
                <div className="hidden md:block absolute bottom-12 right-12 w-20 h-20 border-r-2 border-b-2 border-indigo-200 opacity-30 rounded-br-3xl" />

                {/* Content */}
                <div className="relative h-full z-10">
                    <AnimatePresence mode="wait">
                        {viewMode === 'welcome' && (
                            <WelcomeScreen
                                key="welcome"
                                onSend={handleSendMessage}
                                onCallClick={handleCallClick}
                            />
                        )}

                        {viewMode === 'listening' && (
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

                        {viewMode === 'chat' && (
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
    );
}
