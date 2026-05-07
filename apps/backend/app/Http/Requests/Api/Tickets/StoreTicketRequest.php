<?php

namespace App\Http\Requests\Api\Tickets;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreTicketRequest
 * Orchestrates the validation protocols for initializing API-driven support tickets, 
 * managing thematic titles, descriptive narratives, and priority level indexing.
 */
class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Middleware auth:sanctum handles this
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ];
    }
}
