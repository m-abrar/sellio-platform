<div id="ticket-sidebar" class="ticket-sidebar sticky-sidebar">
    <div id="all-ticket-data"
         data-inventory='@json($allTicketData)'
         data-booking-route="{{ route('events.tickets.booking.store', ['event' => $event->slug, 'ticket' => '__TICKET_ID__']) }}"
         hidden></div>

    <div class="glass-surface border-0 rounded-4 shadow-deep p-4 p-md-5 mb-4">
        <span class="metric-label d-block mb-2">{{ __('Tickets') }}</span>
        <h4 class="fw-800 text-dark mb-4">
            <i class="bi bi-calendar-event me-2 text-primary-color"></i>{{ __('Select Date') }}
        </h4>

        @if ($allTicketData->isNotEmpty())
            <form id="occurrence-selection-form">
                <div id="date-options-scroll" class="event-date-options mb-3">
                    @foreach ($allTicketData as $occurrenceId => $data)
                        <div class="form-check mb-2">
                            <input class="form-check-input occurrence-radio" type="radio"
                                name="selected_occurrence_id"
                                id="occurrence-{{ $occurrenceId }}"
                                value="{{ $occurrenceId }}">
                            <label class="form-check-label fw-semibold" for="occurrence-{{ $occurrenceId }}">
                                {{ $data['start_date_formatted'] }}
                            </label>
                        </div>
                    @endforeach
                </div>

                @if (count($allTicketData) > 5)
                    <small class="text-muted d-block">{{ __('Scroll for more dates...') }}</small>
                @endif
            </form>
        @else
            <div class="alert alert-info mb-0">{{ __('There are no upcoming dates available for booking.') }}</div>
        @endif
    </div>

    <div class="glass-surface border-0 rounded-4 shadow-deep p-4 p-md-5">
        <span class="metric-label d-block mb-2">{{ __('Checkout') }}</span>
        <h4 class="fw-800 text-dark mb-4">
            <i class="bi bi-ticket-fill me-2 text-primary-color"></i>{{ __('Get Your Tickets') }}
        </h4>

        <div id="countdown-wrapper" class="d-none mb-3">
            <div class="event-countdown-banner text-center p-3 rounded-4 small fw-bold">
                {{ __('Registration Closes In:') }}
                <span class="d-block fs-5 fw-bolder" id="countdown-timer" data-countdown-to="">00 {{ __('Days') }} 00:00:00</span>
            </div>
        </div>

        <form id="booking-form" action="" method="POST" class="d-none">
            @csrf
            <input type="hidden" name="event_occurrence_id" id="form-occurrence-id">

            <h6 class="fw-800 mb-3">{{ __('Select Ticket Type and Quantity') }}</h6>
            <div id="ticket-rows-container" class="mb-4"></div>

            <div class="product-purchase-quote bg-white bg-opacity-50 p-4 rounded-4 border border-primary-light mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">{{ __('Total') }}</span>
                    <span class="fw-800 fs-4 text-primary-color mb-0" id="total-price">{{ setting('currency_symbol', '$') }}0</span>
                </div>
            </div>

            <button type="submit" id="checkout-button" class="btn btn-primary-theme btn-lg w-100 rounded-pill fw-800 shadow-deep" disabled>
                <i class="bi bi-cart-fill me-2"></i>{{ __('Proceed to Checkout') }}
            </button>
        </form>

        <div id="no-selection-message" class="text-center py-4 px-3 rounded-4 border border-dashed text-muted">
            {{ __('Select an event date above to view ticket options.') }}
        </div>
    </div>
</div>
