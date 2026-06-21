<?php

namespace App\Http\Requests\Dashboard\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FavoriteBatchStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $verticals = [
            'products',
            'properties',
            'autos',
            'events',
            'jobs',
            'services',
            'classifieds',
        ];

        return [
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.vertical' => ['required', 'string', Rule::in($verticals)],
            'items.*.listing_id' => ['required', 'integer', 'min:1'],
        ];
    }
}
