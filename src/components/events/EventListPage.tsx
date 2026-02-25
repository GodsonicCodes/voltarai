'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import { getEvents, getEventById } from '@/actions/events.api';
import { type EventData } from '@/schema/events.schema';
import EventCard from './EventCard';
import ButtonEffect from '@/components/ui/ButtonEffect';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

const EventListPage: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
    const [pastEvents, setPastEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch upcoming events
                const upcomingResult = await getEvents(true);
                let upcomingDetailed: EventData[] = [];
                if (upcomingResult.success && upcomingResult.events) {
                    // Fetch detailed data for each upcoming event
                    upcomingDetailed = await Promise.all(
                        upcomingResult.events.map(async (event) => {
                            const detailResult = await getEventById(event.id);
                            return detailResult?.success && detailResult?.event 
                                ? detailResult.event 
                                : event;
                        })
                    );
                    setUpcomingEvents(upcomingDetailed);
                }

                // Fetch all events for past events
                let past: EventData[] = [];
                const allResult = await getEvents(false);
                if (allResult.success && allResult.events) {
                    // Filter past events first
                    const pastEvents = allResult.events.filter(event =>
                        new Date(event.event_date) < new Date()
                    );
                    
                    // Fetch detailed data for each past event
                    past = await Promise.all(
                        pastEvents.map(async (event) => {
                            const detailResult = await getEventById(event.id);
                            return detailResult?.success && detailResult?.event 
                                ? detailResult.event 
                                : event;
                        })
                    );
                    setPastEvents(past);
                }

                setEvents([...upcomingDetailed, ...past]);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    if (isLoading) {
        return (
            <div className='min-h-screen bg-bgBlack flex items-center justify-center'>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className='text-center mb-16'
            >
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-[494] textradialgradientgrey mb-6'>
                    Voltar AI <span className='textradialgradientblue'>Events</span>
                </h1>
                <p className='text-gray-300 text-lg md:text-xl max-w-3xl mx-auto'>
                    Join us for exciting AI events, workshops, and conferences. Connect with industry experts and discover the future of artificial intelligence.
                </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='flex justify-center mb-12'
            >
                <div className='inline-flex bg-[#1a1a1a] rounded-lg p-1 border border-white/20'>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === 'upcoming'
                            ? 'bg-black text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Upcoming Events ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === 'past'
                            ? 'bg-black text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Past Events ({pastEvents.length})
                    </button>
                </div>
            </motion.div>

            {/* Events Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='space-y-8'
            >
                {currentEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className='text-center py-16'
                    >
                        <div className='text-gray-400 text-xl mb-4'>
                            {activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
                        </div>
                        <p className='text-gray-500 text-base'>
                            {activeTab === 'upcoming'
                                ? 'Check back soon for new events and workshops.'
                                : 'Past events will appear here once they conclude.'
                            }
                        </p>
                    </motion.div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center'>
                        {currentEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                isPast={activeTab === 'past'}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default EventListPage;
