"use client";

import React, {useState, useRef} from "react";
import {X} from "lucide-react";
import {motion} from "motion/react";
import {serviceRequestSchema, basicInformationSchema, serviceDetailsSchema, type ServiceRequestFormData} from "@/schema/service.schema";
import {createServiceRequest} from "@/actions/service.api";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import FileUpload from "@/components/ui/file-upload";
import Label from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";

const ServiceRequestForm: React.FC<{onClose?: () => void}> = ({onClose}) => {
    const [step, setStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: "success" | "error"; text: string} | null>(null);
    const [formData, setFormData] = useState<ServiceRequestFormData>({
        fullName: "",
        email: "",
        companyName: "",
        countryCode: "",
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

    const [errors, setErrors] = useState<Partial<Record<keyof ServiceRequestFormData, string>>>({});

    const parentRef = useRef<HTMLDivElement>(null);

    // Close form when clicking outside
    useClickOutside(parentRef as React.RefObject<HTMLElement>, () => {
        if (onClose) onClose();
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);

        const {error, value} = serviceRequestSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ServiceRequestFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ServiceRequestFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert form data to FormData object
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("fullName", value.fullName);
            formDataToSubmit.append("email", value.email);
            formDataToSubmit.append("companyName", value.companyName);
            formDataToSubmit.append("countryCode", value.countryCode);
            formDataToSubmit.append("phoneNumber", value.phoneNumber);
            formDataToSubmit.append("websiteLinkedin", value.websiteLinkedin);
            formDataToSubmit.append("serviceType", value.serviceType);
            formDataToSubmit.append("preferredTimeline", value.preferredTimeline);
            formDataToSubmit.append("budgetRange", value.budgetRange);
            formDataToSubmit.append("projectGoal", value.projectGoal);
            formDataToSubmit.append("currentChallenges", value.currentChallenges);
            formDataToSubmit.append("preferredCommunication", value.preferredCommunication);
            formDataToSubmit.append("howDidYouHearAboutUs", value.howDidYouHearAboutUs);

            if (value.supportingDocuments) {
                formDataToSubmit.append("supportingDocuments", value.supportingDocuments);
            }

            const result = await createServiceRequest(formDataToSubmit);

            if (result.success) {
                setSubmitMessage({type: "success", text: result.message});
                // Reset form on success
                setFormData({
                    fullName: "",
                    email: "",
                    companyName: "",
                    countryCode: "",
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
                setStep(1);
            } else {
                setSubmitMessage({type: "error", text: result.message});
            }
        } catch (error) {
            setSubmitMessage({type: "error", text: "An unexpected error occurred. Please try again."});
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof ServiceRequestFormData, value: string | File | null) => {
        setFormData((prev) => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: undefined}));
        }
    };

    const handleStep1Next = () => {
        const basicData = {
            fullName: formData.fullName,
            email: formData.email,
            companyName: formData.companyName,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
            websiteLinkedin: formData.websiteLinkedin,
        };

        const {error} = basicInformationSchema.validate(basicData, {abortEarly: false});
        if (error) {
            const fieldErrors: Partial<Record<keyof ServiceRequestFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ServiceRequestFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            setErrors({});
            setStep(2);
        }
    };

    const handleStep2Next = () => {
        const serviceData = {
            serviceType: formData.serviceType,
            preferredTimeline: formData.preferredTimeline,
            budgetRange: formData.budgetRange,
            projectGoal: formData.projectGoal,
            currentChallenges: formData.currentChallenges,
        };

        const {error} = serviceDetailsSchema.validate(serviceData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ServiceRequestFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ServiceRequestFormData;
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
                className="bg-white max-w-xl w-full min-h-[90vh] max-h-[100vh] overflow-y-auto shadow-2xl"
            >
                <div className="p-6" ref={parentRef}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Request A Service</h2>
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

                    {/* Step Progress - Mobile Only */}
                    <div className="md:hidden mb-8">
                        <StepProgress currentStep={step} totalSteps={3} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <section className={`${step === 1 ? "block" : "hidden md:block"}`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Basic Information</h3>
                            <p className="text-sm text-gray-500 mb-4">We&apos;d love to know you</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" placeholder="Enter your full name" value={formData.fullName} setValue={(value) => updateField("fullName", value)} error={errors.fullName} />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address (business email preferred)</Label>
                                    <Input id="email" type="email" placeholder="Enter your email" value={formData.email} setValue={(value) => updateField("email", value)} error={errors.email} />
                                </div>

                                <div>
                                    <Label htmlFor="companyName">Company/Organization Name</Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Enter company name"
                                        value={formData.companyName}
                                        setValue={(value) => updateField("companyName", value)}
                                        error={errors.companyName}
                                    />
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

                                <div>
                                    <Label htmlFor="websiteLinkedin">Website/Linkedin</Label>
                                    <Input
                                        id="websiteLinkedin"
                                        placeholder="Enter website or LinkedIn URL"
                                        value={formData.websiteLinkedin}
                                        setValue={(value) => updateField("websiteLinkedin", value)}
                                        error={errors.websiteLinkedin}
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

                        {/* Service Details Section */}
                        <section className={`${step === 2 ? "block" : "hidden md:block"}`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Service Details</h3>
                            <p className="text-sm text-gray-500 mb-4">Let&apos;s talk solutions which shape your service</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="serviceType">Service Type Needed</Label>
                                    <Select value={formData.serviceType} setValue={(value) => updateField("serviceType", value)} placeholder="Select service type" error={errors.serviceType}>
                                        <option value="Workflow Automation">Workflow Automation</option>
                                        <option value="AI Customer Service">AI Customer Service</option>
                                        <option value="Data Processing">Data Processing</option>
                                        <option value="AI Sales Assistant">AI Sales Assistant</option>
                                        <option value="Custom AI Agent">Custom AI Agent</option>
                                        <option value="AI Integration">AI Integration</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="preferredTimeline">Preferred Timeline</Label>
                                    <Select
                                        value={formData.preferredTimeline}
                                        setValue={(value) => updateField("preferredTimeline", value)}
                                        placeholder="Select timeline"
                                        error={errors.preferredTimeline}
                                    >
                                        <option value="Within 1 week">Within 1 week</option>
                                        <option value="Within 1 month">Within 1 month</option>
                                        <option value="Within 3 months">Within 3 months</option>
                                        <option value="Within 6 months">Within 6 months</option>
                                        <option value="No rush">No rush</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="budgetRange">Budget Range</Label>
                                    <Select
                                        value={formData.budgetRange}
                                        setValue={(value) => updateField("budgetRange", value)}
                                        placeholder="Select your preferred budget range"
                                        error={errors.budgetRange}
                                    >
                                        <option value="0-5k">$0 - $5k</option>
                                        <option value="5k-10k">$5k - $10k</option>
                                        <option value="10k-25k">$10k - $25k</option>
                                        <option value="25k-50k">$25k - $50k</option>
                                        <option value="50k+">$50k+</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="projectGoal">Project Goal/Objective</Label>
                                    <Textarea
                                        id="projectGoal"
                                        value={formData.projectGoal}
                                        setValue={(value) => updateField("projectGoal", value)}
                                        placeholder="e.g., automate our lead follow-up emails"
                                        error={errors.projectGoal}
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="currentChallenges">Current Challenges</Label>
                                    <Textarea
                                        id="currentChallenges"
                                        value={formData.currentChallenges}
                                        setValue={(value) => updateField("currentChallenges", value)}
                                        placeholder="Tell us the challenges you are facing"
                                        error={errors.currentChallenges}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 md:hidden mt-8 flex gap-2">
                                <Button type="button" className="w-full text-[#1E1E1E] bg-transparent py-6 rounded-md" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button type="button" onClick={handleStep2Next} className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-6 rounded-md">
                                    Next
                                </Button>
                            </div>
                        </section>

                        {/* Additional Options Section */}
                        <section className={`${step === 3 ? "block" : "hidden md:block"}`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Additional Options</h3>
                            <p className="text-sm text-gray-500 mb-4">Final Touches</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="preferredCommunication">Preferred communication method</Label>
                                    <Select
                                        value={formData.preferredCommunication}
                                        setValue={(value) => updateField("preferredCommunication", value)}
                                        placeholder="Select communication method"
                                        error={errors.preferredCommunication}
                                    >
                                        <option value="Email">Email</option>
                                        <option value="Phone">Phone</option>
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Video Call">Video Call</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="howDidYouHearAboutUs">How did you hear about us?</Label>
                                    <Select
                                        value={formData.howDidYouHearAboutUs}
                                        setValue={(value) => updateField("howDidYouHearAboutUs", value)}
                                        placeholder="Select how you found us"
                                        error={errors.howDidYouHearAboutUs}
                                    >
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Google">Google</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Other">Other</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="supportingDocuments">Attach supporting documents (optional)</Label>
                                    <FileUpload
                                        value={formData.supportingDocuments}
                                        setValue={(file) => updateField("supportingDocuments", file)}
                                        error={errors.supportingDocuments}
                                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                        maxSize={10}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 mt-8 flex gap-2">
                                <Button type="button" className="md:hidden w-full text-[#1E1E1E] bg-transparent py-6 rounded-md" onClick={() => setStep(2)}>
                                    Back
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white py-3 rounded-md disabled:opacity-50">
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </section>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ServiceRequestForm;
