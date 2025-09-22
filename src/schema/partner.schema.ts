import Joi from "joi";

// Personal Details Schema for Partner
export const partnerPersonalDetailsSchema = Joi.object({
    fullName: Joi.string().min(2).required().messages({
        "string.min": "This field must be at least 2 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    personalEmail: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    countryCode: Joi.string().min(1).required().messages({
        "any.required": "Country code is required",
        "string.empty": "Country code is required",
    }),
    phoneNumber: Joi.string().min(8).required().messages({
        "string.min": "Phone number must be at least 8 digits",
        "any.required": "Phone number is required",
        "string.empty": "Phone number is required",
    }),
});

// Partnership Details Schema
export const partnershipDetailsSchema = Joi.object({
    companyName: Joi.string().min(2).required().messages({
        "string.min": "This field must be at least 2 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    companyEmail: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    partnershipType: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    businessSize: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    budgetRange: Joi.string().allow("").messages({}),
    useCaseGoals: Joi.string().min(10).required().messages({
        "string.min": "This field must be at least 10 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
});

// Additional Options Schema
export const additionalOptionsSchema = Joi.object({
    preferredCommunication: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    howDidYouHearAboutUs: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    additionalComments: Joi.string().allow("").messages({}),
});

// Complete Partner Form Schema
export const partnerFormSchema = partnerPersonalDetailsSchema.concat(partnershipDetailsSchema).concat(additionalOptionsSchema);

export interface PartnerFormData {
    fullName: string;
    personalEmail: string;
    countryCode: string;
    phoneNumber: string;
    companyName: string;
    companyEmail: string;
    partnershipType: string;
    businessSize: string;
    budgetRange: string;
    useCaseGoals: string;
    preferredCommunication: string;
    howDidYouHearAboutUs: string;
    additionalComments: string;
}
