'use client';

import JobsExplorePage from '@/themes/jobs/shared/JobsExplorePage';
import { mapJobToFreelanceGig } from '@/themes/jobs/shared/job-utils';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { GigCard } from './components';

export default function ExplorePage() {
  const themeLink = useJobsThemeLink();

  return (
    <JobsExplorePage
      variant="freelance"
      classPrefix="jf"
      pageEyebrow="GigHive Pro"
      pageTitle="Explore Freelance Gigs"
      pageSubtitle="Browse professional services and freelance opportunities from your Sellio jobs catalog."
      emptyTitle="No gigs match your filters"
      emptyDescription="Adjust search or filters to discover more freelance services."
      loadMoreLabel="Load more gigs"
      resetLabel="Reset filters"
      filterSectionClass="jf-explore-filters"
      searchInputClass="jf-search-input"
      selectClass="jf-search-input"
      gridClass="jf-explore-grid"
      primaryBtnClass="jf-btn jf-btn-primary"
      outlineBtnClass="jf-btn jf-btn-primary"
      renderJobCard={(job) => {
        const gig = mapJobToFreelanceGig(job, Number(job.id) || 0);
        return (
          <a className="jf-explore-card-link" href={themeLink(`/product/${gig.slug}`)} key={job.id}>
            <GigCard {...gig} />
          </a>
        );
      }}
    />
  );
}
