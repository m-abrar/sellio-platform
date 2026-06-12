'use client';

import React from 'react';
import type { PaymentGatewayOption } from '@sellio/types';
import { StripeCardForm, type StripeCardFormHandle } from '@/components/checkout/StripeCardForm';
import './checkout-payment.css';

function gatewayHint(slug: string): string {
  switch (slug) {
    case 'stripe':
      return 'Card · Apple Pay · Google Pay';
    case 'paypal':
      return 'Pay with PayPal balance or card';
    case 'bank_transfer':
      return 'Manual transfer · instructions after order';
    default:
      return 'Secure checkout';
  }
}

function GatewayIcon({ slug }: { slug: string }) {
  if (slug === 'stripe') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (slug === 'paypal') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h9.5a3.5 3.5 0 0 1 0 7H11l-1 4H6l1.5-7H7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M8 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export interface CheckoutPaymentSectionProps {
  gateways: PaymentGatewayOption[];
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  stripePublishableKey?: string | null;
  stripeEnabled: boolean;
  cardholderName: string;
  stripeRef: React.Ref<StripeCardFormHandle>;
  onStripeError: (message: string | null) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function CheckoutPaymentSection({
  gateways,
  paymentMethod,
  onPaymentMethodChange,
  stripePublishableKey,
  stripeEnabled,
  cardholderName,
  stripeRef,
  onStripeError,
  className,
  title = 'Payment',
  subtitle = 'All transactions are encrypted and processed securely.',
}: CheckoutPaymentSectionProps) {
  const resolvedGateways = gateways.length
    ? gateways
    : [{ slug: 'bank_transfer', title: 'Bank transfer', mode: 'manual' }];

  return (
    <section className={['sellio-checkout-payment', className].filter(Boolean).join(' ')}>
      <header className="sellio-checkout-payment__header">
        <div className="sellio-checkout-payment__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="sellio-checkout-payment__title">{title}</h2>
          <p className="sellio-checkout-payment__subtitle">{subtitle}</p>
        </div>
      </header>

      <div className="sellio-pay-gateways" role="radiogroup" aria-label="Payment method">
        {resolvedGateways.map((gateway) => {
          const selected = paymentMethod === gateway.slug;

          return (
            <button
              key={gateway.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`sellio-pay-gateway${selected ? ' is-selected' : ''}`}
              onClick={() => onPaymentMethodChange(gateway.slug)}
            >
              <span className="sellio-pay-gateway__icon">
                <GatewayIcon slug={gateway.slug} />
              </span>
              <span className="sellio-pay-gateway__label">
                <span className="sellio-pay-gateway__name">{gateway.title}</span>
                <span className="sellio-pay-gateway__hint">{gatewayHint(gateway.slug)}</span>
              </span>
              {selected && (
                <span className="sellio-pay-gateway__check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {paymentMethod === 'stripe' && stripeEnabled && stripePublishableKey && (
        <div className="sellio-pay-card-block">
          <h3 className="sellio-pay-card-block__heading">Card details</h3>
          <StripeCardForm
            key={`stripe-${stripePublishableKey}`}
            ref={stripeRef}
            publishableKey={stripePublishableKey}
            cardholderName={cardholderName}
            onError={onStripeError}
          />
          <div className="sellio-pay-trust">
            <span className="sellio-pay-trust__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              SSL Secure
            </span>
            <span>Powered by Stripe · PCI DSS compliant</span>
          </div>
        </div>
      )}

      {paymentMethod === 'stripe' && !stripeEnabled && (
        <p className="sellio-pay-warning" role="alert">
          Stripe is not configured for this store. Choose another payment method or contact support.
        </p>
      )}

      {paymentMethod === 'bank_transfer' && (
        <p className="sellio-pay-bank-note">
          You will receive bank transfer instructions and a payment reference after placing your order.
        </p>
      )}
    </section>
  );
}
