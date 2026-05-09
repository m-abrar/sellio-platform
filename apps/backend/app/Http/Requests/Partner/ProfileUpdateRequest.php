<?php

namespace App\Http\Requests\Partner;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('partner');
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'company_name'  => ['nullable', 'string', 'max:255'],
            'website_url'   => ['nullable', 'url', 'max:255'],
            'bio'           => ['nullable', 'string', 'max:1000'],
            'phone_number'  => ['nullable', 'string', 'max:20'],
            'password'      => ['nullable', 'confirmed', 'min:8'],
            'social_links'  => ['nullable', 'array'],
            'social_links.*'=> ['nullable', 'url'],
        ];
    }
}
