<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendContactRequest;
use App\Models\Page;
use App\Services\ContactService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

/**
 * Class PageController
 *
 * Handles static content pages and contact form submissions.
 * Theme variables are automatically injected via the LoadTheme middleware.
 *
 * @package App\Http\Controllers
 */
class PageController extends Controller
{
    /**
     * @var \App\Services\ContactService
     */
    protected $contactService;

    /**
     * PageController constructor.
     *
     * @param \App\Services\ContactService $contactService
     */
    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    /**
     * Display a specific CMS page by slug, with fallback to static views.
     *
     * @param string $slug
     * @return View
     */
    public function show(string $slug): View
    {
        $page = Page::active()->where('slug', $slug)->first();

        if ($page) {
            return view('frontend.pages.dynamic', compact('page'));
        }

        // Fallback to legacy static views if DB record missing
        $viewPath = "frontend.pages.{$slug}";
        if (view()->exists($viewPath)) {
            return view($viewPath);
        }

        abort(404);
    }

    /**
     * Display the About Us page.
     */
    public function about(): View
    {
        return $this->show('about');
    }

    /**
     * Display the Contact Us page.
     */
    public function contact(): View
    {
        return $this->show('contact');
    }

    /**
     * Process the contact form submission.
     *
     * @param SendContactRequest $request
     * @return RedirectResponse
     */
    public function sendContact(SendContactRequest $request): RedirectResponse
    {
        $this->contactService->handleInquiry($request->validated());
        
        return back()->with('success', __('Thank you for your message! We will be in touch soon.'));
    }

    /**
     * Display the FAQ page.
     */
    public function faq(): View
    {
        return $this->show('faq');
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacyPolicy(): View
    {
        return $this->show('privacy-policy');
    }

    /**
     * Display the Terms and Conditions page.
     */
    public function terms(): View
    {
        return $this->show('terms');
    }
}
