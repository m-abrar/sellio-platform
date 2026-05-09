<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\View\View;

/**
 * Class NewsletterSubscriberController
 * Orchestrates administrative audience management, coordinating subscriber 
 * verification, metadata updates, and high-volume data exportation.
 */
class NewsletterSubscriberController extends Controller
{
    /**
     * Display a paginated listing of all registered newsletter subscribers.
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $search = $request->query('search');
        $source = $request->query('source');
        $confirmed = $request->query('confirmed');

        $subscribers = NewsletterSubscriber::latest()
            ->when($search, function ($q) use ($search) {
                return $q->where('email', 'LIKE', "%{$search}%");
            })
            ->when($source, function ($q) use ($source) {
                return $q->where('source', $source);
            })
            ->when($confirmed !== null && $confirmed !== '', function ($q) use ($confirmed) {
                return $q->where('is_confirmed', $confirmed);
            })
            ->paginate(15)
            ->withQueryString();

        $sources = NewsletterSubscriber::distinct()->whereNotNull('source')->pluck('source');

        return view('admin.newsletter-subscribers.index', compact('subscribers', 'sources'));
    }

    /**
     * Export the entire subscriber database to a standardized CSV format for marketing integration.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(): StreamedResponse
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=subscribers_" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $subscribers = NewsletterSubscriber::all();

        $callback = function() use ($subscribers) {
            $file = fopen('php://output', 'w');
            
            // Localized CSV Headers
            fputcsv($file, [
                __('ID'), 
                __('Email'), 
                __('Source'), 
                __('Confirmed'), 
                __('Created At')
            ]);

            foreach ($subscribers as $subscriber) {
                fputcsv($file, [
                    $subscriber->id,
                    $subscriber->email,
                    $subscriber->source ?? __('Main Website'),
                    $subscriber->is_confirmed ? __('Yes') : __('No'),
                    $subscriber->created_at ? $subscriber->created_at->format('Y-m-d H:i:s') : ''
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Creation Policy: Manual creation is restricted to maintain lead source integrity.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('info', __('Newsletter subscribers are added via the front-end interface only.'));
    }

    /**
     * Prohibited: Direct storage of subscriber records is restricted.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function store(Request $request): never { abort(404); }

    /**
     * Display the specific details of a newsletter subscriber.
     *
     * @param  \App\Models\NewsletterSubscriber  $newsletterSubscriber
     * @return \Illuminate\View\View
     */
    public function show(NewsletterSubscriber $newsletterSubscriber): View
    {
        return view('admin.newsletter-subscribers.show', compact('newsletterSubscriber'));
    }

    /**
     * Show the form for editing an existing subscriber's configuration.
     *
     * @param  \App\Models\NewsletterSubscriber  $newsletterSubscriber
     * @return \Illuminate\View\View
     */
    public function edit(NewsletterSubscriber $newsletterSubscriber): View
    {
        return view('admin.newsletter-subscribers.form', compact('newsletterSubscriber'));
    }

    /**
     * Update an existing subscriber record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\NewsletterSubscriber  $newsletterSubscriber
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, NewsletterSubscriber $newsletterSubscriber): RedirectResponse
    {
        $validatedData = $request->validate([
            'email'        => 'required|email|unique:newsletter_subscribers,email,' . $newsletterSubscriber->id,
            'is_confirmed' => 'sometimes|boolean',
            'source'       => 'nullable|string|max:255',
        ]);

        $newsletterSubscriber->update($validatedData);

        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('success', __('Subscriber updated successfully.'));
    }

    /**
     * Remove a subscriber record from the database.
     *
     * @param  \App\Models\NewsletterSubscriber  $newsletterSubscriber
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(NewsletterSubscriber $newsletterSubscriber): RedirectResponse
    {
        $newsletterSubscriber->delete();

        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('success', __('Subscriber deleted successfully.'));
    }
}
