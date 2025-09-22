"use client";

import {motion} from "motion/react";
import ButtonEffect from "./ui/ButtonEffect";

/**
 * Navbar - Top navigation component for the Voltar.ai landing page
 * Features the brand logo with dot and a "Get in Touch" CTA button
 * Matches the minimalist design with subtle gradient button styling
 */

interface NavbarProps {
    onGetInTouchClick?: () => void;
    onPartnerClick?: () => void;
}

export default function Navbar({onGetInTouchClick}: NavbarProps) {
    return (
        <nav className="absolute top-0 left-0 right-0 z-10 p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Brand logo with white dot and "Voltar.ai" text */}
                <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.6}} className="flex items-center space-x-3">
                    {/* White circular dot */}
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {/* Brand name */}
                    <span className="text-white text-xl font-medium">Voltar.ai</span>
                </motion.div>

                {/* Action buttons */}
                <div className="flex items-center gap-4">
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.6, delay: 0.4}}>
                        <ButtonEffect onClick={onGetInTouchClick}>Get in Touch</ButtonEffect>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
