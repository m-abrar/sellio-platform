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
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'amount'      => ['required', 'numeric'],
            'applies_on'  => ['required', 'string', 'in:booking,service,item'],
            'type'        => ['nullable', 'string', 'in:fixed,percentage'],
            'order'       => ['nullable', 'integer'],
            'status'      => ['nullable', 'in:active,inactive'],
        ];
    }
}
