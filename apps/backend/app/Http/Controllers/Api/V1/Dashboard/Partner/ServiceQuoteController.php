<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\ServiceQuote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ServiceQuoteController
 *
 * Manages price quotes and project estimates for services owned by the partner.
 */
class ServiceQuoteController extends Controller
{
    /**
     * @var ServiceQuote
     */
    protected $quote;

    /**
     * ServiceQuoteController constructor.
     *
     * @param ServiceQuote $quote
     */
    public function __construct(ServiceQuote $quote)
    {
        $this->quote = $quote;
    }

    /**
     * Display a listing of quote requests for the partner's services.
     *
     * @return View
     */
    public function index() {
        $user = Auth::user();

        /** * Retrieve IDs of services owned by the partner 
         * to filter the global service quotes table.
         */
        $serviceListingIds = $user->services()->pluck('id');

        $serviceQuotes = $this->quote::whereIn('service_id', $serviceListingIds)
            ->with(['service' => function ($query) {
                $query->select('id', 'title', 'slug');
            }])
            ->latest()
            ->paginate(10);

        return ServiceQuoteResource::collection($serviceQuotes);
    }

    /**
     * Display the specified quote request details.
     *
     * @param ServiceQuote $serviceQuote
     * @return View
     */
    public function show(ServiceQuote $serviceQuote) {
        $this->authorizeOwner($serviceQuote);

        return $this->successResponse([
            'quote' => $serviceQuote->load('service')
        ]);
    }

    /**
     * Update the quote with an estimated price or status.
     *
     * @param \Illuminate\Http\Request $request
     * @param ServiceQuote $serviceQuote
     * @return RedirectResponse
     */
    public function update(string $status, ServiceQuote $serviceQuote) {
        $this->authorizeOwner($serviceQuote);

        $serviceQuote->update(['status' => $status]);

        return $this->successResponse(null, __('Quote status updated successfully.'));
    }

    /**
     * Remove the specified quote request from storage.
     *
     * @param ServiceQuote $serviceQuote
     * @return RedirectResponse
     */
    public function destroy(ServiceQuote $serviceQuote) {
        $this->authorizeOwner($serviceQuote);

        $serviceQuote->delete();

        return $this->successResponse(null, __('Quote request deleted successfully.'));
    }

    /**
     * Authorize that the partner owns the service associated with the quote.
     *
     * @param ServiceQuote $quote
     * @return void
     */
    protected function authorizeOwner(ServiceQuote $quote): void
    {
        if (Auth::id() !== $quote->service->user_id) {
            abort(403, __('Unauthorized access to this quote record.'));
        }
    }
}
