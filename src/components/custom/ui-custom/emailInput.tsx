"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const EmailInput = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[380px]">
      {/* Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your Email"
        aria-label="Email address"
        className="bglineargradient text-[#E5E5E7]/80 border border-white/20 placeholder:text-[#E5E5E7]/60
                   font-normal px-4 pr-10 md:pr-12 text-xs md:text-base
                   rounded-[56px] w-full h-[40px] md:h-[52px]
                   cursor-text caret-[#E5E5E7]/80 outline-none
                   focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
      />

      {/* Button */}
      <button
        type="submit"
        className="absolute right-1 lg:right-2 top-1/2 -translate-y-1/2
                   bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200 text-white
                   w-8 h-8 md:w-10 md:h-10
                   flex items-center justify-center
                   rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 group"
      >
        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-[1px]" />
      </button>
    </div>
  );
};

export default EmailInput;
