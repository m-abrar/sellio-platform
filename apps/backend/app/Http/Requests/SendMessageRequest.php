<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $conversation = $this->route('conversation');
        if ($conversation) {
            $conversationId = $conversation instanceof \App\Models\Conversation ? $conversation->id : $conversation;
            return \App\Models\Conversation::where('id', $conversationId)
                ->where(function ($query) {
                    $query->where('sender_id', auth()->id())
                          ->orWhere('receiver_id', auth()->id());
                })->exists();
        }
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:2000'],
        ];
    }
}
