import Joi from "joi";

// Email validation schema
export const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email address is required",
      "string.empty": "Email address is required",
    }),
});

// Email submission interface
export interface EmailFormData {
  email: string;
}
