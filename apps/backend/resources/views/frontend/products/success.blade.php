@extends('frontend._layouts._app')

@section('title', __('Order Confirmed'))
@section('body_class', 'has-body-glow frontend-page--checkout-success')

@section('content')
<x-frontend.page-shell variant="checkout-success">
    @include('frontend._partials._checkout_success_hero', [
        'eyebrow' => __('Thank you'),
        'title' => __('Your order is confirmed'),
        'message' => $message,
        'icon' => 'bi-bag-heart-fill',
        'tone' => 'success',
        'reference' => $reference,
        'referenceLabel' => __('Payment Reference'),
    ])

    <div class="row justify-content-center pb-5">
        <div class="col-lg-8">
            <div class="bg-white border rounded-4 p-4 p-lg-5 text-center">
                <p class="text-muted mb-4">{{ __('We are preparing your order. You will receive updates as it moves along.') }}</p>

                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="{{ route('products.index') }}" class="btn btn-primary px-4">
                        {{ __('Continue Shopping') }}
                    </a>
                    <a href="{{ route('dashboard') }}" class="btn btn-outline-secondary px-4">
                        {{ __('Go to Dashboard') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
