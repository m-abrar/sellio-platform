<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculatePriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attribute_ids' => ['nullable', 'array'],
            'addon_ids'     => ['nullable', 'array'],
            'quantity'      => ['nullable', 'integer', 'min:1'],
        ];
    }
}
