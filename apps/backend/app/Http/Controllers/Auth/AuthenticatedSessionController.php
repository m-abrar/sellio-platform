<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Spatie\Activitylog\Models\Activity;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Authenticate the user (sets the user in the session)
        $request->authenticate();

        // 2. Regenerate the session ID
        $request->session()->regenerate();
        
        // 3. Log the successful login activity
        // Get the authenticated user instance from the Auth facade
        $user = Auth::user(); 

        // Ensure the user exists before logging, though it should after authenticate()
        if ($user) {
            activity('auth') 
                // Pass the authenticated user instance to causedBy()
                ->causedBy($user) 
                ->performedOn($user)
                ->event('login')
                ->withProperties([
                    'ip' => $request->ip(),
                    'email' => $user->email,
                ])
                ->log('User logged in.');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // 1. Get the user *before* logging them out.
        // We use the temporary $causer variable to store the user instance.
        $causer = Auth::user(); 

        // 2. Perform the default logout actions.
        // This destroys the session, meaning Auth::user() will be NULL afterwards.
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 3. Log the activity using the stored $causer.
        // The check for $causer ensures we don't try to log if the user was somehow null before logout.
        if ($causer) {
            activity('auth')
                ->causedBy($causer) 
                ->performedOn($causer) 
                ->event('logout') // Correct the event to 'logout'
                ->withProperties(['ip' => $request->ip()])
                ->log('User logged out.'); // Correct the description to 'logged out'
        }

        return redirect('/');
    }
}
