<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class JobApplicationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can submit a job application
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // The job ID is pulled from the route model binding parameter ('job')
        $jobId = $this->route('job')->id; 
        $userId = Auth::id();

        return [
            // Ensure the job_listing_id exists and matches the one in the route
            'job_listing_id' => ['required', 'exists:joblistings,id', Rule::in([$jobId])],
            
            // Cover letter is required for a complete application
            'cover_letter' => ['required', 'string', 'max:5000'],
            
            // Unique index validation: A user can only apply to a specific job once
            'user_id' => [
                'required', 
                'integer',
                Rule::unique('job_applications')->where(function ($query) use ($jobId, $userId) {
                    return $query->where('job_listing_id', $jobId)->where('user_id', $userId);
                }),
            ],
        ];
    }
    
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Inject the authenticated user's ID and the job ID into the request data
        $this->merge([
            'user_id' => Auth::id(),
            'job_listing_id' => $this->route('job')->id,
        ]);
    }
    
    /**
     * Custom error messages for the validation rules.
     */
    public function messages(): array
    {
        return [
            'user_id.unique' => 'You have already submitted an application for this job.',
        ];
    }
}
