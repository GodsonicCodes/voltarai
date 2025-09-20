"use client";

import React, {useState} from "react";
import {X} from "lucide-react";
import {partnerFormSchema, partnerPersonalDetailsSchema, partnershipDetailsSchema, type PartnerFormData} from "@/schema/partner.schema";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import Label from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";

const PartnerForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<PartnerFormData>({
        fullName: "",
        personalEmail: "",
        countryCode: "",
        phoneNumber: "",
        companyName: "",
        companyEmail: "",
        partnershipType: "",
        businessSize: "",
        budgetRange: "",
        useCaseGoals: "",
        preferredCommunication: "",
        howDidYouHearAboutUs: "",
        additionalComments: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PartnerFormData, string>>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const {error, value} = partnerFormSchema.validate(formData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof PartnerFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof PartnerFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            console.log("Partner form submitted:", value);
            // Handle form submission here
        }
    };

    const updateField = (field: keyof PartnerFormData, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: undefined}));
        }
    };

    const handleStep1Next = () => {
        const personalData = {
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
        };

        const {error} = partnerPersonalDetailsSchema.validate(personalData, {abortEarly: false});
        if (error) {
            const fieldErrors: Partial<Record<keyof PartnerFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof PartnerFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            setErrors({});
            setStep(2);
        }
    };

    const handleStep2Next = () => {
        const partnershipData = {
            companyName: formData.companyName,
            companyEmail: formData.companyEmail,
            partnershipType: formData.partnershipType,
            businessSize: formData.businessSize,
            budgetRange: formData.budgetRange,
            useCaseGoals: formData.useCaseGoals,
        };

        const {error} = partnershipDetailsSchema.validate(partnershipData, {abortEarly: false});

        if (error) {
            const fieldErrors: Partial<Record<keyof PartnerFormData, string>> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as keyof PartnerFormData;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
        } else {
            setErrors({});
            setStep(3);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Let&apos;s Partner</h2>
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
                            <p className="text-sm text-gray-500 mb-4">We&apos;d love to know you</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" placeholder="Enter your full name" value={formData.fullName} setValue={(value) => updateField("fullName", value)} error={errors.fullName} />
                                </div>

                                <div>
                                    <Label htmlFor="personalEmail">Personal Email</Label>
                                    <Input
                                        id="personalEmail"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.personalEmail}
                                        setValue={(value) => updateField("personalEmail", value)}
                                        error={errors.personalEmail}
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

                                {/* Next Button */}
                                <div className="pt-4 md:hidden">
                                    <Button type="button" onClick={handleStep1Next} className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Partnership Details Section */}
                        <section className={`${step === 2 ? "block" : "hidden md:block"}`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Partnership Details</h3>
                            <p className="text-sm text-gray-500 mb-4">Fill in the partnership form below</p>

                            <div className="flex flex-col gap-4">
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
                                    <Label htmlFor="companyEmail">Company&apos;s Email</Label>
                                    <Input
                                        id="companyEmail"
                                        type="email"
                                        placeholder="Enter company email"
                                        value={formData.companyEmail}
                                        setValue={(value) => updateField("companyEmail", value)}
                                        error={errors.companyEmail}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="partnershipType">Partnership type</Label>
                                    <Select
                                        value={formData.partnershipType}
                                        setValue={(value) => updateField("partnershipType", value)}
                                        placeholder="Select partnership type"
                                        error={errors.partnershipType}
                                    >
                                        <option value="Affiliate Partner">Affiliate Partner</option>
                                        <option value="Technology Partner">Technology Partner</option>
                                        <option value="Strategic Partner">Strategic Partner</option>
                                        <option value="Reseller Partner">Reseller Partner</option>
                                        <option value="Integration Partner">Integration Partner</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="businessSize">Business Size/Scale</Label>
                                    <Select value={formData.businessSize} setValue={(value) => updateField("businessSize", value)} placeholder="Select your business size" error={errors.businessSize}>
                                        <option value="Startup">Startup (1-10 employees)</option>
                                        <option value="Small Business">Small Business (11-50 employees)</option>
                                        <option value="Medium Business">Medium Business (51-200 employees)</option>
                                        <option value="Large Business">Large Business (201-500 employees)</option>
                                        <option value="Enterprise">Enterprise (500+ employees)</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="budgetRange">Budget range (optional)</Label>
                                    <Select
                                        value={formData.budgetRange}
                                        setValue={(value) => updateField("budgetRange", value)}
                                        placeholder="Select estimated budget for this partnership"
                                        error={errors.budgetRange}
                                    >
                                        <option value="0-10k">$0 - $10k</option>
                                        <option value="10k-25k">$10k - $25k</option>
                                        <option value="25k-50k">$25k - $50k</option>
                                        <option value="50k-100k">$50k - $100k</option>
                                        <option value="100k+">$100k+</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="useCaseGoals">Use Case or Goals</Label>
                                    <Textarea
                                        id="useCaseGoals"
                                        value={formData.useCaseGoals}
                                        setValue={(value) => updateField("useCaseGoals", value)}
                                        placeholder="Briefly describe your goals or how you envision using our AI automation solutions"
                                        error={errors.useCaseGoals}
                                        className="min-h-[120px]"
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
                                    <Label htmlFor="additionalComments">Additional comments (optional)</Label>
                                    <Textarea
                                        id="additionalComments"
                                        value={formData.additionalComments}
                                        setValue={(value) => updateField("additionalComments", value)}
                                        placeholder="Any other thing you want to add"
                                        error={errors.additionalComments}
                                        className="min-h-[120px]"
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

export default PartnerForm;
