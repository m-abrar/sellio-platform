<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Services\GatewayManager;
use App\Services\EventBookingService;
use App\Services\StripeCheckoutConfigService;
use App\Events\Partner\PartnerLeadCreated;
use App\Http\Requests\StoreEventBookingRequest;
use App\Http\Requests\UpdateBookingDetailsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        return DB::transaction(function () use ($request, $event, $ticket, $occurrence) {
            // Lock the ticket record to prevent race conditions (Overbooking)
            $occurrenceTicket = EventOccurrenceTicket::where('event_occurrence_id', $occurrence->id)
                ->where('event_ticket_type_id', $ticket->id)
                ->lockForUpdate()
                ->first();

            if (!$occurrenceTicket) {
                throw new \Exception(__('The selected ticket type is not available for this date.'));
            }

            $available = $this->bookingService->getAvailableQuantity($occurrence->id, $ticket->id, $occurrenceTicket);

            if ($request->quantity > $available) {
                throw new \Exception(__('Only :count tickets remain.', ['count' => $available]));
            }

            $price = $occurrenceTicket->sale_price ?? $occurrenceTicket->override_price ?? $ticket->base_price;
            $totalAmount = $price * $request->quantity;

            try {
                $booking = new EventBooking([
                    'event_id'             => $event->id,
                    'event_ticket_type_id' => $ticket->id,
                    'event_occurrence_id'  => $occurrence->id,
                    'occurrence_ticket_id' => $occurrenceTicket->id,
                    'quantity'             => $request->quantity,
                    'user_name'            => $request->name ?: Auth::user()->name,
                    'user_email'           => $request->email ?: Auth::user()->email,
                    'user_phone'           => $request->phone,
                ]);
                
                $booking->user_id = Auth::id();
                $booking->total_price = $totalAmount;
                $booking->status = 'pending';
                $booking->save();

                PartnerLeadCreated::dispatch($booking);
            } catch (QueryException $e) {
                return $this->handleDuplicateBooking($e, $event, $occurrence, $ticket);
            }

            $occurrenceTicket->increment('sold_count', $request->quantity);

            return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
                ->with('success', __('Booking draft created. Total: $:amount', ['amount' => number_format($totalAmount, 2)]));
        });
    }

    /**
     * Show the checkout page for a pending booking.
     *
     * @param Event $event
     * @param EventBooking $booking
     * @return View|RedirectResponse
     */
    public function checkout(
        Event $event,
        EventBooking $booking,
        GatewayManager $manager,
        StripeCheckoutConfigService $stripeCheckoutConfig
    ) {
        $this->authorizeBooking($booking, $event);

        if ($booking->status !== 'pending') {
            return redirect()->route('events.tickets.booking.confirmation', [$event->slug, $booking->id]);
        }

        $booking->load(['event', 'occurrence', 'ticketType']);
        $stripePublishableKey = $stripeCheckoutConfig->resolvePublishableKey($manager, 'event_booking_checkout');

        return view('frontend.events.booking.checkout', [
            'event'   => $event,
            'booking' => $booking,
            'user'    => Auth::user(),
            'stripePublishableKey' => $stripePublishableKey,
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
    public function processPayment(Request $request, Event $event, EventBooking $booking, GatewayManager $manager): RedirectResponse
    {
        $this->authorizeBooking($booking, $event);

        $request->validate([
            'payment_method' => 'required|string|in:stripe',
            'payment_token' => 'nullable|string|max:255',
        ]);

        // SECURITY: Recalculate amount on the server based on the booking record.
        // Never trust the 'amount' field from the request in financial transactions.
        $finalTotal = round($booking->total_price * 1.05, 2);


        try {
            $gatewaySlug = $request->input('payment_method');
            $gateway = PaymentGateway::query()
                ->where('slug', $gatewaySlug)
                ->where('is_active', true)
                ->firstOrFail();

            $token = $request->input('payment_token');

            if (!$token) {
                return back()->with('error', __('Payment token could not be created. Please check your card details.'));
            }

            $returnUrl = route('events.tickets.booking.payment.confirm', [
                'event' => $event->slug,
                'booking' => $booking->id,
                'gateway' => $gatewaySlug,
            ], true);

            $result = $manager->resolve($gateway)->charge($finalTotal, $token, $returnUrl, [
                'purpose' => 'event_booking',
                'event_booking_id' => (string) $booking->id,
                'event_id' => (string) $event->id,
                'user_id' => (string) $booking->user_id,
                'description' => __('Payment for event booking #:id', ['id' => $booking->id]),
            ]);

            if (($result['status'] ?? null) === 'successful') {
                $this->bookingService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    $finalTotal,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? null,
                    $result['message'] ?? null
                );

                $this->bookingService->finalizePayment($booking, $gatewaySlug, $result['reference'] ?? null, $finalTotal);

                return redirect()->route('events.tickets.booking.confirmation', [$event->slug, $booking->id])
                    ->with('success', __('Payment successful!'));
            }

            if (($result['status'] ?? null) === 'pending_auth' && !empty($result['redirect_url'])) {
                $this->bookingService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    $finalTotal,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? null
                );

                return redirect($result['redirect_url']);
            }

            $this->bookingService->recordBookingPayment(
                $booking,
                $gatewaySlug,
                $finalTotal,
                Payment::STATUS_FAILED,
                $result['reference'] ?? null,
                $result['message'] ?? __('Gateway payment failed.')
            );

            return back()->with('error', $result['message'] ?? __('Payment failed. Please try again.'));
        } catch (\Exception $e) {
            Log::error("Payment Failed: " . $e->getMessage());
            return back()->with('error', __('Payment failed. Please try again.'));
        }
    }

    public function confirmPayment(Request $request, Event $event, EventBooking $booking, GatewayManager $manager, string $gateway): RedirectResponse
    {
        $this->authorizeBooking($booking, $event);

        $paymentIntentId = $request->query('payment_intent') ?? $request->query('token');

        if (!$paymentIntentId) {
            return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
                ->with('error', __('Payment confirmation failed because the gateway reference was missing.'));
        }

        try {
            $gatewayModel = PaymentGateway::query()
                ->where('slug', $gateway)
                ->where('is_active', true)
                ->firstOrFail();

            $result = $manager->resolve($gatewayModel)->retrieveIntentStatus($paymentIntentId);
            $finalTotal = round((float) $booking->total_price * 1.05, 2);

            if (($result['status'] ?? null) === 'successful') {
                $this->bookingService->recordBookingPayment(
                    $booking,
                    $gateway,
                    $finalTotal,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? $paymentIntentId,
                    $result['message'] ?? null
                );

                $this->bookingService->finalizePayment($booking, $gateway, $result['reference'] ?? $paymentIntentId, $finalTotal);

                return redirect()->route('events.tickets.booking.confirmation', [$event->slug, $booking->id])
                    ->with('success', __('Payment successful!'));
            }

            return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
                ->with('error', $result['message'] ?? __('Payment confirmation failed.'));
        } catch (\Exception $e) {
            Log::error("Event payment confirmation failed: " . $e->getMessage());

            return redirect()->route('events.tickets.booking.checkout', [$event->slug, $booking->id])
                ->with('error', __('Payment confirmation failed. Please try again.'));
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
