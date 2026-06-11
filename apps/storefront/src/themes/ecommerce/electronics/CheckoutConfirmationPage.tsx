'use client';

import { ElectronicsFooter, ElectronicsHeader } from './components';
import EcommerceCheckoutConfirmationPage from '@/themes/ecommerce/shared/EcommerceCheckoutConfirmationPage';

interface CheckoutConfirmationPageProps {
  orderNumber: string;
}

export default function CheckoutConfirmationPage({ orderNumber }: CheckoutConfirmationPageProps) {
  return (
    <EcommerceCheckoutConfirmationPage
      classPrefix="el"
      orderNumber={orderNumber}
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
