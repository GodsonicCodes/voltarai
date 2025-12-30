"use client";
import { motion, AnimatePresence } from "motion/react";
import ButtonEffect from "../ui/ButtonEffect";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AIStrategyForm from "../AIStrategyForm";

const FinalCta = () => {
  const [showAIStrategyForm, setShowAIStrategyForm] = useState(false);

  return (
    <>
      <section id="final-cta" className="py-20 px-2 sm:px-4 bg-bgBlack overflow-hidden relative">
        {/* Main content container with proper max-width */}
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl mx-auto space-y-6 md:space-y-10"
          >
            {/* Heading with improved gradient classes */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="w-full text-2xl md:text-4xl font-[494] text-center text-transparent textradialgradientgrey"
            >
              Your <span className="textradialgradientblue bg-clip-text text-transparent">Competitors</span> have Employees. Do you?
            </motion.h2>

            {/* Paragraph with improved text contrast */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="w-full text-base md:text-lg text-gray-300 text-center max-w-3xl mx-auto leading-relaxed"
            >
              Everyday without AI automation costs you thousands in wasted labor and
              missed opportunities.
            </motion.p>

            {/* CTA Button */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center pt-4"
            >
              <ButtonEffect onClick={() => setShowAIStrategyForm(true)}>
                <span>Get Our Free AI Strategy</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </ButtonEffect>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-6 text-sm text-gray-400">
              </div>
            </motion.div>

            {/* Secondary links */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-white"
            >
              <Link
                href="#replace-employee"
                className="relative text-center text-base md:text-lg text-white hover:text-blue-500 transition-colors duration-300 py-1 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:h-px after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Replace my most expensive employee
              </Link>
              <span className="text-gray-500 hidden md:inline">•</span>
              <Link
                href="#automate-processes"
                className="relative text-center text-base md:text-lg text-white hover:text-blue-500 transition-colors duration-300 py-1 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:h-px after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Automate my business processes
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/assets/grid.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)"
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </section>

      {/* AI Strategy Form Modal */}
      <AnimatePresence>
        {showAIStrategyForm && (
          <AIStrategyForm onClose={() => setShowAIStrategyForm(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default FinalCta;