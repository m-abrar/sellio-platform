import type { JobListing } from '@sellio/types';

const CORPORATE_LOGOS = [
  '/themes/jobs/corporate/1.webp',
  '/themes/jobs/corporate/2.webp',
  '/themes/jobs/corporate/3.webp',
  '/themes/jobs/corporate/4.webp',
  '/themes/jobs/corporate/5.webp',
];

export function formatJobCompensation(job: JobListing): string {
  return job.compensation?.range_compact || job.compensation?.range_full || 'Competitive';
}

export function getJobLocationDisplay(job: JobListing): string {
  return (
    job.location?.display ||
    [job.location?.city, job.location?.state].filter(Boolean).join(', ') ||
    'Remote'
  );
}

export function formatTimeAgo(dateStr?: string | null): string {
  if (!dateStr) {
    return 'Recently';
  }

  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return 'Just now';
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? '1d ago' : `${days}d ago`;
}

export function mapJobToCorporateCard(job: JobListing, index = 0) {
  return {
    title: job.title,
    company: job.company?.name || 'Enterprise Partner',
    location: getJobLocationDisplay(job),
    type: job.employment?.type || 'Full-Time',
    salary: formatJobCompensation(job),
    time: formatTimeAgo(job.created_at),
    logo: job.company?.logo_card || job.company?.logo || CORPORATE_LOGOS[index % CORPORATE_LOGOS.length],
    slug: job.slug,
  };
}

export function getStartupEquityRange(job: JobListing): string {
  const low = job.id % 3 === 0 ? '1.5%' : job.id % 2 === 0 ? '1.0%' : '0.5%';
  const high = job.id % 3 === 0 ? '2.5%' : job.id % 2 === 0 ? '2.0%' : '1.5%';
  return `${low} - ${high}`;
}

export function getStartupEquityFill(job: JobListing): string {
  if (job.id % 3 === 0) return '75%';
  if (job.id % 2 === 0) return '50%';
  return '30%';
}
