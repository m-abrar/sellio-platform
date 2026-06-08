import React from 'react';
import './styles.css';
import '@/themes/classifieds/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
