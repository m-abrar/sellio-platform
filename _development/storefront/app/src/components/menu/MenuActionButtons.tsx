'use client';

import React from 'react';
import type { MenuItem, MenuLocationKey } from '@sellio/types';
import { useMenu, useMenuContext } from '@/components/menu/MenuProvider';
import { MenuLink } from '@/components/menu/MenuLink';

interface MenuActionButtonsProps {
  location?: MenuLocationKey;
  className?: string;
  linkClassName?: string;
  buttonClassName?: string;
  as?: 'link' | 'button';
  onNavigate?: () => void;
  onAction?: (item: MenuItem) => void;
  renderItem?: (item: MenuItem, props: {
    href: string;
    className: string;
    onNavigate?: () => void;
  }) => React.ReactNode;
}

export function MenuActionButtons({
  location = 'action_buttons',
  className,
  linkClassName,
  buttonClassName,
  as = 'link',
  onNavigate,
  onAction,
  renderItem,
}: MenuActionButtonsProps) {
  const items = useMenu(location);
  const { themeKey } = useMenuContext();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {items.map((item) => {
        const resolvedClassName = as === 'button' ? buttonClassName ?? linkClassName : linkClassName;

        if (renderItem) {
          return (
            <MenuLink
              key={`${item.id ?? item.title}-${item.url}`}
              item={item}
              themeKey={themeKey}
              className={resolvedClassName}
              onNavigate={onNavigate}
              render={(menuItem, props) => renderItem(menuItem, props)}
            />
          );
        }

        if (as === 'button') {
          return (
            <button
              key={`${item.id ?? item.title}-${item.url}`}
              type="button"
              className={resolvedClassName}
              onClick={() => {
                onAction?.(item);
                onNavigate?.();
              }}
            >
              {item.title}
            </button>
          );
        }

        return (
          <MenuLink
            key={`${item.id ?? item.title}-${item.url}`}
            item={item}
            themeKey={themeKey}
            className={resolvedClassName}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}
