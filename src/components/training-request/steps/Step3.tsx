"use client";

import { useState } from "react";
import { Select as FormSelect } from "@/components/ui/FormSelect";
import { Button as FormButton } from "@/components/ui/FormButton";
import { TrainingRequestFormData, StepProps } from "../types";

export default function Step3({ formData, updateFormData, onNext, onBack }: StepProps) {
    const [errors, setErrors] = useState<Partial<Record<keyof TrainingRequestFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const newErrors: Partial<Record<keyof TrainingRequestFormData, string>> = {};

        if (!formData.goalsExpectations.trim()) {
            newErrors.goalsExpectations = "Please provide your goals and expectations";
        }
        if (!formData.preferredCommunication) {
            newErrors.preferredCommunication = "Please select preferred communication";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        // Mock API call for frontend-only testing
        setTimeout(() => {
            setIsSubmitting(false);
            onNext(); // Go to success screen
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Additional Options</h2>
                <p className="text-gray-500 text-sm">Final touches</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                    Goals and Expectations <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="e.g., We want to learn how to build internal AI agents..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.goalsExpectations ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-black/5 bg-transparent resize-y min-h-[120px]`}
                    value={formData.goalsExpectations}
                    onChange={(e) => updateFormData({ goalsExpectations: e.target.value })}
                />
                {errors.goalsExpectations && (
                    <p className="text-red-500 text-xs mt-1">{errors.goalsExpectations}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                    label="Preferred Communication Method"
                    value={formData.preferredCommunication}
                    onChange={(e) => updateFormData({ preferredCommunication: e.target.value as any })}
                    options={[
                        { value: "Email", label: "Email" },
                        { value: "Phone", label: "Phone" },
                        { value: "WhatsApp", label: "WhatsApp" },
                    ]}
                    error={errors.preferredCommunication}
                    required
                />

                <FormSelect
                    label="How did you hear about us?"
                    value={formData.howDidYouHearAboutUs}
                    onChange={(e) => updateFormData({ howDidYouHearAboutUs: e.target.value })}
                    options={[
                        { value: "LinkedIn", label: "LinkedIn" },
                        { value: "Twitter/X", label: "Twitter/X" },
                        { value: "Google Search", label: "Google Search" },
                        { value: "Referral", label: "Referral" },
                        { value: "Other", label: "Other" },
                    ]}
                />
            </div>

            <div className="pt-4 flex gap-4">
                <FormButton variant="secondary" onClick={onBack} disabled={isSubmitting}>
                    Back
                </FormButton>
                <FormButton onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                </FormButton>
            </div>
        </div>
    );
}
