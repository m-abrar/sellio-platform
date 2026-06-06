<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ProcessPaymentRequest
 * Validates the transactional data required for processing payment gateway interactions,
 * ensuring PCI-compliant formatting and integrity of card-based input.
 */
class ProcessPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Sanitize input data before validation, purging card number formatting noise.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'card_number' => str_replace([' ', '-', '_'], '', (string) $this->card_number),
            'payment_method' => $this->payment_method ?: 'stripe',
        ]);
    }

    /**
     * Define the granular validation protocols for payment processing.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:stripe'],
            'payment_token'  => ['nullable', 'string', 'max:255'],
            'stripeToken'    => ['nullable', 'string', 'max:255'],
            'card_number'    => ['required_without_all:payment_token,stripeToken', 'numeric', 'digits_between:14,19'],
            'name_on_card'   => ['required_without_all:payment_token,stripeToken', 'string', 'max:255'],
            'mm_yy'          => ['required_without_all:payment_token,stripeToken', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvc'            => ['required_without_all:payment_token,stripeToken', 'numeric', 'digits_between:3,4'],
            'termsCheck'     => ['accepted'],
        ];
    }
}
