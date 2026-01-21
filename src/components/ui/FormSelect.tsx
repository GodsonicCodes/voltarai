import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-gray-900">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-black focus:outline-hidden focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            // Use a slight hack to make the placeholder look like placeholder
                            props.value === "" ? "text-gray-400" : "text-gray-900",
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled hidden>
                            {placeholder || "Select an option"}
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-gray-900">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };
