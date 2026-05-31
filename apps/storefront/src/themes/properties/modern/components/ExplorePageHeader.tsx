'use client';

import { usePathname } from 'next/navigation';
import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLinkFromPathname } from '@/lib/links';

export function ExplorePageHeader() {
  const pathname = usePathname();
  const { themeKey } = useMenuContext();
  const themeLink = (path: string) => getThemeLinkFromPathname(path, pathname, themeKey);

  return (
    <header className="pm-detail-header pm-explore-page__header">
      <div className="pm-detail-toolbar">
        <a href={themeLink('/')} className="pm-detail-back-btn">
          <span className="pm-detail-back-btn__icon" aria-hidden="true">
            ←
          </span>
          <span>Back to home</span>
        </a>

        <nav className="pm-breadcrumbs" aria-label="Breadcrumb">
          <ol className="pm-breadcrumbs__list">
            <li className="pm-breadcrumbs__item">
              <a href={themeLink('/')}>Properties</a>
            </li>
            <li
              className="pm-breadcrumbs__item pm-breadcrumbs__item--current"
              aria-current="page"
            >
              <span className="pm-breadcrumbs__current">Search</span>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}
