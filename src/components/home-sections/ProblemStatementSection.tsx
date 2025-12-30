"use client";

import { motion } from "motion/react";

/**
 * ProblemStatementSection - Identifies pain points that AI can solve
 * Matches the style from the provided reference image
 */
export default function ProblemStatementSection() {
  const problems = [
    "40+ hours weekly on repetitive tasks",
    "Leads slip through cracks during off hours",
    "Paying $60k+ for work AI does for $50/month",
    "Missing opportunities while competitors scale with AI",
  ];

  return (
    <section className="py-24 bg-black px-4" id="problem-statement">
      <div className="max-w-4xl mx-auto text-center">
        {/* Small heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 mb-6"
        >
          The Problem
        </motion.h2>

        {/* Main problem headline */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-[494] textradialgradientgrey mb-12"
        >
          Your Team Is <span className="textradialgradientblue">Drowning</span>{" "}
          In Busy Work
        </motion.h3>

        {/* Problem list */}
        <div className="space-y-6 max-w-2xl mx-auto text-left">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start space-x-4"
            >
              {/* Numbered circle */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 text-sm">
                {index + 1}
              </div>
              <p className="text-lg text-gray-300">{problem}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
