<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use App\Services\ConversationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    /**
     * @var ConversationService
     */
    protected ConversationService $conversationService;

    /**
     * ConversationController constructor.
     *
     * @param ConversationService $conversationService
     */
    public function __construct(ConversationService $conversationService)
    {
        $this->conversationService = $conversationService;
    }

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

        // Apply Rate Limiting: 5 attempts per minute per user
        $executed = \Illuminate\Support\Facades\RateLimiter::attempt(
            'start-conversation:' . Auth::id(),
            5,
            function() {}
        );

        if (!$executed) {
            return redirect()->back()->withErrors(['message' => __('Too many requests. Please try again in a minute.')]);
        }

        $buyerId = Auth::id();
        $partner = User::where('username', $username)->firstOrFail();
        
        // Prevent self-messaging
        if ($buyerId === $partner->id) {
            return redirect()->back()->withErrors(['message' => __('You cannot start a conversation with yourself.')]);
        }

        $conversation = $this->conversationService->findOrCreate($partner, $buyerId);

        return redirect()->route('dashboard.user.messages.index', $conversation->id);
    }
}
