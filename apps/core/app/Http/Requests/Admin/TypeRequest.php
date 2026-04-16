<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $typeId = $this->type ? $this->type->id : null;

        return [
            'title'          => "required|string|max:255|unique:types,title,{$typeId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:types,slug,{$typeId}",
            'description'   => 'nullable|string',
            'icon'          => 'nullable|string|max:255',
            'is_published'  => 'nullable|boolean',
            'is_property'   => 'nullable|boolean',
            'is_event'      => 'nullable|boolean',
            'is_job'        => 'nullable|boolean',
            'is_auto'       => 'nullable|boolean',
            'is_service'    => 'nullable|boolean',
            'is_classified' => 'nullable|boolean',
        ];
    }
}
