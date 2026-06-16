import React from 'react';
import { B2BFooter, B2BHeader, B2BTopbar } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-b2b-theme">
      <B2BTopbar />
      <B2BHeader />
      <main>{children}</main>
      <B2BFooter />
    </div>
  );
}
