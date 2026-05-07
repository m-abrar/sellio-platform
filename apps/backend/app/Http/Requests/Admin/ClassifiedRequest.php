<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ClassifiedRequest
 * Encapsulates the administrative validation logic for classified marketplace listings,
 * managing item lifecycle, transactional status, and multi-entity relationship integrity.
 */
class ClassifiedRequest extends FormRequest
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
            'slug'             => ['nullable', 'string', 'max:255', 'unique:classifieds,slug,' . (optional($this->route('classified'))->id)],
            'description'      => ['required', 'string'],
            'category_id'      => ['required', 'exists:categories,id'],
            'location_id'      => ['nullable', 'exists:locations,id'],
            'brand_id'         => ['nullable', 'exists:brands,id'],
            'type_id'          => ['nullable', 'exists:types,id'],
            
            // Classified Specifics
            'item_condition'   => ['nullable', 'string'],
            'item_year_age'    => ['nullable', 'integer', 'min:1900'],
            'item_quantity'    => ['nullable', 'integer', 'min:1'],
            'item_dimensions'  => ['nullable', 'string', 'max:100'],
            'warranty_months'  => ['nullable', 'integer', 'min:0'],
            'address'          => ['nullable', 'string', 'max:255'],

            // Pricing
            'base_price'       => ['required', 'numeric', 'min:0'],
            'sale_price'       => ['nullable', 'numeric', 'min:0', 'lt:base_price'],

            // Status
            'is_published'     => ['boolean'],
            'is_featured'      => ['boolean'],
            'is_for_rent'      => ['boolean'],
            'is_for_sale'      => ['boolean'],
        ];
    }
}
