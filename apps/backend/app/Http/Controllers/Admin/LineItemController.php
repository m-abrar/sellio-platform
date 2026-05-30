<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveLineItemRequest;
use App\Models\LineItem;
use App\Services\FinancialService;
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
    protected $financialService;

    public function __construct(FinancialService $financialService)
    {
        $this->financialService = $financialService;
    }
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
        return view('admin.line-items.form', ['LineItem' => new LineItem()]);
    }

    /**
     * Store a newly created line item template in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(SaveLineItemRequest $request): RedirectResponse
    {
        $this->financialService->createTemplate($request->validated());

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
        return view('admin.line-items.form', ['LineItem' => $lineItem]);
    }

    /**
     * Update an existing line item template in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineItem  $lineItem
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(SaveLineItemRequest $request, LineItem $lineItem): RedirectResponse
    {
        $this->financialService->updateTemplate($lineItem, $request->validated());

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
        $this->financialService->deleteTemplate($lineItem);

        return redirect()->route('admin.line-items.index')
                         ->with('success', __('Template deleted successfully.'));
    }
}
