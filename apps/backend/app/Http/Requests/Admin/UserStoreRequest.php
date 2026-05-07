<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UserStoreRequest
 * Orchestrates the administrative validation for user account creation and modification,
 * enforcing identity uniqueness, credential complexity, and role assignment authorization.
 */
class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the administrator is authorized to manipulate user identity records.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Define the granular validation protocols for user account integrity.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $userId = $this->user ? $this->user->id : null;

        return [
            'name'     => 'required|string|max:255',
            'email'    => "required|email|unique:users,email,{$userId}",
            'password' => $userId ? 'nullable|string|min:8|confirmed' : 'required|string|min:8|confirmed',
            'roles'    => 'required|array'
        ];
    }

}
