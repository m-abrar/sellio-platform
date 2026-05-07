<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LineItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class LineItemController
 * Manages the global templates and configuration for financial line items 
 * (e.g., Taxes, Processing Fees, Discounts) that apply across marketplace transactions.
 */
class LineItemController extends Controller
{
    /**
     * Display a listing of all configured line item templates.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $lineItems = LineItem::orderBy('order')->get();
        return view('admin.line-items.index', compact('lineItems'));
    }

    /**
     * Show the form for creating a new line item template.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        return view('admin.line-items.form');
    }

    /**
     * Store a newly created line item template in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount'      => 'required|numeric',
            'is_required' => 'boolean',
            'applies_on'  => 'required|string',
            'type'        => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'status'      => 'nullable|in:active,inactive',
        ]);

        LineItem::create($data);

        return redirect()->route('admin.line-items.index')
                         ->with('success', __('Template created successfully.'));
    }

    /**
     * Show the form for editing an existing line item template.
     *
     * @param  \App\Models\LineItem  $lineItem
     * @return \Illuminate\View\View
     */
    public function edit(LineItem $lineItem): View
    {
        return view('admin.line-items.form', compact('lineItem'));
    }

    /**
     * Update an existing line item template in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineItem  $lineItem
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, LineItem $lineItem): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount'      => 'required|numeric',
            'is_required' => 'boolean',
            'applies_on'  => 'required|string',
            'type'        => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'status'      => 'nullable|in:active,inactive',
        ]);

        $lineItem->update($data);

        return redirect()->route('admin.line-items.index')
                         ->with('success', __('Template updated successfully.'));
    }

    /**
     * Remove a line item template from the database.
     *
     * @param  \App\Models\LineItem  $lineItem
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(LineItem $lineItem): RedirectResponse
    {
        $lineItem->delete();

        return redirect()->route('admin.line-items.index')
                         ->with('success', __('Template deleted successfully.'));
    }
}
