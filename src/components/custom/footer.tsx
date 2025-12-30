"use client";
import React from "react";
import footerArt from "../../../public/assets/footer_art.png";
import Image from "next/image";
import FooterContent from "./ui-custom/footerContent";
import useScreenSize from "@/hooks/useScreenSize";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const date = new Date().getFullYear();
  const {isMobile, isDesktop} = useScreenSize();

    const pathname = usePathname();

    if (pathname === "/voice-assistant" || pathname === "/chatbot") return null;
  // Mobile footer
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col pt-16 relative h-full bg-black gap-8 px-4 mb-[55px]"
      >
        <div className="max-w-7xl mx-auto w-full">
          <FooterContent />
        </div>

        <div className="footer flex items-end justify-between w-full h-fit gap-2 flex-nowrap">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <Image
                key={i}
                src={footerArt}
                alt="footer art work"
                width={150}
                height={50}
                className={`${i === 0 ? "order-1" : "order-3 mirror scale-x-[-1]"} select-none shrink-0`}
              />
            ))}
          <p className="order-2 self-end text-white/80 text-sm md:text-base leading-none whitespace-nowrap shrink-0">
            &copy; {date} Voltar AI
          </p>
        </div>
      </motion.div>
    );
  }

  // Desktop footer
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col pt-20 relative h-full bg-black gap-12 px-2"
    >
      <div className="mx-auto h-full flex items-center justify-center w-full">
        <div className="max-w-7xl mx-auto w-full px-4">
          <FooterContent />
        </div>
      </div>
      <div className="footer flex items-end justify-between w-full h-fit mb-6 gap-4">
        {Array(2)
          .fill(null)
          .map((_, i) => (
            <Image
              key={i}
              src={footerArt}
              alt="footer art work"
              width={220}
              height={61}
              className={`${i === 0 ? "order-1" : "order-3 mirror scale-x-[-1]"} select-none`}
            />
          ))}
        <p className="order-2 self-end text-white/80 text-sm md:text-base leading-none">
          &copy; {date} Voltar AI
        </p>
      </div>
    </motion.div>
  );
};

export default Footer;
