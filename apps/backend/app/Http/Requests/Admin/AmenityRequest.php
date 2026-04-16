<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AmenityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $amenityId = $this->amenity ? $this->amenity->id : null;

        return [
            'title'          => "required|string|max:255|unique:amenities,title,{$amenityId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:amenities,slug,{$amenityId}",
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
