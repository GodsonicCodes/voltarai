"use client";

import React, {useState} from "react";
import {X} from "lucide-react";
import {serviceRequestSchema, basicInformationSchema, serviceDetailsSchema, type ServiceRequestFormData} from "@/schema/service.schema";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import FileUpload from "@/components/ui/file-upload";
import Label from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";

const ServiceRequestForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const {error, value} = serviceRequestSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ServiceRequestFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ServiceRequestFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            console.log("Service request form submitted:", value);
            // Handle form submission here
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Request A Service</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

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
                                <Button type="submit" className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white py-3 rounded-md">
                                    Submit
                                </Button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
