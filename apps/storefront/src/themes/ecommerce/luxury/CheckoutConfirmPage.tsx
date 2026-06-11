'use client';

import { LuxuryHeader } from './components';
import EcommerceCheckoutConfirmPage from '@/themes/ecommerce/shared/EcommerceCheckoutConfirmPage';

export default function CheckoutConfirmPage() {
  return (
    <EcommerceCheckoutConfirmPage
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
