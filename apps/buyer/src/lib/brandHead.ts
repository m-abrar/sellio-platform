import type { BrandSettings } from '../api/brandApi';

function faviconMimeType(url: string): string | undefined {
  if (/\.ico($|\?)/i.test(url)) return 'image/x-icon';
  if (/\.svg($|\?)/i.test(url)) return 'image/svg+xml';
  if (/\.png($|\?)/i.test(url)) return 'image/png';
  if (/\.webp($|\?)/i.test(url)) return 'image/webp';
  return undefined;
}

function updateHeadLink(rel: string, href: string, type?: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
  link.href = href;
  if (type) link.type = type;
}

export function applyBrandToDocumentHead(brand: BrandSettings, panelLabel = 'Buyer Dashboard') {
  if (brand.site_name) {
    document.title = `${brand.site_name} - ${panelLabel}`;
  }
  if (brand.site_favicon) {
    const type = faviconMimeType(brand.site_favicon);
    updateHeadLink('icon', brand.site_favicon, type);
    updateHeadLink('alternate icon', brand.site_favicon, type || 'image/x-icon');
  }
  if (brand.site_logo) {
    updateHeadLink('apple-touch-icon', brand.site_logo);
  }
}
