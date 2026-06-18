<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Events\MessageRead;
use App\Events\NewMessageSent;
use App\Events\UserTyping;
use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Support\SafeBroadcast;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class MessageController
 * Orchestrates the API-driven communication channel for partners, managing
 * conversation threads, real-time messaging events, and contact synchronization.
 */
class MessageController extends Controller
{
    /**
     * Retrieve a collection of active conversations for the authenticated partner.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $partner = $user = Auth::user();
        
        $conversations = Conversation::forUser($partner->id) 
            ->with(['user', 'partner', 'lastMessage', 'inquiriable']) 
            ->orderByDesc('updated_at')
            ->get();

        return $this->successResponse([
            'conversations' => $conversations,
            'user' => $user,
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate')
          ->header('Pragma', 'no-cache');
    }

    /**
     * Display a specific conversation thread with full message history.
     *
     * @param  int  $conversationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $conversationId)
    {
        $partner = Auth::user();
        
        $activeConversation = Conversation::forUser($partner->id)
            ->where('id', $conversationId)
            ->with(['user', 'partner', 'inquiriable']) 
            ->firstOrFail();

        $messages = $activeConversation->messages()
            ->orderBy('created_at', 'asc')
            ->get(); 
        
        // Polling passes skip_read=1 to avoid re-marking on every poll tick.
        if (!$request->boolean('skip_read')) {
            $unread = $activeConversation->messages()
                ->where('sender_id', '!=', $partner->id)
                ->whereNull('read_at')
                ->get();

            foreach ($unread as $msg) {
                $msg->update(['read_at' => now()]);
                SafeBroadcast::toOthers(new MessageRead($msg));
            }
        }

        return $this->successResponse([
            'activeConversation' => $activeConversation,
            'messages'           => $messages,
            'user'               => $partner,
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate')
          ->header('Pragma', 'no-cache');
    }

    /**
     * Dispatch a new message within an existing conversation thread.
     *
     * @param  \App\Http\Requests\SendMessageRequest  $request
     * @param  int  $conversationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(SendMessageRequest $request, $conversationId)
    {

        $partner = Auth::user();
        
        $conversation = Conversation::forUser($partner->id)
                                     ->where('id', $conversationId)
                                     ->firstOrFail();

        $message = new Message();
        $message->conversation_id = $conversation->id;
        $message->sender_id = $partner->id;
        $message->body = $request->input('body');
        $message->save();

        $conversation->touch(); 

        $recipient = $conversation->otherParticipant($partner->id) ?? $partner;
        SafeBroadcast::toOthers(new NewMessageSent($message, $recipient));

        return $this->successResponse($message->fresh(), __('Message sent successfully.'), 201);
    }

    public function markRead(int $conversationId)
    {
        $partner = Auth::user();

        $conversation = Conversation::forUser($partner->id)
            ->where('id', $conversationId)
            ->firstOrFail();

        $unread = $conversation->messages()
            ->where('sender_id', '!=', $partner->id)
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
        $partner = Auth::user();

        Conversation::forUser($partner->id)->where('id', $conversationId)->firstOrFail();

        SafeBroadcast::toOthers(new UserTyping($conversationId, $partner->id, $partner->name));

        return $this->successResponse([]);
    }
}
