import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/custom/footer";

import {Geist} from "next/font/google";
import {Geist_Mono} from "next/font/google";

// Local font
const author = localFont({
    src: [
        {
            path: "../fonts/author/Author-Extralight.woff2",
            weight: "200",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-ExtralightItalic.woff2",
            weight: "200",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-LightItalic.woff2",
            weight: "300",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-Italic.woff2",
            weight: "400",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-MediumItalic.woff2",
            weight: "500",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-SemiboldItalic.woff2",
            weight: "600",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-BoldItalic.woff2",
            weight: "700",
            style: "italic",
        },
        {
            path: "../fonts/author/Author-Variable.woff2",
            weight: "200 700",
            style: "normal",
        },
        {
            path: "../fonts/author/Author-VariableItalic.woff2",
            weight: "200 700",
            style: "italic",
        },
    ],
    variable: "--font-author",
    display: "swap",
});

// Geist fonts
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Metadata for the page
export const metadata: Metadata = {
    title: "voltarai",
    description: "AI automation at your doorstep",
};

// Root layout component
export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" className={author.variable}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}
