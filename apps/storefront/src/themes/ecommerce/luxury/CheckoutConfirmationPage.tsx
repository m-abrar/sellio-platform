'use client';

import { LuxuryHeader } from './components';
import EcommerceCheckoutConfirmationPage from '@/themes/ecommerce/shared/EcommerceCheckoutConfirmationPage';

interface CheckoutConfirmationPageProps {
  orderNumber: string;
}

export default function CheckoutConfirmationPage({ orderNumber }: CheckoutConfirmationPageProps) {
  return (
    <EcommerceCheckoutConfirmationPage
      classPrefix="ecl"
      orderNumber={orderNumber}
      shell={(content) => (
        <>
          <LuxuryHeader />
          {content}
        </>
      )}
    />
  );
}
