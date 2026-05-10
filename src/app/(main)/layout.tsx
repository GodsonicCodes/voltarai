import React from "react";
import Footer from "@/components/custom/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
