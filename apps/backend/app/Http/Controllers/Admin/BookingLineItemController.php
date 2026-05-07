<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingLineItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class BookingLineItemController
 * Manages the individual financial and descriptive components (line items) 
 * associated with a parent booking record.
 */
class BookingLineItemController extends Controller
{
    /**
     * Display a listing of all booking line items.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $items = BookingLineItem::with(['booking'])->latest()->paginate(20);
        return view('admin.booking-line-items.index', compact('items'));
    }

    /**
     * Display the details of a specific booking line item.
     *
     * @param  \App\Models\BookingLineItem  $bookingLineItem
     * @return \Illuminate\View\View
     */
    public function show(BookingLineItem $bookingLineItem): View
    {
        return view('admin.booking-line-items.show', ['item' => $bookingLineItem]);
    }

    /**
     * Update the details of an existing booking line item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BookingLineItem  $bookingLineItem
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, BookingLineItem $bookingLineItem): RedirectResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price'    => 'required|numeric|min:0',
        ]);

        $bookingLineItem->update($validated);

        return redirect()->back()->with('success', __('Line item updated successfully.'));
    }

    /**
     * Remove a line item from its parent booking.
     *
     * @param  \App\Models\BookingLineItem  $bookingLineItem
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(BookingLineItem $bookingLineItem): RedirectResponse
    {
        $bookingLineItem->delete();
        return redirect()->back()->with('success', __('Line item removed successfully.'));
    }
}
