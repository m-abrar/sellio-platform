<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchClassifiedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search'   => 'nullable|string|max:255',
            'category' => 'nullable|string|exists:categories,slug',
            'location' => 'nullable|string|exists:locations,slug',
            'type'     => 'nullable|string|exists:types,slug',
            'tag'      => 'nullable|string|exists:tags,slug',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'sort'     => 'nullable|string|in:latest,oldest,price_low,price_high',
        ];
    }
}
