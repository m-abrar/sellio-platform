<?php

namespace App\Http\Requests;

use App\Models\Conversation;
use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $conversation = $this->route('conversation') ?? $this->route('conversationId');

        if ($conversation) {
            $conversationId = $conversation instanceof Conversation
                ? $conversation->id
                : $conversation;

            return Conversation::where('id', $conversationId)
                ->where(function ($query) {
                    $query->where('user_id', auth()->id())
                          ->orWhere('partner_id', auth()->id());
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
