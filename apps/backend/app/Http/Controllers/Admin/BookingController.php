<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\BookingManagementService;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Route;

/**
 * Class BookingController
 * * Manages a unified view of inquiries, bookings, and applications across all modules.
 */
class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingManagementService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a listing of mixed booking/transaction types.
     */
    public function index(\Illuminate\Http\Request $request): View
    {
        $status = $request->route('status') ?: 'all';
        $type = $request->route('type') ?: 'all';

        $bookings = $this->bookingService->getUnifiedBookings($status, $type, 20);

        // Add display helper for the view
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

    public function show(string $type, int $id)
    {
        $modelClass = "App\\Models\\" . $type;
        
        if (!class_exists($modelClass)) {
            return back()->with('error', __('Invalid booking type.'));
        }

        // 1. Convert "PropertyBooking" to "PropertyBookings" 
        // (We pluralize the whole class name first)
        $pluralName = Str::plural($type); 

        // 2. Convert "PropertyBookings" to "property-bookings"
        $routePrefix = Str::kebab($pluralName);
        
        // Now results in: "admin.property-bookings.show"
        // Direct URL Redirect to sub-controller show route (bypasses named route lookup caching bugs)
        $url = url('/admin/' . $routePrefix . '/' . $id);
        
        return redirect($url);
    }

    /**
     * Remove a booking/inquiry.
     */
    public function destroy(string $type, int $id)
    {
        $modelClass = "App\\Models\\" . $type;
        
        if (class_exists($modelClass)) {
            $modelClass::destroy($id);
            return back()->with('success', __('Booking deleted successfully.'));
        }

        return back()->with('error', __('Invalid booking type.'));
    }
}
