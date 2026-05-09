<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation; 
use App\Models\Message; 
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessageSent;

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
            ->with(['user', 'partner', 'lastMessage']) 
            ->orderByDesc('updated_at')
            ->get();

        return $this->successResponse([
            'conversations' => $conversations,
            'user' => $user,
        ]);
    }

    /**
     * Display a specific conversation thread with full message history.
     *
     * @param  int  $conversationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($conversationId)
    {
        $partner = Auth::user();
        
        $activeConversation = Conversation::forUser($partner->id)
            ->where('id', $conversationId)
            ->with(['user', 'partner']) 
            ->firstOrFail();

        $messages = $activeConversation->messages()
            ->orderBy('created_at', 'asc')
            ->get(); 
        
        // You would typically mark messages sent by the client as 'read' here.

        return $this->successResponse([
            'activeConversation' => $activeConversation,
            'messages'           => $messages,
            'user'               => $partner, 
        ]);
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

        $recipient = $conversation->user; 
        if ($recipient) {
            // NewMessageSent::dispatch($message, $recipient);
            broadcast(new NewMessageSent($message, $recipient))->toOthers();
        }

        if ($request->wantsJson()) {
            return $this->successResponse(null, $message, 201);
        }

        return $this->successResponse(null, 'Message sent successfully.');
    }
}
