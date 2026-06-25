@extends('frontend._layouts._app')

@section('title', __('Order Pending Verification'))
@section('body_class', 'has-body-glow frontend-page--checkout-success')

@section('content')
<x-frontend.page-shell variant="checkout-success">

    {{-- ── Pending hero strip ── --}}
    <div class="booking-hero">
        <div class="booking-hero__inner text-center">

            <div class="booking-hero__confirm-icon mb-3 mx-auto"
                 style="background:rgba(251,191,36,.15);border:2px solid rgba(251,191,36,.35);width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center">
                <i class="bi bi-hourglass-split" style="font-size:2rem;color:#fbbf24"></i>
            </div>

            <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:#fbbf24">
                {{ __('Awaiting Verification') }}
            </p>

            <h1 class="fw-800 tracking-tight mb-2"
                style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.75rem);color:#fff;letter-spacing:-0.03em">
                {{ __('Order received — payment pending') }}
            </h1>

            <p class="booking-hero__subtitle mx-auto">
                @if($payment && $payment->proof_file)
                    {{ __('Your bank transfer receipt has been submitted. We will confirm your order once the payment is verified.') }}
                @else
                    {{ __('Your order is placed and awaiting payment. Please transfer the amount using the bank details provided and contact us with your receipt.') }}
                @endif
            </p>

            <div class="booking-confirmation-ref d-inline-flex align-items-center gap-2 mt-4">
                <i class="bi bi-receipt"></i>
                <span>{{ __('Order') }}: <strong>{{ $order->order_number }}</strong></span>
            </div>

        </div>
    </div>

    {{-- ── Stepper at step 3 ── --}}
    <div class="mt-4 mt-lg-5">
        @include('frontend.products._partials._checkout-stepper', [
            'step'        => 3,
            'confirmIcon' => 'bi-hourglass-split',
        ])
    </div>

    {{-- ── Status card ── --}}
    @php $dashboardUrl = setting('url_user') ?: url('/'); @endphp
    <div class="row justify-content-center pb-5">
        <div class="col-xl-7 col-lg-8">

            {{-- What happens next --}}
            <div class="bg-white border rounded-4 p-4 p-lg-5 mb-4">
                <h5 class="fw-bold mb-4" style="font-size:.9rem;letter-spacing:.04em;text-transform:uppercase;color:#374151">
                    <i class="bi bi-list-check me-2" style="color:var(--primary-color)"></i>{{ __('What happens next') }}
                </h5>

                <div class="d-flex flex-column gap-3">
                    <div class="d-flex align-items-start gap-3">
                        <div style="width:32px;height:32px;border-radius:50%;background:rgba(var(--primary-color-rgb),.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
                            <i class="bi bi-1-circle-fill" style="color:var(--primary-color);font-size:.9rem"></i>
                        </div>
                        <div>
                            <div class="fw-semibold text-dark" style="font-size:.875rem">{{ __('Receipt under review') }}</div>
                            <p class="text-muted mb-0" style="font-size:.8125rem">{{ __('Our team will verify your uploaded bank transfer receipt, usually within 1–2 business days.') }}</p>
                        </div>
                    </div>

                    <div class="d-flex align-items-start gap-3">
                        <div style="width:32px;height:32px;border-radius:50%;background:rgba(var(--primary-color-rgb),.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
                            <i class="bi bi-2-circle-fill" style="color:var(--primary-color);font-size:.9rem"></i>
                        </div>
                        <div>
                            <div class="fw-semibold text-dark" style="font-size:.875rem">{{ __('Order confirmed') }}</div>
                            <p class="text-muted mb-0" style="font-size:.8125rem">{{ __('Once approved, your order status will change to confirmed and we will begin processing your shipment.') }}</p>
                        </div>
                    </div>

                    <div class="d-flex align-items-start gap-3">
                        <div style="width:32px;height:32px;border-radius:50%;background:rgba(var(--primary-color-rgb),.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
                            <i class="bi bi-3-circle-fill" style="color:var(--primary-color);font-size:.9rem"></i>
                        </div>
                        <div>
                            <div class="fw-semibold text-dark" style="font-size:.875rem">{{ __('Email notification') }}</div>
                            <p class="text-muted mb-0" style="font-size:.8125rem">{{ __('You will receive an email when your order is confirmed or if we need additional information.') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Order summary strip --}}
            <div class="bg-white border rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                    <div class="text-muted" style="font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase">{{ __('Order Number') }}</div>
                    <div class="fw-bold text-dark font-monospace" style="font-size:1rem">{{ $order->order_number }}</div>
                </div>
                <div>
                    <div class="text-muted" style="font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase">{{ __('Amount') }}</div>
                    <div class="fw-bold text-dark" style="font-size:1rem">{{ format_currency($order->total_amount) }}</div>
                </div>
                <div>
                    <div class="text-muted" style="font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase">{{ __('Status') }}</div>
                    <span class="badge rounded-pill fw-semibold px-3 py-2" style="background:rgba(251,191,36,.12);color:#d97706;font-size:.78rem">
                        <i class="bi bi-hourglass-split me-1"></i>{{ __('Pending Verification') }}
                    </span>
                </div>
                @if($payment)
                <div>
                    <div class="text-muted" style="font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase">{{ __('Reference') }}</div>
                    <div class="fw-bold text-dark font-monospace" style="font-size:.85rem">{{ $payment->transaction_id }}</div>
                </div>
                @endif
            </div>

            {{-- CTA buttons --}}
            <div class="text-center">
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="{{ route('products.index') }}" class="btn btn-primary btn-header-cta py-3 px-4">
                        <i class="bi bi-bag me-2"></i>{{ __('Continue Shopping') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                    <a href="{{ $dashboardUrl }}" class="btn btn-outline-secondary fw-semibold py-3 px-4">
                        <i class="bi bi-grid me-2"></i>{{ __('My Orders') }}
                    </a>
                </div>
            </div>

        </div>
    </div>

</x-frontend.page-shell>
@endsection
