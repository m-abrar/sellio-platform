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
    /**
     * Display a listing of all service quote requests.
     *
     * @return View
     */
    public function index(): View
    {
        $serviceQuotes = ServiceQuote::with([
            'service' => fn ($q) => $q->select('id', 'title', 'slug'),
            'user'    => fn ($q) => $q->select('id', 'name', 'email'),
        ])
            ->latest()
            ->paginate(15);

        return view('admin.service-quotes.index', compact('serviceQuotes'));
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
