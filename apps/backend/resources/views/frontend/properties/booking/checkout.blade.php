@extends('frontend._layouts._app')

@section('title', __('Vacation Booking') . ' | ' . __('Step 1 of 3')) 
@section('body_class', 'has-body-glow')

@php
    $bookingFormConfig = [
        'nights' => $bookingData['nights'],
        'initialTotal' => $initialTotal,
        'addons' => $property->addons,
        'oldAddons' => old('add_ons', []),
        'guestCount' => old('guests', $bookingData['guests'] ?? 1),
        'currencySymbol' => setting_string('currency_symbol', '$'),
        'currencyPosition' => setting_string('currency_position', 'left'),
    ];
@endphp

@section('content')
<x-frontend.page-shell variant="property-booking">
    <div x-data="bookingForm()">
    <form action="{{ route('property.booking.store', $property->slug) }}" method="POST" class="needs-validation" novalidate>
        @csrf 
        <input type="hidden" name="property_id" value="{{ $property->id }}">

        @include('frontend.properties.booking._partials._booking-header', [
            'eyebrow' => __('Secure Reservation'),
            'title' => __('Vacation Booking'),
            'step' => 1,
            'subtitle' => __('Review your stay, add optional extras, and tell the host how to reach you.'),
        ])

        @include('frontend.properties.booking._partials._booking-stepper', ['step' => 1])
        
        <div class="row g-4 booking-layout">
            {{-- Left Column: Forms --}}
            <div class="col-lg-7 booking-layout__main">
                {{-- Stay Details --}}
                <div class="glass-surface p-4 p-md-5 mb-4 position-relative">
                    <h4 class="fw-800 tracking-tight mb-4 text-dark">
                        <i class="bi bi-calendar-range text-primary-color me-2"></i>{{ __('Stay Details') }}
                    </h4>
                    
                    <div class="row g-4 text-center text-md-start">
                        <div class="col-md-4">
                            <span class="metric-label">{{ __('Check-in Date') }}</span>
                            <p class="fs-5 fw-800 mb-0 text-dark">
                                {{ \Carbon\Carbon::parse($bookingData['check_in'])->format('M d, Y') }}
                            </p>
                            <input type="hidden" name="check_in" value="{{ old('check_in', $bookingData['check_in']) }}">
                        </div>
                        <div class="col-md-4 border-start-md ps-md-4 border-color-light">
                            <span class="metric-label">{{ __('Check-out Date') }}</span>
                            <p class="fs-5 fw-800 mb-0 text-dark">
                                {{ \Carbon\Carbon::parse($bookingData['check_out'])->format('M d, Y') }}
                            </p>
                            <input type="hidden" name="check_out" value="{{ old('check_out', $bookingData['check_out']) }}">
                        </div>
                        <div class="col-md-4 border-start-md ps-md-4 border-color-light">
                            <label for="guests" class="metric-label">{{ __('Guests') }}</label>
                            <select name="guests" id="guests" x-model="guestCount" class="form-select border-0 bg-light-primary text-primary-color fw-800 rounded-3 @error('guests') is-invalid @enderror" required>
                                @for ($i = 1; $i <= $property->maximum_guests; $i++) 
                                    <option value="{{ $i }}">{{ $i }}</option>
                                @endfor
                            </select>
                            @error('guests')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                {{-- Add-ons Section --}}
                <div class="glass-surface p-4 p-md-5 mb-4 booking-addons-panel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="fw-800 tracking-tight text-dark mb-0">
                            <i class="bi bi-stars text-primary-color me-2"></i>{{ __('Enhance Your Stay') }}
                        </h4>
                        <span class="badge bg-light-primary text-primary-color rounded-pill px-3">{{ __('Optional') }}</span>
                    </div>
                    
                    <div class="row g-3">
                        @forelse ($property->addons as $addon)
                            <div class="col-12">
                                <div class="addon-card position-relative" 
                                    @click="toggleAddon({{ $addon->id }})"
                                    :class="selectedAddons[{{ $addon->id }}] > 0 ? 'addon-selected' : ''">
                                    
                                    <template x-if="selectedAddons[{{ $addon->id }}] > 0">
                                        <div class="addon-check-badge">
                                            <i class="bi bi-check-lg text-white"></i>
                                        </div>
                                    </template>

                                    <div class="d-flex align-items-center p-3">
                                        <div class="addon-icon-box booking-addon-icon shadow-sm rounded-3 d-flex align-items-center justify-content-center bg-white">
                                            <i class="bi {{ $addon->icon ?? 'bi-box' }} fs-4 text-primary-color"></i>
                                        </div>

                                        <div class="flex-grow-1 ms-md-3 min-w-0">
                                            <div class="d-flex align-items-center gap-2 flex-wrap">
                                                <h6 class="fw-800 mb-0 text-dark">{{ $addon->title }}</h6>
                                                @if($addon->is_popular)
                                                    <span class="badge booking-addon-popular bg-light-primary text-primary-color">
                                                        <i class="bi bi-fire me-1"></i>{{ __('POPULAR') }}
                                                    </span>
                                                @endif
                                            </div>
                                            <p class="small text-muted mb-0 addon-card__meta">{{ $addon->description }}</p>
                                            <div class="fw-800 text-primary-color small">
                                                {{ format_currency($addon->price) }}
                                                <span class="text-muted fw-normal">/ {{ $addon->type === 'per_night' ? __('night') : __('stay') }}</span>
                                            </div>
                                        </div>

                                        <div class="d-flex align-items-center bg-light-primary rounded-pill p-1 addon-card__qty" @click.stop>
                                            <button type="button" class="btn btn-icon-sm rounded-circle bg-white shadow-sm border-0" @click="decrement({{ $addon->id }})">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <span class="booking-addon-qty-value px-2 fw-800 text-primary-color" x-text="selectedAddons[{{ $addon->id }}]"></span>
                                            <button type="button" class="btn btn-icon-sm rounded-circle bg-white shadow-sm border-0" @click="increment({{ $addon->id }}, {{ $addon->max_qty }})">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" :name="'add_ons['+{{ $addon->id }}+'][qty]'" :value="selectedAddons[{{ $addon->id }}]">
                            </div>
                        @empty
                            <p class="text-muted text-center py-3">{{ __('No add-ons available.') }}</p>
                        @endforelse
                    </div>
                </div>

                {{-- Contact Info Section --}}
                <div class="glass-surface p-4 p-md-5 mb-4">
                    <h4 class="fw-800 tracking-tight mb-4 text-dark">
                        <i class="bi bi-person-circle text-primary-color me-2"></i>{{ __('Guest Details') }}
                    </h4>
                    
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label for="full_name" class="filter-label mb-2">{{ __('Full Name') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-person"></i></span>
                                <input type="text" name="full_name" id="full_name" class="form-control @error('full_name') is-invalid @enderror"
                                    value="{{ old('full_name', auth()->user()->name ?? '') }}" placeholder="{{ __('Enter your full name') }}" required>
                            </div>
                            @error('full_name')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="col-md-7">
                            <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                <input type="email" name="email" id="email" class="form-control @error('email') is-invalid @enderror"
                                    value="{{ old('email', auth()->user()->email ?? '') }}" placeholder="your@email.com" required>
                            </div>
                            @error('email')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="col-md-5">
                            <label for="phone" class="filter-label mb-2">{{ __('Phone Number') }} <span class="text-muted fw-normal">({{ __('optional') }})</span></label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                <input type="tel" name="phone" id="phone" class="form-control @error('phone') is-invalid @enderror"
                                    value="{{ old('phone', auth()->user()->phone ?? '') }}" placeholder="+1 (555) 000-0000">
                            </div>
                            @error('phone')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Price Summary --}}
            <div class="col-lg-5 booking-layout__aside">
                <aside class="sticky-sidebar">
                    <div class="glass-surface p-4 p-md-5 border-0 shadow-deep position-relative overflow-hidden">
                        <div class="price-glow-effect"></div>

                        <div class="d-flex align-items-center mb-4 border-bottom border-color-light pb-4">
                            <img src="{{ $property->primary_image_url }}" class="booking-summary-thumb rounded-4 me-3 shadow-sm" alt="{{ $property->title }}">
                            <div class="overflow-hidden">
                                <span class="metric-label">{{ __('Reserved Property') }}</span>
                                <h6 class="fw-800 mb-0 text-truncate text-dark">{{ $property->title }}</h6>
                                <p class="small text-muted mb-0"><i class="bi bi-geo-alt-fill text-primary-color me-1"></i>{{ $property->location->title ?? 'Location' }}</p>
                            </div>
                        </div>

                        <div class="pricing-list mb-4">
                            @foreach($bookingData['lines'] as $line)
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted small fw-600">{{ $line['title'] }}</span>
                                    <span class="fw-800 text-dark small">{{ format_currency($line['amount']) }}</span>
                                </div>
                            @endforeach

                            <template x-for="addon in activeAddons" :key="addon.id">
                                <div class="d-flex justify-content-between mb-2 animate__animated animate__fadeIn">
                                    <span class="text-muted small fw-600 d-flex align-items-center">
                                        <i class="bi bi-plus-circle-fill me-2 text-primary-color booking-addon-line-icon"></i>
                                        <span x-text="addon.title"></span> (x<span x-text="addon.qty"></span>)
                                    </span>
                                    <span class="fw-800 text-primary-color small" x-text="formatCurrency(addon.totalPrice)"></span>
                                </div>
                            </template>
                        </div>

                        <hr class="my-4 border-color-light">

                        <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur mb-4">
                            <p class="filter-label mb-1">{{ __('Review Total') }}</p>
                            <h2 class="price-text-large mb-0 line-height-1 text-primary-color" x-text="formatCurrency(finalTotal)"></h2>
                            <span class="badge bg-light-primary text-primary-color mt-3 rounded-pill px-3 py-2">
                                <i class="bi bi-shield-check me-1"></i> {{ __('No charge until payment step') }}
                            </span>
                        </div>
                        
                        <button type="submit" class="btn btn-lg btn-primary-theme w-100 py-3 rounded-pill fw-800 shadow-deep">
                            {{ __('Continue to Payment') }} <i class="bi bi-arrow-right-circle-fill ms-2"></i>
                        </button>
                    </div>
                </aside>
            </div>
        </div>

        <div class="booking-mobile-summary d-lg-none">
            <div>
                <span class="booking-mobile-summary__label">{{ __('Review Total') }}</span>
                <strong x-text="formatCurrency(finalTotal)"></strong>
            </div>
            <button type="submit" class="btn btn-primary-theme text-white fw-800 rounded-pill px-4">
                {{ __('Payment') }} <i class="bi bi-arrow-right-short ms-1"></i>
            </button>
        </div>
    </form>
    </div>
