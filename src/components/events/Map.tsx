'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapProps {
    mapLocation?: {
        latitude?: number | null;
        longitude?: number | null;
    };
    className?: string;
}

const DEFAULT_LOCATION = {
    latitude: 51.5072,   // London fallback (change if you want)
    longitude: -0.1276,
};

const MAP_TIMEOUT = 3000; // 3 seconds

const MapComponent: React.FC<MapProps> = ({
    mapLocation,
    className = '',
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [status, setStatus] = useState<
        'loading' | 'ready' | 'fallback' | 'error'
    >('loading');

    // Validate coordinates
    const lat =
        typeof mapLocation?.latitude === 'number' &&
            !isNaN(mapLocation.latitude)
            ? mapLocation.latitude
            : null;

    const lng =
        typeof mapLocation?.longitude === 'number' &&
            !isNaN(mapLocation.longitude)
            ? mapLocation.longitude
            : null;

    const hasValidCoords = lat !== null && lng !== null;

    useEffect(() => {
        let isMounted = true;

        const initializeMap = async (
            latitude: number,
            longitude: number
        ) => {
            if (!mapRef.current) return;
            if (mapInstanceRef.current) return;

            try {
                const L = (await import('leaflet')).default;

                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl:
                        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                    iconUrl:
                        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                    shadowUrl:
                        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                });

                if (!isMounted) return;

                mapInstanceRef.current = L.map(mapRef.current, {
                    center: [latitude, longitude],
                    zoom: 15,
                    zoomControl: false,
                });

                L.tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19,
                    }
                ).addTo(mapInstanceRef.current);

                markerRef.current = L.marker([
                    latitude,
                    longitude,
                ]).addTo(mapInstanceRef.current);

                setStatus('ready');
            } catch (error) {
                console.error('Map failed to initialize:', error);
                setStatus('error');
            }
        };

        // Start timeout
        timeoutRef.current = setTimeout(() => {
            if (!hasValidCoords) {
                setStatus('fallback');
                initializeMap(
                    DEFAULT_LOCATION.latitude,
                    DEFAULT_LOCATION.longitude
                );
            }
        }, MAP_TIMEOUT);

        if (hasValidCoords) {
            clearTimeout(timeoutRef.current!);
            initializeMap(lat!, lng!);
        }

        return () => {
            isMounted = false;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [hasValidCoords]);

    // Update coordinates safely
    useEffect(() => {
        if (!hasValidCoords) return;
        if (!mapInstanceRef.current || !markerRef.current) return;

        mapInstanceRef.current.setView([lat!, lng!], 15);
        markerRef.current.setLatLng([lat!, lng!]);
    }, [lat, lng]);

    // UI States
    if (status === 'error') {
        return (
            <div
                className={`w-full h-full rounded-[11px] bg-gray-900 flex items-center justify-center ${className}`}
                style={{ minHeight: '300px' }}
            >
                <p className="text-gray-400 text-sm">
                    Location not found
                </p>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div
                className={`w-full h-full rounded-[11px] bg-gray-900 flex items-center justify-center ${className}`}
                style={{ minHeight: '300px' }}
            >
                <p className="text-gray-400 text-sm">
                    Detecting location...
                </p>
            </div>
        );
    }

    return (
        <div
            className={`w-full h-full rounded-[11px] overflow-hidden ${className}`}
            style={{ minHeight: '300px' }}
        >
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
};

const Map = dynamic(() => Promise.resolve(MapComponent), {
    ssr: false,
});

export default Map;