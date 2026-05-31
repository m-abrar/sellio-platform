'use client';

import { usePathname } from 'next/navigation';
import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLinkFromPathname } from '@/lib/links';

interface DetailPageHeaderProps {
  title: string;
}

export function DetailPageHeader({ title }: DetailPageHeaderProps) {
  const pathname = usePathname();
  const { themeKey } = useMenuContext();
  const themeLink = (path: string) => getThemeLinkFromPathname(path, pathname, themeKey);

  return (
    <header className="pm-detail-header">
      <div className="pm-detail-toolbar">
        <a href={themeLink('/')} className="pm-detail-back-btn">
          <span className="pm-detail-back-btn__icon" aria-hidden="true">
            ←
          </span>
          <span>Back to properties</span>
        </a>

        <nav className="pm-breadcrumbs" aria-label="Breadcrumb">
          <ol className="pm-breadcrumbs__list">
            <li className="pm-breadcrumbs__item">
              <a href={themeLink('/')}>Properties</a>
            </li>
            <li className="pm-breadcrumbs__item">
              <a href={themeLink('/explore')}>Search</a>
            </li>
            <li className="pm-breadcrumbs__item pm-breadcrumbs__item--current" aria-current="page">
              <span className="pm-breadcrumbs__current">{title}</span>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}
