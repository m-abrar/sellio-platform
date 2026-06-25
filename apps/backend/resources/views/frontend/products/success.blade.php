@extends('frontend._layouts._app')

@section('title', __('Order Confirmed'))
@section('body_class', 'has-body-glow frontend-page--checkout-success')

@section('content')
<x-frontend.page-shell variant="checkout-success">

    {{-- ── Step 3 confirmation hero strip ──────────────────────────── --}}
    <div class="booking-hero">
        <div class="booking-hero__inner text-center">

            <div class="booking-hero__confirm-icon booking-hero__confirm-icon--success mb-3 mx-auto">
                <i class="bi bi-bag-heart-fill"></i>
            </div>

            <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:#4ade80">
                {{ __('Thank you!') }}
            </p>

            <h1 class="fw-800 tracking-tight mb-2"
                style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.75rem);color:#fff;letter-spacing:-0.03em">
                {{ __('Your order is confirmed') }}
            </h1>

            <p class="booking-hero__subtitle mx-auto">
                {{ __('We are preparing your order and will send you updates as it moves along.') }}
            </p>

            <div class="booking-confirmation-ref d-inline-flex align-items-center gap-2 mt-4">
                <i class="bi bi-receipt"></i>
                <span>{{ __('Order') }}: <strong>{{ $order->order_number }}</strong></span>
            </div>

        </div>
    </div>

    {{-- ── Stepper at step 3 ───────────────────────────────────────── --}}
    <div class="mt-4 mt-lg-5">
        @include('frontend.products._partials._checkout-stepper', [
            'step'        => 3,
            'confirmIcon' => 'bi-bag-check-fill',
        ])
    </div>

    {{-- ── Order summary + CTA ────────────────────────────────────── --}}
    @php $dashboardUrl = setting('url_user') ?: url('/'); @endphp
    <div class="row justify-content-center pb-5">
        <div class="col-xl-7 col-lg-8">

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
                    <span class="badge rounded-pill fw-semibold px-3 py-2" style="background:rgba(74,222,128,.12);color:#16a34a;font-size:.78rem">
                        <i class="bi bi-check-circle-fill me-1"></i>{{ __('Confirmed') }}
                    </span>
                </div>
                @if(filled($reference) && $reference !== 'N/A')
                <div>
                    <div class="text-muted" style="font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase">{{ __('Reference') }}</div>
                    <div class="fw-bold text-dark font-monospace" style="font-size:.85rem">{{ $reference }}</div>
                </div>
                @endif
            </div>

            <div class="bg-white border rounded-4 p-4 p-lg-5 text-center">
                <p class="text-muted mb-5">
                    {{ __('Your receipt has been sent to your account email. You can track your order status from your dashboard.') }}
                </p>
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
