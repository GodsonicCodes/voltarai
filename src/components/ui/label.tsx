import * as React from "react";
import {cn} from "@/lib/utils";

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({className, ...props}) => {
    return <label className={cn("text-sm text-desc font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
};

export default Label;
