import Joi from "joi";

// Personal Details Schema
export const personalDetailsSchema = Joi.object({
    fullName: Joi.string().min(2).required().messages({
        "string.min": "This field must be at least 2 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    role: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    countryCode: Joi.string().min(1).required().messages({
        "any.required": "Country code  is required",
        "string.empty": "Country code is required",
    }),
    phoneNumber: Joi.string().min(8).required().messages({
        "string.min": "Phone number must be at least 8 digits",
        "any.required": "Phone number is required",
        "string.empty": "Phone number is required",
    }),
});

// Organization Details Schema
export const organizationDetailsSchema = Joi.object({
    organizationName: Joi.string().min(2).required().messages({
        "string.min": "This field must be at least 2 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    industry: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    organizationWebsite: Joi.string().uri().allow("").messages({
        "string.uri": "Please enter a valid website URL",
    }),
    organizationSize: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    annualRevenue: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
});

// Project Details Schema
export const projectDetailsSchema = Joi.object({
    aiServiceType: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    projectBudget: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    howDidYouFindUs: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    message: Joi.string().min(10).required().messages({
        "string.min": "This field must be at least 10 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
});

// Complete Contact Form Schema
export const contactFormSchema = personalDetailsSchema.concat(organizationDetailsSchema).concat(projectDetailsSchema);

export interface ContactFormData {
    fullName: string;
    email: string;
    role: string;
    countryCode: string;
    phoneNumber: string;
    organizationName: string;
    industry: string;
    organizationWebsite: string;
    organizationSize: string;
    annualRevenue: string;
    aiServiceType: string;
    projectBudget: string;
    howDidYouFindUs: string;
    message: string;
}
