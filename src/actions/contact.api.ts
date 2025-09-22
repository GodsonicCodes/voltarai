"use server";

import {api} from "./api";
import {type ContactFormData} from "@/schema/contact.schema";

export interface ContactSubmissionData {
    full_name: string;
    email: string;
    role: string;
    phone: string;
    organization_name: string;
    industry: string;
    organization_website: string;
    organization_size: string;
    annual_revenue: string;
    service_type: string;
    project_budget: string;
    how_found: string;
    message: string;
}

// Format form data to match the expected API structure
const formatContactData = (data: ContactFormData): ContactSubmissionData => {
    return {
        full_name: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.countryCode && data.phoneNumber ? `${data.countryCode}-${data.phoneNumber}` : data.phoneNumber,
        organization_name: data.organizationName,
        industry: data.industry,
        organization_website: data.organizationWebsite,
        organization_size: data.organizationSize,
        annual_revenue: data.annualRevenue,
        service_type: data.aiServiceType.toLowerCase().replace(/\s+/g, "_"),
        project_budget: data.projectBudget,
        how_found: data.howDidYouFindUs.toLowerCase().replace(/\s+/g, "_"),
        message: data.message,
    };
};

export async function createContact(data: ContactFormData) {
    "use server";

    try {
        // Format the data to match the expected structure
        const formattedData = formatContactData(data);

        const response = await api("/contact", {
            method: "POST",
            body: JSON.stringify(formattedData),
        });

        if (!response.success) {
            return {success: false, message: response.error || "Failed to submit contact form"};
        }

        return {success: true, message: "Contact form submitted successfully!", data: response.data};
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return {success: false, message: "An unexpected error occurred. Please try again."};
    }
}

// Legacy function for backward compatibility with FormData
export async function createContactFromFormData(data: FormData) {
    "use server";

    const response = await api("/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
    });

    if (!response.success) {
        throw new Error(response.error);
    }

    return response.data;
}
