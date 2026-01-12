'use client';

import React, { useState } from 'react';
import Submit from './submit';

interface TextBoxProps {
  isTyping?: boolean;
  onStop?: () => void;
  onSendMessage?: (message: string) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    message: string,
    stop: () => void
  ) => void;
  disabled?: boolean;
}

const TextBox = ({ isTyping, onStop, onSendMessage, onKeyDown, disabled = false }: TextBoxProps) => {
  const [boxValue, setBoxValue] = useState<string>("");

  const handleSubmit = () => {
    const text = boxValue.trim();
    if (!text) return;
    
    if (isTyping) {
      onStop?.();
    } else if (onSendMessage) {
      onSendMessage(text);
      setBoxValue("");
    } else if (onKeyDown) {
      // Create a synthetic event to pass to onKeyDown
      const syntheticEvent = {
        key: 'Enter',
        preventDefault: () => {},
        shiftKey: false
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
      onKeyDown(syntheticEvent, text, onStop || (() => {}));
    }
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter → add new line
    if (e.key === "Enter" && e.shiftKey) {
      // Allow default behavior (add new line)
      return;
    }

    // Enter without Shift → handle submission
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isTyping) {
        onStop?.();
      } else if (onKeyDown) {
        onKeyDown(e, boxValue, onStop || (() => {}));
        setBoxValue(""); // Clear the input after sending
      }
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block w-full px-6 py-1">
        <div className="relative flex items-center w-full overflow-hidden">
          <textarea
            className="
              box-border
              py-[16px] pl-5 pr-10
              w-full min-h-[48px]
              border-[0.4px] border-[#004AE94D]
              bg-white bg-[linear-gradient(0deg,rgba(0,0,0,0.025),rgba(0,0,0,0.025))]
              shadow-[0_0_10px_10px_#00000003]
              rounded-2xl
              outline-none
              text-base
              resize-none
              overflow-hidden
            "
            placeholder="Ask me anything you want..."
            onChange={(e) => setBoxValue(e.target.value)}
            value={boxValue}
            onKeyDown={handleKeyDownInternal}
            rows={1}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Submit
              onClick={!disabled ? handleSubmit : undefined}
              isTyping={isTyping}
              onStop={onStop}
              isEmpty={!boxValue.trim()}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full px-[22px] py-3">
        <div className="relative flex items-center w-full overflow-hidden">
          <textarea
            className="
              box-border
              py-[16px] pl-5 pr-10
              w-full min-h-[48px]
              border-[0.4px] border-[#004AE94D]
              bg-white bg-[linear-gradient(0deg,rgba(0,0,0,0.025),rgba(0,0,0,0.025))]
              shadow-[0_0_10px_10px_#00000003]
              rounded-2xl
              outline-none
              text-sm
              resize-none
              overflow-hidden
            "
            placeholder="Ask me anything you want..."
            onChange={(e) => setBoxValue(e.target.value)}
            value={boxValue}
            onKeyDown={handleKeyDownInternal}
            rows={1}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Submit
              onClick={!disabled ? handleSubmit : undefined}
              isTyping={isTyping}
              onStop={onStop}
              isEmpty={!boxValue.trim()}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TextBox;
