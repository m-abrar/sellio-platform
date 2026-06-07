<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Class ConversationService
 * Handles the business logic for managing messaging threads.
 */
class ConversationService
{
    /**
     * Find an existing conversation or create a new one between two users.
     *
     * @param User $partner
     * @param int $userId
     * @return Conversation
     */
    public function findOrCreate(User $partner, int $userId): Conversation
    {
        $partnerId = $partner->id;

        $conversation = Conversation::where(function ($query) use ($userId, $partnerId) {
            $query->where('user_id', $userId)
                  ->where('partner_id', $partnerId);
        })->orWhere(function ($query) use ($userId, $partnerId) {
            $query->where('user_id', $partnerId)
                  ->where('partner_id', $userId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id'    => $userId,
                'partner_id' => $partnerId,
            ]);
        }

        return $conversation;
    }

    /**
     * Get all conversations for a user.
     */
    public function getConversationsForUser(int $userId): Builder
    {
        return Conversation::where('user_id', $userId)
                           ->orWhere('partner_id', $userId);
    }

    /**
     * Get all messages received by a user across all conversations.
     */
    public function getReceivedMessagesForUser(int $userId): Builder
    {
        $conversationIds = $this->getConversationsForUser($userId)->pluck('id');
        return Message::whereIn('conversation_id', $conversationIds)
                                  ->where('sender_id', '!=', $userId);
    }

    /**
     * Get the count of unread messages for a user.
     */
    public function getUnreadMessagesCount(int $userId): int
    {
        return $this->getReceivedMessagesForUser($userId)
                    ->whereNull('read_at')
                    ->count();
    }
}
