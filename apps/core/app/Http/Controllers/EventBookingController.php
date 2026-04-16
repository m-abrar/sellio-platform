<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Services\EventBookingService;
use App\Http\Requests\StoreEventBookingRequest;
use App\Http\Requests\UpdateBookingDetailsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

/**
 * Class EventBookingController
 *
 * Manages the lifecycle of an event ticket booking from draft to confirmation.
 */
class EventBookingController extends Controller
{
    /**
     * @var EventBookingService
     */
    protected $bookingService;

    /**
     * EventBookingController constructor.
     *
     * @param EventBookingService $bookingService
     */
    public function __construct(EventBookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Store a new booking draft.
     *
     * @param StoreEventBookingRequest $request
     * @param Event $event
     * @param EventTicketType $ticket
     * @return RedirectResponse
     */
    public function store(StoreEventBookingRequest $request, Event $event, EventTicketType $ticket): RedirectResponse
    {
        if (!Auth::check()) {
            Session::put('booking_request_data', $request->all());
            Session::put('url.intended', url()->current());
            return redirect()->route('login')->with('warning', __('Please log in to continue your booking.'));
        }

        $occurrence = EventOccurrence::findOrFail($request->event_occurrence_id);
        $occurrenceTicket = EventOccurrenceTicket::where('event_occurrence_id', $occurrence->id)
            ->where('event_ticket_type_id', $ticket->id)
            ->first();

        if (!$occurrenceTicket) {
            return back()->withErrors(['error' => __('The selected ticket type is not available for this date.')]);
        }

        $available = $this->bookingService->getAvailableQuantity($occurrence->id, $ticket->id, $occurrenceTicket);

        if ($request->quantity > $available) {
            return back()->withInput()->withErrors([
                'quantity' => __('Only :count tickets remain.', ['count' => $available])
            ]);
        }

        $price = $occurrenceTicket->sale_price ?? $occurrenceTicket->override_price ?? $ticket->base_price;
        $totalAmount = $price * $request->quantity;

        try {
            $booking = EventBooking::create([
                'event_id'             => $event->id,
                'event_ticket_type_id' => $ticket->id,
                'event_occurrence_id'  => $occurrence->id,
                'occurrence_ticket_id' => $occurrenceTicket->id,
                'user_id'              => Auth::id(),
                'quantity'             => $request->quantity,
                'total_price'          => $totalAmount,
                'user_name'            => $request->name ?: Auth::user()->name,
                'user_email'           => $request->email ?: Auth::user()->email,
                'user_phone'           => $request->phone,
                'status'               => 'pending',
            ]);
        } catch (QueryException $e) {
            return $this->handleDuplicateBooking($e, $event, $occurrence, $ticket);
        }

        $occurrenceTicket->increment('sold_count', $request->quantity);

        return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
            ->with('success', __('Booking draft created. Total: $:amount', ['amount' => number_format($totalAmount, 2)]));
    }

    /**
     * Show the checkout page for a pending booking.
     *
     * @param Event $event
     * @param EventBooking $booking
     * @return View|RedirectResponse
     */
    public function checkout(Event $event, EventBooking $booking)
    {
        $this->authorizeBooking($booking, $event);

        if ($booking->status !== 'pending') {
            return redirect()->route('events.tickets.booking.confirmation', [$event->slug, $booking->id]);
        }

        $booking->load(['event', 'occurrence', 'ticketType']);

        return view('frontend.events.booking.checkout', [
            'event'   => $event,
            'booking' => $booking,
            'user'    => Auth::user(),
        ]);
    }

    /**
     * Update attendee details for a pending booking.
     *
     * @param UpdateBookingDetailsRequest $request
     * @param Event $event
     * @param EventBooking $booking
     * @return RedirectResponse
     */
    public function updateDetails(UpdateBookingDetailsRequest $request, Event $event, EventBooking $booking): RedirectResponse
    {
        $this->authorizeBooking($booking, $event);

        if ($booking->status !== 'pending') {
            return back()->with('error', __('Cannot update details on a confirmed booking.'));
        }

        $booking->update($request->validated());

        return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
            ->with('success', __('Attendee details successfully updated.'));
    }

    /**
     * Process the payment for a booking.
     *
     * @param Request $request
     * @param Event $event
     * @param EventBooking $booking
     * @return RedirectResponse
     */
    public function processPayment(Request $request, Event $event, EventBooking $booking): RedirectResponse
    {
        $this->authorizeBooking($booking, $event);

        $request->validate([
            'payment_method' => 'required|string|in:stripe,paypal',
            'amount'         => 'required|numeric|min:0.01',
        ]);

        $finalTotal = round($booking->total_price * 1.05, 2); 
        if (round($request->amount, 2) < $finalTotal) {
            return back()->with('error', __('Payment amount mismatch.'));
        }

        try {
            $transactionId = strtoupper($request->payment_method) . '_' . Str::random(10);
            $this->bookingService->finalizePayment($booking, $request->payment_method, $transactionId, $request->amount);

            return redirect()->route('events.tickets.booking.confirmation', [$event->slug, $booking->id])
                ->with('success', __('Payment successful!'));
        } catch (\Exception $e) {
            Log::error("Payment Failed: " . $e->getMessage());
            return back()->with('error', __('Payment failed. Please try again.'));
        }
    }

    /**
     * Show the confirmation page for a successful booking.
     *
     * @param Event $event
     * @param EventBooking $booking
     * @return View|RedirectResponse
     */
    public function confirmation(Event $event, EventBooking $booking)
    {
        $this->authorizeBooking($booking, $event);

        if ($booking->status !== 'confirmed') {
            return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
                ->with('warning', __('Please complete the payment first.'));
        }

        $booking->load(['event', 'occurrence', 'ticketType']);

        return view('frontend.events.booking.confirmation', compact('event', 'booking'));
    }

    /**
     * Internal helper to authorize booking access.
     * * @param EventBooking $booking
     * @param Event $event
     * @return void
     */
    protected function authorizeBooking(EventBooking $booking, Event $event): void
    {
        if (Auth::id() !== $booking->user_id || $booking->event_id !== $event->id) {
            abort(403, __('Unauthorized access.'));
        }
    }

    /**
     * Handle duplicate booking attempts via Database Exceptions.
     * * @param QueryException $e
     * @param Event $event
     * @param EventOccurrence $occurrence
     * @param EventTicketType $ticket
     * @return RedirectResponse
     */
    protected function handleDuplicateBooking(QueryException $e, Event $event, $occurrence, $ticket): RedirectResponse
    {
        if ($e->getCode() === '23000') {
            $existing = EventBooking::where('user_id', Auth::id())
                ->where('event_occurrence_id', $occurrence->id)
                ->where('event_ticket_type_id', $ticket->id)
                ->where('status', 'pending')
                ->first();

            if ($existing) {
                return redirect()->route('events.tickets.booking.checkout', [$event->slug, $existing->id])
                    ->with('error', __('You have a pending reservation.'));
            }
        }
        throw $e;
    }
}
