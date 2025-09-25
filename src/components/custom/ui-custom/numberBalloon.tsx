"use client";
import { motion } from "motion/react";

const Balloon = ({ value }: { value: string | number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      className="inline-flex items-center justify-center w-8 h-8 sm:w-6 sm:h-6 text-base sm:text-sm text-center text-zinc-200/90 font-medium border border-white/30 rounded-full leading-none select-none"
    >
      {value}
    </motion.span>
  );
};
export default Balloon;
