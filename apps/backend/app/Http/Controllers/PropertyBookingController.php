<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyBookingRequest;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Services\PropertyService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            'guests'    => ['required', 'integer', 'min:1', 'max:' . ($property->maximum_guests ?? 1)],
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
        $guestCount = (int) $request->query('guests', $property->minimum_guests ?? 1);

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
    public function processPayment(ProcessPaymentRequest $request, PropertyBooking $booking): RedirectResponse
    {
        if ($booking->status === 'confirmed') {
            return redirect()->route('property.booking.confirmation', [
                'property' => $booking->property->slug,
                'booking'  => $booking->id
            ])->with('warning', __('This booking is already confirmed.'));
        }

        try {
            $this->propertyService->confirmBookingPayment($booking);

            return redirect()->route('property.booking.confirmation', [
                'property' => $booking->property->slug,
                'booking'  => $booking->id
            ])->with('success', __('✅ Payment successful! Your vacation is confirmed.'));
        } catch (Exception $e) {
            Log::error('Payment Failure: ' . $e->getMessage());
            return back()->withInput()->with('error', __('❌ Payment failed. Please check your details.'));
        }
    }

    /**
     * Display the payment gateway selection and entry interface.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyBooking  $booking
     * @return \Illuminate\View\View
     */
    public function payment(Property $property, PropertyBooking $booking): View
    {
        $this->authorizeBooking($property, $booking);
        return view('frontend.properties.booking.payment', compact('property', 'booking'));
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
        return view('frontend.properties.booking.confirmation', compact('property', 'booking'));
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
        if ($booking->property_id !== $property->id) {
            abort(404);
        }
    }
}
