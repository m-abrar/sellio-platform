<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class JobListingRequest
 * Orchestrates the administrative validation for recruitment listings, managing 
 * compensation parameters, employment taxonomy, and temporal application constraints.
 */
class JobListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Admin has full access
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'                => ['required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', 'unique:job_listings,slug,' . (optional($this->route('job_listing'))->id)],
            'description'          => ['required', 'string'],
            'category_id'          => ['required', 'exists:categories,id'],
            'location_id'          => ['nullable', 'exists:locations,id'],
            'type_id'              => ['nullable', 'exists:types,id'],
            
            // Job Specifics
            'salary_min'           => ['nullable', 'numeric', 'min:0'],
            'salary_max'           => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'salary_frequency'     => ['nullable', 'string', 'in:hourly,daily,weekly,monthly,yearly'],
            'employment_type'      => ['nullable', 'string', 'in:full-time,part-time,contract,temporary,internship'],
            'experience_level'     => ['nullable', 'integer', 'in:1,2,3,4'],
            'workplace_type'       => ['nullable', 'integer', 'in:1,2,3'],
            'application_deadline' => ['nullable', 'date', 'after_or_equal:today'],
            'city'                 => ['nullable', 'string', 'max:100'],
            'country'              => ['nullable', 'string', 'max:100'],

            // Status
            'is_published'         => ['boolean'],
            'is_featured'          => ['boolean'],
            'is_contract'          => ['boolean'],
            'is_full_time'         => ['boolean'],
        ];
    }
}
