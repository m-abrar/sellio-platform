'use client';

import React from 'react';
import type { EventListing } from '@sellio/types';
import EventsExplorePage from '@/themes/events/shared/EventsExplorePage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import {
  formatEventDateShort,
  getMusicEventImage,
} from '@/themes/events/shared/event-utils';

const fallbackImages = [
  '/themes/events/music/11.webp',
  '/themes/events/music/12.webp',
  '/themes/events/music/13.webp',
  '/themes/events/music/14.webp',
];

function mapEventToHeadliner(event: EventListing, index: number) {
  return {
    name: event.specs?.brand || event.specs?.category || 'HEADLINER',
    eventTitle: event.title,
    date: formatEventDateShort(event),
    image: getMusicEventImage(event) || fallbackImages[index % fallbackImages.length],
    slug: event.slug,
  };
}

export default function ExplorePage() {
  const themeLink = useEventsThemeLink();

  return (
    <EventsExplorePage
      variant="music"
      classPrefix="evm"
      pageEyebrow="PULSE // LIVE TRANSMISSION"
      pageTitle="Explore Music Events"
      pageSubtitle="Browse live concerts, festivals, and underground sessions from your Sellio events catalog."
      emptyTitle="No events match your filters"
      emptyDescription="Adjust search or filter settings to discover more headliners."
      loadMoreLabel="Load more events"
      resetLabel="Reset filters"
      filterSectionClass="evm-explore-filters"
      searchInputClass="evm-filter-input"
      selectClass="evm-filter-select"
      gridClass="evm-explore-grid"
      primaryBtnClass="sonic-btn-primary"
      outlineBtnClass="sonic-btn-primary"
      renderShimmerCard={(item) => (
        <div className="artist-card-premium evm-listing-skeleton" key={item}>
          <div className="evm-skeleton-image" />
          <div className="evm-skeleton-line evm-skeleton-line-title" />
        </div>
      )}
      renderEventCard={(event) => {
        const headliner = mapEventToHeadliner(event, event.id);
        return (
          <a className="evm-explore-card-link" href={themeLink(`/product/${headliner.slug}`)} key={event.id}>
            <div className="artist-card-premium">
              <img src={headliner.image} alt={headliner.name} className="artist-img" />
              <div className="artist-info">
                <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {headliner.eventTitle}
                </div>
                <div className="artist-name">{headliner.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 800, marginTop: '1rem' }}>
                  {headliner.date}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
            </div>
          </a>
        );
      }}
    />
  );
}
