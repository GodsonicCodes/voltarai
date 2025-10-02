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

        console.log("=== User Tracking Debug Info ===");
        console.log("Visitor UUID:", userId);
        console.log("Last visit date:", lastVisit);
        console.log("Today's date:", today);
        console.log("Already visited today:", lastVisit === today);

        if (lastVisit === today) {
            console.log("User already visited today, skipping tracking");

            // Show stored tracking data from previous visit
            const storedData = localStorage.getItem("tracking_data");
            if (storedData) {
                console.log("Stored tracking data from previous visit:", JSON.parse(storedData));
            }
            return;
        }
        
        console.log("New visit detected, starting tracking...");

        // Fetch GeoJS info with timeout and fallback
        let geoData;
        try {
            console.log("Attempting to fetch location data...");
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
            console.log("Location data fetched successfully:", geoData);
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

        console.log("Data being sent to backend:", trackingData);
        localStorage.setItem("tracking_data", JSON.stringify(trackingData));
        try {
            const result = await trackUserVisit(trackingData);
            console.log("API tracking result:", result);

            if (result && result.success) {
                localStorage.setItem("visit", today);
                console.log("User visit tracked successfully in backend");
            } else {
                console.warn("API tracking failed:", result?.message || "Unknown error");
                // Don't mark as visited if API failed - allow retry on next load
                console.log("Will retry tracking on next page load");
            }
        } catch (apiError) {
            console.warn("API call failed, but continuing:", apiError);
            // Don't mark as visited if API failed - allow retry on next load
            console.log("Will retry tracking on next page load");
        }
    } catch (error: unknown) {
        console.error("Visit tracking failed:", error);
    }
};
