<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
/**
 * Class SocialLoginController
 *
 * Orchestrates the OAuth authentication lifecycle for third-party providers 
 * (Google, Facebook, etc.) via Laravel Socialite. Handles user discovery, 
 * atomic account creation, and secure login redirection.
 */
class SocialLoginController extends Controller
{
    protected $authService;

    public function __construct(\App\Services\AuthService $authService)
    {
        $this->authService = $authService;
    }
    /**
     * Redirect the user to the Provider authentication page.
     */
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Obtain the user information from the Provider.
     */
    public function callback($provider)
    {

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            Log::error("Social Login Failed for provider [$provider]: " . $e->getMessage(), [
                'exception' => $e,
                'provider' => $provider,
            ]);
            return redirect()->route('login')->withErrors([
                'msg' => __('Social login failed. Please check the logs or try again.')
            ]);
        }

        $user = $this->authService->findOrCreateSocialUser($provider, $socialUser);

        Auth::login($user);

        return redirect()->intended(route('dashboard.user.welcome'));
    }
}
