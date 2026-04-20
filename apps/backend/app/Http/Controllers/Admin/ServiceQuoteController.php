<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceQuote;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class ServiceQuoteController
 *
 * Manages service quote requests from the admin dashboard.
 * Admins have full visibility over all quotes across all services.
 */
class ServiceQuoteController extends Controller
{
    public function index(\Illuminate\Http\Request $request): View
    {
        $status = $request->status ?: 'all';

        $serviceQuotes = ServiceQuote::with([
            'service.category',
            'service.location',
            'user'    => fn ($q) => $q->select('id', 'name', 'email'),
        ])
            ->when($request->service, fn($q) => $q->where('service_id', $request->service))
            ->when($request->category, function($q) use ($request) {
                $q->whereHas('service', fn($s) => $s->where('category_id', $request->category));
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $services = Service::select('id', 'title', 'category_id')->with('category:id,title')->get();
        $categories = \App\Models\Category::where('is_service', true)->select('id', 'title')->get();

        return view('admin.service-quotes.index', compact('serviceQuotes', 'services', 'categories', 'status'));
    }

    /**
     * Display the specified service quote request.
     *
     * @param ServiceQuote $serviceQuote
     * @return View
     */
    public function show(ServiceQuote $serviceQuote): View
    {
        if (!$serviceQuote->viewed_at) {
            $serviceQuote->update(['viewed_at' => now()]);
        }

        return view('admin.service-quotes.show', [
            'quote' => $serviceQuote->load(['service', 'user']),
        ]);
    }

    /**
     * Remove the specified service quote from storage.
     *
     * @param ServiceQuote $serviceQuote
     * @return RedirectResponse
     */
    public function destroy(ServiceQuote $serviceQuote): RedirectResponse
    {
        $serviceQuote->delete();

        return redirect()
            ->route('admin.service-quotes.index')
            ->with('success', __('Quote request deleted successfully.'));
    }
}
