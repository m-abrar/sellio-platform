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
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $event = $this->route('event');
        if ($event) {
            $eventId = $event instanceof \App\Models\Event ? $event->id : $event;

            return \App\Models\Event::where('id', $eventId)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['required', 'string'],
            'category_id'       => ['required', 'exists:categories,id'],
            'base_price'        => ['required', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_paid'           => ['boolean'],
            'is_published'      => ['boolean'],
            'is_virtual'        => ['boolean'],
            'city'              => ['nullable', 'string', 'max:100'],
            'state'             => ['nullable', 'string', 'max:100'],
            'country'           => ['nullable', 'string', 'max:100'],
            'address'           => ['nullable', 'string', 'max:255'],
            'organizer_name'    => ['nullable', 'string', 'max:255'],

            'tickets'           => ['required', 'array', 'min:1'],
            'tickets.*.id'      => ['required', 'string'],
            'tickets.*.title'   => ['required', 'string', 'max:100'],
            'tickets.*.base_price' => ['required', 'numeric', 'min:0'],

            'occurrences'       => ['required', 'array', 'min:1'],
            'occurrences.*.id'  => ['required', 'string'],
            'occurrences.*.start_date_time' => ['required', 'date'],
            'occurrences.*.duration_hours'  => ['required', 'numeric', 'min:0.5'],
            'occurrences.*.max_attendees'   => ['nullable', 'integer', 'min:0'],
            'occurrences.*.venue_details'   => ['nullable', 'string', 'max:500'],
            'occurrences.*.inventory' => ['required', 'array'],
            'occurrences.*.inventory.*.available_quantity' => ['required', 'integer', 'min:0'],
            'occurrences.*.inventory.*.override_price'     => ['nullable', 'numeric', 'min:0'],

            'main_image'        => ['nullable', 'image', 'max:5120'],
            'gallery.*'         => ['nullable', 'image', 'max:5120'],
            'existing_media_ids' => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('tickets'))) {
            $this->merge(['tickets' => json_decode($this->input('tickets'), true) ?? []]);
        }

        if (is_string($this->input('occurrences'))) {
            $this->merge(['occurrences' => json_decode($this->input('occurrences'), true) ?? []]);
        }

        $this->merge([
            'is_paid'      => filter_var($this->input('is_paid', false), FILTER_VALIDATE_BOOLEAN),
            'is_published' => filter_var($this->input('is_published', false), FILTER_VALIDATE_BOOLEAN),
            'is_virtual'   => filter_var($this->input('is_virtual', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function attributes(): array
    {
        return [
            'tickets.*.title' => __('Ticket Name'),
            'occurrences.*.start_date_time' => __('Start Date'),
            'occurrences.*.inventory.*.available_quantity' => __('Ticket Quantity'),
        ];
    }
}
