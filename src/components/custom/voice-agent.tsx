'use client'
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ButtonEffect from '../ui/ButtonEffect';
import Waveform from './ui-custom/waveform';
import { useRouter } from 'next/navigation';

const VoiceAgent = () => {

  const router = useRouter();
  return (
    <section id="voice-agent" className="relative w-full py-20 md:py-32 px-4 sm:px-6 overflow-hidden bg-black text-white">
      {/* Background grid pattern - matching hero section */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px) ,
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px) 
            `,
            backgroundSize: "clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-[494] leading-tight tracking-tight">
            <div className="textradialgradientgrey mb  -1">
              Talk to our{" "}
              <span className="textradialgradientblue">
                V-Agent
              </span>
            </div>
          </h2>

          <motion.p 
            className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            It doesn't just answer questions...It takes action. Get pricing, book demos, close deals - all in one conversation.
          </motion.p>
        </motion.div>

        {/* Waveform */}
        <motion.div 
          className="w-full max-w-2xl mx-auto my-12 px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Waveform />
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center pt-4"
        >
          <ButtonEffect onClick={() => router.push("" /*' /voice-assistant' */)}>
            <span>Start Now</span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </ButtonEffect>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceAgent;
