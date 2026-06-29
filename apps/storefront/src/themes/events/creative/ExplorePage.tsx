'use client';

import React from 'react';
import type { EventListing } from '@/types';
import { ArtisanEventCard } from './components';
import EventsExplorePage from '@/themes/events/shared/EventsExplorePage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { formatEventDateUnderscore, getEventLocationLabel } from '@/themes/events/shared/event-utils';

function mapEventToArtisan(event: EventListing) {
  return {
    title: event.title,
    location: getEventLocationLabel(event),
    date: formatEventDateUnderscore(event.schedule?.start_at),
    status: event.specs?.event_genre || event.specs?.category || 'active',
    slug: event.slug,
  };
}

export default function ExplorePage() {
  const themeLink = useEventsThemeLink();

  return (
    <EventsExplorePage
      variant="creative"
      classPrefix="evc"
      pageEyebrow="EXPERIMENTAL_EVENT_REGISTRY"
      pageTitle="Explore Creative Events"
      pageSubtitle="Filter experimental assemblies, labs, and artisan showcases from your live Sellio catalog."
      emptyTitle="No registry entries matched"
      emptyDescription="Adjust filters to discover more creative nodes."
      loadMoreLabel="Load more registry entries"
      resetLabel="Reset filters"
      filterSectionClass="evc-explore-filters"
      searchInputClass="evc-filter-input"
      selectClass="evc-filter-select"
      gridClass="evc-explore-grid"
      primaryBtnClass="evc-btn-primary"
      outlineBtnClass="evc-btn-primary"
      renderEventCard={(event) => {
        const artisan = mapEventToArtisan(event);
        return (
          <a className="evc-explore-card-link" href={themeLink(`/product/${artisan.slug}`)} key={event.id}>
            <ArtisanEventCard {...artisan} />
          </a>
        );
      }}
    />
  );
}
