<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchAutoRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'category'     => 'nullable|integer',
            'make'         => 'nullable|string',
            'model'        => 'nullable|string',
            'location'     => 'nullable|integer',
            'price_min'    => 'nullable|numeric|min:0',
            'price_max'    => 'nullable|numeric|min:0',
            'year_min'     => 'nullable|integer',
            'year_max'     => 'nullable|integer',
            'transmission' => 'nullable|string',
            'type'         => 'nullable|string|in:selling,lease',
            'tags'         => 'nullable|array',
            'tags.*'       => 'integer',
        ];
    }
}
