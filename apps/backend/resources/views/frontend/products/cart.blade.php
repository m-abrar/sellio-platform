@extends('frontend._layouts._app')

@section('title', __('Your Shopping Cart') . ' | ' . __('Step 1 of 3'))
@section('body_class', 'has-body-glow frontend-page--cart')

@section('content')
<x-frontend.page-shell variant="cart">

    {{-- ── Step 1 dark hero strip ──────────────────────────────────── --}}
    <div class="booking-hero">
        <div class="booking-hero__inner text-center">
            <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
                <i class="bi bi-bag me-1"></i>{{ __('Commerce') }}
            </p>
            <h1 class="fw-800 tracking-tight mb-2"
                style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.75rem);color:#fff;letter-spacing:-0.03em">
                {{ __('Your Shopping Cart') }}
            </h1>
            <p class="booking-hero__subtitle mx-auto">
                {{ __('Review your items before continuing to secure checkout.') }}
            </p>
        </div>
    </div>

    @php $cartSubtotal = $cart->calculateTotal(); @endphp

    {{-- ── Stepper ─────────────────────────────────────────────────── --}}
    @if($cart->items->isNotEmpty())
        <div class="mt-4 mt-lg-5">
            @include('frontend.products._partials._checkout-stepper', ['step' => 1])
        </div>
    @endif

    {{-- ── Cart body ───────────────────────────────────────────────── --}}
    @if($cart->items->isEmpty())
        <div class="row">
            @include('frontend._partials._listing-empty-state', [
                'icon'        => 'bi-cart-x',
                'title'       => __('Your cart is empty.'),
                'description' => __('Browse the catalog and add items to continue.'),
                'route'       => route('products.index'),
                'label'       => __('Go Shopping'),
            ])
        </div>
    @else
        <div class="row g-4 booking-layout"
             x-data="cartManager()"
             x-init="init({{ $cart->items->map(fn($i) => ['id' => $i->id, 'qty' => $i->quantity, 'price' => (float) $i->unit_price])->values()->toJson() }})">

            {{-- Items ──────────────────────────────────────────────── --}}
            <div class="col-lg-8 booking-layout__main">

                @foreach($cart->items as $item)
                <div class="bg-white border rounded-4 p-3 p-md-4 mb-3"
                     x-data="cartItem({{ $item->id }}, {{ $item->quantity }}, {{ (float) $item->unit_price }})"
                     x-init="register()">

                    <div class="d-flex align-items-start align-items-sm-center gap-3 flex-column flex-sm-row">

                        <img src="{{ $item->product->primary_image_url }}"
                             width="80" height="80"
                             class="rounded-3 object-fit-cover flex-shrink-0"
                             alt="{{ $item->product->title }}">

                        <div class="flex-grow-1 min-w-0">
                            <h6 class="mb-1 fw-800 text-dark">{{ $item->product->title }}</h6>
                            <p class="small text-muted mb-0">{{ $item->unit_price_formatted }} {{ __('each') }}</p>
                        </div>

                        <div class="d-flex align-items-center gap-3 flex-shrink-0 ms-sm-auto">

                            {{-- Qty controls ─────────────────────── --}}
                            <div class="d-flex align-items-center gap-1 cart-qty-control">
                                <button type="button"
                                        class="btn btn-outline-secondary cart-qty-btn"
                                        :disabled="qty <= 1 || saving"
                                        aria-label="{{ __('Decrease quantity') }}"
                                        @click="decrement">
                                    <i class="bi bi-dash" aria-hidden="true"></i>
                                </button>

                                <input type="number"
                                       x-model.number="qty"
                                       @change="syncInput"
                                       min="1" max="100"
                                       class="form-control cart-qty-input text-center fw-800"
                                       :disabled="saving"
                                       aria-label="{{ __('Quantity') }}">

                                <button type="button"
                                        class="btn btn-outline-secondary cart-qty-btn"
                                        :disabled="qty >= 100 || saving"
                                        aria-label="{{ __('Increase quantity') }}"
                                        @click="increment">
                                    <i class="bi bi-plus" aria-hidden="true"></i>
                                </button>
                            </div>

                            {{-- Line total + remove ──────────────── --}}
                            <div class="text-end" style="min-width:5rem">
                                <div class="fw-800 text-dark" x-text="lineTotal"></div>
                                <form action="{{ route('cart.remove', $item->id) }}" method="POST" class="d-inline">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-link btn-sm text-danger p-0 small">
                                        {{ __('Remove') }}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>

                    {{-- Saving indicator ────────────────────────── --}}
                    <div x-show="saving" x-cloak class="mt-2">
                        <div class="progress" style="height:2px">
                            <div class="progress-bar progress-bar-striped progress-bar-animated w-100"
                                 style="background:var(--primary-color)"></div>
                        </div>
                    </div>

                </div>
                @endforeach

            </div>

            {{-- Summary sidebar ─────────────────────────────────── --}}
            <div class="col-lg-4 booking-layout__aside">
                <aside class="sticky-sidebar">
                    <div class="bg-white border rounded-4 p-4 p-md-5">
                        <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Summary') }}</h4>

                        <div class="pricing-list mb-4">
                            @foreach($cart->items as $item)
                                <div class="d-flex justify-content-between mb-2 small">
                                    <span class="text-muted text-truncate pe-2">{{ $item->product->title }}</span>
                                    <span class="fw-800 text-dark flex-shrink-0"
                                          x-text="itemLineTotal({{ $item->id }})"></span>
                                </div>
                            @endforeach
                        </div>

                        <div class="p-4 rounded-4 text-center mb-4"
                             style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
                            <p class="filter-label mb-1">{{ __('Subtotal') }}</p>
                            <h2 class="price-text-large mb-0 line-height-1" style="color:var(--primary-color)"
                                x-text="subtotalFormatted"></h2>
                        </div>

                        <a href="{{ route('checkout.index') }}" class="btn btn-primary btn-header-cta w-100 py-3">
                            {{ __('Proceed to Checkout') }}<i class="bi bi-arrow-right-circle-fill ms-2"></i>
                        </a>
                    </div>
                </aside>
            </div>

        </div>
    @endif

