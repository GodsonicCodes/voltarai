"use client";

import React, {useState} from "react";
import {X} from "lucide-react";
import {contactFormSchema, personalDetailsSchema, organizationDetailsSchema, type ContactFormData} from "@/schema/contact.schema";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import Label from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";

const ContactForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
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

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const {error, value} = contactFormSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof ContactFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            console.log("Form submitted:", value);
            // Handle form submission here
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Get In Touch</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

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
                                    <Input id="fullName" placeholder="Enter your full name" value={formData.fullName} setValue={(value) => updateField("fullName", value)} error={errors.fullName} />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Enter your email" value={formData.email} setValue={(value) => updateField("email", value)} error={errors.email} />
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
                                    <Select value={formData.organizationSize} setValue={(value) => updateField("organizationSize", value)} placeholder="Select size" error={errors.organizationSize}>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="annualRevenue">Organization&apos;s annual revenue</Label>
                                    <Select value={formData.annualRevenue} setValue={(value) => updateField("annualRevenue", value)} placeholder="Select revenue range" error={errors.annualRevenue}>
                                        <option value="0-100k">$0 - $100k</option>
                                        <option value="100k-500k">$100k - $500k</option>
                                        <option value="500k-1m">$500k - $1M</option>
                                        <option value="1m-5m">$1M - $5M</option>
                                        <option value="5m+">$5M+</option>
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
                                    <Select value={formData.aiServiceType} setValue={(value) => updateField("aiServiceType", value)} placeholder="Select AI service type" error={errors.aiServiceType}>
                                        <option value="AI Sales Assistant">AI Sales Assistant</option>
                                        <option value="AI Customer Service">AI Customer Service</option>
                                        <option value="AI Data Processor">AI Data Processor</option>
                                        <option value="AI Workflow Automation">AI Workflow Automation</option>
                                        <option value="Custom AI Agent">Custom AI Agent</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="projectBudget">Project Budget</Label>
                                    <Select value={formData.projectBudget} setValue={(value) => updateField("projectBudget", value)} placeholder="Select budget range" error={errors.projectBudget}>
                                        <option value="0-10k">$0 - $10k</option>
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
                                        <option value="Whatsapp">Whatsapp</option>
                                        <option value="Google">Google</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Other">Other</option>
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

export default ContactForm;
