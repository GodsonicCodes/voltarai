"use server";

import { api } from "./api";
import { type UserTrackerFormData } from "@/schema/user-tracker.schema";

export interface UserTrackerResponse {
    success: boolean;
    message: string;
}

export async function trackUserVisit(data: UserTrackerFormData): Promise<UserTrackerResponse | null> {
    try {
        // Try to call the API, but handle gracefully if endpoint doesn't exist
        const response = await api("/user-track/", {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.success) {
            console.warn("Backend tracking endpoint not available:", response.error);
            return {
                success: false,
                message: response.error || "Failed to track user visit"
            };
        }

        return {
            success: true,
            message: "User visit tracked successfully"
        };
    } catch (error) {
        console.warn("Backend API not available, continuing with local tracking only:", error);
        // Return null to indicate API is not available but don't break the flow
        return null;
    }
}