</x-frontend.page-shell>
@endsection

@push('scripts')
<script>
(function () {
    const CSRF  = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    const SYM   = @json(setting('currency_symbol', '$'));
    const AFTER = false; // set true if symbol goes after the amount

    function fmt(amount) {
        const n = Number(amount).toFixed(2);
        return AFTER ? n + SYM : SYM + n;
    }

    /* ── Per-item Alpine component ────────────────────────────────── */
    document.addEventListener('alpine:init', () => {

        Alpine.data('cartItem', (id, initialQty, unitPrice) => ({
            id,
            qty: initialQty,
            unitPrice,
            saving: false,
            _timer: null,

            get lineTotal() { return fmt(this.qty * this.unitPrice); },

            register() {
                this.$dispatch('cart-item-register', { id: this.id, qty: this.qty, unitPrice: this.unitPrice });
            },

            increment() {
                if (this.qty >= 100) return;
                this.qty++;
                this._schedule();
            },

            decrement() {
                if (this.qty <= 1) return;
                this.qty--;
                this._schedule();
            },

            syncInput() {
                if (this.qty < 1)   this.qty = 1;
                if (this.qty > 100) this.qty = 100;
                this._schedule();
            },

            _schedule() {
                clearTimeout(this._timer);
                this._timer = setTimeout(() => this._patch(), 400);
                this.$dispatch('cart-item-changed', { id: this.id, qty: this.qty, unitPrice: this.unitPrice });
            },

            async _patch() {
                this.saving = true;
                try {
                    const url = @json(url('/cart/update')) + '/' + this.id;
                    const res = await fetch(url, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': CSRF,
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({ quantity: this.qty }),
                    });
                    if (!res.ok) throw new Error();
                } catch {
                    /* on error the user can retry or remove */
                } finally {
                    this.saving = false;
                }
            },
        }));

        /* ── Parent cart manager (subtotal) ────────────────────────── */
        Alpine.data('cartManager', () => ({
            items: {},

            init(initialItems) {
                initialItems.forEach(({ id, qty, price }) => {
                    this.items[id] = { qty, unitPrice: price };
                });

                this.$el.addEventListener('cart-item-register', (e) => {
                    const { id, qty, unitPrice } = e.detail;
                    this.items[id] = { qty, unitPrice };
                });

                this.$el.addEventListener('cart-item-changed', (e) => {
                    const { id, qty, unitPrice } = e.detail;
                    if (this.items[id]) this.items[id].qty = qty;
                });
            },

            get subtotal() {
                return Object.values(this.items).reduce((s, i) => s + i.qty * i.unitPrice, 0);
            },

            get subtotalFormatted() { return fmt(this.subtotal); },

            itemLineTotal(id) {
                const i = this.items[id];
                return i ? fmt(i.qty * i.unitPrice) : '';
            },
        }));

    });
})();
</script>
@endpush
