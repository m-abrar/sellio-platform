<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendContactRequest;
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
     * Display the About Us page.
     *
     * @return View
     */
    public function about(): View
    {
        return view('frontend.pages.about');
    }

    /**
     * Display the Contact Us page.
     *
     * @return View
     */
    public function contact(): View
    {
        return view('frontend.pages.contact');
    }

    /**
     * Process the contact form submission.
     *
     * @param SendContactRequest $request
     * @return RedirectResponse
     */
    public function sendContact(SendContactRequest $request): RedirectResponse
    {
        // Business logic (e.g., sending mail) should ideally be in an Action or Service class.
        
        return back()->with('success', __('Thank you for your message! We will be in touch soon.'));
    }

    /**
     * Display the FAQ page.
     *
     * @return View
     */
    public function faq(): View
    {
        return view('frontend.pages.faq');
    }

    /**
     * Display the Privacy Policy page.
     *
     * @return View
     */
    public function privacyPolicy(): View
    {
        return view('frontend.pages.privacy-policy');
    }

    /**
     * Display the Terms and Conditions page.
     *
     * @return View
     */
    public function terms(): View
    {
        return view('frontend.pages.terms');
    }
}
