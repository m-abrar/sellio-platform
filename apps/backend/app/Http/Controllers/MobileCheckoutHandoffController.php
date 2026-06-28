<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MobileCheckoutHandoffController extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->hasValidSignature(), 403);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        $request->session()->put('mobile_checkout_return_url', 'sellio://payment-return');

        return redirect()->route('checkout.index');
    }
}
