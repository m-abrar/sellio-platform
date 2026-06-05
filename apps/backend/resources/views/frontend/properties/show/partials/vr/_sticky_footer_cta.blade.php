<div class="sticky-booking-bar fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-booking-bar">
    <div class="container d-flex justify-content-between align-items-center gap-3">
        <div class="sticky-booking-bar__summary min-w-0">
            <span class="h6 fw-bold text-white mb-0 d-block text-truncate">
                {{ format_currency($property->price_per_night ?? $property->price, 0) }}
                <span class="small fw-normal text-muted">/{{ __('night') }}</span>
            </span>

            @php
                $averageRating = $property->reviews->avg('rating');
            @endphp
            @if ($averageRating > 0)
                <span class="small text-success fw-semibold">
                    <i class="bi bi-star-fill me-1"></i>
                    {{ __(':rating rating', ['rating' => number_format($averageRating, 1)]) }}
                </span>
            @else
                <span class="small text-muted fw-semibold">{{ __('No reviews yet') }}</span>
            @endif
        </div>

        <a href="#booking-widget" class="btn btn-primary-theme fw-bold text-white flex-shrink-0">
            <i class="bi bi-calendar-check me-2"></i>{{ __('Reserve') }}
        </a>
    </div>
</div>
