<?php

namespace App\Http\Requests\Dashboard\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdatePropertyBookingRequest
 *
 * Orchestrates administrative validation for property reservation records, 
 * enforcing strict data integrity for date ranges and customer details.
 */
class UpdatePropertyBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Administrative access is globally enforced via routing middleware.
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
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'property_id'    => ['required', 'exists:properties,id'],
            'user_id'        => ['nullable', 'exists:users,id'],
            'check_in_date'  => ['required', 'date'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'guests'         => ['required', 'integer', 'min:1'],
            'full_name'      => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:255'],
            'status'         => ['required', 'string', 'in:pending,confirmed,cancelled,completed'],
            'message'        => ['nullable', 'string'],
        ];
    }
}
