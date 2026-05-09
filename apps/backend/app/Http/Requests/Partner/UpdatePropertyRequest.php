<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class UpdatePropertyRequest
 * Validates the data for updating an existing property listing.
 */
class UpdatePropertyRequest extends FormRequest
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

        // If updating, verify the user owns the property
        $property = $this->route('property');
        if ($property instanceof \App\Models\Property) {
            return $property->user_id === Auth::id();
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
            'title'        => ['sometimes', 'required', 'string', 'max:255'],
            'description'  => ['sometimes', 'required', 'string'],
            'price'        => ['sometimes', 'required', 'numeric', 'min:0'],
            'address'      => ['sometimes', 'required', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'is_featured'  => ['boolean'],
            'amenities'    => ['nullable', 'array'],
            'amenities.*'  => ['exists:amenities,id'],
        ];
    }
}
