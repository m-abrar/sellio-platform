<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CalculatePriceRequest
 * Validates complex pricing parameters for marketplace items, coordinating
 * variation attributes, addon dependencies, and quantity-based scaling.
 */
class CalculatePriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to perform dynamic price calculations.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define the granular validation protocols for marketplace price estimation.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'attribute_ids'   => ['nullable', 'array'],
            'attribute_ids.*' => ['exists:product_attributes,id'],
            'addon_ids'       => ['nullable', 'array'],
            'addon_ids.*'     => ['exists:product_addons,id'],
            'quantity'        => ['nullable', 'integer', 'min:1'],
        ];
    }
}
