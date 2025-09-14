"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function HeroSection() {
  // Array of rotating subtext messages - different value propositions
  const rotatingTexts = [
    "Scale Your Business 10x Faster With Custom AI Automation That Never Sleeps",
    "Transform Your Operations With Intelligent AI Employees That Work 24/7",
    "Boost Productivity By 70% With Automated Workflows That Never Stop",
    "Join 5,000+ Companies Already Using AI To Outperform Competitors",
  ];

  // State for managing the current text index in the rotation
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Effect to automatically rotate through texts every 4 seconds
  // Creates engaging, dynamic content that keeps users interested
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTexts.length
      );
    }, 4000);

    // Cleanup function to prevent memory leaks
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden z-10">
      {/* Background grid pattern - only for hero section, slightly visible behind text */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      {/* Circuit-like lines and nodes - animated tech elements for futuristic feel */}

      {/* Main content container - centered and properly spaced */}
      <div className="max-w-6xl mx-auto text-center z-20 relative">
        {/* Social proof section - builds credibility with animated profile pictures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center mb-24"
        ></motion.div>

        {/* Main headline - multi-line with "Automated" highlight for emphasis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <div className="text-gray-300 mb-2">We Turn Your Manual</div>
            <div className="text-gray-300 mb-2">Business Into An</div>

            <div className="text-gray-300">
              {" "}
              <span className="text-blue-400 mb-2">Automated</span> Money Machine
            </div>
          </h1>
        </motion.div>

        {/* Rotating subtext with left-to-right slide and bounce animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 mb-20 max-w-4xl mx-auto min-h-[3rem] flex items-center justify-center"
        >
          <motion.p
            key={currentTextIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              x: [50, 0, -5, 0], // Slide in from right with bounce at the end
            }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="text-center"
          >
            {rotatingTexts[currentTextIndex]}
          </motion.p>
        </motion.div>

        {/* CTA Button - primary action with enhanced hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600 text-white hover:from-gray-800 hover:to-gray-700 px-12 py-6 mb-2 rounded-2xl font-semibold text-xl backdrop-blur-sm flex items-center space-x-4 shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <span>Request a Service</span>
              {/* Arrow icon for visual appeal */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
