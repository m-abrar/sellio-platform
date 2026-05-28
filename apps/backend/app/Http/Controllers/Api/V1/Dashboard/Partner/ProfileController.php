<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\ProfileUpdateRequest;
use App\Services\Partner\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ProfileController
 * Manages Partner Account security and Business Storefront settings.
 */
class ProfileController extends Controller
{
    protected $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Show the profile edit form.
     */
    public function edit(Request $request) {
        $user = $request->user();
        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'company_name' => $user->company,
            'website_url' => $user->website_url,
            'bio' => $user->bio,
            'username' => $user->username,
            'roles' => $user->getRoleNames(),
            'avatar_url' => $user->avatar_url,
        ]);
    }

    /**
     * Update the partner's account and business information.
     */
    public function update(ProfileUpdateRequest $request) {
        $this->profileService->updateProfile(
            $request->user(), 
            $request->validated()
        );

        return $this->successResponse(null, __('Profile and business settings updated successfully.'));
    }

    /**
     * Delete the partner account.
     */
    public function destroy(Request $request) {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // Ensure all listings are handled (Soft Delete or Cascade)
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->successResponse(null, __('Your account has been successfully removed.'));
    }
}
