
import React from 'react';
import './styles.css';
import { TradeHeader, ExchangeFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="trade-node-wrapper">
      <TradeHeader />
      <main>
        {children}
      </main>
      <ExchangeFooter />
    </div>
  );
}
