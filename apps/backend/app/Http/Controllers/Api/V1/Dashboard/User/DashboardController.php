<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Dashboard\User\UpdateProfileRequest;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use App\Http\Resources\UserResource;

class DashboardController extends Controller
{
    /**
     * Display the main user dashboard overview.
     */
    public function welcome() {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Using the Recovered Model Attributes for the Overview
        $stats = [
            'totalBookings'   => $user->pending_bookings_count, 
            'totalMessages'   => $user->new_messages,
            'activeInquiries' => $user->pending_inquiries_count,
            'walletBalance'   => $user->wallet_balance,
        ];

        // Placeholder for theme logic
        $activeTheme = (object)['slug' => 'classic'];

        return $this->successResponse([
            'user'        => new UserResource($user),
            'stats'       => $stats,
            'active_theme' => $activeTheme,
            'notification_count' => $user->total_buyer_activities_count,
        ]);
    }

    /**
     * Show the user profile edit form.
     */
    public function profile() {
        $user = Auth::user();
        $activeTheme = (object)['slug' => 'classic'];

        return $this->successResponse([
            'user' => new UserResource($user),
            'active_theme' => $activeTheme
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(UpdateProfileRequest $request) {
        $user = Auth::user();

        $validated = $request->validated();

        $user->update($validated);

        return $this->successResponse(
            new UserResource($user),
            __('Profile updated successfully.')
        );
    }

    /**
     * User account settings.
     */
    public function settings() {
        $user = Auth::user();
        $activeTheme = (object)['slug' => 'classic'];

        return $this->successResponse([
            'user' => new UserResource($user),
            'active_theme' => $activeTheme
        ]);
    }
}
