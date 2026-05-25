<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class JobListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

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
        $job = $this->route('joblisting');
        $jobId = $job instanceof \App\Models\JobListing ? $job->id : $job;

        return [
            'category_id'          => ['required', 'exists:categories,id'],
            'location_id'          => ['nullable', 'exists:locations,id'],
            'type_id'              => ['nullable', 'exists:types,id'],
            'title'                => ['required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', Rule::unique('joblistings')->ignore($jobId)],
            'description'          => ['required', 'string'],
            'salary_min'           => ['nullable', 'numeric', 'min:0'],
            'salary_max'           => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'salary_frequency'     => ['nullable', 'string', 'max:50'],
            'experience_level'     => ['nullable', 'integer', 'min:1', 'max:5'],
            'workplace_type'       => ['nullable', 'integer', 'min:1', 'max:3'],
            'required_education'   => ['nullable', 'string', 'max:255'],
            'meta_title'           => ['nullable', 'string', 'max:255'],
            'application_deadline' => ['nullable', 'date'],
            'city'                 => ['nullable', 'string', 'max:100'],
            'state'                => ['nullable', 'string', 'max:100'],
            'country'              => ['nullable', 'string', 'max:100'],
            'address'              => ['nullable', 'string', 'max:255'],
            'is_published'         => ['boolean'],
            'is_featured'          => ['boolean'],
            'is_contract'          => ['boolean'],
            'is_full_time'         => ['boolean'],
            'main_image'           => ['nullable', 'image', 'max:5120'],
            'gallery.*'            => ['nullable', 'image', 'max:5120'],
            'existing_media_ids'   => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && !$this->filled('title')) {
            $this->merge(['title' => $this->input('name')]);
        }

        if (is_string($this->input('experience_level')) && !is_numeric($this->input('experience_level'))) {
            $map = [
                'entry'     => 1,
                'mid'       => 2,
                'senior'    => 3,
                'lead'      => 4,
                'executive' => 4,
            ];
            $this->merge([
                'experience_level' => $map[strtolower($this->input('experience_level'))] ?? 2,
            ]);
        }

        $this->merge([
            'is_published'  => filter_var($this->input('is_published', false), FILTER_VALIDATE_BOOLEAN),
            'is_featured'   => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
            'is_contract'   => filter_var($this->input('is_contract', false), FILTER_VALIDATE_BOOLEAN),
            'is_full_time'  => filter_var($this->input('is_full_time', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
