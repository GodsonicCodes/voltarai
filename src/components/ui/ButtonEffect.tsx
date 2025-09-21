import React from "react";

interface ButtonEffectProps {
  children: React.ReactNode;
}

const ButtonEffect: React.FC<ButtonEffectProps> = ({ children }) => {
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center gap-2 rounded-full border border-white/20 
                 bg-gradient-to-t from-neutral-900 via-black to-neutral-900
                 px-6 py-3 text-sm font-medium text-white
                 shadow-lg backdrop-blur-sm transition
                 focus:outline-none"
      >
        {/* Decorative top-right arc */}
        <span
          className="pointer-events-none absolute -top-[6px] -right-[6px] 
                   h-7 w-7 rounded-tr-full border-t-1 border-r-1 border-white/30 "
        ></span>
        {children}
      </button>
    </div>
  );
};

export default ButtonEffect;
