<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreSubscriptionRequest
 * Validates the inbound subscription creation request,
 * ensuring the selected plan entity is valid and active.
 */
class StoreSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasAnyRole(['partner', 'admin', 'super-admin', 'user']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan_id' => ['required', 'exists:plans,id'],
        ];
    }
}
