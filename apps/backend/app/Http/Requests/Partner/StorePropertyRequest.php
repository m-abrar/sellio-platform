<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class StorePropertyRequest
 * Validates the data for creating a new property listing.
 */
class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Only authenticated users can submit this form
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'price'        => ['required', 'numeric', 'min:0'],
            'address'      => ['required', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'is_featured'  => ['boolean'],
            'amenities'    => ['nullable', 'array'],
            'amenities.*'  => ['exists:amenities,id'],
            // Add other migration-specific fields here (e.g., bedrooms, bathrooms)
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'is_featured' => __('Featured Status'),
            'amenities'   => __('Property Amenities'),
        ];
    }
}
