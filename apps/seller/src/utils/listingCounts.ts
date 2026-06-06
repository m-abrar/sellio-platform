type ListingLike = {
  is_active?: boolean;
  is_published?: boolean;
};

export type ListingCounts = {
  total: number;
  live: number;
  pending: number;
  draft: number;
};

export function getListingCounts<T extends ListingLike>(items: T[]): ListingCounts {
  const supportsPending = items.some(
    (item) => Object.prototype.hasOwnProperty.call(item, 'is_published'),
  );

  if (supportsPending) {
    return {
      total: items.length,
      live: items.filter((item) => item.is_active).length,
      pending: items.filter((item) => !item.is_active && item.is_published).length,
      draft: items.filter((item) => !item.is_active && !item.is_published).length,
    };
  }

  return {
    total: items.length,
    live: items.filter((item) => item.is_active).length,
    pending: 0,
    draft: items.filter((item) => !item.is_active).length,
  };
}
