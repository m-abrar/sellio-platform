<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
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
            'quantity'      => 'required|integer|min:1|max:100',
            'attribute_ids' => 'nullable|array',
            'attribute_ids.*' => 'exists:product_attributes,id',
            'addon_ids'     => 'nullable|array',
            'addon_ids.*' => 'exists:product_addons,id',
        ];
    }
}
