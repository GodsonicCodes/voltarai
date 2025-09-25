"use client";
import Link from "next/link";
import EmailInput from "./emailInput";
import {motion} from "framer-motion";

import desktopLogo from "@/../public/assets/logo/logodesktop.svg";
import mobileLogo from "@/../public/assets/logo/logomobile.svg";
import Image from "next/image";

interface urlProps {
    name: string;
    url: string;
}
interface FooterProps {
    id: number;
    header: string;
    url: urlProps[];
    footer?: {
        name: string;
        url: string;
    };
}

const footerItems: FooterProps[] = [
    {
        id: 1,
        header: "Company",
        url: [
            {name: "About Us", url: "#"},
            {name: "Solutions", url: "#"},
            {name: "Why Choose Us", url: "#"},
            {name: "Pricing", url: "#"},
        ],
        footer: {name: "Terms & Conditions", url: "#"},
    },
    {
        id: 2,
        header: "Solutions",
        url: [
            {name: "Smart Automation", url: "#"},
            {name: "Analytics Agent", url: "#"},
            {name: "Customer Agent", url: "#"},
            {name: "AI Data Processors", url: "#"},
        ],
        footer: {name: "Privacy Policy", url: "#"},
    },
    {
        id: 3,
        header: "Follow",
        url: [
            {name: "LinkedIn", url: "#"},
            {name: "Youtube", url: "#"},
            {name: "Instagram", url: "#"},
        ],
    },
];

const FooterContent = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className="w-full grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 mx-auto max-w-screen-xl"
        >
            {/* Left column (brand + about + signup) */}
            <motion.div
                initial={{opacity: 0, y: 12}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-100px"}}
                transition={{duration: 0.4, ease: "easeOut"}}
                className="flex flex-col gap-6 lg:gap-6 lg:col-span-2"
            >
                {/* Brand logo with white dot and Voltar.ai text */}
                <div className="flex items-center space-x-3">
                    <Image src={desktopLogo} alt="Voltar.ai Logo" className="hidden sm:block h-8 w-auto" />
                    <Image src={mobileLogo} alt="Voltar.ai Logo" className="sm:hidden h-8 w-auto" />
                </div>

                <p className="text-sm md:text-base text-white">
                    Voltar AI is your intelligent partner for automation, analysis and decision making. We scale businesses 10x faster with AI that never sleeps.
                </p>

                {/* Mobile: Links section */}
                <div className="lg:hidden flex flex-col gap-8">
                    {footerItems.map((footer) => (
                        <div key={footer.id} className="flex flex-col gap-3">
                            <p className="text-blue-700 text-sm md:text-base font-medium">{footer.header}</p>
                            <div className="flex flex-col gap-2">
                                {footer.url.map((url, index) => (
                                    <Link key={index} href={url.url} className="text-white text-sm md:text-base transition-colors duration-200 hover:text-blue-300">
                                        {url.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: Legal links at the bottom */}
                <div className="lg:hidden flex justify-between w-full text-white text-sm md:text-base">
                    <Link href="#" className="underline transition-colors duration-200 hover:text-blue-300">
                        Terms &amp; Conditions
                    </Link>
                    <Link href="#" className="underline transition-colors duration-200 hover:text-blue-300">
                        Privacy Policy
                    </Link>
                </div>

                {/* Email signup - Now at the bottom for mobile */}
                <div className="flex flex-col gap-3 items-start w-full">
                    <p className="text-white text-sm md:text-base font-medium">Join our mailing list</p>
                    <div className="w-full max-w-md">
                        <EmailInput />
                    </div>
                </div>
            </motion.div>

            {/* Right columns (links) - Desktop only */}
            {footerItems.map((footer) => (
                <motion.div
                    key={footer.id}
                    initial={{opacity: 0, y: 12}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-100px"}}
                    transition={{duration: 0.4, ease: "easeOut", delay: footer.id * 0.05}}
                    className="hidden lg:flex flex-col gap-6 h-full items-end w-full"
                >
                    <div className="flex flex-col gap-2">
                        <p className="text-blue-700 text-sm md:text-base font-medium">{footer.header}</p>
                        <div className="flex flex-col gap-2">
                            {footer.url.map((url, index) => (
                                <Link key={index} href={url.url} className="text-white text-sm md:text-base transition-colors duration-200 hover:text-blue-300 w-fit">
                                    {url.name}
                                </Link>
                            ))}
                        </div>
                        {footer.footer?.name && (
                            <Link href={footer.footer.url} className="text-white underline text-sm md:text-base transition-colors duration-200 hover:text-blue-300 w-fit mt-2">
                                {footer.footer.name}
                            </Link>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default FooterContent;
