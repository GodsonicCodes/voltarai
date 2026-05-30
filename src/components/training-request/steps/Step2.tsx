"use client";

import { useState } from "react";
import { Select as FormSelect } from "@/components/ui/FormSelect";
import { Button as FormButton } from "@/components/ui/FormButton";
import { TrainingRequestFormData, StepProps } from "../types";

export default function Step2({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof TrainingRequestFormData, string>>
  >({});

  const handleNext = () => {
    const newErrors: Partial<Record<keyof TrainingRequestFormData, string>> =
      {};

    if (!formData.trainingFocus)
      newErrors.trainingFocus = "Please select a training focus";
    if (!formData.currentKnowledgeLevel)
      newErrors.currentKnowledgeLevel = "Please select current level";
    if (!formData.preferredFormat)
      newErrors.preferredFormat = "Please select preferred format";
    if (!formData.estimatedParticipants)
      newErrors.estimatedParticipants = "Please estimate participants";

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
          Training Details
        </h2>
        <p className="text-gray-500 text-sm">
          Help us understand your training needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Training Focus"
          value={formData.trainingFocus}
          onChange={(e) => updateFormData({ trainingFocus: e.target.value })}
          options={[
            { value: "General AI Overview", label: "General AI Overview" },
            { value: "AI Tools & Prompting", label: "AI Tools & Prompting" },
            {
              value: "AI Development & Coding",
              label: "AI Development & Coding",
            },
            {
              value: "AI for Marketing/Sales",
              label: "AI for Marketing/Sales",
            },
            {
              value: "Custom Business Use Case",
              label: "Custom Business Use Case",
            },
          ]}
          error={errors.trainingFocus}
          required
        />

        <FormSelect
          label="Current Knowledge Level"
          value={formData.currentKnowledgeLevel}
          onChange={(e) =>
            updateFormData({ currentKnowledgeLevel: e.target.value })
          }
          options={[
            { value: "Beginner", label: "Beginner (New to AI)" },
            { value: "Intermediate", label: "Intermediate (Some experience)" },
            { value: "Advanced", label: "Advanced (Looking for deep dive)" },
          ]}
          error={errors.currentKnowledgeLevel}
          required
        />

        <FormSelect
          label="Preferred Format"
          value={formData.preferredFormat}
          onChange={(e) =>
            updateFormData({
              preferredFormat: e.target.value as TrainingRequestFormData["preferredFormat"],
            })
          }
          options={[
            { value: "Online", label: "Online (Virtual)" },
            { value: "In-person", label: "In-person (On-site)" },
            { value: "Hybrid", label: "Hybrid" },
          ]}
          error={errors.preferredFormat}
          required
        />

        <FormSelect
          label="Estimated Participants"
          value={formData.estimatedParticipants}
          onChange={(e) =>
            updateFormData({ estimatedParticipants: e.target.value })
          }
          options={[
            { value: "1", label: "1 (Just me)" },
            { value: "2-5", label: "2-5 people" },
            { value: "6-15", label: "6-15 people" },
            { value: "16-50", label: "16-50 people" },
            { value: "50+", label: "50+ people" },
          ]}
          error={errors.estimatedParticipants}
          required
        />
      </div>

      <div className="pt-4 flex gap-4">
        <FormButton variant="secondary" onClick={onBack}>
          Back
        </FormButton>
        <FormButton onClick={handleNext}>Next</FormButton>
      </div>
    </div>
  );
}
