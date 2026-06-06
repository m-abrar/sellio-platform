'use client';

import { useModernThemeLink } from '../hooks/useModernThemeLink';

interface DetailBreadcrumbsProps {
  title: string;
}

export function DetailBreadcrumbs({ title }: DetailBreadcrumbsProps) {
  const themeLink = useModernThemeLink();

  return (
    <nav className="pm-breadcrumbs" aria-label="Breadcrumb">
      <a href={themeLink('/')}>Properties</a>
      <span aria-hidden="true">/</span>
      <a href={themeLink('/explore')}>Search</a>
      <span aria-hidden="true">/</span>
      <span className="pm-breadcrumbs__current">{title}</span>
    </nav>
  );
}
