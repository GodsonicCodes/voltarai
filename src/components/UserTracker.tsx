"use client";

import { useEffect } from "react";
import { trackUserVisitUtil } from "@/utils/user-tracker";

const UserTracker = () => {
    useEffect(() => {
        // Track user visit when component mounts
        trackUserVisitUtil();
    }, []);

    // This component doesn't render anything visible
    return null;
};

export default UserTracker;
