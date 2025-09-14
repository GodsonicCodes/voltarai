"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

/**
 * AIBenefitsSection - Introduces the core value proposition of AI automation
 * This section bridges the hero and the detailed services, explaining how AI transforms businesses
 * Uses scroll-triggered animations to engage users as they read
 */
export default function AIBenefitsSection() {
  return (
    <section className="py-20 bg-bgBlack px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main headline that emphasizes the transformative power of AI */}
        {/* Animates in when scrolled into view for better user engagement */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          We Harness AI To{" "}
          <span className="textradialgradientblue">
            Redefine Your Experience
          </span>
        </motion.h2>

        {/* Supporting text that explains the specific benefits */}
        {/* Delayed animation creates a natural reading flow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
        >
          Our AI solutions are designed to streamline your operations, enhance
          customer satisfaction, and drive unprecedented growth.
        </motion.p>

        {/* Secondary call-to-action for users who want to learn more */}
        {/* Final animation element to complete the section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-lg px-8 py-4"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
