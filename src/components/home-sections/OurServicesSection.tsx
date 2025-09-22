"use client";

import { motion } from "motion/react";
import Image from "next/image";

import workflowImg from "@/../public/assets/OurServices/workflow.svg";
import customerImg from "@/../public/assets/OurServices/Customer.svg";
import salesImg from "@/../public/assets/OurServices/Sales.svg";
import dataImg from "@/../public/assets/OurServices/Data.svg";

const services = [
  {
    image: workflowImg,
    title: "AI-Workflow Automation",
    description:
      "Connect all your tools with intelligent automation. Client example: Order-to-fulfillment happens without human touch.",
  },
  {
    image: customerImg,
    title: "AI- Customer Service Agents",
    description:
      "Handle inquiries, resolve issues, book appointments instantly. Client example: Processes 500+ support tickets daily with 97% satisfaction.",
  },
  {
    image: salesImg,
    title: "AI Sales Assistants",
    description:
      "Qualify leads, follow up, schedule demos automatically. Client example: Books 80+ qualified sales calls monthly without human input.",
  },
  {
    image: dataImg,
    title: "AI Data Processers",
    description:
      "Automate data entry, document processing, reporting. Client example: Processes invoices in 30 seconds vs 30 minutes manually.",
  },
];

export default function OurServicesSection() {
  return (
    <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-[494] textradialgradientgrey mb-8">
            Our <span className="textradialgradientblue">Services</span>
          </h2>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
              }}
              viewport={{ once: true }}
              className="relative rounded-[20px] flex flex-col items-center text-center shadow-lg w-full mx-auto hover:scale-[1.04] transition-transform duration-300"
              style={{
                minHeight: "320px",
                maxWidth: "280px",
              }}
            >
              {/* Radial gradient background */}
              <motion.div
                className="absolute inset-0 rounded-[20px] z-0"
                initial={{ opacity: 0.7 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, #183b7a 0%, #0a1747 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pt-10 pb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={70}
                    height={70}
                    className="mb-6 object-contain"
                    priority
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
                  viewport={{ once: true }}
                  className="text-base md:text-lg font-[494] text-white mb-3"
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.15 }}
                  viewport={{ once: true }}
                  className="text-gray-300 text-xs md:text-sm leading-relaxed"
                >
                  {service.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
