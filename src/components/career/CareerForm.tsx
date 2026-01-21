"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CareerFormData, CareerApiResponse } from './types';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import SuccessScreen from './steps/SuccessScreen';

export default function CareerForm() {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<CareerFormData>({
        fullName: '',
        email: '',
        phone: '',
        countryCode: '+233',
        location: '',
        position: '',
        employmentType: '',
        portfolio: '',
        workPreference: '',
        whyJoin: '',
        cv_resume: null,
        cover_letter: null,
    });

    const updateFormData = (newData: Partial<CareerFormData>) => {
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
            setErrors({}); // Clear previous errors
            const formDataToSubmit = new FormData();

            // Required Fields
            formDataToSubmit.append('full_name', formData.fullName);
            formDataToSubmit.append('email_address', formData.email);
            formDataToSubmit.append('phone_number', formData.phone);
            formDataToSubmit.append('position_applying_for', formData.position);
            formDataToSubmit.append('employment_type', formData.employmentType);
            formDataToSubmit.append('work_preferences', formData.workPreference);

            if (formData.cv_resume) {
                formDataToSubmit.append('cv_resume', formData.cv_resume);
            }

            // Optional Fields - Only append if value exists
            if (formData.location) {
                formDataToSubmit.append('location', formData.location);
            }
            // Always send the phone code as it's part of the UI design currently, even if optional
            formDataToSubmit.append('phone_country_code', formData.countryCode);

            if (formData.portfolio) {
                formDataToSubmit.append('portfolio_website', formData.portfolio);
            }
            if (formData.whyJoin) {
                formDataToSubmit.append('why_work_at_voltar_ai', formData.whyJoin);
            }
            if (formData.cover_letter) {
                formDataToSubmit.append('cover_letter', formData.cover_letter);
            }

            // Submit form to backend API
            const response = await fetch('https://volta-ai-backend.vercel.app/api/careers/', {
                method: 'POST',
                body: formDataToSubmit,
            });

            if (!response.ok) {
                let errorBody: string | undefined;

                try {
                    errorBody = await response.text();
                } catch (error) {
                    console.error('Failed to read error response body from careers API', error);
                }

                console.error(
                    'Careers API returned a non-OK status',
                    response.status,
                    response.statusText,
                    errorBody,
                );

                throw new Error('Failed to submit application');
            }

            let result: CareerApiResponse;

            try {
                result = await response.json();
            } catch (error) {
                console.error('Failed to parse careers API response as JSON', error);
                throw new Error('Unexpected server response from careers API');
            }

            if (result.success) {
                setStep(4); // Move to success screen
            } else {
                console.error('Submission error:', result.errors);

                if (result.errors) {
                    const mappedErrors: Record<string, string> = {};

                    // Map backend field names to frontend state keys
                    const fieldMap: Record<string, keyof CareerFormData> = {
                        'full_name': 'fullName',
                        'email_address': 'email',
                        'phone_number': 'phone',
                        'location': 'location',
                        'position_applying_for': 'position',
                        'employment_type': 'employmentType',
                        'portfolio_website': 'portfolio',
                        'work_preferences': 'workPreference',
                        'why_work_at_voltar_ai': 'whyJoin',
                        'cv_resume': 'cv_resume',
                        'cover_letter': 'cover_letter'
                    };

                    Object.entries(result.errors).forEach(([key, msgs]) => {
                        const frontendKey = fieldMap[key] || key;
                        mappedErrors[frontendKey] = Array.isArray(msgs) ? msgs[0] : msgs as string;
                    });

                    setErrors(mappedErrors);

                    // Determine which step to navigate to based on errors
                    const step1Fields = ['fullName', 'email', 'phone', 'location'];
                    const step2Fields = ['position', 'employmentType', 'portfolio', 'workPreference'];

                    const hasStep1Error = Object.keys(mappedErrors).some(k => step1Fields.includes(k));
                    const hasStep2Error = Object.keys(mappedErrors).some(k => step2Fields.includes(k));

                    if (hasStep1Error) {
                        setStep(1);
                    } else if (hasStep2Error) {
                        setStep(2);
                    }
                    // If errors are only in step 3, stay on step 3
                } else if (result.message) {
                    // Fallback for general error if no specific field errors
                    setErrors({ form: result.message });
                }
            }
        } catch (error) {
            console.error('Submission failed:', error);
            setErrors({ form: 'Failed to submit application. Please check your connection and try again.' });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 data={formData} updateData={updateFormData} onNext={handleNext} errors={errors} />;
            case 2:
                return <Step2 data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} errors={errors} />;
            case 3:
                return <Step3 data={formData} updateData={updateFormData} onSubmit={handleSubmit} errors={errors} />;
            case 4:
                return <SuccessScreen />;
            default:
                return <Step1 data={formData} updateData={updateFormData} onNext={handleNext} errors={errors} />;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white min-h-screen sm:min-h-0 sm:h-auto sm:rounded-3xl shadow-xl overflow-hidden flex flex-col">
            {step < 4 && (
                <div className="p-6 pb-2">
                    <h1 className="text-[32px] font-bold text-gray-900 mb-8 font-sans tracking-tight">Careers</h1>

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
                    {renderStep()}
                </AnimatePresence>
            </div>
        </div>
    );
}
