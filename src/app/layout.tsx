import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/custom/footer";
import UserTracker from "@/components/UserTracker";
import React from "react";

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";

// Local font
const author = localFont({
  src: [
    { 
      path: "../fonts/author/Author-Extralight.woff2",
      weight: "200",
      style: "normal"
    },
    { 
      path: "../fonts/author/Author-ExtralightItalic.woff2",
      weight: "200",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Light.woff2",
      weight: "300",
      style: "normal"
    },
    { 
      path: "../fonts/author/Author-LightItalic.woff2",
      weight: "300",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Regular.woff2",
      weight: "400", 
      style: "normal" 
    },
    { 
      path: "../fonts/author/Author-Italic.woff2",
      weight: "400",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    { 
      path: "../fonts/author/Author-MediumItalic.woff2",
      weight: "500",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Semibold.woff2",
      weight: "600",
      style: "normal"
    },
    { 
      path: "../fonts/author/Author-SemiboldItalic.woff2",
      weight: "600",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    { 
      path: "../fonts/author/Author-BoldItalic.woff2",
      weight: "700",
      style: "italic"
    },
    { 
      path: "../fonts/author/Author-Variable.woff2",
      weight: "200 700",
      style: "normal" 
    },
    { 
      path: "../fonts/author/Author-VariableItalic.woff2",
      weight: "200 700", 
      style: "italic" 
    },
  ],
  variable: "--font-author",
  display: "swap",
});

// Geist fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Metadata
export const metadata: Metadata = {
  title: "Voltar AI",
  description: "Save Time. Cut Costs. Scale Revenue. On Autopilot",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/assets/icons/VoltarAi_logo_black.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/assets/icons/VoltarAi_logo_white.ico",
      },
    ],
  },
  openGraph: {
    title: "Voltar AI",
    description: "Save Time. Cut Costs. Scale Revenue. On Autopilot",
    url: "https://voltar.ai/",
    siteName: "Voltar AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/og-images/Voltar_Ai_logo_white_on_black(1200x630).png",
        width: 1200,
        height: 630,
        alt: "Voltar AI Logo + Tagline",
      },
      {
        url: "/assets/og-images/Voltar_Ai_logo_white(600x315).png",
        width: 600,
        height: 315,
        alt: "Voltar AI Logo + Tagline - Small Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voltar AI",
    description: "Save Time. Cut Costs. Scale Revenue. On Autopilot",
    images: [
      {
        url: "/assets/og-images/Voltar_Ai_logo_white_on_black(1200x630).png",
        width: 1200,
        height: 630,
        alt: "Voltar AI Logo + Tagline",
      },
    ],
  },
};

// Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={author.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <UserTracker />
        {children}
        <Footer />
      </body>
    </html>
  );
}
