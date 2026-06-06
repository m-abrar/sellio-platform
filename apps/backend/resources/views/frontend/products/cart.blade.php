@extends('frontend._layouts._app')

@section('title', __('Your Shopping Cart') . ' | ' . __('Step 1 of 3'))
@section('body_class', 'has-body-glow frontend-page--cart')

@section('content')
<x-frontend.page-shell variant="cart">
    <div class="booking-header page-title-section mb-4 mb-lg-5">
        <div class="text-center">
            <span class="metric-label mx-auto">{{ __('Commerce') }}</span>
            <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
                {{ __('Your Shopping Cart') }}<span class="text-primary-color">: {{ __('Step 1 of 3') }}</span>
            </h1>
            <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">
                {{ __('Review your items before continuing to secure checkout.') }}
            </p>
        </div>
    </div>

    @if($cart->items->isNotEmpty())
        @include('frontend.products._partials._checkout-stepper', ['step' => 1])
    @endif

    @if($cart->items->isEmpty())
        <div class="row">
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-cart-x',
                'title' => __('Your cart is empty.'),
                'description' => __('Browse the catalog and add items to continue.'),
                'route' => route('products.index'),
                'label' => __('Go Shopping'),
            ])
        </div>
    @else
        <div class="row g-4 booking-layout">
            <div class="col-lg-8 booking-layout__main">
                @foreach($cart->items as $item)
                    <div class="glass-surface rounded-4 border-0 p-3 p-md-4 mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <img src="{{ $item->product->primary_image_url }}" width="80" height="80" class="rounded-3" alt="" style="object-fit:cover">
                            <div class="flex-grow-1 min-w-0">
                                <h6 class="mb-0 fw-bold text-truncate">{{ $item->product->title }}</h6>
                                <small class="text-muted">{{ $item->unit_price_formatted }}</small>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold">{{ format_currency($item->total_price) }}</div>
                                <form action="{{ route('cart.remove', $item->id) }}" method="POST">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-link btn-sm text-danger p-0">{{ __('Remove') }}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="col-lg-4 booking-layout__aside">
                <aside class="sticky-sidebar">
                    <div class="glass-surface rounded-4 border-0 p-4 p-md-5 shadow-deep">
                        <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Summary') }}</h4>

                        <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur mb-4">
                            <p class="filter-label mb-1">{{ __('Subtotal') }}</p>
                            <h2 class="price-text-large mb-0 line-height-1 text-primary-color">{{ format_currency($cart->temp_total) }}</h2>
                        </div>

                        <a href="{{ route('checkout.index') }}" class="btn btn-primary-theme w-100 rounded-pill py-3 fw-800 shadow-deep">
                            {{ __('Proceed to Checkout') }} <i class="bi bi-arrow-right-circle-fill ms-2"></i>
                        </a>
                    </div>
                </aside>
            </div>
        </div>
    @endif
</x-frontend.page-shell>
@endsection
