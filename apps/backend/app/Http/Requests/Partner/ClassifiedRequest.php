<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ClassifiedRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $classified = $this->route('classified');
        if ($classified) {
            $classifiedId = $classified instanceof \App\Models\Classified ? $classified->id : $classified;

            return \App\Models\Classified::where('id', $classifiedId)
                ->where('user_id', Auth::id())
                ->exists();
        }

        return true;
    }

    public function rules(): array
    {
        $classified = $this->route('classified');
        $classifiedId = $classified instanceof \App\Models\Classified ? $classified->id : $classified;

        return [
            'category_id'    => ['required', 'exists:categories,id'],
            'type_id'        => ['nullable', 'exists:types,id'],
            'brand_id'       => ['nullable', 'exists:brands,id'],
            'location_id'    => ['nullable', 'exists:locations,id'],
            'title'          => ['required', 'string', 'max:255', Rule::unique('classified_ads', 'title')->ignore($classifiedId)],
            'slug'           => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('classified_ads', 'slug')->ignore($classifiedId)],
            'description'    => ['required', 'string'],
            'base_price'     => ['required', 'numeric', 'min:0'],
            'sale_price'     => ['nullable', 'numeric', 'min:0', 'lt:base_price'],
            'is_for_rent'    => ['boolean'],
            'is_for_sale'    => ['boolean'],
            'item_condition' => ['nullable', 'integer', 'min:1', 'max:10'],
            'item_year_age'  => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'item_quantity'  => ['nullable', 'integer', 'min:1'],
            'item_dimensions'=> ['nullable', 'numeric', 'min:0'],
            'warranty_months'=> ['nullable', 'integer', 'min:0'],
            'min_ad_duration'=> ['nullable', 'integer', 'min:1'],
            'city'           => ['nullable', 'string', 'max:100'],
            'state'          => ['nullable', 'string', 'max:100'],
            'country'        => ['nullable', 'string', 'max:100'],
            'address'        => ['nullable', 'string', 'max:255'],
            'zip_code'       => ['nullable', 'string', 'max:20'],
            'latitude'       => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'      => ['nullable', 'numeric', 'between:-180,180'],
            'meta_title'     => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'is_published'   => ['boolean'],
            'is_featured'    => ['boolean'],
            'main_image'     => ['nullable', 'image', 'max:5120'],
            'gallery.*'      => ['nullable', 'image', 'max:5120'],
            'existing_main_media_id' => ['nullable', 'integer'],
            'existing_media_ids' => ['array'],
            'existing_media_ids.*' => ['integer'],
            'sync_existing_media' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_for_rent'  => filter_var($this->input('is_for_rent', false), FILTER_VALIDATE_BOOLEAN),
            'is_for_sale'  => filter_var($this->input('is_for_sale', true), FILTER_VALIDATE_BOOLEAN),
            'is_published' => filter_var($this->input('is_published', false), FILTER_VALIDATE_BOOLEAN),
            'is_featured'  => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
