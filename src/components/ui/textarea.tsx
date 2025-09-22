import * as React from "react";
import {cn} from "@/lib/utils";

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
    value: string;
    setValue: (value: string) => void;
    error?: string;
}

const Textarea: React.FC<TextareaProps> = ({className, error, value, setValue, ...props}) => {
    return (
        <div className="w-full">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={cn(
                    "flex min-h-[80px] w-full rounded-md text-black border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
};

export default Textarea;
