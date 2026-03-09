'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/voiceagent/WelcomeScreen';
import ListeningScreen from '@/components/voiceagent/ListeningScreen';
import ChatScreen from '@/components/voiceagent/ChatScreen';
import Image from 'next/image';

type ViewMode = 'welcome' | 'listening' | 'chat';

interface Message {
    type: 'user' | 'assistant';
    content: string;
    isThinking?: boolean;
}

export default function VoiceAgentPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('welcome');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    // Handle sending a message from text input
    const handleSendMessage = (message: string) => {
        setMessages((prev) => [...prev, { type: 'user', content: message }]);
        setViewMode('chat');

        // Simulate assistant thinking
        setTimeout(() => {
            setMessages((prev) => [...prev, { type: 'assistant', content: '', isThinking: true }]);
        }, 500);

        // Simulate assistant response
        setTimeout(() => {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    type: 'assistant',
                    content: getDemoResponse(message),
                    isThinking: false,
                };
                return newMessages;
            });
        }, 2000);
    };

    // Handle initiating voice call
    const handleCallClick = () => {
        setIsRecording(true);
        setViewMode('listening');
    };

    // Handle microphone toggle
    const handleMicClick = () => {
        setIsRecording(!isRecording);

        if (!isRecording) {
            // Starting to record
            setViewMode('listening');
        }
    };

    // Handle close button (end call from controls)
    const handleCloseClick = () => {
        setIsRecording(false);
        if (messages.length > 0) {
            setViewMode('chat');
        } else {
            setViewMode('welcome');
        }
    };

    // Handle back button — go back to previous logical screen
    const handleBackFromListening = () => {
        setIsRecording(false);
        if (messages.length > 0) {
            setViewMode('chat');
        } else {
            setViewMode('welcome');
        }
    };

    const handleBackFromChat = () => {
        setViewMode('welcome');
    };

    // Demo response generator
    const getDemoResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('help')) {
            return "Hello, I'm here. Your voice agent. How may I help you? We offer a lot of services.";
        }
        if (lowerMessage.includes('what') || lowerMessage.includes('who')) {
            return "I am V³Agent, your AI Intelligent Assistant. I go beyond answering questions - I qualify leads, schedule demos, and deliver strategic automation advice tailored to your business.";
        }
        if (lowerMessage.includes('demo') || lowerMessage.includes('schedule')) {
            return "I'd be happy to help schedule a demo for you. Could you please provide your preferred date and time?";
        }

        return "Thank you for your message. I'm here to assist you with any questions about our services and help with scheduling demos.";
    };

    return (
        <div className="min-h-screen bg-white md:bg-black flex items-center justify-center md:p-4">
            {/* VOLTAR AI Logo - only show on desktop */}
            <div className="hidden md:flex fixed top-8 left-8 items-center gap-2 z-50">
                {/* <div className="w-8 h-8 bg-white flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-4.28-1.04-7-5.35-7-9.5V8.3l7-3.5 7 3.5V11c0 4.15-2.72 8.46-7 9.5z" />
                    </svg>
                </div>
                <span className="text-white font-semibold text-sm">VOLTAR AI</span> */}
                <Image src={'assets/logo/logodesktop.svg'} width={100} height={100} className='' alt='logo' />
            </div>

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
                                onMicClick={handleMicClick}
                                onCloseClick={handleCloseClick}
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
