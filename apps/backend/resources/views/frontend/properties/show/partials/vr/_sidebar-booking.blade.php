@php
    $nightlyRate = $property->price_per_night ?? 0;
    $maxGuests = max(1, (int) ($property->booking_guest_capacity ?? $property->maximum_guests ?? 1));
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

<div class="card detail-sidebar-card mb-4 overflow-hidden" id="booking-widget">
    <div class="card-header bg-primary text-white p-4 border-0">
        <h4 class="fw-800 mb-1"><i class="bi-calendar-check-fill me-2"></i>{{ __('Reserve Your Stay') }}</h4>
        <p class="small text-white-50 mb-0">{{ __('Pick dates, review the quote, then continue to checkout.') }}</p>
    </div>

    <div class="card-body p-4">
        <p class="h4 fw-bold mb-1">
            {{ format_currency($nightlyRate, 0) }}
            <span class="small fw-normal text-muted"> / {{ __('average night') }}</span>
        </p>
        <p class="small text-muted mb-3">{{ __('Final taxes and service fees appear before payment.') }}</p>

        <form action="{{ route('property.booking.start', $property->slug) }}" method="POST">
            @csrf

            <div class="mb-4 date-selection-container">
                <label for="date_range_picker" class="form-label small fw-semibold">{{ __('Check-in & Check-out Dates') }}</label>

                <input type="text" id="date_range_picker" class="visually-hidden" value="{{ $checkIn . ' to ' . $checkOut }}" aria-label="{{ __('Check In - Check Out') }}" readonly required>

                <input type="hidden" name="check_in" value="{{ $checkIn }}" id="widget_check_in_val">
                <input type="hidden" name="check_out" value="{{ $checkOut }}" id="widget_check_out_val">
                <div id="inline_calendar_container" class="booking-inline-calendar"></div>
                <div class="selected-date-range small fw-semibold text-center text-muted border rounded-3 py-2 px-3 mt-3">
                    <i class="bi bi-calendar-range me-1"></i>
                    <span id="selected_date_range_text">{{ $checkIn }} - {{ $checkOut }}</span>
                </div>
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

            <ul class="booking-quote-list list-group list-group-flush small mb-4" aria-label="{{ __('Estimated booking quote') }}">
                <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-0 pb-2 border-0">
                    <span class="fw-semibold">{{ __('Your Stay Duration:') }}</span>
                    <span class="fw-bold text-end">
                        <span id="total_nights_span">{{ $totalNights }}</span>
                        <span id="nights_word_span"> {{ trans_choice('Night|Nights', $totalNights) }}</span>
                    </span>
                </li>

                <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-3 border-top">
                    <span class="fw-bold h5 mb-0 text-primary">{{ __('Lodging Total:') }} <small class="text-muted"> {{ __('estimated') }} </small></span>
                    <span class="fw-bold h5 text-primary mb-0" id="estimated_lodging_total" aria-live="polite">{{ format_currency($estimatedLodgingTotal) }}</span>
                </li>
            </ul>

            <div class="booking-widget-trust mb-4">
                <span><i class="bi bi-shield-check text-success"></i>{{ __('Secure checkout') }}</span>
                <span><i class="bi bi-receipt text-primary"></i>{{ __('Fees shown before payment') }}</span>
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-header-cta">
                    {{ __('Review booking') }}<i class="bi bi-arrow-right ms-2"></i>
                </button>
            </div>

            <p class="text-center small text-muted mt-2">{{ __('You will not be charged on this step.') }}</p>
        </form>
    </div>
</div>

