'use client';

import type { MenuItem } from '@/types';

export type MenuItemRenderProps = {
  href: string;
  isActive: boolean;
  className: string;
  onNavigate?: () => void;
};

export function defaultNavItemRenderer(item: MenuItem, { href, className, onNavigate }: MenuItemRenderProps) {
  return (
    <a href={href} className={className} onClick={onNavigate}>
      {item.title}
    </a>
  );
}

export function hashAwareNavItemRenderer(item: MenuItem, props: MenuItemRenderProps) {
  const { href, className, onNavigate } = props;

  if (href.startsWith('#') && href.length > 1) {
    return (
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
          onNavigate?.();
        }}
      >
        {item.title}
      </a>
    );
  }

  return defaultNavItemRenderer(item, props);
}
