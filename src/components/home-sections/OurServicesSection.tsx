"use client";

import { motion } from "motion/react";
import Image from "next/image";

import workflowImg from "@/../public/assets/OurServices/workflow.svg";
import customerImg from "@/../public/assets/OurServices/Customer.svg";
import salesImg from "@/../public/assets/OurServices/Sales.svg";
import dataImg from "@/../public/assets/OurServices/Data.svg";

import hoverworkflowImg from "@/../public/assets/OurServices/hoverworkflow.svg";
import hovercustomerImg from "@/../public/assets/OurServices/hoveragents.svg";
import hoversalesImg from "@/../public/assets/OurServices/hoversales.svg";
import hoverdataImg from "@/../public/assets/OurServices/hoverprocessors.svg";

const services = [
  {
    image: workflowImg,
    hoverImage: hoverworkflowImg,
    title: "AI-Workflow Automation",
    description:
      "Connect all your tools with intelligent automation. Client example: Order-to-fulfillment happens without human touch.",
  },
  {
    image: customerImg,
    hoverImage: hovercustomerImg,
    title: "AI- Customer Service Agents",
    description:
      "Handle inquiries, resolve issues, book appointments instantly. Client example: Processes 500+ support tickets daily with 97% satisfaction.",
  },
  {
    image: salesImg,
    hoverImage: hoversalesImg,
    title: "AI Sales Assistants",
    description:
      "Qualify leads, follow up, schedule demos automatically. Client example: Books 80+ qualified sales calls monthly without human input.",
  },
  {
    image: dataImg,
    hoverImage: hoverdataImg,
    title: "AI Data Processers",
    description:
      "Automate data entry, document processing, reporting. Client example: Processes invoices in 30 seconds vs 30 minutes manually.",
  },
];

export default function OurServicesSection() {
  return (
    <section id="our-services" className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4">
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
              className="group relative rounded-[20px] flex flex-col items-center text-center shadow-lg w-full mx-auto hover:scale-[1.04] transition-transform duration-300"
              style={{
                minHeight: "320px",
                maxWidth: "280px",
              }}
            >
              {/* Radial gradient background */}
              <motion.div
                className="absolute inset-0 rounded-lg z-0 bg-bgBlack group-hover:bg-[radial-gradient(circle_at_50%_40%,#183b7a_0%,#0a1747_100%)] transition-colors duration-300"
                initial={{ opacity: 0.7 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
              <div className="relative z-10 border border-white/20 rounded-lg flex flex-col items-center justify-center h-full px-4 pt-10 pb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Normal + Hover image swap */}
                  <div className="relative w-[70px] h-[70px] mb-6">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                      priority
                    />
                    <Image
                      src={service.hoverImage}
                      alt={`${service.title} hover`}
                      fill
                      className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      priority
                    />
                  </div>
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
