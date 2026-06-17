'use client';
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { useMenu } from '@/components/menu/MenuProvider';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

const MAP_NAV_LINKS = [
  { href: '/explore?type=buy', label: 'Buy' },
  { href: '/explore?type=rent', label: 'Rent' },
  { href: '/explore?sort=newest', label: 'New Listings' },
  { href: '/explore?type=commercial', label: 'Commercial' },
  { href: '/#about', label: 'About' },
];

export const MapHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = usePropertyThemeLink();
  const cmsNavItems = useMenu('main_header');
  const brandLabel = useThemeContent('header.brand_label', 'MapNexus');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Nexus');
  const brandPrefix = brandLabel.endsWith(brandHighlight)
    ? brandLabel.slice(0, -brandHighlight.length)
    : brandLabel;
  const brandSuffix = brandLabel.endsWith(brandHighlight) ? brandHighlight : '';

  return (
    <header className="pm-header">
      <a href={themeLink('/')} className="pm-logo">
        {brandSuffix ? <>{brandPrefix}<span>{brandSuffix}</span></> : brandLabel}
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
  selectedSlug,
  onMarkerClick,
  loading = false,
}: {
  markers: MapMarker[];
  selectedSlug: string | null;
  onMarkerClick: (slug: string) => void;
  loading?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const slugToMarkerRef = useRef<Map<string, any>>(new Map());
  const onMarkerClickRef = useRef(onMarkerClick);
  const markersRef = useRef(markers);
  const [mapError, setMapError] = useState(false);

  useEffect(() => { onMarkerClickRef.current = onMarkerClick; });

  function buildIcon(L: any, price: string, active: boolean) {
    return L.divIcon({
      className: '',
      html: `<div class="pm-pin-bubble${active ? ' pm-pin-bubble--active' : ''}">${price}</div>`,
      iconSize: null,
      iconAnchor: [44, 18],
    });
  }

  function placeMarkers(L: any, map: any) {
    slugToMarkerRef.current.forEach((m) => m.remove());
    slugToMarkerRef.current = new Map();

    markersRef.current.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], { icon: buildIcon(L, m.price, false) })
        .addTo(map)
        .on('click', () => onMarkerClickRef.current(m.slug));

      marker.bindTooltip(m.address, {
        direction: 'top',
        offset: [0, -24],
        className: 'pm-map-tooltip',
      });

      slugToMarkerRef.current.set(m.slug, { marker, data: m });
    });

    if (slugToMarkerRef.current.size === 1) {
      const m = markersRef.current[0];
      map.setView([m.lat, m.lng], 14);
    } else if (slugToMarkerRef.current.size > 1) {
      const layers = Array.from(slugToMarkerRef.current.values()).map((e) => e.marker);
      const group = L.featureGroup(layers);
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
        center: [20, 0],
        zoom: 2,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
      placeMarkers(L, map);
    }

    let cancelled = false;
    import('leaflet').then(({ default: L }) => {
      if (!cancelled) initMap(L);
    }).catch(() => {
      if (!cancelled) setMapError(true);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Re-place markers when listing data changes
  useEffect(() => {
    markersRef.current = markers;
    if (!mapRef.current) return;
    import('leaflet').then(({ default: L }) => {
      if (mapRef.current) placeMarkers(L, mapRef.current);
    });
  }, [markers]);

  // Highlight active marker when selectedSlug changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(({ default: L }) => {
      slugToMarkerRef.current.forEach(({ marker, data }, slug) => {
        marker.setIcon(buildIcon(L, data.price, slug === selectedSlug));
      });
      if (selectedSlug) {
        const entry = slugToMarkerRef.current.get(selectedSlug);
        if (entry) {
          mapRef.current.panTo([entry.data.lat, entry.data.lng], { animate: true, duration: 0.4 });
        }
      }
    });
  }, [selectedSlug]);

  if (mapError) {
    return (
      <div className="pm-map-error" role="alert">
        <div className="pm-map-error-icon">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <p className="pm-map-error-title">Map unavailable</p>
        <p className="pm-map-error-desc">The interactive map could not be loaded. Browse listings from the sidebar.</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="pm-leaflet-container"
        aria-label="Property map"
      />
      {loading && (
        <div className="pm-map-loading" aria-label="Loading properties" aria-live="polite">
          <div className="pm-map-spinner" aria-hidden="true" />
        </div>
      )}
    </>
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
