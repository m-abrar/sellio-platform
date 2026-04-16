<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation; 
use App\Models\Message; 
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessageSent;

class MessageController extends Controller
{
    public function index()
    {
        $partner = $user = Auth::user();
        
        $conversations = Conversation::where('partner_id', $partner->id) 
            ->with(['user', 'lastMessage']) 
            ->orderByDesc('updated_at')
            ->get();

        return $this->successResponse([
            'conversations' => $conversations,
            'user' => $user,
        ]);
    }

    public function show($conversationId)
    {
        $partner = Auth::user();
        
        $activeConversation = Conversation::where('id', $conversationId)
            ->where('partner_id', $partner->id) 
            ->with('user') 
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

    public function sendMessage(SendMessageRequest $request, $conversationId)
    {

        $partner = Auth::user();
        
        $conversation = Conversation::where('id', $conversationId)
                                     ->where('partner_id', $partner->id) 
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
