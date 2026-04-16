<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateBookingDetailsRequest
 *
 * Handles validation for updating attendee information during checkout.
 */
class UpdateBookingDetailsRequest extends FormRequest
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
            'user_name'  => 'required|string|max:255',
            'user_email' => 'required|email|max:255',
            'user_phone' => 'nullable|string|max:20',
        ];
    }
}
