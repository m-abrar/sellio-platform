@extends('frontend._layouts._app')

@section('content')
<div class="container py-5">
    <h2 class="fw-bold mb-4">{{ __('Your Shopping Cart') }}</h2>

    @if($cart->items->isEmpty())
        <div class="text-center py-5">
            <i class="bi bi-cart-x display-1 text-muted"></i>
            <p class="mt-3">{{ __('Your cart is empty.') }}</p>
            <a href="{{ route('products.index') }}" class="btn btn-primary">{{ __('Go Shopping') }}</a>
        </div>
    @else
        <div class="row g-4">
            <div class="col-lg-8">
                @foreach($cart->items as $item)
                    <div class="card mb-3 shadow-sm border-0 rounded-4">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <img src="{{ $item->product->primary_image_url }}" width="80" class="rounded">
                                <div class="ms-3 flex-grow-1">
                                    <h6 class="mb-0 fw-bold">{{ $item->product->title }}</h6>
                                    <small class="text-muted">{{ $item->unit_price_formatted }}</small>
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold">${{ number_format($item->total_price, 2) }}</div>
                                    <form action="{{ route('cart.remove', $item->id) }}" method="POST">
                                        @csrf @method('DELETE')
                                        <button class="btn btn-link btn-sm text-danger p-0">{{ __('Remove') }}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 bg-light">
                    <div class="card-body">
                        <h5 class="fw-bold">{{ __('Summary') }}</h5>
                        <hr>
                        <div class="d-flex justify-content-between mb-2">
                            <span>{{ __('Subtotal') }}</span>
                            <span class="fw-bold">${{ number_format($cart->temp_total, 2) }}</span>
                        </div>
                        <a href="{{ route('checkout.index') }}" class="btn btn-dark w-100 rounded-pill mt-3">
                            {{ __('Proceed to Checkout') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
@endsection