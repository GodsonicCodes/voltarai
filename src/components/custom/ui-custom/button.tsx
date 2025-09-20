import { ArrowUpRight } from "lucide-react";

const Button = ({ text }: { text: string }) => {
  return (
    <button
      className="w-fit h-fit
        flex items-center justify-center gap-[9px] lg:gap-[15px] 
        rounded-[70px] border border-white/20 
        text-zinc-200 bglineargradient hover:cursor-pointer
        mx-[115px] pl-[17px] pr-[14px] py-[10px] text-[10.5px] font-normal
        whitespace-nowrap
        lg:w-[426px] lg:h-[96px] lg:text-2xl lg:font-medium lg:py-[20px]
      "
    >
      {text} <ArrowUpRight />
    </button>
  );
};

export default Button;