@push('styles')
    <style>
        #booking-widget {
            overflow: hidden;
            border: 0;
            box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
        }

        #booking-widget .card-header {
            background: var(--primary-color) !important;
        }

        #booking-widget .date-selection-container {
            background: #fafaf9;
            border: 1.5px solid rgba(15, 23, 42, 0.07);
            border-radius: 12px;
            padding: 14px;
        }

        #booking-widget .booking-inline-calendar {
            display: block !important;
            overflow: hidden;
        }

        #booking-widget .flatpickr-calendar.inline {
            width: 100%;
            max-width: 100%;
            box-shadow: none;
            border: 0;
            border-radius: 10px;
            background: transparent;
        }

        #booking-widget .flatpickr-calendar .dayContainer,
        #booking-widget .flatpickr-calendar .flatpickr-days {
            width: 100%;
            min-width: 100%;
            max-width: 100%;
        }

        #booking-widget .flatpickr-months {
            align-items: center;
            padding: 0 4px 8px;
        }

        #booking-widget .flatpickr-month,
        #booking-widget .flatpickr-current-month {
            height: 42px;
        }

        #booking-widget .flatpickr-current-month {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0;
            left: 12.5%;
            width: 75%;
            font-size: 1rem;
        }

        #booking-widget .flatpickr-current-month .flatpickr-monthDropdown-months,
        #booking-widget .flatpickr-current-month input.cur-year {
            font-weight: 700;
            color: #1c1917;
        }

        #booking-widget .flatpickr-current-month .flatpickr-monthDropdown-months {
            border-radius: 8px;
            padding: 4px 24px 4px 10px;
        }

        #booking-widget .flatpickr-weekdays {
            margin-bottom: 4px;
        }

        #booking-widget span.flatpickr-weekday {
            color: #64748b;
            font-size: 0.72rem;
            font-weight: 700;
        }

        #booking-widget .flatpickr-day {
            height: 34px;
            line-height: 34px;
            max-width: none;
            border-radius: 8px;
            color: #1c1917;
            font-weight: 600;
        }

        #booking-widget .flatpickr-day.selected,
        #booking-widget .flatpickr-day.startRange,
        #booking-widget .flatpickr-day.endRange {
            background: var(--primary-color);
            border-color: transparent;
            box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.32);
            color: #fff;
        }

        #booking-widget .flatpickr-day.inRange {
            background: rgba(var(--primary-color-rgb), 0.10);
            border-color: transparent;
            box-shadow: none;
            color: var(--primary-dark);
        }

        #booking-widget .flatpickr-day:hover:not(.selected):not(.startRange):not(.endRange):not(.flatpickr-disabled) {
            background: rgba(var(--primary-color-rgb), 0.08);
            border-color: rgba(var(--primary-color-rgb), 0.18);
        }

        #booking-widget .flatpickr-day.today:not(.selected):not(.startRange):not(.endRange) {
            border-color: rgba(var(--primary-color-rgb), 0.45);
            color: var(--primary-color);
        }

        #booking-widget .flatpickr-day.flatpickr-disabled,
        #booking-widget .flatpickr-day.prevMonthDay,
        #booking-widget .flatpickr-day.nextMonthDay {
            color: #cbd5e1;
        }

        #booking-widget .flatpickr-day.flatpickr-disabled {
            background: repeating-linear-gradient(
                135deg,
                rgba(148, 163, 184, 0.08),
                rgba(148, 163, 184, 0.08) 4px,
                rgba(148, 163, 184, 0.15) 4px,
                rgba(148, 163, 184, 0.15) 8px
            );
            text-decoration: line-through;
        }

        #booking-widget .selected-date-range {
            background: #fff;
            border-color: rgba(15, 23, 42, 0.08) !important;
            color: #1c1917 !important;
        }

        #booking-widget .form-select {
            border-radius: 10px;
            border-color: rgba(15, 23, 42, 0.1);
            min-height: 50px;
        }

        @media (max-width: 575.98px) {
            #booking-widget .card-header {
                padding: 18px !important;
            }

            #booking-widget .card-header h4 {
                font-size: 1.05rem;
            }

            #booking-widget .card-body {
                padding: 18px !important;
            }

            #booking-widget .date-selection-container {
                border-radius: 10px;
                padding: 10px;
            }

            #booking-widget .flatpickr-current-month {
                font-size: 0.92rem;
            }

            #booking-widget .flatpickr-day {
                height: 32px;
                line-height: 32px;
                font-size: 0.78rem;
            }

            #booking-widget .selected-date-range {
                font-size: 0.78rem;
            }
        }
    </style>
@endpush

