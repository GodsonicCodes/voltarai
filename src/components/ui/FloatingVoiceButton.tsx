'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamically import the Chatbot component with SSR disabled
const Chatbot = dynamic(() => import('../ai/chatbot/chatbot'), { ssr: false });

const FloatingVoiceButton = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname()?.toLowerCase().trim();
  const isVoiceAssistantPage = pathname === '/voice-assistant' || pathname === '/voice-assistant/';

  // Ensure component is mounted before showing to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Track scroll position
  useEffect(() => {
    if (isVoiceAssistantPage) return; // Skip scroll handling on voice assistant page

    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsScrolling(false);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isVoiceAssistantPage]);

  const handleClick = () => {
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  // Calculate opacity based on scroll state and hover
  const getOpacity = () => {
    if (isHovered) return 1;
    return isScrolling ? 0.4 : 0.7;
  };

  // Calculate scale based on hover state
  const getScale = () => {
    return isHovered ? 1.05 : 0.95;
  };

  // Don't render anything if on voice assistant page
  if (isVoiceAssistantPage || !isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {showChatbot && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              onClick={handleCloseChatbot}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
            >
              <Chatbot onClose={handleCloseChatbot} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-[45] cursor-pointer pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          opacity: getOpacity(),
          scale: getScale(),
          transition: 'opacity 0.3s ease, transform 0.2s ease',
          transform: `scale(${getScale()})`,
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 45,
          pointerEvents: 'auto',
          willChange: 'transform, opacity'
        }}
        whileHover={{
          opacity: 1,
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
      >
        <div className="relative w-14 h-14 md:w-16 md:h-16">
          <Image
            src="/assets/ai/voice-agent.png"
            alt="Voice Agent"
            fill
            className="object-contain"
            priority
          />
          {isHovered && (
            <motion.span 
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              Talk to our AI Agent
            </motion.span>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FloatingVoiceButton;