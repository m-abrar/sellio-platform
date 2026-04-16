<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensuring only logged-in users can request quotes
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'service_id'         => 'required|exists:services,id',
            'service_package_id' => 'required|exists:service_packages,id',
            'target_date'        => 'required|date|after_or_equal:today',
            'scope_size'         => 'required|numeric|min:1',
            'notes'              => 'nullable|string|max:1000',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'service_package_id.required' => __('Please select a service package to receive an accurate quote.'),
            'target_date.required'        => __('Please specify when you would like this project to start.'),
            'target_date.after_or_equal'  => __('The start date cannot be in the past.'),
            'scope_size.required'         => __('Please provide the estimated size or scale of your project.'),
            'scope_size.min'              => __('Project scale must be at least 1 unit.'),
        ];
    }
}
