<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Class ConversationController
 * Manages the initialization and orchestration of messaging threads between buyers and partners.
 */
class ConversationController extends Controller
{
    /**
     * Start or retrieve an existing conversation with a specific user.
     *
     * @param  string  $username
     * @return \Illuminate\Http\RedirectResponse
     */
    public function start(string $username): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->back()->withErrors(['message' => __('You must be logged in to start a conversation.')]);
        }

        $buyerId = Auth::id();
        $partner = User::where('username', $username)->firstOrFail();
        $partnerId = $partner->id;

        // Prevent self-messaging
        if ($buyerId === $partnerId) {
            return redirect()->back()->withErrors(['message' => __('You cannot start a conversation with yourself.')]);
        }

        // Retrieve existing conversation or create a new one
        $conversation = Conversation::where(function ($query) use ($buyerId, $partnerId) {
            $query->where('user_id', $buyerId)
                  ->where('partner_id', $partnerId);
        })->orWhere(function ($query) use ($buyerId, $partnerId) {
            $query->where('user_id', $partnerId)
                  ->where('partner_id', $buyerId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id'    => $buyerId,
                'partner_id' => $partnerId,
            ]);
        }

        return redirect()->route('dashboard.user.messages.index', $conversation->id);
    }
}
