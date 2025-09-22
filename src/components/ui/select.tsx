import * as React from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "@/lib/utils";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
    value: string;
    setValue: (value: string) => void;
    error?: string;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({className, children, error, placeholder, value, setValue, ...props}) => {
    return (
        <div className="w-full">
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={cn(
                        "flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {children}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
};

export default Select;
