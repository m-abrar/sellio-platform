<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPropertyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'q'             => ['nullable', 'string', 'max:255'],
            'category'      => ['nullable', 'integer'],
            'location'      => ['nullable', 'integer'],
            'bedrooms'      => ['nullable', 'integer', 'min:0'],
            'bathrooms'     => ['nullable', 'integer', 'min:0'],
            'guests'        => ['nullable', 'integer', 'min:0'],
            'property_type' => ['nullable', 'string', 'in:rental,sale'],
            'max_price'     => ['nullable', 'numeric'],
            'check_in'      => ['nullable', 'date_format:m-d-Y'],
            'check_out'     => ['nullable', 'date_format:m-d-Y', 'after:check_in'],
            'amenities'     => ['nullable', 'array'],
            'amenities.*'   => ['integer'],
            'tags'          => ['nullable', 'array'],
            'tags.*'        => ['integer'],
        ];
    }
}
