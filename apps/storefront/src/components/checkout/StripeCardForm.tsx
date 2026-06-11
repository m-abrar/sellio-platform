'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Stripe?: (key: string) => {
      elements: () => {
        create: (type: string) => {
          mount: (element: HTMLElement) => void;
          on: (event: string, handler: (event: { error?: { message?: string } }) => void) => void;
        };
      };
      createPaymentMethod: (options: {
        type: string;
        card: unknown;
        billing_details?: { name?: string };
      }) => Promise<{ paymentMethod?: { id: string }; error?: { message?: string } }>;
    };
  }
}

interface StripeCardFormProps {
  publishableKey: string;
  cardholderName: string;
  onReadyChange?: (ready: boolean) => void;
  onError?: (message: string | null) => void;
}

export interface StripeCardFormHandle {
  createPaymentMethod: () => Promise<string>;
}

function loadStripeScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Stripe is only available in the browser.'));
  }

  if (window.Stripe) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-sellio-stripe]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Stripe.js')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.dataset.sellioStripe = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
}

export const StripeCardForm = React.forwardRef<StripeCardFormHandle, StripeCardFormProps>(
  function StripeCardForm({ publishableKey, cardholderName, onReadyChange, onError }, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const cardElementRef = useRef<unknown>(null);
    const stripeRef = useRef<ReturnType<NonNullable<typeof window.Stripe>> | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      let cancelled = false;

      async function init() {
        try {
          await loadStripeScript();
          if (cancelled || !mountRef.current || !window.Stripe) {
            return;
          }

          const stripe = window.Stripe(publishableKey);
          const elements = stripe.elements();
          const card = elements.create('card');

          card.mount(mountRef.current);
          card.on('change', (event) => {
            onError?.(event.error?.message ?? null);
          });

          stripeRef.current = stripe;
          cardElementRef.current = card;
          setReady(true);
          onReadyChange?.(true);
        } catch (error) {
          onError?.(error instanceof Error ? error.message : 'Unable to initialize Stripe.');
          onReadyChange?.(false);
        }
      }

      init();

      return () => {
        cancelled = true;
      };
    }, [publishableKey, onError, onReadyChange]);

    React.useImperativeHandle(ref, () => ({
      createPaymentMethod: async () => {
        if (!stripeRef.current || !cardElementRef.current) {
          throw new Error('Stripe is not ready yet.');
        }

        const result = await stripeRef.current.createPaymentMethod({
          type: 'card',
          card: cardElementRef.current,
          billing_details: { name: cardholderName || undefined },
        });

        if (result.error?.message) {
          throw new Error(result.error.message);
        }

        if (!result.paymentMethod?.id) {
          throw new Error('Payment method could not be created.');
        }

        return result.paymentMethod.id;
      },
    }));

    return (
      <div>
        <div ref={mountRef} />
        {!ready && <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading secure payment form...</p>}
      </div>
    );
  },
);
