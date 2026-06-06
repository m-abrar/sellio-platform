'use client';

import { PageNav } from '../PageNav';
import { useRentalThemeLink } from '../../hooks/useRentalThemeLink';

export function ExplorePageHeader() {
  const themeLink = useRentalThemeLink();

  return (
    <PageNav
      backLabel="← Home"
      crumbs={[
        { label: 'Home', href: themeLink('/') },
        { label: 'Search rentals', current: true },
      ]}
    />
  );
}
