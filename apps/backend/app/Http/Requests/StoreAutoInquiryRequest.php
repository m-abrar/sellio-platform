<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreAutoInquiryRequest
 * Orchestrates the validation logic for automotive purchase and trial inquiries, 
 * coordinating vehicle availability, scheduling preferences, and prospect metadata.
 */
class StoreAutoInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to submit vehicle-specific inquiries.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define the data integrity rules for automotive lead capture.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'auto_id'        => ['required', 'integer', 'exists:autos,id'],
            'preferred_date' => ['required', 'date', 'after:today'], 
            'preferred_time' => ['required', 'string', 'in:AM,PM,Anytime'],
            'full_name'      => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:20'],
            'message'        => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Optional: Custom error messages for the date validation
     */
    /**
     * Define localized error messages for inquiry-specific validation failures.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'preferred_date.after' => 'The inquiry date must be a date in the future.',
        ];
    }
}
