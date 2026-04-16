<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
class SocialLoginController extends Controller
{
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
            // $socialUser = Socialite::driver($provider)->user();
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {

            // Log the full error message and stack trace
            Log::error("Social Login Failed for provider [$provider]: " . $e->getMessage(), [
                'exception' => $e,
                'provider' => $provider,
            ]);
            return redirect()->route('login')->withErrors([
                'msg' => __('Social login failed. Please check the logs or try again.')
            ]);
        }

        // Check if the user already exists
        $user = User::where('email', $socialUser->getEmail())->first();


        if (!$user) {
            // Create a new user if they don't exist
            $user = User::create([
                'name' => $socialUser->getName(),
                'is_buyer' => true, 
                'email' => $socialUser->getEmail(),
                'social_avatar_url' => $socialUser->getAvatar(),
                'password' => Hash::make(Str::random(24)), // Random password for security
                'email_verified_at' => now(), // Social accounts are pre-verified
            ]);

            $user->assignRole('user');
        }

        // Log the user in
        Auth::login($user);

        return redirect()->intended(route('dashboard'));
    }
}
