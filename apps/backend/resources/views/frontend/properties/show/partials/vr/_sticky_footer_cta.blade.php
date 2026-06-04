<div class="fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-booking-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            <span class="h5 fw-bold text-white mb-0 d-block">
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

        <a href="#booking-widget" class="btn btn-primary-theme fw-bold text-white">
            <i class="bi bi-calendar-check me-2"></i>{{ __('Check Availability') }}
        </a>
    </div>
</div>
