"use client";

import { motion } from "motion/react";
import { Shield, Clock, CheckCircle } from "lucide-react";

/**
 * InANutshellSection - Showcases key statistics and company mission
 * This section provides concrete numbers to build trust and credibility
 * Features animated statistics that highlight the main value propositions
 */
export default function InANutshellSection() {
  // Key performance indicators that demonstrate AI effectiveness
  // Each stat is paired with a relevant icon for visual impact
  const stats = [
    {
      icon: Shield,
      value: "67%",
      label: "Energy Cost Reduction",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Operations around the clock",
    },
    {
      icon: CheckCircle,
      value: "98%",
      label: "Error-free results",
    },
  ];

  return (
    <section className="py-20 bg-bgBlack px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header with company mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            In a Nutshell
          </h2>
          {/* Mission statement that explains what the company does */}
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-300">
            <p>
              We're building AI employees to automate your business processes
              and boost productivity.
            </p>
            <p>
              We're helping companies scale faster, reduce costs, and achieve
              their goals.
            </p>
          </div>
        </motion.div>

        {/* Statistics grid showcasing key performance indicators */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Icon container with blue accent background */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-6">
                <stat.icon className="w-10 h-10 text-blue-400" />
              </div>
              {/* Large, bold statistic value */}
              <div className="text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              {/* Descriptive label for the statistic */}
              <div className="text-lg text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
