@php
    $nightlyRate = $property->price_per_night ?? 0;
    $maxGuests = max(1, (int) ($property->maximum_guests ?? 1));
    $isSessionData = isset($bookingData['check_in']);

    $checkIn = $bookingData['check_in'] ?? now()->addDays(2)->format('Y-m-d');
    $checkOut = $bookingData['check_out'] ?? now()->addDays(5)->format('Y-m-d');
    $numGuests = min(max(1, (int) ($bookingData['guests'] ?? 1)), $maxGuests);

    try {
        $start = \Carbon\Carbon::parse($checkIn);
        $end = \Carbon\Carbon::parse($checkOut);

        if ($start->gte($end)) {
            $totalNights = 0;
            $estimatedLodgingTotal = 0;
        } else {
            $totalNights = $start->diffInDays($end);
            $estimatedLodgingTotal = app(\App\Services\PropertyService::class)->calculateLodgingAmount($property, $start, $end);
        }
    } catch (\Exception $e) {
        $totalNights = 0;
        $estimatedLodgingTotal = 0;
    }

    $bookedDateRangesForPicker = ($bookedDateRanges ?? collect())->values();
@endphp

<div class="card glass-surface mb-4" id="booking-widget">
    <div class="card-header bg-primary text-white p-4 border-0">
        <h4 class="fw-800 mb-0"><i class="bi-calendar-check-fill me-2"></i>{{ __('Secure Your Stay') }}</h4>
    </div>

    <div class="card-body p-4">
        <p class="h4 fw-bold mb-3">
            {{ format_currency($nightlyRate, 0) }}
            <span class="small fw-normal text-muted"> / {{ __('average night') }}</span>
        </p>

        <div class="fw-bold text-center border w-100 p-2 rounded-3">{{ __('Select Check-in & Check-out Dates') }}</div>

        <form action="{{ route('property.booking.start', $property->slug) }}" method="POST">
            @csrf

            <div class="mb-4 text-center date-selection-container">
                <div id="inline_calendar_container" class="flatpickr-calendar-inline mb-3"></div>

                <input
                    type="text"
                    id="date_range_picker"
                    class="visually-hidden"
                    placeholder="{{ __('Check In - Check Out') }}"
                    value="{{ $checkIn . ' to ' . $checkOut }}"
                    aria-label="{{ __('Check In - Check Out') }}"
                    readonly
                    required
                >

                <input type="hidden" name="check_in" value="{{ $checkIn }}" id="widget_check_in_val">
                <input type="hidden" name="check_out" value="{{ $checkOut }}" id="widget_check_out_val">
            </div>

            <div class="mb-4">
                <label for="guests" class="form-label small fw-semibold">{{ __('Guests') }}</label>
                <select id="guests" name="guests" class="form-select">
                    @for($guest = 1; $guest <= $maxGuests; $guest++)
                        <option value="{{ $guest }}" @selected($guest === $numGuests)>
                            {{ trans_choice(':count guest|:count guests', $guest, ['count' => $guest]) }}
                        </option>
                    @endfor
                </select>
            </div>

            <ul class="list-group list-group-flush small mb-4">
                <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-0 pb-2 border-0">
                    <span class="fw-semibold">{{ __('Your Stay Duration:') }}</span>
                    <span class="fw-bold text-end">
                        <span id="total_nights_span">{{ $totalNights }}</span>
                        <span id="nights_word_span"> {{ trans_choice('Night|Nights', $totalNights) }}</span>
                    </span>
                </li>

                <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-3 border-top">
                    <span class="fw-bold h5 mb-0 text-primary-color">{{ __('Lodging Total:') }} <small class="text-muted"> {{ __('estimated') }} </small></span>
                    <span class="fw-bold h5 text-primary-color mb-0" id="estimated_lodging_total">{{ format_currency($estimatedLodgingTotal) }}</span>
                </li>
            </ul>

            <div class="d-grid">
                <button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme">
                    {{ __('Continue Booking') }} <i class="bi bi-arrow-right-short ms-2"></i>
                </button>
            </div>

            <p class="text-center small text-muted mt-2">{{ __('Taxes and final fees are calculated on the next page.') }}</p>
        </form>
    </div>
</div>

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

    <style>
        :root {
            --primary-color: #00A896;
            --primary-dark: #00998a;
            --primary-light: #ccf2ef;
            --text-dark: #1f2937;
            --bg-glass-heavy: rgba(255, 255, 255, 0.9);
            --border-color: rgba(255, 255, 255, 0.5);
            --card-radius: 20px;
        }
    </style>
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>
    $(document).ready(function() {
        const inlineCalendarContainer = document.getElementById('inline_calendar_container');
        const dateRangeInput = document.getElementById('date_range_picker');
        const $checkInHidden = $('#widget_check_in_val');
        const $checkOutHidden = $('#widget_check_out_val');
        const $guestsDropdown = $('#guests');
        const bookedDateRanges = @json($bookedDateRangesForPicker);

        function updatePrice() {
            const checkIn = $checkInHidden.val();
            const checkOut = $checkOutHidden.val();

            if (!checkIn || !checkOut || checkIn === checkOut) {
                return;
            }

            $('#estimated_lodging_total').text('...');

            $.ajax({
                url: "{{ route('properties.calculate-lodging-price', $property) }}",
                method: 'GET',
                data: {
                    check_in: checkIn,
                    check_out: checkOut,
                    guests: $guestsDropdown.val(),
                },
                success: function(response) {
                    $('#total_nights_span').text(response.total_nights);
                    $('#estimated_lodging_total').text(response.estimated_lodging_total_formatted || response.estimated_lodging_total);
                    $('#nights_word_span').text(response.total_nights === 1 ? ' {{ __('Night') }}' : ' {{ __('Nights') }}');
                },
                error: function(xhr) {
                    console.error('Price calculation failed:', xhr.responseText);
                    $('#estimated_lodging_total').text('{{ __('Unavailable') }}');
                }
            });
        }

        flatpickr(dateRangeInput, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            inline: true,
            appendTo: inlineCalendarContainer,
            minDate: 'today',
            defaultDate: [$checkInHidden.val(), $checkOutHidden.val()],
            disable: bookedDateRanges,

            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    selectedDates.sort((a, b) => a - b);

                    $checkInHidden.val(instance.formatDate(selectedDates[0], 'Y-m-d'));
                    $checkOutHidden.val(instance.formatDate(selectedDates[1], 'Y-m-d'));

                    updatePrice();
                } else if (selectedDates.length === 1) {
                    $checkOutHidden.val('');
                }
            }
        });

        $guestsDropdown.on('change', updatePrice);

        if ($checkInHidden.val() && $checkOutHidden.val() && $checkInHidden.val() !== $checkOutHidden.val()) {
            updatePrice();
        }
    });
    </script>
@endpush
