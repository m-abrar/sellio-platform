{{-- This file is included on the main property detail page: properties.show --}}

@php
    // --- PHP FALLBACK & INITIALIZATION ---
    $nightlyRate = $property->price_per_night ?? 0;
    $maxGuests = $property->maximum_guests ?? 1; // TODO
    $isSessionData = isset($bookingData['check_in']);
    
    // If no session data, check_out is set to be the same as check_in (today).
    $checkIn = $bookingData['check_in'] ?? now()->format('Y-m-d'); // TODO add 2 days
    $checkOut = $bookingData['check_out'] ?? now()->format('Y-m-d'); // TODO add 5 days
    $numGuests = $bookingData['guests'] ?? 2; // TODO
    
    try {
        $start = \Carbon\Carbon::parse($checkIn);
        $end = \Carbon\Carbon::parse($checkOut);
        
        // FIX #1: Use abs() to ensure $totalNights is never negative on initial load.
        $totalNights = abs($end->diffInDays($start));
        
        // Ensure total nights is 0 if check-in and check-out are the same (initial load state)
        if ($start->equalTo($end)) {
            $totalNights = 0;
        } elseif ($totalNights < 1) {
            $totalNights = 1; 
        }
        
    } catch (\Exception $e) {
        $totalNights = 0; // Set to 0 on any date parsing error
    }
    
    // Total rental is 0 on initial load now, otherwise based on preloaded session dates.
    $baseRental = $nightlyRate * $totalNights; 
    $estimatedLodgingTotal = $baseRental;
@endphp

