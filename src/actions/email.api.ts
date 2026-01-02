"use server";

import { api } from "./api";
import { emailSchema } from "@/schema/email.schema";

export interface EmailSubmissionData {
    email: string;
}

export async function submitEmail(email: string) {
    try {
        // Validate email on server side
        const { error } = emailSchema.validate({ email });
        if (error) {
            return { success: false, message: error.message };
        }

        const response = await api("/newsletter/subscribe/", {
            method: "POST",
            body: JSON.stringify({ email }),
        });

        if (!response.success) {
            return { success: false, message: response.error || "Failed to submit email" };
        }

        return { success: true, message: "Email submitted successfully!", data: response.data };
    } catch (error) {
        console.error("Error submitting email:", error);
        
        // Provide more specific error messages
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        if (error instanceof Error) {
            // If it's a network/connection error, provide a helpful message
            if (error.message.includes("fetch") || error.message.includes("connect")) {
                errorMessage = "Unable to connect to the server. Please check your connection and try again.";
            } else {
                errorMessage = error.message;
            }
        }
        
        return { success: false, message: errorMessage };
    }
}
