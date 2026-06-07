export type PortalSetupIssue = {
  id: string;
  title: string;
  detail: string;
  field: 'apiUrl' | 'storefrontUrl';
};

export type PortalSetupContext = {
  panelLabel: string;
  corsEnvKey: string;
  apiUrl: string;
  storefrontUrl: string;
  issues: PortalSetupIssue[];
  isIncomplete: boolean;
};

const PLACEHOLDER_MARKERS = [
  'your-laravel-domain.com',
  'your-domain.com',
  'yourdomain.com',
  'marketplace.yourdomain.com',
  'example.com',
  'changeme',
  'replace-me',
  'placeholder',
];

const BUNDLED_DEMO_API_HOSTS = [
  'demo.sellio.vebdez.com',
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

function isVendorDemoPanelHost(hostname: string): boolean {
  return hostname === 'sellio.vebdez.com' || hostname.endsWith('.sellio.vebdez.com');
}

function isBundledDemoApiHost(hostname: string): boolean {
  return BUNDLED_DEMO_API_HOSTS.includes(hostname);
}

function inspectUrl(
  url: string | undefined,
  label: string,
  field: PortalSetupIssue['field'],
): PortalSetupIssue[] {
  if (!url?.trim()) {
    return [{
      id: `${field}-missing`,
      title: `${label} is not set`,
      detail: 'Add the required URL in config.js at the root of your buyer subdomain (next to index.html).',
      field,
    }];
  }

  const host = hostnameFromUrl(url);
  if (!host) {
    return [{
      id: `${field}-invalid`,
      title: `${label} looks invalid`,
      detail: 'Use a full URL like https://marketplace.yourdomain.com/api',
      field,
    }];
  }

  if (isPlaceholderHost(host)) {
    return [{
      id: `${field}-placeholder`,
      title: `${label} is still a placeholder`,
      detail: `Replace the placeholder domain in config.js (currently "${url.trim()}").`,
      field,
    }];
  }

  if (field === 'apiUrl' && isBundledDemoApiHost(host) && !isVendorDemoPanelHost(window.location.hostname.toLowerCase())) {
    return [{
      id: `${field}-demo-default`,
      title: `${label} still points to the demo server`,
      detail: `This panel is on "${window.location.hostname}" but config.js still uses the bundled demo API. Set apiUrl to your own Laravel domain.`,
      field,
    }];
  }

  if (isLocalHost(host) && !isLocalHost(window.location.hostname.toLowerCase())) {
    return [{
      id: `${field}-localhost`,
      title: `${label} still points to localhost`,
      detail: `Edit config.js and set your production URL instead of "${url.trim()}".`,
      field,
    }];
  }

  return [];
}

export function getPortalSetupIssues(): PortalSetupIssue[] {
  if (import.meta.env.DEV) {
    return [];
  }

  const config = window.SELLIO_CONFIG;
  const issues = [
    ...inspectUrl(config?.apiUrl, 'API URL', 'apiUrl'),
    ...inspectUrl(config?.storefrontUrl, 'Storefront URL', 'storefrontUrl'),
  ];

  return [...new Map(issues.map((issue) => [issue.id, issue])).values()];
}

export function getPortalSetupContext(): PortalSetupContext {
  const config = window.SELLIO_CONFIG;
  const issues = getPortalSetupIssues();

  return {
    panelLabel: 'Buyer Panel',
    corsEnvKey: 'BUYER_APP_URL',
    apiUrl: config?.apiUrl?.trim() || '',
    storefrontUrl: config?.storefrontUrl?.trim() || '',
    issues,
    isIncomplete: issues.length > 0,
  };
}

export function isPortalSetupIncomplete(): boolean {
  return getPortalSetupIssues().length > 0;
}

export function exampleConfigSnippet(context: PortalSetupContext): string {
  const apiExample = context.apiUrl && !context.issues.some((issue) => issue.field === 'apiUrl')
    ? context.apiUrl
    : 'https://marketplace.yourdomain.com/api';
  const storefrontExample = context.storefrontUrl && !context.issues.some((issue) => issue.field === 'storefrontUrl')
    ? context.storefrontUrl
    : 'https://marketplace.yourdomain.com';

  return `window.SELLIO_CONFIG = {
  apiUrl: '${apiExample}',
  storefrontUrl: '${storefrontExample}',
  basePath: '',
};`;
}