{{-- ----------------------------------------------------------------- --}}
{{-- VR Booking Widget (STEP 0: CRITICAL CONVERSION POINT) --}}
{{-- ----------------------------------------------------------------- --}}
<div class="card glass-surface mb-4" id="booking-widget">

    <div class="card-header bg-primary text-white p-4 border-0">
        <h4 class="fw-800 mb-0"><i class="bi-calendar-check-fill me-2"></i>Secure Your Stay</h4>
    </div>
    <div class="card-body p-4">
    
    {{-- Nightly Rate Display --}}
    <p class="h4 fw-bold mb-3">
        ${{ number_format($nightlyRate, 0) }}
        <span class="small fw-normal text-muted"> / average night</span>
    </p>
    <div class="fw-bold text-center border w-100 p-2 rounded-3">Select Checkin & Checkout Dates</div>

    <form action="{{ route('property.booking.start', $property->slug) }}" method="POST">
        @csrf
        
        {{-- Dates Field (The Flatpickr Target) --}}
        <div class="mb-4 text-center date-selection-container"> {{-- Added text-center and custom class --}}
            
            {{-- NEW: Container for the always-visible inline calendar --}}
            <div id="inline_calendar_container" class="flatpickr-calendar-inline mb-3"></div>

            {{-- Hidden input for initial value and displaying selected range --}}
            <input 
                type="hidden" 
                id="date_range_picker" 
                class="form-control" 
                placeholder="Check In - Check Out"
                value="{{ 
                    $isSessionData 
                        ? $checkIn . ' to ' . $checkOut
                        : ''
                }}"
                required
            >
            
            {{-- HIDDEN INPUTS: These will be updated by the Flatpickr onChange event and submitted with the form --}}
            <input type="hidden" name="check_in" value="{{ $checkIn }}" id="widget_check_in_val">
            <input type="hidden" name="check_out" value="{{ $checkOut }}" id="widget_check_out_val">
            
            {{-- HIDDEN GUESTS INPUT: Keeping this hidden for form submission if needed by the backend. --}}
            {{-- The value will always be $numGuests (the default/session value) as there's no UI to change it. --}}
            <input type="hidden" name="guests" value="{{ $numGuests }}" id="guests">
        </div>

        {{-- Removed Guest Selection Field --}}
        
        {{-- Price Summary --}}
        <ul class="list-group list-group-flush small mb-4">
            
            {{-- Total Nights line --}}
            <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-0 pb-2 border-0">
                <span class="fw-semibold">Your Stay Duration:</span>
                <span class="fw-bold text-end">
                    <span id="total_nights_span">{{ $totalNights }}</span>
                    <span id="nights_word_span"> Night{{ $totalNights !== 1 ? 's' : '' }}</span>
                </span>
            </li>
            
            {{-- Lodging Total (Bottom line) --}}
            <li class="list-group-item d-flex justify-content-between bg-transparent px-0 pt-3 border-top">
                <span class="fw-bold h5 mb-0 text-primary-color">Lodging Total: <small class="text-muted"> estimated </small></span>
                <span class="fw-bold h5 text-primary-color mb-0" id="estimated_lodging_total">${{ number_format($estimatedLodgingTotal, 2) }}</span>
                
            </li>
        </ul>

        {{-- Book Button --}}
        <div class="d-grid">
            <button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme">
                Continue Booking <i class="bi bi-arrow-right-short ms-2"></i>
            </button>
        </div>
        <p class="text-center small text-muted mt-2">Taxes and final fees are calculated on the next page.</p>
    </form>
</div>
</div>


{{-- ----------------------------------------------------------------- --}}
{{-- ASSETS AND JAVASCRIPT --}}
{{-- ----------------------------------------------------------------- --}}

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

    <style>
        /* ----------------------------------------------------------------- */
        /* FLATICKR CUSTOM THEME STYLES - LOCAL VARIABLE OVERRIDE for #00A896 */
        /* ----------------------------------------------------------------- */
        :root {
            /* OVERRIDING GLOBAL THEME VARIABLES TO MATCH #00A896 (Teal) */
            --primary-color: #00A896;
            --primary-dark: #00998a; 
            --primary-light: #ccf2ef;

            /* Using your original theme variables for other required styles */
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
        // --- Element Variables ---
        const $inlineCalendarContainer = $('#inline_calendar_container');
        const $checkInHidden = $('#widget_check_in_val');
        const $checkOutHidden = $('#widget_check_out_val');
        // Removed reference to $guestsDropdown as it's no longer in the HTML

        // --- AJAX Function for Real-Time Price Update (GET Request) ---
        function updatePrice() {
            const checkIn = $checkInHidden.val();
            const checkOut = $checkOutHidden.val();

            // Only update if a range has been selected
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
                    // Pass current default/session guest count to backend
                    guests: $('#guests').val(), 
                },
                success: function(response) {
                    $('#total_nights_span').text(response.total_nights);
                    $('#estimated_lodging_total').text('$' + response.estimated_lodging_total);
                    
                    let nightsWord = response.total_nights === 1 ? ' Night' : ' Nights'; 
                    $('#nights_word_span').text(nightsWord);

                },
                error: function(xhr) {
                    console.error("Price calculation failed:", xhr.responseText);
                    $('#estimated_lodging_total').text('Error');
                }
            });
        }

        // -----------------------------------------------------------------
        // --- Flatpickr Initialization ---
        // -----------------------------------------------------------------
        
        flatpickr($inlineCalendarContainer, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            inline: true,
            minDate: 'today',
            defaultDate: $('#date_range_picker').val(),
            
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    selectedDates.sort((a, b) => a - b);
                    
                    const checkInDate = instance.formatDate(selectedDates[0], 'Y-m-d');
                    const checkOutDate = instance.formatDate(selectedDates[1], 'Y-m-d');
                    
                    $checkInHidden.val(checkInDate);
                    $checkOutHidden.val(checkOutDate);
                    
                    updatePrice(); 
                } else if (selectedDates.length === 1) {
                    $checkOutHidden.val('');
                }
            }
        });

        // Removed Guest Change Handler
        // $guestsDropdown.on('change', function() { /* ... */ });

        // -----------------------------------------------------------------
        // --- Initial Price Load ---
        // -----------------------------------------------------------------
        if ($checkInHidden.val() && $checkOutHidden.val() && $checkInHidden.val() !== $checkOutHidden.val()) {
            updatePrice();
        }
    });
    </script>
@endpush
