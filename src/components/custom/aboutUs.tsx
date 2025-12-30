"use client";
import { motion } from "motion/react";

const AboutUs = () => {
  return (
    <section id="about-us" className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="text-center space-y-6 md:space-y-8">
          <p className="textradialgradientgrey text-base md:text-lg">About Us</p>
          <h2 className="text-2xl md:text-4xl font-[494] textradialgradientgrey">
            We Build AI Employees For
            <span className="textradialgradientblue"> Growth-Stage </span>
            Companies
          </h2>
        </div>

        <div className="mt-8 md:mt-10 flex flex-col items-center">
          <p className="w-full max-w-5xl text-center text-base md:text-lg text-gray-300">
            500+ successful AI Agents built. We don’t do generic chatbots, we build AI workers
            that replace expensive human roles with intelligent automation.
          </p>
        </div>

        <div className="mt-8 md:mt-10 flex flex-col items-center space-y-3">
          <p className="text-2xl md:text-4xl font-[494] textradialgradientgrey text-center">Our Speciality</p>
          <p className="w-full max-w-4xl text-center text-base md:text-lg textradialgradientgrey">
            Turning your highest-cost manual processes into profitable AI systems
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;
