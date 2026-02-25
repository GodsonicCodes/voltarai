'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ButtonEffect from "@/components/ui/ButtonEffect";
import { MoveUpRight } from 'lucide-react';
import Image from "next/image";
import EventPill from "./components/event-pill";
import { getEvents } from "@/actions/events.api";
import { type EventData } from "@/schema/events.schema";
import EventCard from "./EventCard";
import ReactMarkdown from "react-markdown";

const Events = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const result = await getEvents();
                if (result.success && result.events) {
                    setEvents(result.events);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(event =>
        event.is_active !== false && new Date(event.event_date) >= new Date()
    );
    const pastEvents = events.filter(event =>
        event.is_active === false || new Date(event.event_date) < new Date()
    );
    const featuredEvent = upcomingEvents[0];

    if (isLoading) {
        return (
            <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-white">Loading events...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 md:max-w-[70%] mx-auto bg-bgBlack px-2 sm:px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-[494] textradialgradientgrey mb-8">
                        Upcoming <span className="textradialgradientblue">Events</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 mb-8">
                        Join our exclusive AI events and connect with industry leaders
                    </p>
                </motion.div>

                {/* Featured Event Banner */}
                {featuredEvent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative rounded-[20px] overflow-hidden mb-16 border border-white/20"
                    >
                        <div className="relative h-[300px] md:h-[400px]">
                            <Image
                                src={featuredEvent.hero_image_url || '/assets/seats.jpg'}
                                alt={featuredEvent.title}
                                fill
                                className='object-cover'
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <EventPill />
                                    <h3 className="text-white text-2xl md:text-3xl font-[494] mb-3 mt-4">
                                        {featuredEvent.title}
                                    </h3>
                                    <div className="text-gray-300 text-lg mb-6 max-w-2xl">
                                        <ReactMarkdown
                                          components={{
                                            p: ({node, ...props}) => (
                                              <p className="text-gray-300 mb-4" {...props} />
                                            ),
                                            h1: ({node, ...props}) => (
                                              <h1 className="text-white text-2xl font-bold mb-4" {...props} />
                                            ),
                                            h2: ({node, ...props}) => (
                                              <h2 className="text-white text-xl font-bold mb-4" {...props} />
                                            ),
                                            h3: ({node, ...props}) => (
                                              <h3 className="text-white text-lg font-bold mb-4" {...props} />
                                            ),
                                            ul: ({node, ...props}) => (
                                              <ul className="text-gray-300 mb-4 list-disc pl-6" {...props} />
                                            ),
                                            ol: ({node, ...props}) => (
                                              <ol className="text-gray-300 mb-4 list-decimal pl-6" {...props} />
                                            ),
                                            li: ({node, ...props}) => (
                                              <li className="text-gray-300 mb-2" {...props} />
                                            ),
                                            strong: ({node, ...props}) => (
                                              <strong className="text-white font-semibold" {...props} />
                                            ),
                                            em: ({node, ...props}) => (
                                              <em className="text-gray-300 italic" {...props} />
                                            ),
                                            a: ({node, ...props}) => (
                                              <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                                            ),
                                            blockquote: ({node, ...props}) => (
                                              <blockquote className="text-gray-300 border-l-4 border-gray-400 pl-4 mb-4 italic" {...props} />
                                            ),
                                            code: ({node, ...props}) => (
                                              <code className="text-white bg-gray-800 px-2 py-1 rounded text-sm" {...props} />
                                            ),
                                          }}
                                        >
                                          {featuredEvent.description}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ButtonEffect onClick={() => window.location.href = `/events/${featuredEvent.id}`}>
                                            <span>Register Now</span>
                                            <MoveUpRight className="w-4 h-4 md:w-5 md:h-5" />
                                        </ButtonEffect>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}

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
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center'>
                        {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                isPast={activeTab === 'past' || (event.is_active === false || new Date(event.event_date) < new Date())}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* No Events Message */}
                {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-16"
                    >
                        <p className="text-gray-400 text-lg">
                            {activeTab === 'upcoming'
                                ? 'No upcoming events at the moment. Check back soon!'
                                : 'No past events to display.'
                            }
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Events;
