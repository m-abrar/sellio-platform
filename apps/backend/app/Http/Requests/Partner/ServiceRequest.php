<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

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
        $service = $this->route('service');
        $serviceId = $service instanceof \App\Models\Service ? $service->id : $service;

        return [
            'category_id'          => ['required', 'exists:categories,id'],
            'brand_id'             => ['nullable', 'exists:brands,id'],
            'location_id'          => ['nullable', 'exists:locations,id'],
            'type_id'              => ['nullable', 'exists:types,id'],
            'title'                => ['required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('services')->ignore($serviceId)],
            'description'          => ['required', 'string'],
            'base_price'           => ['required', 'numeric', 'min:0'],
            'sale_price'           => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'operating_hours'      => ['nullable', 'string', 'max:100'],
            'operating_days_label' => ['nullable', 'string', 'max:100'],
            'licenses_certs'       => ['nullable', 'string', 'max:255'],
            'is_subscription'      => ['boolean'],
            'is_project_based'       => ['boolean'],
            'min_contract_months'  => ['nullable', 'integer', 'min:0'],
            'max_client_slots'     => ['nullable', 'integer', 'min:0'],
            'service_radius'       => ['nullable', 'numeric', 'min:0'],
            'expertise_level'      => ['nullable', 'integer', 'min:1', 'max:5'],
            'availability_schedule'=> ['nullable', 'integer', 'min:1', 'max:5'],
            'is_published'         => ['boolean'],
            'is_featured'          => ['boolean'],
            'address'              => ['nullable', 'string', 'max:255'],
            'city'                 => ['nullable', 'string', 'max:100'],
            'state'                => ['nullable', 'string', 'max:100'],
            'country'              => ['nullable', 'string', 'max:100'],
            'zip_code'             => ['nullable', 'string', 'max:20'],
            'latitude'             => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'            => ['nullable', 'numeric', 'between:-180,180'],
            'meta_title'           => ['nullable', 'string', 'max:255'],
            'meta_description'     => ['nullable', 'string'],
            'main_image'           => ['nullable', 'image', 'max:5120'],
            'gallery.*'            => ['nullable', 'image', 'max:5120'],
            'existing_main_media_id' => ['nullable', 'integer'],
            'existing_media_ids'   => ['array'],
            'existing_media_ids.*' => ['integer'],
            'sync_existing_media'  => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && !$this->filled('title')) {
            $this->merge(['title' => $this->input('name')]);
        }

        $this->merge([
            'is_subscription'   => filter_var($this->input('is_subscription', false), FILTER_VALIDATE_BOOLEAN),
            'is_project_based'  => filter_var($this->input('is_project_based', false), FILTER_VALIDATE_BOOLEAN),
            'is_published'      => filter_var($this->input('is_published', false), FILTER_VALIDATE_BOOLEAN),
            'is_featured'       => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
