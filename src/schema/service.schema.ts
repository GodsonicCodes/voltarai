import Joi from "joi";

// Basic Information Schema for Service Request
export const basicInformationSchema = Joi.object({
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
    companyName: Joi.string().min(2).required().messages({
        "string.min": "This field must be at least 2 characters",
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
    websiteLinkedin: Joi.string().uri().allow("").messages({
        "string.uri": "Please enter a valid website URL",
    }),
});

// Service Details Schema
export const serviceDetailsSchema = Joi.object({
    serviceType: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    preferredTimeline: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    budgetRange: Joi.string().min(1).required().messages({
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    projectGoal: Joi.string().min(10).required().messages({
        "string.min": "This field must be at least 10 characters",
        "any.required": "This field is required",
        "string.empty": "This field is required",
    }),
    currentChallenges: Joi.string().min(10).required().messages({
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
    supportingDocuments: Joi.any().allow(null).messages({}),
});

// Complete Service Request Form Schema
export const serviceRequestSchema = basicInformationSchema.concat(serviceDetailsSchema).concat(additionalOptionsSchema);

export interface ServiceRequestFormData {
    fullName: string;
    email: string;
    companyName: string;
    countryCode: string;
    phoneNumber: string;
    websiteLinkedin: string;
    serviceType: string;
    preferredTimeline: string;
    budgetRange: string;
    projectGoal: string;
    currentChallenges: string;
    preferredCommunication: string;
    howDidYouHearAboutUs: string;
    supportingDocuments: File | null;
}
