import React from 'react';
import { notFound } from 'next/navigation';
import EventDetailPage from '@/components/events/EventDetailPage';
import { getEventById } from '@/actions/events.api';

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
    const { id } = await params;

    try {
        const result = await getEventById(id);

        if (result.success && result.event) {
            return <EventDetailPage event={result.event} />;
        }
    } catch (error) {
        console.error('Error fetching event:', error);
    }

    // Event not found
    notFound();
};

export default EventPage;

// Generate static params for static generation (optional)
export async function generateStaticParams() {
    try {
        const { getEvents } = await import('@/actions/events.api');
        const result = await getEvents();
        if (result.success && result.events) {
            return result.events.map((event) => ({
                id: event.slug || event.id.toString(),
            }));
        }
    } catch (error) {
        console.error('Error fetching events for static params:', error);
    }
    return [];
}

// Set metadata for page
export async function generateMetadata({ params }: EventPageProps) {
    const { id } = await params;

    try {
        const result = await getEventById(id);
        if (result.success && result.event) {
            return {
                title: `${result.event.title} - Voltar AI Events`,
                description: result.event.description,
                openGraph: {
                    title: result.event.title,
                    description: result.event.description,
                    images: result.event.hero_image_url ? [result.event.hero_image_url] : [],
                },
            };
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title: 'Event - Voltar AI Events',
        description: 'Join us for exciting AI events and workshops.',
    };
}
