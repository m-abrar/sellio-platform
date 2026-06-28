import type { ComponentType } from 'react';

export type ThemeSubpage =
  | 'ProductPage'
  | 'ExplorePage'
  | 'AgentBioPage'
  | 'CartPage'
  | 'CheckoutPage'
  | 'CheckoutConfirmationPage'
  | 'CheckoutConfirmPage'
  | 'BookingPage'
  | 'BookingConfirmationPage'
  | 'BookingConfirmPage'
  | 'BookingReservePage'
  | 'ConsultationConfirmationPage'
  | 'InquiryConfirmationPage'
  | 'ApplicationConfirmationPage';

const VERTICAL_SUBPAGE_FALLBACKS: Record<string, Partial<Record<ThemeSubpage, string>>> = {
  properties: {
    ProductPage: 'properties/classic',
    ExplorePage: 'properties/classic',
    CartPage: 'properties/classic',
    BookingPage: 'properties/rental',
    BookingConfirmationPage: 'properties/rental',
    BookingConfirmPage: 'properties/rental',
    BookingReservePage: 'properties/rental',
    AgentBioPage: 'properties/classic',
  },
  ecommerce: {
    ProductPage: 'ecommerce/default',
    ExplorePage: 'ecommerce/default',
    CartPage: 'ecommerce/default',
    CheckoutPage: 'ecommerce/default',
    CheckoutConfirmationPage: 'ecommerce/default',
    CheckoutConfirmPage: 'ecommerce/default',
  },
  events: {
    ProductPage: 'events/classic',
    ExplorePage: 'events/corporate',
    BookingPage: 'events/corporate',
    BookingReservePage: 'events/corporate',
    BookingConfirmationPage: 'events/corporate',
    BookingConfirmPage: 'events/corporate',
  },
  autos: {
    ProductPage: 'autos/modern',
    ExplorePage: 'autos/modern',
    InquiryConfirmationPage: 'autos/modern',
  },
  jobs: {
    ProductPage: 'jobs/startup',
    ExplorePage: 'jobs/startup',
    ApplicationConfirmationPage: 'jobs/modern',
  },
  services: {
    ProductPage: 'services/marketplace',
    ExplorePage: 'services/marketplace',
    ConsultationConfirmationPage: 'services/marketplace',
  },
  classifieds: {
    ProductPage: 'classifieds/local',
    ExplorePage: 'classifieds/local',
    InquiryConfirmationPage: 'classifieds/local',
  },
  unifieds: {
    ProductPage: 'unifieds/default',
    ExplorePage: 'unifieds/minimal',
    CartPage: 'unifieds/minimal',
    CheckoutPage: 'unifieds/minimal',
    CheckoutConfirmationPage: 'unifieds/minimal',
    CheckoutConfirmPage: 'unifieds/minimal',
    BookingReservePage: 'unifieds/default',
    BookingPage: 'unifieds/default',
    BookingConfirmationPage: 'unifieds/minimal',
    BookingConfirmPage: 'unifieds/minimal',
  },
};

const GLOBAL_SUBPAGE_FALLBACKS: Record<ThemeSubpage, string> = {
  ProductPage: 'unifieds/default',
  ExplorePage: 'unifieds/minimal',
  CartPage: 'unifieds/minimal',
  CheckoutPage: 'unifieds/minimal',
  CheckoutConfirmationPage: 'unifieds/minimal',
  CheckoutConfirmPage: 'unifieds/minimal',
  BookingPage: 'properties/rental',
  BookingConfirmationPage: 'properties/rental',
  BookingConfirmPage: 'properties/rental',
  BookingReservePage: 'properties/rental',
  ConsultationConfirmationPage: 'services/marketplace',
  InquiryConfirmationPage: 'classifieds/local',
  ApplicationConfirmationPage: 'jobs/modern',
  AgentBioPage: 'properties/classic',
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
