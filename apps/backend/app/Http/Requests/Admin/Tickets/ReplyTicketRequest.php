<?php

namespace App\Http\Requests\Admin\Tickets;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ReplyTicketRequest
 * Orchestrates the administrative validation for support ticket communication, 
 * ensuring message integrity and content length constraints for helpdesk interactions.
 */
class ReplyTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Middleware handles role checking
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
