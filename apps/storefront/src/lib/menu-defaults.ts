import type { Menu, MenuItem, MenuLocationKey, MenuMap } from '@sellio/types';
import { MENU_LOCATIONS } from '@sellio/types';

function fallbackHeaderItems(themeKey?: string): MenuItem[] {
  const vertical = themeKey?.split('_')[0];

  switch (vertical) {
    case 'properties':
      return links(['Explore', '/explore'], ['Cart', '/cart']);
    case 'autos':
      return links(['Inventory', '/explore'], ['Explore', '/explore']);
    case 'events':
      return links(['Events', '/explore']);
    case 'jobs':
      return links(['Jobs', '/explore']);
    case 'services':
      return links(['Services', '/explore']);
    case 'classifieds':
      return links(['Listings', '/explore']);
    case 'ecommerce':
      return links(['Shop', '/explore'], ['Explore', '/explore']);
    default:
      return links(['Home', '/'], ['Explore', '/explore']);
  }
}

function links(...entries: [string, string][]): MenuItem[] {
  return entries.map(([title, url], index) => ({
    id: index + 1,
    title,
    url,
    target: '_self',
    children: [],
  }));
}

function footerMenu(location: MenuLocationKey, title: string, items: MenuItem[]): Menu {
  return {
    location_key: location,
    title,
    source: 'fallback',
    items,
  };
}

export function getMenuDefaults(themeKey?: string, locations: MenuLocationKey[] = MENU_LOCATIONS): MenuMap {
  const map: MenuMap = {};

  for (const location of locations) {
    map[location] = getDefaultMenu(location, themeKey);
  }

  return map;
}

export function getDefaultMenu(location: MenuLocationKey, themeKey?: string): Menu {
  if (location === 'main_header') {
    if (themeKey === 'properties_classic') {
      return footerMenu(location, 'Main Header Menu', links(
        ['COLLECTION', '/explore'],
        ['AGENTS', '/explore'],
        ['PROVENANCE', '/explore'],
        ['REGISTRY', '/cart'],
      ));
    }

    if (themeKey === 'unifieds_default') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Registry', '/'],
        ['Features', '/explore'],
        ['Analytics', '/explore'],
        ['Enterprise', '/explore'],
      ));
    }

    return footerMenu(location, 'Main Header Menu', fallbackHeaderItems(themeKey));
  }

  if (location === 'company_footer') {
    return footerMenu(location, 'Company', links(['About', '#'], ['Careers', '#'], ['Press', '#']));
  }

  if (location === 'support_footer') {
    return footerMenu(location, 'Support', links(['Help Center', '#'], ['Contact', '#'], ['Status', '#']));
  }

  if (location === 'resources_footer') {
    return footerMenu(location, 'Resources', links(['Documentation', '#'], ['Terms', '#'], ['Privacy', '#']));
  }

  if (location === 'social_footer') {
    return footerMenu(location, 'Social Footer Menu', links(['Facebook', '#'], ['Instagram', '#'], ['X', '#']));
  }

  return footerMenu(location, 'Settings', links(['Language', '#'], ['Region', '#']));
}
