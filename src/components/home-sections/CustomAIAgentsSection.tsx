"use client";

import { motion } from "motion/react";
import { Headphones, BarChart3, Settings, LineChart } from "lucide-react";

export default function CustomAIAgentsSection() {
  const customAgents = [
    {
      icon: Headphones,
      title: "Customer Support AI",
      description: "Resolves 90% of inquiries instantly",
    },
    {
      icon: BarChart3,
      title: "Sales Qualifying AI",
      description: "Only sends hot leads to your team",
    },
    {
      icon: Settings,
      title: "Operations AI",
      description: "Monitors and optimizes all workflows",
    },
    {
      icon: LineChart,
      title: "Research AI",
      description: "Gathers market intelligence automatically",
    },
  ];

  return (
    <section className="py-20 bg-black px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Custom AI <span className="text-blue-500">Agents</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything custom built for your specific business needs.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {customAgents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-8 hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-lg mb-6">
                <agent.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {agent.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {agent.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
