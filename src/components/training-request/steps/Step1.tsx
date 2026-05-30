"use client";

import { useState } from "react";
import { Input as FormInput } from "@/components/ui/FormInput";
import { Select as FormSelect } from "@/components/ui/FormSelect";
import { Button as FormButton } from "@/components/ui/FormButton";
import { TrainingRequestFormData, StepProps } from "../types";

export default function Step1({ formData, updateFormData, onNext }: StepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof TrainingRequestFormData, string>>
  >({});

  const handleNext = () => {
    const newErrors: Partial<Record<keyof TrainingRequestFormData, string>> =
      {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.traineeType)
      newErrors.traineeType = "Please select trainee type";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-500 text-sm">
          Tell us about yourself or your team
        </p>
      </div>

      <FormInput
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) => updateFormData({ fullName: e.target.value })}
        error={errors.fullName}
        required
      />

      <FormInput
        label="Email Address (business email preferred)"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        error={errors.email}
        required
      />

      <FormSelect
        label="Trainee Type"
        value={formData.traineeType}
        onChange={(e) =>
          updateFormData({ traineeType: e.target.value as string })
        }
        options={[
          { value: "Individual", label: "Individual (Just me)" },
          { value: "Company Team", label: "Company Team (Multiple people)" },
        ]}
        error={errors.traineeType}
        required
      />

      {/* Only show Company Name if it's a Company Team */}
      {formData.traineeType === "Company Team" && (
        <FormInput
          label="Company/Organization Name"
          placeholder="Enter company name"
          value={formData.companyName}
          onChange={(e) => updateFormData({ companyName: e.target.value })}
          required
        />
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <div className="w-[140px] shrink-0">
            <FormSelect
              value={formData.countryCode}
              onChange={(e) => updateFormData({ countryCode: e.target.value })}
              options={[
                { value: "+1", label: "US +1" },
                { value: "+44", label: "UK +44" },
                { value: "+91", label: "IN +91" },
                { value: "+233", label: "GH +233" },
                { value: "+234", label: "NG +234" },
              ]}
            />
          </div>
          <div className="flex-1">
            <FormInput
              placeholder="Phone number"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              error={errors.phoneNumber}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <FormButton onClick={handleNext}>Next</FormButton>
      </div>
    </div>
  );
}
