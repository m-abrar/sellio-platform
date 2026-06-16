'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '@/components/menu/MenuProvider';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

const MAP_NAV_LINKS = [
  { href: '/explore', label: 'Browse' },
  { href: '/explore', label: 'Buy' },
  { href: '/explore', label: 'Rent' },
  { href: '/', label: 'New Listings' },
];

export const MapHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = usePropertyThemeLink();
  const cmsNavItems = useMenu('main_header');

  return (
    <header className="pm-header">
      <a href={themeLink('/')} className="pm-logo">
        MAP<span>NEXUS</span>
      </a>

      <button
        className={`pm-hamburger${isOpen ? ' pm-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        type="button"
      >
        <span className="pm-hamburger-bar" />
        <span className="pm-hamburger-bar" />
        <span className="pm-hamburger-bar" />
      </button>

      <div className={`pm-nav-panel${isOpen ? ' pm-nav-open' : ''}`}>
        <nav className="pm-nav" aria-label="Main navigation">
          {cmsNavItems.length > 0
            ? cmsNavItems.map((item) => (
                <a
                  key={item.id}
                  href={themeLink(item.url ?? '/')}
                  className="pm-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </a>
              ))
            : MAP_NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={themeLink(item.href)}
                  className="pm-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
        </nav>
        <a href={themeLink('/explore')} className="pm-cta-btn pm-mobile-cta" onClick={() => setIsOpen(false)}>
          Search Map
        </a>
      </div>

      <a href={themeLink('/explore')} className="pm-cta-btn pm-desktop-cta">
        Search Map
      </a>
    </header>
  );
};

export const MapListCard = ({
  price,
  address,
  beds,
  baths,
  sqft,
  image,
  isActive,
}: {
  price: string;
  address: string;
  beds: number | string;
  baths: number | string;
  sqft: string;
  image: string;
  isActive?: boolean;
}) => (
  <div className={`pm-list-card${isActive ? ' pm-card-active' : ''}`}>
    <img src={image} alt={address} className="pm-card-image" />
    <div className="pm-card-info">
      <div className="pm-price">{price}</div>
      <div className="pm-card-address">{address}</div>
      <div className="pm-card-specs">
        <span>{beds} bd</span>
        <span>{baths} ba</span>
        <span>{sqft} sqft</span>
      </div>
    </div>
  </div>
);

export interface MapMarker {
  lat: number;
  lng: number;
  price: string;
  address: string;
  slug: string;
}

export function MapCanvas({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[];
  selectedSlug: string | null;
  onMarkerClick: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerLayersRef = useRef<any[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  const markersRef = useRef(markers);

  useEffect(() => { onMarkerClickRef.current = onMarkerClick; });

  function placeMarkers(L: any, map: any) {
    markerLayersRef.current.forEach((m) => m.remove());
    markerLayersRef.current = [];

    markersRef.current.forEach((m) => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="pm-pin-bubble">${m.price}</div>`,
        iconSize: null,
        iconAnchor: [44, 18],
      });

      const marker = L.marker([m.lat, m.lng], { icon })
        .addTo(map)
        .on('click', () => onMarkerClickRef.current(m.slug));

      marker.bindTooltip(m.address, {
        direction: 'top',
        offset: [0, -24],
        className: 'pm-map-tooltip',
      });

      markerLayersRef.current.push(marker);
    });

    // Fit map view to show all markers
    if (markerLayersRef.current.length === 1) {
      const m = markersRef.current[0];
      map.setView([m.lat, m.lng], 14);
    } else if (markerLayersRef.current.length > 1) {
      const group = L.featureGroup(markerLayersRef.current);
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  // Initialise Leaflet once on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const mapEl = containerRef.current;

    function initMap(L: any) {
      if (mapRef.current) return;

      const map = L.map(mapEl, {
        zoomControl: false,
        center: [40.758, -73.968],
        zoom: 12,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
      placeMarkers(L, map);
    }

    // Load Leaflet CSS once
    if (!document.getElementById('pm-leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'pm-leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const L = (window as any).L;
    if (L) {
      initMap(L);
    } else {
      let script = document.getElementById('pm-leaflet-js') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'pm-leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);
      }
      script.addEventListener('load', () => initMap((window as any).L), { once: true });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Re-place markers when listing data changes
  useEffect(() => {
    markersRef.current = markers;
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    placeMarkers(L, mapRef.current);
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className="pm-leaflet-container"
      aria-label="Property map"
    />
  );
}

export const MapHUD = () => (
  <div className="pm-map-hud">
    <div className="pm-hud-label">Location</div>
    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>40.7128° N, 74.0060° W</div>
    <div className="pm-hud-label">Coverage</div>
    <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} style={{ flex: 1, background: i < 8 ? 'var(--pm-gold)' : 'rgba(255,255,255,0.1)' }} />
      ))}
    </div>
  </div>
);
