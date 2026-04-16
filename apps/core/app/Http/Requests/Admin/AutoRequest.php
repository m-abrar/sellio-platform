<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AutoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Admin has full access
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'slug'             => ['nullable', 'string', 'max:255', 'unique:autos,slug,' . (optional($this->route('auto'))->id)],
            'description'      => ['required', 'string'],
            'category_id'      => ['required', 'exists:categories,id'],
            'brand_id'         => ['nullable', 'exists:brands,id'],
            'type_id'          => ['nullable', 'exists:types,id'],
            'location_id'      => ['nullable', 'exists:locations,id'],
            'base_price'       => ['required', 'numeric', 'min:0'],
            'sale_price'       => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            
            // Auto Specifics
            'year'             => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'make'             => ['required', 'string', 'max:255'],
            'model'            => ['required', 'string', 'max:255'],
            'engine_type'      => ['required', 'string'],
            'transmission'     => ['required', 'string'],
            'fuel_economy'     => ['required', 'string'],
            'drivetrain'       => ['required', 'string'],
            'exterior_color'   => ['required', 'string'],
            'mileage_value'    => ['required', 'integer', 'min:0'],
            'mileage_units'    => ['required', 'string', 'in:km,mi'],
            'condition_rating' => ['nullable', 'integer', 'min:1', 'max:10'],
            'vin_number'       => ['nullable', 'string', 'max:50'],
            'warranty_months'  => ['nullable', 'integer', 'min:0'],
            'stock_quantity'   => ['required', 'integer', 'min:1'],

            // Address
            'address'          => ['nullable', 'string', 'max:255'],
            'city'             => ['required', 'string', 'max:100'],
            'state'            => ['nullable', 'string', 'max:100'],
            'country'          => ['required', 'string', 'max:100'],
            'zip_code'         => ['nullable', 'string', 'max:20'],

            // Status
            'is_published'     => ['boolean'],
            'is_lease'         => ['boolean'],
            'is_selling'       => ['boolean'],
            'is_featured'      => ['boolean'],
        ];
    }
}
