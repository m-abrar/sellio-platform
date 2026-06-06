@extends('frontend._layouts._app')

@section('title', __('Order Confirmed') . ' | ' . __('Step 3 of 3'))
@section('body_class', 'has-body-glow frontend-page--checkout-success')

@section('content')
<x-frontend.page-shell variant="checkout-success">
    <div class="booking-header page-title-section mb-4 mb-lg-5">
        <div class="text-center">
            <span class="metric-label mx-auto">{{ __('Commerce') }}</span>
            <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
                {{ __('Order Confirmed') }}<span class="text-primary-color">: {{ __('Step 3 of 3') }}</span>
            </h1>
            <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">
                {{ __('Your payment was received and your order is being prepared.') }}
            </p>
        </div>
    </div>

    @include('frontend.products._partials._checkout-stepper', [
        'step' => 3,
        'confirmIcon' => 'bi-bag-check-fill',
        'confirmLabelClass' => 'text-success',
    ])

    <div class="row justify-content-center pb-5">
        <div class="col-lg-8">
            <div class="glass-surface rounded-4 border-0 p-4 p-lg-5 text-center shadow-deep">
                <i class="booking-confirmation-status-icon bi bi-check-circle-fill text-success mb-4"></i>

                <h2 class="fw-800 text-success mb-3">{{ __('Your order is confirmed') }}</h2>
                <p class="text-muted mb-4">{{ $message }}</p>

                <div class="border rounded-4 p-4 text-start mb-4 bg-white">
                    <div class="small text-muted">{{ __('Payment Reference') }}</div>
                    <div class="fw-bold text-break">{{ $reference }}</div>
                </div>

                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="{{ route('products.index') }}" class="btn btn-primary-theme rounded-pill px-4 fw-bold">
                        {{ __('Continue Shopping') }}
                    </a>
                    <a href="{{ route('dashboard') }}" class="btn btn-outline-primary-theme rounded-pill px-4 fw-bold">
                        {{ __('Go to Dashboard') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
