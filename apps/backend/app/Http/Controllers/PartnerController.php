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
            ->withCount(['reviews']) // Optional: Eager load stats for the profile
            ->firstOrFail();

        return view("frontend.partners.show", [
            'user' => $user
        ]);
    }
}
