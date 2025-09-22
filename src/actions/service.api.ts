"use server";

import {api} from "./api";

export async function createServiceRequest(formData: FormData) {
    try {
        const response = await api("/service", {
            method: "POST",
            body: formData,
        });

        if (!response.success) {
            return {success: false, message: response.error || "Failed to submit service request"};
        }

        return {success: true, message: "Service request submitted successfully!", data: response.data};
    } catch (error) {
        console.error("Error submitting service request:", error);
        return {success: false, message: "An unexpected error occurred. Please try again."};
    }
}
