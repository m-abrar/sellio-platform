<?php

namespace App\Http\Requests\Partner;

use App\Models\Event;
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
            $eventId = $event instanceof Event ? $event->id : $event;

            return Event::where('id', $eventId)
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
            'type_id'           => ['nullable', 'exists:types,id'],
            'brand_id'          => ['nullable', 'exists:brands,id'],
            'location_id'       => ['nullable', 'exists:locations,id'],
            'base_price'        => ['required', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_paid'           => ['boolean'],
            'is_published'      => ['boolean'],
            
            // Scheduling & Virtual Options
            'is_virtual'        => ['boolean'],
            'virtual_link'      => ['nullable', 'string', 'max:255'],

            // Address & Coordinates
            'address'           => ['nullable', 'string', 'max:255'],
            'city'              => ['nullable', 'string', 'max:100'],
            'state'             => ['nullable', 'string', 'max:100'],
            'country'           => ['nullable', 'string', 'max:100'],
            'zip_code'          => ['nullable', 'string', 'max:20'],
            'latitude'          => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'         => ['nullable', 'numeric', 'between:-180,180'],

            // Specs
            'event_genre'       => ['nullable', 'string', 'max:100'],
            'venue_size'        => ['nullable', 'numeric', 'min:0'],

            // Organizer Contacts
            'organizer_name'    => ['nullable', 'string', 'max:255'],
            'organizer_email'   => ['nullable', 'email', 'max:255'],
            'organizer_phone'   => ['nullable', 'string', 'max:50'],

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

            'tags'              => ['nullable', 'array'],
            'tags.*'            => ['string', 'max:50'],

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

        if (is_string($this->input('tags'))) {
            $this->merge(['tags' => json_decode($this->input('tags'), true) ?? []]);
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
