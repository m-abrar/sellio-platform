'use client';

import React from 'react';
import type { EventListing } from '@sellio/types';
import { StageLineupCard } from './components';
import EventsExplorePage from '@/themes/events/shared/EventsExplorePage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { getFestivalEventImage } from '@/themes/events/shared/event-utils';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const fallbackImages = [
  '/themes/events/festival/11.webp',
  '/themes/events/festival/12.webp',
  '/themes/events/festival/13.webp',
  '/themes/events/festival/14.webp',
];

function formatEventDateShort(dateStr?: string | null) {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  return `${months[date.getMonth()]}_${String(date.getDate()).padStart(2, '0')}_${date.getFullYear()}`;
}

function mapEventToStage(event: EventListing) {
  const location =
    event.location?.city ||
    event.location?.map_title ||
    [event.location?.state, event.location?.country].filter(Boolean).join(' ') ||
    'Global Node';

  return {
    title: event.title,
    location,
    date: formatEventDateShort(event.schedule?.start_at),
    image: getFestivalEventImage(event) || fallbackImages[event.id % fallbackImages.length],
    slug: event.slug,
  };
}

export default function ExplorePage() {
  const themeLink = useEventsThemeLink();

  return (
    <EventsExplorePage
      variant="festival"
      classPrefix="eff"
      pageEyebrow="OFFICIAL_FESTIVAL_REGISTRY"
      pageTitle="Explore Festival Stages"
      pageSubtitle="Browse neon stages, weekenders, and high-vibe environments from your Sellio events catalog."
      emptyTitle="No festival stages matched"
      emptyDescription="Adjust filters to discover more neon nodes."
      loadMoreLabel="Load more stages"
      resetLabel="Reset filters"
      filterSectionClass="eff-explore-filters"
      searchInputClass="eff-filter-input"
      selectClass="eff-filter-select"
      gridClass="eff-explore-grid"
      primaryBtnClass="eff-btn-primary"
      outlineBtnClass="eff-btn-primary"
      renderEventCard={(event) => {
        const stage = mapEventToStage(event);
        return (
          <a className="eff-explore-card-link" href={themeLink(`/product/${stage.slug}`)} key={event.id}>
            <StageLineupCard {...stage} />
          </a>
        );
      }}
    />
  );
}
