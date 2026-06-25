<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SearchProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Publicly accessible search
    }

    /**
     * Get the validation rules that apply to the request.
     * Aligned with ProductService filters ('q', 'category', 'brand').
     */
    public function rules(): array
    {
        return [
            // Keyword search (Renamed to 'q' to match ProductService and standard URL patterns)
            'q'            => ['nullable', 'string', 'max:100'],
            
            // Taxonomy Filters
            'category'     => ['nullable', 'integer', 'exists:categories,id'],
            'brand'        => ['nullable', 'integer', 'exists:brands,id'],
            'type'         => ['nullable', 'integer', 'exists:types,id'],
            'location'     => ['nullable', 'integer', 'exists:locations,id'],
            
            // Pricing filters
            'min_price'    => ['nullable', 'numeric', 'min:0'],
            'max_price'    => ['nullable', 'numeric', Rule::when($this->filled('min_price'), 'gte:min_price')],
            
            // Availability toggles
            'on_sale'      => ['nullable', 'boolean'],
            'in_stock'     => ['nullable', 'boolean'],

            // Sorting and UI Configuration
            'sort_by'      => ['nullable', 'string', 'in:latest,price_low,price_high,rating'],
            'per_page'     => ['nullable', 'integer', 'min:1', 'max:100'],
            'themeVariant' => ['nullable', 'string', 'alpha_dash'], // Alpha dash for security
            
            // View Mode (Grid vs List)
            'view'         => ['nullable', 'string', 'in:grid,list'],
        ];
    }

    /**
     * Prepare the data for validation.
     * Normalizes inputs to prevent empty strings from breaking queries.
     */
    protected function prepareForValidation(): void
    {
        // Convert 'keyword' to 'q' if user passed 'keyword' in the URL for backwards compatibility
        if ($this->has('keyword') && !$this->has('q')) {
            $this->merge(['q' => $this->keyword]);
        }

        $this->merge([
            'q'         => $this->q ? strip_tags(trim($this->q)) : null,
            'min_price' => $this->filled('min_price') ? (float) $this->min_price : null,
            'max_price' => $this->filled('max_price') ? (float) $this->max_price : null,
        ]);
    }

    /**
     * Custom error messages for a better UX.
     */
    public function messages(): array
    {
        return [
            'max_price.gte' => __('The maximum price must be greater than or equal to the minimum price.'),
            'q.max'         => __('Search term is too long.'),
        ];
    }
}
