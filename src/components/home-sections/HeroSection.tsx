"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import ButtonEffect from "../ui/ButtonEffect";

import ServiceRequestForm from "../ServiceRequestForm";
import ContactForm from "../ContactForm";
import Navbar from "../Navbar";
import People from "./People";

export default function HeroSection() {
  const rotatingTexts = [
    "Scale Your Business 10x Faster With Custom AI Automation That Never Sleeps",
    "Transform Your Operations With Intelligent AI Employees That Work 24/7",
    "Boost Productivity By 70% With Automated Workflows That Never Stop",
    "Join 5,000+ Companies Already Using AI To Outperform Competitors",
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <section className="relative max-w-screen min-h-screen pt-44 flex flex-col justify-center items-center px-6 overflow-hidden bg-black text-white">
      {/* Navbar */}
      <Navbar onGetInTouchClick={() => setShowContactForm(true)} />

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
          top-[6%] left-[6%]   
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
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: [0.25, 0.5, 0.25], scale: [0.95, 1, 0.95]}}
                transition={{duration: 6, repeat: Infinity, delay: 3}}
            />
            {/* People component at the top, centered and responsive */}
            <div className="absolute md:top-15 hidden left-0 w-full md:flex justify-center z-30">
                <People />
            </div>
            {/* Main content */}
            <div className="max-w-6xl mx-auto text-center relative">
                {/* Headline */}
                <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{duration: 0.8, delay: 0.4}} className=" mb-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-[494] leading-tight tracking-tight">
                        <div className="text-gray-300 mb-1 ">We Turn Your Manual</div>
                        <div className="text-gray-300 mb-1 ">Business Into An</div>
                        <div className="text-gray-300">
                            <span className="text-blue-400">Automated</span> Money Machine
                        </div>
                    </h1>
                </motion.div>

                {/* Rotating subtext */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.6}}
                    className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-8 max-w-4xl mx-auto min-h-[3rem flex items-center justify-center px-2"
                >
                    <motion.p
                        key={currentTextIndex}
                        initial={{opacity: 0, x: 50}}
                        animate={{opacity: 1, x: [50, 0, -5, 0]}}
                        exit={{opacity: 0, x: -50}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                        className="text-center w-[60%] mx-auto"
                    >
                        {rotatingTexts[currentTextIndex]}
                    </motion.p>
                </motion.div>

                {/* CTA Button */}
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.8, delay: 1.2}}>
                    <div className="flex items-center pb-12 justify-center relative">
                        <ButtonEffect onClick={() => setShowServiceForm(true)}>
                            <span>Request a Service</span>
                            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                        </ButtonEffect>
                    </div>
                </motion.div>
            </div>
            {/* Service Request Form Modal */}
            <AnimatePresence>{showServiceForm && <ServiceRequestForm onClose={() => setShowServiceForm(false)} />}</AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      </AnimatePresence>
    </section>
  );
}