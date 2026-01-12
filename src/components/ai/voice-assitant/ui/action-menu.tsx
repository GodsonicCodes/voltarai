"use client";

import React, { useState } from "react";
import { Mic, MicOff, MessageSquare, MessageSquareOff } from "lucide-react";
import CancelButton from "./cancel-button";

interface ActionMenuProps {
  onStopCall?: () => void;
  isTranscribing?: boolean;
  onToggleTranscription?: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onStopCall,
  isTranscribing,
  onToggleTranscription,
}) => {

  // 🎤 mic mute state only
  const [isMuted, setIsMuted] = useState(false);

  const handleMicToggle = (e: React.MouseEvent) => {
    e.stopPropagation();               // ⛔ avoid triggering parent click
    setIsMuted(prev => !prev);         // ✅ only mute / unmute
  };

  const handleTranscriptionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();               // avoid accidental closing
    onToggleTranscription?.();
  };

  return (
    <div className="flex justify-center items-center w-full max-w-[90vw] sm:max-w-[400px]">

      <button
        className="
          px-4 py-2
          rounded-full
          text-white
          flex items-center gap-3
          border
          transition-all
        "
        style={{
          background:
            "linear-gradient(176.01deg, rgba(255,255,255,0.04) 2.66%, rgba(255,255,255,0.12) 80.33%)",
          border: "1px solid #FFFFFF33",
          backdropFilter: "blur(74px)",
        }}
      >

        {/* 🎤 MUTE / UNMUTE ONLY (does NOT close agent) */}
        {isMuted ? (
          <MicOff
            size={18}
            className="cursor-pointer hover:text-red-400"
            onClick={handleMicToggle}
          />
        ) : (
          <Mic
            size={18}
            className="cursor-pointer hover:text-blue-400"
            onClick={handleMicToggle}
          />
        )}

        {/* ⛔ ONLY THIS BUTTON STOPS & CLOSES */}
        <CancelButton onClick={onStopCall} />

        {/* 💬 transcription toggle */}
        {isTranscribing ? (
          <MessageSquareOff
            size={18}
            className="cursor-pointer hover:text-red-400"
            onClick={handleTranscriptionToggle}
          />
        ) : (
          <MessageSquare
            size={18}
            className="cursor-pointer hover:text-blue-400"
            onClick={handleTranscriptionToggle}
          />
        )}

      </button>
    </div>
  );
};

export default ActionMenu;
