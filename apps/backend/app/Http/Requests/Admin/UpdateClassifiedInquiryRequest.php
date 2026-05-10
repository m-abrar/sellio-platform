<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassifiedInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->hasRole('admin') || auth()->user()->hasRole('super-admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'classified_id' => 'required|exists:classifieds,id',
            'user_id'       => 'required|exists:users,id',
            'status'        => 'required|string|in:pending,responded,closed,cancelled',
            'message'       => 'nullable|string|max:5000',
        ];
    }
}
