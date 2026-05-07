<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class EventRequest
 * Manages the administrative validation protocols for platform events, coordinating
 * temporal scheduling, attendance constraints, and multi-entity relationship mapping.
 */
class EventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Admin has full access
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'             => ['required', 'string', 'max:255'],
            'slug'              => ['nullable', 'string', 'max:255', 'unique:events,slug,' . (optional($this->route('event'))->id)],
            'description'       => ['required', 'string'],
            'category_id'       => ['required', 'exists:categories,id'],
            'location_id'       => ['nullable', 'exists:locations,id'],
            'brand_id'          => ['nullable', 'exists:brands,id'],
            'type_id'           => ['nullable', 'exists:types,id'],
            
            // Event Specifics
            'start_date_time'   => ['required', 'date'],
            'end_date_time'     => ['required', 'date', 'after_or_equal:start_date_time'],
            'is_paid'           => ['boolean'],
            'max_attendees'     => ['nullable', 'integer', 'min:0'],
            'address'           => ['nullable', 'string', 'max:255'],
            
            // Pricing
            'base_price'        => ['required', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0', 'lt:base_price'],

            // Status
            'is_published'      => ['boolean'],
            'is_featured'       => ['boolean'],
        ];
    }
}
