"use client";

import { motion } from "motion/react";
import Image from "next/image";

// Import icons from public/assets/custom folder
import support from "@/../public/assets/custom/support.svg";
import salesIcon from "@/../public/assets/custom/sales.svg";
import operationsIcon from "@/../public/assets/custom/operations.svg";
import researchIcon from "@/../public/assets/custom/research.svg";

const customAgents = [
  {
    icon: support,
    title: "Customer Support AI",
    description: "Resolves 90% of inquiries instantly",
  },
  {
    icon: salesIcon,
    title: "Sales Qualifying AI",
    description: "Only sends hot leads to your team",
  },
  {
    icon: operationsIcon,
    title: "Operations AI",
    description: "Monitors and optimizes all workflows",
  },
  {
    icon: researchIcon,
    title: "Research AI",
    description: "Gathers market intelligence automatically",
  },
];

export default function CustomAIAgentsSection() {
  return (
    <section className="py-20 md:max-w-[70%] mx-auto bg-black px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-[494] textradialgradientgrey mb-4">
            Custom AI <span className="textradialgradientblue">Agents</span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Everything custom built for your specific business needs.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {customAgents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="bg-black/60 border border-white/10 rounded-xl px-7 py-7 flex items-center shadow-lg"
            >
              <div className="flex-shrink-0 flex items-center justify-center mr-5">
                <Image
                  src={agent.icon}
                  alt={agent.title}
                  width={38}
                  height={38}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <span className="text-base md:text-lg font-[494] text-white mb-1">
                  {agent.title}
                </span>
                <span className="text-xs md:text-sm text-gray-300 leading-snug">
                  {agent.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
