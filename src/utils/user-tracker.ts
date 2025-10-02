import { v4 as uuidv4 } from "uuid";
import { trackUserVisit } from "@/actions/user-tracker.api";

export const trackUserVisitUtil = async () => {
    try {
        let userId = localStorage.getItem("visitor_uuid");
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem("visitor_uuid", userId);
        }

        const today = new Date().toISOString().split("T")[0];
        const lastVisit = localStorage.getItem("visit");

        if (lastVisit === today) {
            return;
        }

        // Fetch GeoJS info with timeout and fallback
        let geoData;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json", {
                signal: controller.signal,
                mode: 'cors'
            });

            clearTimeout(timeoutId);

            if (!geoRes.ok) {
                console.error("GeoJS API error:", geoRes.status, geoRes.statusText);
                throw new Error(`GeoJS API error: ${geoRes.status} ${geoRes.statusText}`);
            }

            geoData = await geoRes.json();
        } catch (fetchError) {
            console.error("GeoJS fetch failed:", fetchError);
            console.warn("Using default location data due to API failure");
            geoData = {
                country: "Unknown",
                ip: "Unknown"
            };
        }

        const trackingData = {
            visitor_uuid: userId,
            country: geoData.country || "Unknown",
            ip_address: geoData.ip || "Unknown",
            visit_date: today,
        };

        localStorage.setItem("tracking_data", JSON.stringify(trackingData));
        try {
            const result = await trackUserVisit(trackingData);
            if (result && result.success) {
                localStorage.setItem("visit", today);
            }
        } catch (apiError) {
            // Don't mark as visited if API failed - allow retry on next load
        }
    } catch (error: unknown) {
        // Error handling remains but without logging sensitive info
    }
};
