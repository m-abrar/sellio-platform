<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceQuote;
use App\Models\Category;
use App\Services\Admin\ServiceQuoteManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ServiceQuoteController
 * Orchestrates administrative oversight for professional service inquiries, 
 * managing quoting requirements, provider coordination, and engagement tracking.
 */
class ServiceQuoteController extends Controller
{
    /**
     * @var ServiceQuoteManagementService
     */
    protected ServiceQuoteManagementService $quoteService;

    /**
     * ServiceQuoteController constructor.
     *
     * @param ServiceQuoteManagementService $quoteService
     */
    public function __construct(ServiceQuoteManagementService $quoteService)
    {
        $this->quoteService = $quoteService;
    }

    /**
     * Display a filtered and paginated listing of all professional service quote requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->query('status', 'all');
        $filters = array_merge($request->only(['service', 'service_name', 'category']), ['status' => $status]);

        $serviceQuotes = $this->quoteService->getQuotes($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $services = Service::select('id', 'title', 'category_id')->with('category:id,title')->limit(100)->get();
        $categories = Category::where('is_service', true)->select('id', 'title')->get();

        return view('admin.service-quotes.index', compact('serviceQuotes', 'services', 'categories', 'status'));
    }

    /**
     * Display the comprehensive details of a specific quote request and track read status.
     *
     * @param  \App\Models\ServiceQuote  $serviceQuote
     * @return \Illuminate\View\View
     */
    public function show(ServiceQuote $serviceQuote): View
    {
        $this->quoteService->markAsViewed($serviceQuote);

        return view('admin.service-quotes.show', [
            'quote' => $serviceQuote->load(['service', 'user']),
        ]);
    }

    /**
     * Remove a service quote request from the administrative database.
     *
     * @param  \App\Models\ServiceQuote  $serviceQuote
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ServiceQuote $serviceQuote): RedirectResponse
    {
        $this->quoteService->deleteQuote($serviceQuote);

        return redirect()
            ->route('admin.service-quotes.index')
            ->with('success', __('Service quote request removed successfully.'));
    }
}
