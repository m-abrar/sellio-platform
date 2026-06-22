<div id="ticket-sidebar" class="ticket-sidebar sticky-sidebar">
    <div id="all-ticket-data"
         data-inventory='@json($allTicketData)'
         data-booking-route="{{ route('events.tickets.booking.store', ['event' => $event->slug, 'ticket' => '__TICKET_ID__']) }}"
         hidden></div>

    <div class="detail-sidebar-card mb-4 overflow-hidden">
        <div class="card-header border-0 p-4" style="background:var(--primary-color)">
            <h4 class="fw-800 mb-0 text-white"><i class="bi bi-calendar-event me-2"></i>{{ __('Select Date') }}</h4>
        </div>
        <div class="p-4">

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
            <div class="p-3 rounded-3 small fw-semibold" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
                <i class="bi bi-info-circle me-2"></i>{{ __('There are no upcoming dates available for booking.') }}
            </div>
        @endif
        </div>
    </div>

    <div class="detail-sidebar-card overflow-hidden">
        <div class="card-header border-0 p-4" style="background:var(--primary-color)">
            <h4 class="fw-800 mb-0 text-white"><i class="bi bi-ticket-fill me-2"></i>{{ __('Get Your Tickets') }}</h4>
        </div>
        <div class="p-4">

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

            <div class="p-4 rounded-4 mb-4" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">{{ __('Total') }}</span>
                    <span class="fw-800 fs-4 mb-0" style="color:var(--primary-color)" id="total-price">{{ setting('currency_symbol', '$') }}0</span>
                </div>
            </div>

            <button type="submit" id="checkout-button" class="btn btn-primary btn-header-cta w-100" disabled>
                <i class="bi bi-cart-fill me-2"></i>{{ __('Proceed to Checkout') }}
            </button>
        </form>

        <div id="no-selection-message" class="text-center py-4 px-3 rounded-3 text-muted small" style="background:rgba(248,246,243,.8);border:1.5px dashed rgba(15,23,42,.1)">
            <i class="bi bi-arrow-up-circle me-1" style="color:var(--primary-color)"></i>
            {{ __('Select an event date above to view ticket options.') }}
        </div>
        </div>
    </div>
</div>
