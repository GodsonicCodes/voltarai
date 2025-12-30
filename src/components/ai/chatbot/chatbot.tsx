'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '@/hooks/useClickOutside';

import { chatAIService, type ChatMessage as AIChatMessage } from '@/services/chat-ai.service';
import bgArt from '../../../../public/assets/ai/vector-mobile/Vector 2.png';
import Agent from './ui/agent';
import TextBox from './ui/text-box';
import TypingIndicator from './ui/typing-indicator';
import Chat from './ui/chat';
import Header from './ui/header';

interface ChatMessage {
  isAi: boolean;
  value: string;
  timestamp?: number;
}

const Chatbot = ({ onClose }: { onClose?: () => void }) => {
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [hasFirstMessage, setHasFirstMessage] = React.useState(false);
  const [isNearBottom, setIsNearBottom] = React.useState(true);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSessionOptions, setShowSessionOptions] = React.useState(false);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);

  // close when clicking outside container
  useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
    if (onClose) handleCloseChatbot();
  });

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior });
      }
    },
    []
  );

  React.useEffect(() => {
    if (isNearBottom) scrollToBottom();
  }, [messages, isNearBottom, scrollToBottom]);

  React.useEffect(() => {
    if (hasFirstMessage) scrollToBottom('auto');
  }, [hasFirstMessage, scrollToBottom]);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const isOverflow = scrollHeight > clientHeight;

      setIsNearBottom(distanceFromBottom <= 64);
      setHasOverflow(isOverflow);
    };

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [hasFirstMessage]);

  const handleStop = () => setIsTyping(false);

  // Initialize chat session on component mount
  React.useEffect(() => {
    const initializeChat = async () => {
      try {
        // Try to resume previous session from localStorage
        const storedSessionId = localStorage.getItem('chatbot-session-id');
        
        if (storedSessionId) {
          // Check if there are messages in the stored session
          try {
            const history = await chatAIService.getChatHistory(storedSessionId);
            console.log('Found previous session with history:', history.length, 'messages');
            if (history.length > 0) {
              // Show session options but don't load the session yet
              setShowSessionOptions(true);
              setHasFirstMessage(false); // Don't show messages until user chooses
            } else {
              // If no history, just set up the session normally
              chatAIService.setSessionId(storedSessionId);
              setMessages([]);
              setHasFirstMessage(false);
              setShowSessionOptions(false);
            }
          } catch (err) {
            console.error('Failed to check chat history:', err);
            // If history loading fails, just set up a new session
            await chatAIService.startSession();
            const currentSessionId = chatAIService.getCurrentSessionId();
            if (currentSessionId) {
              localStorage.setItem('chatbot-session-id', currentSessionId);
            }
            setShowSessionOptions(false);
          }
        } else {
          // Start a new session if no stored session exists
          await chatAIService.startSession();
          const currentSessionId = chatAIService.getCurrentSessionId();
          if (currentSessionId) {
            localStorage.setItem('chatbot-session-id', currentSessionId);
          }
          // Don't show session options for a completely new session
          setShowSessionOptions(false);
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        // If there's an error, start a new session
        try {
          await chatAIService.startSession();
          const currentSessionId = chatAIService.getCurrentSessionId();
          if (currentSessionId) {
            localStorage.setItem('chatbot-session-id', currentSessionId);
          }
        } catch (newSessionErr) {
          console.error('Failed to start new session:', newSessionErr);
          setError('Failed to initialize chat. Please try again later.');
        }
        // Don't show session options if there was an error
        setShowSessionOptions(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      // Don't end the session on unmount to preserve it for later use
      // Only clear the session if the user explicitly closes it
    };
  }, []);
  
  // Function to handle closing the chatbot
  const handleCloseChatbot = () => {
    // Don't end the session on close to preserve it for later use
    // Only end session when user explicitly wants to start fresh
    
    if (onClose) onClose();
  };
  
  // Function to continue previous session
  const continuePreviousSession = async () => {
    const storedSessionId = localStorage.getItem('chatbot-session-id');
    if (storedSessionId) {
      chatAIService.setSessionId(storedSessionId);
      try {
        const history = await chatAIService.getChatHistory(storedSessionId);
        if (history.length > 0) {
          const formattedMessages = history.map(msg => ({
            isAi: msg.role !== 'user',
            value: msg.content,
            timestamp: msg.timestamp,
          }));
          setMessages(formattedMessages);
          setHasFirstMessage(true);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // If history loading fails, start a new session
        await startNewConversation();
      }
    }
    setShowSessionOptions(false);
  };
  
  // Function to start a new conversation (clear session)
  const startNewConversation = async () => {
    localStorage.removeItem('chatbot-session-id');
    await chatAIService.endSession().catch(console.error);
    // Start a fresh session
    await chatAIService.startSession();
    const currentSessionId = chatAIService.getCurrentSessionId();
    if (currentSessionId) {
      localStorage.setItem('chatbot-session-id', currentSessionId);
    }
    setMessages([]);
    setHasFirstMessage(false);
    setShowSessionOptions(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return; // Don't send empty messages or if already typing
    
    // Ensure session is initialized before sending message
    if (!chatAIService.getCurrentSessionId()) {
      try {
        await chatAIService.startSession();
      } catch (err) {
        console.error('Failed to initialize chat session:', err);
        setError('Failed to initialize chat session. Please try again.');
        return;
      }
    }
    
    // Store session ID in localStorage if not already stored
    const currentSessionId = chatAIService.getCurrentSessionId();
    if (currentSessionId && !localStorage.getItem('chatbot-session-id')) {
      localStorage.setItem('chatbot-session-id', currentSessionId);
    }
    
    const userMessage: ChatMessage = {
      isAi: false,
      value: message,
      timestamp: Date.now(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setHasFirstMessage(true);
    setIsTyping(true);
    setError(null);

    try {
      // Create placeholder for streaming response
      const aiMessageIndex = messages.length;
      setMessages(prev => [...prev, {
        isAi: true,
        value: '',
        timestamp: Date.now(),
      }]);
      
      let fullResponse = '';
      
      // Stream the response
      for await (const chunk of chatAIService.sendMessageStream(message)) {
        fullResponse += chunk;
        
        // Update the AI message with accumulated response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[aiMessageIndex + 1] = {  // +1 because we added user message first
            isAi: true,
            value: fullResponse,
            timestamp: newMessages[aiMessageIndex + 1].timestamp,
          };
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      // Remove the user message if sending failed
      setMessages((prev) => prev.filter(m => m.timestamp !== userMessage.timestamp));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    message: string,
    stop: () => void
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isTyping) {
        stop();
        setIsTyping(false);
      } else if (message.trim()) {
        handleSendMessage(message);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/50 flex items-end md:items-center justify-center md:justify-end p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={parentRef}
          initial={{
            y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0,
            x: typeof window !== 'undefined' && window.innerWidth >= 768 ? '100%' : 0,
            opacity: 0,
          }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          exit={{
            y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0,
            x: typeof window !== 'undefined' && window.innerWidth >= 768 ? '100%' : 0,
            opacity: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 25,
            opacity: { duration: 0.3 },
          }}
          className="bg-white w-full h-screen md:h-screen md:max-h-screen md:rounded-none shadow-2xl flex flex-col overflow-hidden relative rounded-none"
        >
          {/* Top-right close */}
          <div className="absolute right-3 top-3 z-20">
            {onClose && (
              <button
                onClick={handleCloseChatbot}
                type="button"
                className="rounded-full p-2 bg-transparent text-gray-500 hover:bg-[#004AE9]/10 hover:text-[#004AE9] transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Main Chat Content */}
          <div className="bg-white h-full w-full flex flex-col justify-center md:justify-start">
            {/* Header */}
            <div className="shrink-0 pt-8">
              <div className="flex w-full px-6 justify-between items-center">
                <Image src={bgArt} alt="background art left" />
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    hasFirstMessage
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none absolute'
                  }`}
                >
                  <Header />
                </div>
                <Image src={bgArt} alt="background art right" className="scale-x-[-1]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-6 pt-2 pb-12 min-h-0">
              {showSessionOptions ? (
                // Show session options screen when showSessionOptions is true
                <div className="flex flex-col items-center justify-center flex-1 min-h-0">
                  <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-gray-600 text-center mb-8">You have a previous conversation. What would you like to do?</p>
                    <button
                      onClick={continuePreviousSession}
                      className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                    >
                      Continue Previous Session
                    </button>
                    <button
                      onClick={startNewConversation}
                      className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                    >
                      Start New Session
                    </button>
                  </div>
                </div>
              ) : (
                // Show normal chat interface when no session options
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden justify-center md:justify-start">
                  {/* Agent section collapsible */}
                  <div
                    className={`flex items-center justify-center shrink-0 overflow-hidden transition-all duration-500 ease-in-out ${
                      hasFirstMessage
                        ? 'max-h-0 opacity-0 py-0'
                        : 'max-h-[220px] md:max-h-[260px] py-6 md:py-8'
                    }`}
                  >
                    <Agent />
                  </div>

                  {/* Chat area */}
                  <div className="relative flex-1 overflow-hidden">
                    <div
                      ref={scrollContainerRef}
                      className={`h-full overflow-y-auto transition-all duration-500 ease-in-out ${
                        hasFirstMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      } no-scrollbar`}
                      style={{
                        minHeight: '400px',
                        maxHeight: 'calc(100vh - 200px)',
                        scrollBehavior: 'smooth',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem 0.5rem 6rem 0.5rem',
                      }}
                    >
                      <div className="space-y-5 relative z-10 px-2 flex-1">
                        {error && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                            {error}
                          </div>
                        )}
                        
                        {messages.map((msg, index) => (
                          <div key={`${msg.timestamp || index}-${index}`}>
                            <Chat isAi={msg.isAi} value={msg.value} />
                          </div>
                        ))}

                        {isTyping && (
                          <div className="pt-2">
                            <TypingIndicator />
                          </div>
                        )}
                      </div>

                      {/* Jump to latest */}
                      {hasFirstMessage && hasOverflow && !isNearBottom && (
                        <div className="sticky bottom-1 z-20 flex justify-center px-4">
                          <button
                            type="button"
                            onClick={() => scrollToBottom()}
                            className="inline-flex items-center gap-2 rounded-full bg-[#004AE9] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#004AE9]/20 transition-all hover:bg-[#003DC2] hover:shadow-[#004AE9]/30 focus:outline-none focus:ring-2 focus:ring-[#004AE9] focus:ring-offset-2 backdrop-blur-sm"
                          >
                            <span>Jump to latest</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                              aria-hidden
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-20" />
                  </div>
                </div>
              )}
              
              {/* Input box - only show when not showing session options */}
              {!showSessionOptions && (
                <div className="shrink-0 pb-2">
                  <TextBox
                    isTyping={isTyping}
                    onStop={handleStop}
                    onSendMessage={handleSendMessage}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
