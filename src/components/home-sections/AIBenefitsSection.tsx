"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ButtonEffect from "../ui/ButtonEffect";

export default function AIBenefitsSection() {
  return (
    <section
      className="w-full mt-12 md:w-[70%] mx-auto md:min-h-[60vh] pt-10 md:pt-0 flex items-center justify-center px-4 bg-bgBlack relative overflow-hidden"
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
          className="text-3xl md:text-5xl font-[494] textradialgradientgrey mb-4 block"
        >
          We Harness AI To{" "}
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-[494] textradialgradientgrey mb-4 block"
        >
          <motion.span
            initial={{ color: "#fff" }}
            animate={{ color: "#3b82f6" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-[494]"
          >
            <span className="textradialgradientblue">Redefine</span>
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
          <ButtonEffect>
            Let&apos;s Partner
            <ArrowUpRight size={18} strokeWidth={2} className="ml-1" />
          </ButtonEffect>
        </motion.div>
      </div>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-bgBlack/70 z-0" />
    </section>
  );
}
