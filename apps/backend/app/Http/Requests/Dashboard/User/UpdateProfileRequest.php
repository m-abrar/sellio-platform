<?php

namespace App\Http\Requests\Dashboard\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        
        return [
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone'       => ['nullable', 'string', 'max:20'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'preferences' => ['nullable', 'array'],
            'settings'    => ['nullable', 'array'],
        ];
    }
}
