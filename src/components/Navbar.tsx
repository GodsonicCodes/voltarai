"use client";

import {motion} from "motion/react";
import ButtonEffect from "./ui/ButtonEffect";
import desktopLogo from "@/../public/assets/logo/logodesktop.svg";
import mobileLogo from "@/../public/assets/logo/logomobile.svg";
import Image from "next/image";

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
                {/* Brand logo*/}
                <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.6}} className="flex items-center space-x-3">
                    <Image src={desktopLogo} alt="Voltar.ai Logo" className="hidden sm:block h-8 w-auto" />
                    <Image src={mobileLogo} alt="Voltar.ai Logo" className="sm:hidden h-8 w-auto" />
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
