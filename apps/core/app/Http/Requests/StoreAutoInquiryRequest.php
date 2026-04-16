<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAutoInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
    public function messages(): array
    {
        return [
            'preferred_date.after' => 'The inquiry date must be a date in the future.',
        ];
    }
}
