"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const rotatingTexts = [
    "Scale Your Business 10x Faster With Custom AI Automation That Never Sleeps",
    "Transform Your Operations With Intelligent AI Employees That Work 24/7",
    "Boost Productivity By 70% With Automated Workflows That Never Stop",
    "Join 5,000+ Companies Already Using AI To Outperform Competitors",
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTexts.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <section className="relative min-h-screen pt-44 flex flex-col justify-center items-center px-6 overflow-hidden z-10">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)",
          }}
        />
      </div>

      {/* Corner lines with responsive positions */}
      <motion.img
        src="/line.svg"
        alt="corner line"
        className="absolute 
          top-[6%] left-[6%]   /* mobile closer */
          sm:top-[5%] sm:left-[5%] 
          md:top-[4%] md:left-[4%] 
          lg:top-[3%] lg:left-[3%] 
          w-[clamp(4rem,8vw,12rem)] opacity-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.img
        src="/line.svg"
        alt="corner line"
        className="absolute 
          top-[6%] right-[6%] 
          sm:top-[5%] sm:right-[5%] 
          md:top-[4%] md:right-[4%] 
          lg:top-[3%] lg:right-[3%] 
          w-[clamp(4rem,8vw,12rem)] rotate-80 opacity-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <motion.img
        src="/line.svg"
        alt="corner line"
        className="absolute 
          bottom-[6%] left-[6%] 
          sm:bottom-[5%] sm:left-[5%] 
          md:bottom-[2%] md:left-[4%] 
          lg:bottom-[3%] lg:left-[3%] 
          w-[clamp(4rem,8vw,12rem)] -rotate-90 opacity-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      <motion.img
        src="/line.svg"
        alt="corner line"
        className="absolute 
          bottom-[6%] right-[6%] 
          sm:bottom-[5%] sm:right-[5%] 
          md:bottom-[2%] md:right-[4%] 
          lg:bottom-[3%] lg:right-[3%] 
          w-[clamp(4rem,8vw,12rem)] rotate-170 opacity-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      />

      {/* Main content */}
      <div className="max-w-6xl mx-auto text-center z-20 relative">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className=" mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <div className="text-gray-300 mb-1 ">
              We Turn Your Manual
            </div>
            <div className="text-gray-300 mb-1 ">Business Into An</div>
            <div className="text-gray-300">
              <span className="text-blue-400">Automated</span> Money Machine
            </div>
          </h1>
        </motion.div>

        {/* Rotating subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-20 max-w-4xl mx-auto min-h-[3rem] flex items-center justify-center px-2"
        >
          <motion.p
            key={currentTextIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: [50, 0, -5, 0] }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            {rotatingTexts[currentTextIndex]}
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center pb-12 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600 text-white hover:from-gray-800 hover:to-gray-700 px-6 py-3 md:px-12 md:py-6 rounded-2xl font-semibold text-base md:text-xl backdrop-blur-sm flex items-center space-x-4 shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <span>Request a Service</span>
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
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
