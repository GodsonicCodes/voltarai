"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import ButtonEffect from "./ui/ButtonEffect";

/**
 * Navbar - Top navigation component for the Voltar.ai landing page
 * Features the brand logo with dot and a "Get in Touch" CTA button
 * Matches the minimalist design with subtle gradient button styling
 */
export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand logo with white dot and "Voltar.ai" text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-3"
        >
          {/* White circular dot */}
          <div className="w-2 h-2 bg-white rounded-full"></div>
          {/* Brand name */}
          <span className="text-white text-xl font-medium">Voltar.ai</span>
        </motion.div>

        {/* Get in Touch button with subtle gradient */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ButtonEffect>Get in Touch</ButtonEffect>
        </motion.div>
      </div>
    </nav>
  );
}

