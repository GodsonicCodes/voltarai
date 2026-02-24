import Joi from "joi";

export interface EventData {
    id: number;
    slug: string;
    title: string;
    sponsor?: string;
    hero_image_url?: string;
    is_free: boolean;
    attendee_display?: string;
    location_name?: string;
    address?: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    timezone?: string;
    description?: string;
    latitude?: number | null;
    longitude?: number | null;
    form_schema?: FormField[];
    form_html?: string;
    created_at: string;
    updated_at: string;
    is_active?: boolean;
}

export interface FormField {
    type: 'email' | 'text' | 'phone' | 'textarea' | 'radio' | 'checkbox' | 'checkbox_group' | 'select' | 'number' | 'date' | 'hidden' | 'url';
    name: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
    country_code?: boolean;
    value?: string;
}

export interface EventListResponse {
    success: boolean;
    count: number;
    events: EventData[];
}

export interface EventDetailResponse {
    success: boolean;
    event: EventData;
}

export interface EventRegistrationRequest {
    [key: string]: string | number | boolean;
}

export interface EventRegistrationResponse {
    success: boolean;
    message?: string;
    registration_id?: number;
    email_sent?: boolean;
    errors?: { [key: string]: string };
}

export const eventDataSchema = Joi.object({
    id: Joi.number().required(),
    slug: Joi.string().required(),
    title: Joi.string().required(),
    sponsor: Joi.string().optional(),
    hero_image_url: Joi.string().uri().optional(),
    is_free: Joi.boolean().required(),
    attendee_display: Joi.string().optional(),
    location_name: Joi.string().optional(),
    address: Joi.string().optional(),
    event_date: Joi.string().required(),
    start_time: Joi.string().optional(),
    end_time: Joi.string().optional(),
    timezone: Joi.string().optional(),
    description: Joi.string().optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
    form_schema: Joi.array().items(Joi.object({
        type: Joi.string().valid('email', 'text', 'phone', 'textarea', 'radio', 'checkbox', 'checkbox_group', 'select', 'number', 'date', 'hidden', 'url').required(),
        name: Joi.string().required(),
        label: Joi.string().required(),
        required: Joi.boolean().required(),
        placeholder: Joi.string().optional(),
        options: Joi.array().items(Joi.string()).optional(),
        country_code: Joi.boolean().optional(),
        value: Joi.string().optional(),
    })).optional(),
    form_html: Joi.string().optional(),
    created_at: Joi.string().optional(),
    updated_at: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
});

export const formFieldSchema = Joi.object({
    type: Joi.string().valid('email', 'text', 'phone', 'textarea', 'radio', 'checkbox', 'checkbox_group', 'select', 'number', 'date', 'hidden', 'url').required(),
    name: Joi.string().required(),
    label: Joi.string().required(),
    required: Joi.boolean().required(),
    placeholder: Joi.string().optional(),
    options: Joi.array().items(Joi.string()).optional(),
    country_code: Joi.boolean().optional(),
    value: Joi.string().optional(),
});
