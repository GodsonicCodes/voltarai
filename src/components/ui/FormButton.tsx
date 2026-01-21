import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12",
                    // Primary: Dark bg, white text
                    variant === 'primary' && "bg-[#1C1C1C] text-white hover:bg-[#2C2C2C]",
                    // Secondary: Gray bg, black text
                    variant === 'secondary' && "bg-gray-100 text-gray-900 hover:bg-gray-200",
                    // Outline: Border, transparent bg
                    variant === 'outline' && "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-900",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
