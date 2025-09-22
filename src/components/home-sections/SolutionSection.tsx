"use client";

import { motion } from "motion/react";
import Image from "next/image";

// Import icons from public assets/oursolution folder
import icon1 from "@/../public/assets/oursolution/call.svg";
import icon2 from "@/../public/assets/oursolution/work.svg";
import icon3 from "@/../public/assets/oursolution/cost.svg";
import icon4 from "@/../public/assets/oursolution/scale.svg";

export default function SolutionSection() {
  const benefits = [
    {
      icon: icon1,
      text: "Never call in sick or take vacations",
    },
    {
      icon: icon2,
      text: "Work 24/7 at superhuman speed",
    },
    {
      icon: icon3,
      text: "Cost 95% less than human employees",
    },
    {
      icon: icon4,
      text: "Scale instantly without hiring headaches",
    },
  ];

  return (
    <section className="py-20 md:max-w-[70%] mx-auto flex justify-center items-center bg-bgBlack px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-base md:text-lg text-gray-300 mb-6 text-center"
        >
          Our Solution
        </motion.h2>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl text-gray-300 md:text-4xl font-[494] mb-12 text-center"
        >
          AI Employees That <span className="text-blue-400">Outperform</span>{" "}
          <span className="text-gray-300">Humans</span>
        </motion.h3>

        {/* Benefits grid */}
        <div className="grid md:w-[70%] md:mx-auto grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="bg-black/60 border border-white/10 rounded-xl px-6 py-7 flex items-center shadow-lg"
            >
              <div className="flex-shrink-0 flex items-center justify-center mr-5">
                <Image
                  src={benefit.icon}
                  alt={benefit.text}
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <span className="text-sm md:text-base text-white font-[494] leading-snug">
                  {benefit.text}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
