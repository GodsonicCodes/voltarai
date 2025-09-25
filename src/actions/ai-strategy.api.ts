"use server";

import { api } from "./api";
import { type AIStrategyFormData } from "@/schema/ai-strategy.schema";

export interface AIStrategySubmissionData {
    company_name: string;
    business_email: string;
    business_type: string;
    business_challenge: string;
}

// Format form data to match the expected API structure
const formatAIStrategyData = (data: AIStrategyFormData): AIStrategySubmissionData => {
    return {
        company_name: data.companyName,
        business_email: data.businessEmail,
        business_type: data.industryType,
        business_challenge: data.businessChallenge,
    };
};


export async function createAIStrategy(data: AIStrategyFormData) {
    "use server";

    try {
        // Format the data to match the expected structure
        const formattedData = formatAIStrategyData(data);

        const response = await api<{ message?: string }>("/job-request/", {
            method: "POST",
            body: JSON.stringify(formattedData),
        });

        if (!response.success) {
            return { 
                success: false, 
                message: response.error || "Failed to submit AI strategy request"
            };
        }

        return { 
            success: true, 
            message: "Your AI strategy request has been submitted successfully!",
            data: response.data
        };
    } catch (error) {
        console.error("Error submitting AI strategy request:", error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : "An unexpected error occurred" 
        };
    }
}
