import type { MetadataRoute } from 'next';
import { api } from '@sellio/api-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sellio.vebdez.com').replace(/\/$/, '');

async function slugEntries<T extends { slug: string }>(
  fetcher: () => Promise<{ data: T[] }>,
  path: string,
  priority = 0.7,
): Promise<MetadataRoute.Sitemap> {
  try {
    const result = await fetcher();
    return (result.data ?? []).map((item) => ({
      url: `${siteUrl}/${path}/${item.slug}`,
      changeFrequency: 'weekly' as const,
      priority,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/explore`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const [properties, vehicles, jobs, services, events, classifieds, products] = await Promise.all([
    slugEntries(() => api.getProperties({ per_page: 200 }), 'properties', 0.8),
    slugEntries(() => api.getVehicles({ per_page: 200 }), 'autos', 0.7),
    slugEntries(() => api.getJobs({ per_page: 200 }), 'jobs', 0.7),
    slugEntries(() => api.getServices({ per_page: 200 }), 'services', 0.7),
    slugEntries(() => api.getEvents({ per_page: 200 }), 'events', 0.7),
    slugEntries(() => api.getClassifieds({ per_page: 200 }), 'classifieds', 0.7),
    slugEntries(() => api.getProductsCatalog({ per_page: 200 }), 'product', 0.7),
  ]);

  return [
    ...staticRoutes,
    ...properties,
    ...vehicles,
    ...jobs,
    ...services,
    ...events,
    ...classifieds,
    ...products,
  ];
}
