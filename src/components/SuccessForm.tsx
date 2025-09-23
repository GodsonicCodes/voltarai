"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/useClickOutside";

interface SuccessFormProps {
  title?: string;
  message?: string;
  onClose: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const SuccessForm: React.FC<SuccessFormProps> = ({
  title = "Request submitted",
  message = "Thanks, we have received your request. Our team will contact you within 24-48 hours",
  onClose,
  primaryAction
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Close form when clicking outside
  useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
    onClose();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-[black]/50 flex items-end md:items-center justify-center md:justify-end p-4 md:px-0 z-[9999]"
    >
      <motion.div
        initial={{
          x: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : "100%",
          y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
          opacity: 0,
        }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={{
          x: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : "100%",
          y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25,
          opacity: { duration: 0.4 },
        }}
        className="bg-white max-w-xl w-full min-h-[90vh] max-h-[100vh] overflow-y-auto shadow-2xl rounded-lg"
        ref={parentRef}
      >
        <div className="p-6">
          {/* Header with Close Button Only */}
          <div className="flex justify-end items-start mb-6">
            <button
              className="text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors"
              type="button"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Success Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: [ -180, 360, 375, 370, 365, 360 ],
            }}
            transition={{
              delay: 0.2,
              duration: 2,
              type: "spring",
              stiffness: 120,
              damping: 20,
              rotate: {
                times: [0, 0.3, 0.6, 0.8, 0.95, 1],
                duration: 2,
                ease: "easeOut"
              }
            }}
            className="mb-8 flex justify-center"
          >
            <img
              src="/assets/done_all.svg"
              alt="Success"
              className="w-24 h-24 text-green-500"
            />
          </motion.div>

          {/* Title beneath the icon */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl text-gray-800 mb-4 text-center"
          >
            {title}
          </motion.h2>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              {message}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col gap-4 w-full max-w-sm mx-auto"
          >
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md font-medium transition-colors"
              >
                {primaryAction.label}
              </Button>
            )}
            <Button
              onClick={onClose}
              className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md font-medium transition-colors"
            >
              Done
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessForm;
