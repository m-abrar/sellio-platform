<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // If updating, verify the user owns the service
        $service = $this->route('service');
        if ($service) {
            $serviceId = $service instanceof \App\Models\Service ? $service->id : $service;
            return \App\Models\Service::where('id', $serviceId)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return true;
    }

    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'category_id'         => ['required', 'exists:categories,id'],
            'location_id'         => ['nullable', 'exists:locations,id'],
            'name'                => ['required', 'string', 'max:150', Rule::unique('services')->ignore($serviceId)],
            'slug'                => ['nullable', 'string', 'max:150', 'alpha_dash', Rule::unique('services')->ignore($serviceId)],
            'description'         => ['required', 'string'],
            'base_price'          => ['required', 'numeric', 'min:0'],
            'sale_price'          => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_subscription'     => ['boolean'],
            'is_project_based'    => ['boolean'],
            'min_contract_months' => ['nullable', 'integer', 'min:0'],
            'max_client_slots'    => ['nullable', 'integer', 'min:0'],
            'service_radius'      => ['nullable', 'numeric', 'min:0'],
            'expertise_level'     => ['required', 'integer', 'min:1', 'max:5'],
            'is_published'        => ['boolean'],
            // ... add address/geo fields as needed
        ];
    }
}
