<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
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
        $locationId = $this->location ? $this->location->id : null;

        return [
            'title'          => "required|string|max:255|unique:locations,title,{$locationId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:locations,slug,{$locationId}",
            'state'         => 'nullable|string|max:100',
            'country'       => 'required|string|max:100',
            'zip_code'      => 'nullable|string|max:20',
            'latitude'      => 'nullable|numeric|between:-90,90',
            'longitude'     => 'nullable|numeric|between:-180,180',
            'description'   => 'nullable|string',
            'image'         => 'nullable|string|max:255',
            'status'        => 'nullable|boolean',
            'is_property'   => 'nullable|boolean',
            'is_event'      => 'nullable|boolean',
            'is_job'        => 'nullable|boolean',
            'is_auto'       => 'nullable|boolean',
            'is_service'    => 'nullable|boolean',
            'is_classified' => 'nullable|boolean',
        ];
    }
}
