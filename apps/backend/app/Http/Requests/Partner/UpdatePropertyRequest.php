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
            'brand_id'           => ['nullable', 'exists:brands,id'],
            'amenities'          => ['nullable', 'array'],
            'amenities.*'        => ['exists:amenities,id'],
            'tags'               => ['nullable', 'array'],
            'tags.*'             => ['string', 'max:50'],
            'features'           => ['nullable', 'array'],
            'features.*'         => ['exists:features,id'],
            'is_published'       => ['boolean'],
            'is_featured'        => ['boolean'],

            // Neighborhood POIs
            'neighborhoods'      => ['nullable', 'array'],
            'neighborhoods.*.title' => ['required_with:neighborhoods', 'string', 'max:255'],
            'neighborhoods.*.description' => ['nullable', 'string'],
            'neighborhoods.*.distance_miles' => ['required_with:neighborhoods', 'numeric', 'min:0'],
            
            // Seasonal Rental Prices
            'seasonal_prices'    => ['nullable', 'array'],
            'seasonal_prices.*.season_name' => ['required_with:seasonal_prices', 'string', 'max:255'],
            'seasonal_prices.*.start_date'  => ['required_with:seasonal_prices', 'date'],
            'seasonal_prices.*.end_date'    => ['required_with:seasonal_prices', 'date', 'after_or_equal:seasonal_prices.*.start_date'],
            'seasonal_prices.*.price'       => ['required_with:seasonal_prices', 'numeric', 'min:0'],
            
            // Property Addons
            'addons'             => ['nullable', 'array'],
            'addons.*.title'     => ['required_with:addons', 'string', 'max:255'],
            'addons.*.description' => ['nullable', 'string'],
            'addons.*.price'     => ['required_with:addons', 'numeric', 'min:0'],
            
            // Property Fees
            'fees'               => ['nullable', 'array'],
            'fees.*.title'       => ['required_with:fees', 'string', 'max:255'],
            'fees.*.amount'      => ['required_with:fees', 'numeric', 'min:0'],
            'fees.*.type'        => ['required_with:fees', 'string', 'in:fixed,percentage'],
            'fees.*.rate'        => ['nullable', 'numeric', 'min:0'],
            'fees.*.charge_type' => ['required_with:fees', 'string', 'in:per_stay,per_night,per_guest'],

            // Livability Scores
            'scores'             => ['nullable', 'array'],
            'scores.*.title'     => ['required_with:scores', 'string', 'max:100'],
            'scores.*.score'     => ['required_with:scores', 'numeric', 'min:0'],
            'scores.*.units'     => ['nullable', 'string', 'max:20'],
            'scores.*.description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
