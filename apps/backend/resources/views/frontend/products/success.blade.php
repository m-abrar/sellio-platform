@extends('frontend._layouts._app')

@section('title', __('Order Confirmed'))
@section('body_class', 'has-body-glow frontend-page--checkout-success')

@section('content')
<x-frontend.page-shell variant="checkout-success">
    <div class="row justify-content-center">
        <div class="col-lg-7">
            <div class="glass-surface rounded-4 border-0 p-4 p-lg-5 text-center">
                <div class="display-5 fw-800 text-success mb-3">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <span class="metric-label">{{ __('Payment confirmed') }}</span>
                <h1 class="fw-800 text-dark mb-3">{{ __('Your order is confirmed') }}</h1>
                <p class="text-muted mb-4">{{ $message }}</p>

                <div class="border rounded-3 p-3 text-start mb-4">
                    <div class="small text-muted">{{ __('Payment Reference') }}</div>
                    <div class="fw-bold text-break">{{ $reference }}</div>
                </div>

                <a href="{{ route('products.index') }}" class="btn btn-primary-theme rounded-pill px-4">
                    {{ __('Continue Shopping') }}
                </a>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
