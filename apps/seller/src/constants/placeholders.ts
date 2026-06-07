/** Neutral SVG placeholders — no third-party photo dependencies. */
export const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%23e2e8f0'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%2394a3b8'/%3E%3Cpath d='M16 68c4-14 14-22 24-22s20 8 24 22' fill='%2394a3b8'/%3E%3C/svg%3E";

export const PLACEHOLDER_LISTING =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f1f5f9'/%3E%3Crect x='16' y='16' width='168' height='118' rx='12' fill='%23e2e8f0'/%3E%3Ccircle cx='52' cy='52' r='12' fill='%2394a3b8'/%3E%3Cpath d='M28 118l36-36 28 28 20-20 32 28' stroke='%2394a3b8' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

export const PLACEHOLDER_LISTING_PROPERTIES = PLACEHOLDER_LISTING;
export const PLACEHOLDER_LISTING_EVENTS = PLACEHOLDER_LISTING;
export const PLACEHOLDER_LISTING_AUTOS = PLACEHOLDER_LISTING;
export const PLACEHOLDER_LISTING_JOBS = PLACEHOLDER_LISTING;
export const PLACEHOLDER_LISTING_CLASSIFIEDS = PLACEHOLDER_LISTING;

export function listingPlaceholderForModule(module: string): string {
  switch (module) {
    case 'properties':
      return PLACEHOLDER_LISTING_PROPERTIES;
    case 'events':
      return PLACEHOLDER_LISTING_EVENTS;
    case 'autos':
      return PLACEHOLDER_LISTING_AUTOS;
    case 'joblistings':
      return PLACEHOLDER_LISTING_JOBS;
    case 'classifieds':
      return PLACEHOLDER_LISTING_CLASSIFIEDS;
    default:
      return PLACEHOLDER_LISTING;
  }
}
