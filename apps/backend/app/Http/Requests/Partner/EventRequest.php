<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class EventRequest
 * Handles complex validation for events, ticket types, and occurrences.
 */
class EventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // If updating, verify the user owns the event
        $event = $this->route('event');
        if ($event instanceof \App\Models\Event) {
            return $event->user_id === Auth::id();
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Base Event Data
            'title'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'category_id'      => ['required', 'exists:categories,id'],
            'base_price'       => ['required', 'numeric', 'min:0'],
            'sale_price'       => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_paid'          => ['boolean'],
            'is_published'     => ['boolean'],
            'is_virtual'       => ['boolean'],

            // Ticket Types Validation
            'tickets'          => ['required', 'array', 'min:1'],
            'tickets.*.id'     => ['required', 'string'], // Handles 'NEW_...' or numeric IDs
            'tickets.*.title'   => ['required', 'string', 'max:100'],
            'tickets.*.base_price' => ['required', 'numeric', 'min:0'],

            // Occurrences Validation
            'occurrences'      => ['required', 'array', 'min:1'],
            'occurrences.*.id' => ['required', 'string'],
            'occurrences.*.start_date_time' => ['required', 'date', 'after_or_equal:today'],
            'occurrences.*.duration_hours'  => ['required', 'numeric', 'min:0.5'],
            'occurrences.*.max_attendees'   => ['nullable', 'integer', 'min:0'],
            'occurrences.*.venue_details'   => ['nullable', 'string', 'max:500'],

            // Occurrence Inventory (Inventory is keyed by the Ticket ID)
            'occurrences.*.inventory' => ['required', 'array'],
            'occurrences.*.inventory.*.available_quantity' => ['required', 'integer', 'min:0'],
            'occurrences.*.inventory.*.override_price'     => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_paid'      => $this->has('is_paid'),
            'is_published' => $this->has('is_published'),
            'is_virtual'   => $this->has('is_virtual'),
        ]);
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'tickets.*.title' => __('Ticket Name'),
            'occurrences.*.start_date_time' => __('Start Date'),
            'occurrences.*.inventory.*.available_quantity' => __('Ticket Quantity'),
        ];
    }
}
