'use client';

import EcommerceCheckoutConfirmationPage from '@/themes/ecommerce/shared/EcommerceCheckoutConfirmationPage';

interface CheckoutConfirmationPageProps {
  orderNumber: string;
}

export default function CheckoutConfirmationPage({ orderNumber }: CheckoutConfirmationPageProps) {
  return <EcommerceCheckoutConfirmationPage classPrefix="ef" orderNumber={orderNumber} />;
}
