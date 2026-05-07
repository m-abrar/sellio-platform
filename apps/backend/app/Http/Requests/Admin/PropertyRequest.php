<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class PropertyRequest
 * Orchestrates the complex administrative validation for real estate listings, coordinating
 * seasonal pricing, neighborhood metrics, amenity mapping, and spatial integrity.
 */
class PropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Implicit route parameter if editing
        $propertyId = $this->property ? $this->property->id : null;

        return [
            'title' => 'required|string|max:255|unique:properties,title,' . $propertyId,
            'slug' => 'nullable|string|max:255|unique:properties,slug,' . $propertyId . '|regex:/^[a-z0-9-]+$/',
            'description' => 'required|string',
            'base_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'price_per_night' => 'nullable|numeric|min:0',
            'hoa' => 'nullable|numeric|min:0',

            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_rental' => 'nullable|boolean',
            'is_sale' => 'nullable|boolean',

            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'types' => 'nullable|array',
            'types.*' => 'exists:types,id',
            'category_id' => 'nullable|exists:categories,id',
            'location_id' => 'nullable|exists:locations,id',
            
            'number_of_bedrooms' => 'nullable|integer|min:0',
            'number_of_bathrooms' => 'nullable|numeric|min:0',
            'number_of_parking_spots' => 'nullable|integer|min:0',
            'maximum_guests' => 'nullable|integer|min:0',
            'area_sq_ft' => 'nullable|numeric|min:0',
            'area_sq_m' => 'nullable|numeric|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),

            'address' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'required|string|max:100',
            'zip_code' => 'nullable|string|max:20',

            'seasonal_prices' => 'nullable|array',
            'seasonal_prices.*.name' => 'required|string|max:255',
            'seasonal_prices.*.start_date' => 'required|date',
            'seasonal_prices.*.end_date' => 'required|date|after_or_equal:seasonal_prices.*.start_date',
            'seasonal_prices.*.price' => 'required|numeric|min:0',

            'neighborhoods' => 'nullable|array',
            'neighborhoods.*.name' => 'required|string|max:255',
            'neighborhoods.*.distance' => 'required|numeric|min:0',
            'neighborhoods.*.latitude' => 'nullable|numeric',
            'neighborhoods.*.longitude' => 'nullable|numeric',
        ];
    }
}
