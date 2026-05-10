<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SaveLineItemRequest extends FormRequest
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
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'amount'      => ['required', 'numeric'],
            'is_required' => ['boolean'],
            'applies_on'  => ['required', 'string'],
            'type'        => ['nullable', 'string', 'max:100'],
            'order'       => ['nullable', 'integer'],
            'status'      => ['nullable', 'in:active,inactive'],
        ];
    }
}
