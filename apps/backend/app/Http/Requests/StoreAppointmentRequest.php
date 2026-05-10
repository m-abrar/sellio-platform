<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreAppointmentRequest
 * Manages the validation protocols for service-based appointments, coordinating
 * temporal constraints, package selections, and service-specific inquiry metadata.
 */
class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authenticated to initiate a service appointment.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Define the granular validation rules for appointment scheduling.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'booking_date'       => 'required|date|after:today',
            'time_slot'          => 'required|string|regex:/^[0-9]{2}:[0-9]{2}$/',
            'notes'              => 'nullable|string|max:500',
            'service_package_id' => [
                'required', 
                \Illuminate\Validation\Rule::exists('service_packages', 'id')->where(function ($query) {
                    $query->where('service_id', $this->service_id);
                }),
            ],
            'service_id'         => ['required', 'exists:services,id'],
        ];
    }

    /**
     * Define custom error messages for service-related validation failures.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'time_slot.required' => 'Please select an available time for your session.',
            'service_package_id.required' => 'Please select a service package to continue.',
        ];
    }
}
