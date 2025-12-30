"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VoiceCircle from "./ui/voice-circle";
import Waveform from "./ui/waveform";
import Image from "next/image";
import mobileLogo from "../../../../public/assets/logo/logomobile.svg";
import desktopLogo from "../../../../public/assets/logo/logodesktop.svg"
import AiButton from "@/components/ai/voice-assitant/ui/button";
import useScreenSize from "@/hooks/useScreenSize";
import ActionMenu from "./ui/action-menu";
import { useWhoIsSpeaking } from "@/hooks/useWhoIsSpeaking";
import { useWebSocketVoiceAssistant } from "@/hooks/useWebSocketVoiceAssistant";
import TranscriptPanel, { TranscriptPanelMobile, Message } from "./ui/transcript-panel";

const VoiceAssistant = () => {
  const router = useRouter();
  const {isMobile} = useScreenSize();
  
  // Use the WebSocket voice assistant hook
  const { 
    isListening, 
    isProcessing, 
    isSpeaking, 
    isConnecting,
    currentState, 
    transcript, 
    error,
    startSession,
    endSession,
    interrupt,
    hasActiveSession
  } = useWebSocketVoiceAssistant({
    autoStart: false,
  });
  
  // Use the hook to detect who is speaking (for visual feedback)
  const { isUserSpeaking, isAiSpeaking, setAiSpeaking } = useWhoIsSpeaking({
    userSpeechThreshold: 15,
    debounceMs: 300
  });
  
  // Sync speaking states with WebSocket service state
  useEffect(() => {
    setAiSpeaking(isSpeaking);
  }, [isSpeaking, setAiSpeaking]);
  
  // Convert transcript format to match UI components
  const uiTranscript: { role: 'user' | 'ai', content: string }[] = transcript.map((msg, index) => ({
    role: msg.role === 'user' || msg.role === 'agent' ? 'user' : 'ai', // Handle both 'user' and 'agent' roles
    content: msg.text || msg.content || '',
  }));
  
  const handleStartVoiceCall = async () => {
    // Error is already managed by the hook, just start the session
    await startSession();
  };
  
  const handleStopCall = async () => {
    await endSession();
  };
  
  const handleToggleTranscription = () => {
    // This functionality would need to be implemented based on your requirements
  };
  
  // Handle recording state changes
  useEffect(() => {
    // Update the visual feedback based on the current state from the WebSocket service
    if (currentState === 'listening' || currentState === 'transcribing') {
      // User is speaking
      console.log('User is speaking');
    } else if (currentState === 'speaking') {
      // AI is speaking
      console.log('AI is speaking');
    } else if (currentState === 'thinking') {
      // AI is processing
      console.log('AI is processing');
    }
  }, [currentState]);

  if(hasActiveSession){
    return (
        <div className="w-full h-dvh overflow-hidden bg-black px-10 py-12.5 flex flex-col justify-between">
      {/* Desktop Transcript Panel */}
      <TranscriptPanel 
        listening={isListening} 
        messages={uiTranscript} 
        isLoading={isProcessing}
      />
      
      <div className="flex flex-col h-full justify-between">
        <Image priority src={isMobile ? mobileLogo : desktopLogo} alt="voltar ai logo" className="flex self-start hover:cursor-pointer" onClick={() => router.push("/")}/>
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Status Indicator */}
          {isProcessing && (
            <div className="text-yellow-400 text-sm animate-pulse">
              {currentState === 'transcribing' ? 'Transcribing...' : 
               currentState === 'thinking' ? 'Thinking...' : 
               'Processing...'}
            </div>
          )}
          
          <VoiceCircle 
            isUserSpeaking={currentState === 'listening' || currentState === 'transcribing'} 
            isAiSpeaking={currentState === 'speaking'} 
            isListening={isListening}
          />
          {(currentState === 'listening' || currentState === 'transcribing') && (
            <Waveform listening={true} />
          )}
          
          {/* Mobile Transcript Panel */}
          <TranscriptPanelMobile 
            listening={isListening} 
            messages={uiTranscript}
            isLoading={isProcessing}
          />
          
          {/* Connection/Processing Indicator */}
          {isConnecting && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              Connecting...
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <ActionMenu 
          onStopCall={handleStopCall} 
          isTranscribing={true}
          onToggleTranscription={handleToggleTranscription}
        />
      </div>
    </div>
    )
  }

  return (
  <div className="w-full h-dvh bg-black px-10 py-12.5 flex flex-col justify-between">
    <div className="flex flex-col lg:gap-[80px] gap-[50px]">
      <Image priority src={isMobile ? mobileLogo : desktopLogo} alt="voltar ai logo" className="flex self-start hover:cursor-pointer" onClick={() => router.push("/")}/>
      <div className="flex flex-col items-center justify-center gap-6">
        <VoiceCircle />
      </div>
    </div>
    <AiButton children="Start Voice Call" onClick={handleStartVoiceCall} />
  </div>
  );
};

export default VoiceAssistant;
