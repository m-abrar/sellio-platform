<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventTicketType;
use Illuminate\Http\Request;
use App\Models\EventOccurrenceTicket;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use Carbon\Carbon;

class EventTicketController extends Controller
{
    public function indexAAAA(Event $event)
    {
        $ticketTypes = EventTicketType::where('event_id', $event->id)
            ->where('is_active', true)
            ->orderBy('price')
            ->get();

        $event->load('occurrences');

        return view('events.tickets.index', [
            'event' => $event,
            'ticketTypes' => $ticketTypes,
        ]);
    }

    public function index(Event $event)
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
            'event' => $event,
            'ticketTypes' => $event->ticketTypes,
            'occurrences' => $event->occurrences,
        ]);
    }

    public function indexAAA(Event $event)
    {
        $event->load(['ticketTypes' => fn($q) => $q->active()]);

        return view('events.tickets.index', compact('event'));
    }

    public function book(Event $event, EventTicketType $ticket)
    {
        if ($ticket->status === false || $ticket->quantity <= $ticket->sold_count) {
            return redirect()->route('tickets.index', $event->slug)
                             ->with('error', 'Ticket is no longer available.');
        }

        return view('events.tickets.book', compact('event', 'ticket'));
    }
}
