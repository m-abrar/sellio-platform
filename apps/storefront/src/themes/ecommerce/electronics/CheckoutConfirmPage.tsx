'use client';

import { ElectronicsFooter, ElectronicsHeader } from './components';
import EcommerceCheckoutConfirmPage from '@/themes/ecommerce/shared/EcommerceCheckoutConfirmPage';

export default function CheckoutConfirmPage() {
  return (
    <EcommerceCheckoutConfirmPage
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
