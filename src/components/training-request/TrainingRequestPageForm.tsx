"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainingRequestFormData } from "./types";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import SuccessScreen from "./steps/SuccessScreen";

export default function TrainingRequestPageForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<TrainingRequestFormData>({
        fullName: "",
        email: "",
        companyName: "",
        countryCode: "+1",
        phoneNumber: "",
        traineeType: "",
        trainingFocus: "",
        currentKnowledgeLevel: "",
        preferredFormat: "",
        estimatedParticipants: "",
        goalsExpectations: "",
        preferredCommunication: "",
        howDidYouHearAboutUs: "",
    });

    const updateFormData = (data: Partial<TrainingRequestFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleNext = () => setStep((s) => Math.min(s + 1, 4));
    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="w-full max-w-2xl mx-auto bg-white min-h-screen sm:min-h-0 sm:h-auto sm:rounded-3xl shadow-xl overflow-hidden flex flex-col">
            {step < 4 && (
                <div className="p-6 pb-2">
                    <h1 className="text-[32px] font-bold text-gray-900 mb-8 font-sans tracking-tight">Request AI Training</h1>

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
                  ${step > s
                                        ? 'border-gray-900 bg-gray-900 text-gray-500'
                                        : step === s
                                            ? 'border-gray-900 text-gray-900 ring-4 ring-gray-100'
                                            : 'border-gray-200 text-gray-500'
                                    }`}
                            >
                                {step > s ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
            <div className={`flex-1 px-6 pb-8 ${step === 4 ? 'flex items-center justify-center' : ''}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {step === 1 && (
                            <Step1
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNext}
                            />
                        )}
                        {step === 2 && (
                            <Step2
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {step === 3 && (
                            <Step3
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {step === 4 && <SuccessScreen />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
