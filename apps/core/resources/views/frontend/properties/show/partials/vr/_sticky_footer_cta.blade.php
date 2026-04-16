{{-- Assumes $property is available --}}
<div class="fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-booking-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            {{-- 💡 Alignment: Use price_per_night column --}}
            <span class="h5 fw-bold text-white mb-0 d-block">
                ${{ number_format($property->price_per_night ?? $property->price) }}
                <span class="small fw-normal text-muted">/night</span>
            </span>
            
            {{-- 💡 Alignment: Calculate and display average rating --}}
            @php
                $averageRating = $property->reviews->avg('rating');
            @endphp
            @if ($averageRating > 0)
                <span class="small text-success fw-semibold">
                    <i class="bi bi-star-fill me-1"></i>
                    {{ number_format($averageRating, 1) }} Rating
                </span>
            @else
                <span class="small text-muted fw-semibold">No reviews yet</span>
            @endif
        </div>
        <a href="#booking-widget" class="btn btn-primary-theme fw-bold text-white">
            <i class="bi bi-calendar-check me-2"></i>Check Availability
        </a>
    </div>
</div>
