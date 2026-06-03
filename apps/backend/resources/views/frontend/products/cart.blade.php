@extends('frontend._layouts._app')

@section('title', __('Your Shopping Cart'))
@section('body_class', 'has-body-glow frontend-page--cart')

@section('content')
<x-frontend.page-shell variant="cart">
    <div class="page-title-section mb-4 mb-lg-5">
        <span class="metric-label">{{ __('Commerce') }}</span>
        <h1 class="fw-800 mb-0 tracking-tight text-dark display-6">{{ __('Your Shopping Cart') }}</h1>
    </div>

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
        <div class="row g-4">
            <div class="col-lg-8">
                @foreach($cart->items as $item)
                    <div class="glass-surface rounded-4 border-0 p-3 mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <img src="{{ $item->product->primary_image_url }}" width="80" height="80" class="rounded-3" alt="" style="object-fit:cover">
                            <div class="flex-grow-1 min-w-0">
                                <h6 class="mb-0 fw-bold text-truncate">{{ $item->product->title }}</h6>
                                <small class="text-muted">{{ $item->unit_price_formatted }}</small>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold">${{ number_format($item->total_price, 2) }}</div>
                                <form action="{{ route('cart.remove', $item->id) }}" method="POST">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-link btn-sm text-danger p-0">{{ __('Remove') }}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="col-lg-4">
                <div class="glass-surface rounded-4 border-0 p-4 sticky-top" style="top:calc(var(--frontend-header-offset) + 1rem)">
                    <h5 class="fw-bold mb-3">{{ __('Summary') }}</h5>
                    <div class="d-flex justify-content-between mb-3">
                        <span class="text-muted">{{ __('Subtotal') }}</span>
                        <span class="fw-bold">${{ number_format($cart->temp_total, 2) }}</span>
                    </div>
                    <a href="{{ route('checkout.index') }}" class="btn btn-primary-theme w-100 rounded-pill py-3 fw-800">
                        {{ __('Proceed to Checkout') }}
                    </a>
                </div>
            </div>
        </div>
    @endif
</x-frontend.page-shell>
@endsection
