import Joi from "joi";

// AI Strategy Form Schema
export const aiStrategyFormSchema = Joi.object({
    companyName: Joi.string().min(2).required().messages({
        "string.min": "Company name must be at least 2 characters",
        "any.required": "Company name is required",
        "string.empty": "Company name is required",
    }),
    businessEmail: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Business email is required",
        "string.empty": "Business email is required",
    }),
    industryType: Joi.string().valid('ecommerce', 'retail', 'manufacturing', 'service', 'healthcare', 'education', 'finance', 'technology', 'media', 'marketing', 'other').required().messages({
        'any.only': 'Please select a valid industry type',
        'any.required': 'Industry type is required',
        'string.empty': 'Industry type is required',
    }),
    businessChallenge: Joi.string().min(1).required().messages({
        "any.required": "Please select a business challenge",
        "string.empty": "Please select a business challenge",
    }),
});

export interface AIStrategyFormData {
    companyName: string;
    businessEmail: string;
    industryType: string;
    businessChallenge: string;
}
