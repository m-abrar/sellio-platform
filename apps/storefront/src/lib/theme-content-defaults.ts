import type { ThemeContentResponse } from '@sellio/types';

export const EMPTY_THEME_CONTENT: ThemeContentResponse = {
  theme_key: 'fallback',
  page: 'home',
  content: {},
  media: {},
  config: {},
};

const PROPERTIES_CLASSIC_HOME: ThemeContentResponse = {
  theme_key: 'properties_classic',
  page: 'home',
  content: {
    'header.brand_label': 'ESTATE & HERITAGE',
    'hero.eyebrow': 'Global Registry // Vol. 2026',
    'hero.title': 'The Heritage\nRegistry.',
    'hero.description': "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and manorial integrity.",
    'hero.primary_cta_label': 'DISCOVER',
    'collection.heading': 'The Collection.',
    'collection.description': 'Current distribution includes verified manorial rights and significant historical provenance.',
    'testimonials.eyebrow': 'Patron Feedback',
    'testimonials.title': 'Voices of Trust.',
    'footer.description': "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and legacy value.",
    'footer.subscribe_text': 'Subscribe to our global heritage distribution protocol.',
  },
  media: {
    'hero.image': '/themes/properties/classic/7.webp',
  },
  config: {},
};

export function getThemeContentDefaults(themeKey?: string, page = 'home'): ThemeContentResponse {
  if (themeKey === 'properties_classic' && page === 'home') {
    return PROPERTIES_CLASSIC_HOME;
  }

  return {
    ...EMPTY_THEME_CONTENT,
    theme_key: themeKey ?? EMPTY_THEME_CONTENT.theme_key,
    page,
  };
}
