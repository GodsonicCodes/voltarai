"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Balloon from "./ui-custom/numberBalloon";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemType {
  id: number;
  item: string;
  content: string;
}

const AccordionList: AccordionItemType[] = [
  {
    id: 1,
    item: "How fast does one get ROI?",
    content:
      "Most Clients break even within 30 days through eliminated salary costs alone",
  },
  {
    id: 2,
    item: "What if it breaks?",
    content:
      "We provide full support and replacements if needed, ensuring minimal downtime.",
  },
  {
    id: 3,
    item: "Is my data safe?",
    content:
      "Enterprise-grade security. Bank-level encryption. Your data never leaves your control",
  },
  {
    id: 4,
    item: "Cost vs hiring humans?",
    content:
      "Our solution is significantly cheaper long-term compared to hiring full-time staff.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:max-w-[70%] lg:mx-auto bg-bgBlack px-2 sm:px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-[494] mb-10 textradialgradientgrey">
          Frequently <span className="textradialgradientblue">Asked</span> Questions
        </h2>

        <div className="w-full mx-auto flex justify-center"> {/* Centering the Accordion Container */}
          <Accordion
            type="single"
            collapsible
            className="w-full min-w-[300px] max-w-3xl lg:min-w-3xl"
          >
            {AccordionList.map((listItem) => (
              <AccordionItem
                value={`item_${listItem.id}`}
                key={listItem.id}
                className="w-full"
              >
                <AccordionTrigger className="px-5 flex items-center font-medium text-base md:text-lg text-white hover:no-underline">
                  <span className="flex items-center gap-4">
                    <Balloon value={listItem.id} /> {listItem.item}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="ml-9 flex flex-col gap-3 text-left text-sm md:text-base text-white/70 overflow-hidden">
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {listItem.content}
                    </motion.div>
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
