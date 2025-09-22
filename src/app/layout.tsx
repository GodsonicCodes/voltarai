// src/app/layout.tsx
import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
    title: "voltarai",
    description: "AI automation at your doorstep",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        // keep the generated class on <html> so the CSS variable --font-author is available globally
        <html lang="en" className={author.variable}>
            <body className="antialiased max-w-screen relative overflow-x-hidden">{children}</body>
        </html>
    );
}
