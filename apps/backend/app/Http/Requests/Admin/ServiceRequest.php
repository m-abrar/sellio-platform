<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ServiceRequest
 * Orchestrates the administrative validation for professional service offerings, managing
 * expertise metrics, operational constraints, and transactional billing models.
 */
class ServiceRequest extends FormRequest
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
            'title'               => ['required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', 'max:255', 'unique:services,slug,' . (optional($this->route('service'))->id)],
            'description'         => ['required', 'string'],
            'category_id'         => ['required', 'exists:categories,id'],
            'location_id'         => ['nullable', 'exists:locations,id'],
            'brand_id'            => ['nullable', 'exists:brands,id'],
            'type_id'             => ['nullable', 'exists:types,id'],
            
            // Service Specifics
            'operating_hours'     => ['nullable', 'string', 'max:100'],
            'operating_days_label'=> ['nullable', 'string', 'max:100'],
            'expertise_level'     => ['nullable', 'integer', 'min:1', 'max:5'],
            'service_radius'      => ['nullable', 'numeric', 'min:0'],
            'min_contract_months' => ['nullable', 'integer', 'min:0'],
            'max_client_slots'    => ['nullable', 'integer', 'min:0'],
            'address'             => ['nullable', 'string', 'max:255'],

            // Pricing
            'base_price'          => ['required', 'numeric', 'min:0'],
            'sale_price'          => ['nullable', 'numeric', 'min:0', 'lt:base_price'],

            // Status
            'is_published'        => ['boolean'],
            'is_featured'         => ['boolean'],
            'is_subscription'     => ['boolean'],
            'is_project_based'    => ['boolean'],
        ];
    }
}
