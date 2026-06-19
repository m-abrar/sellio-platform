<?php
/**
 * Broadcasting Channels
 *
 * Defines the authorization logic for real-time event broadcasting.
 * Supports private user notifications and secure multi-party chat conversations.
 */
use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;


// Sanctum Bearer-token clients (buyer/seller SPAs) authenticate via the api/broadcasting/auth
// route. We must tell the broadcaster to resolve the user via the 'sanctum' guard, not the
// default 'web' (session) guard, otherwise $user is null and the channel returns 403.
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['sanctum']]);

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (!$conversation) {
        return false;
    }

    return (int) $user->id === (int) $conversation->user_id || (int) $user->id === (int) $conversation->partner_id;
}, ['guards' => ['sanctum']]);
