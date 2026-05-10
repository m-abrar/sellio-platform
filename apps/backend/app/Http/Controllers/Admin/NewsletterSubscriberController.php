<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\Admin\NewsletterManagementService;
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
     * @var NewsletterManagementService
     */
    protected NewsletterManagementService $newsletterService;

    /**
     * NewsletterSubscriberController constructor.
     *
     * @param NewsletterManagementService $newsletterService
     */
    public function __construct(NewsletterManagementService $newsletterService)
    {
        $this->newsletterService = $newsletterService;
    }

    /**
     * Display a paginated listing of all registered newsletter subscribers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $subscribers = $this->newsletterService->getSubscribers($request->only(['search', 'source', 'confirmed']));
        $sources = $this->newsletterService->getSources();

        return view('admin.newsletter-subscribers.index', compact('subscribers', 'sources'));
    }

    /**
     * Export the entire subscriber database to a standardized CSV format for marketing integration.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(): StreamedResponse
    {
        return $this->newsletterService->exportToCsv();
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

        $this->newsletterService->updateSubscriber($newsletterSubscriber, $validatedData);

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
        $this->newsletterService->deleteSubscriber($newsletterSubscriber);

        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('success', __('Subscriber deleted successfully.'));
    }
}
