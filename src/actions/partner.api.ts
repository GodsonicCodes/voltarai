"use server";

import {api} from "./api";
import {type PartnerFormData} from "@/schema/partner.schema";

export interface PartnerSubmissionData {
    full_name: string;
    personal_email: string;
    phone: string;
    company_organization_name: string;
    company_email: string;
    partnership_type: string;
    business_size_scale: string;
    budget_range: string;
    use_case_goals: string;
    preferred_communication_method: string;
    how_heard_about_us: string;
    additional_comments: string;
}

// Format form data to match the expected API structure
const formatPartnerData = (data: PartnerFormData): PartnerSubmissionData => {
    return {
        full_name: data.fullName,
        personal_email: data.personalEmail,
        phone: data.countryCode && data.phoneNumber ? `${data.countryCode}-${data.phoneNumber}` : data.phoneNumber,
        company_organization_name: data.companyName,
        company_email: data.companyEmail,
        partnership_type: data.partnershipType.toLowerCase().replace(/\s+/g, "_"),
        business_size_scale: data.businessSize
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/\([^)]*\)/g, "")
            .trim(),
        budget_range: data.budgetRange.toLowerCase().replace(/\s+/g, "_").replace(/\$|\-/g, "").replace(/k/g, "k"),
        use_case_goals: data.useCaseGoals,
        preferred_communication_method: data.preferredCommunication.toLowerCase().replace(/\s+/g, "_"),
        how_heard_about_us: data.howDidYouHearAboutUs.toLowerCase().replace(/\s+/g, "_"),
        additional_comments: data.additionalComments,
    };
};

export async function createPartner(data: PartnerFormData) {
    "use server";

    try {
        // Format the data to match the expected structure
        const formattedData = formatPartnerData(data);

        const response = await api("/partnership", {
            method: "POST",
            body: JSON.stringify(formattedData),
        });

        if (!response.success) {
            return {success: false, message: response.error || "Failed to submit partner form"};
        }

        return {success: true, message: "Partner form submitted successfully!", data: response.data};
    } catch (error) {
        console.error("Error submitting partner form:", error);
        return {success: false, message: "An unexpected error occurred. Please try again."};
    }
}
