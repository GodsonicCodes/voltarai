import React from "react";
import { motion } from "motion/react";

interface ButtonEffectProps {
  children: React.ReactNode;
}

const ButtonEffect: React.FC<ButtonEffectProps> = ({ children }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex justify-center mt-2"
      >
        <button
          type="button"
          className="relative border border-white/20 
                 bg-gradient-to-t from-neutral-900 via-black to-neutral-900
                   font-medium text-white
                 backdrop-blur-sm 
                 focus:outline-none
                 hover:scale-105 hover:bg-neutral-900 hover:text-white flex items-center gap-2 px-7 py-2.5 rounded-full bg-black text-base shadow-[0_0_0_1px_rgba(255,255,255,0.08)]  transition-all"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* Decorative top-right arc */}
          <span
            className="pointer-events-none absolute -top-[6px] -right-[6px] 
                   h-7 w-7 rounded-tr-full border-t-1 border-r-1 border-white/30 "
          ></span>
          {children}
        </button>
      </motion.div>
    </div>
  );
};

export default ButtonEffect;
