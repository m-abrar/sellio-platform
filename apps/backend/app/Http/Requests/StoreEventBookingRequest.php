<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreEventBookingRequest
 *
 * Handles validation for the initial ticket reservation draft.
 */
class StoreEventBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'event_occurrence_id' => 'required|exists:event_occurrences,id',
            'quantity'            => 'required|integer|min:1|max:10',
            'name'                => 'nullable|string|max:255',
            'email'               => 'nullable|email|max:255',
            'phone'               => 'nullable|string|max:20',
        ];
    }

    /**
     * Custom error messages for validation.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'event_occurrence_id.exists' => __('The selected event date is invalid.'),
            'quantity.min'               => __('You must select at least one ticket.'),
        ];
    }
}
