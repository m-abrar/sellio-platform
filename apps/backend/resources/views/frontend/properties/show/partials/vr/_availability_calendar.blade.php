<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-3">
    <div>
        <h4 class="fw-bold mb-1"><i class="bi bi-calendar-range me-2"></i>{{ __('Availability') }}</h4>
        <p class="small text-muted mb-0">
            {{ __('Select available dates in the booking panel. Confirmed and pending stays are blocked in the date picker.') }}
        </p>
    </div>

    <span class="badge bg-light text-dark border rounded-pill px-3 py-2">
        {{ trans_choice(':count blocked stay|:count blocked stays', $bookings->count(), ['count' => $bookings->count()]) }}
    </span>
</div>

@if($bookings->isNotEmpty())
    <div class="row g-3">
        @foreach($bookings->take(6) as $booking)
            <div class="col-md-6">
                <div class="border rounded-3 p-3 bg-white shadow-sm h-100">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: {{ $booking['color'] }};"></span>
                        <span class="small fw-bold text-dark">{{ __('Unavailable') }}</span>
                    </div>
                    <p class="mb-0 small text-muted">
                        {{ \Carbon\Carbon::parse($booking['start'])->format('M j, Y') }}
                        -
                        {{ \Carbon\Carbon::parse($booking['end'])->format('M j, Y') }}
                    </p>
                </div>
            </div>
        @endforeach
    </div>
@else
    <div class="border rounded-3 p-4 bg-light-primary text-center text-muted">
        <i class="bi bi-calendar-check display-6 d-block mb-2 text-primary"></i>
        <p class="mb-0 fw-semibold">{{ __('No blocked dates are currently listed.') }}</p>
    </div>
@endif

<p class="small text-muted fst-italic mt-3 mb-0">
    {{ trans_choice('Minimum :count night stay required.|Minimum :count nights stay required.', max(1, (int) ($property->minimum_rental_days ?? 1)), ['count' => max(1, (int) ($property->minimum_rental_days ?? 1))]) }}
</p>
