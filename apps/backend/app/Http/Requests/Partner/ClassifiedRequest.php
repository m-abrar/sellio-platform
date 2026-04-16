<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ClassifiedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $classifiedId = $this->route('classified')?->id;

        return [
            'category_id'     => ['required', 'exists:categories,id'],
            'location_id'     => ['nullable', 'exists:locations,id'],
            'title'            => ['required', 'string', 'max:150', Rule::unique('classifieds')->ignore($classifiedId)],
            'slug'            => ['nullable', 'string', 'max:150', 'alpha_dash', Rule::unique('classifieds')->ignore($classifiedId)],
            'description'     => ['required', 'string'],
            'base_price'      => ['required', 'numeric', 'min:0'],
            'sale_price'      => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_for_rent'     => ['boolean'],
            'is_for_sale'     => ['boolean'],
            'item_condition'  => ['nullable', 'string', 'in:New,Used,Refurbished'],
            'item_year_age'   => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'item_quantity'   => ['nullable', 'integer', 'min:1'],
            'city'            => ['required', 'string', 'max:100'],
            'country'         => ['required', 'string', 'max:100'],
            'is_published'    => ['boolean'],
        ];
    }
}
