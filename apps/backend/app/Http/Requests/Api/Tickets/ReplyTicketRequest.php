<?php

namespace App\Http\Requests\Api\Tickets;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ReplyTicketRequest
 * Validates the API-driven communication payload for support ticket replies,
 * ensuring content integrity and adhering to helpdesk character constraints.
 */
class ReplyTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Middleware authed user handles this
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'body' => 'required|string|max:2000',
        ];
    }
}
