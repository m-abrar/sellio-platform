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
            'hoa'             => ['nullable', 'numeric', 'min:0'],
            'is_rental'       => ['boolean'],
            'is_sale'         => ['boolean'],

            // Physical Specs
            'total_units'             => ['nullable', 'integer', 'min:1'],
            'number_of_bedrooms'      => ['nullable', 'integer', 'min:0'],
            'number_of_bathrooms'     => ['nullable', 'integer', 'min:0'],
            'maximum_guests'          => ['nullable', 'integer', 'min:1'],
            'area_sq_ft'              => ['nullable', 'numeric', 'min:0'],
            'number_of_parking_spots' => ['nullable', 'string', 'max:255'],
            'year_built'              => ['nullable', 'integer', 'min:1800', 'max:' . (date('Y') + 5)],

            // Rental Constraints
            'minimum_rental_days'     => ['nullable', 'integer', 'min:1'],
            'maximum_rental_days'     => ['nullable', 'integer', 'min:1'],

            // Location
            'address'   => ['sometimes', 'required', 'string', 'max:255'],
            'city'      => ['sometimes', 'required', 'string', 'max:100'],
            'state'     => ['nullable', 'string', 'max:100'],
            'country'   => ['sometimes', 'required', 'string', 'max:100'],
            'zip_code'  => ['nullable', 'string', 'max:20'],
            'latitude'  => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            // Rich Media & Tours
            'video'        => ['nullable', 'string'],
            'virtual_tour' => ['nullable', 'string'],

            // Rules & Policies
            'rules'    => ['nullable', 'string'],
            'policies' => ['nullable', 'string'],

            // Taxonomy & Status
            'amenities'    => ['nullable', 'array'],
            'amenities.*'  => ['exists:amenities,id'],
            'is_published' => ['boolean'],
            'is_featured'  => ['boolean'],
        ];
    }
}
