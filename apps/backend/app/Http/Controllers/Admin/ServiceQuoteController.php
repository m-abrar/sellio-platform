<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceQuote;
use App\Models\Category;
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
     * Display a filtered and paginated listing of all professional service quote requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->query('status', 'all');

        $serviceQuotes = ServiceQuote::with([
            'service.category',
            'service.location',
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])
            ->when($request->query('service'), fn($q) => $q->where('service_id', $request->query('service')))
            ->when($request->query('service_name'), fn($q) => $q->whereHas('service', fn($s) => $s->where('title', 'LIKE', "%{$request->query('service_name')}%")))
            ->when($request->query('category'), function($q) use ($request) {
                $q->whereHas('service', fn($s) => $s->where('category_id', $request->query('category')));
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $services   = Service::select('id', 'title', 'category_id')->with('category:id,title')->get();
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
        // Administrative Engagement Tracking
        if (!$serviceQuote->viewed_at) {
            $serviceQuote->update(['viewed_at' => now()]);
        }

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
        $serviceQuote->delete();

        return redirect()
            ->route('admin.service-quotes.index')
            ->with('success', __('Service quote request removed successfully.'));
    }
}
