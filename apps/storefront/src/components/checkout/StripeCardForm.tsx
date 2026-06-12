'use client';

import React, { useEffect, useRef, useState } from 'react';
import './checkout-payment.css';

declare global {
  interface Window {
    Stripe?: (key: string) => {
      elements: (options?: {
        appearance?: {
          theme?: string;
          variables?: Record<string, string>;
          rules?: Record<string, Record<string, string>>;
        };
      }) => {
        create: (
          type: string,
          options?: Record<string, unknown>,
        ) => {
          mount: (element: HTMLElement) => void;
          unmount: () => void;
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
    const cardElementRef = useRef<{ unmount: () => void } | null>(null);
    const stripeRef = useRef<ReturnType<NonNullable<typeof window.Stripe>> | null>(null);
    const onErrorRef = useRef(onError);
    const onReadyChangeRef = useRef(onReadyChange);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fieldError, setFieldError] = useState<string | null>(null);

    onErrorRef.current = onError;
    onReadyChangeRef.current = onReadyChange;

    useEffect(() => {
      let cancelled = false;
      const mountNode = mountRef.current;

      async function init() {
        try {
          await loadStripeScript();
          if (cancelled || !mountNode || !window.Stripe) {
            return;
          }

          const stripe = window.Stripe(publishableKey);
          const elements = stripe.elements({
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                colorTextPlaceholder: '#94a3b8',
                colorDanger: '#dc2626',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSizeBase: '16px',
                spacingUnit: '4px',
                borderRadius: '12px',
              },
            },
          });

          const card = elements.create('card', {
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                lineHeight: '24px',
                color: '#0f172a',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#dc2626',
                iconColor: '#dc2626',
              },
            },
          });

          card.mount(mountNode);
          card.on('change', (event) => {
            const message = event.error?.message ?? null;
            setFieldError(message);
            onErrorRef.current?.(message);
          });

          if (cancelled) {
            card.unmount();
            return;
          }

          stripeRef.current = stripe;
          cardElementRef.current = card;
          setReady(true);
          setLoading(false);
          onReadyChangeRef.current?.(true);
        } catch (error) {
          if (cancelled) {
            return;
          }

          const message = error instanceof Error ? error.message : 'Unable to initialize Stripe.';
          setFieldError(message);
          setLoading(false);
          onErrorRef.current?.(message);
          onReadyChangeRef.current?.(false);
        }
      }

      void init();

      return () => {
        cancelled = true;
        cardElementRef.current?.unmount();
        cardElementRef.current = null;
        stripeRef.current = null;
        setReady(false);
        setLoading(true);
      };
    }, [publishableKey]);

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
      <div className="sellio-stripe-card-field">
        <span className="sellio-stripe-card-field__label" id="sellio-stripe-card-label">
          Card number, expiry, and CVC
        </span>
        <div
          className={[
            'sellio-stripe-card-shell',
            ready ? 'is-ready' : '',
            fieldError ? 'is-invalid' : '',
          ].filter(Boolean).join(' ')}
        >
          {!ready && (
            <div className="sellio-stripe-card-skeleton" aria-hidden="true">
              <span />
            </div>
          )}
          <div
            ref={mountRef}
            className="sellio-stripe-card-mount"
            role="group"
            aria-labelledby="sellio-stripe-card-label"
          />
        </div>
        {loading && !fieldError && (
          <p className="sellio-stripe-card-loading">Loading secure payment form…</p>
        )}
        {fieldError && (
          <p className="sellio-stripe-card-error" role="alert">{fieldError}</p>
        )}
      </div>
    );
  },
);
