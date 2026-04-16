<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConsultationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

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
