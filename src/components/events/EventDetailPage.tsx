'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MoveUpRight } from 'lucide-react';
import ButtonEffect from "@/components/ui/ButtonEffect";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import SeatsImage from "../../../public/assets/seats.jpg";
import person1 from "@/../public/assets/people/person1.jpeg";
import person2 from "@/../public/assets/people/person2.jpeg";
import person3 from "@/../public/assets/people/person3.jpeg";
import person4 from "@/../public/assets/people/person4.jpeg";

import Setting from "@/components/events/components/setting";
import Map from "./Map";
import EventRegistrationForm from "./components/EventRegistrationForm";
import EventPill from "./components/event-pill";

import { getEventById } from "@/actions/events.api";
import { type EventData } from "@/schema/events.schema";

interface EventDetailPageProps {
  event: EventData;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Initialize safely from server data
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const result = await getEventById(event.id);

        if (result?.success && result?.event) {
          setEventData(result.event);
        } else {
          // Fallback to passed event if API fails
          setEventData(event);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        // Fallback to passed event on error
        setEventData(event);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [event.id]);

  // ✅ Safe date parsing
  const isPastEvent = useMemo(() => {
    const dateValue = eventData?.event_date;

    if (!dateValue) return false;

    const parsed = new Date(dateValue);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, [eventData?.event_date]);

  // ✅ Enterprise-safe data resolver (nullish coalescing)
  const displayData = useMemo(() => ({
    sponsor: eventData?.sponsor ?? event.sponsor ?? "A Voltar AI Sponsored Event",
    title: eventData?.title ?? event.title ?? "Untitled Event",
    description:
      eventData?.description ??
      event.description ??
        "Join us for an exclusive in-person gathering where innovation meets community.",
    location: eventData?.location_name ?? event.location_name ?? "Tema, Community 1",
    address:
      eventData?.address ?? event.address ?? "Burbs Hotel, Opposite NY FM 1016",
    date: eventData?.event_date ?? event.event_date ?? "",
    startTime: eventData?.start_time ?? event.start_time ?? "18:00",
    endTime: eventData?.end_time ?? event.end_time ?? "23:00",
    timezone: eventData?.timezone ?? event.timezone ?? "GMT",
    registeredPeople: (eventData?.attendee_display || (eventData?.attendee_display === '' ? 'Registration open' : '10k+ people joined')) ?? (event.attendee_display || (event.attendee_display === '' ? 'Registration open' : '10k+ people joined')),
    latitude: eventData?.latitude ?? event.latitude ?? null,
    longitude: eventData?.longitude ?? event.longitude ?? null,
    imageUrl: imageError ? SeatsImage : (eventData?.hero_image_url ?? event.hero_image_url ?? SeatsImage),
    slug: eventData?.slug ?? event.slug,
    formHtml: eventData?.form_html ?? event.form_html,
  }), [eventData, event]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[1100px] px-5 lg:px-8 pt-6 pb-16 flex flex-col gap-10">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/events"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[304px] md:h-[744px] rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src={displayData.imageUrl}
              alt={displayData.title}
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
              priority
              unoptimized
              onError={() => setImageError(true)}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                console.log('📸 EventDetailPage Image Loaded:', {
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

          <EventPill className="absolute top-4 right-4 lg:hidden" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-[18px] lg:text-[25px]">
              {displayData.sponsor}
            </p>

            <EventPill className="hidden lg:flex" />
          </div>

          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            {displayData.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[person1, person2, person3, person4].map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Person ${idx + 1}`}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>

            <p className="text-white/60 text-[18px] lg:text-[22px]">
              {displayData.registeredPeople} people joined
            </p>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <Setting
            detail="location"
            location={displayData.location}
            venue={displayData.address}
          />

          <Setting
            detail="date"
            date={displayData.date}
            timeRange={`${displayData.startTime} - ${displayData.endTime} (${displayData.timezone})`}
          />
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-4 max-w-[800px]"
        >
          <h2 className="text-white text-lg lg:text-[25px] font-semibold">
            About Event
          </h2>

          <p className="text-white/50 text-[16px] lg:text-[20px] leading-relaxed">
            {displayData.description}
          </p>
        </motion.div>

        {/* Maps */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-white text-lg lg:text-[25px] font-semibold">
            Maps
          </h2>

          <Setting
            detail="location"
            location={displayData.location}
            venue={displayData.address}
          />

          <div className="relative z-10 w-full h-[220px] md:h-[280px] lg:h-[350px] rounded-2xl overflow-hidden">
            <Map
              mapLocation={{
                latitude: displayData.latitude ?? null,
                longitude: displayData.longitude ?? null,
              }}
            />
          </div>
        </motion.div>

        {/* CTA */}
        {!isPastEvent && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ButtonEffect
              className="w-full lg:w-[420px] h-[56px] text-center whitespace-nowrap"
              onClick={() => setShowRegistrationForm(true)}
            >
              Register Now <MoveUpRight size={16} className="inline ml-1" />
            </ButtonEffect>
          </motion.div>
        )}

        {/* Modal */}
        {showRegistrationForm && (
          <EventRegistrationForm
            onClose={() => setShowRegistrationForm(false)}
            eventTitle={displayData.title}
            eventSlug={displayData.slug}
            registrationHtml={displayData.formHtml}
            isPastEvent={isPastEvent}
          />
        )}

      </div>
    </div>
  );
};

export default EventDetailPage;