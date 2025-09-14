"use client";

import { motion } from "motion/react";
import { Settings, Users, BarChart3, Target } from "lucide-react";

/**
 * OurServicesSection - Displays the four main AI service offerings
 * Each service card explains a specific AI capability with icon and description
 * Uses staggered animations to create visual interest as users scroll
 */
export default function OurServicesSection() {
  // Core AI services offered by the company
  // Each service targets a specific business function with clear value proposition
  const services = [
    {
      icon: Settings,
      title: "AI Workflow Automation",
      description:
        "Automate repetitive tasks, optimize processes, and free up your team for strategic initiatives.",
    },
    {
      icon: Users,
      title: "AI Customer Service Agents",
      description:
        "Provide instant, personalized support 24/7, resolve queries efficiently, and enhance customer satisfaction.",
    },
    {
      icon: BarChart3,
      title: "AI Sales Assistants",
      description:
        "Qualify leads, schedule appointments, and nurture prospects, boosting your sales pipeline.",
    },
    {
      icon: Target,
      title: "AI Data Analysts",
      description:
        "Extract insights from complex data, identify trends, and make data-driven decisions with confidence.",
    },
  ];

  return (
    <section className="py-20 bg-bgBlack px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header with animated title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Services
          </h2>
        </motion.div>

        {/* Services grid with staggered animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center hover:bg-blue-500/20 transition-colors duration-300"
            >
              {/* Service icon with blue accent background */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
                <service.icon className="w-8 h-8 text-blue-400" />
              </div>
              {/* Service title */}
              <h3 className="text-xl font-semibold text-white mb-4">
                {service.title}
              </h3>
              {/* Service description explaining the value proposition */}
              <p className="text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
