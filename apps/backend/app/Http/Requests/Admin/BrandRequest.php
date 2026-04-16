<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BrandRequest extends FormRequest
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
        $brandId = $this->brand ? $this->brand->id : null;

        return [
            'title'          => "required|string|max:255|unique:brands,title,{$brandId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:brands,slug,{$brandId}",
            'description'   => 'nullable|string',
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
