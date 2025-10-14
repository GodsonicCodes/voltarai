import { z } from "zod";

export const UserTrackerSchema = z.object({
    visitor_uuid: z.string().uuid("Invalid UUID format"),
    ip_address: z.string().min(1, "IP address is required"),
    location: z.string().min(1, "Location is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    visit_date: z.string().min(1, "Visit date is required"),
});

export type UserTrackerFormData = z.infer<typeof UserTrackerSchema>;