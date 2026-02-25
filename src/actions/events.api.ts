import { EventData, EventListResponse, EventDetailResponse, EventRegistrationRequest, EventRegistrationResponse } from '@/schema/events.schema';
import { api } from "./api";

// Get all events
export async function getEvents(upcoming: boolean = false): Promise<EventListResponse> {
    try {
        const endpoint = upcoming ? `/events/?upcoming=true` : `/events`;
        const response = await api<EventListResponse>(endpoint);

        if (!response.success || !response.data) {
            throw new Error(response.error || `Failed to fetch events`);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        // Return mock data as fallback
        return {
            success: true,
            count: 0,
            events: []
        };
    }
}

// Get single event by ID or slug
export async function getEventById(idOrSlug: string | number): Promise<EventDetailResponse> {
    try {
        const isNumeric = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
        const endpoint = isNumeric
            ? `/events/?id=${idOrSlug}`
            : `/events/?slug=${idOrSlug}`;

        const response = await api<EventDetailResponse>(endpoint);

        if (!response.success || !response.data) {
            throw new Error(response.error || `Failed to fetch event`);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
    }
}

// Get active event (for backward compatibility)
export async function getActiveEvent(): Promise<EventDetailResponse> {
    try {
        const response = await api<EventDetailResponse>(`/events/?active=true`);

        if (!response.success || !response.data) {
            throw new Error(response.error || `Failed to fetch active event`);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching active event:', error);
        throw error;
    }
}

// Register for an event
export async function createEventRegistration(
    registrationData: EventRegistrationRequest,
    eventSlug?: string
): Promise<EventRegistrationResponse> {
    try {
        const endpoint = eventSlug
            ? `/events/register/?slug=${eventSlug}`
            : `/events/register`;

        const response = await api<EventRegistrationResponse>(endpoint, {
            method: 'POST',
            body: JSON.stringify(registrationData),
        });

        if (!response.success || !response.data) {
            throw new Error(response.error || `Registration failed`);
        }

        return response.data;
    } catch (error) {
        console.error('Error creating registration:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        };
    }
}
