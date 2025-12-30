"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export type Message = {
  role: "ai" | "user";
  content: string;
};

interface TranscriptPanelProps {
  listening: boolean;
  messages: Message[];
  isLoading?: boolean;
  interimTranscript?: string;
  className?: string;
}

function Bubble({
  role,
  content,
  isLoading = false,
}: {
  role: "ai" | "user";
  content: string;
  isLoading?: boolean;
}) {
  const isAI = role === "ai";

  return (
    <div
      className={clsx(
        "max-w-[280px] text-[13px] leading-[125%] font-normal",
        "transition-all duration-300",
        isAI ? "self-start mr-8" : "self-end ml-8",
        "flex"
      )}
      style={{
        fontFamily: "Author",
        fontWeight: 375,
      }}
    >
      <div
        className={clsx(
          "px-3 py-2",
          "shadow-sm backdrop-blur-[6px]",
          "break-words",
          // AI bubble: rounded except bottom-left
          // User bubble: rounded except bottom-right
          isAI
            ? "rounded-t-[17px] rounded-tr-[17px] rounded-br-[17px]"
            : "rounded-t-[17px] rounded-tl-[17px] rounded-bl-[17px]"
        )}
        style={{
          background: isAI ? "#FFFFFF0D" : "#FFFFFF80",
          color: isAI ? "#FFFFFFB2" : "#FFFFFF",
        }}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            {content}
            <span className="animate-dots inline-block w-3 text-left"></span>
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

export default function TranscriptPanel({
  listening,
  messages,
  isLoading = false,
  interimTranscript = "",
  className,
}: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior });
      setIsNearBottom(true);
      setShowScrollButton(false);
    }
  }, []);

  // Auto-scroll when near bottom or when new messages arrive
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom, scrollToBottom]);

  // Update scroll state on scroll and resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const isOverflow = scrollHeight > clientHeight;
      const isNearBottomNow = distanceFromBottom <= 64;

      setIsNearBottom(isNearBottomNow);
      setHasOverflow(isOverflow);
      setShowScrollButton(isOverflow && !isNearBottomNow);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [messages.length]);

  return (
    <div
      className={clsx(
        "transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]",
        "z-40",
        // Desktop position (right side)
        "hidden md:flex right-6 top-24 fixed",
        listening
          ? "opacity-100 translate-y-0"
          : "opacity-0 pointer-events-none translate-y-4",
        className
      )}
    >
      <div className="w-[320px] max-h-[60vh] rounded-2xl relative overflow-hidden">
        {/* Fade shadow at top */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-10" />

        {/* Scrollable messages */}
        <div
          ref={containerRef}
          className="overflow-y-scroll pr-2 no-scrollbar space-y-3 p-3 flex flex-col"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.map((msg, i) => (
            <Bubble 
              key={i} 
              role={msg.role} 
              content={msg.content}
              isLoading={isLoading && msg.role === "ai" && i === messages.length - 1}
            />
          ))}
          
          {/* Show interim transcription for user */}
          {interimTranscript && (
            <Bubble role="user" content={interimTranscript} />
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile variant
export function TranscriptPanelMobile({
  listening,
  messages,
  isLoading = false,
  interimTranscript = "",
}: {
  listening: boolean;
  messages: Message[];
  isLoading?: boolean;
  interimTranscript?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior });
      setIsNearBottom(true);
      setShowScrollButton(false);
    }
  }, []);

  // Auto-scroll when near bottom or when new messages arrive
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom, scrollToBottom]);

  // Update scroll state on scroll and resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const isOverflow = scrollHeight > clientHeight;
      const isNearBottomNow = distanceFromBottom <= 64;

      setIsNearBottom(isNearBottomNow);
      setHasOverflow(isOverflow);
      setShowScrollButton(isOverflow && !isNearBottomNow);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [messages.length]);

  return (
    <div
      className={clsx(
        "md:hidden w-full px-3 transition-all duration-500",
        listening ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 overflow-hidden"
      )}
    >
      <div className="w-full max-w-[400px] mx-auto rounded-2xl relative overflow-hidden">
        {/* Fade shadow at top */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-10" />

        {/* Scrollable messages */}
        <div
          ref={containerRef}
          className="overflow-y-scroll pr-2 no-scrollbar space-y-3 p-3 flex flex-col"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.map((msg, i) => (
            <Bubble 
              key={i} 
              role={msg.role} 
              content={msg.content}
              isLoading={isLoading && msg.role === "ai" && i === messages.length - 1}
            />
          ))}
          
          {/* Show interim transcription for user */}
          {interimTranscript && (
            <Bubble role="user" content={interimTranscript} />
          )}
        </div>
      </div>
    </div>
  );
}
