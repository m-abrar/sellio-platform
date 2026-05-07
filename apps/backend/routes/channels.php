/**
 * Broadcasting Channels
 *
 * Defines the authorization logic for real-time event broadcasting.
 * Supports private user notifications and secure multi-party chat conversations.
 */
use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (!$conversation) {
        return false;
    }

    // A user is authorized if they are either the client (user_id) OR the partner (partner_id).
    return $user->id === $conversation->user_id || $user->id === $conversation->partner_id;
});