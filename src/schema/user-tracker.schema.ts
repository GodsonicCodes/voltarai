import { z } from "zod";

export const UserTrackerSchema = z.object({
    visitor_uuid: z.string().uuid("Invalid UUID format"),
    country: z.string().min(1, "Country is required"),
    ip_address: z.string().min(1, "IP address is required"),
    visit_date: z.string().min(1, "Visit date is required"),
});

export type UserTrackerFormData = z.infer<typeof UserTrackerSchema>;