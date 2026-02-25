"use client";

import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { createEventRegistration } from "@/actions/events.api";
import useClickOutside from "@/hooks/useClickOutside";
import EventRegistrationSuccess from "./EventRegistrationSuccess";
import FormRenderer from "./FormRenderer";
import StepProgress from "@/components/ui/step-progress";

interface EventRegistrationFormProps {
    onClose: () => void;
    eventTitle?: string;
    eventSlug?: string;
    registrationHtml?: string;
    isPastEvent?: boolean;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
    onClose,
    eventTitle,
    eventSlug,
    registrationHtml,
    isPastEvent = false
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const parentRef = useRef<HTMLDivElement>(null);

    // Close form when clicking outside
    useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
        onClose();
    });

    const handleBackendFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            // Convert FormData to a plain object matching backend schema
            const data: Record<string, string | number | boolean> = {};

            // Extract all form fields from FormData
            for (const [key, value] of formData.entries()) {
                data[key] = typeof value === 'string' ? value : value.name;
            }

            const result = await createEventRegistration(data, eventSlug);

            if (result.success) {
                setSubmitMessage({ type: "success", text: result.message || "Registration submitted successfully!" });
            } else {
                setSubmitMessage({ type: "error", text: result.message || "Registration failed." });
            }
        } catch (error: any) {
            console.error('Error creating registration:', error);
            setSubmitMessage({
                type: "error",
                text: error?.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center md:justify-end p-4 md:px-0 z-[9999]"
        >
            <motion.div
                initial={{
                    x:
                        typeof window !== "undefined" && window.innerWidth < 768
                            ? 0
                            : "100%",
                    y:
                        typeof window !== "undefined" && window.innerWidth < 768
                            ? "100%"
                            : 0,
                    opacity: 0,
                }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{
                    x:
                        typeof window !== "undefined" && window.innerWidth < 768
                            ? 0
                            : "100%",
                    y:
                        typeof window !== "undefined" && window.innerWidth < 768
                            ? "100%"
                            : 0,
                    opacity: 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    opacity: { duration: 0.4 },
                }}
                className="bg-white max-w-2xl w-full min-h-[90dvh] md:h-[100dvh] max-h-[90dvh] md:max-h-[100dvh]] overflow-y-auto shadow-2xl rounded-t-xl md:rounded-none"
            >
                <div className="p-6 h-full flex flex-col" ref={parentRef}>
                    {submitMessage && submitMessage.type == "success" ? (
                        <div className="flex-1 flex items-center justify-center">
                            <EventRegistrationSuccess onClose={onClose} />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6 mt-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {eventTitle || "Voltar AI Event Registration"}
                                </h2>
                                <button
                                    className="text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors"
                                    type="button"
                                    onClick={() => {
                                        if (onClose) onClose();
                                    }}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Submit Message */}
                            {submitMessage && submitMessage.type == "error" && (
                                <div
                                    className={`mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200}`}
                                >
                                    {submitMessage.text}
                                </div>
                            )}

                            {/* Past Event Warning */}
                            {isPastEvent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
                                >
                                    <h3 className="font-semibold text-yellow-800 mb-2">Registration Closed</h3>
                                    <p className="text-yellow-700">This event has already concluded. Registration is no longer available.</p>
                                    <p className="text-yellow-700 mt-2">Check out our upcoming events to join future Voltar AI gatherings!</p>
                                </motion.div>
                            )}

                            {/* Backend-provided HTML Form */}
                            {registrationHtml && !isPastEvent ? (
                                <div className="space-y-6">
                                    {/* Form Container - Fill the container */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="backend-form-container"
                                        style={{ backgroundColor: 'transparent' }}
                                    >
                                        <FormRenderer
                                            html={registrationHtml}
                                            onSubmit={handleBackendFormSubmit}
                                            className="backend-form"
                                        />
                                    </motion.div>
                                </div>
                            ) : (
                                /* No Registration Form Available */
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-gray-500 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <X className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                                            Registration Not Available
                                        </h3>
                                        <p>
                                            {isPastEvent
                                                ? "This event has already concluded."
                                                : "Registration form is not available for this event at the moment."
                                            }
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            Please check back later or contact us for more information.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventRegistrationForm;
