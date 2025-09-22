import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const EmailInput = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="relative w-full lg:max-w-[452px]">
      {/* Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your Email"
        className="bglineargradient text-[#E5E5E7]/60 border border-white/20 placeholder:text-[#E5E5E7]/60
                   font-normal px-6 pr-16 text-base md:text-xl
                   rounded-[64px] w-full h-[54px] md:h-[64px]
                   cursor-text caret-[#E5E5E7]/60"
      />

      {/* Button */}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2
                   bg-blue-700 hover:bg-blue-800 transition duration-200 ease-in text-white
                   w-8 h-8 md:w-12.5 md:h-12.5
                   flex items-center justify-center
                   rounded-full shadow-md"
      >
        <ArrowUpRight />
      </button>
    </div>
  );
};

export default EmailInput;
