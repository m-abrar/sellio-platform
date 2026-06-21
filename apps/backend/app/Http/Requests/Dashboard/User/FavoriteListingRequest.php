<?php

namespace App\Http\Requests\Dashboard\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FavoriteListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'vertical' => [
                'required',
                'string',
                Rule::in([
                    'products',
                    'properties',
                    'autos',
                    'events',
                    'jobs',
                    'services',
                    'classifieds',
                ]),
            ],
            'listing_id' => ['required', 'integer', 'min:1'],
        ];
    }
}
