<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

/**
 * Class PartnerController
 *
 * Handles the public profile display for partners/service providers.
 */
class PartnerController extends Controller
{
    /**
     * Display the specified partner profile.
     *
     * @param Request $request
     * @param string $username
     * @return View
     */
    public function show(Request $request, string $username): View
    {
        // Fetch user by username or fail with 404
        $user = User::where('username', $username)
            ->withCount(['reviews'])
            ->with([
                'properties' => fn($q) => $q->active()->with(['location', 'category']),
                'autos'      => fn($q) => $q->active()->with(['location', 'category']),
                'jobs'       => fn($q) => $q->active()->with(['location', 'category']),
                'services'   => fn($q) => $q->active()->with(['location', 'category']),
                'events'     => fn($q) => $q->active()->with(['location', 'category']),
            ])
            ->firstOrFail();

        return view("frontend.partners.show", [
            'user' => $user
        ]);
    }
}
