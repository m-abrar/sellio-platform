import type { ComponentType } from 'react';

export type ThemeSubpage = 'ProductPage' | 'ExplorePage' | 'CartPage' | 'CheckoutPage' | 'CheckoutConfirmationPage' | 'CheckoutConfirmPage';

const VERTICAL_SUBPAGE_FALLBACKS: Record<string, Partial<Record<ThemeSubpage, string>>> = {
  properties: {
    ProductPage: 'properties/classic',
    ExplorePage: 'properties/classic',
    CartPage: 'properties/classic',
  },
  ecommerce: {
    ProductPage: 'ecommerce/default',
    ExplorePage: 'ecommerce/default',
    CartPage: 'ecommerce/default',
    CheckoutPage: 'unifieds/minimal',
    CheckoutConfirmationPage: 'unifieds/minimal',
    CheckoutConfirmPage: 'unifieds/minimal',
  },
  events: {
    ProductPage: 'events/classic',
    ExplorePage: 'events/corporate',
  },
  autos: {
    ProductPage: 'autos/classic',
    ExplorePage: 'autos/modern',
  },
  jobs: {
    ProductPage: 'jobs/startup',
    ExplorePage: 'jobs/startup',
  },
  services: {
    ProductPage: 'services/marketplace',
    ExplorePage: 'unifieds/minimal',
  },
  classifieds: {
    ProductPage: 'classifieds/local',
    ExplorePage: 'unifieds/minimal',
  },
  unifieds: {
    ProductPage: 'unifieds/default',
    ExplorePage: 'unifieds/minimal',
    CartPage: 'unifieds/minimal',
    CheckoutPage: 'unifieds/minimal',
    CheckoutConfirmationPage: 'unifieds/minimal',
    CheckoutConfirmPage: 'unifieds/minimal',
  },
};

const GLOBAL_SUBPAGE_FALLBACKS: Record<ThemeSubpage, string> = {
  ProductPage: 'unifieds/default',
  ExplorePage: 'unifieds/minimal',
  CartPage: 'unifieds/minimal',
  CheckoutPage: 'unifieds/minimal',
  CheckoutConfirmationPage: 'unifieds/minimal',
  CheckoutConfirmPage: 'unifieds/minimal',
};

async function importThemeSubpage(
  themePath: string,
  exportName: ThemeSubpage,
): Promise<ComponentType<Record<string, unknown>> | null> {
  try {
    const themeModule = await import(`@/themes/${themePath}`);
    const component = themeModule[exportName];

    return component ?? null;
  } catch {
    return null;
  }
}

export async function loadThemeSubpage(
  layout: string,
  exportName: ThemeSubpage,
): Promise<ComponentType<Record<string, unknown>> | null> {
  const candidates = new Set<string>([layout]);

  const vertical = layout.split('/')[0];
  const verticalFallback = VERTICAL_SUBPAGE_FALLBACKS[vertical]?.[exportName];

  if (verticalFallback) {
    candidates.add(verticalFallback);
  }

  candidates.add(GLOBAL_SUBPAGE_FALLBACKS[exportName]);

  for (const themePath of candidates) {
    const component = await importThemeSubpage(themePath, exportName);

    if (component) {
      return component;
    }
  }

  return null;
}
