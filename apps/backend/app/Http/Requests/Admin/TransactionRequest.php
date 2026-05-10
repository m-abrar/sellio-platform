<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('super-admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount'           => 'required|numeric',
            'payment_method'   => 'nullable|string|max:100',
            'reference_number' => 'nullable|string|max:255',
            'status'           => 'required|in:pending,completed,failed,cancelled',
            'notes'            => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'media'            => 'nullable|array',
            'media.*'          => 'file|image|max:5120',
        ];
    }
}
