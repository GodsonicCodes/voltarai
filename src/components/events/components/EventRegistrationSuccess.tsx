import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface EventRegistrationSuccessProps {
    onClose: () => void;
}

const EventRegistrationSuccess: React.FC<EventRegistrationSuccessProps> = ({ onClose }) => {
    return (
        <div className="relative w-full h-full flex flex-col justify-start max-w-md mx-auto">
            {/* Close Button - Absolute positioned at top right */}
            <button className="absolute top-0 right-0 text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors" type="button" onClick={onClose}>
                <X className="h-6 w-6" />
            </button>

            {/* Success Icon with Animation */}
            <div className="flex-1 flex flex-col items-center justify-center justify-self-center">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                    scale: 1,
                    rotate: [-180, 360, 375, 370, 365, 360],
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
                        ease: "easeOut",
                    },
                }}
                className="mb-8 flex justify-center "
            >
                <Image src="/assets/done_all.svg" alt="Success" className="w-24 h-24" width={96} height={96} />
            </motion.div>

            {/* Title beneath the icon */}
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-2xl text-gray-800 mb-4 text-center">
                Registration Complete
            </motion.h2>

            {/* Message */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center mb-12">
                <p className="text-gray-600 leading-relaxed">Thanks for registering for the event. We will send you a personalized QR Code and registration number via your email</p>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="flex flex-col gap-4 w-full">
                <Button
                    onClick={() => {
                        if (onClose) onClose();
                    }}
                    className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md font-medium transition-colors"
                >
                    Done
                </Button>
            </motion.div>
            </div>
        </div>
    );
};

export default EventRegistrationSuccess;
