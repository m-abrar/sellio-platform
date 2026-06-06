'use client';

import { PageNav } from '../PageNav';
import { useRentalThemeLink } from '../../hooks/useRentalThemeLink';

interface DetailPageHeaderProps {
  title: string;
}

export function DetailPageHeader({ title }: DetailPageHeaderProps) {
  const themeLink = useRentalThemeLink();

  return (
    <PageNav
      backLabel="← All rentals"
      crumbs={[
        { label: 'Home', href: themeLink('/') },
        { label: 'Search', href: themeLink('/explore') },
        { label: title, current: true },
      ]}
    />
  );
}
