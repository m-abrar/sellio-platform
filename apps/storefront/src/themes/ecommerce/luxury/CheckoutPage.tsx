'use client';

import { LuxuryHeader } from './components';
import EcommerceCheckoutPage from '@/themes/ecommerce/shared/EcommerceCheckoutPage';

export default function CheckoutPage() {
  return (
    <EcommerceCheckoutPage
      classPrefix="ecl"
      shell={(content) => (
        <>
          <LuxuryHeader />
          {content}
        </>
      )}
    />
  );
}
