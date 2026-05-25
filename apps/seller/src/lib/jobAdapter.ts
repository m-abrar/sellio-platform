export interface NormalizedJob {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price?: string;
  sku?: string;
  location?: string;
  is_active: boolean;
  featured_image?: string | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  media: Array<{ original_url: string }>;
  category_id?: number;
  location_id?: number;
  company?: string;
  job_type?: string;
  experience_level?: string | number;
  skills?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  applicants_count?: number | null;
  is_published?: boolean;
  compensation?: Record<string, unknown>;
  employment?: Record<string, unknown>;
  status?: Record<string, unknown>;
}

const experienceLabels: Record<number, string> = {
  1: 'Entry Level',
  2: 'Mid Level',
  3: 'Senior Level',
  4: 'Lead / Executive',
};

const experienceReverseMap: Record<string, string> = {
  entry: '1',
  mid: '2',
  senior: '3',
  lead: '4',
  executive: '4',
};

export const mapExperienceToFormValue = (level?: number | string | null): string => {
  if (level == null) return '';
  if (typeof level === 'string' && experienceReverseMap[level]) {
    return level;
  }

  const numeric = Number(level);
  if (numeric === 1) return 'entry';
  if (numeric === 2) return 'mid';
  if (numeric === 3) return 'senior';
  if (numeric >= 4) return 'lead';

  return '';
};

const buildLocationLabel = (job: any): string => {
  const location = job.location ?? {};

  if (location.display) {
    return location.display;
  }

  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Remote';
};

const resolveJobType = (employment: any): string => {
  if (employment?.is_contract) return 'contract';
  if (employment?.is_full_time) return 'full-time';
  return 'part-time';
};

export const normalizeJob = (job: any): NormalizedJob => {
  const gallery = Array.isArray(job.company?.photos)
    ? job.company.photos.map((item: any, index: number) => ({
        id: item.id ?? index,
        url: item.url,
        thumbnail: item.thumb ?? item.url,
      }))
    : [];

  const featuredImage = job.company?.logo ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery.map((item) => ({ original_url: item.url })),
  ];

  const experienceLevel = job.employment?.experience_level;
  const employment = job.employment ?? {};

  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    description: job.description,
    price: job.compensation?.range_compact ?? job.compensation?.range_full ?? undefined,
    sku: `JOB-${job.id}`,
    location: buildLocationLabel(job),
    is_active: job.status?.is_published ?? false,
    featured_image: featuredImage,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Job' }],
    category_id: job.category_id,
    location_id: job.location_id,
    company: job.company?.name ?? '',
    job_type: resolveJobType(employment),
    experience_level: experienceLabels[Number(experienceLevel)] ?? experienceLevel,
    skills: employment.education ?? '',
    salary_min: job.compensation?.min ?? null,
    salary_max: job.compensation?.max ?? null,
    applicants_count: job.status?.application_count ?? null,
    is_published: job.status?.is_published ?? false,
    compensation: job.compensation ?? {},
    employment: job.employment ?? {},
    status: job.status ?? {},
  };
};

export const parseSalaryRange = (input: string): { min: number; max: number } => {
  const normalized = input.toLowerCase();
  const numbers = input.match(/[\d.]+/g)?.map((value) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) return 0;
    if (normalized.includes('k') && parsed < 1000) return parsed * 1000;
    return parsed;
  }) ?? [];

  if (numbers.length >= 2) {
    return { min: numbers[0], max: numbers[1] };
  }

  if (numbers.length === 1) {
    return { min: numbers[0], max: numbers[0] };
  }

  return { min: 0, max: 0 };
};

export const mapJobTypeFlags = (jobType: string) => {
  switch (jobType) {
    case 'full-time':
      return { is_full_time: true, is_contract: false };
    case 'contract':
      return { is_full_time: false, is_contract: true };
    case 'part-time':
    case 'freelance':
    case 'internship':
    default:
      return { is_full_time: false, is_contract: false };
  }
};

export const resolveWorkplaceType = (location: string): number => {
  if (location.toLowerCase().includes('remote')) {
    return 3;
  }

  if (location.toLowerCase().includes('hybrid')) {
    return 2;
  }

  return 1;
};
