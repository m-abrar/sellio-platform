<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\BookingManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class BookingController
 * Serves as the centralized administrative hub for managing a unified view of inquiries, 
 * bookings, and applications across all marketplace verticals (Auto, Property, Jobs, etc.).
 */
class BookingController extends Controller
{
    /**
     * The unified booking management service.
     *
     * @var \App\Services\Admin\BookingManagementService
     */
    protected BookingManagementService $bookingService;

    /**
     * BookingController constructor.
     *
     * @param  \App\Services\Admin\BookingManagementService  $bookingService
     */
    public function __construct(BookingManagementService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a unified, filtered, and paginated listing of all transaction types.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->route('status') ?: 'all';
        $type = $request->route('type') ?: 'all';

        $bookings = $this->bookingService->getUnifiedBookings($status, $type, 20);

        // Decorate the unified collection with display-friendly attributes
        $bookings->getCollection()->each(function ($booking) {
            $relation = $booking->relation_name;
            $relatedItem = $booking->{$relation};

            $booking->item_title = $relatedItem 
                ? ($relatedItem->name ?? $relatedItem->title ?? "Item #{$relatedItem->id}") 
                : __('Unknown');

            $booking->item_thumbnail = $relatedItem && method_exists($relatedItem, 'getImageUrl')
                ? $relatedItem->thumbnail_url 
                : asset('images/fallbacks/default.jpg');
        });

        return view('admin.bookings.index', compact('bookings', 'status', 'type'));
    }

    /**
     * Dynamically resolve and redirect to the specific management view for a booking type.
     *
     * @param  string  $type
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function show(string $type, int $id): RedirectResponse
    {
        if (!in_array($type, $this->bookingService->getAllowedModels())) {
            return back()->with('error', __('Invalid booking type requested.'));
        }

        $modelClass = "App\\Models\\" . $type;
        
        // Resolve route prefix from model name (e.g., PropertyBooking -> property-bookings)
        $pluralName = Str::plural($type); 
        $routePrefix = Str::kebab($pluralName);
        
        $url = url('/admin/' . $routePrefix . '/' . $id);
        
        return redirect($url);
    }

    /**
     * Remove a booking or inquiry record from the database.
     *
     * @param  string  $type
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $type, int $id): RedirectResponse
    {
        if (!in_array($type, $this->bookingService->getAllowedModels())) {
            return back()->with('error', __('Invalid booking type requested.'));
        }

        $modelClass = "App\\Models\\" . $type;
        $modelClass::destroy($id);

        return back()->with('success', __('Booking deleted successfully.'));
    }
}
