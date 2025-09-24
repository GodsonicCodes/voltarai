"use client";

import React, {useRef, useState} from "react";
import {X} from "lucide-react";
import {motion} from "motion/react";
import {contactFormSchema, personalDetailsSchema, organizationDetailsSchema, type ContactFormData} from "@/schema/contact.schema";
import {createContact} from "@/actions/contact.api";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import Label from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";
import Success from "./ui/success";

const ContactForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [step, setStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: "success" | "error"; text: string} | null>(null);
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: "",
        email: "",
        role: "",
        countryCode: "",
        phoneNumber: "",
        organizationName: "",
        industry: "",
        organizationWebsite: "",
        organizationSize: "",
        annualRevenue: "",
        aiServiceType: "",
        projectBudget: "",
        howDidYouFindUs: "",
        message: "",
    });

    const parentRef = useRef<HTMLDivElement>(null);

    // Close form when clicking outside
    useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
        onClose();
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);

        const {error, value} = contactFormSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ContactFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createContact(value);

            if (result.success) {
                setSubmitMessage({type: "success", text: result.message});
                // Reset form on success
                setFormData({
                    fullName: "",
                    email: "",
                    role: "",
                    countryCode: "",
                    phoneNumber: "",
                    organizationName: "",
                    industry: "",
                    organizationWebsite: "",
                    organizationSize: "",
                    annualRevenue: "",
                    aiServiceType: "",
                    projectBudget: "",
                    howDidYouFindUs: "",
                    message: "",
                });
                setStep(1);
            } else {
                setSubmitMessage({type: "error", text: result.message});
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setSubmitMessage({type: "error", text: error?.message || "An unexpected error occurred. Please try again."});
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof ContactFormData, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: undefined}));
        }
    };

    const handleStep1Next = () => {
        const personalData = {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
        };

        const {error} = personalDetailsSchema.validate(personalData, {abortEarly: false});
        if (error) {
            const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ContactFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            setErrors({});
            console.log("Passed");
            setStep(2);
        }
    };

    const handleStep2Next = () => {
        const organizationData = {
            organizationName: formData.organizationName,
            industry: formData.industry,
            organizationWebsite: formData.organizationWebsite,
            organizationSize: formData.organizationSize,
            annualRevenue: formData.annualRevenue,
        };

        const {error} = organizationDetailsSchema.validate(organizationData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ContactFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            setErrors({});
            setStep(3);
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
                className="bg-white max-w-xl w-full min-h-[90vh] md:h-[100vh] max-h-[100vh] overflow-y-auto shadow-2xl"
            >
                <div className="p-6" ref={parentRef}>
                    {submitMessage && submitMessage.type == "success" ? (
                        <Success onClose={onClose} />
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Get In Touch</h2>
                                <button
                                    className="text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-2 hover:text-gray-600"
                                    type="button"
                                    onClick={() => {
                                        if (onClose) onClose();
                                    }}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Submit Message */}
                            {submitMessage && submitMessage.type == "error" && <div className={`mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200}`}>{submitMessage.text}</div>}

                            {/* Step Progress - Mobile Only */}
                            <div className="md:hidden mb-8">
                                <StepProgress currentStep={step} totalSteps={3} />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Details Section */}
                                <section className={`${step === 1 ? "block" : "hidden md:block"}`}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Personal Details</h3>
                                    <p className="text-sm text-gray-500 mb-4">Tell us about yourself</p>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                placeholder="Enter your full name"
                                                value={formData.fullName}
                                                setValue={(value) => updateField("fullName", value)}
                                                error={errors.fullName}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                setValue={(value) => updateField("email", value)}
                                                error={errors.email}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <Input id="role" placeholder="Enter your role" value={formData.role} setValue={(value) => updateField("role", value)} error={errors.role} />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <PhoneInput
                                                countryCode={formData.countryCode}
                                                setCountryCode={(value) => updateField("countryCode", value)}
                                                phoneNumber={formData.phoneNumber}
                                                setPhoneNumber={(value) => updateField("phoneNumber", value)}
                                                countryCodeError={errors.countryCode}
                                                phoneNumberError={errors.phoneNumber}
                                            />
                                        </div>

                                        {/* Next Button */}
                                        <div className="pt-4 md:hidden">
                                            <Button type="button" onClick={handleStep1Next} className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md">
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </section>

                                {/* Organization Details Section */}
                                <section className={`${step === 2 ? "block" : "hidden md:block"}`}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Organization&apos;s Details</h3>
                                    <p className="text-sm text-gray-500 mb-4">Share your Organization&apos;s Details</p>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <Label htmlFor="organizationName">Name of Organization</Label>
                                            <Input
                                                id="organizationName"
                                                placeholder="Enter organization name"
                                                value={formData.organizationName}
                                                setValue={(value) => updateField("organizationName", value)}
                                                error={errors.organizationName}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="industry">Industry</Label>
                                            <Input id="industry" placeholder="Enter industry" value={formData.industry} setValue={(value) => updateField("industry", value)} error={errors.industry} />
                                        </div>

                                        <div>
                                            <Label htmlFor="organizationWebsite">Organization&apos;s Website</Label>
                                            <Input
                                                id="organizationWebsite"
                                                placeholder="Enter website URL"
                                                value={formData.organizationWebsite}
                                                setValue={(value) => updateField("organizationWebsite", value)}
                                                error={errors.organizationWebsite}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="organizationSize">Organization Size</Label>
                                            <Select
                                                value={formData.organizationSize}
                                                setValue={(value) => updateField("organizationSize", value)}
                                                placeholder="Select size"
                                                error={errors.organizationSize}
                                            >
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="501-1000">501-1000 employees</option>
                                                <option value="1000+">1000+ employees</option>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="annualRevenue">Organization&apos;s annual revenue</Label>
                                            <Select
                                                value={formData.annualRevenue}
                                                setValue={(value) => updateField("annualRevenue", value)}
                                                placeholder="Select revenue range"
                                                error={errors.annualRevenue}
                                            >
                                                <option value="0-100k">$0 - $100k</option>
                                                <option value="100k-500k">$100k - $500k</option>
                                                <option value="500k-1m">$500k - $1M</option>
                                                <option value="1m-5m">$1M - $5M</option>
                                                <option value="5m-10m">$5M -$10M</option>
                                                <option value="10m+">$10M+</option>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 md:hidden mt-8 flex gap-2">
                                        <Button type="button" className="w-full text-[#1E1E1E] bg-transparent  py-6 rounded-md" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                        <Button type="button" onClick={handleStep2Next} className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-6 rounded-md">
                                            Next
                                        </Button>
                                    </div>
                                </section>

                                {/* About Project Section */}
                                <section className={`${step === 3 ? "block" : "hidden md:block"}`}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">About Project</h3>
                                    <p className="text-sm text-gray-500 mb-4">tell us about your project</p>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <Label htmlFor="aiServiceType">AI Service Type</Label>
                                            <Select
                                                value={formData.aiServiceType}
                                                setValue={(value) => updateField("aiServiceType", value)}
                                                placeholder="Select AI service type"
                                                error={errors.aiServiceType}
                                            >
                                                <option value="ai_sales_assistant">AI Sales Assistant</option>
                                                <option value="ai_customer_service">AI Customer Service</option>
                                                <option value="ai_marketing">AI Marketing</option>
                                                <option value="custom_ai_solution">Custom AI Solution</option>
                                                <option value="ai_consulting">AI Consulting</option>
                                                <option value="other">Other</option>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="projectBudget">Project Budget</Label>
                                            <Select
                                                value={formData.projectBudget}
                                                setValue={(value) => updateField("projectBudget", value)}
                                                placeholder="Select budget range"
                                                error={errors.projectBudget}
                                            >
                                                <option value="5k-10k">$5k - $10k</option>
                                                <option value="10k-25k">$10k - $25k</option>
                                                <option value="25k-50k">$25k - $50k</option>
                                                <option value="50k-100k">$50k - $100k</option>
                                                <option value="100k+">$100k+</option>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="howDidYouFindUs">How did you find us?</Label>
                                            <Select
                                                value={formData.howDidYouFindUs}
                                                setValue={(value) => updateField("howDidYouFindUs", value)}
                                                placeholder="Select how you found us"
                                                error={errors.howDidYouFindUs}
                                            >
                                                <option value="whatsapp">Whatsapp</option>
                                                <option value="google_search">Google</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="website">Website</option>
                                                <option value="referral">Referral</option>
                                                <option value="social_media">Social Media</option>
                                                <option value="other">Other</option>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                setValue={(value) => updateField("message", value)}
                                                placeholder="Enter message"
                                                error={errors.message}
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="pt-4 mt-8 flex gap-2">
                                        <Button type="button" className="md:hidden w-full text-[#1E1E1E] bg-transparent  py-6 rounded-md" onClick={() => setStep(2)}>
                                            Back
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white py-3 rounded-md disabled:opacity-50">
                                            {isSubmitting ? "Submitting..." : "Submit"}
                                        </Button>
                                    </div>
                                </section>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactForm;
