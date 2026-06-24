<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Events\NewsletterOptinAttempted;
use App\Events\NewsletterSubscriptionConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class NewsletterController extends Controller
{
    /**
     * Handle the newsletter subscription request.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'source' => 'nullable|string|max:50',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();

        if ($subscriber && $subscriber->is_confirmed) {
            return back()->with('newsletter_status', 'info')
                         ->with('newsletter_message', __('You are already subscribed to our newsletter!'));
        }

        DB::transaction(function () use ($request, &$subscriber) {
            $subscriber = NewsletterSubscriber::updateOrCreate(
                ['email' => $request->email],
                [
                    'confirmation_token' => Str::random(40),
                    'is_confirmed' => false,
                    'source' => $request->source ?? 'footer',
                ]
            );
        });

        event(new NewsletterOptinAttempted($subscriber));

        return back()->with('newsletter_status', 'success')
                     ->with('newsletter_message', __('Please check your email to confirm your subscription.'));
    }

    /**
     * Confirm the newsletter subscription using the token.
     */
    public function confirm(string $token)
    {
        $subscriber = NewsletterSubscriber::where('confirmation_token', $token)
            ->where('is_confirmed', false)
            ->first();

        if (!$subscriber) {
            return redirect('/')->with('error', __('Invalid or expired confirmation token.'));
        }

        $subscriber->update([
            'is_confirmed' => true,
            'confirmation_token' => null,
        ]);

        event(new NewsletterSubscriptionConfirmed($subscriber));

        return redirect('/')->with('success', __('Thank you! Your subscription has been confirmed.'));
    }
}
