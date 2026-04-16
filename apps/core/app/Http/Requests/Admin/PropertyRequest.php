<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'name' => 'required|string|max:255|unique:properties,name,' . $propertyId,
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric|min:0',

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
            'minimum_stay' => 'nullable|numeric|min:1',
            'maximum_guests' => 'nullable|numeric|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'garages' => 'nullable|integer|min:0',
            'area' => 'nullable|numeric|min:0',

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
