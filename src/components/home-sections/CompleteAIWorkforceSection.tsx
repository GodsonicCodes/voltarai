"use client";

import { motion } from "motion/react";
import {
  Network,
  Mail,
  Users,
  ShoppingBag,
  Landmark,
  ClipboardCheck,
  Settings,
  BarChart3,
} from "lucide-react";

/**
 * CompleteAIWorkforceSection - Platforms automated by AI
 * Matches the reference screenshot design
 */
export default function CompleteAIWorkforceSection() {
  const platforms = [
    { icon: Network, title: "CRM" },
    { icon: Mail, title: "Email" },
    { icon: Users, title: "Social Media" },
    { icon: ShoppingBag, title: "E-commerce" },
    { icon: Landmark, title: "Accounting" },
    { icon: ClipboardCheck, title: "Project Management" },
    { icon: Settings, title: "HR Systems" },
    { icon: BarChart3, title: "Analytics" },
  ];

  return (
    <section className="py-24 bg-black px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 mb-6"
        >
          Platforms We Automate
        </motion.h2>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-200 mb-16"
        >
          Your <span className="text-blue-500">Complete</span> AI Workforce
        </motion.h3>

        {/* Platforms grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-8 bg-gray-900/40 rounded-lg border border-gray-800 hover:bg-gray-800/50 transition-colors duration-300"
            >
              {/* Icon */}
              <platform.icon className="w-7 h-7 text-blue-400 mb-4" />
              {/* Title */}
              <p className="text-base text-gray-200">{platform.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
