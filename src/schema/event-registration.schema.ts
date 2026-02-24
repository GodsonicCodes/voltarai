import Joi from "joi";

export interface EventRegistrationData {
    email: string;
    firstName: string;
    lastName: string;
    countryCode: string;
    phoneNumber: string;
    company: string;
}

export const eventRegistrationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
        "string.empty": "Email is required",
    }),
    firstName: Joi.string().min(2).required().messages({
        "string.min": "First name must be at least 2 characters",
        "any.required": "First name is required",
        "string.empty": "First name is required",
    }),
    lastName: Joi.string().min(2).required().messages({
        "string.min": "Last name must be at least 2 characters",
        "any.required": "Last name is required",
        "string.empty": "Last name is required",
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
    company: Joi.string().min(2).required().messages({
        "string.min": "Company name must be at least 2 characters",
        "any.required": "Company is required",
        "string.empty": "Company is required",
    }),
});
