'use client';

import React from 'react';
import type { MenuItem, MenuLocationKey } from '@sellio/types';
import { useMenu, useMenuContext } from '@/components/menu/MenuProvider';
import { MenuLink } from '@/components/menu/MenuLink';

interface MenuNavProps {
  location: MenuLocationKey;
  className?: string;
  style?: React.CSSProperties;
  listClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
  activeClassName?: string;
  flat?: boolean;
  onNavigate?: () => void;
  renderItem?: (item: MenuItem, props: {
    href: string;
    isActive: boolean;
    className: string;
    onNavigate?: () => void;
  }) => React.ReactNode;
}

export function MenuNav({
  location,
  className,
  style,
  listClassName,
  itemClassName,
  linkClassName,
  activeClassName = 'active',
  flat = false,
  onNavigate,
  renderItem,
}: MenuNavProps) {
  const items = useMenu(location);
  const { themeKey } = useMenuContext();

  // #region agent log
  React.useEffect(() => {
    if (location === 'main_header') {
      fetch('http://127.0.0.1:7444/ingest/7299bd34-d23f-4a85-8035-1e1996ea1a56',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'706e24'},body:JSON.stringify({sessionId:'706e24',location:'MenuNav.tsx:main_header',message:'MenuNav render items',data:{location,themeKey,itemCount:items.length,titles:items.slice(0,4).map((i)=>i.title),className},timestamp:Date.now(),hypothesisId:'D,E'})}).catch(()=>{});
    }
  }, [location, themeKey, items, className]);
  // #endregion

  const nodes = items.map((item) => (
    <MenuNavNode
      key={`${item.id ?? item.title}-${item.url}`}
      item={item}
      themeKey={themeKey}
      itemClassName={itemClassName}
      linkClassName={linkClassName}
      activeClassName={activeClassName}
      flat={flat}
      onNavigate={onNavigate}
      renderItem={renderItem}
    />
  ));

  if (flat) {
    return <nav className={className} style={style} aria-label={location.replace('_', ' ')}>{nodes}</nav>;
  }

  return (
    <nav className={className} style={style} aria-label={location.replace('_', ' ')}>
      <ul className={listClassName} style={listClassName ? undefined : { display: 'contents', listStyle: 'none', margin: 0, padding: 0 }}>
        {nodes}
      </ul>
    </nav>
  );
}

function MenuNavNode({
  item,
  themeKey,
  itemClassName,
  linkClassName,
  activeClassName,
  flat,
  onNavigate,
  renderItem,
}: {
  item: MenuItem;
  themeKey?: string;
  itemClassName?: string;
  linkClassName?: string;
  activeClassName?: string;
  flat?: boolean;
  onNavigate?: () => void;
  renderItem?: MenuNavProps['renderItem'];
}) {
  const link = (
    <MenuLink
      item={item}
      themeKey={themeKey}
      className={linkClassName}
      activeClassName={activeClassName}
      onNavigate={onNavigate}
      render={renderItem}
    />
  );

  const childList = item.children && item.children.length > 0 ? (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {item.children.map((child) => (
        <MenuNavNode
          key={`${child.id ?? child.title}-${child.url}`}
          item={child}
          themeKey={themeKey}
          itemClassName={itemClassName}
          linkClassName={linkClassName}
          activeClassName={activeClassName}
          flat={flat}
          onNavigate={onNavigate}
          renderItem={renderItem}
        />
      ))}
    </ul>
  ) : null;

  if (flat) {
    return (
      <>
        {link}
        {childList}
      </>
    );
  }

  return (
    <li className={itemClassName}>
      {link}
      {childList}
    </li>
  );
}