</x-frontend.page-shell>
@endsection

@push('scripts')
<script>
    (() => {
        const bookingFormConfig = @js($bookingFormConfig);

        const registerBookingForm = () => {
        Alpine.data('bookingForm', () => ({
            nights: bookingFormConfig.nights,
            guestCount: bookingFormConfig.guestCount,
            baseTotal: bookingFormConfig.initialTotal,
            availableAddons: bookingFormConfig.addons,
            selectedAddons: {},

            init() {
                const oldValues = bookingFormConfig.oldAddons || {};
                this.availableAddons.forEach(addon => {
                    this.selectedAddons[addon.id] = oldValues[addon.id] ? parseInt(oldValues[addon.id].qty) : 0;
                });
            },

            toggleAddon(id) {
                this.selectedAddons[id] = this.selectedAddons[id] > 0 ? 0 : 1;
            },

            increment(id, max) {
                if (this.selectedAddons[id] < max) this.selectedAddons[id]++;
            },

            decrement(id) {
                if (this.selectedAddons[id] > 0) this.selectedAddons[id]--;
            },

            get activeAddons() {
                return this.availableAddons
                    .filter(a => this.selectedAddons[a.id] > 0)
                    .map(a => {
                        const qty = this.selectedAddons[a.id];
                        return {
                            id: a.id,
                            title: a.title,
                            qty: qty,
                            totalPrice: a.type === 'per_night' ? (qty * a.price * this.nights) : (qty * a.price)
                        };
                    });
            },

            get finalTotal() {
                return this.baseTotal + this.activeAddons.reduce((sum, item) => sum + item.totalPrice, 0);
            },

            formatCurrency(val) {
                const formatted = val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return bookingFormConfig.currencyPosition === 'right'
                    ? `${formatted}${bookingFormConfig.currencySymbol}`
                    : `${bookingFormConfig.currencySymbol}${formatted}`;
            }
        }));
        };

        if (window.Alpine) {
            registerBookingForm();
        } else {
            document.addEventListener('alpine:init', registerBookingForm, { once: true });
        }
    })();
</script>
@endpush
