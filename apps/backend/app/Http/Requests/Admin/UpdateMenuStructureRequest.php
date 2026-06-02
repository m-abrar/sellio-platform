<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuStructureRequest extends FormRequest
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
            'menu_structure'      => ['nullable', 'string'],
            'new_items'           => ['nullable', 'array'],
            'new_items.*.title'   => ['required_with:new_items.*.url', 'string', 'max:255'],
            'new_items.*.url'     => ['required_with:new_items.*.title', 'string', 'max:255'],
            'new_items.*.module'  => ['nullable', 'string', 'in:properties,autos,products,services,jobs,events,classifieds,blogs'],
        ];
    }
}
