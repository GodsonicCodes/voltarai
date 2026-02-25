'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type EventData } from '@/schema/events.schema';

interface EventCardProps {
    event: EventData;
    index: number;
    isPast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, index, isPast = false }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/events/${event.id}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 80,
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative rounded-[20px] flex flex-col items-center text-center shadow-lg w-full mx-auto hover:scale-[1.04] transition-transform duration-300 cursor-pointer"
                style={{
                    minHeight: "420px",
                    maxWidth: "340px",
                }}
            >
                {/* Radial gradient background */}
                <motion.div
                    className="absolute inset-0 rounded-lg z-0 bg-bgBlack group-hover:bg-[radial-gradient(circle_at_50%_40%,#183b7a_0%,#0a1747_100%)] transition-colors duration-300"
                    initial={{ opacity: 0.7 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                />

                <div className="relative z-10 border border-white/20 rounded-lg flex flex-col h-full px-4 pt-6 pb-6">
                    {/* Event Image */}
                    <div className='relative h-48 w-full rounded-lg overflow-hidden mb-4 border border-white/10'>
                        <div className="absolute inset-0">
                            <Image
                                src={imageError ? '/assets/seats.jpg' : (event.hero_image_url || '/assets/seats.jpg')}
                                alt={event.title}
                                fill
                                className='object-cover'
                                sizes="(max-width: 340px) 100vw, 340px"
                                style={{ objectPosition: 'center' }}
                                unoptimized
                                onError={() => setImageError(true)}
                                onLoad={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    console.log('📸 EventCard Image Loaded:', {
                                        naturalWidth: target.naturalWidth,
                                        naturalHeight: target.naturalHeight,
                                        containerWidth: target.width,
                                        containerHeight: target.height,
                                        aspectRatio: `${target.naturalWidth}x${target.naturalHeight}`,
                                        timestamp: new Date().toISOString()
                                    });
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className='absolute top-3 right-3'>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${isPast
                            ? 'bg-gray-900/80 text-gray-300 border border-white/20'
                            : 'bg-blue-600/80 text-white border border-white/20'
                            }`}>
                            {isPast ? 'Past Event' : 'Upcoming'}
                        </div>
                    </div>

                    {/* Sponsor */}
                    <div className='mb-3'>
                        <p className='text-gray-400 text-xs font-medium uppercase tracking-wider'>
                            {event.sponsor}
                        </p>
                    </div>

                    {/* Title */}
                    <h3 className='text-white text-lg font-[494] mb-3 line-clamp-2 group-hover:text-white transition-colors'>
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className='text-gray-300 text-sm mb-4 line-clamp-3 grow'>
                        {event.description}
                    </p>

                    {/* Event Details */}
                    <div className='space-y-2 mb-4'>
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <Calendar className='w-4 h-4 shrink-0' />
                            <span>{event.event_date}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <Clock className='w-4 h-4 shrink-0' />
                            <span>{event.start_time || '18:30'} - {event.end_time || '20:30'} ({event.timezone || 'UTC'})</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <MapPin className='w-4 h-4 shrink-0' />
                            <span className='truncate'>{event.location_name}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <Users className='w-4 h-4 shrink-0' />
                            <span>{event.attendee_display || (event.attendee_display === '' ? 'Registration open' : 'View registration')}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className='flex items-center justify-between mt-auto'>
                        <span className={`text-sm font-medium ${isPast
                            ? 'text-gray-400'
                            : 'text-blue-400'
                            }`}>
                            {isPast ? 'Event Concluded' : 'Registration Open'}
                        </span>
                        <div className='flex items-center gap-1 text-gray-300 hover:text-white transition-colors'>
                            <span className='text-sm font-medium'>View Details</span>
                            <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default EventCard;
