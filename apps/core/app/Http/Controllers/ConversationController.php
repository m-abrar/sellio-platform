<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function start(string $username)
    {
        if (!Auth::check()) {
            return redirect()->back()->withErrors(['message' => 'You must be logged in to start a conversation.']);
        }

        $buyerId = Auth::user()->id;

        $partner = User::where('username', $username)->firstOrFail();
        $partnerId = $partner->id;

        if ($buyerId === $partnerId) {
              return redirect()->back()->withErrors(['message' => 'You cannot start a conversation with yourself.']);
        }

        $conversation = Conversation::where(function ($query) use ($buyerId, $partnerId) {
            $query->where('user_id', $buyerId)
                  ->where('partner_id', $partnerId);
        })->orWhere(function ($query) use ($buyerId, $partnerId) {
            $query->where('user_id', $partnerId)
                  ->where('partner_id', $buyerId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $buyerId,
                'partner_id' => $partnerId,
            ]);
        }

        return redirect()->route('dashboard.user.messages.index', $conversation->id);
    }
}
