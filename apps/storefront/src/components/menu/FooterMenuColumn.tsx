'use client';

import React from 'react';
import type { MenuItem, MenuLocationKey } from '@sellio/types';
import { useMenu, useMenuTitle } from '@/components/menu/MenuProvider';
import { MenuLink } from '@/components/menu/MenuLink';
import { useMenuContext } from '@/components/menu/MenuProvider';

interface FooterMenuColumnProps {
  location: MenuLocationKey;
  title?: string;
  titleClassName?: string;
  titleTag?: 'h4' | 'h5' | 'h6' | 'div';
  titleStyle?: React.CSSProperties;
  linkClassName?: string;
  listClassName?: string;
  className?: string;
  renderTitle?: (title: string) => React.ReactNode;
}

export function FooterMenuColumn({
  location,
  title,
  titleClassName,
  titleTag: TitleTag = 'h6',
  titleStyle,
  linkClassName,
  listClassName,
  className,
  renderTitle,
}: FooterMenuColumnProps) {
  const items = useMenu(location);
  const menuTitle = useMenuTitle(location);
  const { themeKey } = useMenuContext();
  const resolvedTitle = title ?? menuTitle;

  if (items.length === 0 && !resolvedTitle) {
    return null;
  }

  return (
    <div className={className}>
      {renderTitle ? (
        renderTitle(resolvedTitle)
      ) : (
        <TitleTag className={titleClassName} style={titleStyle}>
          {resolvedTitle}
        </TitleTag>
      )}
      <nav aria-label={resolvedTitle} className={listClassName}>
        {items.map((item: MenuItem) => (
          <MenuLink
            key={`${item.id ?? item.title}-${item.url}`}
            item={item}
            themeKey={themeKey}
            className={linkClassName}
          />
        ))}
      </nav>
    </div>
  );
}
