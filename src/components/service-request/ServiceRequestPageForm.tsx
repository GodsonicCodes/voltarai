"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { ServiceRequestPageFormData } from "./types";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import SuccessScreen from "./steps/SuccessScreen";
import { createServiceRequest } from "@/actions/service.api";

export default function ServiceRequestPageForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ServiceRequestPageFormData>({
    fullName: "",
    email: "",
    companyName: "",
    countryCode: "+233",
    phoneNumber: "",
    websiteLinkedin: "",
    serviceType: "",
    preferredTimeline: "",
    budgetRange: "",
    projectGoal: "",
    currentChallenges: "",
    preferredCommunication: "",
    howDidYouHearAboutUs: "",
    supportingDocuments: null,
  });

  const updateFormData = (newData: Partial<ServiceRequestPageFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // Clear errors for fields being updated
    const newErrors = { ...errors };
    Object.keys(newData).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      const formDataToSubmit = new FormData();

      formDataToSubmit.append("full_name", formData.fullName);
      formDataToSubmit.append("email_address", formData.email);
      formDataToSubmit.append(
        "company_organization_name",
        formData.companyName,
      );
      formDataToSubmit.append(
        "phone_number",
        `${formData.countryCode}${formData.phoneNumber}`,
      );
      formDataToSubmit.append("website_linkedin", formData.websiteLinkedin);
      formDataToSubmit.append("service_type", formData.serviceType);
      formDataToSubmit.append("preferred_timeline", formData.preferredTimeline);
      formDataToSubmit.append("budget_range", formData.budgetRange);
      formDataToSubmit.append("project_goal", formData.projectGoal);
      formDataToSubmit.append("current_challenges", formData.currentChallenges);
      formDataToSubmit.append(
        "preferred_communication",
        formData.preferredCommunication,
      );
      formDataToSubmit.append(
        "how_heard_about_us",
        formData.howDidYouHearAboutUs,
      );

      if (formData.supportingDocuments) {
        formDataToSubmit.append(
          "supporting_documents",
          formData.supportingDocuments,
        );
      }

      const result = await createServiceRequest(formDataToSubmit);

      if (result.success) {
        setStep(4); // Move to success screen
      } else {
        setErrors({
          form: result.message || "Failed to submit request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({
        form: "Failed to submit request. Please check your connection and try again.",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3
            data={formData}
            updateData={updateFormData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            errors={errors}
          />
        );
      case 4:
        return <SuccessScreen />;
      default:
        return (
          <Step1
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            errors={errors}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white min-h-screen sm:min-h-0 sm:h-auto sm:rounded-3xl shadow-xl overflow-hidden flex flex-col">
      {step < 4 && (
        <div className="p-6 pb-2">
          <h1 className="text-[32px] font-bold text-gray-900 mb-8 font-sans tracking-tight">
            Request A Service
          </h1>

          {/* Progress Bar */}
          <div className="flex items-center justify-between relative mb-8 w-full max-w-[280px] mx-auto">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200" />

            {/* Active Progress Line */}
            <div
              className="absolute top-1/2 left-0 h-[1px] bg-gray-900 transition-all duration-300 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-colors duration-300 bg-white
                  ${
                    step > s
                      ? "border-gray-900 bg-gray-900 text-gray-500"
                      : step === s
                        ? "border-gray-900 text-gray-900 ring-4 ring-gray-100"
                        : "border-gray-200 text-gray-500"
                  }`}
              >
                {step > s ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  s
                )}
              </div>
            ))}
          </div>

          <div className="text-sm font-medium text-gray-900 mb-6">
            Step {step} of 3
          </div>
        </div>
      )}

      {/* Content Area */}
      <div
        className={`flex-1 px-6 pb-8 ${step === 4 ? "flex items-center justify-center" : ""}`}
      >
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
