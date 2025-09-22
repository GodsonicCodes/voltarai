import { ArrowUpRight } from "lucide-react";

const Button = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <button
      className={`
        group relative overflow-hidden
        flex items-center justify-center gap-3
        rounded-full border border-white/20 
        text-white bglineargradient
        px-5 py-2.5 text-sm font-medium
        whitespace-nowrap select-none
        md:px-8 md:py-4 md:text-base
        lg:px-10 lg:py-5 lg:text-lg
        hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-95
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      <span className="relative z-10">{text}</span>
      <span className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-45">
        <ArrowUpRight size={20} />
      </span>

      {/* Hover effect background */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default Button;
