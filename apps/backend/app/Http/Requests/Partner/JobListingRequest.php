<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class JobListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // If updating, verify the user owns the job listing
        $jobListing = $this->route('joblisting');
        if ($jobListing) {
            $jobListingId = $jobListing instanceof \App\Models\JobListing ? $jobListing->id : $jobListing;
            return \App\Models\JobListing::where('id', $jobListingId)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return true;
    }

    public function rules(): array
    {
        $jobId = $this->route('joblisting')?->id;

        return [
            'category_id'          => ['required', 'exists:categories,id'],
            'location_id'          => ['required', 'exists:locations,id'],
            'name'                 => ['required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', Rule::unique('joblistings')->ignore($jobId)],
            'description'          => ['required', 'string'],
            'salary_min'           => ['nullable', 'numeric', 'min:0'],
            'salary_max'           => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'salary_frequency'     => ['nullable', 'string', 'max:50'],
            'employment_type'      => ['required', 'string', 'max:50'],
            'experience_level'     => ['required', 'string', 'max:50'],
            'workplace_type'       => ['required', 'string', 'max:50'],
            'application_deadline' => ['nullable', 'date', 'after_or_equal:today'],
            'city'                 => ['required', 'string', 'max:100'],
            'country'              => ['required', 'string', 'max:100'],
            'is_published'         => ['boolean'],
            'is_contract'          => ['boolean'],
            'is_full_time'         => ['boolean'],
        ];
    }
}
