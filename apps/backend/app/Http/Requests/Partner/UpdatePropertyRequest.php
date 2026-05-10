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
        if ($property) {
            $propertyId = $property instanceof \App\Models\Property ? $property->id : $property;
            return \App\Models\Property::where('id', $propertyId)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * Hardened for production with strict typed validation.
     */
    public function rules(): array
    {
        return [
            // Core Identity
            'title'        => ['sometimes', 'required', 'string', 'max:255'],
            'description'  => ['sometimes', 'required', 'string'],
            'category_id'  => ['sometimes', 'required', 'exists:categories,id'],
            'type_id'      => ['sometimes', 'required', 'exists:types,id'],
            'location_id'  => ['sometimes', 'required', 'exists:locations,id'],
            
            // Pricing
            'base_price'      => ['nullable', 'numeric', 'min:0'],
            'sale_price'      => ['nullable', 'numeric', 'min:0'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'is_rental'       => ['boolean'],
            'is_sale'         => ['boolean'],

            // Physical Specs
            'number_of_bedrooms'  => ['nullable', 'integer', 'min:0'],
            'number_of_bathrooms' => ['nullable', 'integer', 'min:0'],
            'maximum_guests'      => ['nullable', 'integer', 'min:1'],
            'area_sq_ft'          => ['nullable', 'numeric', 'min:0'],
            'year_built'          => ['nullable', 'integer', 'min:1800', 'max:' . (date('Y') + 5)],

            // Location
            'address'  => ['sometimes', 'required', 'string', 'max:255'],
            'city'     => ['sometimes', 'required', 'string', 'max:100'],
            'country'  => ['sometimes', 'required', 'string', 'max:100'],
            'zip_code' => ['nullable', 'string', 'max:20'],

            // Taxonomy & Status
            'amenities'    => ['nullable', 'array'],
            'amenities.*'  => ['exists:amenities,id'],
            'is_published' => ['boolean'],
            'is_featured'  => ['boolean'],
        ];
    }
}
