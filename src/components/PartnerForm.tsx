"use client";

import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import {
  partnerFormSchema,
  partnerPersonalDetailsSchema,
  partnershipDetailsSchema,
  type PartnerFormData,
} from "@/schema/partner.schema";
import { createPartner } from "@/actions/partner.api";
import useClickOutside from "@/hooks/useClickOutside";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import Label from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StepProgress from "@/components/ui/step-progress";
import Success from "./ui/success";

const PartnerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
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

  const [errors, setErrors] = useState<
    Partial<Record<keyof PartnerFormData, string>>
  >({});

  const parentRef = useRef<HTMLDivElement>(null);

  // Close form when clicking outside
  useClickOutside(parentRef as React.RefObject<HTMLElement>, () => onClose());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    const { error, value } = partnerFormSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const fieldErrors: Partial<Record<keyof PartnerFormData, string>> = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as keyof PartnerFormData;
        fieldErrors[field] = detail.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPartner(value);

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message });
        // Reset form on success
        setFormData({
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
        setStep(1);
      } else {
        setSubmitMessage({ type: "error", text: result.message });
      }
    } catch {
      setSubmitMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStep1Next = () => {
    const personalData = {
      fullName: formData.fullName,
      personalEmail: formData.personalEmail,
      countryCode: formData.countryCode,
      phoneNumber: formData.phoneNumber,
    };

    const { error } = partnerPersonalDetailsSchema.validate(personalData, {
      abortEarly: false,
    });
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

    const { error } = partnershipDetailsSchema.validate(partnershipData, {
      abortEarly: false,
    });

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-[black]/50 flex items-end md:items-center justify-center md:justify-end p-4 md:px-0 z-[9999]"
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
        className="bg-white max-w-xl w-full min-h-[90dvh] md:h-[100dvh] max-h-[90dvh] md:max-h-[100dvh]] overflow-y-auto shadow-2xl"
      >
        <div className="p-6" ref={parentRef}>
          {submitMessage && submitMessage.type === "success" ? (
            <Success onClose={onClose} />
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Let&apos;s Partner
                </h2>
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
              {submitMessage && submitMessage.type === "error" && (
                <div
                  className={`mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200`}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Step Progress - Mobile Only */}
              <div className="md:hidden mb-8">
                <StepProgress currentStep={step} totalSteps={3} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Section */}
                <section
                  className={`${step === 1 ? "block" : "hidden md:block"}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Personal Details
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    We&apos;d love to know you
                  </p>

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
                      <Label htmlFor="personalEmail">Personal Email</Label>
                      <Input
                        id="personalEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.personalEmail}
                        setValue={(value) =>
                          updateField("personalEmail", value)
                        }
                        error={errors.personalEmail}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <PhoneInput
                        countryCode={formData.countryCode}
                        setCountryCode={(value) =>
                          updateField("countryCode", value)
                        }
                        phoneNumber={formData.phoneNumber}
                        setPhoneNumber={(value) =>
                          updateField("phoneNumber", value)
                        }
                        countryCodeError={errors.countryCode}
                        phoneNumberError={errors.phoneNumber}
                      />
                    </div>

                    {/* Next Button */}
                    <div className="pt-4 md:hidden">
                      <Button
                        type="button"
                        onClick={handleStep1Next}
                        className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-3 rounded-md"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Partnership Details Section */}
                <section
                  className={`${step === 2 ? "block" : "hidden md:block"}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Partnership Details
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Fill in the partnership form below
                  </p>

                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="companyName">
                        Company/Organization Name
                      </Label>
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
                        setValue={(value) =>
                          updateField("partnershipType", value)
                        }
                        placeholder="Select partnership type"
                        error={errors.partnershipType}
                      >
                        <option value="affiliate_partner">
                          Affiliate Partner
                        </option>
                        <option value="technology_partner">
                          Technology Partner
                        </option>
                        <option value="integration_partner">
                          Integration Partner
                        </option>
                        <option value="reseller_partner">
                          Reseller Partner
                        </option>
                        <option value="strategic_partner">
                          Strategic Partner
                        </option>
                        <option value="channel_partner">Channel Partner</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessSize">Business Size/Scale</Label>
                      <Select
                        value={formData.businessSize}
                        setValue={(value) => updateField("businessSize", value)}
                        placeholder="Select your business size"
                        error={errors.businessSize}
                      >
                        <option value="startup">
                          Startup (1-10 employees)
                        </option>
                        <option value="small">
                          Small Business (11-50 employees)
                        </option>
                        <option value="medium">
                          Medium Business (51-200 employees)
                        </option>
                        <option value="large">
                          Large Business (201-1000 employees)
                        </option>
                        <option value="enterprise">
                          Enterprise (1000+ employees)
                        </option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budgetRange">
                        Budget range (optional)
                      </Label>
                      <Select
                        value={formData.budgetRange}
                        setValue={(value) => updateField("budgetRange", value)}
                        placeholder="Select estimated budget for this partnership"
                        error={errors.budgetRange}
                      >
                        <option value="under_10k">$0 - $10k</option>
                        <option value="10k_25k">$10k - $25k</option>
                        <option value="25k_50k">$25k - $50k</option>
                        <option value="50k_100k">$50k - $100k</option>
                        <option value="100k_250k">$100k - $250k</option>
                        <option value="250k_500k">$250k - $500k</option>
                        <option value="500k_plus">$500k+</option>
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
                    <Button
                      type="button"
                      className="w-full text-[#1E1E1E] bg-transparent py-6 rounded-md"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleStep2Next}
                      className="w-full bg-[#1E1E1E] hover:bg-gray-900 text-white py-6 rounded-md"
                    >
                      Next
                    </Button>
                  </div>
                </section>

                {/* Additional Options Section */}
                <section
                  className={`${step === 3 ? "block" : "hidden md:block"}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Additional Options
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Final Touches</p>

                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="preferredCommunication">
                        Preferred communication method
                      </Label>
                      <Select
                        value={formData.preferredCommunication}
                        setValue={(value) =>
                          updateField("preferredCommunication", value)
                        }
                        placeholder="Select communication method"
                        error={errors.preferredCommunication}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="video_call">Video Call</option>
                        <option value="in_person">In Person</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="linkedin">LinkedIn</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="howDidYouHearAboutUs">
                        How did you hear about us?
                      </Label>
                      <Select
                        value={formData.howDidYouHearAboutUs}
                        setValue={(value) =>
                          updateField("howDidYouHearAboutUs", value)
                        }
                        placeholder="Select how you found us"
                        error={errors.howDidYouHearAboutUs}
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="google_search">Google</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="additionalComments">
                        Additional comments (optional)
                      </Label>
                      <Textarea
                        id="additionalComments"
                        value={formData.additionalComments}
                        setValue={(value) =>
                          updateField("additionalComments", value)
                        }
                        placeholder="Any other thing you want to add"
                        error={errors.additionalComments}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-8 flex gap-2">
                    <Button
                      type="button"
                      className="md:hidden w-full text-[#1E1E1E] bg-transparent py-6 rounded-md"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white py-3 rounded-md disabled:opacity-50"
                    >
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

export default PartnerForm;
