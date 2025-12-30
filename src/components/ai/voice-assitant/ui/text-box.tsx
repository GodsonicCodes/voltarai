import React, { useState, useEffect, useRef } from 'react';
import { VoiceMessage } from '@/services/voice-assistant';

import { AIResponse } from '@/services/voice-assistant';

interface TextBoxProps {
  conversation: VoiceMessage[];
  lastResponse?: AIResponse | null;
  isRecording: boolean;
  isProcessing: boolean;
  isUserSpeaking: boolean;
  isAiSpeaking: boolean;
  isListening: boolean;
  isMobile: boolean;
  className?: string;
}

const TextBox = ({ 
  conversation, 
  lastResponse,
  isRecording, 
  isProcessing, 
  isUserSpeaking, 
  isAiSpeaking,
  isListening,
  isMobile,
  className = ""
}: TextBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveTranscription, setLiveTranscription] = useState<string>("");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, liveTranscription]);

  // Clear live transcription when recording stops
  useEffect(() => {
    if (!isRecording && !isProcessing) {
      setLiveTranscription("");
    }
  }, [isRecording, isProcessing]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIndicator = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center gap-2 text-yellow-400 text-sm animate-pulse">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          Processing...
        </div>
      );
    }
    
    if (isRecording && isUserSpeaking) {
      return (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          You are speaking...
        </div>
      );
    }
    
    if (isAiSpeaking) {
      return (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          AI is speaking...
        </div>
      );
    }

    if (isRecording) {
      return (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          Listening...
        </div>
      );
    }

    return null;
  };

  // Desktop: Fixed panel on right side
  if (!isMobile) {
    return (
      <div
        className={`
          fixed right-4 md:right-6 top-20 md:top-24 w-[280px] md:w-[320px] max-h-[50vh] md:max-h-[60vh] rounded-2xl overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] z-40
          ${isListening 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 pointer-events-none translate-y-4'
          }
        `}
      >
        <div className={`bg-[#00000020] backdrop-blur-sm rounded-t-[17px] rounded-b-[17px] h-full`}>
          {/* Messages container with fade shadow at top */}
          <div 
            ref={containerRef}
            className="h-48 md:h-64 overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-3 no-scrollbar relative"
          >
            {/* Top fade shadow */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 md:h-6 bg-gradient-to-b from-black/40 to-transparent z-10" />
            
            {conversation.length === 0 ? (
              <div className="text-center py-4 md:py-8">
                <p className="text-[#FFFFFFB2] text-xs md:text-[13px] font-[375] leading-[125%]">No conversation yet</p>
                <p className="text-[#FFFFFFB2]/60 text-xs md:text-[13px] font-[375] leading-[125%] mt-2">Start speaking to begin the conversation</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <div
                  key={`${message.timestamp}-${index}`}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] ${
                      message.isUser
                        ? 'bg-[#FFFFFF80] text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]'
                        : 'bg-[#FFFFFF0D] text-[#FFFFFFB2] rounded-t-[12px] md:rounded-t-[17px] rounded-tr-[12px] md:rounded-tr-[17px] rounded-br-[12px] md:rounded-br-[17px]'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Live transcription indicator */}
            {isRecording && isUserSpeaking && (
              <div className="flex justify-end">
                <div className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] bg-[#FFFFFF80] text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]`}>
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce"></div>
                      <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs md:text-sm">Listening...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Live transcription text */}
            {isRecording && isUserSpeaking && lastResponse?.text && (
              <div className="flex justify-end">
                <div className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] bg-[#FFFFFF80]/30 text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]`}>
                  <span className="opacity-70">{lastResponse.text}</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Between waveform and action box
  return (
    <div
      className={`
        w-full transition-all duration-500 overflow-hidden
        ${isListening 
          ? 'max-h-[150px] md:max-h-[200px] opacity-100 mt-2 md:mt-3' 
          : 'max-h-0 opacity-0'
        }
      `}
    >
      <div className={`bg-[#00000020] backdrop-blur-sm rounded-t-[12px] md:rounded-t-[17px] rounded-b-[12px] md:rounded-b-[17px] ${className}`}>
        {/* Messages container with fade shadow at top */}
        <div 
          ref={containerRef}
          className="h-[150px] md:h-[200px] overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-3 no-scrollbar relative"
        >
          {/* Top fade shadow */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 md:h-6 bg-gradient-to-b from-black/40 to-transparent z-10" />
          
          {conversation.length === 0 ? (
            <div className="text-center py-4 md:py-8">
              <p className="text-[#FFFFFFB2] text-xs md:text-[13px] font-[375] leading-[125%]">No conversation yet</p>
              <p className="text-[#FFFFFFB2]/60 text-xs md:text-[13px] font-[375] leading-[125%] mt-2">Start speaking to begin the conversation</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] ${
                    message.isUser
                      ? 'bg-[#FFFFFF80] text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]'
                      : 'bg-[#FFFFFF0D] text-[#FFFFFFB2] rounded-t-[12px] md:rounded-t-[17px] rounded-tr-[12px] md:rounded-tr-[17px] rounded-br-[12px] md:rounded-br-[17px]'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                </div>
              </div>
            ))
          )}
          
          {/* Live transcription indicator */}
          {isRecording && isUserSpeaking && (
            <div className="flex justify-end">
              <div className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] bg-[#FFFFFF80] text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]`}>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs md:text-sm">Listening...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Live transcription text */}
          {isRecording && isUserSpeaking && lastResponse?.text && (
            <div className="flex justify-end">
              <div className={`max-w-[200px] md:max-w-[280px] px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-[13px] font-[375] leading-[125%] bg-[#FFFFFF80]/30 text-white rounded-t-[12px] md:rounded-t-[17px] rounded-tl-[12px] md:rounded-tl-[17px] rounded-bl-[12px] md:rounded-bl-[17px]`}>
                <span className="opacity-70">{lastResponse.text}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default TextBox;