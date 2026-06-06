import React, { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const googleMapsScriptId = 'sellio-google-maps-js';

declare global {
  interface Window {
    __sellioGoogleMapsPromise?: Promise<any>;
  }
}

const loadGoogleMaps = (apiKey: string): Promise<any> => {
  if ((window as any).google?.maps) {
    return Promise.resolve((window as any).google.maps);
  }

  if (!window.__sellioGoogleMapsPromise) {
    window.__sellioGoogleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(googleMapsScriptId);

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve((window as any).google.maps), { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = googleMapsScriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).google.maps);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return window.__sellioGoogleMapsPromise;
};

interface GoogleMapPickerProps {
  apiKey?: string | null;
  latitude: string;
  longitude: string;
  label?: string;
  onChange: (latitude: string, longitude: string) => void;
}

export default function GoogleMapPicker({
  apiKey,
  latitude,
  longitude,
  label = 'listing',
  onChange,
}: GoogleMapPickerProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const readPosition = useCallback(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return {
      lat: Number.isFinite(lat) ? lat : 0,
      lng: Number.isFinite(lng) ? lng : 0,
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!apiKey || !mapElementRef.current) return;

    let isMounted = true;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!isMounted || !mapElementRef.current) return;

        const initialPosition = readPosition();
        const hasCoordinates = latitude !== '' && longitude !== '';
        const map = new maps.Map(mapElementRef.current, {
          center: initialPosition,
          zoom: hasCoordinates ? 15 : 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const marker = new maps.Marker({
          position: initialPosition,
          map,
          draggable: true,
          title: `Drag to set ${label} location`,
        });

        const writePosition = (position: any) => {
          onChange(position.lat().toFixed(7), position.lng().toFixed(7));
        };

        marker.addListener('dragend', (event: any) => writePosition(event.latLng));
        map.addListener('click', (event: any) => {
          marker.setPosition(event.latLng);
          writePosition(event.latLng);
        });

        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch(() => {
        toast.error('Google Maps could not be loaded.');
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, label]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (latitude === '' || longitude === '') return;

    const position = readPosition();
    markerRef.current.setPosition(position);
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(15);
  }, [latitude, longitude, readPosition]);

  if (!apiKey) {
    return (
      <div className="md:col-span-2 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Map picker disabled</p>
        <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed">
          Add a Google Maps key in admin settings to enable drag-and-drop pin selection.
        </p>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-100 shadow-inner">
      <div ref={mapElementRef} className="h-[320px] w-full" />
    </div>
  );
}
