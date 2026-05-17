import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-freelance-wrapper">
      <main>
        {children}
      </main>
    </div>
  );
}
