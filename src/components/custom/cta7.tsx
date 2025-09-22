"use client";
import { motion } from "motion/react";
import ButtonEffect from "../ui/ButtonEffect";
import { ArrowUpRight } from "lucide-react";

const CTA7 = () => {
  return (
    <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-4xl font-[494] mb-6 textradialgradientgrey">
          Ready to <span className="textradialgradientblue">Hire</span> your first AI employee
        </h2>

        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 mb-8">
          Book your strategy call. Discover which roles AI can replace fast.
        </p>

        <div className="flex justify-center">
          <ButtonEffect>
            <span>Schedule Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
          </ButtonEffect>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA7;
