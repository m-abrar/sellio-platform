'use client';

import JobsExplorePage from '@/themes/jobs/shared/JobsExplorePage';
import { mapJobToBlueCollarCard } from '@/themes/jobs/shared/job-utils';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { BlueCollarJobCard } from './components';

export default function ExplorePage() {
  const themeLink = useJobsThemeLink();

  return (
    <JobsExplorePage
      variant="blue_collar"
      classPrefix="jbc"
      pageEyebrow="TradesWork"
      pageTitle="Explore Trade Jobs"
      pageSubtitle="Find construction, manufacturing, and skilled trade openings from your Sellio jobs catalog."
      emptyTitle="No trade jobs match your filters"
      emptyDescription="Try different trade keywords or reset filters to browse more openings."
      loadMoreLabel="Load more jobs"
      resetLabel="Reset filters"
      filterSectionClass="jbc-explore-filters"
      searchInputClass="jbc-search-input"
      selectClass="jbc-sort-select"
      gridClass="jbc-job-grid"
      primaryBtnClass="jbc-btn jbc-btn-primary"
      outlineBtnClass="jbc-btn jbc-btn-secondary"
      renderJobCard={(job) => {
        const card = mapJobToBlueCollarCard(job);
        return (
          <a className="jbc-explore-card-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
            <BlueCollarJobCard {...card} />
          </a>
        );
      }}
    />
  );
}
