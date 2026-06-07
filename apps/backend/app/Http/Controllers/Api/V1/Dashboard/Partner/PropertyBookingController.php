<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Events\BookingCancelled;
use App\Events\PropertyBookingConfirmed;
use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyBookingResource;
use App\Models\PropertyBooking;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class PropertyBookingController
 * * Manages bookings and leads for properties owned by the authenticated partner.
 */
class PropertyBookingController extends Controller
{
    /**
     * @var PropertyBooking
     */
    protected $propertyBooking;

    /**
     * PropertyBookingController constructor.
     * * @param PropertyBooking $propertyBooking
     */
    public function __construct(PropertyBooking $propertyBooking)
    {
        $this->propertyBooking = $propertyBooking;
    }

    /**
     * Display a listing of bookings for the partner's properties.
     *
     * @return View
     */
    public function index() {
        $user = Auth::user();

        /** * Retrieve IDs of properties owned by the partner 
         * to filter the global bookings table.
         */
        $propertyIds = $user->properties()->pluck('id');

        $propertyBookings = $this->propertyBooking::whereIn('property_id', $propertyIds)
            ->with([
                'property' => function ($query) {
                    $query->select('id', 'title', 'slug');
                },
                'user',
            ])
            ->latest()
            ->paginate(10);

        return $this->successResponse(PropertyBookingResource::collection($propertyBookings));
    }

    /**
     * Display the specified booking details.
     *
     * @param PropertyBooking $propertyBooking
     * @return View
     */
    public function show(PropertyBooking $propertyBooking) {
        $this->authorizeOwner($propertyBooking);

        return $this->successResponse([
            'booking' => $propertyBooking->load('property')
        ]);
    }

    /**
     * Update the status of a booking (e.g., Pending to Confirmed).
     *
     * @param string $status
     * @param PropertyBooking $propertyBooking
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(string $status, PropertyBooking $propertyBooking): JsonResponse
    {
        $this->authorizeOwner($propertyBooking);

        $validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'failed'];

        if (!in_array($status, $validStatuses)) {
            return $this->errorResponse(__('Invalid booking status requested.'), 422);
        }

        $oldStatus = $propertyBooking->status;
        $propertyBooking->update(['status' => $status]);

        if ($status !== $oldStatus) {
            if ($status === 'confirmed') {
                event(new PropertyBookingConfirmed($propertyBooking->user, $propertyBooking));
            } elseif ($status === 'cancelled') {
                event(new BookingCancelled($propertyBooking));
            }
        }

        return $this->successResponse(null, __('Booking status updated successfully.'));
    }

    /**
     * Authorize that the partner owns the property associated with the booking.
     *
     * @param PropertyBooking $propertyBooking
     * @return void
     */
    protected function authorizeOwner(PropertyBooking $propertyBooking): void
    {
        if (Auth::id() !== $propertyBooking->property->user_id) {
            abort(403, __('Unauthorized access to this booking record.'));
        }
    }
}
