<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Role;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $superAdminRole = Role::where('name', 'super-admin')->first();
            
            if ($superAdminRole && in_array($superAdminRole->id, $this->roles ?? [])) {
                if (!auth()->user()->hasRole('super-admin')) {
                    $validator->errors()->add('roles', __('You are not allowed to assign the Super Admin role.'));
                }
            }
        });
    }
}
