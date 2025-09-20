"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function AIBenefitsSection() {
  return (
    <section
      className="w-full mt-12 md:w-[70%] mx-auto min-h-[60vh] flex items-center justify-center px-4 bg-bgBlack relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/curvedline.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Animated curved line background */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/curvedline.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top left",
        }}
      />

      <div className=" flex flex-col items-center justify-center text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-semibold text-white mb-4 block"
        >
          We Harness AI To{" "}
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-semibold text-white mb-4 block"
        >
          <motion.span
            initial={{ color: "#fff" }}
            animate={{ color: "#3b82f6" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-bold"
          >
            Redefine
          </motion.span>{" "}
          Your Experience
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-gray-300 mb-8 max-w-xl mx-auto"
        >
          We Build AI Automation Systems That Eliminate Busywork, Slash Costs,
          And Scale Your Business Without Hiring A Single Person.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-2"
        >
          <button
            className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-black text-white text-base font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.08)] border border-white/10 hover:bg-neutral-900 transition-all"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            Let&apos;s Partner
            <ArrowUpRight size={18} strokeWidth={2} className="ml-1" />
          </button>
        </motion.div>
      </div>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-bgBlack/70 z-0" />
    </section>
  );
}
