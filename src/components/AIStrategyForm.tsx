"use client";

import React, {useState, useRef} from "react";
import {X} from "lucide-react";
import {motion} from "motion/react";
import {aiStrategyFormSchema, type AIStrategyFormData} from "@/schema/ai-strategy.schema";
import {createAIStrategy} from "@/actions/ai-strategy.api";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import Success from "./ui/success";

const AIStrategyForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: "success" | "error"; text: string} | null>(null);
    const [showSuccessForm, setShowSuccessForm] = useState(false);
    const [formData, setFormData] = useState<AIStrategyFormData>({
        companyName: "",
        businessEmail: "",
        industryType: "",
        businessChallenge: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AIStrategyFormData, string>>>({});
    const parentRef = useRef<HTMLDivElement>(null);

    // Close form when clicking outside
    useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
        if (onClose) onClose();
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);

        // Validate using Joi schema
        const {error, value} = aiStrategyFormSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof AIStrategyFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof AIStrategyFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createAIStrategy(value);

            if (result.success) {
                setShowSuccessForm(true);

                // Reset form on success
                setFormData({
                    companyName: "",
                    businessEmail: "",
                    industryType: "",
                    businessChallenge: "",
                });
            } else {
                setSubmitMessage({
                    type: "error",
                    text: result.message || "Failed to submit the form. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitMessage({
                type: "error",
                text: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof AIStrategyFormData, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: undefined}));
        }
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4}}
            className="fixed inset-0 bg-[black]/50 flex items-end md:items-center justify-center md:justify-end p-4 md:px-0 z-[9999]"
        >
            <motion.div
                initial={{
                    x: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : "100%",
                    y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
                    opacity: 0,
                }}
                animate={{x: 0, y: 0, opacity: 1}}
                exit={{
                    x: typeof window !== "undefined" && window.innerWidth < 768 ? 0 : "100%",
                    y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
                    opacity: 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    opacity: {duration: 0.4},
                }}
                className="bg-white max-w-xl w-full min-h-[90vh] max-h-[100vh] overflow-y-auto shadow-2xl rounded-lg"
            >
                <div className="p-6" ref={parentRef}>
                    {showSuccessForm ? (
                        <Success onClose={onClose} />
                    ) : (
                        // Form Content - Same Container
                        <div className="p-6" ref={parentRef}>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Get Your Free AI Strategy</h2>
                                    <div className="mt-3">
                                        {/* Desktop styling */}
                                        <p className="hidden md:block text-base font-[375] font-['Author'] leading-[122%] tracking-[0%] align-middle text-[#1E1E1E]">
                                            Free Consultation, no obligations and a 24-hour delivery
                                        </p>
                                        {/* Mobile styling */}
                                        <p className="md:hidden text-sm font-[375] font-['Author'] leading-[125%] tracking-[0%] align-middle text-[#000000B2]">
                                            Free Consultation, no obligations and a 24-hour delivery
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 hover:text-gray-600"
                                    type="button"
                                    onClick={() => {
                                        console.log("clicked");
                                        if (onClose) onClose();
                                    }}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Submit Message */}
                            {submitMessage && (
                                <div
                                    className={`mb-4 p-3 rounded-md ${
                                        submitMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                >
                                    {submitMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Company Name */}
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <Input
                                        id="companyName"
                                        placeholder="John Doe Hospital"
                                        value={formData.companyName}
                                        setValue={(value) => updateField("companyName", value)}
                                        error={errors.companyName}
                                    />
                                </div>

                                {/* Business Email */}
                                <div>
                                    <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Email
                                    </label>
                                    <Input
                                        id="businessEmail"
                                        type="email"
                                        placeholder="johndoe@gmail.com"
                                        value={formData.businessEmail}
                                        setValue={(value) => updateField("businessEmail", value)}
                                        error={errors.businessEmail}
                                    />
                                </div>

                                {/* Industry/Business Type */}
                                <div>
                                    <label htmlFor="industryType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Industry/Business Type
                                    </label>
                                    <Select
                                        value={formData.industryType}
                                        setValue={(value) => updateField("industryType", value)}
                                        placeholder="Select your industry"
                                        error={errors.industryType}
                                    >
                                        <option value="ecommerce">Ecommerce</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="service">Service</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="finance">Finance</option>
                                        <option value="technology">Technology</option>
                                        <option value="media">Media</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="other">Other</option>
                                    </Select>
                                </div>

                                {/* Primary Business Challenge */}
                                <div>
                                    <label htmlFor="businessChallenge" className="block text-sm font-medium text-gray-700 mb-2">
                                        Primary Business Challenge
                                    </label>
                                    <Select
                                        value={formData.businessChallenge}
                                        setValue={(value) => updateField("businessChallenge", value)}
                                        placeholder="Select your primary challenge"
                                        error={errors.businessChallenge}
                                    >
                                        <option value="operational_inefficiencies">Operational Inefficiencies</option>
                                        <option value="high_operational_costs">High Operational Costs</option>
                                        <option value="slow_customer_service">Slow Customer Service</option>
                                        <option value="data_management_issues">Data Management Issues</option>
                                        <option value="lack_automation">Lack of Automation</option>
                                        <option value="scaling_challenges">Scaling Challenges</option>
                                        <option value="manual_processes">Too Many Manual Processes</option>
                                        <option value="other">Other Challenge</option>
                                    </Select>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? "Submitting..." : "Request Strategy"}
                                    </Button>
                                </div>

                                {/* Additional Info */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        ✓ Free consultation with no obligations
                                        <br />
                                        ✓ Custom AI strategy delivered in 24 hours
                                        <br />✓ No credit card required
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIStrategyForm;
