import React from "react";
import {motion} from "motion/react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {X} from "lucide-react";

const Success = ({onClose}: {onClose: () => void}) => {
    return (
        <div className="p-6">
            {/* Header with Close Button Only */}
            <div className="flex justify-end items-start md:mb-6 mb-32">
                <button className="text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors" type="button" onClick={onClose}>
                    <X className="h-6 w-6" />
                </button>
            </div>
            {/* Success Icon with Animation */}
            <motion.div
                initial={{scale: 0, rotate: -180}}
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
                className="mb-8 flex justify-center"
            >
                <Image src="/assets/done_all.svg" alt="Success" className="w-24 h-24 text-green-500" width={96} height={96} />
            </motion.div>

            {/* Title beneath the icon */}
            <motion.h2 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4, duration: 0.5}} className="text-2xl text-gray-800 mb-4 text-center">
                Request submitted
            </motion.h2>

            {/* Message */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.6, duration: 0.5}} className="text-center mb-12">
                <p className="text-gray-600 leading-relaxed max-w-md mx-auto">Thanks, we have received your request. Our team will contact you within 24-48 hours</p>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.8, duration: 0.5}} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                <Button
                    onClick={() => {
                        console.log("clicked");
                        if (onClose) onClose();
                    }}
                    className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md font-medium transition-colors"
                >
                    Done
                </Button>
            </motion.div>
        </div>
    );
};

export default Success;
