export type PortalSetupIssue = {
  id: string;
  title: string;
  detail: string;
};

const PLACEHOLDER_MARKERS = [
  'your-laravel-domain.com',
  'your-domain.com',
  'example.com',
  'changeme',
];

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function hostnameFromUrl(url: string): string | null {
  try {
    return new URL(normalizeUrl(url)).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isPlaceholderHost(hostname: string): boolean {
  return PLACEHOLDER_MARKERS.some((marker) => hostname.includes(marker));
}

function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function inspectUrl(
  url: string | undefined,
  label: string,
): PortalSetupIssue[] {
  if (!url?.trim()) {
    return [{
      id: `${label}-missing`,
      title: `${label} is not set`,
      detail: 'Open config.js in your seller subdomain root (next to index.html) and add your Laravel API URL.',
    }];
  }

  const host = hostnameFromUrl(url);
  if (!host) {
    return [{
      id: `${label}-invalid`,
      title: `${label} looks invalid`,
      detail: 'config.js should use a full URL like https://your-site.com/api',
    }];
  }

  if (isPlaceholderHost(host)) {
    return [{
      id: `${label}-placeholder`,
      title: 'Setup required: update config.js',
      detail: `Replace the placeholder API URL with your live Laravel domain (currently "${url.trim()}").`,
    }];
  }

  if (isLocalHost(host)) {
    return [{
      id: `${label}-localhost`,
      title: 'Setup required: config.js still points to localhost',
      detail: `Edit config.js and set your production Laravel URL instead of "${url.trim()}".`,
    }];
  }

  return [];
}

export function getPortalSetupIssues(): PortalSetupIssue[] {
  if (import.meta.env.DEV) {
    return [];
  }

  const issues = inspectUrl(window.SELLIO_CONFIG?.apiUrl, 'API URL');
  return [...new Map(issues.map((issue) => [issue.id, issue])).values()];
}

export function isPortalSetupIncomplete(): boolean {
  return getPortalSetupIssues().length > 0;
}
