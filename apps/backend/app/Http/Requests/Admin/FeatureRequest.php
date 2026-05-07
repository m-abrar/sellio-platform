<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class FeatureRequest
 * Orchestrates the administrative validation for platform-wide features/attributes, 
 * managing cross-module identity (Property, Auto, Job, etc.) and uniqueness constraints.
 */
class FeatureRequest extends FormRequest
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
        $featureId = $this->feature ? $this->feature->id : null;

        return [
            'title'          => "required|string|max:255|unique:features,title,{$featureId}",
            'slug'          => "nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:features,slug,{$featureId}",
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
