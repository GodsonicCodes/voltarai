"use client";

import { motion } from "motion/react";

export default function InANutshellSection() {
  const testimonials = [
    {
      quote:
        "Our AI handles 340% more leads than our old sales team. ROI hit in 18 days",
      author: "Sarah Chen",
      company: "CEO Techflow",
      companyLink: "#",
    },
    {
      quote:
        "Saved $180k annually by replacing 3 customer service reps with AI",
      author: "Marcus Rodriguez",
      company: "GrowthLab",
      companyLink: "#",
    },
  ];

  const stats = [
    {
      value: "67%",
      label: "Average Cost Reduction",
      accent: true,
    },
    {
      value: "24/7",
      label: "Operations without overtime",
      accent: false,
    },
    {
      value: "98%",
      label: "Client retention",
      accent: true,
    },
  ];

  return (
    <section className="py-20 md:max-w-[80%] md:mx-auto bg-bgBlack px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-lg md:text-xl font-normal text-white mb-10"
        >
          Social Proof
        </motion.h2>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-black/60 border border-white/10 rounded-xl py-8 px-6 md:px-10 text-white flex flex-col justify-between min-h-[120px] shadow-lg"
            >
              <div className="flex flex-col items-center">
                
                <span className="text-sm md:text-base text-center font-light text-white/90">
                  {`"` }{t.quote}{`"` }
                </span>
              
              </div>
              <div className="text-xs md:text-sm text-gray-400 text-center mt-4">
                {t.author},{" "}
                <a
                  href={t.companyLink}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.company}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 + 0.3 }}
              viewport={{ once: true }}
            >
              <div
                className={`text-3xl md:text-5xl font-bold mb-2 ${
                  stat.accent ? "text-blue-400" : "text-white"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-base text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
