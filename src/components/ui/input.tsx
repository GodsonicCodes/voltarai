import * as React from "react";
import {cn} from "@/lib/utils";

// This extends the input element attributes omitting the value and onChange properties
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value: string;
    setValue: (value: string) => void;
    error?: string;
}

const Input: React.FC<InputProps> = ({className, type, error, value, setValue, ...props}) => {
    return (
        <div className="w-full">
            <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={cn(
                    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
};

export default Input;
