import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-gray-900">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-hidden focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
