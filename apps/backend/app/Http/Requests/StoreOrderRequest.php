<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
        $isManual = $this->input('payment_method') === 'manual';

        return [
            'shipping_name'    => ['required', 'string', 'max:255'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_city'    => ['required', 'string', 'max:100'],
            'shipping_state'   => ['nullable', 'string', 'max:100'],
            'shipping_zip'     => ['required', 'string', 'max:20'],
            'shipping_country' => ['required', 'string', 'max:100'],
            'payment_method'   => ['required', 'string', 'in:stripe,paypal,wallet,bank_transfer,manual'],
            'payment_token'    => ['nullable', 'string', 'max:255'],
            'proof_file'       => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
        ];
    }
}
