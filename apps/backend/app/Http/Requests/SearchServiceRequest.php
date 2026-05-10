<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchServiceRequest extends FormRequest
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
            'search'      => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'location'    => ['nullable', 'integer', 'exists:locations,id'],
            'type'        => ['nullable', 'integer', 'exists:types,id'],
            'expertise'   => ['nullable', 'integer', 'in:1,2,3,4'],
            'min_price'   => ['nullable', 'numeric', 'min:0'],
            'max_price'   => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'features'    => ['nullable', 'array'],
            'features.*'  => ['integer', 'exists:features,id'],
            'tags'        => ['nullable', 'array'],
            'tags.*'      => ['integer', 'exists:tags,id'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
