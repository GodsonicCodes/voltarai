import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import ButtonEffect from '../ui/ButtonEffect';
import AiPng from "../../../public/assets/ai/ai-png.png";

const AiAgent = () => {
  return (
    <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 overflow-hidden bg-black text-white">
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

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-[494] leading-tight tracking-tight">
              <div className="textradialgradientgrey">
                Experience Our AI{" "}
                <span className="textradialgradientblue">
                  Voice Agent
                </span>{" "}
                In Action
              </div>
            </h2>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Test our voice agent and discover how effortless our customer interactions can be
            </motion.p>

            <motion.div
              className="mt-10 flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ButtonEffect>
                <span>Start Live Demo</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </ButtonEffect>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              <Image 
                src={AiPng} 
                alt="AI Voice Agent in Action" 
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AiAgent;