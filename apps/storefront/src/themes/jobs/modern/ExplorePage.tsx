'use client';

import JobsExplorePage from '@/themes/jobs/shared/JobsExplorePage';
import { mapJobToModernCard } from '@/themes/jobs/shared/job-utils';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { ModernJobCard } from './components';

export default function ExplorePage() {
  const themeLink = useJobsThemeLink();

  return (
    <JobsExplorePage
      variant="modern"
      classPrefix="jm"
      pageEyebrow="Curated roles"
      pageTitle="Explore Modern Jobs"
      pageSubtitle="Discover ambitious roles at innovative startups and world-class tech companies."
      emptyTitle="No roles match your filters"
      emptyDescription="Try different keywords or filter settings to find your next opportunity."
      loadMoreLabel="Load more roles"
      resetLabel="Reset filters"
      filterSectionClass="jm-explore-filters"
      searchInputClass="jm-search-input"
      selectClass="jm-search-input"
      gridClass="jm-explore-grid"
      primaryBtnClass="jm-btn jm-btn-primary"
      outlineBtnClass="jm-btn jm-btn-outline"
      renderJobCard={(job) => {
        const card = mapJobToModernCard(job, Number(job.id) || 0);
        return (
          <a className="jm-explore-card-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
            <ModernJobCard {...card} />
          </a>
        );
      }}
    />
  );
}
