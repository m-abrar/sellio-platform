<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventTicketType;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class EventTicketController
 * Manages the presentation and availability of event tickets, 
 * including occurrence-specific filtering and availability checks.
 */
class EventTicketController extends Controller
{
    /**
     * Display available ticket types and occurrences for a specific event.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\View\View
     */
    public function index(Event $event): View
    {
        $event->load([
            'ticketTypes' => function ($query) {
                $query->orderBy('base_price');
            },
            'occurrences' => function ($query) {
                $query->where('start_date_time', '>=', now())->orderBy('start_date_time');
            }
        ]);

        return view('frontend.events.tickets.index', [
            'event'       => $event,
            'ticketTypes' => $event->ticketTypes,
            'occurrences' => $event->occurrences,
        ]);
    }

    /**
     * Display the booking interface for a specific ticket type.
     *
     * @param  \App\Models\Event  $event
     * @param  \App\Models\EventTicketType  $ticket
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function book(Event $event, EventTicketType $ticket): View|RedirectResponse
    {
        // Availability validation
        if ($ticket->status === false || ($ticket->quantity > 0 && $ticket->sold_count >= $ticket->quantity)) {
            return redirect()->route('tickets.index', $event->slug)
                             ->with('error', __('Ticket is no longer available.'));
        }

        return view('events.tickets.book', compact('event', 'ticket'));
    }
}
