<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'booking_date'       => 'required|date|after:today',
            'time_slot'          => 'required|string|regex:/^[0-9]{2}:[0-9]{2}$/',
            'notes'              => 'nullable|string|max:500',
            'service_package_id' => 'required|exists:service_packages,id',
            'service_id'         => 'required|exists:services,id',
        ];
    }

    public function messages(): array
    {
        return [
            'time_slot.required' => 'Please select an available time for your session.',
            'service_package_id.required' => 'Please select a service package to continue.',
        ];
    }
}
