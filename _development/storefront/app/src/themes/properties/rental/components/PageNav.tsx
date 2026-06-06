'use client';

import { useRentalThemeLink } from '../hooks/useRentalThemeLink';

export type PageNavCrumb = {
  label: string;
  href?: string;
  current?: boolean;
};

interface PageNavProps {
  backHref?: string;
  backLabel: string;
  crumbs: PageNavCrumb[];
}

/** RentEase navigation — text back link + dot trail (not a frosted toolbar card). */
export function PageNav({ backHref, backLabel, crumbs }: PageNavProps) {
  const themeLink = useRentalThemeLink();
  const backTarget = backHref ?? themeLink('/');

  return (
    <header className="pr-page-nav">
      <a href={backTarget} className="pr-page-nav__back">
        {backLabel}
      </a>
      <nav className="pr-crumbs" aria-label="Breadcrumb">
        <ol className="pr-crumbs__list">
          {crumbs.map((crumb) => (
            <li
              key={crumb.label}
              className={`pr-crumbs__item${crumb.current ? ' pr-crumbs__item--current' : ''}`}
              aria-current={crumb.current ? 'page' : undefined}
            >
              {crumb.href && !crumb.current ? (
                <a href={crumb.href}>{crumb.label}</a>
              ) : (
                <span className="pr-crumbs__current">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
