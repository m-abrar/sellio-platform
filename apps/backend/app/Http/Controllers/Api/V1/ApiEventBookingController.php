<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\Partner\PartnerLeadCreated;
use App\Http\Controllers\Controller;
use App\Http\Resources\EventBookingResource;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Services\EventBookingService;
use App\Services\GatewayManager;
use App\Services\StripeCheckoutConfigService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ApiEventBookingController extends Controller
{
    public function __construct(
        protected EventBookingService $bookingService,
    ) {
    }

    public function store(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'event_occurrence_id' => ['required', 'integer', 'exists:event_occurrences,id'],
            'event_ticket_type_id' => ['required', 'integer', 'exists:event_ticket_types,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        try {
            $ticket = EventTicketType::findOrFail($validated['event_ticket_type_id']);
            $occurrence = EventOccurrence::findOrFail($validated['event_occurrence_id']);

            if ($occurrence->event_id !== $event->id) {
                return $this->errorResponse(__('The selected event date is invalid.'), 422);
            }

            $booking = DB::transaction(function () use ($validated, $event, $ticket, $occurrence) {
                $occurrenceTicket = EventOccurrenceTicket::where('event_occurrence_id', $occurrence->id)
                    ->where('event_ticket_type_id', $ticket->id)
                    ->lockForUpdate()
                    ->first();

                if (!$occurrenceTicket) {
                    throw new Exception(__('The selected ticket type is not available for this date.'));
                }

                $available = $this->bookingService->getAvailableQuantity(
                    $occurrence->id,
                    $ticket->id,
                    $occurrenceTicket,
                );

                if ($validated['quantity'] > $available) {
                    throw new Exception(__('Only :count tickets remain.', ['count' => $available]));
                }

                $price = $occurrenceTicket->sale_price ?? $occurrenceTicket->override_price ?? $ticket->base_price;
                $totalAmount = (float) $price * (int) $validated['quantity'];

                $user = Auth::user();

                try {
                    $booking = new EventBooking([
                        'event_id' => $event->id,
                        'event_ticket_type_id' => $ticket->id,
                        'event_occurrence_id' => $occurrence->id,
                        'occurrence_ticket_id' => $occurrenceTicket->id,
                        'quantity' => $validated['quantity'],
                        'user_name' => $validated['name'] ?: $user->name,
                        'user_email' => $validated['email'] ?: $user->email,
                        'user_phone' => $validated['phone'] ?? null,
                    ]);

                    $booking->user_id = $user->id;
                    $booking->total_price = $totalAmount;
                    $booking->status = EventBooking::STATUS_PENDING;
                    $booking->save();

                    PartnerLeadCreated::dispatch($booking);
                } catch (QueryException $e) {
                    if ($e->getCode() === '23000') {
                        $existing = EventBooking::where('user_id', $user->id)
                            ->where('event_occurrence_id', $occurrence->id)
                            ->where('event_ticket_type_id', $ticket->id)
                            ->where('status', EventBooking::STATUS_PENDING)
                            ->first();

                        if ($existing) {
                            return $existing;
                        }
                    }

                    throw $e;
                }

                $occurrenceTicket->increment('sold_count', $validated['quantity']);

                if ($totalAmount <= 0) {
                    $this->bookingService->finalizePayment($booking, 'free', null, 0);
                }

                return $booking;
            });

            $booking->load(['event', 'user', 'occurrence', 'ticketType']);

            $message = $booking->status === EventBooking::STATUS_CONFIRMED
                ? __('Your tickets are confirmed.')
                : __('Your booking has been registered. Please proceed to payment.');

            return $this->successResponse(
                new EventBookingResource($booking),
                $message,
                201,
            );
        } catch (Exception $e) {
            Log::error('API event booking store failed: ' . $e->getMessage());

            return $this->errorResponse($e->getMessage() ?: __('Failed to create booking. Please try again.'), 422);
        }
    }

    public function show(EventBooking $booking): JsonResponse
    {
        $this->authorizeBooking($booking);
        $booking->load(['event', 'user', 'occurrence', 'ticketType']);

        return $this->successResponse(new EventBookingResource($booking));
    }

    public function paymentContext(
        EventBooking $booking,
        GatewayManager $manager,
        StripeCheckoutConfigService $stripeCheckoutConfig,
    ): JsonResponse {
        $this->authorizeBooking($booking);
        $booking->load(['event', 'user', 'occurrence', 'ticketType']);

        $gateways = PaymentGateway::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['slug', 'title', 'mode']);

        return $this->successResponse([
            'booking' => new EventBookingResource($booking),
            'gateways' => $gateways,
            'stripe_publishable_key' => $stripeCheckoutConfig->resolvePublishableKey($manager, 'event_booking_checkout'),
            'payment_total' => round((float) $booking->total_price * 1.05, 2),
        ]);
    }

    public function processPayment(
        Request $request,
        EventBooking $booking,
        GatewayManager $manager,
        string $gatewaySlug,
    ): JsonResponse {
        $this->authorizeBooking($booking);

        if ($booking->status === EventBooking::STATUS_CONFIRMED) {
            return $this->successResponse([
                'status' => 'successful',
                'booking' => new EventBookingResource($booking->load(['event', 'user', 'occurrence', 'ticketType'])),
                'message' => __('This booking is already confirmed.'),
            ]);
        }

        $request->validate([
            'payment_method' => ['required', 'string', 'in:stripe,paypal,bank_transfer,wallet'],
            'payment_token' => ['nullable', 'string', 'max:255'],
            'return_url' => ['nullable', 'url'],
        ]);

        $finalTotal = round((float) $booking->total_price * 1.05, 2);

        if ($finalTotal <= 0) {
            $this->bookingService->finalizePayment($booking, 'free', null, 0);

            return $this->successResponse([
                'status' => 'successful',
                'booking' => new EventBookingResource($booking->fresh()->load(['event', 'user', 'occurrence', 'ticketType'])),
                'message' => __('Your tickets are confirmed.'),
            ]);
        }

        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->firstOrFail();
            $token = $request->input('payment_token') ?? $request->input('stripeToken');

            if (!$token && !in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                return $this->errorResponse(__('Payment details are required.'), 422);
            }

            if (in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                return $this->successResponse([
                    'status' => 'pending_manual',
                    'booking' => new EventBookingResource($booking->load(['event', 'user', 'occurrence', 'ticketType'])),
                    'message' => __('Booking reserved. Complete payment using the selected method.'),
                ]);
            }

            $returnUrlBase = $request->input('return_url');
            if ($returnUrlBase) {
                $separator = str_contains($returnUrlBase, '?') ? '&' : '?';
                $returnUrl = $returnUrlBase . $separator . http_build_query([
                    'gateway' => $gatewaySlug,
                    'booking' => $booking->id,
                ]);
            } else {
                $returnUrl = url('/api/v1/event-bookings/' . $booking->id . '/confirm/' . $gatewaySlug);
            }

            $result = $manager->resolve($gateway)->charge($finalTotal, $token, $returnUrl, [
                'purpose' => 'event_booking',
                'event_booking_id' => (string) $booking->id,
                'event_id' => (string) $booking->event_id,
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
                    $result['message'] ?? null,
                );
                $this->bookingService->finalizePayment(
                    $booking,
                    $gatewaySlug,
                    $result['reference'] ?? null,
                    $finalTotal,
                );

                return $this->successResponse([
                    'status' => 'successful',
                    'booking' => new EventBookingResource($booking->fresh()->load(['event', 'user', 'occurrence', 'ticketType'])),
                    'reference' => $result['reference'] ?? null,
                    'message' => $result['message'] ?? __('Payment successful.'),
                ]);
            }

            if (($result['status'] ?? null) === 'pending_auth' && !empty($result['redirect_url'])) {
                $this->bookingService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    $finalTotal,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? null,
                );

                return $this->successResponse([
                    'status' => 'pending_auth',
                    'booking' => new EventBookingResource($booking->load(['event', 'user', 'occurrence', 'ticketType'])),
                    'redirect_url' => $result['redirect_url'],
                    'reference' => $result['reference'] ?? null,
                ]);
            }

            $this->bookingService->recordBookingPayment(
                $booking,
                $gatewaySlug,
                $finalTotal,
                Payment::STATUS_FAILED,
                $result['reference'] ?? null,
                $result['message'] ?? __('Gateway payment failed.'),
            );

            return $this->errorResponse($result['message'] ?? __('Payment failed.'), 422);
        } catch (Exception $e) {
            Log::error('API event booking payment failed: ' . $e->getMessage());

            return $this->errorResponse(__('Payment failed. Please try again.'), 500);
        }
    }

    public function confirmPayment(
        Request $request,
        EventBooking $booking,
        GatewayManager $manager,
        string $gatewaySlug,
    ): JsonResponse {
        $this->authorizeBooking($booking);

        $paymentIntentId = $request->get('payment_intent') ?? $request->get('token');

        if (!$paymentIntentId) {
            return $this->errorResponse(__('Payment confirmation failed: Missing transaction ID.'), 422);
        }

        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->firstOrFail();
            $result = $manager->resolve($gateway)->retrieveIntentStatus($paymentIntentId);
            $finalTotal = round((float) $booking->total_price * 1.05, 2);

            if (($result['status'] ?? null) === 'successful') {
                $this->bookingService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    $finalTotal,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? $paymentIntentId,
                    $result['message'] ?? null,
                );
                $this->bookingService->finalizePayment(
                    $booking,
                    $gatewaySlug,
                    $result['reference'] ?? $paymentIntentId,
                    $finalTotal,
                );

                return $this->successResponse([
                    'status' => 'successful',
                    'booking' => new EventBookingResource($booking->fresh()->load(['event', 'user', 'occurrence', 'ticketType'])),
                    'reference' => $result['reference'] ?? $paymentIntentId,
                ]);
            }

            return $this->errorResponse($result['message'] ?? __('Payment confirmation failed.'), 422);
        } catch (Exception $e) {
            Log::error('API event booking confirmation failed: ' . $e->getMessage());

            return $this->errorResponse(__('Payment confirmation failed.'), 500);
        }
    }

    private function authorizeBooking(EventBooking $booking): void
    {
        $user = Auth::user();
        $event = $booking->event;

        $isOwner = $user && $user->id === $booking->user_id;
        $isPartner = $user && $event && $user->id === $event->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);

        if (!$isOwner && !$isPartner && !$isAdmin) {
            abort(403, __('Unauthorized access to this booking.'));
        }
    }
}
