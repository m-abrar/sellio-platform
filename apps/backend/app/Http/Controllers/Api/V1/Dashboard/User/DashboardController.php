<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\User\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\AutoInquiry;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the main user dashboard overview.
     */
    public function welcome() {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $favoritesCount = $user->userFavorites()->count();
        $bookingsCount = $user->propertyBookings()->count() + $user->eventBookings()->count();
        $messagesCount = $user->new_messages;
        $appsCount = $user->jobApplications()->count();
        $appointmentsCount = $user->serviceAppointments()->count();
        $quotesCount = $user->serviceQuotes()->count();
        $classifiedInquiriesCount = $user->classifiedInquiries()->count();
        $autoInquiriesCount = AutoInquiry::where('user_id', $user->id)->count();
        $inquiriesCount = $classifiedInquiriesCount + $autoInquiriesCount;
        $reviewsCount = Review::where('user_id', $user->id)->count();

        // Using the Recovered Model Attributes for the Overview
        $stats = [
            'totalBookings'     => $user->pending_bookings_count,
            'totalMessages'     => $messagesCount,
            'activeInquiries'   => $user->pending_inquiries_count,
            'walletBalance'     => $user->wallet_balance,
            'favoritesCount'    => $favoritesCount,
            'bookingsCount'     => $bookingsCount,
            'messagesCount'     => $messagesCount,
            'appsCount'         => $appsCount,
            'appointmentsCount' => $appointmentsCount,
            'quotesCount'       => $quotesCount,
            'inquiriesCount'    => $inquiriesCount,
            'classifiedsActivityCount' => $classifiedInquiriesCount,
            'reviewsCount'      => $reviewsCount,
            'totalItemsCount'   => $bookingsCount + $favoritesCount + $messagesCount + $appsCount
                + $appointmentsCount + $quotesCount + $inquiriesCount + $reviewsCount,
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

        if (array_key_exists('settings', $validated)) {
            $validated['preferences'] = $validated['settings'];
            unset($validated['settings']);
        }

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
