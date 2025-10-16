"use client";
import { motion } from "motion/react";
import ButtonEffect from "../ui/ButtonEffect";
import { ArrowUpRight } from "lucide-react";

type CalendlyWidget = {
  initPopupWidget: (opts: { url: string }) => void;
  closePopupWidget?: () => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyWidget;
  }
}

const CTA6 = () => {
  const openCalendly = () => {
    const url = "https://calendly.com/voltar-info";
    if (typeof window === "undefined") return;

    const calendly = window.Calendly;

    const openPopup = () => {
      try {
        window.Calendly?.initPopupWidget({ url });
      } catch (e) {
        // no-op: if Calendly isn't available, we'll ensure script loads below
      }
    };

    if (calendly && typeof calendly.initPopupWidget === "function") {
      openPopup();
      return;
    }

    // Fallback: load Calendly script on-demand, then open
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    ) as HTMLScriptElement | null;

    const ensureCss = () => {
      const cssHref = "https://assets.calendly.com/assets/external/widget.css";
      if (!document.querySelector(`link[href="${cssHref}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssHref;
        document.head.appendChild(link);
      }
    };

    const loadAndOpen = () => {
      ensureCss();
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      s.addEventListener(
        "load",
        () => {
          s.dataset.loaded = "true";
          openPopup();
        },
        { once: true }
      );
      document.body.appendChild(s);
    };

    if (!existing) {
      loadAndOpen();
    } else if (existing.dataset.loaded === "true") {
      openPopup();
    } else {
      existing.addEventListener("load", openPopup, { once: true });
    }
  };
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
          Stop Paying <span className="textradialgradientblue">Salaries</span> For Robot Work
        </h2>

        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 mb-8">
          30-minute strategy call. See exactly how AI replaces your costliest manual work.
        </p>

        <div className="flex justify-center">
          <ButtonEffect onClick={openCalendly}>
            <span>Get Our Custom AI Employee</span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
          </ButtonEffect>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA6;

