"use client";

import { motion } from "motion/react";
import { HardHat, Zap, TrendingUp, LineChart } from "lucide-react";

/**
 * SolutionSection - Presents AI as the solution to business problems
 * Matches the style from the provided reference image
 */
export default function SolutionSection() {
  const benefits = [
    {
      icon: HardHat,
      text: "Never call in sick or take vacations",
    },
    {
      icon: Zap,
      text: "Work 24/7 at superhuman speed",
    },
    {
      icon: TrendingUp,
      text: "Cost 95% less than human employees",
    },
    {
      icon: LineChart,
      text: "Scale instantly without hiring headaches",
    },
  ];

  return (
    <section className="py-24 bg-black px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 mb-6"
        >
          Our Solution
        </motion.h2>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-200 mb-16"
        >
          AI Employees That <span className="text-blue-500">Outperform</span>{" "}
          Humans
        </motion.h3>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 p-6 bg-gray-900/40 rounded-lg border border-gray-800 text-left"
            >
              {/* Icon */}
              <benefit.icon className="w-6 h-6 text-blue-400 flex-shrink-0" />
              {/* Text */}
              <p className="text-lg text-gray-200">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
