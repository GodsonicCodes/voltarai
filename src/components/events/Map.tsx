'use client';

import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';

interface MapProps {
    mapLocation?: {
        latitude?: number | null;
        longitude?: number | null;
    };
    className?: string;
}

const DEFAULT_LOCATION = {
    latitude: 5.6667,   // Tema, Ghana (more precise)
    longitude: -0.0167,
};

const MAP_TIMEOUT = 3000; // 3 seconds

const MapComponent: React.FC<MapProps> = memo(({
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

    // Validate coordinates - memoized
    const coordinates = useMemo(() => {
        const lat =
            typeof mapLocation?.latitude === 'number' &&
                !isNaN(mapLocation.latitude) &&
                mapLocation.latitude >= -90 && 
                mapLocation.latitude <= 90
                ? mapLocation.latitude
                : null;

        const lng =
            typeof mapLocation?.longitude === 'number' &&
                !isNaN(mapLocation.longitude) &&
                mapLocation.longitude >= -180 && 
                mapLocation.longitude <= 180
                ? mapLocation.longitude
                : null;

        const result = { lat, lng, hasValidCoords: lat !== null && lng !== null };
        
        console.log('🗺️ Map Coordinates:', {
            received: mapLocation,
            processed: result,
            latType: typeof mapLocation?.latitude,
            lngType: typeof mapLocation?.longitude,
            latValue: mapLocation?.latitude,
            lngValue: mapLocation?.longitude
        });

        return result;
    }, [mapLocation?.latitude, mapLocation?.longitude]);

    // Initialize map function - memoized
    const initializeMap = useCallback(async (
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

            mapInstanceRef.current = L.map(mapRef.current, {
                center: [latitude, longitude],
                zoom: 15,
                zoomControl: false,
            });

            // Force map to invalidate and redraw
            setTimeout(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                }
            }, 100);

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
    }, []);

    useEffect(() => {
        let isMounted = true;

        // If coordinates are invalid, initialize immediately with fallback
        if (!coordinates.hasValidCoords) {
            setStatus('fallback');
            // Small delay to ensure DOM is ready
            const fallbackTimer = setTimeout(() => {
                if (isMounted && mapRef.current) {
                    initializeMap(
                        DEFAULT_LOCATION.latitude,
                        DEFAULT_LOCATION.longitude
                    );
                }
            }, 100);

            return () => {
                isMounted = false;
                clearTimeout(fallbackTimer);
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                    markerRef.current = null;
                }
            };
        }

        // If coordinates are valid, initialize immediately
        if (coordinates.hasValidCoords) {
            setStatus('ready');
            const validTimer = setTimeout(() => {
                if (isMounted && mapRef.current) {
                    initializeMap(coordinates.lat!, coordinates.lng!);
                }
            }, 100);

            return () => {
                isMounted = false;
                clearTimeout(validTimer);
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                    markerRef.current = null;
                }
            };
        }

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [coordinates.hasValidCoords, coordinates.lat, coordinates.lng, initializeMap]);

    // Update coordinates safely
    useEffect(() => {
        if (!coordinates.hasValidCoords) return;
        if (!mapInstanceRef.current || !markerRef.current) return;

        mapInstanceRef.current.setView([coordinates.lat!, coordinates.lng!], 15);
        markerRef.current.setLatLng([coordinates.lat!, coordinates.lng!]);
    }, [coordinates.lat, coordinates.lng]);

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
            style={{ 
                minHeight: '300px',
                height: '100%',
                width: '100%',
                position: 'relative'
            }}
        >
            <div 
                ref={mapRef} 
                className="w-full h-full" 
                style={{ 
                    height: '100%', 
                    width: '100%',
                    minHeight: '300px'
                }} 
            />
        </div>
    );
});

const Map = dynamic(() => Promise.resolve(MapComponent), {
    ssr: false,
});

export default Map;