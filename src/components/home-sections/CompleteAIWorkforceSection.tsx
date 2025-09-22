"use client";

import { motion } from "motion/react";
import Image from "next/image";

/**
 * CompleteAIWorkforceSection - Platforms automated by AI
 * Matches the reference screenshot design
 */
export default function CompleteAIWorkforceSection() {
  const platforms = [
    { icon: "/assets/workforce/crm.svg", title: "CRM" },
    { icon: "/assets/workforce/email.svg", title: "Email" },
    { icon: "/assets/workforce/social.svg", title: "Social Media" },
    { icon: "/assets/workforce/ecommerce.svg", title: "E-commerce" },
    { icon: "/assets/workforce/accounting.svg", title: "Accounting" },
    { icon: "/assets/workforce/project.svg", title: "Project Management" },
    { icon: "/assets/workforce/hr.svg", title: "HR Systems" },
    { icon: "/assets/workforce/analytics.svg", title: "Analytics" },
  ];

  return (
    <section className="py-20 md:max-w-[70%] mx-auto bg-black px-2 sm:px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-base md:text-lg text-gray-300 mb-6 text-center"
        >
          Platforms We Automate
        </motion.h2>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-[494] mb-12 text-center"
        >
          Your <span className="textradialgradientblue">Complete</span>{" "}
          <span className="textradialgradientgrey">AI Workforce</span>
        </motion.h3>

        {/* Platforms grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-7 bg-black/70 rounded-[18px] border border-gray-800 shadow-lg hover:bg-black/80 transition-colors duration-300"
            >
              <Image
                src={platform.icon}
                alt={platform.title}
                width={38}
                height={38}
                className="mb-4 object-contain"
                priority
              />
              <p className="text-sm md:text-base text-gray-200">
                {platform.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
