<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'card_number'    => str_replace([' ', '-', '_'], '', (string) $this->card_number),
            'payment_method' => $this->payment_method ?: 'stripe',
        ]);
    }

    public function rules(): array
    {
        $isManual  = $this->payment_method === 'manual';
        $hasToken  = filled($this->payment_token) || filled($this->stripeToken);
        $needsCard = !$isManual && !$hasToken;

        return [
            'payment_method' => ['required', 'string', 'in:stripe,manual'],
            'payment_token'  => ['nullable', 'string', 'max:255'],
            'stripeToken'    => ['nullable', 'string', 'max:255'],
            'card_number'    => $needsCard ? ['required', 'numeric', 'digits_between:14,19'] : ['nullable'],
            'name_on_card'   => $needsCard ? ['required', 'string', 'max:255'] : ['nullable'],
            'mm_yy'          => $needsCard ? ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'] : ['nullable'],
            'cvc'            => $needsCard ? ['required', 'numeric', 'digits_between:3,4'] : ['nullable'],
            'proof_file'     => $isManual ? ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'] : ['nullable'],
            'termsCheck'     => ['accepted'],
        ];
    }
}
