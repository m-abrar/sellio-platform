import type { Menu, MenuItem, MenuLocationKey, MenuMap } from '@/types';
import { MENU_LOCATIONS } from '@/types';

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
      return links(['Shop', '/explore'], ['Explore', '/explore'], ['Cart', '/cart']);
    case 'unifieds':
      return links(['Home', '/'], ['Explore', '/explore'], ['Cart', '/cart']);
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

function emptyMenu(location: MenuLocationKey, title: string): Menu {
  return {
    location_key: location,
    title,
    source: 'fallback',
    items: [],
  };
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

    if (themeKey === 'properties_modern') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Buy', '/explore?mode=sale'],
        ['Rent', '/explore?mode=rental'],
        ['Featured', '/#urban-structure-grid'],
        ['Contact', '/#urban-final-cta'],
      ));
    }

    if (themeKey === 'unifieds_default') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Registry', '/'],
        ['Explore', '/explore'],
        ['Cart', '/cart'],
      ));
    }

    if (themeKey === 'unifieds_minimal') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Home', '/'],
        ['Explore', '/explore'],
        ['Cart', '/cart'],
      ));
    }

    if (themeKey === 'unifieds_marketplace') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Browse All', '/explore'],
        ['Properties', '/explore?vertical=properties'],
        ['Autos', '/explore?vertical=autos'],
        ['Services', '/explore?vertical=services'],
        ['Jobs', '/explore?vertical=jobs'],
      ));
    }

    if (themeKey === 'ecommerce_default') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Shop', '/explore'],
        ['New Arrivals', '/explore?sort=latest'],
        ['Essentials', '/explore?category=essentials'],
        ['Cart', '/cart'],
      ));
    }

    if (themeKey === 'ecommerce_b2b') {
      return footerMenu(location, 'Main Header Menu', links(
        ['Instruments', '/explore'],
        ['OEM Supply', '/quote'],
        ['Export RFQ', '/quote'],
        ['Quality', '/about'],
      ));
    }

    if (themeKey === 'ecommerce_fashion') {
      return footerMenu(location, 'Main Header Menu', links(
        ['New Arrivals', '/explore?sort=latest'],
        ['Ready to Wear', '/explore'],
        ['Accessories', '/explore?category=accessories'],
        ['Cart', '/cart'],
      ));
    }

    return footerMenu(location, 'Main Header Menu', fallbackHeaderItems(themeKey));
  }

  if (location === 'utility_header') {
    if (themeKey === 'ecommerce_default') {
      return footerMenu(location, 'Utility Header', links(['Track Order', '/cart'], ['Support', '/explore']));
    }

    if (themeKey === 'ecommerce_b2b') {
      return footerMenu(location, 'Utility Header', links(['Request Quote', '/quote'], ['Export Support', '/contact']));
    }

    if (themeKey === 'ecommerce_fashion') {
      return footerMenu(location, 'Utility Header', links(['Fitting Guide', '/explore'], ['Client Care', '/cart']));
    }

    return footerMenu(location, 'Utility Header', links(['Login', '#']));
  }

  if (location === 'action_buttons') {
    if (themeKey === 'ecommerce_default') {
      return footerMenu(location, 'Header Actions', links(['View Cart', '/cart']));
    }

    if (themeKey === 'ecommerce_b2b') {
      return footerMenu(location, 'Header Actions', links(['Export RFQ', '/quote']));
    }

    if (themeKey === 'ecommerce_fashion') {
      return footerMenu(location, 'Header Actions', links(['View Cart', '/cart']));
    }

    if (themeKey === 'properties_modern') {
      return footerMenu(location, 'Header Actions', links(['Browse listings', '/explore']));
    }

    return footerMenu(location, 'Header Actions', links(['Inquire', '/cart']));
  }

  if (location.startsWith('footer_column_')) {
    if (themeKey === 'ecommerce_default') {
      if (location === 'footer_column_1') {
        return footerMenu(location, 'Shop', links(['All Products', '/explore'], ['New Arrivals', '/explore?sort=latest'], ['Cart', '/cart']));
      }

      if (location === 'footer_column_2') {
        return footerMenu(location, 'Customer Care', links(['Checkout', '/checkout'], ['Order Review', '/checkout/confirm'], ['Support', '/explore']));
      }

      return footerMenu(location, 'Storefront', links(['Featured Products', '/explore?featured=1'], ['Sale Items', '/explore?sort=price_asc'], ['Account Help', '/cart']));
    }

    if (themeKey === 'ecommerce_b2b') {
      if (location === 'footer_column_1') {
        return footerMenu(location, 'Instruments', links(['All Instruments', '/explore'], ['Trauma Sets', '/explore'], ['Spine Instruments', '/explore']));
      }

      if (location === 'footer_column_2') {
        return footerMenu(location, 'Export Supply', links(['Request RFQ', '/quote'], ['Lead Times', '/quote'], ['Distributor Support', '/contact']));
      }

      return footerMenu(location, 'Manufacturing', links(['OEM Instruments', '/quote'], ['Private Label', '/contact'], ['Quality Documents', '/about']));
    }

    if (themeKey === 'ecommerce_fashion') {
      if (location === 'footer_column_1') {
        return footerMenu(location, 'Collections', links(['New Arrivals', '/explore?sort=latest'], ['Ready to Wear', '/explore'], ['Accessories', '/explore?category=accessories']));
      }

      if (location === 'footer_column_2') {
        return footerMenu(location, 'Atelier', links(['Fitting Guide', '/explore'], ['Cart', '/cart'], ['Checkout', '/checkout']));
      }

      return footerMenu(location, 'Client Care', links(['Shipping', '/checkout'], ['Returns', '/cart'], ['Order Review', '/checkout/confirm']));
    }

    if (themeKey === 'properties_modern') {
      if (location === 'footer_column_1') {
        return footerMenu(location, 'Explore', links(['Homes for sale', '/explore?mode=sale'], ['Apartments for rent', '/explore?mode=rental'], ['All listings', '/explore']));
      }

      if (location === 'footer_column_2') {
        return footerMenu(location, 'Property Tools', links(['Featured homes', '/#urban-structure-grid'], ['Compare details', '/explore'], ['Inquire with agents', '/explore']));
      }

      return footerMenu(location, 'Support', links(['How it works', '/#urban-precision-section'], ['Start search', '/explore'], ['Contact', '/#urban-final-cta']));
    }

    return footerMenu(location, 'Footer', links(['About', '#'], ['Contact', '#']));
  }

  if (location === 'footer_bottom_bar') {
    return footerMenu(location, 'Legal', links(['Privacy', '#'], ['Terms', '#']));
  }

  if (location === 'social_footer') {
    if (themeKey === 'ecommerce_default') {
      return footerMenu(location, 'Social', links(['Instagram', '/explore'], ['TikTok', '/explore'], ['Pinterest', '/explore']));
    }

    if (themeKey === 'ecommerce_b2b') {
      return footerMenu(location, 'Social', links(['LinkedIn', '#'], ['Trade Shows', '#'], ['Support', '#']));
    }

    if (themeKey === 'ecommerce_fashion') {
      return footerMenu(location, 'Social', links(['Instagram', '/explore'], ['Pinterest', '/explore'], ['Lookbook', '/explore']));
    }

    return footerMenu(location, 'Social', links(['Instagram', '#'], ['LinkedIn', '#'], ['X', '#']));
  }

  if (location === 'utility_topbar' || location === 'mobile_nav' || location === 'secondary_nav') {
    return emptyMenu(location, location.replace(/_/g, ' '));
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

  return footerMenu(location, 'Settings', links(['Language', '#'], ['Region', '#']));
}
