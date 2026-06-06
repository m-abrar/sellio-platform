<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyBookingRequest;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Services\GatewayManager;
use App\Services\PropertyService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\View\View;

/**
 * Class PropertyBookingController
 * Manages the high-fidelity booking lifecycle for properties, 
 * coordinating between widget-based entry, checkout breakdown, and final payment confirmation.
 */
class PropertyBookingController extends Controller
{
    /**
     * The property management service.
     *
     * @var \App\Services\PropertyService
     */
    protected PropertyService $propertyService;

    /**
     * PropertyBookingController constructor.
     *
     * @param  \App\Services\PropertyService  $propertyService
     */
    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * Handle the initial redirect from the property sidebar widget to the formal checkout.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\RedirectResponse
     */
    public function startFromWidget(Request $request, Property $property): RedirectResponse
    {
        $request->validate([
            'check_in'  => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests'    => ['required', 'integer', 'min:1', 'max:' . $property->booking_guest_capacity],
        ]);

        return redirect()->route('property.booking.checkout', [
            'property'   => $property->slug,
            'start_date' => $request->check_in,
            'end_date'   => $request->check_out,
            'guests'     => $request->guests,
        ]);
    }

    /**
     * Compile booking data and present the review/checkout interface.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $slug
     * @param  string  $start_date
     * @param  string  $end_date
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function checkout(Request $request, string $slug, string $start_date, string $end_date): View|RedirectResponse
    {
        $property = Property::with(['addons', 'prices', 'fees'])->where('slug', $slug)->firstOrFail();
        $guestCount = min(
            max(1, (int) $request->query('guests', $property->minimum_guests ?? 1)),
            $property->booking_guest_capacity
        );

        try {
            $bookingData = $this->propertyService->calculateBookingBreakdown(
                $property,
                $start_date,
                $end_date,
                $guestCount
            );

            Session::put('booking', $bookingData);

            return view('frontend.properties.booking.checkout', [
                'property'     => $property,
                'bookingData'  => $bookingData,
                'initialTotal' => $bookingData['initial_total'],
            ]);
        } catch (Exception $e) {
            return redirect()->route('properties.show', $property->slug)
                ->withErrors(__('Invalid dates or guest count provided.'));
        }
    }

    /**
     * Persist the booking record as a pending reservation.
     *
     * @param  \App\Http\Requests\StorePropertyBookingRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StorePropertyBookingRequest $request): RedirectResponse
    {
        try {
            $result = $this->propertyService->createOrRetrieveBooking($request->validated());

            $status = $result['isExisting'] ? 'warning' : 'success';
            $message = $result['isExisting']
                ? __('You already have a PENDING reservation for those dates. Price has been updated.')
                : __('✨ Your booking has been registered. Please proceed to payment.');

            return redirect()->route('property.booking.payment', [
                'property' => $result['property']->slug,
                'booking'  => $result['booking']->id
            ])->with($status, $message);
            
        } catch (Exception $e) {
            Log::error("Booking storage failed: " . $e->getMessage());
            return back()->withInput()->with('error', __('A critical system error occurred.'));
        }
    }

    /**
     * Process final payment and confirm the booking status.
     *
     * @param  \App\Http\Requests\ProcessPaymentRequest  $request
     * @param  \App\Models\PropertyBooking  $booking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processPayment(ProcessPaymentRequest $request, PropertyBooking $booking, GatewayManager $manager): RedirectResponse
    {
        $this->authorizeBooking($booking->property, $booking);

        if ($booking->status === 'confirmed') {
            return redirect()->route('property.booking.confirmation', [
                'property' => $booking->property->slug,
                'booking'  => $booking->id
            ])->with('warning', __('This booking is already confirmed.'));
        }

        try {
            $gatewaySlug = $request->validated('payment_method');
            $gateway = PaymentGateway::query()
                ->where('slug', $gatewaySlug)
                ->where('is_active', true)
                ->firstOrFail();

            $token = $request->input('payment_token')
                ?? $request->input('stripeToken')
                ?? $this->demoStripeTokenFromCard($request);

            if (!$token) {
                return back()->withInput()->with('error', __('Payment token could not be created. Please check your card details.'));
            }

            $returnUrl = route('property.booking.payment.confirm', [
                'property' => $booking->property->slug,
                'booking' => $booking->id,
                'gateway' => $gatewaySlug,
            ], true);

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
                    $result['message'] ?? null
                );

                $this->propertyService->confirmBookingPayment($booking);

                return redirect()->route('property.booking.confirmation', [
                    'property' => $booking->property->slug,
                    'booking'  => $booking->id
                ])->with('success', __('Payment successful! Your vacation is confirmed.'));
            }

            if (($result['status'] ?? null) === 'pending_auth' && !empty($result['redirect_url'])) {
                $this->propertyService->recordBookingPayment(
                    $booking,
                    $gatewaySlug,
                    (float) $booking->total_price,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? null
                );

                return redirect($result['redirect_url']);
            }

            $this->propertyService->recordBookingPayment(
                $booking,
                $gatewaySlug,
                (float) $booking->total_price,
                Payment::STATUS_FAILED,
                $result['reference'] ?? null,
                $result['message'] ?? __('Gateway payment failed.')
            );

            return back()->withInput()->with('error', $result['message'] ?? __('Payment failed. Please check your details.'));
        } catch (Exception $e) {
            Log::error('Payment Failure: ' . $e->getMessage());
            return back()->withInput()->with('error', __('Payment failed. Please check your details.'));
        }

    }

    /**
     * Display the payment gateway selection and entry interface.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyBooking  $booking
     * @return \Illuminate\View\View
     */
    public function payment(Property $property, PropertyBooking $booking, GatewayManager $manager): View
    {
        $this->authorizeBooking($property, $booking);

        $stripePublishableKey = null;
        $stripeGateway = PaymentGateway::query()
            ->where('slug', 'stripe')
            ->where('is_active', true)
            ->with('credentials')
            ->first();

        if ($stripeGateway) {
            try {
                $stripePublishableKey = $manager->resolve($stripeGateway)->getFrontendConfig()['publishable_key'] ?? null;
            } catch (Exception $e) {
                Log::warning('Unable to load Stripe frontend config for property booking payment.', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return view('frontend.properties.booking.payment', [
            'property' => $property,
            'booking' => $booking,
            'nights' => $booking->duration_nights,
            'stripePublishableKey' => $stripePublishableKey,
            'addonLines' => $booking->transactionLines()
                ->where('description', 'LIKE', 'Add-on:%')
                ->get(),
        ]);
    }

    public function confirmPayment(Request $request, Property $property, PropertyBooking $booking, GatewayManager $manager, string $gateway): RedirectResponse
    {
        $this->authorizeBooking($property, $booking);

        $paymentIntentId = $request->query('payment_intent') ?? $request->query('token');

        if (!$paymentIntentId) {
            return redirect()->route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ])->with('error', __('Payment confirmation failed because the gateway reference was missing.'));
        }

        try {
            $gatewayModel = PaymentGateway::query()
                ->where('slug', $gateway)
                ->where('is_active', true)
                ->firstOrFail();

            $result = $manager->resolve($gatewayModel)->retrieveIntentStatus($paymentIntentId);

            if (($result['status'] ?? null) === 'successful') {
                $this->propertyService->recordBookingPayment(
                    $booking,
                    $gateway,
                    (float) $booking->total_price,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? $paymentIntentId,
                    $result['message'] ?? null
                );

                $this->propertyService->confirmBookingPayment($booking);

                return redirect()->route('property.booking.confirmation', [
                    'property' => $property->slug,
                    'booking' => $booking->id,
                ])->with('success', __('Payment successful! Your vacation is confirmed.'));
            }

            return redirect()->route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ])->with('error', $result['message'] ?? __('Payment confirmation failed.'));
        } catch (Exception $e) {
            Log::error('Payment confirmation failure: ' . $e->getMessage());

            return redirect()->route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ])->with('error', __('Payment confirmation failed. Please try again.'));
        }
    }

    /**
     * Display the final booking confirmation/invoice.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyBooking  $booking
     * @return \Illuminate\View\View
     */
    public function show(Property $property, PropertyBooking $booking): View
    {
        $this->authorizeBooking($property, $booking);

        $isPaid = in_array($booking->status, [
            PropertyBooking::STATUS_CONFIRMED,
            PropertyBooking::STATUS_COMPLETED,
            'paid',
        ], true);

        return view('frontend.properties.booking.confirmation', [
            'property' => $property,
            'booking' => $booking,
            'nights' => $booking->duration_nights,
            'isPaid' => $isPaid,
            'statusText' => $isPaid ? __('Booking Confirmed!') : __('Action Required: Payment Pending'),
            'statusColorClass' => $isPaid ? 'text-success' : 'text-warning',
            'statusIcon' => $isPaid ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill',
            'buyerBookingsUrl' => Route::has('dashboard.user.bookings.index')
                ? route('dashboard.user.bookings.index')
                : url('/buyer/bookings'),
        ]);
    }

    /**
     * Internal: Verify the integrity of the property-booking relationship.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyBooking  $booking
     * @return void
     */
    private function authorizeBooking(Property $property, PropertyBooking $booking): void
    {
        // 1. Structural Check: Does this booking actually belong to this property?
        if ($booking->property_id !== $property->id) {
            abort(404);
        }

        // 2. Ownership Check (IDOR Protection): Does this booking belong to the logged-in user?
        // Admins and the Property Owner (Partner) can also view, but visitors cannot spoof other users.
        $user = auth()->user();
        $isOwner = $user && $user->id === $booking->user_id;
        $isPartner = $user && $user->id === $property->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);

        if (!$isOwner && !$isPartner && !$isAdmin) {
            abort(403, 'Unauthorized access to this booking.');
        }
    }

    private function demoStripeTokenFromCard(Request $request): ?string
    {
        if ($request->input('payment_method', 'stripe') !== 'stripe') {
            return null;
        }

        return $request->input('card_number') === '4242424242424242'
            ? 'tok_visa'
            : null;
    }
}
