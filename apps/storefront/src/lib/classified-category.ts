import type { ClassifiedListing } from '@/types';

type ClassifiedCategoryRef = ClassifiedListing['taxonomy']['category'] | {
  id?: number;
  title?: string;
  slug?: string;
};

export function getClassifiedCategoryKey(category: ClassifiedCategoryRef): string {
  if (!category) {
    return '';
  }

  if (typeof category === 'string') {
    return category.toLowerCase();
  }

  if (typeof category === 'object') {
    const { id, title, slug } = category;

    if (slug) {
      return slug.toLowerCase();
    }

    if (title) {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (id != null) {
      return String(id);
    }
  }

  return '';
}

export function getClassifiedCategoryTitle(
  category: ClassifiedCategoryRef,
  fallback = 'Uncategorized',
): string {
  if (!category) {
    return fallback;
  }

  if (typeof category === 'string') {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  if (typeof category === 'object') {
    if (category.title) {
      return category.title;
    }

    const key = getClassifiedCategoryKey(category);
    if (key) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
    }
  }

  return fallback;
}

export function classifiedCategoriesMatch(
  left: ClassifiedCategoryRef,
  right: ClassifiedCategoryRef,
): boolean {
  const leftKey = getClassifiedCategoryKey(left);
  const rightKey = getClassifiedCategoryKey(right);

  return Boolean(leftKey) && leftKey === rightKey;
}
