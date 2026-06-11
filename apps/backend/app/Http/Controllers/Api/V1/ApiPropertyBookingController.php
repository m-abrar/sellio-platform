<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyBookingRequest;
use App\Http\Resources\PropertyBookingResource;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Services\GatewayManager;
use App\Services\PropertyService;
use App\Services\StripeCheckoutConfigService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiPropertyBookingController extends Controller
{
    public function __construct(
        protected PropertyService $propertyService,
    ) {
    }

    public function preview(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1', 'max:' . $property->booking_guest_capacity],
        ]);

        try {
            $breakdown = $this->propertyService->calculateBookingBreakdown(
                $property->load(['fees', 'addons', 'prices']),
                $validated['check_in'],
                $validated['check_out'],
                (int) $validated['guests'],
            );

            return $this->successResponse($breakdown);
        } catch (Exception $e) {
            return $this->errorResponse(__('Invalid dates or guest count provided.'), 422);
        }
    }

    public function store(StorePropertyBookingRequest $request, Property $property): JsonResponse
    {
        try {
            $payload = array_merge($request->validated(), [
                'property_id' => $property->id,
            ]);

            $result = $this->propertyService->createOrRetrieveBooking($payload);
            $booking = $result['booking']->load(['property', 'user']);

            $message = $result['isExisting']
                ? __('You already have a pending reservation for those dates. The price has been updated.')
                : __('Your booking has been registered. Please proceed to payment.');

            return $this->successResponse(
                new PropertyBookingResource($booking),
                $message,
                $result['isExisting'] ? 200 : 201,
            );
        } catch (Exception $e) {
            Log::error('API property booking store failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to create booking. Please try again.'), 500);
        }
    }

    public function show(PropertyBooking $booking): JsonResponse
    {
        $this->authorizeBooking($booking);

        $booking->load(['property', 'user']);

        return $this->successResponse(new PropertyBookingResource($booking));
    }

    public function paymentContext(
        PropertyBooking $booking,
        GatewayManager $manager,
        StripeCheckoutConfigService $stripeCheckoutConfig,
    ): JsonResponse {
        $this->authorizeBooking($booking);
        $booking->load(['property', 'user']);

        $gateways = PaymentGateway::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['slug', 'title', 'mode']);

        return $this->successResponse([
            'booking' => new PropertyBookingResource($booking),
            'gateways' => $gateways,
            'stripe_publishable_key' => $stripeCheckoutConfig->resolvePublishableKey($manager, 'property_booking_payment'),
        ]);
    }

    public function processPayment(
        Request $request,
        PropertyBooking $booking,
        GatewayManager $manager,
        string $gatewaySlug,
    ): JsonResponse {
        $this->authorizeBooking($booking);

        if ($booking->status === PropertyBooking::STATUS_CONFIRMED) {
            return $this->successResponse([
                'status' => 'successful',
                'booking' => new PropertyBookingResource($booking->load(['property', 'user'])),
                'message' => __('This booking is already confirmed.'),
            ]);
        }

        $request->validate([
            'payment_method' => ['required', 'string', 'in:stripe,paypal,bank_transfer,wallet'],
            'payment_token' => ['nullable', 'string', 'max:255'],
            'return_url' => ['nullable', 'url'],
        ]);

        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->firstOrFail();
            $token = $request->input('payment_token') ?? $request->input('stripeToken');

            if (!$token && !in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                return $this->errorResponse(__('Payment details are required.'), 422);
            }

            if (in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                return $this->successResponse([
                    'status' => 'pending_manual',
                    'booking' => new PropertyBookingResource($booking->load(['property', 'user'])),
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
                $returnUrl = url('/api/v1/property-bookings/' . $booking->id . '/confirm/' . $gatewaySlug);
            }

            $result = $manager->resolve($gateway)->charge((float) $booking->total_price, $token, $returnUrl, [
                'purpose' => 'property_booking',
                'property_booking_id' => (string) $booking->id,
                'property_id' => (string) $booking->property_id,
                'user_id' => (string) $booking->user_id,
                'description' => __('Payment for property booking #:id', ['id' => $booking->id]),
            ]);

            if (($result['status'] ?? null) === 'successful') {
                $this->propertyService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    (float) $booking->total_price,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? null,
                    $result['message'] ?? null,
                );
                $this->propertyService->confirmBookingPayment($booking);

                return $this->successResponse([
                    'status' => 'successful',
                    'booking' => new PropertyBookingResource($booking->fresh()->load(['property', 'user'])),
                    'reference' => $result['reference'] ?? null,
                    'message' => $result['message'] ?? __('Payment successful.'),
                ]);
            }

            if (($result['status'] ?? null) === 'pending_auth' && !empty($result['redirect_url'])) {
                $this->propertyService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    (float) $booking->total_price,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? null,
                );

                return $this->successResponse([
                    'status' => 'pending_auth',
                    'booking' => new PropertyBookingResource($booking->load(['property', 'user'])),
                    'redirect_url' => $result['redirect_url'],
                    'reference' => $result['reference'] ?? null,
                ]);
            }

            $this->propertyService->recordBookingPayment(
                $booking,
                $gatewaySlug,
                (float) $booking->total_price,
                Payment::STATUS_FAILED,
                $result['reference'] ?? null,
                $result['message'] ?? __('Gateway payment failed.'),
            );

            return $this->errorResponse($result['message'] ?? __('Payment failed.'), 422);
        } catch (Exception $e) {
            Log::error('API property booking payment failed: ' . $e->getMessage());

            return $this->errorResponse(__('Payment failed. Please try again.'), 500);
        }
    }

    public function confirmPayment(
        Request $request,
        PropertyBooking $booking,
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

            if (($result['status'] ?? null) === 'successful') {
                $this->propertyService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    (float) $booking->total_price,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? $paymentIntentId,
                    $result['message'] ?? null,
                );
                $this->propertyService->confirmBookingPayment($booking);

                return $this->successResponse([
                    'status' => 'successful',
                    'booking' => new PropertyBookingResource($booking->fresh()->load(['property', 'user'])),
                    'reference' => $result['reference'] ?? $paymentIntentId,
                ]);
            }

            return $this->errorResponse($result['message'] ?? __('Payment confirmation failed.'), 422);
        } catch (Exception $e) {
            Log::error('API property booking confirmation failed: ' . $e->getMessage());

            return $this->errorResponse(__('Payment confirmation failed.'), 500);
        }
    }

    private function authorizeBooking(PropertyBooking $booking): void
    {
        $user = Auth::user();
        $property = $booking->property;

        $isOwner = $user && $user->id === $booking->user_id;
        $isPartner = $user && $property && $user->id === $property->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);

        if (!$isOwner && !$isPartner && !$isAdmin) {
            abort(403, __('Unauthorized access to this booking.'));
        }
    }
}
