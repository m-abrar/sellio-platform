<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole(['admin', 'super-admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'event_id'    => ['required', 'exists:events,id'],
            'user_id'     => ['required', 'exists:users,id'],
            'quantity'    => ['required', 'integer', 'min:1'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'status'      => ['required', 'string', 'max:255', 'in:pending,confirmed,cancelled,completed'],
            'admin_note'  => ['nullable', 'string'],
        ];
    }
}
