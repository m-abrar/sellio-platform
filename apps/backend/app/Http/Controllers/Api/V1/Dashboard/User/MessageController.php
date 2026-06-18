<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Events\MessageRead;
use App\Events\NewMessageSent;
use App\Events\UserTyping;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\SendMessageRequest;
use App\Support\SafeBroadcast;

/**
 * Class MessageController
 * Orchestrates the user-facing communication channel, managing conversation 
 * threads, real-time messaging events, and contact synchronization.
 */
class MessageController extends Controller
{
    /**
     * Retrieve a collection of conversations and active message history for the authenticated user.
     *
     * @param  int|null  $conversationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($conversationId = null) {
        $user = Auth::user();
        
        // 1. Fetch all conversations for the user using the correct scope
        $conversations = Conversation::forUser($user->id)
            ->with(['partner', 'user', 'lastMessage'])
            ->orderByDesc('updated_at')
            ->get();

        $activeConversation = null;
        $messages = collect();

        if ($conversations->isNotEmpty()) {
            // 2. Identify the active conversation
            $activeConversation = $conversations->first(function ($convo) use ($conversationId) {
                return $convo->id == $conversationId;
            }) ?: $conversations->first();

            // 3. Load messages for the active conversation
            if ($activeConversation) {
                $messages = $activeConversation->messages()
                    ->orderBy('created_at', 'asc')
                    ->get();
            }
        }

        return $this->successResponse([
            'conversations'      => $conversations,
            'activeConversation' => $activeConversation,
            'messages'           => $messages,
            'user'               => $user,
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate')
          ->header('Pragma', 'no-cache');
    }

    /**
     * Dispatch a new message within an existing conversation thread.
     *
     * @param  \App\Http\Requests\SendMessageRequest  $request
     * @param  int  $conversationId
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function sendMessage(SendMessageRequest $request, $conversationId): JsonResponse|RedirectResponse
    {

        $user = Auth::user();
        
        $conversation = Conversation::forUser($user->id)
            ->where('id', $conversationId)
            ->firstOrFail();

        // 1. Create the message
        $message = new Message([
            'conversation_id' => $conversation->id,
            'body'            => $request->input('body'),
        ]);
        $message->sender_id = $user->id;
        $message->save();

        // 2. Update conversation timestamp for sorting
        $conversation->touch();

        // 3. Handle real-time broadcasting
        $recipient = $conversation->otherParticipant($user->id) ?? $user;
        SafeBroadcast::toOthers(new NewMessageSent($message, $recipient));

        if ($request->wantsJson()) {
            return $this->successResponse([
                'message' => $message->load('sender'),
            ], 'Message sent successfully.', 201);
        }

        return $this->successResponse([
            'message' => $message->load('sender'),
        ], 'Message sent successfully.');
    }

    /**
     * Find or create a conversation for a listing and return its messages.
     * Called from the storefront live-chat widget when a visitor opens the chat panel.
     */
    public function start(Request $request): JsonResponse
    {
        $user = Auth::user();

        $typeMap = [
            'products'   => \App\Models\Product::class,
            'properties' => \App\Models\Property::class,
            'autos'      => \App\Models\Auto::class,
            'services'   => \App\Models\Service::class,
            'jobs'       => \App\Models\JobListing::class,
            'events'     => \App\Models\Event::class,
            'classifieds'=> \App\Models\Classified::class,
        ];

        $vertical  = $request->input('vertical');
        $listingId = (int) $request->input('listing_id');

        if (!isset($typeMap[$vertical]) || !$listingId) {
            return $this->errorResponse('Invalid listing reference.', 422);
        }

        $listing = $typeMap[$vertical]::findOrFail($listingId);
        $partner = User::findOrFail($listing->user_id);

        $conversation = (new ConversationService())->findOrCreate($partner, $user->id);

        $messages = $conversation->messages()
            ->orderBy('created_at', 'asc')
            ->get();

        return $this->successResponse([
            'conversation_id' => $conversation->id,
            'messages'        => $messages,
            'partner'         => [
                'id'     => $partner->id,
                'name'   => $partner->name,
                'avatar' => $partner->avatar_url ?? null,
            ],
        ]);
    }

    public function markRead(int $conversationId): JsonResponse
    {
        $user = Auth::user();

        $conversation = Conversation::forUser($user->id)
            ->where('id', $conversationId)
            ->firstOrFail();

        $unread = $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->get();

        foreach ($unread as $msg) {
            $msg->update(['read_at' => now()]);
            SafeBroadcast::toOthers(new MessageRead($msg));
        }

        return $this->successResponse(['marked' => $unread->count()]);
    }

    public function typing(int $conversationId): JsonResponse
    {
        $user = Auth::user();

        Conversation::forUser($user->id)->where('id', $conversationId)->firstOrFail();

        SafeBroadcast::toOthers(new UserTyping($conversationId, $user->id, $user->name));

        return $this->successResponse([]);
    }
}
