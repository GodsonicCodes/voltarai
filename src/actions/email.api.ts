"use server";

import { api } from "./api";
import { emailSchema } from "@/schema/email.schema";

export interface EmailSubmissionData {
    email: string;
}

export async function submitEmail(email: string) {
    "use server";

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
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
}
