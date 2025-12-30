"use client";

import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AiButton: React.FC<GlassButtonProps> = ({ children, className = "", ...props }) => { 
  return (
    <button
      className={`
        px-5 py-2.5 rounded-[100px]
        text-center capitalize
        text-sm font-medium
        whitespace-nowrap select-none
        md:px-8 md:py-4 md:text-base
        lg:px-10 lg:py-5 lg:text-lg
        hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-95
        transition-all duration-300 ease-out
        leading-[125%]
        tracking-[0%]
        border
        w-fit
        text-white
        flex self-center
        ${className}
      `}
      style={{
        background: "linear-gradient(176.01deg, rgba(255, 255, 255, 0) 2.66%, rgba(255, 255, 255, 0.06) 80.33%)",
        border: "1px solid #FFFFFF33",
        backdropFilter: "blur(74px)",
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default AiButton; 