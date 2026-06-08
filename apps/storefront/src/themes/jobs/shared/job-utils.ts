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

export type TechJobCardData = {
  id: string | number;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  time: string;
  logo: string;
  skills: string[];
  description: string;
};

const TECH_LOGO_FALLBACK =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80';

export function translateJobListingToTechJob(job: JobListing): TechJobCardData {
  const logo = job.company?.logo || TECH_LOGO_FALLBACK;
  const salary = formatJobCompensation(job);
  const location = getJobLocationDisplay(job);
  const type = job.employment?.type || job.employment?.workplace || 'Full-Time';
  const skills = job.taxonomy?.tags?.length
    ? job.taxonomy.tags
    : ['TypeScript', 'Node.js', 'React'];
  const time = formatTimeAgo(job.created_at);

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company?.name || 'Tech Startup',
    location,
    type,
    salary,
    time,
    logo,
    skills,
    description:
      job.description ||
      `High-fidelity engineering opportunity at ${job.company?.name || 'Tech Startup'}. Solve mission-critical problems with absolute autonomy.`,
  };
}

const MODERN_LOGOS = [
  '/themes/jobs/modern/1.webp',
  '/themes/jobs/modern/2.webp',
  '/themes/jobs/modern/3.webp',
  '/themes/jobs/modern/4.webp',
  '/themes/jobs/modern/5.webp',
  '/themes/jobs/modern/6.webp',
];

export function mapJobToModernCard(job: JobListing, index = 0) {
  return {
    title: job.title,
    company: job.company?.name || 'Innovative Company',
    location: getJobLocationDisplay(job),
    type: job.employment?.workplace || job.employment?.type || 'Full-Time',
    level: job.employment?.experience_level || 'Mid-Level',
    salary: formatJobCompensation(job),
    logo: job.company?.logo_card || job.company?.logo || MODERN_LOGOS[index % MODERN_LOGOS.length],
    slug: job.slug,
  };
}

const FREELANCE_AVATARS = [
  '/themes/jobs/freelance/1.webp',
  '/themes/jobs/freelance/2.webp',
  '/themes/jobs/freelance/3.webp',
  '/themes/jobs/freelance/4.webp',
];

const FREELANCE_IMAGES = [
  '/themes/jobs/freelance/10.webp',
  '/themes/jobs/freelance/11.webp',
  '/themes/jobs/freelance/12.webp',
  '/themes/jobs/freelance/13.webp',
];

export function mapJobToFreelanceGig(job: JobListing, index = 0) {
  return {
    title: job.title,
    name: job.company?.name || 'Top Freelancer',
    avatar: job.company?.logo_card || job.company?.logo || FREELANCE_AVATARS[index % FREELANCE_AVATARS.length],
    image: job.company?.photos?.[0]?.url || FREELANCE_IMAGES[index % FREELANCE_IMAGES.length],
    rating: 4.9,
    reviews: job.status?.application_count || 100 + index * 47,
    price: formatJobCompensation(job),
    slug: job.slug,
  };
}

export function mapJobToBlueCollarCard(job: JobListing) {
  return {
    title: job.title,
    company: job.company?.name || 'Local Employer',
    location: getJobLocationDisplay(job),
    type: job.employment?.type || 'Full-Time',
    wage: formatJobCompensation(job),
    time: formatTimeAgo(job.created_at),
    slug: job.slug,
  };
}
