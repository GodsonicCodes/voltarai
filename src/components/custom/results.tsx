"use client";
import { motion } from "framer-motion";
import Balloon from "./ui-custom/numberBalloon";

interface Weeks {
  id: number;
  week: string;
  details: string;
}

interface Results {
  id: number;
  result: string;
}

const weekImpact: Weeks[] = [
  { id: 1, week: "1", details: "AI deployed and handling basic tasks" },
  { id: 2, week: "2", details: "Processing leads and customer inquiries" },
  { id: 3, week: "3", details: "Full automation running 24/7" },
];

const typicalResults: Results[] = [
  { id: 1, result: "Replaces 2-3 full-time positions" },
  { id: 2, result: "Save $120K - 300K annually" },
  { id: 3, result: "Capture 3x more opportunities" },
  { id: 4, result: "Scale without hiring stress" },
];

const Results = () => {
  return (
    <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto"
      >
        <h2 className="text-2xl md:text-4xl font-[494] mb-12 text-center textradialgradientgrey">
          Real <span className="textradialgradientblue">Impact,</span> Real Fast
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start justify-items-center">
          {/* Weeks Impact */}
          <div className="flex flex-col gap-6 md:gap-8 items-center">
            {weekImpact.map((week) => (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: week.id * 0.05 }}
                className="flex flex-col w-full max-w-2xl"
              >
                <p className="text-white text-lg md:text-xl lg:text-2xl font-medium text-left">Week {week.week}:</p>
                <p className="text-white/70 text-base md:text-lg lg:text-xl text-left">{week.details}</p>
              </motion.div>
            ))}
          </div>

          {/* Typical Results */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 items-center">
            <p className="text-center text-2xl md:text-4xl font-[494] textradialgradientgrey">
              Typical Results
            </p>
            <div className="flex flex-col gap-6 md:gap-8 w-full max-w-2xl">
              {typicalResults.map((results) => (
                <motion.span
                  key={results.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: results.id * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <Balloon value={results.id} />
                  <p className="text-white text-base md:text-lg lg:text-xl text-left">{results.result}</p>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
export default Results;
