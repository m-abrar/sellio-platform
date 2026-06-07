<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartConversationRequest;
use App\Models\Conversation;
use App\Models\User;
use App\Services\ConversationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

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
     * @param  \App\Http\Requests\StartConversationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function start(StartConversationRequest $request): RedirectResponse
    {
        // Rate Limiting
        if (RateLimiter::tooManyAttempts('start-conv:' . Auth::id(), 5)) {
            return back()->withErrors(['message' => __('Too many requests.')]);
        }
        RateLimiter::hit('start-conv:' . Auth::id(), 60);

        $partner = User::where('username', $request->validated()['username'])->firstOrFail();
        
        if (Auth::id() === $partner->id) {
            return back()->withErrors(['message' => __('You cannot start a conversation with yourself.')]);
        }

        $conversation = $this->conversationService->findOrCreate($partner, Auth::id());

        return redirect()->route('dashboard.user.messages.index', $conversation->id);
    }
}
