"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

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
          <Button
            variant="outline"
            className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50 px-6 py-2 rounded-full backdrop-blur-sm"
          >
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </nav>
  );
}

