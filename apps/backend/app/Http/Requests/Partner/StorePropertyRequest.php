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
            // Core Identity
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'category_id'  => ['required', 'exists:categories,id'],
            'type_id'      => ['required', 'exists:types,id'],
            'location_id'  => ['required', 'exists:locations,id'],
            
            // Pricing (Standardized with Model)
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
            'address'   => ['required', 'string', 'max:255'],
            'city'      => ['required', 'string', 'max:100'],
            'state'     => ['nullable', 'string', 'max:100'],
            'country'   => ['required', 'string', 'max:100'],
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
            'is_featured'  => ['boolean'], // Validated but controlled in Service/Controller
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

    protected function prepareForValidation(): void
    {
        if ($this->has('title') && !$this->has('slug')) {
            $this->merge(['slug' => \Illuminate\Support\Str::slug($this->title)]);
        }
    }
}