@push('scripts')
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const inlineCalendarContainer = document.getElementById('inline_calendar_container');
        const dateRangeInput = document.getElementById('date_range_picker');
        const checkInHidden = document.getElementById('widget_check_in_val');
        const checkOutHidden = document.getElementById('widget_check_out_val');
        const guestsDropdown = document.getElementById('guests');
        const selectedRangeText = document.getElementById('selected_date_range_text');
        const totalNightsSpan = document.getElementById('total_nights_span');
        const nightsWordSpan = document.getElementById('nights_word_span');
        const estimatedTotal = document.getElementById('estimated_lodging_total');
        const bookedDateRanges = @json($bookedDateRangesForPicker);

        if (!inlineCalendarContainer || !dateRangeInput || !checkInHidden || !checkOutHidden || !guestsDropdown) {
            return;
        }

        function syncSelectedRangeLabel(instance = null) {
            const checkIn = checkInHidden.value;
            const checkOut = checkOutHidden.value;

            if (!checkIn || !checkOut) {
                selectedRangeText.textContent = '{{ __('Select your dates') }}';
                return;
            }

            if (instance) {
                const start = instance.parseDate(checkIn, 'Y-m-d');
                const end = instance.parseDate(checkOut, 'Y-m-d');

                if (start && end) {
                    selectedRangeText.textContent = instance.formatDate(start, 'M j, Y') + ' - ' + instance.formatDate(end, 'M j, Y');
                    return;
                }
            }

            selectedRangeText.textContent = checkIn + ' - ' + checkOut;
        }

        function updatePrice() {
            const checkIn = checkInHidden.value;
            const checkOut = checkOutHidden.value;

            if (!checkIn || !checkOut || checkIn === checkOut) {
                return;
            }

            estimatedTotal.textContent = '...';

            const params = new URLSearchParams({
                check_in: checkIn,
                check_out: checkOut,
                guests: guestsDropdown.value,
            });

            fetch("{{ route('properties.calculate-lodging-price', $property) }}?" + params.toString())
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Price calculation failed');
                    }

                    return response.json();
                })
                .then((response) => {
                    totalNightsSpan.textContent = response.total_nights;
                    estimatedTotal.textContent = response.estimated_lodging_total_formatted || response.estimated_lodging_total;
                    nightsWordSpan.textContent = response.total_nights === 1 ? ' {{ __('Night') }}' : ' {{ __('Nights') }}';
                })
                .catch((error) => {
                    console.error(error);
                    estimatedTotal.textContent = '{{ __('Unavailable') }}';
                });
        }

        function showUnavailableMessage() {
            const message = document.createElement('p');
            message.className = 'text-muted small mb-0';
            message.textContent = '{{ __('Date picker is unavailable. Please refresh the page.') }}';
            inlineCalendarContainer.replaceChildren(message);
        }

        function initCalendar(attempt = 0) {
            if (typeof window.flatpickr !== 'function') {
                if (attempt < 20) {
                    window.setTimeout(() => initCalendar(attempt + 1), 50);
                    return;
                }

                showUnavailableMessage();
                return;
            }

            window.flatpickr(dateRangeInput, {
                mode: 'range',
                dateFormat: 'Y-m-d',
                inline: true,
                appendTo: inlineCalendarContainer,
                minDate: 'today',
                defaultDate: [checkInHidden.value, checkOutHidden.value],
                disable: bookedDateRanges,

                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length === 2) {
                        selectedDates.sort((a, b) => a - b);

                        checkInHidden.value = instance.formatDate(selectedDates[0], 'Y-m-d');
                        checkOutHidden.value = instance.formatDate(selectedDates[1], 'Y-m-d');

                        syncSelectedRangeLabel(instance);
                        updatePrice();
                    } else if (selectedDates.length === 1) {
                        checkOutHidden.value = '';
                        syncSelectedRangeLabel(instance);
                    }
                },

                onReady: function(selectedDates, dateStr, instance) {
                    syncSelectedRangeLabel(instance);
                }
            });
        }

        guestsDropdown.addEventListener('change', updatePrice);
        initCalendar();

        if (checkInHidden.value && checkOutHidden.value && checkInHidden.value !== checkOutHidden.value) {
            updatePrice();
        }
    });
    </script>
@endpush
