<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

/**
 * Class ProfileController
 * Orchestrates administrative identity management, coordinating profile 
 * updates and account security protocols for platform administrators.
 */
class ProfileController extends Controller
{
    /**
     * Show the interface for editing the authenticated administrator's profile.
     *
     * @return \Illuminate\View\View
     */
    public function edit(): View
    {
        $user = Auth::user();
        return view('admin.profile.edit', compact('user'));
    }

    /**
     * Update the authenticated administrator's identity and security parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $user->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Secure password mutation: Only update if a new password is provided
        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', __('Administrative profile updated successfully.'));
    }
}
