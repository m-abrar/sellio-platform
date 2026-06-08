import type { ServiceListing } from '@sellio/types';

export type ServiceCategoryRef =
  | string
  | {
      id?: number;
      title?: string;
      slug?: string;
    }
  | null
  | undefined;

export const SERVICE_PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8f9fa'/><rect x='90' y='95' width='720' height='450' rx='16' fill='%23ffffff' stroke='%23dee2e6'/><g transform='translate(405,260)' stroke='%23198754' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M45 74V18h90v56'/><path d='M63 18V0h54v18'/><path d='M45 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%23666666'>SERVICE PROVIDER</text></svg>";

export function getServiceCategoryLabel(
  category: ServiceCategoryRef,
  fallback = 'Professional Service',
): string {
  if (!category) {
    return fallback;
  }

  if (typeof category === 'string') {
    return category;
  }

  if (category.title) {
    return category.title;
  }

  if (category.slug) {
    return category.slug;
  }

  if (category.id != null) {
    return String(category.id);
  }

  return fallback;
}

export function getServicePriceLabel(service: ServiceListing): string {
  return (
    service.pricing?.formatted ||
    service.pricing?.formatted_short ||
    (service.pricing?.base_price
      ? `$${Number(service.pricing.base_price).toLocaleString()}`
      : 'Get estimate')
  );
}

export function getServiceImage(service: ServiceListing, fallback = SERVICE_PLACEHOLDER_IMAGE): string {
  return service.media?.main_photo || service.media?.gallery?.[0]?.url || fallback;
}

export function getServiceLocationLabel(service: ServiceListing): string {
  return (
    [service.location?.city, service.location?.state, service.location?.country]
      .filter(Boolean)
      .join(', ') || 'Available nationwide'
  );
}

export function mapServiceToLocalCard(service: ServiceListing, index: number, icons: string[]) {
  const price = getServicePriceLabel(service);

  return {
    title: `${service.title} – ${price}`,
    description:
      service.short_description ||
      service.description ||
      'A trusted local service available through the HomeFix network.',
    icon: icons[index % icons.length],
    slug: service.slug,
  };
}

export function getProviderRating(service: ServiceListing): string {
  return (4.6 + (service.id % 5) * 0.1).toFixed(1);
}
