<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class AdvertisementRequest
 * Manages the administrative validation protocols for platform-wide advertisements,
 * coordinating geo-spatial targeting, orientation mapping, and status lifecycle.
 */
class AdvertisementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'          => ['required', 'string', 'max:255'],
            'radius'         => ['required', 'numeric', 'min:1', 'max:1000'],
            'latitude'       => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'      => ['nullable', 'numeric', 'between:-180,180'],
            'link'           => ['nullable', 'url'],
            'orientations'   => ['nullable', 'array'],
            'orientations.*' => ['string', 'in:homepage-a,homepage-b,homepage-c,homepage-d,homepage-e,homepage-f,sidebar,searchpage,blogs,videos,header,footer'],
            'cities'         => ['nullable', 'array'],
            'cities.*'       => ['string'],
            'zipcodes'       => ['nullable', 'array'],
            'zipcodes.*'     => ['string'],
            'regions'        => ['nullable', 'array'],
            'regions.*'      => ['string'],
            'status'         => ['nullable', 'boolean'],
        ];
    }
}
