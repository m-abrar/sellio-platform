'use client';

import React from 'react';
import { ElectronicsHeader, ElectronicsFooter } from './components';
import EcommerceCartPage from '@/themes/ecommerce/shared/EcommerceCartPage';

export default function CartPage() {
  return (
    <EcommerceCartPage
      classPrefix="el"
      shell={(content) => (
        <>
          <ElectronicsHeader />
          {content}
          <ElectronicsFooter />
        </>
      )}
    />
  );
}
