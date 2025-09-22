import {useEffect, RefObject} from "react";

/**
 * Custom hook that detects clicks outside of a specified element
 * @param ref - React ref object pointing to the element to monitor
 * @param handler - Callback function to execute when click outside is detected
 * @param enabled - Optional boolean to enable/disable the hook (default: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: () => void, enabled: boolean = true): void {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // Check if the ref exists and contains the clicked element
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        // Add event listeners for both mouse and touch events
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        // Cleanup function to remove event listeners
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, handler, enabled]);
}

export default useClickOutside;
