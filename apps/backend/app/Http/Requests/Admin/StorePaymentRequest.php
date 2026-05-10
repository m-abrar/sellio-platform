<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'user_id'        => ['required', 'exists:users,id'],
            'payable_id'     => ['required', 'integer'],
            'payable_type'   => ['required', 'string', 'in:App\Models\Subscription,App\Models\Order,App\Models\PropertyBooking,App\Models\EventBooking'],
            'amount'         => ['required', 'numeric', 'min:0'],
            'currency'       => ['required', 'string', 'size:3'],
            'payment_method' => ['required', 'string', 'max:255'],
            'status'         => ['required', 'string', 'in:pending,completed,failed,refunded'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'paid_at'        => ['nullable', 'date'],
        ];
    }
}
