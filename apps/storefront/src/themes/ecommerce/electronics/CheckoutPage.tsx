'use client';

import { ElectronicsFooter, ElectronicsHeader } from './components';
import EcommerceCheckoutPage from '@/themes/ecommerce/shared/EcommerceCheckoutPage';

export default function CheckoutPage() {
  return (
    <EcommerceCheckoutPage
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
