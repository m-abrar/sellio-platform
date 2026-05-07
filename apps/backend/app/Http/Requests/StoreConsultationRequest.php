<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreConsultationRequest
 * Validates the metadata for professional consultation inquiries, ensuring 
 * participant contact integrity and thematic alignment for service discovery.
 */
class StoreConsultationRequest extends FormRequest
{
    /**
     * Determine if the user is authenticated to request professional consultations.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Define the validation constraints for high-fidelity consultation capture.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'  => 'required|string|min:5',
            'email'  => 'required|email',
            'phone' => ['required', 'string', 'regex:/^([0-9\s\-\+\(\)\.]*)$/', 'min:10'],
            'topic'  => 'required|string',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
