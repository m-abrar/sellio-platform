<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CategoryRequest
 * Manages the administrative validation protocols for the platform's categorical 
 * hierarchy, coordinating multi-module assignments and tree-structure integrity.
 */
class CategoryRequest extends FormRequest
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
        $categoryId = $this->category ? $this->category->id : null;

        return [
            'title'         => "required|string|max:255|unique:categories,title,{$categoryId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:categories,slug,{$categoryId}",
            'parent_id'     => 'nullable|exists:categories,id',
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
