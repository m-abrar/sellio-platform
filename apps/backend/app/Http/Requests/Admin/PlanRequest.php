<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('super-admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'                  => 'required|string|max:60',
            'description'            => 'nullable|string|max:500',
            'label_text'             => 'nullable|string|max:50',
            'price'                  => 'required|numeric|min:0',
            'billing_period'         => 'required|in:monthly,annually', 
            'max_listings'           => 'nullable|integer|min:0', 
            'max_featured_listings'  => 'nullable|integer|min:0',
            'max_addons'             => 'nullable|integer|min:0',
            'listing_duration'       => 'required|integer|min:1',
            'analytics_access'       => 'required|in:none,basic,advanced', 
            'is_active'              => 'sometimes|boolean', 
            'is_featured'            => 'sometimes|boolean',
            'is_popular'             => 'sometimes|boolean',
            'priority_support'       => 'sometimes|boolean',
            'custom_branding'        => 'sometimes|boolean',
        ];
    }
}
