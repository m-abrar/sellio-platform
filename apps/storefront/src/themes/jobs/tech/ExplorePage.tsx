'use client';

import JobsExplorePage from '@/themes/jobs/shared/JobsExplorePage';
import { translateJobListingToTechJob } from '@/themes/jobs/shared/job-utils';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { TechJobCard } from './components';

export default function ExplorePage() {
  const themeLink = useJobsThemeLink();

  return (
    <JobsExplorePage
      variant="tech"
      classPrefix="jt"
      pageEyebrow="DEV_JOBS // CATALOG"
      pageTitle="Explore Tech Jobs"
      pageSubtitle="Search engineering roles by stack, workplace, and experience level from your Sellio jobs catalog."
      emptyTitle="No developer jobs match your filters"
      emptyDescription="Adjust grep filters or reset the console to browse alternative listings."
      loadMoreLabel="Load more roles"
      resetLabel="Reset filters"
      filterSectionClass="jt-explore-filters"
      searchInputClass="jt-search-input"
      selectClass="jt-search-input"
      gridClass="jt-job-list"
      primaryBtnClass="jt-btn jt-btn-primary"
      outlineBtnClass="jt-btn jt-btn-outline"
      renderJobCard={(job) => {
        const card = translateJobListingToTechJob(job);
        return (
          <a className="jt-explore-card-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
            <TechJobCard {...card} />
          </a>
        );
      }}
    />
  );
}
