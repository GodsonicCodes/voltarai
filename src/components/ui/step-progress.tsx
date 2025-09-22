import React from "react";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";

export interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({currentStep, totalSteps, className}) => {
    return (
        <div>
            <div className={cn("flex items-center justify-center", className)}>
                {Array.from({length: totalSteps}, (_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                                    isCompleted && "bg-[#1e1e1e] border-[#1e1e1e]",
                                    isCurrent && "bg-white border-[#1e1e1e]",
                                    isUpcoming && "bg-white border-[#1e1e1e]/50"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4 text-white" />
                                ) : (
                                    <span className={cn("text-sm font-medium", isCurrent && "text-[#1e1e1e]", isUpcoming && "text-[#2C2C2C]/50")}>{stepNumber}</span>
                                )}
                            </div>

                            {/* Connector Line */}
                            {stepNumber < totalSteps && <div className={`flex-1 h-0.5 ${isCompleted ? "bg-[#1e1e1e]" : "bg-[#2C2C2C]/50"}`} />}
                        </React.Fragment>
                    );
                })}
            </div>
            <p className="text-sm font-medium mt-3">
                Step {currentStep} of {totalSteps}
            </p>
        </div>
    );
};

export default StepProgress;
